"""
- FastAPI + Auth NextAuth (Bearer JWT HS256 via NEXTAUTH_SECRET)
- Multi-tenant por `X-Tenant: <slug>` ou `?tenant=<slug>`
- Postgres/Neon (SQLAlchemy async + asyncpg)
- ML por tenant:
  - /ml/train                   → treino via JSON
  - /ml/train/import            → treino via CSV ou JSONL (upload)
  - /ml/predict                 → predição unitária
  - /ml/predict/batch           → predição em lote
  - /ml/model                   → info do modelo atual
- Utilidades:
  - /healthz
  - /dev/ensure-tenant
"""

from __future__ import annotations
import io, os, unicodedata, json, csv
from datetime import datetime, timezone
from typing import Annotated, Dict, List, Optional

from fastapi import FastAPI, Depends, HTTPException, Header, Query, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from jose import jwt, JWTError
from dotenv import load_dotenv

from sqlalchemy import String, DateTime, ForeignKey, select, LargeBinary
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

# ML
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.linear_model import LogisticRegression
import joblib

# ---------- Config ----------
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@127.0.0.1:5432/reco_dev")
NEXTAUTH_SECRET = os.getenv("NEXTAUTH_SECRET", "dev-secret")
APP_DEBUG = os.getenv("APP_DEBUG", "false").lower() == "true"

engine = create_async_engine(DATABASE_URL, echo=APP_DEBUG, pool_pre_ping=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

# ---------- DB Base ----------
class Base(DeclarativeBase):
    pass

# Tenant table already exists from Prisma (uses camelCase)
class Tenant(Base):
    __tablename__ = "tenants"
    id: Mapped[str] = mapped_column(String(30), primary_key=True)
    domain: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    # No created_at/updated_at - Prisma uses createdAt/updatedAt but we don't need them

# MlModel table will be created by SQLAlchemy (uses snake_case)
class MlModel(Base):
    __tablename__ = "ml_models"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    tenant_id: Mapped[str] = mapped_column(String(30), ForeignKey("tenants.id", ondelete="CASCADE"), index=True)
    classes_json: Mapped[List[str]] = mapped_column(JSONB, default=list)
    feature_cols_json: Mapped[List[str]] = mapped_column(JSONB, default=list)
    model_blob: Mapped[bytes] = mapped_column(LargeBinary)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

# ---------- Schemas ----------
DEFAULT_SERVICES = ["LICENCIAMENTO", "VISTORIA", "TRANSFERENCIA", "DESBLOQUEIOS"]

class TenantCreate(BaseModel):
    domain: str = Field(min_length=2, max_length=64)
    name: str = Field(min_length=2, max_length=120)

class ClientInfo(BaseModel):
    tipo_cliente: str
    total_servicos_cliente: int
    valor_total_gasto: float
    dias_desde_ultimo_servico: int
    servicos_unicos_utilizados: int

class VehicleInfo(BaseModel):
    idade_veiculo: int

class OfferExample(BaseModel):
    client_info: ClientInfo
    vehicle_info: VehicleInfo
    history_counts: Dict[str, int]
    target_service: str

class TrainRequest(BaseModel):
    examples: List[OfferExample]

class PredictRequest(BaseModel):
    client_info: ClientInfo
    vehicle_info: VehicleInfo
    history_counts: Dict[str, int]

class PredictResponse(BaseModel):
    probabilities: Dict[str, float]
    top_service: str
    confidence: float
    model_available: bool

# batch
class BatchPredictRequest(BaseModel):
    items: List[PredictRequest]

class BatchPredictItemOut(BaseModel):
    probabilities: Dict[str, float]
    top_service: str
    confidence: float

class BatchPredictResponse(BaseModel):
    model_available: bool
    results: List[BatchPredictItemOut]

# ---------- Helpers ----------
async def get_db() -> AsyncSession:
    async with SessionLocal() as s:
        yield s

def normalize_key(s: str) -> str:
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode("ascii")
    return s.upper().strip().replace(" ", "_")

async def get_tenant_id(
    x_tenant: Annotated[Optional[str], Header(alias="X-Tenant", convert_underscores=False)] = None,
    tenant_q: Optional[str] = Query(default=None, alias="tenant"),
    db: Annotated[AsyncSession, Depends(get_db)] = None
) -> str:
    domain = x_tenant or tenant_q
    if not domain:
        raise HTTPException(status_code=400, detail="Tenant não informado (X-Tenant ou ?tenant=)")
    row = (await db.execute(select(Tenant).where(Tenant.domain == domain))).scalar_one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="Tenant não encontrado")
    return row.id

class AuthedUser(BaseModel):
    sub: str

async def get_current_user(authorization: Annotated[Optional[str], Header(alias="Authorization")] = None) -> AuthedUser:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, NEXTAUTH_SECRET, algorithms=["HS256"])
        return AuthedUser(sub=str(payload.get("sub", "unknown")))
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")

async def load_latest_model(db: AsyncSession, tenant_id: str) -> Optional[MlModel]:
    stmt = select(MlModel).where(MlModel.tenant_id == tenant_id).order_by(MlModel.id.desc()).limit(1)
    return (await db.execute(stmt)).scalar_one_or_none()

def build_hist_keys(history_counts: Dict[str, int]) -> List[str]:
    keys = set(DEFAULT_SERVICES)
    keys.update(normalize_key(k) for k in (history_counts or {}).keys())
    return sorted(keys)

def featurize(client: ClientInfo, vehicle: VehicleInfo, hist: Dict[str, int], hist_keys: List[str]) -> Dict[str, float|int|str]:
    row = {
        "tipo_cliente": client.tipo_cliente,
        "total_servicos_cliente": client.total_servicos_cliente,
        "valor_total_gasto": client.valor_total_gasto,
        "dias_desde_ultimo_servico": client.dias_desde_ultimo_servico,
        "servicos_unicos_utilizados": client.servicos_unicos_utilizados,
        "idade_veiculo": vehicle.idade_veiculo,
    }
    hn = {normalize_key(k): int(v) for k, v in (hist or {}).items()}
    for k in hist_keys:
        row[f"hist_{k}"] = hn.get(k, 0)
    row["hist_total"] = sum(hn.values())
    return row

# helper para treinar a partir de linhas pré-featurizadas
async def _train_from_rows(db: AsyncSession, tenant_id: str, rows: list[dict], targets: list[str]):
    if not rows or not targets:
        raise HTTPException(status_code=400, detail="Dataset vazio")
    X = pd.DataFrame(rows)
    y = [normalize_key(t) for t in targets]
    pre = ColumnTransformer([("cat", OneHotEncoder(handle_unknown="ignore"), ["tipo_cliente"])], remainder="passthrough")
    pipe = Pipeline([("pre", pre), ("clf", LogisticRegression(max_iter=1000, multi_class="multinomial"))])
    pipe.fit(X, y)
    buf = io.BytesIO(); joblib.dump(pipe, buf)
    model = MlModel(tenant_id=tenant_id, classes_json=sorted(list(set(y))), feature_cols_json=list(X.columns), model_blob=buf.getvalue())
    db.add(model); await db.commit(); await db.refresh(model)
    return {"ok": True, "tenant_id": tenant_id, "model_id": model.id, "classes": model.classes_json}

# ---------- App ----------
app = FastAPI(title="Lazuli Reco (extended)", version="1.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/healthz")
async def healthz():
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}

# --- Seed/tenant util ---
@app.post("/dev/ensure-tenant")
async def ensure_tenant(body: TenantCreate, db: Annotated[AsyncSession, Depends(get_db)]):
    row = (await db.execute(select(Tenant).where(Tenant.domain == body.domain))).scalar_one_or_none()
    if row:
        return {"status": "exists", "tenant_id": row.id}
    t = Tenant(domain=body.domain, name=body.name)
    db.add(t); await db.commit(); await db.refresh(t)
    return {"status": "created", "tenant_id": t.id}

# --- ML: train (JSON) ---
@app.post("/ml/train")
async def ml_train(
    payload: TrainRequest,
    tenant_id: Annotated[int, Depends(get_tenant_id)],
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[AuthedUser, Depends(get_current_user)]
):
    if not payload.examples:
        raise HTTPException(status_code=400, detail="Nenhum exemplo fornecido")
    seen = set(DEFAULT_SERVICES)
    for ex in payload.examples:
        seen.update(normalize_key(k) for k in (ex.history_counts or {}).keys())
    hist_keys = sorted(seen)
    rows = [featurize(ex.client_info, ex.vehicle_info, ex.history_counts, hist_keys) for ex in payload.examples]
    y = [normalize_key(ex.target_service) for ex in payload.examples]
    return await _train_from_rows(db, tenant_id, rows, y)

# --- ML: train via arquivo (CSV/JSONL) ---
@app.post("/ml/train/import")
async def ml_train_import(
    tenant_id: Annotated[int, Depends(get_tenant_id)],
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[AuthedUser, Depends(get_current_user)],
    file: UploadFile = File(...),
    fmt: str = "csv"  # "csv" ou "jsonl"
):
    content = await file.read()
    rows: list[dict] = []
    targets: list[str] = []

    if fmt.lower() == "csv":
        text = content.decode("utf-8-sig")
        reader = csv.DictReader(io.StringIO(text))
        for r in reader:
            target = r.get("target_service") or r.get("target")
            if not target:
                raise HTTPException(status_code=422, detail="Coluna 'target_service' ausente")

            hist = {k[5:]: int(float(r[k])) for k in r.keys() if k.startswith("hist_") and (r.get(k) not in (None, "", "NaN"))}
            client = {
                "tipo_cliente": r.get("tipo_cliente", "Cliente Final"),
                "total_servicos_cliente": int(float(r.get("total_servicos_cliente", 0) or 0)),
                "valor_total_gasto": float(r.get("valor_total_gasto", 0) or 0),
                "dias_desde_ultimo_servico": int(float(r.get("dias_desde_ultimo_servico", 0) or 0)),
                "servicos_unicos_utilizados": int(float(r.get("servicos_unicos_utilizados", 0) or 0)),
            }
            vehicle = {"idade_veiculo": int(float(r.get("idade_veiculo", 0) or 0))}

            hist_keys = build_hist_keys(hist)
            feat = featurize(ClientInfo(**client), VehicleInfo(**vehicle), hist, hist_keys)
            rows.append(feat)
            targets.append(target)

    elif fmt.lower() == "jsonl":
        text = content.decode("utf-8")
        for line in text.splitlines():
            if not line.strip():
                continue
            obj = json.loads(line)
            ex = OfferExample(**obj)
            hist_keys = build_hist_keys(ex.history_counts)
            feat = featurize(ex.client_info, ex.vehicle_info, ex.history_counts, hist_keys)
            rows.append(feat)
            targets.append(ex.target_service)
    else:
        raise HTTPException(status_code=400, detail="fmt deve ser 'csv' ou 'jsonl'")

    return await _train_from_rows(db, tenant_id, rows, targets)

# --- ML: predict (unitário) ---
@app.post("/ml/predict", response_model=PredictResponse)
async def ml_predict(
    payload: PredictRequest,
    tenant_id: Annotated[int, Depends(get_tenant_id)],
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[AuthedUser, Depends(get_current_user)]
):
    model = await load_latest_model(db, tenant_id)
    hist_keys = build_hist_keys(payload.history_counts)
    row = featurize(payload.client_info, payload.vehicle_info, payload.history_counts, hist_keys)

    if not model:
        hn = {normalize_key(k): int(v) for k, v in (payload.history_counts or {}).items()}
        for k in DEFAULT_SERVICES:
            hn.setdefault(k, 0)
        total = sum(hn.values())
        if total <= 0:
            probs = {k: round(1/len(DEFAULT_SERVICES), 4) for k in DEFAULT_SERVICES}
        else:
            probs = {k: round(hn[k]/total, 4) for k in DEFAULT_SERVICES}
        top, conf = max(probs.items(), key=lambda kv: kv[1])
        return PredictResponse(probabilities=probs, top_service=top, confidence=conf, model_available=False)

    pipe: Pipeline = joblib.load(io.BytesIO(model.model_blob))
    cols = model.feature_cols_json
    for c in cols:
        if c not in row:
            row[c] = 0
    X = pd.DataFrame([row], columns=cols)
    proba = pipe.predict_proba(X)[0]
    classes = list(pipe.named_steps["clf"].classes_)
    probs = {str(c): float(p) for c, p in zip(classes, proba)}
    for k in DEFAULT_SERVICES:
        probs.setdefault(k, 0.0)
    s = sum(probs.values()) or 1.0
    probs = {k: round(v/s, 4) for k, v in probs.items()}
    top, conf = max(probs.items(), key=lambda kv: kv[1])
    return PredictResponse(probabilities=probs, top_service=top, confidence=conf, model_available=True)

# --- ML: predict (lote) ---
@app.post("/ml/predict/batch", response_model=BatchPredictResponse)
async def ml_predict_batch(
    payload: BatchPredictRequest,
    tenant_id: Annotated[int, Depends(get_tenant_id)],
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[AuthedUser, Depends(get_current_user)]
):
    model = await load_latest_model(db, tenant_id)
    if not model:
        outs = []
        for item in payload.items:
            hn = {normalize_key(k): int(v) for k, v in (item.history_counts or {}).items()}
            for k in DEFAULT_SERVICES:
                hn.setdefault(k, 0)
            total = sum(hn.values())
            if total <= 0:
                probs = {k: round(1/len(DEFAULT_SERVICES), 4) for k in DEFAULT_SERVICES}
            else:
                probs = {k: round(hn[k]/total, 4) for k in DEFAULT_SERVICES}
            top, conf = max(probs.items(), key=lambda kv: kv[1])
            outs.append(BatchPredictItemOut(probabilities=probs, top_service=top, confidence=conf))
        return BatchPredictResponse(model_available=False, results=outs)

    pipe: Pipeline = joblib.load(io.BytesIO(model.model_blob))
    cols = model.feature_cols_json

    frames = []
    for item in payload.items:
        hist_keys = build_hist_keys(item.history_counts)
        row = featurize(item.client_info, item.vehicle_info, item.history_counts, hist_keys)
        for c in cols:
            if c not in row:
                row[c] = 0
        frames.append(row)

    X = pd.DataFrame(frames, columns=cols)
    probas = pipe.predict_proba(X)
    classes = list(pipe.named_steps["clf"].classes_)

    results = []
    for i in range(len(payload.items)):
        p = {str(c): float(probas[i, j]) for j, c in enumerate(classes)}
        for k in DEFAULT_SERVICES:
            p.setdefault(k, 0.0)
        s = sum(p.values()) or 1.0
        p = {k: round(v/s, 4) for k, v in p.items()}
        top, conf = max(p.items(), key=lambda kv: kv[1])
        results.append(BatchPredictItemOut(probabilities=p, top_service=top, confidence=conf))

    return BatchPredictResponse(model_available=True, results=results)

# --- ML: info do modelo ---
@app.get("/ml/model")
async def ml_model_info(
    tenant_id: Annotated[int, Depends(get_tenant_id)],
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[AuthedUser, Depends(get_current_user)]
):
    model = await load_latest_model(db, tenant_id)
    if not model:
        return {"model_available": False}
    return {
        "model_available": True,
        "model_id": model.id,
        "classes": model.classes_json,
        "feature_cols": model.feature_cols_json,
        "updated_at": model.updated_at.isoformat() if model.updated_at else None
    }

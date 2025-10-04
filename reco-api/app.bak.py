"""
API mínima (tudo-em-um) para o Lazuli ERP
----------------------------------------
✅ Requisitos:
- FastAPI com autenticação NextAuth (Bearer JWT, HS256 via NEXTAUTH_SECRET)
- Multi-tenant por `X-Tenant: <slug>` ou `?tenant=<slug>`
- Postgres/Neon (SQLAlchemy async + asyncpg)
- ML por tenant: `/ml/train` e `/ml/predict`
- Healthcheck `/healthz` e `/dev/ensure-tenant`
"""

import io, os, unicodedata
from datetime import datetime, timezone
from typing import Annotated, Dict, List, Optional

from fastapi import FastAPI, Depends, HTTPException, Header, Query, status
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
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/reco_dev"
)
NEXTAUTH_SECRET = os.getenv("NEXTAUTH_SECRET", "dev-secret")
APP_DEBUG = os.getenv("APP_DEBUG", "false").lower() == "true"

engine = create_async_engine(DATABASE_URL, echo=APP_DEBUG, pool_pre_ping=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

# ---------- DB Base ----------
class Base(DeclarativeBase):
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

class Tenant(Base):
    __tablename__ = "tenants"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120))

class MlModel(Base):
    __tablename__ = "ml_models"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    tenant_id: Mapped[int] = mapped_column(ForeignKey("tenants.id", ondelete="CASCADE"), index=True)
    classes_json: Mapped[List[str]] = mapped_column(JSONB, default=list)
    feature_cols_json: Mapped[List[str]] = mapped_column(JSONB, default=list)
    model_blob: Mapped[bytes] = mapped_column(LargeBinary)

# ---------- Schemas ----------
DEFAULT_SERVICES = ["LICENCIAMENTO", "VISTORIA", "TRANSFERENCIA", "DESBLOQUEIOS"]

class TenantCreate(BaseModel):
    slug: str = Field(min_length=2, max_length=64)
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
) -> int:
    slug = x_tenant or tenant_q
    if not slug:
        raise HTTPException(status_code=400, detail="Tenant não informado (X-Tenant ou ?tenant=)")
    row = (await db.execute(select(Tenant).where(Tenant.slug == slug))).scalar_one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="Tenant não encontrado")
    return row.id

class AuthedUser(BaseModel):
    sub: str

async def get_current_user(
    authorization: Annotated[Optional[str], Header(alias="Authorization")] = None
) -> AuthedUser:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, NEXTAUTH_SECRET, algorithms=["HS256"])
        return AuthedUser(sub=str(payload.get("sub", "unknown")))
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")

async def load_latest_model(db: AsyncSession, tenant_id: int) -> Optional[MlModel]:
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

# ---------- App ----------
app = FastAPI(title="Lazuli Reco (simple)", version="1.0.0")
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
    row = (await db.execute(select(Tenant).where(Tenant.slug == body.slug))).scalar_one_or_none()
    if row:
        return {"status": "exists", "tenant_id": row.id}
    t = Tenant(slug=body.slug, name=body.name)
    db.add(t); await db.commit(); await db.refresh(t)
    return {"status": "created", "tenant_id": t.id}

# --- ML: train ---
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
    X = pd.DataFrame(rows)
    y = [normalize_key(ex.target_service) for ex in payload.examples]

    pre = ColumnTransformer([("cat", OneHotEncoder(handle_unknown="ignore"), ["tipo_cliente"])], remainder="passthrough")
    pipe = Pipeline([("pre", pre), ("clf", LogisticRegression(max_iter=1000, multi_class="multinomial"))])
    pipe.fit(X, y)

    buf = io.BytesIO(); joblib.dump(pipe, buf)
    model = MlModel(
        tenant_id=tenant_id,
        classes_json=sorted(list(set(y))),
        feature_cols_json=list(X.columns),
        model_blob=buf.getvalue()
    )
    db.add(model); await db.commit(); await db.refresh(model)
    return {"ok": True, "tenant_id": tenant_id, "model_id": model.id, "classes": model.classes_json}

# --- ML: predict ---
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
    s = sum(probs.values())
    probs = {k: round((v/s) if s else 0.0, 4) for k, v in probs.items()}
    top, conf = max(probs.items(), key=lambda kv: kv[1])
    return PredictResponse(probabilities=probs, top_service=top, confidence=conf, model_available=True)

import argparse, unicodedata, csv
import pandas as pd
from pathlib import Path

def norm_text(s: str) -> str:
    if s is None: return ""
    s = str(s)
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")
    s = s.strip().upper().replace(" ", "_")
    return s

def to_int(x):
    try:
        if pd.isna(x) or x == "": return 0
        return int(float(str(x).replace(",", ".")))
    except Exception:
        return 0

def to_float(x):
    try:
        if pd.isna(x) or x == "": return 0.0
        return float(str(x).replace(",", "."))
    except Exception:
        return 0.0

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="inp", required=True)
    ap.add_argument("--out", dest="outp", default="dataset.csv")
    ap.add_argument("--mode", choices=["positives","all"], default="positives")
    args = ap.parse_args()

    df = pd.read_csv(Path(args.inp), dtype=str)
    df.columns = [norm_text(c) for c in df.columns]

    # obrigatórias
    req = ["TIPO_CLIENTE","TOTAL_SERVICOS_CLIENTE","VALOR_TOTAL_GASTO",
           "DIAS_DESDE_ULTIMO_SERVICO","SERVICOS_UNICOS_UTILIZADOS","IDADE_VEICULO"]
    miss = [c for c in req if c not in df.columns]
    if miss:
        raise SystemExit(f"Colunas obrigatorias ausentes: {miss}")

    # numéricos
    df["TOTAL_SERVICOS_CLIENTE"] = df["TOTAL_SERVICOS_CLIENTE"].apply(to_int)
    df["VALOR_TOTAL_GASTO"] = df["VALOR_TOTAL_GASTO"].apply(to_float)
    df["DIAS_DESDE_ULTIMO_SERVICO"] = df["DIAS_DESDE_ULTIMO_SERVICO"].apply(to_int)
    df["SERVICOS_UNICOS_UTILIZADOS"] = df["SERVICOS_UNICOS_UTILIZADOS"].apply(to_int)
    df["IDADE_VEICULO"] = df["IDADE_VEICULO"].apply(to_int)

    # COUNT_* -> HIST_*
    for c in list(df.columns):
        if c.startswith("COUNT_"):
            suffix = norm_text(c[len("COUNT_"):])
            df[f"HIST_{suffix}"] = df[c].apply(to_int)

    for h in ["HIST_LICENCIAMENTO","HIST_VISTORIA","HIST_TRANSFERENCIA","HIST_DESBLOQUEIOS"]:
        if h not in df.columns: df[h] = 0

    # target_service a partir de SERVICO_OFERTADO + ACEITOU
    if "SERVICO_OFERTADO" in df.columns and "ACEITOU" in df.columns:
        df["_SVC"] = df["SERVICO_OFERTADO"].apply(norm_text)
        df["_OK"]  = df["ACEITOU"].apply(to_int)
        if args.mode == "positives":
            df = df[df["_OK"] == 1].copy()
            df["TARGET_SERVICE"] = df["_SVC"]
        else:
            df["TARGET_SERVICE"] = df.apply(lambda r: r["_SVC"] if r["_OK"]==1 else "", axis=1)
    elif "TARGET_SERVICE" not in df.columns:
        raise SystemExit("Faltam SERVICO_OFERTADO/ACEITOU ou TARGET_SERVICE no CSV.")

    out_cols = [
        "TIPO_CLIENTE","TOTAL_SERVICOS_CLIENTE","VALOR_TOTAL_GASTO",
        "DIAS_DESDE_ULTIMO_SERVICO","SERVICOS_UNICOS_UTILIZADOS","IDADE_VEICULO"
    ] + [c for c in df.columns if c.startswith("HIST_")] + ["TARGET_SERVICE"]

    df_out = df[out_cols].rename(columns={
        "TIPO_CLIENTE":"tipo_cliente",
        "TOTAL_SERVICOS_CLIENTE":"total_servicos_cliente",
        "VALOR_TOTAL_GASTO":"valor_total_gasto",
        "DIAS_DESDE_ULTIMO_SERVICO":"dias_desde_ultimo_servico",
        "SERVICOS_UNICOS_UTILIZADOS":"servicos_unicos_utilizados",
        "IDADE_VEICULO":"idade_veiculo",
        "TARGET_SERVICE":"target_service"
    })
    df_out.to_csv(Path(args.outp), index=False, quoting=csv.QUOTE_MINIMAL, encoding="utf-8")
    print(f"OK! Gerado: {args.outp} (linhas: {len(df_out)})")

if __name__ == "__main__":
    main()

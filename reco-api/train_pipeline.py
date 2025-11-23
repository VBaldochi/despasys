import subprocess
import requests
import os

BRUTO = "base_treinamento_despachante_v4_avancado.csv"
FINAL = "dataset.csv"
TOKEN = input("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhZG1pbkBkZW1vLmNvbSIsIm5hbWUiOiJBZG1pbiBEZXYifQ.B0gRcbFcTyiDwKpIN2AUJECyE_Hgg-2no17prqBtVi0\n> ")

# 1) Transforma CSV bruto em dataset para ML
print("\n>> TRANSFORMANDO BASE...")
subprocess.run(["python", "transform_csv.py", "--in", BRUTO, "--out", FINAL, "--mode", "positives"], check=True)

print("Transform finalizado. Gerado:", FINAL)

# 2) Enviar para API e treinar
print("\n>> ENVIANDO PARA TREINAMENTO...")

url = "http://127.0.0.1:8020/ml/train/import?tenant=demo&fmt=csv"

with open(FINAL, "rb") as f:
    r = requests.post(
        url,
        headers={"Authorization": f"Bearer {TOKEN}"},
        files={"file": ("dataset.csv", f, "text/csv")}
    )

print("\n>> RESPOSTA API:")
print(r.status_code)
print(r.text)

print("\nPRONTO. Modelo treinado com dataset atualizado!")

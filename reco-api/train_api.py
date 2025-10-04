import requests

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhZG1pbkBkZW1vLmNvbSIsIm5hbWUiOiJBZG1pbiBEZXYifQ.B0gRcbFcTyiDwKpIN2AUJECyE_Hgg-2no17prqBtVi0"
url = "http://127.0.0.1:8020/ml/train/import?tenant=demo&fmt=csv"

with open("dataset.csv", "rb") as f:
    files = {"file": ("dataset.csv", f, "text/csv")}
    headers = {"Authorization": f"Bearer {TOKEN}"}
    r = requests.post(url, headers=headers, files=files)

print(r.status_code, r.text)

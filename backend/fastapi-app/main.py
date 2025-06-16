from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import autocomplete_ws

app = FastAPI()

app.include_router(autocomplete_ws.router, prefix="/ws/autocomplete")

# ✅ CORS 설정: FastAPI 인스턴스 바로 아래에 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


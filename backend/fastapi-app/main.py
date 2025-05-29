from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import autocomplete

app = FastAPI()

app.include_router(autocomplete.router, prefix="/fast-api/autocomplete")

# ✅ CORS 설정: FastAPI 인스턴스 바로 아래에 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#test
@app.get("/")
def root():
    return {"message": "Hello from FastAPI!"}
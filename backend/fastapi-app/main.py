from fastapi import FastAPI
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from api import autocomplete_ws

app = FastAPI()

app.include_router(autocomplete_ws.router, prefix="/ws")
for route in app.router.routes:
    print("🧭", getattr(route, "path", None), getattr(route, "endpoint", None))

# 테스트용 루트 라우
@app.get("/")
async def root():
    print("✅ HTTP GET '/' 호출됨")
    return {"message": "Hello FastAPI"}

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

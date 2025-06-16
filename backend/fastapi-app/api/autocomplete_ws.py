from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.openai_service import stream_openai_response

router = APIRouter()

@router.websocket("/")
async def openai_autocomplete(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            text = await websocket.receive_text()
            prompt = f"다음 문장을 마크다운 형식으로 자연스럽게 이어써줘:\n{text}"

            try:
                async for chunk in stream_openai_response(prompt):
                    await websocket.send_text(chunk)
            except Exception as e:
                await websocket.send_text(f"[Error] {str(e)}")

    except WebSocketDisconnect:
        print("❌ WebSocket 연결 종료")

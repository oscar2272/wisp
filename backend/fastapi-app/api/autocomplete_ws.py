# routers/autocomplete.py

import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.autocomplete_service import stream_openai_response

router = APIRouter()

@router.websocket("/autocomplete")
async def openai_autocomplete(websocket: WebSocket):
    await websocket.accept()
    current_task = None

    try:
        while True:
            text = await websocket.receive_text()
            print("🔤 입력 받음:", text)

            # 이전 요청이 있으면 취소
            if current_task and not current_task.done():
                current_task.cancel()

            async def run_stream():
                try:
                    async for chunk in stream_openai_response(text):
                        await websocket.send_text(chunk)
                except asyncio.CancelledError:
                    print("🚫 이전 요청 취소됨")
                except Exception as e:
                    await websocket.send_text(f"[Error] {str(e)}")

            current_task = asyncio.create_task(run_stream())
    except WebSocketDisconnect:
        print("❌ WebSocket 연결 종료")
        if current_task:
            current_task.cancel()

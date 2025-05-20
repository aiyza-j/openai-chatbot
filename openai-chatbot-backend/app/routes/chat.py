from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from ..models.chat import ChatRequest
from ..services.openai_service import generate_streaming_response
import json

router = APIRouter()

@router.post("/chat")
async def chat(request: ChatRequest):

    async def stream_response():
        async for text_chunk in generate_streaming_response(
            [{"role": msg.role, "content": msg.content} for msg in request.messages]
        ):
            yield f"data: {json.dumps({'content': text_chunk})}\n\n"

    return StreamingResponse(
        stream_response(),
        media_type="text/event-stream"
    )

@router.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):

    await websocket.accept()

    try:
        while True:
            #from client
            data = await websocket.receive_text()
            request_data = json.loads(data)
            messages = request_data.get("messages", [])

            #give response to client
            async for text_chunk in generate_streaming_response(messages):
                await websocket.send_text(json.dumps({"content": text_chunk}))

    except WebSocketDisconnect:
        print("Client disconnected")
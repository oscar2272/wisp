# ✅ 신버전 방식 (openai>=1.0.0)
import os
from openai import AsyncOpenAI
from openai.types.chat import ChatCompletionChunk

client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])

async def stream_openai_response(prompt: str):
    stream = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "너는 마크다운 형식의 글을 자연스럽게 이어쓰는 도우미야."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        stream=True,
    )

    async for chunk in stream:
        if isinstance(chunk, ChatCompletionChunk):
            delta = chunk.choices[0].delta
            content = getattr(delta, "content", None)
            if content:
                yield content

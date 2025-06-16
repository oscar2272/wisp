import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

async def stream_openai_response(prompt: str):
    response = await openai.ChatCompletion.acreate(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "너는 마크다운 형식의 글을 자연스럽게 이어쓰는 도우미야."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        max_tokens=100,
        stream=True,
    )
    async for chunk in response:
        if "choices" in chunk and len(chunk["choices"]) > 0:
            delta = chunk["choices"][0]["delta"]
            if "content" in delta:
                yield delta["content"]

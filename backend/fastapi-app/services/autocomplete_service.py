# services/autocomplete_service.py

import requests, json

OLLAMA_URL = "http://host.docker.internal:11434/api/generate"
DEFAULT_MODEL = "devstral"


def generate_autocomplete(text: str) -> str:
    payload = {
        "model": "devstral",
        "prompt": text,
        "temperature": 0.7,
        "max_tokens": 100,
        "stream": False
    }

    response = requests.post(
        "http://host.docker.internal:11434/api/generate",
        json=payload,
        timeout=20
    )
    response.raise_for_status()

    # 👇 한 줄씩 읽고 response 부분만 추출
    lines = response.text.strip().split("\n")
    full_output = ""

    for line in lines:
        try:
            data = json.loads(line)
            full_output += data.get("response", "")
        except json.JSONDecodeError:
            continue

    return full_output.strip()


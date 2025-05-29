FROM python:3.11-slim

WORKDIR /fastapp
ENV PYTHONUNBUFFERED=1

COPY requirements.txt ./
COPY . .

RUN pip install --upgrade pip && pip install -r requirements.txt


CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
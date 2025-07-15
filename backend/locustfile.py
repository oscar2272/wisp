from locust import HttpUser, task, between
import random
import requests
from queue import Queue
from dotenv import load_dotenv
import os

load_dotenv()  # .env 파일 로드

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

USER_CREDENTIALS = Queue()
for i in range(1, 11):
    USER_CREDENTIALS.put({"email": f"test{i}@naver.com", "password": "rhdtkd002"})
class NoteUser(HttpUser):
    wait_time = between(1, 3)
    note_ids = []  # 테스트용 노트 ID 목록

    def on_start(self):
        if not USER_CREDENTIALS.empty():
            self.user = USER_CREDENTIALS.get()
        else:
            raise Exception("No more test users available")

        auth_response = requests.post(
            f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Content-Type": "application/json"
            },
            json={
                "email": self.user["email"],
                "password": self.user["password"]
            }
        )

        if auth_response.status_code == 200:
            self.token = auth_response.json().get("access_token")
        else:
            raise Exception(f"Failed to login as {self.user['email']} – {auth_response.text}")

        self.client.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

        data = {
            "file_name": f"LoadTest Note {random.randint(1000, 9999)}",
            "title": "LoadTest Note Title",
            "content": [
                {"type": "paragraph", "content": [{"type": "text", "text": "내용을 입력하세요."}]},
                {"type": "paragraph"}
            ]
        }
        response = self.client.post("/api/notes/note/", json=data)
        if response.status_code == 201:
            note = response.json()
            self.note_ids = [note["id"]]  # ✅ 확정적으로 1개라도 존재함
            self.created_note_id = note["id"]  # 삭제용으로 따로 저장
        else:
            raise Exception("노트 생성 실패")

    @task(1)
    def explore_notes(self):
        self.client.get("/api/notes/explore/")

    @task(1)
    def get_note_list(self):
        self.client.get("/api/notes/sidebar/")

    @task(2)
    def get_note_detail(self):
        if self.note_ids:
            note_id = random.choice(self.note_ids)
            self.client.get(f"/api/notes/{note_id}/")

    @task(1)
    def get_note_home(self):
        params = [
            {"type": "all", "sort": "recent"},
            {"type": "shared", "sort": "likes"},
            {"type": "public", "sort": "views"},
            {"type": "private", "sort": "comments"}
        ]
        param = random.choice(params)
        self.client.get("/api/notes/home/", params=param)

    @task(1)
    def create_note(self):
        data = {
            "file_name": f"Initial Note {random.randint(1, 1000)}",
            "title": f"Initial Title {random.randint(1, 1000)}",
            "content": [
                {"type": "paragraph", "content": [{"type": "text", "text": "내용을 입력하세요."}]},
                {"type": "paragraph"}
            ]
        }
        self.client.post("/api/notes/note/", json=data)

    @task(1)
    def update_note(self):
        if self.note_ids:
            note_id = random.choice(self.note_ids)
            data = {
                "file_name": f"Initial Note {random.randint(1, 1000)}",
                "title": f"Initial Title {random.randint(1, 1000)}",
                "content": [
                    {"type": "paragraph", "content": [{"type": "text", "text": "수정된 내용입니다."}]},
                    {"type": "paragraph"}
                ]
            }
            self.client.patch(f"/api/notes/{note_id}/edit/", json=data)
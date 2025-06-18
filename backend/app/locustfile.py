from locust import HttpUser, task, between
import os
import random


class NoteUser(HttpUser):
    wait_time = between(1, 3)
    note_ids = []  # 테스트용 노트 ID 목록

    #
    def on_start(self):
        self.token = os.getenv("SUPABASE_JWT")
        self.client.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        # 초기 노트 목록 가져오기
        response = self.client.get("/api/notes/sidebar/")
        if response.status_code == 200:
            data = response.json()
            self.note_ids = [item["id"] for item in data if "id" in item]

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
        # 다양한 쿼리 파라미터로 테스트
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
            "file_name": f"Test Note {random.randint(1, 1000)}",
            "title": f"Test Title {random.randint(1, 1000)}",
            "content": {
                "type": "doc",
                "content": [
                    {"type": "paragraph", "content": [{"type": "text", "text": "테스트 내용입니다."}]}
                ]
            }
        }
        self.client.post("/api/notes/note/", json=data)

    @task(1)
    def update_note(self):
        if self.note_ids:
            note_id = random.choice(self.note_ids)
            data = {
                "title": f"Updated Title {random.randint(1, 1000)}",
                "content": {
                    "type": "doc",
                    "content": [
                        {"type": "paragraph", "content": [{"type": "text", "text": "수정된 테스트 내용입니다."}]}
                    ]
                }
            }
            self.client.patch(f"/api/notes/{note_id}/edit/", json=data)


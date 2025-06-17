from locust import HttpUser, task, between
import random

class NoteUser(HttpUser):
    wait_time = between(1, 3)  # 각 요청 사이 대기 시간

    # 노트 리스트 탐색
    @task(4)
    def explore_notes(self):
        self.client.get("/api/notes/explore/")

    # 랜덤한 노트 상세 조회
    @task(3)
    def view_note_detail(self):
        note_id = random.randint(1, 10)  # 임의의 ID. 존재하는 ID 범위로 조정 필요
        self.client.get(f"/api/notes/{note_id}/")

    # 노트 수정 (PATCH)
    @task(2)
    def edit_note(self):
        note_id = random.randint(1, 5)  # 임의의 ID
        payload = {
            "title": "Locust Test",
            "content": "This is updated by Locust.",
        }
        self.client.patch(f"/api/notes/{note_id}/edit/", json=payload)

    # 폴더 생성 (POST)
    @task(1)
    def create_folder(self):
        payload = {
            "name": f"folder_{random.randint(1,100)}"
        }
        self.client.post("/api/notes/folder/", json=payload)

from locust import HttpUser, task, between

class NoteUser(HttpUser):
    wait_time = between(1, 3)  # 요청 간 시간 (초)

    @task
    def explore_notes(self):
        self.client.get("/api/notes/explore/")
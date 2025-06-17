from locust import HttpUser, task, between
import random
from django.conf import settings

class NoteUser(HttpUser):
    wait_time = between(1, 3)

    #
    def on_start(self):
        self.token = settings.SUPABASE_JWT_SECRET
        self.client.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

    @task(4)
    def explore_notes(self):
        self.client.get("/api/notes/explore/")

    @task(3)
    def view_note_detail(self):
        note_id = random.randint(1, 10)
        self.client.get(f"/api/notes/{note_id}/")

    @task(2)
    def edit_note(self):
        note_id = random.randint(1, 5)
        payload = {
            "title": "Locust Test",
            "content": "This is updated by Locust.",
        }
        self.client.patch(f"/api/notes/{note_id}/edit/", json=payload)

    @task(1)
    def create_folder(self):
        payload = {
            "name": f"folder_{random.randint(1,100)}"
        }
        self.client.post("/api/notes/folder/", json=payload)

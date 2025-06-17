from locust import HttpUser, task, between
import os


class NoteUser(HttpUser):
    wait_time = between(1, 3)

    #
    def on_start(self):
        self.token = os.getenv("SUPABASE_JWT")
        self.client.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }


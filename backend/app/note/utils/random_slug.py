import secrets

def generate_unique_slug():
    from ..models import Note
    while True:
        slug = secrets.token_urlsafe(8)[:12]
        if not Note.objects.filter(slug=slug).exists():
            return slug
import jwt
from django.conf import settings


def verify_supabase_jwt(token):
    try:
        decoded = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False}
        )
        return {
            "email": decoded.get("email"),
        }
    except jwt.PyJWTError as e:
        return None

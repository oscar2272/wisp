from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from core.utils.jwt import verify_supabase_jwt
from user.models import User, Profile
from core.utils.generate_name import generate_unique_username
from django.contrib.auth import get_user_model

class SupabaseJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION")
        if not auth_header:
            raise AuthenticationFailed("No auth header")

        token = auth_header.split(" ")[1] if " " in auth_header else auth_header
        user_info = verify_supabase_jwt(token)
        if not user_info:
            raise AuthenticationFailed("Invalid token")

        email = user_info["email"]

        try:
            user = get_user_model().objects.get(email=email)
        except get_user_model().DoesNotExist:
            user = None  # 존재하지 않는 유저일 경우 None 반환

        return (user, None)


from django.utils.deprecation import MiddlewareMixin
from core.utils.jwt import verify_supabase_jwt  # 직접 작성한 JWT 검증 함수
import hashlib
import random
from django.contrib.auth.models import AnonymousUser


def generate_unique_username():
    from user.models import User
    while True:
        username = hashlib.md5(str(random.random()).encode()).hexdigest()[:8]
        if not User.objects.filter(name=username).exists():
            return username


class SupabaseJWTMiddleware(MiddlewareMixin):

    def __init__(self, get_response):
        super().__init__(get_response)

    def process_request(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION")
        if not auth_header:
            request.user = AnonymousUser()
            return
        token = auth_header.split(" ")[1] if " " in auth_header else auth_header

        user_info = verify_supabase_jwt(token)
        if user_info:
            from user.models import User, Profile  # 순환 참조 방지
            email = user_info["email"]
            name = user_info.get("name", generate_unique_username())

            user, created = User.objects.get_or_create(email=email, defaults={"name": name})
            if created:
                Profile.objects.create(user=user)

            request.user = user
        else:
            request.user = AnonymousUser()

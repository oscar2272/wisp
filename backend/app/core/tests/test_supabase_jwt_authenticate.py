import jwt
import pytest
from django.conf import settings
from django.test import RequestFactory
from core.views import SupabaseJWTAuthentication
from django.contrib.auth import get_user_model


# 토큰 검증
@pytest.mark.django_db
def test_jwt_authentication():
    # 1. JWT 만들기
    settings.SUPABASE_JWT_SECRET = "test-secret"
    payload = {
        "email": "testuser@example.com",
    }
    token = jwt.encode(payload, settings.SUPABASE_JWT_SECRET, algorithm="HS256")

    # 2. 유저 생성 /
    user = get_user_model().objects.create(email="testuser@example.com")  # noqa: F841

    # 3. 가짜 요청 만들기 (Authorization 헤더 포함)
    factory = RequestFactory()
    request = factory.get("/", HTTP_AUTHORIZATION=f"Bearer {token}")

    # 4. 인증 실행 및 JWT DECODE
    auth = SupabaseJWTAuthentication()  # 인증 클래스 인스턴스 생성
    user_auth_tuple = auth.authenticate(request)  # email 꺼내고, decode하고, 사용자객체 반환

    # 5. 결과 검증
    assert user_auth_tuple is not None
    assert isinstance(user_auth_tuple[0], get_user_model())
    assert user_auth_tuple[1] is None

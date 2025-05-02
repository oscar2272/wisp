import jwt
import pytest
from django.conf import settings
from django.test import RequestFactory
from core.middleware.supabase_jwt import SupabaseJWTMiddleware
from django.contrib.auth import get_user_model
from user.models import Profile


# 토큰 유효한 경우 사용자 생성
@pytest.mark.django_db
def test_jwt_middleware_sets_request_user():
    # 1. JWT 만들기
    settings.SUPABASE_JWT_SECRET = "test-secret"
    payload = {
        "email": "testuser@example.com",
        "user_metadata": {"name": "테스트 유저"}
    }
    token = jwt.encode(payload, settings.SUPABASE_JWT_SECRET, algorithm="HS256")

    # 2. 가짜 요청 만들기 (Authorization 헤더 포함)
    factory = RequestFactory()
    request = factory.get("/", HTTP_AUTHORIZATION=f"Bearer {token}")

    # 3. 미들웨어 인스턴스 실행 (decode)
    middleware = SupabaseJWTMiddleware(get_response=lambda r: None)
    middleware.process_request(request)

    # 4. 결과 검증
    assert request.user.email == "testuser@example.com"
    assert get_user_model().objects.filter(email="testuser@example.com").exists()
    assert Profile.objects.filter(user__email="testuser@example.com").exists()


# 토큰 유효한 경우, 기존 사용자
@pytest.mark.django_db
def test_jwt_middleware_existing_user():
    # 기존 사용자 생성
    user = get_user_model().objects.create(email="existing@user.com", name="기존 유저")
    Profile.objects.create(user=user)

    # 토큰 생성
    payload = {
        "email": "existing@user.com",
        "user_metadata": {"name": "새 유저 이름"}
    }
    token = jwt.encode(payload, settings.SUPABASE_JWT_SECRET, algorithm="HS256")

    # 가짜 요청 만들기
    factory = RequestFactory()
    request = factory.get("/", HTTP_AUTHORIZATION=f"Bearer {token}")

    # 미들웨어 인스턴스 실행 (decode)
    middleware = SupabaseJWTMiddleware(get_response=lambda r: None)
    middleware.process_request(request)

    # 결과 검증
    assert request.user == user
    assert request.user.name == "기존 유저"  # 새 name으로 덮지 않음


# 헤더 없는 경우 익명 사용자로 설정
@pytest.mark.django_db
def test_jwt_middleware_anonymous_if_no_header():
    middleware = SupabaseJWTMiddleware(get_response=lambda r: None)

    request = RequestFactory().get("/")  # 헤더 없음
    middleware.process_request(request)

    from django.contrib.auth.models import AnonymousUser
    assert isinstance(request.user, AnonymousUser)


# 잘못된 서명 토큰 처리
@pytest.mark.django_db
def test_jwt_middleware_invalid_signature():
    settings.SUPABASE_JWT_SECRET = "correct-secret"
    fake_token = jwt.encode({"email": "a@b.com"}, "wrong-secret", algorithm="HS256")

    request = RequestFactory().get("/", HTTP_AUTHORIZATION=f"Bearer {fake_token}")
    middleware = SupabaseJWTMiddleware(get_response=lambda r: None)
    middleware.process_request(request)

    from django.contrib.auth.models import AnonymousUser
    assert isinstance(request.user, AnonymousUser)


# 잘못된 포맷의 Authorization 헤더 처리
@pytest.mark.django_db
def test_jwt_middleware_malformed_authorization_header():
    request = RequestFactory().get("/", HTTP_AUTHORIZATION="InvalidFormatTokenOnly")
    middleware = SupabaseJWTMiddleware(get_response=lambda r: None)
    middleware.process_request(request)

    from django.contrib.auth.models import AnonymousUser
    assert isinstance(request.user, AnonymousUser)


# 이미 존재하는 사용자 처리
@pytest.mark.django_db
def test_jwt_middleware_uses_existing_user():
    from user.models import User
    settings.SUPABASE_JWT_SECRET = "test-secret"

    User.objects.create(email="exist@user.com", name="기존 유저")

    payload = {
        "email": "exist@user.com",
        "user_metadata": {"name": "새 유저 이름"}  # 이건 무시되어야 함
    }
    token = jwt.encode(
        payload,
        settings.SUPABASE_JWT_SECRET,
        algorithm="HS256"
        )
    request = RequestFactory().get("/", HTTP_AUTHORIZATION=f"Bearer {token}")

    middleware = SupabaseJWTMiddleware(get_response=lambda r: None)
    middleware.process_request(request)

    user = get_user_model().objects.get(email="exist@user.com")
    assert request.user == user
    assert user.name == "기존 유저"  # 새 name으로 덮지 않음

import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from user.models import Profile
from django.contrib.auth import get_user_model
import jwt
from django.conf import settings

User = get_user_model()

ME_URL = reverse('user:me')
READONLY_ME_URL = reverse('user:me-readonly')


# 유저 생성
@pytest.fixture
def user(db):
    user = User.objects.create_user(email="test@example.com")
    Profile.objects.create(user=user, name="tester", avatar="https://image.com")
    return user


# 토큰 생성
@pytest.fixture
def token(user):
    """테스트용 JWT 토큰 발급 (Supabase secret 사용)"""
    payload = {
        "email": user.email,
    }
    token = jwt.encode(payload, settings.SUPABASE_JWT_SECRET, algorithm="HS256")
    return token


# 인증된 클라이언트 생성
@pytest.fixture
def auth_client(token):
    """JWT 인증된 APIClient"""
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return client


# 프로필 조회
def test_retrieve_profile(auth_client):
    """GET /api/user/me/ → 프로필 조회"""
    res = auth_client.get(ME_URL)

    assert res.status_code == 200
    assert res.data["name"] == "tester"
    assert "avatar" in res.data  # URL 형식이 변경될 수 있으므로 존재 여부만 확인
    assert "created_at" in res.data


# 프로필 수정
def test_update_profile(auth_client, user):
    """PATCH /api/user/me/ → 프로필 수정"""
    payload = {
        "name": "newname",
    }
    res = auth_client.patch(ME_URL, payload)

    assert res.status_code == 200
    user.refresh_from_db()
    assert user.profile.name == payload["name"]


# 중복된 name으로 프로필 수정
def test_update_profile_with_duplicate_name(auth_client, user):
    """PATCH /api/user/me/ → 중복된 name으로 프로필 수정 → 실패"""

    other_user = User.objects.create_user(email="other@example.com")
    Profile.objects.create(user=other_user, name="taken_name", avatar="https://image.com")

    payload = {
        "name": "taken_name",
    }
    res = auth_client.patch(ME_URL, payload)

    assert res.status_code == 400
    assert "name" in res.data


# 인증 없이 접근
def test_unauthorized_access():
    """JWT 없이 /api/user/me/ 접근 → 실패"""
    client = APIClient()
    res = client.get(ME_URL)

    assert res.status_code == 403


# 인증된 사용자 접근
def test_authenticated_user_access(auth_client):
    """인증된 사용자 접근 → 성공"""
    res = auth_client.get(ME_URL)

    assert res.status_code == 200
    assert res.data["name"] == "tester"
    assert "avatar" in res.data  # URL 형식이 변경될 수 있으므로 존재 여부만 확인


def test_readonly_profile_view(auth_client, user):
    """GET /api/user/me/readonly/ → 로그인된 사용자의 프로필을 정상 반환"""
    res = auth_client.get(READONLY_ME_URL)

    assert res.status_code == 200
    assert res.data["name"] == "tester"
    assert "avatar" in res.data  # URL 형식이 변경될 수 있으므로 존재 여부만 확인
    assert res.data["email"] == "test@example.com"
    assert "created_at" in res.data

"""Test for note models"""

import pytest
from django.contrib.auth import get_user_model
from user.models import Profile
from ..models import Note, NoteSeen
from rest_framework.test import APIClient
import jwt
from django.conf import settings


@pytest.fixture
def user(db):
    user = get_user_model().objects.create_user(email="test@example.com")
    Profile.objects.create(user=user, name="tester", avatar="https://image.com")
    return user


@pytest.fixture
def token(user):
    """테스트용 JWT 토큰 발급 (Supabase secret 사용)"""
    payload = {
        "email": user.email,
    }
    token = jwt.encode(payload, settings.SUPABASE_JWT_SECRET, algorithm="HS256")
    return token


@pytest.fixture
def auth_client(token):
    """JWT 인증된 APIClient"""
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return client


# Note 모델 테스트
@pytest.mark.django_db
def test_note_str_returns_title(user):
    """Test the __str__ method of the Note model"""
    note = Note.objects.create(
        file_name="Test File",
        content="Test Content",
        author=user,
        slug="test-file"
    )
    assert str(note) == "test-file (active)"


# NoteSeen 모델 테스트(생성후 noted 입장에서 개수 조회)
@pytest.mark.django_db
def test_note_seen_(user):
    """Test the __str__ method of the NoteSeen model"""
    note = Note.objects.create(
        file_name="Test File",
        content="Test Content",
        author=user,
        slug="test-file"
    )
    NoteSeen.objects.create(
        note=note,
        user=user,
        ip_address="127.0.0.1"
    )
    assert NoteSeen.objects.count() == 1

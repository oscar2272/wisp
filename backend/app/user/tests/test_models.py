import pytest
from django.contrib.auth import get_user_model
from user.models import Profile  # Profile 위치에 따라 경로 조정
from core.utils.generate_name import generate_unique_username


@pytest.mark.django_db
def test_create_user_without_password_successful():
    """Test creating a user with an email is successful"""
    email = "test@example.com"
    user = get_user_model().objects.create_user(email=email, password=None)
    assert user.email == email


@pytest.mark.django_db
def test_create_user_with_password_successful():
    """Test creating a user with a password is successful"""
    email = "test@example.com"
    password = "testpass123"
    user = get_user_model().objects.create_user(email=email, password=password)
    assert user.email == email
    assert user.check_password(password)


@pytest.mark.django_db
def test_new_user_email_normalized():
    """Test the email for a new user is normalized"""
    email = "test@EXAMPLE.com"
    user = get_user_model().objects.create_user(email, "testpass123")
    assert user.email == email.lower()


@pytest.mark.django_db
def test_new_user_invalid_email():
    """Test creating user with no email raises error"""
    with pytest.raises(ValueError):
        get_user_model().objects.create_user(None, "testpass123")


@pytest.mark.django_db
def test_profile_str_returns_user_email():
    user = get_user_model().objects.create_user(
        email="name@example.com",
    )
    name = generate_unique_username()
    profile = Profile.objects.create(user=user, name=name, avatar="https://example.com/avatar.png")
    assert str(profile) == name
    assert profile.user == user
    assert profile.created_at is not None

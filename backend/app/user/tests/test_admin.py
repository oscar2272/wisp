import pytest
from django.contrib.auth import get_user_model


@pytest.mark.django_db
def test_create_new_superuser():
    user = get_user_model().objects.create_superuser(
        email="super@example.com",
        password="superpass"
    )
    assert user.is_superuser
    assert user.is_staff

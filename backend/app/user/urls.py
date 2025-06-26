from django.urls import path
from user.views import (
    ManageProfileView,
    SignUpUserView,
    ManageRetrieveProfileWithEmailView,
    CheckNicknameView,
    SignUpUserWithNicknameView,
    )

app_name = 'user'

urlpatterns = [
    path('me/', ManageProfileView.as_view(), name='me'),
    path('me/readonly/', ManageRetrieveProfileWithEmailView.as_view(), name='me-readonly'),
    path('sync/', SignUpUserView.as_view(), name='signup'),
    path('check-nickname/<str:nickname>/', CheckNicknameView.as_view(), name='check-nickname'),
    path('signup/', SignUpUserWithNicknameView.as_view(), name='signup'),
]

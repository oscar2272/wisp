from django.urls import path
from user.views import ManageProfileView, SyncUserView, ManageRetrieveProfileWithEmailView

app_name = 'user'

urlpatterns = [
    path('me/', ManageProfileView.as_view(), name='me'),
    path('me/readonly/', ManageRetrieveProfileWithEmailView.as_view(), name='me-readonly'),
    path('sync/', SyncUserView.as_view(), name='sync'),
]
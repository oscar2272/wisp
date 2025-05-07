from rest_framework import generics, permissions
from user.serializers import ProfileSerializer, ProfileWithEmailSerializer
from user.models import Profile
from core.views import SupabaseJWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.utils.generate_name import generate_unique_username
from django.contrib.auth import get_user_model


class SignUpUserView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        email = request.user.email

        user, created = get_user_model().objects.get_or_create(
            email=email,
            defaults={"name": generate_unique_username()}
        )

        # 프로필도 없으면 생성
        if created:
            Profile.objects.create(
                user=user,
                name=user.name,
            )

        return Response(
            {
                "email": user.email,
                "name": user.profile.name,
                "avatar_url": user.profile.avatar_url,
            },
            status=status.HTTP_200_OK
        )


class ManageProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)


class ManageRetrieveProfileWithEmailView(generics.RetrieveAPIView):
    serializer_class = ProfileWithEmailSerializer
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

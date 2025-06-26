from rest_framework import generics, permissions
from user.serializers import ProfileSerializer, ProfileWithEmailSerializer
from user.models import Profile
from core.views import SupabaseJWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.utils.generate_name import generate_unique_username
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny

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
            status=status.HTTP_200_OK
        )

class SignUpUserWithNicknameView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        nickname = request.data.get("nickname")

        print(f"Received email: {email}")
        print(f"Received nickname: {nickname}")

        if not email or not nickname:
            return Response({"error": "Email and nickname are required."}, status=status.HTTP_400_BAD_REQUEST)

        user, created = get_user_model().objects.get_or_create(email=email)

        if created:
            Profile.objects.create(user=user, name=nickname)
        else:
            # 닉네임 중복 체크 (본인 제외)
            if Profile.objects.filter(name=nickname).exclude(user=user).exists():
                return Response({"error": "Nickname is already taken."}, status=status.HTTP_400_BAD_REQUEST)

            profile, _ = Profile.objects.get_or_create(user=user)
            profile.name = nickname
            profile.save()

        return Response(
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
class CheckNicknameView(APIView):
    permission_classes = []
    authentication_classes = []
    def get(self, request, nickname):
        exists = Profile.objects.filter(name=nickname).exists()
        print(f"Checking nickname: {nickname}, exists: {exists}")
        return Response({"exists": exists}, status=status.HTTP_200_OK)
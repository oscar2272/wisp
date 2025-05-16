from rest_framework import serializers
from user.models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["name", "avatar", "created_at"]
        read_only_fields = ["created_at"]


class ProfileSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["name", "avatar"]


class ProfileWithEmailSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Profile
        fields = ["name", "avatar", "created_at", "email"]
        read_only_fields = ["created_at", "email"]

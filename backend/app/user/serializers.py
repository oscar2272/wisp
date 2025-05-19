from rest_framework import serializers
from user.models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = ["name", "avatar", "created_at"]
        read_only_fields = ["created_at"]

    def get_avatar(self, obj):
        request = self.context.get("request")
        if request and obj.avatar:
            return request.build_absolute_uri(obj.avatar.url)
        return obj.avatar.url if obj.avatar else None


class ProfileSimpleSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = ["name", "avatar"]

    def get_avatar(self, obj):
        request = self.context.get("request")
        if request and obj.avatar:
            return request.build_absolute_uri(obj.avatar.url)
        return obj.avatar.url if obj.avatar else None


class ProfileWithEmailSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Profile
        fields = ["name", "avatar", "created_at", "email"]
        read_only_fields = ["created_at", "email"]

from rest_framework import serializers
from .models import Folder, Note
from django.utils import timezone
from user.serializers import ProfileSimpleSerializer
# 폴더 생성 serializer
class TreeItemFolderSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    parentId = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    name = serializers.CharField(source="file_name")

    class Meta:
        model = Folder
        fields = ("id", "parentId", "type", "name")

    def get_id(self, obj):
        return f"folder-{obj.id}"

    def get_parentId(self, obj):
        return f"folder-{obj.parent.id}" if obj.parent else None

    def get_type(self, obj):
        return "folder"


# 노트 생성 serializer
class TreeItemNoteSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    parentId = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    name = serializers.CharField(source="file_name")

    class Meta:
        model = Note
        fields = ("id", "parentId", "type", "name")

    def get_id(self, obj):
        return f"note-{obj.id}"

    def get_parentId(self, obj):
        return f"folder-{obj.folder.id}" if obj.folder else None

    def get_type(self, obj):
        return "note"


# 노트 상세 조회 serializer
class NoteDetailSerializer(serializers.ModelSerializer):
    comments_count = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    class Meta:
        model = Note
        fields = (
            "id", "author", "file_name", "title", "content", "likes_count",
            "slug", "is_shared", "shared_at", "is_public", "expires_at",
            "created_at", "updated_at", "comments_count"
        )

    def get_comments_count(self, obj):
        return self.context.get('comments_count', 0)

    def get_likes_count(self, obj):
        return self.context.get('likes_count', 0)


# 노트 수정 serializer
class NoteDetailEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ("id", "title", "content")


# 공유/공개/날짜 설정 serializer
class NoteDetailShareSerializer(serializers.ModelSerializer):

    shareType = serializers.CharField(write_only=True, required=False)
    expiryDate = serializers.DateTimeField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Note
        fields = [
            "shareType", "expiryDate",  # write-only
            "is_shared", "is_public", "expires_at",

        ]

    def update(self, instance, validated_data):
        share_type = validated_data.pop("shareType")
        expiry_date = validated_data.pop("expiryDate", None)

        # 🧠 shareType 처리
        if share_type:
            if share_type == "private":
                instance.is_shared = False
                instance.is_public = False
                instance.expires_at = None
            elif share_type == "public":
                instance.is_shared = True
                instance.is_public = True
                instance.expires_at = expiry_date
                instance.shared_at = timezone.now()
            elif share_type == "shared":
                instance.is_shared = True
                instance.is_public = False
                instance.expires_at = expiry_date
                instance.shared_at = timezone.now()

        # 🧠 나머지 기본 업데이트
        return super().update(instance, validated_data)


# explore 페이지 note list serializer   / author nested serializer
class NoteListSerializer(serializers.ModelSerializer):
    author = ProfileSimpleSerializer(source="author.profile", read_only=True)
    seen_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    class Meta:
        model = Note
        fields = ("id","author", "title", "content", "likes_count", "comments_count", "seen_count", "updated_at", "expires_at")

    def get_seen_count(self, obj):
        return obj.views.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_likes_count(self, obj):
        return obj.likes.count()


class NoteShareSerializer(serializers.ModelSerializer):
    author = ProfileSimpleSerializer(source="author.profile", read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    seen_count = serializers.SerializerMethodField()
    class Meta:
        model = Note
        fields = ("id", "title", "content", "likes_count", "comments_count", "seen_count", "updated_at", "expires_at","shared_at", "author",)

    def get_seen_count(self, obj):
        return obj.views.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_likes_count(self, obj):
        return obj.likes.count()

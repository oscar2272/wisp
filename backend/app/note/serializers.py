from rest_framework import serializers
from .models import Folder, Note


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


class NoteDetailSerializer(serializers.ModelSerializer):
    comments_count = serializers.SerializerMethodField()
    class Meta:
        model = Note
        fields = (
            "id", "author", "file_name", "title", "content", "likes_count",
            "slug", "is_shared", "shared_at", "is_public", "expires_at",
            "created_at", "updated_at", "comments_count"
        )

    def get_comments_count(self, obj):
        return self.context.get('comments_count', 0)

class NoteDetailEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ("id", "title", "content")

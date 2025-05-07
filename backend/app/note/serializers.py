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

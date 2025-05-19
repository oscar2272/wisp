from django.contrib import admin
from .models import Note, Folder, NoteComment, NoteLike, NoteSeen


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "file_name",
        "title",
        "author",
        "folder",
        "seen_count",
        "comment_count",
        "is_shared",
        "is_public",
        "is_deleted",
        "created_at",
        "updated_at",
    )
    list_filter = ("is_shared", "is_public", "author")
    search_fields = ("file_name", "content")
    readonly_fields = ("created_at", "updated_at")  # likes_count 제거
    ordering = ("-created_at",)

    def seen_count(self, obj):
        return obj.views.count()
    seen_count.short_description = "조회수"

    def comment_count(self, obj):
        return obj.comments.count()
    comment_count.short_description = "댓글수"


# class Folder(models.Model):
#     owner = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#         related_name="folders"
#     )
#     file_name = models.CharField(max_length=255)
#     parent = models.ForeignKey(
#         "self", null=True, blank=True,
#         on_delete=models.CASCADE,
#         related_name="children"
#     )
#     is_deleted = models.BooleanField(default=False)  # soft delete
#     deleted_at = models.DateTimeField(null=True, blank=True)  # soft delete
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ("id", "file_name", "parent_id", "owner")
    search_fields = ("file_name",)
    readonly_fields = ("owner",)
    ordering = ("-created_at",)

admin.site.register(NoteComment)
admin.site.register(NoteLike)
admin.site.register(NoteSeen)

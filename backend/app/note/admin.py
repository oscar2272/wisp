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


admin.site.register(Folder)
admin.site.register(NoteComment)
admin.site.register(NoteLike)
admin.site.register(NoteSeen)

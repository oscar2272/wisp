from django.db import models
from django.conf import settings
from django.utils import timezone
from app.user.models import User

class Folder(models.Model):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="folders"
    )
    name = models.CharField(max_length=255)
    parent = models.ForeignKey(
        "self", null=True, blank=True,
        on_delete=models.CASCADE,
        related_name="children"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return self.name


class Note(models.Model):
    # 작성자
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notes"
    )
    folder = models.ForeignKey(Folder, null=True, blank=True, on_delete=models.SET_NULL, related_name="notes")
    # 메모 본문
    file_name = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    likes_count = models.PositiveIntegerField(default=0)
    # 공유 관련 필드
    slug = models.SlugField(unique=True, max_length=12, null=True, blank=True)  # slug는 공유할 때 생성
    is_shared = models.BooleanField(default=False)
    shared_at = models.DateTimeField(null=True, blank=True)

    # 보안 옵션
    is_public = models.BooleanField(default=False)
    # 만료 관련
    expires_at = models.DateTimeField(null=True, blank=True)

    # 삭제 관련
    deleted_at = models.DateTimeField(null=True, blank=True)  # soft delete
    is_deleted = models.BooleanField(default=False) #soft delete

    # 생성 시각
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # class Meta:
    #     indexes = [
    #         models.Index(fields=["expires_at"]),
    #         models.Index(fields=["is_shared", "expires_at"]),
    #     ]

    def has_expired(self):
        return (
            self.expires_at and timezone.now() > self.expires_at
        )

    @property
    def can_access(self):
        return self.is_shared and not self.has_expired()


    def __str__(self):
        return f"{self.slug or 'Untitled'} ({'expired' if self.has_expired() else 'active'})"


class NoteSeen(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name="views")
    seen_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(protocol="both")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)

    # class Meta:
    #     indexes = [
    #         models.Index(fields=["note", "user", "ip_address", "viewed_at"]),
    #     ]


class NoteLike(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("note", "user")

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            Note.objects.filter(pk=self.note_id).update(
                likes_count=models.F("likes_count") + 1
            )

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        Note.objects.filter(pk=self.note_id).update(
            likes_count=models.F("likes_count") - 1
        )


class NoteComment(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE, related_name="replies")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
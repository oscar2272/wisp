# def save(self, *args, **kwargs):

#     # 공유 안 되면 공개 의미 없음
#     if not self.is_shared:
#         self.is_public = False

#     super().save(*args, **kwargs)




# Where 사용 + 인덱스 사용가능
# Note.objects.filter(
#     Q(expires_at__isnull=False) & Q(expires_at__lt=timezone.now())
# )



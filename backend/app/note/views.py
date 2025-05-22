# def save(self, *args, **kwargs):

#     # 공유 안 되면 공개 의미 없음
#     if not self.is_shared:
#         self.is_public = False

#     super().save(*args, **kwargs)

# Where 사용 + 인덱스 사용가능
# Note.objects.filter(
#     Q(expires_at__isnull=False) & Q(expires_at__lt=timezone.now())
# )

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Folder, Note
from .serializers import (
    TreeItemFolderSerializer,
    TreeItemNoteSerializer,
    NoteDetailSerializer,
    NoteDetailEditSerializer,
    NoteDetailShareSerializer,
    ExploreNoteListSerializer,
    ExploreNoteSerializer,
    NoteHomeSerializer,
    NoteLinkSerializer,
)
from core.views import SupabaseJWTAuthentication
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import NoteComment
from .utils.random_slug import generate_unique_slug
from django.db.models import Count
from django.utils import timezone
from .pagination.pagination import NoteHomePagination
from django.db.models import Q
from rest_framework.generics import ListAPIView
from django.conf import settings

BASE_URL = settings.FRONTEND_BASE_URL


# 사이드바 전용 뷰
class TreeItemListRetrieveView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        folders = Folder.objects.filter(owner=user, is_deleted=False)
        notes = Note.objects.filter(author=user, is_deleted=False)

        folder_data = TreeItemFolderSerializer(folders, many=True).data
        note_data = TreeItemNoteSerializer(notes, many=True).data

        return Response(folder_data + note_data)


class FolderCreateView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):  # 컬럼체크필요
        serializer = TreeItemFolderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        parent_id = request.data.get('parent_id')
        if parent_id:
            raw_id = str(parent_id).replace("folder-", "").replace("note-", "")
            parent = Folder.objects.get(id=raw_id)
        else:
            parent = None
        serializer.save(owner=request.user, parent=parent)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class FolderDeleteView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        folder = get_object_or_404(Folder, id=pk, owner=request.user)
        folder.is_deleted = True
        folder.deleted_at = timezone.now()
        folder.save()

        # ✅ 이 줄 수정
        folder.notes.update(is_deleted=True)

        return Response(status=status.HTTP_204_NO_CONTENT)


class FolderListDeleteView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        folder_ids = request.data.get("folder_ids", [])
        note_ids = request.data.get("note_ids", [])

        if not isinstance(folder_ids, list):
            return Response({"error": "folder_ids must be a list"}, status=400)
        if not isinstance(note_ids, list):
            return Response({"error": "note_ids must be a list"}, status=400)

        # ✅ 이 줄 수정
        Folder.objects.filter(id__in=folder_ids, owner=user).update(is_deleted=True, deleted_at=timezone.now())
        Note.objects.filter(id__in=note_ids, author=user).update(is_deleted=True, deleted_at=timezone.now())

        return Response({"success": True, "deleted": {"folders": folder_ids, "notes": note_ids}})


class NoteCreateView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TreeItemNoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        parent_id = request.data.get('parent_id')
        if parent_id:
            raw_id = str(parent_id).replace("folder-", "").replace("note-", "")
            parent = Folder.objects.get(id=raw_id)
        else:
            parent = None
        serializer.save(author=request.user, folder=parent)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class NoteDeleteView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        note = get_object_or_404(Note, id=pk, author=request.user)
        note.is_deleted = True
        note.deleted_at = timezone.now()
        note.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class NoteListDeleteView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        ids = request.data.get("ids", [])
        if not isinstance(ids, list):
            return Response({"error": "Invalid format"}, status=status.HTTP_400_BAD_REQUEST)
        Note.objects.filter(id__in=ids, author=request.user).update(is_deleted=True, deleted_at=timezone.now())
        return Response(status=status.HTTP_204_NO_CONTENT)


class NoteRenameView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        note = get_object_or_404(Note, id=pk, author=request.user)
        serializer = TreeItemNoteSerializer(note, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(name=request.data.get('name'))
        return Response(serializer.data, status=status.HTTP_200_OK)


class FolderRenameView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        folder = get_object_or_404(Folder, id=pk, owner=request.user)
        serializer = TreeItemFolderSerializer(folder, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(name=request.data.get('name'))
        return Response(serializer.data, status=status.HTTP_200_OK)


# 1개의 노트(title,content) 조회
class NoteDetailView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        note = get_object_or_404(Note, id=pk, author=request.user)
        commentsCount = NoteComment.objects.filter(note=note).count()

        serializer = NoteDetailSerializer(note, context={'comments_count': commentsCount})
        return Response(serializer.data, status=status.HTTP_200_OK)


# edit페이지에서 데이터 조회/수정
class NoteDetailRetrieveUpdateView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        note = get_object_or_404(Note, id=pk, author=request.user)
        serializer = NoteDetailEditSerializer(note)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        note = get_object_or_404(Note, id=pk, author=request.user)
        serializer = NoteDetailEditSerializer(note, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


# 삭제된 폴더와 노트 조회 (soft delete)
class TrashListView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        folders = Folder.objects.filter(owner=user, is_deleted=True)
        notes = Note.objects.filter(author=user, is_deleted=True)

        folder_data = TreeItemFolderSerializer(folders, many=True).data
        note_data = TreeItemNoteSerializer(notes, many=True).data

        return Response(folder_data + note_data)


# slug 생성/url 조회 view
class SlugRetrieveCreateView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        note = get_object_or_404(Note, id=pk, author=request.user)
        return Response({"url": f"{BASE_URL}/link/{note.slug}"})

    def post(self, request, pk):
        note = get_object_or_404(Note, id=pk, author=request.user)
        slug = generate_unique_slug()
        print(slug)
        note.slug = slug
        note.save()
        return Response({"url": f"{BASE_URL}/link/{note.slug}"})


# 공유/공개/날짜 설정 view
class NoteDetailShareView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        note = get_object_or_404(Note, id=pk, author=request.user)
        serializer = NoteDetailShareSerializer(note, data=request.data, partial=True)  # update 오버라이딩
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# explore 페이지 note list view
class ExploreNoteListView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        now = timezone.now()
        notes = Note.objects.filter(
            is_deleted=False,
            is_public=True,
        ).filter(
            Q(expires_at__gte=now) | Q(expires_at__isnull=True)  # ← 핵심 수정
        ).annotate(
            seen_count=Count("views", distinct=True),
            comments_count=Count("comments", distinct=True),
            likes_count=Count("likes", distinct=True),
        )

        serializer = ExploreNoteListSerializer(notes, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


# 노트 홈 페이지 조회(쿼리 파라미터 조건 추가)
class NoteHomeView(ListAPIView):
    serializer_class = NoteHomeSerializer
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = NoteHomePagination  # ← 여기서만 적용

    def get_queryset(self):
        request = self.request
        type_param = request.query_params.get("type", "all")
        status_param = request.query_params.get("status", "all")
        sort_param = request.query_params.get("sort", "recent")
        keyword = request.query_params.get("q", "")

        notes = Note.objects.filter(is_deleted=False)

        if keyword:
            notes = notes.filter(Q(file_name__icontains=keyword))

        notes = notes.annotate(
            likes_count=Count("likes", distinct=True),
            comments_count=Count("comments", distinct=True),
            views_count=Count("views", distinct=True),
        )

        if type_param == "shared":
            notes = notes.filter(is_shared=True, is_public=False)
        elif type_param == "public":
            notes = notes.filter(is_public=True)
        elif type_param == "private":
            notes = notes.filter(is_shared=False)

        if status_param == "is_expired":
            notes = notes.filter(expires_at__lt=timezone.now())
        elif status_param == "is_not_expired":
            notes = notes.filter(expires_at__gte=timezone.now())
        elif status_param == "null":
            notes = notes.filter(expires_at__isnull=True)

        order_map = {
            "recent": "-updated_at",
            "oldest": "updated_at",
            "likes": "-likes_count",
            "comments": "-comments_count",
            "views": "-views_count",
        }

        return notes.order_by(order_map.get(sort_param, "-updated_at"))


class ExploreNoteRetrieveView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, pk):
        note = get_object_or_404(Note, id=pk)
        serializer = ExploreNoteSerializer(note, context={"request": request})
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)


# class TrashDeleteDetailView(APIView):
#     authentication_classes = [SupabaseJWTAuthentication]
#     permission_classes = [IsAuthenticated]

#     def delete(self, request):
#         user = request.user


class TrashListDeleteView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        Folder.objects.filter(owner=user, is_deleted=True).delete()
        Note.objects.filter(author=user, is_deleted=True).delete()
        return Response(status=status.HTTP_200_OK)
# class TrashRestoreDetailView(APIView):
#     authentication_classes = [SupabaseJWTAuthentication]
#     permission_classes = [IsAuthenticated]

#     def post(self, request, pk):
#         user = request.user


class TrashRestoreListView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        Folder.objects.filter(owner=user, is_deleted=True).update(is_deleted=False)
        folders = Folder.objects.filter(owner=user, is_deleted=False)

        Note.objects.filter(author=user, is_deleted=True).update(is_deleted=False)
        notes = Note.objects.filter(author=user, is_deleted=False)

        folder_data = TreeItemFolderSerializer(folders, many=True).data
        note_data = TreeItemNoteSerializer(notes, many=True).data
        return Response(folder_data + note_data, status=status.HTTP_200_OK)


class NoteLinkView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, slug):
        note = get_object_or_404(Note, slug=slug, is_shared=True)
        serializer = NoteLinkSerializer(note, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

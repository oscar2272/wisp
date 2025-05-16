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
    NoteListSerializer,
    NoteShareSerializer,
)
from core.views import SupabaseJWTAuthentication
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import NoteComment
from .utils.random_slug import generate_unique_slug
from django.db.models import Count


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
        folder.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


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
        note.save()
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
class NoteDetailEditView(APIView):
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
        return Response({"url": f"https://wisp.app/share/note/{note.slug}"}, status=status.HTTP_200_OK)

    def post(self, request, pk):
        note = get_object_or_404(Note, id=pk, author=request.user)
        slug = generate_unique_slug()
        print(slug)
        note.slug = slug
        note.save()
        return Response({"url": f"https://wisp.app/share/note/{note.slug}"}, status=status.HTTP_200_OK)


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
class NoteListView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        notes = Note.objects.filter(is_deleted=False, is_public=True) \
            .annotate(
            seen_count=Count("views", distinct=True),
            comments_count=Count("comments", distinct=True),
            likes_count=Count("likes", distinct=True),
        )
        serializer = NoteListSerializer(notes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class NoteShareRetrieveView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, pk):
        note = get_object_or_404(Note, id=pk)
        serializer = NoteShareSerializer(note)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

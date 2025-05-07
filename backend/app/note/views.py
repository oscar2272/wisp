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
from .serializers import TreeItemFolderSerializer, TreeItemNoteSerializer
from core.views import SupabaseJWTAuthentication
from rest_framework import status
from django.shortcuts import get_object_or_404


class TreeItemListRetrieveView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        folders = Folder.objects.filter(owner=user)
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
        folder.delete()
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
        note.delete()
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

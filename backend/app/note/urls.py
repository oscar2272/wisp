from django.urls import path
from .views import (
    TreeItemListRetrieveView,
    FolderCreateView,
    FolderDeleteView,
    NoteCreateView,
    NoteDeleteView,
    NoteLinkView,
    FolderListDeleteView,
    NoteRenameView,
    FolderRenameView,
    TrashListView,
    NoteDetailView,
    NoteDetailRetrieveUpdateView,
    NoteDetailShareView,
    SlugRetrieveCreateView,
    NoteHomeView,
    NoteListDeleteView,
    ExploreNoteListView,
    ExploreNoteRetrieveView,
    TrashDeleteDetailView,
    TrashListDeleteView,
    TrashRestoreDetailView,
    TrashRestoreListView,
)


app_name = 'note'

urlpatterns = [
    path('<int:pk>/', NoteDetailView.as_view(), name='note-detail'), # 단일 노트 상세 조회
    path('<int:pk>/edit/', NoteDetailRetrieveUpdateView.as_view(), name='note-edit'), # 단일 노트 수정
    path('<int:pk>/share/', NoteDetailShareView.as_view(), name='note-share'), # 공유 설정
    path('<int:pk>/delete/', NoteDeleteView.as_view(), name='note-delete'), # 단일 노트 삭제
    path('<int:pk>/slug/', SlugRetrieveCreateView.as_view(), name='slug'), # slug 생성/url 조회

    path('explore/', ExploreNoteListView.as_view(), name='note-list'), # 공개 노트리스트 조회
    path('explore/<int:pk>/', ExploreNoteRetrieveView.as_view(), name='note-retrieve'), # 공유 노트 조회

    path('sidebar/', TreeItemListRetrieveView.as_view(), name='sidebar'), # 사이드바 get
    path('folder/', FolderCreateView.as_view(), name='folder'), # 폴더 생성
    path('folder/delete/', FolderListDeleteView.as_view(), name='folder-list-delete'), # 폴더아래 아이템있을경우 삭제
    path('folder/<int:pk>/delete/', FolderDeleteView.as_view(), name='folder-delete'), # 단일폴더 삭제
    path('folder/<int:pk>/rename/', FolderRenameView.as_view(), name='folder-rename'), # 단일폴더 이름 변경

    path('home/', NoteHomeView.as_view(), name='note-home'), # 홈 페이지
    path('delete/', NoteListDeleteView.as_view(), name='note-list-delete'), # 선택 삭제
    path('note/', NoteCreateView.as_view(), name='note'), # 노트 생성
    path('note/<int:pk>/rename/', NoteRenameView.as_view(), name='note-rename'), # 노트 이름 변경

    path('trash/', TrashListView.as_view(), name='trash'), # 삭제된 노트 조회
    path('trash/<int:pk>/delete/', TrashDeleteDetailView.as_view(), name='trash-list-delete'), # 삭제된 노트 및 폴더 영구 삭제
    path('trash/delete/', TrashListDeleteView.as_view(), name='trash-list-delete'), # 휴지통 비우기
    path('trash/<int:pk>/restore/', TrashRestoreDetailView.as_view(), name='trash-restore'), # 삭제된 노트 및 폴더 복구
    path('trash/restore/', TrashRestoreListView.as_view(), name='trash-restore-list'), # 휴지통 전체 복구

    path('link/<str:slug>/', NoteLinkView.as_view(), name='note-link'), # 노트 링크 조회
]

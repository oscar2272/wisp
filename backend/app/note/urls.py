from django.urls import path
from .views import (
    TreeItemListRetrieveView,
    FolderCreateView,
    FolderDeleteView,
    NoteCreateView,
    NoteDeleteView,
    NoteRenameView,
    FolderRenameView,
    TrashListView,
    NoteDetailView,
    NoteDetailEditView,
    NoteDetailShareView,
    SlugRetrieveCreateView,
)


app_name = 'note'

urlpatterns = [
    path('<int:pk>/', NoteDetailView.as_view(), name='note-detail'),
    path('<int:pk>/edit/', NoteDetailEditView.as_view(), name='note-edit'),
    path('<int:pk>/share/', NoteDetailShareView.as_view(), name='note-share'),
    path('<int:pk>/slug/', SlugRetrieveCreateView.as_view(), name='slug'),

    path('sidebar/', TreeItemListRetrieveView.as_view(), name='sidebar'),
    path('folder/', FolderCreateView.as_view(), name='folder'),
    path('folder/<int:pk>/', FolderDeleteView.as_view(), name='folder-delete'),
    path('folder/<int:pk>/rename/', FolderRenameView.as_view(), name='folder-rename'),

    path('note/', NoteCreateView.as_view(), name='note'),
    path('note/<int:pk>/', NoteDeleteView.as_view(), name='note-delete'),
    path('note/<int:pk>/rename/', NoteRenameView.as_view(), name='note-rename'),
    path('trash/', TrashListView.as_view(), name='trash'),
]

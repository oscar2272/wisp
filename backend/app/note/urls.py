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
    NoteListView,
    NoteShareRetrieveView,
    NoteHomeView,
)


app_name = 'note'

urlpatterns = [
    path('<int:pk>/', NoteDetailView.as_view(), name='note-detail'),
    path('<int:pk>/edit/', NoteDetailEditView.as_view(), name='note-edit'),
    path('<int:pk>/share/', NoteDetailShareView.as_view(), name='note-share'),
    path('<int:pk>/slug/', SlugRetrieveCreateView.as_view(), name='slug'),

    path('explore/', NoteListView.as_view(), name='note-list'),
    path('explore/<int:pk>/', NoteShareRetrieveView.as_view(), name='note-share-retrieve'),

    path('sidebar/', TreeItemListRetrieveView.as_view(), name='sidebar'),
    path('folder/', FolderCreateView.as_view(), name='folder'),
    path('folder/<int:pk>/', FolderDeleteView.as_view(), name='folder-delete'),
    path('folder/<int:pk>/rename/', FolderRenameView.as_view(), name='folder-rename'),

    path('home/', NoteHomeView.as_view(), name='note-home'),
    path('note/', NoteCreateView.as_view(), name='note'),
    path('note/<int:pk>/', NoteDeleteView.as_view(), name='note-delete'),
    path('note/<int:pk>/rename/', NoteRenameView.as_view(), name='note-rename'),
    path('trash/', TrashListView.as_view(), name='trash'),
]

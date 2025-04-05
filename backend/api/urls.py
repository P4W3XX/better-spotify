from django.urls import path
from . import views

urlpatterns = [
    path('artists/', views.ArtistListView.as_view(), name='artist-list'),
    path('artists/<int:pk>/', views.ArtistDetailView.as_view(), name='artist-detail'),
    path('albums/', views.AlbumListView.as_view(), name='album-list'),
    path('albums/<int:pk>/', views.AlbumDetailView.as_view(), name='album-detail'),
    path('songs/', views.SongListView.as_view(), name='song-list'),
    path('songs/<int:pk>/', views.SongDetailView.as_view(), name='song-detail'),
]

from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'artists', views.ArtistViewSet, basename='artist')
router.register(r'albums', views.AlbumViewSet, basename='album')
router.register(r'songs', views.SongViewSet, basename='song')
router.register(r'user-playlists', views.UserPlaylistViewSet, basename='user-playlist')

urlpatterns = [
    path('', include(router.urls)),
    path('search/', views.SearchView.as_view(), name='search'),
    path('playback/control/', views.PlaybackControlAPIView.as_view(), name='playback-control'),
    path('user-history/', views.UserPlaybackHistoryAPIView.as_view(), name='user-history'),
    path('top-songs/', views.TopSongsAPIView.as_view(), name='top-songs'),
]

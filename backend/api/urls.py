from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'artists', views.ArtistViewSet, basename='artist')
router.register(r'albums', views.AlbumViewSet, basename='album')
router.register(r'songs', views.SongViewSet, basename='song')
router.register(r'user-playlists', views.UserPlaylistViewSet, basename='user-playlist')
router.register(r'playback-history', views.PlaybackHistoryViewSet, basename='playback-history')

urlpatterns = [
    path('', include(router.urls)),
    path('search/', views.SearchView.as_view(), name='search'),
    path('playback/control/', views.PlaybackControlAPIView.as_view(), name='playback-control'),
    path('user-history/', views.UserPlaybackHistoryAPIView.as_view(), name='user-history'),
    path('top-songs/', views.TopSongsAPIView.as_view(), name='top-songs'),
    path('modify/playlist/', views.ModifyPlaylistAPIView.as_view(), name='modify-playlist'),
    path('library/', views.LibraryAPIView.as_view(), name='library'),
    path('modify/library/', views.ModifyLibraryAPIView.as_view(), name='modify-library'),
    path('toggle-follow/', views.ToggleFollowAPIView.as_view(), name='toggle-follow'),
    path('test/', views.testIMG, name='test-img'),
]

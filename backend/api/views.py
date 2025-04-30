from rest_framework import filters, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q, F
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.postgres.search import TrigramSimilarity
from django.db.models.functions import Greatest


from .models import CustomUser, Album, PlaylistSong, Song, CurrentPlayback, SongPlayback, Playlist, LibraryItem, Library
from .serializers import (ArtistSerializer, AlbumSerializer, SongSerializer, 
                          CurrentPlaybackSerializer, PlaybackActionSerializer, UserPlaybackHistorySerializer, 
                          PlaylistSerializer,
                          LibraryItemSerializer, LibrarySerializer
                          )

from django.contrib.contenttypes.models import ContentType


from .filters import ArtistFilter, AlbumFilter, SongFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework.permissions import IsAuthenticated, AllowAny

from .utils import get_top_songs_last_month, create_collage
from collections import defaultdict
from django.conf import settings
import os
# Create your views here.

BASE_URL = 'http://127.0.0.1:8000'

@extend_schema(
    parameters=[
        OpenApiParameter('album_type', type=str, description='Filters by album type (album, single, ep) in specific artist'),
    ]
)
class ArtistViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.prefetch_related('albums')
    serializer_class = ArtistSerializer
    permission_classes = [AllowAny,]
    filterset_class = ArtistFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    search_fields = ['username', 'albums__title']
    ordering_fields = ['username', 'albums__title']
    http_method_names = ['get', 'put', 'patch', 'head', 'options']

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['many'] = self.action == 'list'
        return context

class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.prefetch_related('artist', 'songs')
    serializer_class = AlbumSerializer
    permission_classes = [AllowAny,]
    filterset_class = AlbumFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    search_fields = ['title', 'artist__username', 'release_date']
    ordering_fields = ['title', 'artist__username', 'release_date']
    
class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = [AllowAny,]
    filterset_class = SongFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    search_fields = ['title', 'album__title', 'album__artist__username', 'album__release_date']
    ordering_fields = ['title', 'album__title', 'album__artist__username', 'album__release_date']

class SmallResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_query_param = 'page'

@extend_schema(
    parameters=[
        OpenApiParameter('q', type=str, description='Search query'),
    ]
)
class SearchView(APIView):
    permission_classes = [AllowAny,]
    
    @extend_schema(request=None, responses=None)
    def get(self, request, *args, **kwargs):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({"results": []})

        paginator = SmallResultsSetPagination()

        # songs = Song.objects.filter(
        #     Q(title__icontains=query) |
        #     Q(album__title__icontains=query) |
        #     Q(album__artist__name__icontains=query)
        # )
        songs = Song.objects.annotate(
            similarity=Greatest(
                TrigramSimilarity('title', query),
                TrigramSimilarity('title', query.lower()),
                TrigramSimilarity('album__title', query),
                TrigramSimilarity('album__title', query.lower()),
                TrigramSimilarity('album__artist__username', query),
                TrigramSimilarity('album__artist__username', query.lower())
            )
        ).filter(
            Q(title__icontains=query) |
            Q(album__title__icontains=query) |
            Q(album__artist__username__icontains=query) | Q(similarity__gt=0.2)
        ).order_by('-similarity')

        # albums = Album.objects.filter(
        #     Q(title__icontains=query) |
        #     Q(artist__name__icontains=query)
        # )
        albums = Album.objects.annotate(
            similarity=Greatest(
                TrigramSimilarity('title', query),
                TrigramSimilarity('title', query.lower()),
                TrigramSimilarity('artist__username', query),
                TrigramSimilarity('artist__username', query.lower())
            )
        ).filter(
            Q(title__icontains=query) |
            Q(artist__username__icontains=query) | Q(similarity__gt=0.2)
        ).order_by('-similarity')


        # artists = Artist.objects.filter(name__icontains=query)
        artists = CustomUser.objects.annotate(
            similarity=Greatest(
                TrigramSimilarity('username', query),
                TrigramSimilarity('username', query.lower())
            )
        ).filter(
            Q(username__icontains=query) | Q(similarity__gt=0.2)
        ).order_by('-similarity')


        playlists = Playlist.objects.annotate(
            similarity=Greatest(
                TrigramSimilarity('name', query),
                TrigramSimilarity('name', query.lower()),
                TrigramSimilarity('user__username', query),
                TrigramSimilarity('user__username', query.lower())
            )
        ).filter(
            (Q(user__username__icontains=query) |
            Q(name__icontains=query) | Q(similarity__gt=0.2)) & Q(is_public=True)
        ).order_by('-similarity')

        combined_results = list(songs) + list(albums) + list(artists) + list(playlists)
        combined_results = sorted(combined_results, key=lambda x: self.get_relevance(x, query), reverse=False)
        combined_results.reverse()

        paginated_results = paginator.paginate_queryset(combined_results, request)

        results = []
        for obj in paginated_results:
            if isinstance(obj, Song):
                result_data = SongSerializer(obj, context={'request': request}).data
                result_data['data_type'] = 'song'
                results.append(result_data)
            elif isinstance(obj, Album):
                result_data = AlbumSerializer(obj, context={'request': request}).data
                result_data['data_type'] = 'album'
                results.append(result_data)
                result_data.pop('songs', None)
            elif isinstance(obj, CustomUser):
                result_data = ArtistSerializer(obj, context={'request': request}).data
                result_data['data_type'] = 'artist'
                results.append(result_data)
                result_data.pop('albums', None)
            elif isinstance(obj, Playlist):
                result_data = PlaylistSerializer(obj, context={'request': request}).data
                result_data['data_type'] = 'playlist'
                results.append(result_data)
                result_data.pop('songs', None)

        return paginator.get_paginated_response(results)

    def get_relevance(self, obj, query):
        if isinstance(obj, Song):
            return obj.title.lower().count(query.lower()) + obj.album.title.lower().count(query.lower())
        elif isinstance(obj, Album):
            return obj.title.lower().count(query.lower()) + obj.artist.username.lower().count(query.lower())
        elif isinstance(obj, CustomUser):
            return obj.username.lower().count(query.lower())
        elif isinstance(obj, Playlist):
            return obj.name.lower().count(query.lower()) + obj.user.username.lower().count(query.lower())
        return 0
    

@extend_schema(
    parameters=[
        OpenApiParameter('action', type=str, description='Action to perform (play, pause, resume, reset)'),
        OpenApiParameter('song_id', type=int, description='ID of the song to play or reset')
    ]
)
class PlaybackControlAPIView(APIView):
    permission_classes = [IsAuthenticated,]
    serializer_class = PlaybackActionSerializer

    def post(self, request):
        serializer = PlaybackActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        action = serializer.validated_data['action']
        song_id = serializer.validated_data.get('song_id')

        current_playback = CurrentPlayback.objects.get(user=request.user)

        if action == 'play':
            if not song_id:
                return Response({"error": "song_id is required"}, status=400)
            song = Song.objects.get(id=song_id)
            current_playback.play(song)
            return Response({"status": "Played"})
        elif action == 'pause':
            current_playback.pause()
            return Response({"status": "Paused"})
        elif action == 'resume':
            current_playback.resume()
            return Response({"status": "Playing"})
        elif action == 'reset':
            if not song_id:
                current_playback.reset()
            else:
                song = Song.objects.get(id=song_id)
                current_playback.reset(song)
            return Response({"status": "Stopped"})

        
    def get(self, request):
        current_playback = CurrentPlayback.objects.get(user=request.user)
        if current_playback.song:
            data = CurrentPlaybackSerializer(current_playback).data
            return Response({"data": data, "status": "Playing"})
        return Response({"status": "Stopped / Not playing any song"})
    

class UserPlaybackHistoryAPIView(APIView):
    permission_classes = [IsAuthenticated,]

    @extend_schema(
        request=None,
        responses={
            200: UserPlaybackHistorySerializer(many=True),
        }
    )
    def get(self, request):
        user = request.user
        playback_history = SongPlayback.objects.filter(user=user).order_by('-played_at')
        serializer = UserPlaybackHistorySerializer(playback_history, many=True, context={'request': request})
        return Response(serializer.data)

class TopSongsAPIView(APIView):
    permission_classes = [AllowAny,]

    @extend_schema(
        request=None,
        responses={
            200: {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'genre': {'type': 'string'},
                        'cover': {'type': 'string', 'format': 'uri'},
                        'songs': {
                            'type': 'array',
                            'items': {
                                'type': 'object',
                                'properties': {
                                    'id': {'type': 'integer'},
                                    'title': {'type': 'string'},
                                    'artist': {'type': 'integer'},
                                    'album': {'type': 'integer'},
                                    'duration': {'type': 'integer'},
                                    'play_count': {'type': 'integer'}
                                },
                            }
                        }
                    },
                }
            }
        }
    )
    def get(self, request):
        top_songs = list(get_top_songs_last_month())
        result = defaultdict(list)

        for entry in top_songs:
            genre = entry['genre_label']
            result[genre].append({
                'song': entry['song__id'],
                'play_count': entry['play_count']
            })

        grouped_result = dict(result)


        data = []
        for genre, value in grouped_result.items():
            songs_data = []
            for song in value:
                song_obj = SongSerializer(Song.objects.get(id=song['song']), context={'request': request}).data
                song_obj.pop('lyrics')
                song_obj.pop('genre')

                song_obj.pop('plays')
                song_obj['play_count'] = song.pop('play_count')
                songs_data.append(song_obj)
            data1 = {}
            
            data1['genre'] = genre
            data1['cover'] = BASE_URL + CustomUser.objects.get(id=songs_data[0]['artist']).image.url if songs_data[0]['artist'] else None
            data1['songs'] = songs_data
            data.append(data1)

        return Response(data)
    

class UserPlaylistViewSet(viewsets.ModelViewSet):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        user = self.request.user
        return Playlist.objects.filter(user=user)
    
    def create(self, request):
        serializer = PlaylistSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        playlist = serializer.save(user=request.user)
        library = Library.objects.get(user=request.user)
        library_item = LibraryItem.objects.create(
            library=library,
            content_type=ContentType.objects.get_for_model(Playlist),
            object_id=playlist.id
        )
        print('a')

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    


class ModifyPlaylistAPIView(APIView):
    permission_classes = [IsAuthenticated,]

    def post(self, request):
        playlist_id = request.data.get('playlist_id', None)
        if not playlist_id:
            return Response({"error": "playlist_id is required"}, status=400)
        playlist = Playlist.objects.get(id=playlist_id, user=request.user)
        song_ids = request.data.get('song_ids', [])
        action = request.data.get('action', 'add')


        if action == 'add':
            playlist_song_length = PlaylistSong.objects.filter(playlist=playlist).count()
            for idx, song_id in enumerate(song_ids):
                playlist_song, created = PlaylistSong.objects.get_or_create(
                    playlist=playlist,
                    song_id=song_id,
                    order=idx+playlist_song_length,
                )
                playlist_song.save()


        elif action == 'remove':
            for song_id in song_ids:
                try:
                    song = PlaylistSong.objects.get(playlist=playlist, song_id=song_id)
                    removed_order = song.order
                    song.delete()

                    PlaylistSong.objects.filter(
                        playlist=playlist,
                        order__gt=removed_order
                    ).update(order=F('order') - 1)

                except PlaylistSong.DoesNotExist:
                    continue



        images = []
        for song in playlist.songs.all():
            if song.album.image:
                images.append(song.album.image.name)

        if images:
            os.makedirs(os.path.join(settings.MEDIA_ROOT, 'playlists'), exist_ok=True)

            relative_path = os.path.join('playlists', f'playlist{playlist.id}.png')
            save_path = os.path.join(settings.MEDIA_ROOT, relative_path)

            collage = create_collage(images, save_path, size=(800, 800))

            playlist.image = relative_path
            playlist.save()

        return Response({"status": "success", "playlist": PlaylistSerializer(playlist, context={}).data})
    



class LibraryViewSet(viewsets.ModelViewSet):
    queryset = Library.objects.all()
    serializer_class = LibrarySerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        user = self.request.user
        return Library.objects.filter(user=user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
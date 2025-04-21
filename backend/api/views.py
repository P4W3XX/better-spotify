from rest_framework import filters, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.postgres.search import TrigramSimilarity
from django.db.models.functions import Greatest

from .models import CustomUser, Album, Song, CurrentPlayback, SongPlayback
from .serializers import (ArtistSerializer, AlbumSerializer, SongSerializer, 
                          CurrentPlaybackSerializer, PlaybackActionSerializer,
                          UserPlaybackHistorySerializer)

from .filters import ArtistFilter, AlbumFilter, SongFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework.permissions import IsAuthenticated, AllowAny

from .utils import get_top_songs_last_month
from collections import defaultdict
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

        combined_results = list(songs) + list(albums) + list(artists)
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

        return paginator.get_paginated_response(results)

    def get_relevance(self, obj, query):
        if isinstance(obj, Song):
            return obj.title.lower().count(query.lower()) + obj.album.title.lower().count(query.lower())
        elif isinstance(obj, Album):
            return obj.title.lower().count(query.lower()) + obj.artist.username.lower().count(query.lower())
        elif isinstance(obj, CustomUser):
            return obj.username.lower().count(query.lower())
        return 0
    

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
                return Response({"error": "song_id is required"}, status=400)
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

    def get(self, request):
        user = request.user
        playback_history = SongPlayback.objects.filter(user=user).order_by('-played_at')
        serializer = UserPlaybackHistorySerializer(playback_history, many=True, context={'request': request})
        return Response(serializer.data)
    

class TopSongsAPIView(APIView):
    permission_classes = [AllowAny,]

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
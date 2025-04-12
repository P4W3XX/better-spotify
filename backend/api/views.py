from rest_framework import filters, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.postgres.search import TrigramSimilarity
from django.db.models.functions import Greatest
from .models import Artist, Album, Song
from .serializers import ArtistSerializer, AlbumSerializer, SongSerializer
from .filters import ArtistFilter, AlbumFilter, SongFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter

# Create your views here.

@extend_schema(
    parameters=[
        OpenApiParameter('album_type', type=str, description='Filters by album type (album, single, ep) in specific artist'),
    ]
)
class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.prefetch_related('albums')
    serializer_class = ArtistSerializer
    filterset_class = ArtistFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    search_fields = ['name', 'albums__title']
    ordering_fields = ['name', 'albums__title']

class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.prefetch_related('artist', 'songs')
    serializer_class = AlbumSerializer
    filterset_class = AlbumFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    search_fields = ['title', 'artist__name', 'release_date']
    ordering_fields = ['title', 'artist__name', 'release_date']
    
class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    filterset_class = SongFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    search_fields = ['title', 'album__title', 'album__artist__name', 'album__release_date']
    ordering_fields = ['title', 'album__title', 'album__artist__name', 'album__release_date']

class SmallResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_query_param = 'page'

@extend_schema(
    parameters=[
        OpenApiParameter('q', type=str, description='Search query'),
    ]
)
class SearchView(APIView):
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
                TrigramSimilarity('album__artist__name', query),
                TrigramSimilarity('album__artist__name', query.lower())
            )
        ).filter(
            Q(title__icontains=query) |
            Q(album__title__icontains=query) |
            Q(album__artist__name__icontains=query) | Q(similarity__gt=0.2)
        ).order_by('-similarity')

        # albums = Album.objects.filter(
        #     Q(title__icontains=query) |
        #     Q(artist__name__icontains=query)
        # )
        albums = Album.objects.annotate(
            similarity=Greatest(
                TrigramSimilarity('title', query),
                TrigramSimilarity('title', query.lower()),
                TrigramSimilarity('artist__name', query),
                TrigramSimilarity('artist__name', query.lower())
            )
        ).filter(
            Q(title__icontains=query) |
            Q(artist__name__icontains=query) | Q(similarity__gt=0.2)
        ).order_by('-similarity')


        # artists = Artist.objects.filter(name__icontains=query)
        artists = Artist.objects.annotate(
            similarity=Greatest(
                TrigramSimilarity('name', query),
                TrigramSimilarity('name', query.lower())
            )
        ).filter(
            Q(name__icontains=query) | Q(similarity__gt=0.2)
        ).order_by('-similarity')

        combined_results = list(songs) + list(albums) + list(artists)
        combined_results = sorted(combined_results, key=lambda x: self.get_relevance(x, query), reverse=False)
        combined_results.reverse()

        paginated_results = paginator.paginate_queryset(combined_results, request)

        results = []
        for obj in paginated_results:
            if isinstance(obj, Song):
                result_data = SongSerializer(obj, context={'request': request}).data
                result_data['type'] = 'song'
                results.append(result_data)
            elif isinstance(obj, Album):
                result_data = AlbumSerializer(obj, context={'request': request}).data
                result_data['type'] = 'album'
                results.append(result_data)
                result_data.pop('songs', None)
            elif isinstance(obj, Artist):
                result_data = ArtistSerializer(obj, context={'request': request}).data
                result_data['type'] = 'artist'
                results.append(result_data)
                result_data.pop('albums', None)

        return paginator.get_paginated_response(results)

    def get_relevance(self, obj, query):
        if isinstance(obj, Song):
            return obj.title.lower().count(query.lower()) + obj.album.title.lower().count(query.lower())
        elif isinstance(obj, Album):
            return obj.title.lower().count(query.lower()) + obj.artist.name.lower().count(query.lower())
        elif isinstance(obj, Artist):
            return obj.name.lower().count(query.lower())
        return 0
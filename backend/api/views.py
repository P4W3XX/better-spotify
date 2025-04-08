from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
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

class ArtistListView(generics.ListCreateAPIView):
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

class ArtistDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Artist.objects.prefetch_related('albums')
    serializer_class = ArtistSerializer

class AlbumListView(generics.ListCreateAPIView):
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
    

class AlbumDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Album.objects.prefetch_related('artist', 'songs')
    serializer_class = AlbumSerializer


class SongListView(generics.ListCreateAPIView):
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

class SongDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
from django.shortcuts import render
from .serializers import ArtistSerializer, AlbumSerializer
from .models import Artist, Album
from .filters import ArtistFilter, AlbumFilter
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend

# Create your views here.

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
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    filterset_class = AlbumFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    search_fields = ['title', 'artist__name']
    ordering_fields = ['title', 'artist__name']
    

class AlbumDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
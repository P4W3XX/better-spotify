from django.shortcuts import render
from .serializers import ArtistSerializer, AlbumSerializer
from .models import Artist, Album
from rest_framework import generics

# Create your views here.

class ArtistListView(generics.ListCreateAPIView):
    queryset = Artist.objects.prefetch_related('albums')
    serializer_class = ArtistSerializer

class ArtistDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Artist.objects.prefetch_related('albums')
    serializer_class = ArtistSerializer

class AlbumListView(generics.ListCreateAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer

class AlbumDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
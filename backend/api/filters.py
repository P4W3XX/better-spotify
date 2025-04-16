import django_filters
from .models import Album, CustomUser, Song
from rest_framework import filters

class ArtistFilter(django_filters.FilterSet):
    class Meta:
        model = CustomUser
        fields = {
            'username': ['iexact', 'icontains'],
            'albums__title': ['iexact', 'icontains'],
        }

class AlbumFilter(django_filters.FilterSet):
    class Meta:
        model = Album
        fields = {
            'title': ['iexact', 'icontains'],
            'artist': ['exact',],
            'artist__username': ['exact', 'icontains'],
            'release_date': ['exact', 'year__exact', 'year__gt', 'year__lt'],
            'album_type': ['exact', 'iexact'],
        }

class SongFilter(django_filters.FilterSet):
    class Meta:
        model = Song
        fields = {
            'title': ['iexact', 'icontains'],
            'album__artist__username': ['iexact', 'icontains'],
            'album__title': ['iexact', 'icontains'],
        }
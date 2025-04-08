import django_filters
from .models import Album, Artist, Song
from rest_framework import filters

class ArtistFilter(django_filters.FilterSet):
    class Meta:
        model = Artist
        fields = {
            'name': ['iexact', 'icontains'],
            'albums__title': ['iexact', 'icontains'],
        }

class AlbumFilter(django_filters.FilterSet):
    class Meta:
        model = Album
        fields = {
            'title': ['iexact', 'icontains'],
            'artist': ['exact',],
            'artist__name': ['exact', 'icontains'],
            'release_date': ['exact', 'year__exact', 'year__gt', 'year__lt'],
            'album_type': ['exact', 'iexact'],
        }

class SongFilter(django_filters.FilterSet):
    class Meta:
        model = Song
        fields = {
            'title': ['iexact', 'icontains'],
            'album__artist__name': ['iexact', 'icontains'],
            'album__title': ['iexact', 'icontains'],
        }
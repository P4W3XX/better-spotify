import django_filters
from .models import Album, Artist
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
            'artist__name': ['iexact', 'icontains'],
        }
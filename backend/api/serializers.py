from rest_framework import serializers
from .models import Artist, Album

class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = ['id', 'title', 'artist', 'image']

    def __init__(self, *args, **kwargs):
        nested = kwargs.pop('nested', False)
        super().__init__(*args, **kwargs)

        if nested:
            self.fields.pop('artist')

class ArtistSerializer(serializers.ModelSerializer):
    # albums = AlbumSerializer(many=True, read_only=True)
    albums = serializers.SerializerMethodField()

    class Meta:
        model = Artist
        fields = ['id', 'name', 'image', 'albums']

    def get_albums(self, obj):
        return AlbumSerializer(obj.albums, many=True, nested=True).data
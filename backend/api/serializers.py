from rest_framework import serializers
from .models import Artist, Album, Song


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['id', 'album', 'title', 'duration', 'file', 'lyrics']

    def __init__(self, *args, **kwargs):
        nested = kwargs.pop('nested', False)
        super().__init__(*args, **kwargs)

        if nested:
            self.fields.pop('album')


class AlbumSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, nested=True, required=False)
    class Meta:
        model = Album
        fields = ['id', 'title', 'artist', 'image', 'songs']

    def __init__(self, *args, **kwargs):
        nested = kwargs.pop('nested', False)
        super().__init__(*args, **kwargs)

        if nested:
            self.fields.pop('artist')
            self.fields.pop('songs')

    def create(self, validated_data):
        songs_data = validated_data.pop('songs')
        album = Album.objects.create(**validated_data)
        for song_data in songs_data:
            Song.objects.create(album=album, **song_data)
        return album

class ArtistSerializer(serializers.ModelSerializer):
    # albums = AlbumSerializer(many=True, read_only=True)
    albums = serializers.SerializerMethodField()

    class Meta:
        model = Artist
        fields = ['id', 'name', 'image', 'albums']

    def get_albums(self, obj):
        return AlbumSerializer(obj.albums, many=True, nested=True, context=self.context).data
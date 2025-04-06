from rest_framework import serializers
from .models import Artist, Album, Song


class SongSerializer(serializers.ModelSerializer):

    class Meta:
        model = Song
        fields = ['id', 'album', 'artist', 'title', 'duration', 'file', 'lyrics', 'track_number', 'plays']

    def __init__(self, *args, **kwargs):
        nested = kwargs.pop('nested', False)
        super().__init__(*args, **kwargs)

        # if nested:
        #     self.fields.pop('album')
        #     self.fields.pop('artist')
        #     self.fields.pop('lyrics')


class AlbumSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, nested=True, required=False)
    class Meta:
        model = Album
        fields = ['id', 'title', 'artist', 'image', 'release_date', 'songs']

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
    
    def update(self, instance, validated_data):
        songs_data = validated_data.pop('songs', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if songs_data is not None:
            for song_data in songs_data:
                song_id = song_data.get('id', None)
                if song_id:
                    song = Song.objects.get(id=song_id, album=instance)
                    for key, value in song_data.items():
                        setattr(song, key, value)
                    song.save()
                else:
                    Song.objects.create(album=instance, **song_data)

        return instance

class ArtistSerializer(serializers.ModelSerializer):
    # albums = AlbumSerializer(many=True, read_only=True)
    albums = serializers.SerializerMethodField()
    singles = serializers.SerializerMethodField()

    class Meta:
        model = Artist
        fields = ['id', 'name', 'image', 'albums', 'singles']

    def get_albums(self, obj):
        return AlbumSerializer(obj.albums, many=True, nested=True, context=self.context).data
    
    def get_singles(self, obj):
        return SongSerializer(obj.singles, many=True, nested=True, context=self.context).data
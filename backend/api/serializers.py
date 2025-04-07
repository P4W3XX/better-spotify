import datetime
from django.db.models import Sum
from rest_framework import serializers
from .models import Artist, Album, Song
from drf_spectacular.utils import extend_schema_field


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['id', 'album', 'title', 'duration', 'file', 'lyrics', 'track_number', 'plays']

    def __init__(self, *args, **kwargs):
        nested = kwargs.pop('nested', False)
        super().__init__(*args, **kwargs)

        if nested:
            self.fields.pop('lyrics')
            self.fields.pop('album')

class AlbumSerializer(serializers.ModelSerializer):
    # songs = SongSerializer(many=True, required=False, nested=True)
    songs = serializers.SerializerMethodField()
    album_duration = serializers.SerializerMethodField()
    class Meta:
        model = Album
        fields = ['id', 'title', 'album_type', 'artist', 'image', 'release_date', 'album_duration',  'songs']

    def __init__(self, *args, **kwargs):
        nested = kwargs.pop('nested', False)
        super().__init__(*args, **kwargs)

        if nested:
            self.fields.pop('artist')
            self.fields.pop('songs')

    @extend_schema_field(serializers.ListField)
    def get_songs(self, obj):
        return SongSerializer(obj.songs, many=True, nested=True, context=self.context, required=False).data
    
    def get_album_duration(self, obj):
        total_time = datetime.timedelta(0)
        for song in obj.songs.all():
            total_time += song.duration
            print(type(song.duration))

        # formated_time = str(total_time).split(':')
        # if formated_time[0] != '0':
        #     return f"{formated_time[0]}:{formated_time[1]}:{formated_time[2]}"
        # else:
        #     return "00:00"

        total_seconds = total_time.total_seconds()
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60

        return f"{int(hours)}h {int(minutes)}m {int(seconds)}s"

        # return formated_time
        # return sum(song.duration for song in obj.songs.all())

    def create(self, validated_data):
        try:
            songs_data = validated_data.pop('songs')
        except KeyError:
            songs_data = []
        
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

    class Meta:
        model = Artist
        fields = ['id', 'name', 'image', 'albums']

    @extend_schema_field(serializers.ListField)
    def get_albums(self, obj):
        return AlbumSerializer(obj.albums, many=True, nested=True, context=self.context).data
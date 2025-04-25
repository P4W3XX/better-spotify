from django.db.models import Sum
from rest_framework import serializers
from .models import CustomUser, Album, Song, CurrentPlayback, SongPlayback
from drf_spectacular.utils import extend_schema_field
from django.templatetags.static import static
from mutagen.mp3 import MP3
import datetime
import os
from .utils import get_dominant_color
from datetime import timedelta
from django.utils import timezone
from django.db.models import Count


class SongSerializer(serializers.ModelSerializer):
    artist = serializers.PrimaryKeyRelatedField(read_only=True, source='album.artist.id')
    plays_test = serializers.SerializerMethodField()
    class Meta:
        model = Song
        fields = [
            'id', 'album', 'artist', 'title', 'duration', 
            'file', 'lyrics', 'track_number', 'plays', 'genre',
            'is_indecent', 'featured_artists', 'plays_test'
        ]
        extra_kwargs = {
            'duration': {'read_only': True},
        }


    def get_plays_test(self, obj):
        songs = SongPlayback.objects.filter(song=obj).count()
        return songs

    def __init__(self, *args, **kwargs):
        nested = kwargs.pop('nested', False)
        super().__init__(*args, **kwargs)
        if nested:
            self.fields.pop('lyrics')
            # self.fields.pop('album')

    def validate_lyrics(self, value):
        if value in (None, '', []):
            return {}
        if not isinstance(value, dict):
            raise serializers.ValidationError("Lyrics must be a valid JSON object.")
        return value


    def create(self, validated_data):
        featured_artists = validated_data.pop('featured_artists', [])

        lyrics = validated_data.get('lyrics')
        if not isinstance(lyrics, dict):
            validated_data['lyrics'] = {}

        try:
            artist_to_remove = next(artist for artist in featured_artists if validated_data['album'].artist.id == artist.id)
            featured_artists.remove(artist_to_remove)
        except StopIteration:
            pass

        song = Song.objects.create(duration="0:00", **validated_data)
        song.featured_artists.set(featured_artists)
        
        audio = MP3(song.file.path)
        
        song_duration = datetime.timedelta(seconds=round(audio.info.length))
        song.duration = song_duration
        song.save()

        return song
    
    def update(self, instance, validated_data):
        featured_artists = validated_data.pop('featured_artists', None)
        file = validated_data.get('file', None)
        instance.file = file if file else instance.file

        
        lyrics = validated_data.get('lyrics')
        if not isinstance(lyrics, dict):
            validated_data['lyrics'] = {}

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if featured_artists is not None:
            artist_to_remove = next((artist for artist in featured_artists if instance.album.artist.id == artist.id), None)

            if artist_to_remove:
                featured_artists.remove(artist_to_remove)
            instance.featured_artists.set(featured_artists)

        if file:
            instance.save(update_fields=['file'])

            if os.path.exists(instance.file.path):
                audio = MP3(instance.file.path)
                song_duration = datetime.timedelta(seconds=round(audio.info.length))
                instance.duration = song_duration

        instance.save()
        return instance

class AlbumSerializer(serializers.ModelSerializer):
    songs = serializers.SerializerMethodField()
    album_duration = serializers.SerializerMethodField()
    total_plays = serializers.SerializerMethodField()
    # theme = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = [
            'id', 'title', 'album_type', 'artist', 'image', 
            'release_date', 'album_duration', 'theme',
            'total_plays', 'songs'
        ]
        extra_kwargs = {
            'theme': {'required': False},
        }


    def __init__(self, *args, **kwargs):
        nested = kwargs.pop('nested', False)
        super().__init__(*args, **kwargs)
        if nested:
            self.fields.pop('artist')
            self.fields.pop('songs')

    # @extend_schema_field(serializers.CharField)
    # def get_theme(self, obj):
    #     if obj.image:
    #         image_path = obj.image.path
    #         if os.path.exists(image_path):
    #             dominant_color = get_dominant_color(image_path)
    #             return dominant_color
    #     return None
    

    @extend_schema_field(serializers.ListField)
    def get_songs(self, obj):
        return SongSerializer(obj.songs.order_by('track_number'), many=True, nested=True, context=self.context, required=False).data
    

    @extend_schema_field(serializers.DurationField)
    def get_album_duration(self, obj):
        total_time = datetime.timedelta(0)
        for song in obj.songs.all():
            total_time += song.duration

        total_seconds = total_time.total_seconds()
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60

        return f"{int(hours)}:{int(minutes)}:{int(seconds)}"
    

    @extend_schema_field(serializers.IntegerField)
    def get_total_plays(self, obj):
        return sum(song.plays for song in obj.songs.all())


    def create(self, validated_data):
        try:
            songs_data = validated_data.pop('songs')
        except KeyError:
            songs_data = []
        album = Album.objects.create(**validated_data)
        for song_data in songs_data:
            Song.objects.create(album=album, **song_data)

        if album.theme == "" and album.image:
            image_path = album.image.path
            if os.path.exists(image_path):
                dominant_color = get_dominant_color(image_path)
                album.theme = dominant_color
                album.save()
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

        if instance.theme == "" and instance.image:
            image_path = instance.image.path
            if os.path.exists(image_path):
                dominant_color = get_dominant_color(image_path)
                instance.theme = dominant_color
                instance.save()

        return instance

class ArtistSerializer(serializers.ModelSerializer):
    albums = serializers.SerializerMethodField()
    top_songs = serializers.SerializerMethodField()
    # name = serializers.CharField(source='username', read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'image', 'type', 'albums', 'top_songs']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if self.context.get('many', False):
            self.fields.pop('top_songs')


    @extend_schema_field(serializers.ListField)
    def get_albums(self, obj):
        return AlbumSerializer(obj.albums, many=True, nested=True, context=self.context).data
    
    @extend_schema_field(serializers.ListField)
    def get_top_songs(self, obj):
        limit = 10
        last_month = timezone.now() - timedelta(days=30)
    
        songs_ids = SongPlayback.objects.filter(
            song__album__artist=obj,
            played_at__gte=last_month
        ).values(
            'song'
        ).annotate(
            play_count=Count('id')
        ).order_by('-play_count')[:limit]

        songs = []
        for song in songs_ids:
            song = Song.objects.get(id=song['song'])
            songs.append(song)


        return SongSerializer(songs, many=True, nested=True, context=self.context).data

    
    def to_representation(self, instance):
        album_type = None
        if 'request' in self.context and hasattr(self.context['request'], 'query_params'):
            album_type = self.context['request'].query_params.get('album_type', None)

        if album_type:
            albums = instance.albums.filter(album_type=album_type).order_by('-release_date')
        else:
            albums = instance.albums.all().order_by('-release_date')

        representation = super().to_representation(instance)
        representation['albums'] = AlbumSerializer(albums, many=True, nested=True, context=self.context).data

        if instance.type != 'artist':
            representation.pop('albums', None)

        if instance.image == '':
            request = self.context.get('request')
            if request:
                representation['image'] = request.build_absolute_uri(static('default.jpg'))
            else:
                representation['image'] = static('default.jpg')
        
        return representation
    

class PlaybackActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['play', 'pause', 'resume', 'reset'])
    song_id = serializers.IntegerField(required=False)


class CurrentPlaybackSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrentPlayback
        fields = [
            'song', 'song_id', 
            'started_at', 'progress_seconds', 'paused_at', 
            'is_paused'
        ]


class UserPlaybackHistorySerializer(serializers.Serializer):
    song = SongSerializer(nested=True)
    played_at = serializers.DateTimeField()
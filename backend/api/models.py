from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    username = models.CharField(max_length=255, unique=False)
    email = models.EmailField(unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    image = models.ImageField(upload_to='users/', blank=True, null=True)
    type = models.CharField(max_length=50, choices=[('artist', 'Artist'), ('listener', 'Listener')], default='listener')
    followed_artists = models.ManyToManyField('self', symmetrical=False, related_name='followers', blank=True)
    
    def __str__(self):
        return self.username
    
    @property
    def get_image_url(self):
        if self.image:
            return self.image.url
        return ""
    
    @property
    def number_of_followed_artists(self):
        return self.followed_artists.count()
    
    @property
    def number_of_followers(self):
        return self.followers.count()
    
    def follow(self, artist):
        library = Library.objects.get(user=self)
        if artist == self:
            raise ValueError("You cannot follow yourself.")
        
        if artist in self.followed_artists.all():
            self.followed_artists.remove(artist)
            library_item = LibraryItem.objects.get(library=library, content_type=ContentType.objects.get_for_model(artist), object_id=artist.id)
            library_item.delete()
        else:
            self.followed_artists.add(artist)
            library_item = LibraryItem.objects.create(library=library, content_type=ContentType.objects.get_for_model(artist), object_id=artist.id)
            library_item.save()


    
class Album(models.Model):
    title = models.CharField(max_length=255)
    artist = models.ForeignKey(CustomUser, related_name='albums', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='albums/', blank=True, null=True)
    release_date = models.DateField(default="2023-01-01")
    album_type = models.CharField(max_length=50, choices=[('single', 'Single'), ('album', 'Album'), ('ep', 'EP')], default='album')
    theme = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.title
    
class Song(models.Model):
    title = models.CharField(max_length=255)
    album = models.ForeignKey(Album, related_name='songs', on_delete=models.CASCADE)
    duration = models.DurationField()
    file = models.FileField(upload_to='songs/')
    lyrics = models.JSONField(blank=True, default=dict, null=False)
    track_number = models.PositiveIntegerField()
    plays = models.PositiveIntegerField(default=0)
    featured_artists = models.ManyToManyField(CustomUser, related_name='featured_songs', blank=True)
    is_indecent = models.BooleanField(default=False)
    genre = models.CharField(max_length=50, choices=[
        ('pop', 'Pop'), ('rock', 'Rock'), 
        ('hip-hop', 'Hip-Hop'), ('jazz', 'Jazz'),
        ('blues', 'Blues'), ('country', 'Country'),
        ('electronic', 'Electronic'), ('reggae', 'Reggae'),
        ('rap', 'Rap'), ('r&b', 'R&B'),
        ('classical', 'Classical'), ('other', 'Other')], default='other')

    def __str__(self):
        return self.title
    




class CurrentPlayback(models.Model):
    user = models.OneToOneField(CustomUser, related_name='current_playback', on_delete=models.CASCADE)
    song = models.ForeignKey(Song, related_name='current_playback_song', blank=True, null=True, on_delete=models.SET_NULL)
    
    started_at = models.DateTimeField(null=True, blank=True)
    is_paused = models.BooleanField(default=False)
    paused_at = models.DateTimeField(null=True, blank=True) 
    progress_seconds = models.PositiveIntegerField(default=0)
    logged_playback = models.BooleanField(default=False)

    #add clicked playlists or albums song charfield or json

    # started_at + progress
    
    def __str__(self):
        return f"{self.user.username}'s current playback"
    
    def _log_playback_if_needed(self):
        if self.song and self.progress_seconds >= 3 and not self.logged_playback:
            SongPlayback.objects.create(user=self.user, song=self.song)
            self.logged_playback = True
            self.save(update_fields=['logged_playback'])


    def play(self, song):
        self._log_playback_if_needed()
        self.song = song
        self.started_at = timezone.now()
        self.progress_seconds = 0
        self.paused_at = None
        self.is_paused = False
        # SongPlayback.objects.create(user=self.user, song=song)
        self.logged_playback = False
        self.save()

    def pause(self):
        if not self.is_paused:
            now = timezone.now()
            if self.started_at:
                elapsed = (now - self.started_at).total_seconds()
                self.progress_seconds += int(elapsed)

            self._log_playback_if_needed()

            self.paused_at = now
            self.is_paused = True
            self.save()

    def resume(self):
        if self.is_paused:
            self.started_at = timezone.now()
            self.is_paused = False
            self.paused_at = None
            self.save()

    def reset(self, song=None):
        self._log_playback_if_needed()
        self.song = song
        self.started_at = timezone.now() if song else None
        self.progress_seconds = 0
        self.paused_at = None
        self.is_paused = False
        
        self.logged_playback = False
        self.save()

    def seek_to(self, new_progress_seconds):
        self.progress_seconds = max(0, new_progress_seconds)
        self.started_at = timezone.now()
        self.save()


class SongPlayback(models.Model):
    user = models.ForeignKey(CustomUser, related_name='song_playbacks', on_delete=models.CASCADE)
    song = models.ForeignKey(Song, related_name='playbacks', on_delete=models.CASCADE)
    played_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} played {self.song.title}"
    




class Playlist(models.Model):
    user = models.ForeignKey(CustomUser, related_name='playlists', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='playlists/', blank=True, null=True)
    is_public = models.BooleanField(default=False)
    has_image = models.BooleanField(default=False)
    savings = models.PositiveIntegerField(default=0)

    songs = models.ManyToManyField(Song, through='PlaylistSong', related_name='playlists', blank=True)
    
    def __str__(self):
        return f"{self.user} - {self.name}"
    
    def add_song(self, song):
        max_order = self.playlist_songs.aggregate(models.Max('order'))['order__max'] or 0
        new_order = max_order + 1
        PlaylistSong.objects.create(playlist=self, song=song, order=new_order)
    

class PlaylistSong(models.Model):
    playlist = models.ForeignKey(Playlist, related_name='playlist_songs', on_delete=models.CASCADE)
    song = models.ForeignKey(Song, related_name='playlist_songs', on_delete=models.CASCADE)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['playlist', 'order']

    def __str__(self):
        return f"{self.playlist.name} - {self.song.title} ({self.order})"




class Library(models.Model):
    user = models.OneToOneField(CustomUser, related_name='library', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username}'s Library"
    

class LibraryItem(models.Model):
    library = models.ForeignKey(Library, related_name='items', on_delete=models.CASCADE)
    
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    added_at = models.DateTimeField(auto_now_add=True)
    is_pinned = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.library.user.username} - {self.content_object}"
    
    class Meta:
        ordering = ['-added_at']



class PlaybackHistory(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    played_at = models.DateTimeField(auto_now_add=True)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        ordering = ['-played_at']
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

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
    
    def __str__(self):
        return self.username
    
class Album(models.Model):
    title = models.CharField(max_length=255)
    artist = models.ForeignKey(CustomUser, related_name='albums', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='albums/', blank=True, null=True)
    release_date = models.DateField(default="2023-01-01")
    album_type = models.CharField(max_length=50, choices=[('single', 'Single'), ('album', 'Album'), ('ep', 'EP')], default='album')
    # theme = models.CharField(max_length=50, default='#777777')

    def __str__(self):
        return self.title
    
class Song(models.Model):
    title = models.CharField(max_length=255)
    album = models.ForeignKey(Album, related_name='songs', on_delete=models.CASCADE)
    duration = models.DurationField()
    file = models.FileField(upload_to='songs/')
    lyrics = models.TextField(blank=True, null=True)
    track_number = models.PositiveIntegerField()
    plays = models.PositiveIntegerField(default=0)
    featured_artists = models.ManyToManyField(CustomUser, related_name='featured_songs', blank=True)
    is_indecent = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    

class CurrentPlayback(models.Model):
    user = models.OneToOneField(CustomUser, related_name='current_playback', on_delete=models.CASCADE)
    song = models.ForeignKey(Song, related_name='current_playback_song', blank=True, null=True, on_delete=models.SET_NULL)
    
    started_at = models.DateTimeField(null=True, blank=True)
    is_paused = models.BooleanField(default=False)
    paused_at = models.DateTimeField(null=True, blank=True) 
    progress_seconds = models.PositiveIntegerField(default=0)
    # started_at + progress
    
    def __str__(self):
        return f"{self.user.username}'s current playback"

    def play(self, song):
        self.song = song
        self.started_at = timezone.now()
        self.progress_seconds = 0
        self.paused_at = None
        self.is_paused = False
        self.save()

    def pause(self):
        if not self.is_paused:
            now = timezone.now()
            if self.started_at:
                elapsed = (now - self.started_at).total_seconds()
                self.progress_seconds += int(elapsed)
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
        self.song = song
        self.started_at = timezone.now() if song else None
        self.progress_seconds = 0
        self.paused_at = None
        self.is_paused = False
        self.save()
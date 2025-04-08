from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.
class Artist(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='artists/', blank=True, null=True)

    def __str__(self):
        return self.name
    
class Album(models.Model):
    title = models.CharField(max_length=255)
    artist = models.ForeignKey(Artist, related_name='albums', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='albums/', blank=True, null=True)
    release_date = models.DateField(default="2023-01-01")
    album_type = models.CharField(max_length=50, choices=[('single', 'Single'), ('album', 'Album'), ('ep', 'EP')], default='album')
    theme = models.CharField(max_length=50, default='#777777')

    def __str__(self):
        return self.title
    
class Song(models.Model):
    title = models.CharField(max_length=255)
    duration = models.DurationField()
    file = models.FileField(upload_to='songs/')
    lyrics = models.TextField(blank=True, null=True)
    track_number = models.PositiveIntegerField()
    plays = models.PositiveIntegerField(default=0)

    # if album set foreign key to album else if single set foreign key to artist
    album = models.ForeignKey(Album, related_name='songs', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.title
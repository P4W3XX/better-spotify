from django.db import models

# Create your models here.
class Artist(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
class Album(models.Model):
    title = models.CharField(max_length=255)
    artist = models.ForeignKey(Artist, related_name='albums', on_delete=models.CASCADE)
    img_url = models.CharField(max_length=10000, blank=True, null=True)

    def __str__(self):
        return self.title
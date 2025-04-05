from django.db import models

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

    def __str__(self):
        return self.title
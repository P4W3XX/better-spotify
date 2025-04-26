from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser, CurrentPlayback, Playlist

@receiver(post_save, sender=CustomUser)
def create_current_playback(sender, instance, created, **kwargs):
    if created:
        CurrentPlayback.objects.create(user=instance)
        Playlist.objects.create(user=instance, name="Liked Songs")

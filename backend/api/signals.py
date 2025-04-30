from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser, CurrentPlayback, Playlist, Library, LibraryItem
from django.contrib.contenttypes.models import ContentType

@receiver(post_save, sender=CustomUser)
def create_current_playback(sender, instance, created, **kwargs):
    if created:
        CurrentPlayback.objects.create(user=instance)
        playlist = Playlist.objects.create(user=instance, name="Liked Songs")
        library =Library.objects.create(user=instance)
        LibraryItem.objects.create(library=library, 
                                   content_type=ContentType.objects.get_for_model(Playlist), 
                                   object_id=playlist.id)

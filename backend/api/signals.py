from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import CustomUser, CurrentPlayback, Playlist, Library, LibraryItem, Song, Album
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


@receiver(post_delete, sender=Song)
@receiver(post_delete, sender=Album)
@receiver(post_delete, sender=CustomUser)
@receiver(post_delete, sender=Playlist)
def delete_related_library_item(sender, instance, **kwargs):
    content_type = ContentType.objects.get_for_model(instance)
    try:
        library_item = LibraryItem.objects.get(
            content_type=content_type,
            object_id=instance.id
        )
        library_item.delete()
    except LibraryItem.DoesNotExist:
        pass
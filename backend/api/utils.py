from PIL import Image
from collections import Counter
from datetime import timedelta
from django.utils import timezone
from django.db.models import Count
from .models import SongPlayback

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(*rgb)

def get_dominant_color(image_path):
    image = Image.open(image_path)
    image = image.resize((100, 100))
    image = image.convert('RGB')

    pixels = list(image.getdata())
    most_common = Counter(pixels).most_common(1)[0][0]

    return rgb_to_hex(most_common)

def get_top_songs_last_month(limit=10):
    last_month = timezone.now() - timedelta(days=30)
    return (
        SongPlayback.objects.filter(
            played_at__gte=last_month
        ).values(
            'song__id', 'song__title', 'song__genre'
        ).annotate(
            play_count=Count('id')
        ).order_by('song__genre', '-play_count')[:limit]
    )
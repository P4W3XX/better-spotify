from PIL import Image
from collections import Counter
from datetime import timedelta
from django.utils import timezone
from django.db.models import Count
from .models import SongPlayback, Song
from django.conf import settings
import os

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(*rgb)

def get_dominant_color(image_path, color_format='RGB'):
    image = Image.open(image_path)
    image = image.resize((100, 100))
    # image = image.convert('RGB')
    image = image.convert(color_format)

    pixels = list(image.getdata())
    most_common = Counter(pixels).most_common(1)[0][0]

    if color_format == 'RGBA':
        non_transparent_pixels = [pixel[:3] for pixel in pixels if pixel[3] != 0]

        if not non_transparent_pixels:
            return None

        most_common = Counter(non_transparent_pixels).most_common(1)[0][0]

    return rgb_to_hex(most_common)

def get_top_songs_last_month(limit=10):
    last_month = timezone.now() - timedelta(days=30)
    
    songs = SongPlayback.objects.filter(
        played_at__gte=last_month
    ).values(
        'song__id', 'song__title', 'song__genre'
    ).annotate(
        play_count=Count('id')
    ).order_by('song__genre', '-play_count')[:limit]

    genre_dict = dict(Song._meta.get_field('genre').choices)
    results = []
    for item in songs:
        item['genre_label'] = genre_dict.get(item['song__genre'], item['song__genre'])
        results.append(item)

    return results


def create_collage(images, output_path, size=(800, 800)):
    collage = Image.new('RGBA', size, color=(0, 0, 0, 0))

    num_images = len(images)
    if num_images == 1:
        img = Image.open(os.path.join(settings.MEDIA_ROOT, images[0].lstrip('/'))).resize(size)
        collage.paste(img, (0, 0))

    elif num_images == 2:
        img1 = Image.open(os.path.join(settings.MEDIA_ROOT, images[0].lstrip('/'))).resize((size[0]//2, size[1]//2))
        img2 = Image.open(os.path.join(settings.MEDIA_ROOT, images[1].lstrip('/'))).resize((size[0]//2, size[1]//2))
        collage.paste(img1, (0, 0))
        collage.paste(img2, (size[0]//2, size[1]//2))

    elif num_images == 3 or num_images == 4:
        # img1 = Image.open(images[0]).resize((size[0]//2, size[1]//2))
        # img2 = Image.open(images[1]).resize((size[0]//2, size[1]//2))
        # img3 = Image.open(images[2]).resize((size[0]//2, size[1]//2))
        img1 = Image.open(os.path.join(settings.MEDIA_ROOT, images[0].lstrip('/'))).resize((size[0]//2, size[1]//2))
        img2 = Image.open(os.path.join(settings.MEDIA_ROOT, images[1].lstrip('/'))).resize((size[0]//2, size[1]//2))
        img3 = Image.open(os.path.join(settings.MEDIA_ROOT, images[2].lstrip('/'))).resize((size[0]//2, size[1]//2))
        collage.paste(img1, (0, 0))
        collage.paste(img2, (size[0]//2, 0))
        collage.paste(img3, (0, size[1]//2))
        if num_images == 4:
            img4 = Image.open(images[3]).resize((size[0]//2, size[1]//2))
            collage.paste(img4, (size[0]//2, size[1]//2))

    collage.save(output_path)
    print(f"Collage saved to {output_path}")
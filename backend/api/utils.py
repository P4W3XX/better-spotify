from PIL import Image
from collections import Counter

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(*rgb)

def get_dominant_color(image_path):
    image = Image.open(image_path)
    image = image.resize((100, 100))
    image = image.convert('RGB')

    pixels = list(image.getdata())
    most_common = Counter(pixels).most_common(1)[0][0]

    return rgb_to_hex(most_common)
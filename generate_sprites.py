#!/usr/bin/env python3
"""
Sprite Generator for Find Smudge
Creates pixel art sprites for Smudge the tabby cat
"""

from PIL import Image, ImageDraw
import random

def rand(a, b):
    return random.uniform(a, b)

def choose(items):
    return random.choice(items)

# Tabby cat colors (Maine Coon style)
COLORS = {
    'bg': (0, 0, 0, 0),  # Transparent
    'fur_base': (210, 150, 100),  # Warm tan
    'fur_stripe': (140, 90, 60),  # Dark brown stripes
    'fur_light': (240, 200, 160),  # Cream highlights
    'eyes': (120, 180, 100),  # Green eyes
    'nose': (200, 120, 120),  # Pink nose
    'whisker': (240, 240, 240),  # White whiskers
}

def draw_smudge_idle():
    """Smudge sitting idle - fluffy tabby"""
    img = Image.new('RGBA', (64, 64), COLORS['bg'])
    draw = ImageDraw.Draw(img)

    # Fluffy body
    draw.ellipse([20, 35, 44, 55], fill=COLORS['fur_base'])

    # Tabby stripes on body
    for i, y in enumerate([37, 42, 47, 52]):
        draw.line([22, y, 42, y], fill=COLORS['fur_stripe'], width=1)

    # Head
    draw.ellipse([22, 20, 42, 40], fill=COLORS['fur_base'])

    # Ears (pointy Maine Coon style)
    draw.polygon([24, 22, 28, 16, 32, 22], fill=COLORS['fur_base'])
    draw.polygon([32, 22, 36, 16, 40, 22], fill=COLORS['fur_base'])

    # Ear tufts
    draw.line([28, 16, 28, 14], fill=COLORS['fur_light'], width=1)
    draw.line([36, 16, 36, 14], fill=COLORS['fur_light'], width=1)

    # Eyes (big green eyes)
    draw.ellipse([26, 28, 30, 32], fill=COLORS['eyes'])
    draw.ellipse([34, 28, 38, 32], fill=COLORS['eyes'])

    # Pupils
    draw.ellipse([27, 29, 29, 31], fill=(0, 0, 0))
    draw.ellipse([35, 29, 37, 31], fill=(0, 0, 0))

    # Nose
    draw.polygon([32, 34, 30, 36, 34, 36], fill=COLORS['nose'])

    # Whiskers
    draw.line([22, 34, 16, 33], fill=COLORS['whisker'], width=1)
    draw.line([22, 36, 16, 36], fill=COLORS['whisker'], width=1)
    draw.line([42, 34, 48, 33], fill=COLORS['whisker'], width=1)
    draw.line([42, 36, 48, 36], fill=COLORS['whisker'], width=1)

    # Fluffy chest
    draw.ellipse([28, 38, 36, 44], fill=COLORS['fur_light'])

    # Tail (fluffy, curled)
    draw.ellipse([14, 40, 24, 50], fill=COLORS['fur_base'])
    draw.line([16, 44, 20, 46], fill=COLORS['fur_stripe'], width=1)

    return img

def draw_smudge_jumping():
    """Smudge mid-jump"""
    img = Image.new('RGBA', (64, 64), COLORS['bg'])
    draw = ImageDraw.Draw(img)

    # Stretched body (jumping)
    draw.ellipse([18, 20, 46, 40], fill=COLORS['fur_base'])

    # Tabby stripes
    for x in [22, 28, 34, 40]:
        draw.line([x, 22, x, 38], fill=COLORS['fur_stripe'], width=1)

    # Head
    draw.ellipse([38, 18, 52, 32], fill=COLORS['fur_base'])

    # Ears
    draw.polygon([40, 20, 43, 14, 46, 20], fill=COLORS['fur_base'])
    draw.polygon([46, 20, 49, 14, 52, 20], fill=COLORS['fur_base'])

    # Eyes (excited)
    draw.ellipse([42, 24, 45, 27], fill=COLORS['eyes'])
    draw.ellipse([47, 24, 50, 27], fill=COLORS['eyes'])

    # Nose
    draw.polygon([45, 28, 44, 29, 46, 29], fill=COLORS['nose'])

    # Front legs (extended forward)
    draw.ellipse([40, 36, 46, 48], fill=COLORS['fur_base'])
    draw.line([41, 40, 43, 44], fill=COLORS['fur_stripe'], width=1)

    # Back legs (bent)
    draw.ellipse([20, 32, 26, 42], fill=COLORS['fur_base'])

    # Tail (straight back, excited)
    draw.ellipse([8, 24, 20, 32], fill=COLORS['fur_base'])
    draw.line([10, 26, 14, 28], fill=COLORS['fur_stripe'], width=2)

    # Motion lines
    for i in range(3):
        draw.line([12 + i*4, 16, 14 + i*4, 18], fill=(200, 200, 200), width=1)

    return img

def draw_smudge_searching():
    """Smudge searching/sniffing"""
    img = Image.new('RGBA', (64, 64), COLORS['bg'])
    draw = ImageDraw.Draw(img)

    # Body (crouched)
    draw.ellipse([16, 32, 44, 50], fill=COLORS['fur_base'])

    # Stripes
    for y in [34, 39, 44]:
        draw.line([18, y, 42, y], fill=COLORS['fur_stripe'], width=1)

    # Head (lowered, sniffing)
    draw.ellipse([30, 24, 52, 44], fill=COLORS['fur_base'])

    # Ears
    draw.polygon([32, 26, 35, 20, 38, 26], fill=COLORS['fur_base'])
    draw.polygon([42, 26, 45, 20, 48, 26], fill=COLORS['fur_base'])

    # Eyes (focused down)
    draw.ellipse([36, 32, 40, 36], fill=COLORS['eyes'])
    draw.ellipse([44, 32, 48, 36], fill=COLORS['eyes'])

    # Pupils (looking down)
    draw.ellipse([37, 34, 39, 35], fill=(0, 0, 0))
    draw.ellipse([45, 34, 47, 35], fill=(0, 0, 0))

    # Nose (prominent)
    draw.polygon([42, 38, 40, 40, 44, 40], fill=COLORS['nose'])

    # Whiskers (forward)
    draw.line([36, 38, 30, 37], fill=COLORS['whisker'], width=1)
    draw.line([36, 40, 30, 40], fill=COLORS['whisker'], width=1)
    draw.line([48, 38, 54, 37], fill=COLORS['whisker'], width=1)
    draw.line([48, 40, 54, 40], fill=COLORS['whisker'], width=1)

    # Paws (front, searching)
    draw.ellipse([38, 48, 44, 54], fill=COLORS['fur_light'])

    # Question mark (wondering where it is)
    draw.text((12, 16), "?", fill=(255, 200, 100))

    return img

def draw_smudge_running():
    """Smudge running (zoomies!)"""
    img = Image.new('RGBA', (64, 64), COLORS['bg'])
    draw = ImageDraw.Draw(img)

    # Elongated body (speedy)
    draw.ellipse([10, 24, 48, 42], fill=COLORS['fur_base'])

    # Speed stripes
    for i, x in enumerate([14, 22, 30, 38]):
        draw.line([x, 26 + i, x, 40 - i], fill=COLORS['fur_stripe'], width=1)

    # Head (forward)
    draw.ellipse([42, 20, 58, 36], fill=COLORS['fur_base'])

    # Ears (flattened back by wind)
    draw.polygon([44, 24, 46, 20, 48, 26], fill=COLORS['fur_base'])
    draw.polygon([52, 24, 54, 20, 56, 26], fill=COLORS['fur_base'])

    # Eyes (determined)
    draw.ellipse([46, 26, 49, 29], fill=COLORS['eyes'])
    draw.ellipse([51, 26, 54, 29], fill=COLORS['eyes'])

    # Nose
    draw.polygon([49, 30, 48, 31, 50, 31], fill=COLORS['nose'])

    # Legs (motion blur)
    for i, x in enumerate([16, 24, 32, 40]):
        y = 38 if i % 2 == 0 else 42
        draw.ellipse([x, y, x+6, y+8], fill=COLORS['fur_base'], outline=None)

    # Tail (streaming behind)
    draw.ellipse([4, 26, 16, 36], fill=COLORS['fur_base'])
    draw.line([6, 28, 10, 32], fill=COLORS['fur_stripe'], width=2)

    # Motion lines
    for i in range(4):
        draw.line([4 + i*6, 18, 6 + i*6, 20], fill=(200, 150, 100, 150), width=2)
        draw.line([4 + i*6, 44, 6 + i*6, 46], fill=(200, 150, 100, 150), width=2)

    return img

def draw_laundry_basket():
    """Laundry basket with warm clothes"""
    img = Image.new('RGBA', (128, 128), COLORS['bg'])
    draw = ImageDraw.Draw(img)

    # Basket (wicker style)
    basket_color = (160, 120, 80)
    draw.rectangle([30, 60, 98, 110], fill=basket_color, outline=(120, 90, 60), width=2)

    # Wicker pattern
    for y in range(65, 105, 5):
        for x in range(35, 95, 5):
            draw.line([x, y, x+3, y], fill=(140, 100, 70), width=1)

    # Warm clothes (steaming)
    clothes = [(180, 200, 220), (220, 180, 200), (200, 220, 180)]
    for i, color in enumerate(clothes):
        x = 40 + i * 18
        y = 50 - i * 5
        draw.ellipse([x, y, x+20, y+20], fill=color)

    # Steam (wavy lines)
    for i in range(5):
        x = 45 + i * 12
        y_start = 30
        for j in range(3):
            y = y_start - j * 8
            draw.line([x + (j % 2) * 2, y, x + ((j+1) % 2) * 2, y-6], fill=(220, 220, 255, 180), width=2)

    return img

def draw_martini_glass():
    """Martini glass cat toy"""
    img = Image.new('RGBA', (64, 64), COLORS['bg'])
    draw = ImageDraw.Draw(img)

    # Glass (triangle top)
    draw.polygon([20, 40, 32, 16, 44, 40], fill=(200, 240, 255, 200), outline=(150, 180, 200), width=2)

    # Stem
    draw.rectangle([30, 40, 34, 52], fill=(180, 180, 180))

    # Base
    draw.ellipse([26, 50, 38, 56], fill=(180, 180, 180))

    # Olive (cat toy part)
    draw.ellipse([28, 26, 36, 34], fill=(100, 150, 80))

    # Toothpick
    draw.line([32, 20, 32, 28], fill=(200, 180, 150), width=1)

    # Sparkle (it's a toy!)
    draw.polygon([16, 20, 18, 22, 20, 20, 18, 18], fill=(255, 255, 255))

    return img

def draw_neighborhood_map():
    """Simple neighborhood map"""
    img = Image.new('RGBA', (256, 256), COLORS['bg'])
    draw = ImageDraw.Draw(img)

    # Background (grass)
    draw.rectangle([0, 0, 256, 256], fill=(150, 200, 130))

    # Roads
    draw.rectangle([0, 120, 256, 136], fill=(100, 100, 100))
    draw.rectangle([120, 0, 136, 256], fill=(100, 100, 100))

    # Houses (simple squares)
    houses = [
        (40, 40, 'Your House', (255, 200, 150)),
        (180, 40, 'Neighbor A', (200, 220, 255)),
        (40, 180, 'Neighbor B', (255, 220, 200)),
        (180, 180, 'Neighbor C', (220, 255, 220)),
    ]

    for x, y, name, color in houses:
        # House
        draw.rectangle([x, y, x+60, y+60], fill=color, outline=(100, 80, 60), width=2)
        # Roof
        draw.polygon([x-5, y, x+30, y-20, x+65, y], fill=(150, 100, 80))
        # Door
        draw.rectangle([x+22, y+35, x+38, y+58], fill=(120, 80, 60))

    return img

def draw_ice_cream_cone():
    """Ice cream cone toy"""
    img = Image.new('RGBA', (64, 64), COLORS['bg'])
    draw = ImageDraw.Draw(img)

    # Cone (waffle texture)
    draw.polygon([24, 50, 32, 20, 40, 50], fill=(210, 160, 110))

    # Waffle pattern
    for i in range(5):
        y = 25 + i * 6
        draw.line([26 + i, y, 38 - i, y], fill=(180, 130, 80), width=1)

    # Ice cream scoops
    # Bottom scoop (strawberry pink)
    draw.ellipse([22, 18, 42, 38], fill=(255, 180, 200))

    # Middle scoop (vanilla)
    draw.ellipse([24, 10, 40, 26], fill=(255, 250, 220))

    # Top scoop (chocolate)
    draw.ellipse([26, 4, 38, 16], fill=(150, 100, 70))

    # Sprinkles!
    sprinkle_colors = [(255, 100, 100), (100, 200, 255), (255, 255, 100), (150, 255, 150)]
    for i in range(8):
        x = 26 + rand(0, 10)
        y = 8 + rand(0, 12)
        color = choose(sprinkle_colors)
        draw.line([x, y, x+2, y+1], fill=color, width=2)

    # Cherry on top!
    draw.ellipse([30, 2, 34, 6], fill=(220, 50, 50))
    draw.line([32, 2, 32, 0], fill=(100, 150, 80), width=1)

    return img

def draw_mom_dad_bed():
    """Mom and dad in bed - Dad on LEFT (sleeping), Mom on RIGHT (awake with headache)"""
    img = Image.new('RGBA', (128, 128), COLORS['bg'])
    draw = ImageDraw.Draw(img)

    # Bed
    draw.rectangle([10, 60, 118, 110], fill=(200, 180, 160), outline=(150, 130, 110), width=2)

    # Blanket
    draw.rectangle([15, 70, 113, 105], fill=(180, 200, 220))

    # Dad (left side) - sleeping
    # Hair (short dark hair)
    draw.ellipse([23, 62, 52, 78], fill=(80, 60, 40))

    # Head
    draw.ellipse([25, 65, 50, 90], fill=(220, 190, 170))

    # Neck/shoulders
    draw.ellipse([28, 85, 47, 98], fill=(220, 190, 170))

    # Eyes (closed, peaceful)
    draw.arc([30, 77, 36, 81], 0, 180, fill=(0, 0, 0), width=2)  # Left eye closed
    draw.arc([40, 77, 46, 81], 0, 180, fill=(0, 0, 0), width=2)  # Right eye closed

    # Slight smile (sleeping peacefully)
    draw.arc([32, 82, 43, 88], 0, 180, fill=(180, 150, 130), width=1)

    # Zzz's for dad (on left side)
    for i, size in enumerate([12, 10, 8]):
        draw.text((8 + i*8, 58 - i*8), "Z", fill=(150, 150, 200))

    # Mom (right side) - awake with headache
    # Hair (flowing brown hair)
    draw.ellipse([71, 50, 83, 70], fill=(120, 80, 50))  # Left side hair
    draw.ellipse([98, 50, 110, 70], fill=(120, 80, 50))  # Right side hair
    draw.ellipse([75, 48, 106, 68], fill=(120, 80, 50))  # Top hair

    # Head
    draw.ellipse([78, 55, 103, 80], fill=(230, 200, 180))

    # Neck/shoulders visible above blanket
    draw.ellipse([81, 75, 100, 88], fill=(230, 200, 180))

    # Eyes (tired, open eyes)
    draw.ellipse([81, 65, 87, 71], fill=(255, 255, 255))  # Left eye white
    draw.ellipse([94, 65, 100, 71], fill=(255, 255, 255))  # Right eye white
    draw.ellipse([83, 67, 85, 69], fill=(100, 150, 180))  # Left pupil (blue)
    draw.ellipse([96, 67, 98, 69], fill=(100, 150, 180))  # Right pupil (blue)

    # Nose
    draw.ellipse([89, 72, 92, 75], fill=(220, 180, 170))

    # Slight smile (relieved to get ice cream)
    draw.arc([85, 72, 96, 78], 0, 180, fill=(200, 150, 140), width=1)

    return img

def generate_all_sprites():
    """Generate all sprites for Find Smudge"""
    print("Generating Find Smudge sprites...")

    sprites = {
        'smudge_idle.png': draw_smudge_idle(),
        'smudge_jumping.png': draw_smudge_jumping(),
        'smudge_searching.png': draw_smudge_searching(),
        'smudge_running.png': draw_smudge_running(),
        'laundry_basket.png': draw_laundry_basket(),
        'martini_glass.png': draw_martini_glass(),
        'neighborhood_map.png': draw_neighborhood_map(),
        'ice_cream_cone.png': draw_ice_cream_cone(),
        'mom_dad_bed.png': draw_mom_dad_bed(),
    }

    for filename, img in sprites.items():
        filepath = f'assets/sprites/{filename}'
        img.save(filepath)
        print(f"  ✓ {filename}")

    print(f"\nGenerated {len(sprites)} sprites!")

if __name__ == '__main__':
    generate_all_sprites()

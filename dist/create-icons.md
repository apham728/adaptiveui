# Creating Extension Icons

The Chrome extension requires PNG icons in three sizes: 16x16, 48x48, and 128x128.

## Quick Method: Using Online Converter

1. Use the `icon.svg` file in this directory
2. Go to an online SVG to PNG converter (e.g., https://cloudconvert.com/svg-to-png)
3. Upload `icon.svg`
4. Convert to PNG at these sizes:
   - 16x16 → save as `icon16.png`
   - 48x48 → save as `icon48.png`
   - 128x128 → save as `icon128.png`
5. Place all three PNG files in the `public/` directory

## Using ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# From the public/ directory
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

## Using Inkscape (Command Line)

If you have Inkscape installed:

```bash
# From the public/ directory
inkscape icon.svg --export-filename=icon16.png --export-width=16 --export-height=16
inkscape icon.svg --export-filename=icon48.png --export-width=48 --export-height=48
inkscape icon.svg --export-filename=icon128.png --export-width=128 --export-height=128
```

## Manual Design

You can also design your own icons in any graphics editor:
- Create square images (same width and height)
- Export as PNG
- Save with the correct filenames

The current `icon.svg` design shows a focus/accessibility symbol with a centered circle and radiating lines, but you can customize this however you'd like.

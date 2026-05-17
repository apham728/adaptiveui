# ⚡ Next Steps to Use as Chrome Extension

## Current Status: ✅ Preview Ready

You're currently viewing the **extension popup UI** in Figma Make. The three toggle switches you see are what users will interact with when using the extension in Chrome.

## To Make This a Working Chrome Extension

### Required Steps (in order):

#### 1. ⚠️ Create Extension Icons (Required)
The extension **will not load** without these PNG icons.

**Quick Method:**
1. Go to https://cloudconvert.com/svg-to-png
2. Upload `public/icon.svg`
3. Convert to three sizes:
   - 16×16 pixels → save as `public/icon16.png`
   - 48×48 pixels → save as `public/icon48.png`
   - 128×128 pixels → save as `public/icon128.png`

**Alternative:** See detailed instructions in `public/create-icons.md`

#### 2. 🏗️ Build the Extension
```bash
pnpm run build
```

This creates a `dist/` folder with all the extension files.

#### 3. 🚀 Load in Chrome
1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right)
4. Click **Load unpacked**
5. Select the `dist/` folder
6. ✅ Extension is now loaded!

#### 4. 🧪 Test It
1. Click the extension icon in Chrome toolbar
2. Toggle the modes on/off
3. Visit any website (try Wikipedia, Reddit, or Amazon)
4. See the modes in action!

## What Each File Does

```
📦 Your Extension
├── 🎨 public/
│   ├── manifest.json         ← Chrome extension config
│   ├── focus-mode.css       ← Dims distractions
│   ├── simple-mode.css      ← Simplifies text
│   ├── calm-mode.css        ← Enhances readability
│   └── 🚨 icon*.png         ← REQUIRED: Create these!
│
├── 💻 src/
│   ├── app/App.tsx          ← The UI you see now
│   ├── content.ts           ← Runs on every webpage
│   └── background.ts        ← Extension background worker
│
└── 📚 Documentation
    ├── README.md            ← Project overview
    ├── OVERVIEW.md          ← Technical deep-dive
    ├── GETTING_STARTED.md   ← Setup guide
    └── EXTENSION_README.md  ← Feature docs
```

## Quick Test Without Building

Want to see how the modes would look on a page? You can manually:

1. Open any website
2. Open DevTools (F12)
3. In Console, paste:
   ```javascript
   document.body.classList.add('accessibility-focus-mode');
   ```
4. See Focus Mode styles (if you injected the CSS)

## Troubleshooting

### "Extension not loading"
- ✅ Check that `icon16.png`, `icon48.png`, `icon128.png` exist in `public/`
- ✅ Run `pnpm run build` successfully
- ✅ Load the `dist/` folder (not the root folder)

### "Modes not applying"
- ✅ Check browser console for errors
- ✅ Reload the extension from `chrome://extensions/`
- ✅ Reload the webpage you're testing on

### "Build errors"
- ✅ Run `pnpm install` first
- ✅ Make sure Node.js is installed
- ✅ Check for typos in modified files

## What's Already Done ✅

- ✅ React popup UI with three toggle switches
- ✅ TypeScript content script for applying modes
- ✅ CSS files for all three modes
- ✅ Background service worker
- ✅ Chrome extension manifest (v3)
- ✅ Complete documentation
- ✅ Proper project structure

## What You Need to Do ⚡

- ⚠️ Create three PNG icon files (see step 1 above)
- ⚠️ Run build command
- ⚠️ Load extension in Chrome

## Customization Ideas

Once it's working, you can:

- 🎨 Change colors in CSS files
- 🎯 Adjust dimming opacity in `focus-mode.css`
- 📝 Add more jargon words in `content.ts`
- 🎛️ Add custom selectors for your favorite sites
- ⚙️ Create an options page for user preferences
- ⌨️ Add keyboard shortcuts
- 🌍 Add translation support

## Resources

- **Chrome Extension Docs**: https://developer.chrome.com/docs/extensions/
- **Manifest V3 Guide**: https://developer.chrome.com/docs/extensions/mv3/intro/
- **Chrome Storage API**: https://developer.chrome.com/docs/extensions/reference/storage/

## Support

If you run into issues:
1. Check the documentation files listed above
2. Look at browser console for errors
3. Verify all files are in correct locations
4. Make sure icons are created

---

**You're one icon conversion away from a working extension!** 🎯

Just create the three PNG files and run `pnpm run build` → `Load unpacked` in Chrome.

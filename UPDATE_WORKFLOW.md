# 🔄 Extension Update Workflow

## Quick Answer
**Do I need to run `pnpm install` again?**
- ✅ YES - If you copied the updated `package.json` (I added `@types/chrome`)
- ❌ NO - For regular code changes in `src/` or `public/`

---

## Complete Update Process

### First Time (After Getting My Changes)

```bash
# 1. Copy all modified files to your local machine
# 2. Install dependencies (one time)
pnpm install

# 3. Build the extension
pnpm run build

# 4. Load in Chrome (if not already loaded)
#    chrome://extensions/ → Load unpacked → select dist/

# 5. Test!
#    Toggle Focus Mode → visit any article site
```

### Every Time You Make Changes

```bash
# 1. Edit files in src/ or public/
# 2. Rebuild
pnpm run build

# 3. Reload extension
#    chrome://extensions/ → find extension → click reload icon ↻

# 4. Refresh test page
#    Reload the webpage you're testing on
```

---

## What Each Command Does

### `pnpm install`
- Downloads and installs npm packages
- Runs build scripts for dependencies
- Creates/updates `node_modules/`
- Creates/updates `pnpm-lock.yaml`

**When to run:**
- First time setup
- After `package.json` changes
- After deleting `node_modules/`
- After git pulling dependency updates

**DON'T run for:**
- Regular code edits
- CSS changes
- Documentation updates

### `pnpm run build`
- Compiles TypeScript to JavaScript
- Bundles React components
- Processes Tailwind CSS
- Creates production files in `dist/`
- Prepares extension for Chrome

**When to run:**
- After every code change
- Before testing in Chrome
- Before sharing/distributing extension

**Output:**
```
dist/
├── index.html           # Popup HTML
├── assets/
│   └── index-*.js      # Bundled popup code
├── content.js          # Content script
├── background.js       # Service worker
├── *.css              # Copied CSS files
└── manifest.json       # Copied manifest
```

---

## Development Workflow Options

### Option 1: Manual Build (Default)
```bash
# Edit code
vim src/content.ts

# Build
pnpm run build

# Reload extension in Chrome
# Refresh test page
```

### Option 2: Watch Mode (Auto-rebuild)
```bash
# Start watch mode
pnpm run build --watch

# Now edits auto-trigger rebuild!
# You still need to:
# - Reload extension in Chrome
# - Refresh test page
```

### Option 3: Add NPM Script for Convenience
Add to `package.json`:
```json
{
  "scripts": {
    "build": "vite build",
    "watch": "vite build --watch",
    "dev": "vite build --watch"
  }
}
```

Then use:
```bash
pnpm run watch   # or pnpm run dev
```

---

## Chrome Extension Reload

### Method 1: Click Reload Icon
1. Open `chrome://extensions/`
2. Find "Accessibility Modes"
3. Click ↻ reload icon
4. Extension updated!

### Method 2: Keyboard Shortcut
1. Focus on `chrome://extensions/` page
2. Navigate to your extension
3. Press `Ctrl+R` or `Cmd+R`

### Method 3: Remove & Re-add (Nuclear Option)
1. Click "Remove" on extension
2. Click "Load unpacked"
3. Select `dist/` folder
4. Fresh install!

**Note:** This clears stored settings (mode preferences)

---

## Testing the Update Worked

### Check First-Sentence Highlighting
1. Build extension: `pnpm run build`
2. Reload in Chrome
3. Visit https://en.wikipedia.org/wiki/Web_accessibility
4. Click extension icon
5. Toggle Focus Mode ON
6. Look for blue-highlighted first sentences! ✨

### Verify in DevTools
```javascript
// In webpage console (F12)
// Check if class is applied
document.body.classList.contains('accessibility-focus-mode')
// Should return: true

// Check for highlighted sentences
document.querySelectorAll('.focus-first-sentence').length
// Should return: number of paragraphs
```

---

## Common Update Issues

### "Changes not showing up"
**Checklist:**
- ✅ Ran `pnpm run build`?
- ✅ Reloaded extension in Chrome?
- ✅ Refreshed the test webpage?
- ✅ Cleared browser cache (Ctrl+Shift+R)?

### "Build fails"
```bash
# Clear and rebuild
rm -rf dist node_modules/.vite
pnpm run build
```

### "Extension broken after update"
```bash
# Nuclear option - fresh rebuild
rm -rf dist
pnpm run build

# Reload extension in Chrome
```

### "Lost my changes"
If you edited files in `dist/` instead of `src/`:
- ⚠️ Files in `dist/` are auto-generated
- ⚠️ They get overwritten on every build
- ✅ Always edit files in `src/` and `public/`

---

## File Change → Update Mapping

| You changed... | Need to... |
|----------------|------------|
| `src/content.ts` | Build → Reload extension → Refresh page |
| `src/app/App.tsx` | Build → Reload extension |
| `public/focus-mode.css` | Build → Reload extension → Refresh page |
| `public/manifest.json` | Build → Reload extension |
| `package.json` | Install → Build → Reload extension |
| `*.md` files | Nothing (just documentation) |

---

## Pro Tips

### Faster Development Cycle
```bash
# Terminal 1: Watch mode
pnpm run build --watch

# Make changes → auto-builds

# Terminal 2: Chrome reloader (if you install extension-reloader)
# Or manually: click reload in chrome://extensions/
```

### Check Build Output
```bash
# See what was built
ls -lh dist/

# Should see:
# - content.js
# - background.js  
# - index.html
# - assets/
# - *.css files
# - manifest.json
```

### Verify TypeScript Compiled
```bash
# content.ts should become content.js
ls -lh dist/content.js

# Check it's recent
stat dist/content.js
```

---

## Deployment Checklist

Before sharing your extension:

- [ ] `pnpm run build` completes without errors
- [ ] All three modes work (Focus, Simple, Calm)
- [ ] First-sentence highlighting appears in Focus Mode
- [ ] PNG icons created (`icon16.png`, `icon48.png`, `icon128.png`)
- [ ] Extension loads in Chrome without errors
- [ ] Tested on multiple websites
- [ ] Console shows no errors

---

## Summary

**Regular updates:**
```bash
pnpm run build
# Reload in chrome://extensions/
```

**After package.json changes:**
```bash
pnpm install
pnpm run build
# Reload in chrome://extensions/
```

**That's it!** 🚀

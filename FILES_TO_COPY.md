# Files to Copy to Your Local Machine

## Critical Files (Must Copy These)

### 1. Configuration Files
- `.npmrc` - Fixed pnpm build scripts issue
- `package.json` - Dependencies (you already have this)
- `vite.config.ts` - Updated build configuration

### 2. Source Files
- `src/app/App.tsx` - Extension popup UI
- `src/content.ts` - Content script with first-sentence highlighting
- `src/background.ts` - Background service worker

### 3. Public Files (Extension Assets)
- `public/manifest.json` - Chrome extension configuration
- `public/focus-mode.css` - Focus mode styles (NEW: first-sentence highlighting)
- `public/simple-mode.css` - Simple mode styles
- `public/calm-mode.css` - Calm mode styles
- `public/icon.svg` - Extension icon template

## Documentation Files (Optional but Recommended)

- `README.md` - Project overview
- `OVERVIEW.md` - Technical architecture
- `GETTING_STARTED.md` - Setup guide
- `NEXT_STEPS.md` - Next steps guide
- `QUICK_REFERENCE.md` - Quick reference
- `EXTENSION_README.md` - User documentation
- `TROUBLESHOOTING.md` - Troubleshooting guide
- `FOCUS_MODE_READING_GUIDE.md` - First-sentence highlighting guide
- `public/create-icons.md` - Icon creation instructions

## How to Copy

### Method 1: Use Read tool and copy/paste
For each file above:
1. Ask me to show you the file content (I can display it)
2. Copy the content
3. Create/update the file on your local machine

### Method 2: Download from UI (if available)
If your environment has a download feature:
1. Right-click each file
2. Select "Download"

### Method 3: Git (if you want version control)
On your local machine:
```bash
cd ~/path/to/your/project
git init
# Copy files from workspace
git add .
git commit -m "Add accessibility modes extension with first-sentence highlighting"
```

## Files Changed in This Session

**Modified:**
1. `src/app/App.tsx` - Added first-sentence description
2. `src/content.ts` - Added highlightFirstSentences() function
3. `public/focus-mode.css` - Added .focus-first-sentence styles
4. `.npmrc` - Added build script permissions
5. `README.md` - Updated features
6. `OVERVIEW.md` - Updated technical details
7. `EXTENSION_README.md` - Updated feature list
8. `QUICK_REFERENCE.md` - Added customization examples

**New files created:**
9. `FOCUS_MODE_READING_GUIDE.md` - Complete guide for new feature
10. `TROUBLESHOOTING.md` - Common issues and solutions

## Quick Test After Copying

```bash
# On your local machine
pnpm install
pnpm run build

# Should complete without errors
# Then load dist/ folder in Chrome
```

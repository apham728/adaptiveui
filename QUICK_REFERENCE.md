# 📋 Quick Reference Card

## Chrome Extension Quick Commands

```bash
# Install dependencies
pnpm install

# Build for Chrome
pnpm run build

# Chrome extension page
chrome://extensions/
```

## Mode CSS Classes

```css
/* Applied to <body> when modes are active */
.accessibility-focus-mode
.accessibility-simple-mode
.accessibility-calm-mode
```

## Important Selectors

### Focus Mode - Dimmed Elements
```javascript
'aside', '[role="complementary"]', '.sidebar', 
'.ad', '.advertisement', 'nav:not(header nav)'
```

### Focus Mode - Highlighted Elements
```javascript
'main', '[role="main"]', 'article', '.main-content'
```

## File Quick Access

| Want to... | Edit this file |
|------------|---------------|
| Change popup design | `src/app/App.tsx` |
| Modify mode behavior | `src/content.ts` |
| Adjust Focus styling | `public/focus-mode.css` |
| Adjust Simple styling | `public/simple-mode.css` |
| Adjust Calm styling | `public/calm-mode.css` |
| Change extension settings | `public/manifest.json` |
| Add background logic | `src/background.ts` |

## Common Customizations

### Change dim opacity (Focus Mode)
**File**: `public/focus-mode.css`
```css
.accessibility-focus-mode .focus-mode-dimmed {
  opacity: 0.35 !important; /* Change this number (0-1) */
}
```

### Customize first sentence highlighting (Focus Mode)
**File**: `public/focus-mode.css`
```css
/* Change background color/intensity */
.accessibility-focus-mode .focus-first-sentence {
  background: linear-gradient(
    to bottom,
    rgba(59, 130, 246, 0.15) 0%,  /* Top color - adjust opacity */
    rgba(59, 130, 246, 0.08) 100% /* Bottom color */
  ) !important;
  border-left: 3px solid rgba(59, 130, 246, 0.4) !important;
}

/* Or use a simple underline instead */
.accessibility-focus-mode .focus-first-sentence {
  background: none !important;
  border-left: none !important;
  border-bottom: 2px solid rgba(59, 130, 246, 0.5) !important;
}
```

### Add more jargon words (Simple Mode)
**File**: `src/content.ts`
```typescript
const complexWords = /\b(utilize|leverage|synergy|YOUR_WORD)\b/gi;
```

### Change font size (Calm Mode)
**File**: `public/calm-mode.css`
```css
.accessibility-calm-mode.calm-text-enhanced p {
  font-size: 18px !important; /* Change this value */
}
```

### Modify background color (Calm Mode)
**File**: `public/calm-mode.css`
```css
.accessibility-calm-mode {
  background: #f9fafb !important; /* Change this color */
}
```

## Extension Permissions

```json
"permissions": ["storage", "activeTab", "scripting"]
"host_permissions": ["<all_urls>"]
```

- **storage**: Save user preferences
- **activeTab**: Modify current tab
- **scripting**: Inject content scripts
- **<all_urls>**: Work on all websites

## Chrome Storage Structure

```javascript
{
  focusMode: boolean,
  simpleMode: boolean,
  calmMode: boolean
}
```

## Message Protocol

```javascript
// Popup → Content Script
{
  type: 'TOGGLE_MODE',
  mode: 'focusMode' | 'simpleMode' | 'calmMode',
  enabled: boolean
}
```

## Load Extension Steps

1. Build: `pnpm run build`
2. Chrome: `chrome://extensions/`
3. Enable: Developer mode
4. Load: Click "Load unpacked"
5. Select: `dist/` folder
6. Done: Extension appears in toolbar

## Reload After Changes

1. Make code changes
2. Run `pnpm run build`
3. Go to `chrome://extensions/`
4. Click reload icon on your extension
5. Refresh webpage to see changes

## Testing Checklist

- [ ] Toggle Focus Mode → sidebars dim
- [ ] Toggle Simple Mode → tooltips appear
- [ ] Toggle Calm Mode → text enlarges
- [ ] Modes persist after closing popup
- [ ] Modes work on different websites
- [ ] Multiple modes work together
- [ ] Turning off removes changes

## Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| Extension won't load | Create PNG icons in `public/` |
| Modes don't apply | Check console, reload extension |
| Styles not working | Verify CSS files in manifest |
| Can't save state | Check storage permission |
| Wrong folder loaded | Load `dist/`, not root |

## Browser DevTools

```javascript
// Check if mode is active
document.body.classList.contains('accessibility-focus-mode')

// Manually add mode (testing)
document.body.classList.add('accessibility-calm-mode')

// View storage
chrome.storage.local.get(console.log)
```

## File Sizes (Approximate)

- `manifest.json`: ~500 bytes
- `focus-mode.css`: ~2 KB
- `simple-mode.css`: ~2 KB
- `calm-mode.css`: ~3 KB
- `content.js` (built): ~5 KB
- `background.js` (built): ~1 KB
- Total extension: ~15-20 KB (very lightweight!)

## Documentation Files

- `README.md` - Project overview & features
- `OVERVIEW.md` - Technical architecture deep-dive
- `GETTING_STARTED.md` - Detailed setup guide
- `EXTENSION_README.md` - User-facing documentation
- `NEXT_STEPS.md` - What to do next
- `QUICK_REFERENCE.md` - This file
- `public/create-icons.md` - Icon creation guide

## Keyboard Shortcuts (Future Enhancement)

Not yet implemented, but you could add:
```json
"commands": {
  "toggle-focus": {
    "suggested_key": { "default": "Ctrl+Shift+F" },
    "description": "Toggle Focus Mode"
  }
}
```

## Useful Chrome URLs

- `chrome://extensions/` - Manage extensions
- `chrome://version/` - Chrome version info
- `chrome://inspect/#extensions` - Inspect extension

---

**Keep this file open while developing!** 📌

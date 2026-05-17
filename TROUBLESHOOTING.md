# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### ✅ SOLVED: pnpm build scripts error

**Error:**
```
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: @tailwindcss/oxide@4.1.12, esbuild@0.25.12
Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.
```

**Solution:**
This was fixed by updating `.npmrc` with:
```
enable-pre-post-scripts=true
ignore-scripts=false
```

Now `pnpm install` works correctly.

**If you still see this error:**
1. Make sure you're in the project directory
2. Delete `node_modules` and `pnpm-lock.yaml`
3. Run `pnpm install` again

---

## Extension Issues

### Extension won't load in Chrome

**Symptoms:** Error when trying to load unpacked extension

**Causes & Solutions:**

1. **Missing PNG icons** (most common)
   - Error: "Could not load icon 'icon16.png'"
   - Solution: Create the three PNG files from `icon.svg`
   - See: `public/create-icons.md`

2. **Invalid manifest.json**
   - Error: "Manifest file is invalid"
   - Solution: Check `public/manifest.json` for JSON syntax errors
   - Use: https://jsonlint.com/ to validate

3. **Wrong folder selected**
   - Error: "Manifest file is missing"
   - Solution: Load the `dist/` folder, NOT the root folder
   - Make sure you ran `pnpm run build` first

4. **Build didn't complete**
   - Error: "dist/ folder doesn't exist"
   - Solution: Run `pnpm run build` and check for errors
   - Check that build completed successfully

### Modes don't apply to pages

**Symptoms:** Toggles work but page doesn't change

**Solutions:**

1. **Check content script loaded**
   ```
   F12 → Sources tab → Content scripts
   Should see: content.js
   ```

2. **Check for console errors**
   ```
   F12 → Console tab
   Look for red error messages
   ```

3. **Reload extension**
   ```
   chrome://extensions/
   Find your extension
   Click reload icon (circular arrow)
   ```

4. **Reload webpage**
   ```
   After reloading extension, reload the page you're testing
   Changes won't apply to already-loaded pages
   ```

5. **Check CSS files**
   ```
   Verify these exist:
   public/focus-mode.css
   public/simple-mode.css
   public/calm-mode.css
   ```

### Toggles don't save

**Symptoms:** Settings reset when closing popup

**Solutions:**

1. **Check storage permission**
   ```json
   // In manifest.json
   "permissions": ["storage", ...]
   ```

2. **Check browser console**
   ```
   F12 → Console
   Look for storage-related errors
   ```

3. **Clear extension storage**
   ```
   chrome://extensions/
   Your extension → Details → Remove extension data
   Then reload extension
   ```

### TypeScript errors

**Error:** `Cannot find name 'chrome'`

**Solution:**
Make sure `@types/chrome` is installed:
```bash
pnpm install -D @types/chrome
```

This was already added to `package.json`, so a fresh install should work.

---

## Build Issues

### Build fails with Vite errors

**Error:** Various Vite build errors

**Solutions:**

1. **Clear Vite cache**
   ```bash
   rm -rf node_modules/.vite
   pnpm run build
   ```

2. **Clear all and reinstall**
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   pnpm run build
   ```

3. **Check Node version**
   ```bash
   node --version
   ```
   Required: Node 18+ (recommended Node 20+)

### Content script not bundled

**Error:** `content.js` missing from `dist/`

**Solution:**
Check `vite.config.ts` has correct rollup configuration:
```typescript
build: {
  rollupOptions: {
    input: {
      main: path.resolve(__dirname, 'index.html'),
      content: path.resolve(__dirname, 'src/content.ts'),
      background: path.resolve(__dirname, 'src/background.ts'),
    }
  }
}
```

This is already configured correctly.

---

## Development Issues

### Changes not showing up

**Checklist:**
1. ✅ Saved your file changes
2. ✅ Ran `pnpm run build`
3. ✅ Reloaded extension in `chrome://extensions/`
4. ✅ Reloaded the webpage you're testing

All four must be done for changes to appear.

### Hot reload not working

**Note:** Chrome extensions don't support hot reload like web apps.

**Workflow:**
```bash
# 1. Make changes
# 2. Build
pnpm run build

# 3. Reload extension (chrome://extensions/)
# 4. Reload test page
```

Consider using a watch script:
```json
"scripts": {
  "watch": "vite build --watch"
}
```

### Popup shows blank screen

**Symptoms:** Extension icon works but popup is empty

**Solutions:**

1. **Check popup HTML**
   - `dist/index.html` should exist
   - Should load React app

2. **Check browser console**
   ```
   Right-click extension icon → Inspect popup
   Check Console tab for errors
   ```

3. **Check App.tsx**
   - Make sure `export default function App()` exists
   - Make sure component returns valid JSX

4. **Rebuild**
   ```bash
   rm -rf dist
   pnpm run build
   ```

---

## Runtime Issues

### Content script conflicts

**Symptoms:** Other extensions or site scripts interfere

**Solutions:**

1. **Increase CSS specificity**
   ```css
   /* Instead of */
   .accessibility-focus-mode p { }
   
   /* Use */
   body.accessibility-focus-mode p { }
   ```

2. **Use !important** (already done)
   ```css
   opacity: 0.35 !important;
   ```

3. **Disable conflicting extensions**
   - Test with other extensions disabled
   - Check for other accessibility/styling extensions

### Storage quota exceeded

**Error:** "Storage quota exceeded"

**Solutions:**

1. **Check what's being stored**
   ```javascript
   chrome.storage.local.get(null, console.log)
   ```

2. **Clear storage**
   ```javascript
   chrome.storage.local.clear()
   ```

3. **Reduce storage**
   - Only store booleans (current setup)
   - Don't store large objects

### Performance issues

**Symptoms:** Pages load slowly with extension

**Solutions:**

1. **Optimize selectors**
   ```javascript
   // Instead of scanning all elements
   document.querySelectorAll('*')
   
   // Target specific elements
   document.querySelectorAll('aside, .sidebar')
   ```

2. **Debounce DOM operations**
   - Add delays between bulk changes
   - Use `requestAnimationFrame`

3. **Check CSS complexity**
   - Minimize use of complex selectors
   - Avoid expensive properties (blur, backdrop-filter)

---

## Testing Issues

### Can't test on localhost

**Note:** Extensions work on localhost by default in dev mode.

**If localhost blocked:**
```json
// In manifest.json, add:
"host_permissions": [
  "http://localhost/*",
  "<all_urls>"
]
```

### Can't test on chrome:// pages

**Note:** This is intentional - Chrome blocks extensions on:
- `chrome://` pages
- `chrome-extension://` pages
- Chrome Web Store pages

**Solution:** Test on regular websites instead.

### Modes don't work on specific sites

**Common blocking sites:**
- Gmail (uses Shadow DOM extensively)
- Google Docs (custom rendering)
- Banking sites (CSP restrictions)

**Partial solutions:**
- Add Shadow DOM piercing
- Use more specific selectors
- Some sites may be incompatible

---

## Browser-Specific Issues

### Works in Chrome but not Edge

**Solution:** Edge uses Chromium, so it should work identically.

Check:
- Edge version (must be 88+)
- Developer mode is enabled
- Manifest V3 is supported

### Doesn't work in Firefox

**Note:** This extension is built for Chrome/Chromium (Manifest V3).

**To port to Firefox:**
1. Create Manifest V2 version
2. Adjust API calls (`browser.` vs `chrome.`)
3. Test Firefox-specific quirks

This is a separate project - Firefox uses different extension APIs.

---

## Getting Help

If you encounter an issue not listed here:

1. **Check browser console**
   - Popup: Right-click icon → Inspect popup
   - Content script: F12 on webpage → Console
   - Background: chrome://extensions/ → Service worker → Console

2. **Check manifest**
   - Verify all required files are listed
   - Check permissions are correct
   - Validate JSON syntax

3. **Check documentation**
   - `README.md` - Overview
   - `GETTING_STARTED.md` - Setup
   - `OVERVIEW.md` - Architecture
   - `QUICK_REFERENCE.md` - Quick tips

4. **Clean slate**
   ```bash
   rm -rf node_modules dist
   pnpm install
   pnpm run build
   # Reload extension
   ```

---

## Debug Mode

Enable verbose logging by adding this to `src/content.ts`:

```typescript
const DEBUG = true;

function log(...args: any[]) {
  if (DEBUG) console.log('[Accessibility Modes]', ...args);
}

// Then use throughout:
log('Focus mode applied');
```

---

## Useful Commands

```bash
# Fresh start
rm -rf node_modules pnpm-lock.yaml dist
pnpm install
pnpm run build

# Check file structure
tree dist -L 2

# Validate manifest
cat public/manifest.json | jq .

# Check if icons exist
ls -lh public/icon*.png

# Check built files
ls -lh dist/

# Monitor builds
pnpm run build --watch
```

---

**Most issues are solved by:** Create icons → Build → Reload extension → Reload page 🔄

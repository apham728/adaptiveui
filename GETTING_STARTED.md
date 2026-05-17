# Getting Started with Accessibility Modes Extension

This project is a Chrome extension with three accessibility modes: Focus, Simple, and Calm.

## Quick Preview

The main UI (in `src/app/App.tsx`) shows the extension popup that users will interact with.

## Project Structure

```
├── public/
│   ├── manifest.json          # Chrome extension config
│   ├── focus-mode.css        # Focus mode styles
│   ├── simple-mode.css       # Simple mode styles
│   ├── calm-mode.css         # Calm mode styles
│   ├── icon.svg              # Icon source file
│   └── create-icons.md       # Instructions for creating PNG icons
├── src/
│   ├── app/
│   │   ├── App.tsx           # Extension popup UI (toggle controls)
│   │   └── components/       # UI components
│   ├── content.ts            # Content script (modifies web pages)
│   └── background.ts         # Background service worker
└── EXTENSION_README.md       # Full extension documentation
```

## Development Workflow

### 1. Preview the Popup UI

The app currently shows the extension popup interface with three toggle switches. This is what users will see when they click the extension icon in Chrome.

### 2. Build for Chrome Extension

To use this as an actual Chrome extension:

```bash
# Install dependencies (if not already done)
pnpm install

# Build the extension
pnpm run build
```

### 3. Create Extension Icons

Before loading the extension, create the required PNG icons:

1. Follow instructions in `public/create-icons.md`
2. Create three PNG files from `public/icon.svg`:
   - `icon16.png` (16×16)
   - `icon48.png` (48×48)
   - `icon128.png` (128×128)
3. Place them in the `public/` directory

### 4. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select the `dist/` folder from your project
5. The extension should now appear in your extensions list

### 5. Test the Extension

1. Click the extension icon in Chrome toolbar
2. Toggle each mode on/off
3. Visit any website to see the modes in action:
   - **Focus Mode**: Dims sidebars and ads, highlights main content
   - **Simple Mode**: Adds tooltips to jargon, improves form clarity
   - **Calm Mode**: Enhances readability with larger text and softer colors

## How Each Mode Works

### Focus Mode
- Applies CSS class `accessibility-focus-mode` to `<body>`
- Dims elements matching selectors like `aside`, `.sidebar`, `.ad`
- Highlights `main`, `article`, and `[role="main"]`
- Reduces animations with `reduce-motion` class
- Styles defined in `public/focus-mode.css`

### Simple Mode
- Applies CSS class `accessibility-simple-mode` to `<body>`
- Detects complex jargon words and adds tooltip indicators
- Improves form field styling with larger inputs and clearer labels
- Adds bullet points to lists
- Styles defined in `public/simple-mode.css`

### Calm Mode
- Applies CSS class `accessibility-calm-mode` to `<body>`
- Increases font sizes and line heights
- Reduces line length to ~70 characters for readability
- De-emphasizes secondary actions
- Adds step indicators to forms
- Styles defined in `public/calm-mode.css`

## Customization

### Modify Popup UI
Edit `src/app/App.tsx` to change the extension popup interface.

### Modify Mode Behavior
Edit the corresponding files:
- Content script logic: `src/content.ts`
- CSS styles: `public/focus-mode.css`, `public/simple-mode.css`, `public/calm-mode.css`
- Background worker: `src/background.ts`

### Change Mode Selectors
In `src/content.ts`, modify the selector arrays:
```typescript
const nonCriticalSelectors = [
  'aside', '.sidebar', '.ad', // Add your own selectors
];
```

## Building for Distribution

1. Ensure all icons are created
2. Run `pnpm run build`
3. Test the extension thoroughly
4. Zip the `dist/` folder
5. Upload to Chrome Web Store (requires developer account)

## Troubleshooting

### Extension doesn't load
- Make sure PNG icons exist in `public/`
- Check that `manifest.json` is valid
- Verify the build completed successfully

### Modes don't apply to pages
- Check browser console for errors
- Verify `content.ts` has loaded (check Sources tab in DevTools)
- Try reloading the extension from `chrome://extensions/`

### Styles not working
- Ensure CSS files are in `public/`
- Check that they're listed in `manifest.json` under `content_scripts.css`
- Clear cache and reload

## Privacy & Permissions

The extension requires:
- `storage`: Save user's mode preferences
- `activeTab`: Apply modes to current tab
- `scripting`: Inject content scripts
- `<all_urls>`: Work on all websites

No data is collected or sent to external servers.

## Next Steps

- Add more mode customizations
- Create options page for user preferences
- Add keyboard shortcuts
- Implement focus timer feature
- Add bilingual translation support
- Create preset configurations

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/migrating/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

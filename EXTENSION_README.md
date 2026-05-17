# Accessibility Modes Chrome Extension

A Chrome extension that provides three accessibility modes to enhance your browsing experience:

## Features

### 🎯 Focus Mode
- Reduces visual distractions by dimming sidebars, ads, and non-critical panels
- Highlights the main content area
- **Highlights the first sentence of each paragraph** to help you track your reading and not lose your place
- Groups long content into chunks with clear headers
- Suppresses non-urgent popups and animations
- Adds visual focus indicator to primary actions

### ✨ Simple Mode
- Rewrites dense text into simpler plain English concepts
- Explains jargon and idioms with inline tooltips
- Provides clear form field examples
- Improves text readability with better spacing
- Simplifies navigation and button styles

### 💙 Calm Mode
- Applies low-stimulation visual theme with softer contrasts
- Increases text readability (larger size, better spacing, shorter line length)
- Reduces simultaneous choices by de-emphasizing secondary actions
- Presents step-by-step flow indicators for complex tasks and forms
- Keeps navigation consistent with persistent hints

## Installation

### Development Mode

1. **Build the extension:**
   ```bash
   pnpm run build
   ```

2. **Open Chrome Extensions page:**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)

3. **Load the extension:**
   - Click "Load unpacked"
   - Select the `dist` folder from this project

4. **Pin the extension:**
   - Click the puzzle icon in Chrome's toolbar
   - Find "Accessibility Modes"
   - Click the pin icon to keep it visible

## Usage

1. Click the extension icon in your Chrome toolbar
2. Toggle any combination of the three modes:
   - **Focus Mode** - for distraction-free browsing
   - **Simple Mode** - for easier-to-understand content
   - **Calm Mode** - for a more relaxed browsing experience
3. The modes apply immediately to the current page
4. Your preferences are saved and persist across browser sessions

## Building for Production

To create the extension files:

```bash
# Build the React app
pnpm run build

# The extension will be in the dist/ folder
```

## Files Structure

```
public/
├── manifest.json          # Extension configuration
├── focus-mode.css        # Focus mode styles
├── simple-mode.css       # Simple mode styles
├── calm-mode.css         # Calm mode styles
└── icon.svg              # Extension icon

src/
├── app/App.tsx           # Extension popup UI
├── content.ts            # Content script (runs on web pages)
└── background.ts         # Background service worker
```

## Technical Details

- **Framework:** React + TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI primitives
- **Manifest:** Version 3
- **Permissions:** 
  - `storage` - to save user preferences
  - `activeTab` - to apply modes to current tab
  - `scripting` - to inject content scripts

## Customization

Each mode can be customized by editing the corresponding CSS file in the `public/` directory:

- `focus-mode.css` - Adjust dimming opacity, highlight colors
- `simple-mode.css` - Modify font sizes, spacing, tooltip styles
- `calm-mode.css` - Change color scheme, text sizes, spacing

## Browser Compatibility

- Chrome 88+
- Edge 88+
- Brave
- Any Chromium-based browser with Manifest V3 support

## Privacy

This extension:
- Does not collect any data
- Does not make external network requests
- Only stores mode preferences locally in your browser
- Has no analytics or tracking

## License

MIT License - feel free to modify and distribute

## Support

For issues or feature requests, please open an issue on the project repository.

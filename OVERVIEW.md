# 🎯 Project Overview: Accessibility Modes Chrome Extension

## What Is This?

This is a **Chrome browser extension** that enhances web accessibility through three toggle-able modes. Each mode applies different visual and interaction improvements to any website you visit.

## What You're Seeing Now

In the **Figma Make preview**, you're seeing the **extension popup UI** - the control panel that users interact with to toggle the three modes on and off. This is what appears when someone clicks the extension icon in their Chrome toolbar.

## The Three Modes

### 🎯 Focus Mode
**Purpose**: Eliminate distractions and help users concentrate on primary content

**How it works**:
- Detects and dims sidebars, ads, navigation, and secondary content (opacity: 0.35)
- Highlights main content areas (`<main>`, `<article>`, `[role="main"]`) with a subtle blue border
- **Highlights first sentence of each paragraph** with a gentle blue background and left border to help users track their reading position and not lose their place
- Suppresses animations by overriding CSS transitions and animations
- Visually emphasizes primary action buttons with outline rings
- Groups content sections with visual separators

**Target users**: People with attention difficulties, ADHD, dyslexia, students, professionals needing focus

### ✨ Simple Mode
**Purpose**: Make complex content more understandable

**How it works**:
- Scans text for complex jargon (words like "leverage", "synergy", "paradigm", "optimize")
- Adds inline tooltip indicators (ⓘ) next to complex terms
- Enlarges form inputs and adds clearer labels
- Increases line-height and letter-spacing for readability
- Simplifies navigation with better visual hierarchy

**Target users**: Non-native speakers, people with cognitive disabilities, anyone facing unfamiliar jargon

### 💙 Calm Mode
**Purpose**: Create a low-stimulation, comfortable reading experience

**How it works**:
- Applies gentle gray color scheme (background: #f9fafb, text: #374151)
- Increases font size to 18px with 1.8 line-height
- Constrains text width to 70 characters (optimal reading width)
- De-emphasizes secondary buttons (low opacity, grayscale filter)
- Adds numbered step indicators to forms
- Centers content with max-width 800px and ample padding

**Target users**: People with sensory sensitivities, anxiety, dyslexia, or anyone who finds standard web design overwhelming

## Technical Architecture

### Extension Components

1. **Popup UI** (`src/app/App.tsx`)
   - React interface with three Switch components
   - Saves state to Chrome's local storage
   - Sends messages to content script when toggled

2. **Content Script** (`src/content.ts`)
   - Injected into every web page
   - Listens for mode toggle messages
   - Applies/removes CSS classes to `<body>`
   - Manipulates DOM (adds classes to elements, creates tooltips)

3. **CSS Mode Files** (`public/*.css`)
   - `focus-mode.css`: 100+ lines of distraction-reduction styles
   - `simple-mode.css`: Simplified text and form styles
   - `calm-mode.css`: Gentle theme and readability enhancements

4. **Background Worker** (`src/background.ts`)
   - Initializes extension state on install
   - Could be expanded for more background tasks

5. **Manifest** (`public/manifest.json`)
   - Declares permissions, content scripts, icons
   - Manifest V3 format (modern Chrome standard)

### How Modes Are Applied

```
User clicks toggle → Popup saves to storage → Message sent to tab
                                                 ↓
                            Content script receives message
                                                 ↓
                            Adds CSS class to <body> (e.g., 'accessibility-focus-mode')
                                                 ↓
                            Mode CSS file applies styles
                                                 ↓
                            JS function runs mode-specific DOM changes
```

### State Persistence

```typescript
// Saved in Chrome storage:
{
  focusMode: true,
  simpleMode: false,
  calmMode: true
}
```

State persists across:
- Browser restarts
- Extension reloads
- Different tabs (each tab loads current state on page load)

## File Purpose Breakdown

| File | Purpose | Runs Where |
|------|---------|------------|
| `App.tsx` | Toggle UI | Extension popup |
| `content.ts` | Apply modes to pages | Every web page |
| `background.ts` | Extension lifecycle | Background |
| `focus-mode.css` | Focus styling | Injected into pages |
| `simple-mode.css` | Simple styling | Injected into pages |
| `calm-mode.css` | Calm styling | Injected into pages |
| `manifest.json` | Extension config | Chrome reads this |

## Key Selectors Used

### Focus Mode Dimming
```javascript
'aside', '[role="complementary"]', '.sidebar', 
'.ad', '.advertisement', 'nav:not(header nav)'
```

### Focus Mode Highlighting
```javascript
'main', '[role="main"]', 'article', '.main-content'
```

### Simple Mode Jargon Detection
```javascript
/\b(utilize|leverage|synergy|paradigm|holistic|optimize)\b/gi
```

### Calm Mode Secondary Actions
```javascript
'button:not([type="submit"]):not(.primary)',
'[role="button"]:not(.primary)'
```

## How to Use This Project

### Option 1: Preview the Popup (Current)
You're already doing this! The Make preview shows the extension popup interface.

### Option 2: Build as Chrome Extension
1. Create PNG icons (see `public/create-icons.md`)
2. Run `pnpm run build`
3. Load `dist/` folder in Chrome at `chrome://extensions/`
4. Test on real websites

### Option 3: Customize the Modes
- Edit CSS files to change colors, sizes, opacity
- Edit `content.ts` to change selectors or add features
- Edit `App.tsx` to change the UI design

## Extension Permissions Explained

- **storage**: Save which modes are on/off
- **activeTab**: Read and modify the current tab
- **scripting**: Inject content script into pages
- **host_permissions: <all_urls>**: Work on every website

## Privacy & Security

✅ **No data collection** - Nothing is sent to external servers
✅ **No analytics** - No tracking of any kind
✅ **Local storage only** - Preferences stay in your browser
✅ **Open source** - All code is visible and auditable
✅ **No ads** - Free and clean

## Future Enhancement Ideas

1. **Custom selectors** - Let users define their own elements to dim/highlight
2. **Intensity levels** - Adjust how much dimming/emphasis to apply
3. **Site-specific settings** - Remember different modes for different websites
4. **Focus timer** - Pomodoro-style timer in Focus Mode
5. **Translation** - Translate Simple Mode tooltips to other languages
6. **Keyboard shortcuts** - Toggle modes with hotkeys
7. **Options page** - Dedicated settings interface
8. **Preset combinations** - Save favorite mode combinations
9. **Export/import** - Share settings across devices

## Use Cases

### For Individuals
- Students studying from dense academic articles → **Focus + Simple**
- Person with dyslexia reading news → **Calm Mode**
- Professional researching in unfamiliar domain → **Simple Mode**
- Someone with ADHD shopping online → **Focus Mode**

### For Organizations
- Accessibility compliance for public websites
- Educational institutions supporting diverse learners
- Libraries providing assistive technology
- Workplace accommodations for employees

## Comparison to Built-in Features

| Feature | Browser Reader Mode | This Extension |
|---------|-------------------|----------------|
| Works on all sites | ❌ Limited | ✅ Yes |
| Customizable | ❌ No | ✅ Yes |
| Multiple modes | ❌ One mode | ✅ Three modes |
| Jargon tooltips | ❌ No | ✅ Yes |
| Form improvements | ❌ No | ✅ Yes |
| Persistent | ❌ Per-page | ✅ Global |

## Performance Impact

- **Minimal**: CSS is applied via classes, not inline styles
- **Lazy**: Only runs when mode is active
- **Cached**: CSS files loaded once per page
- **Optimized**: Selectors target specific elements, not entire DOM

## Browser Compatibility

| Browser | Supported | Notes |
|---------|-----------|-------|
| Chrome 88+ | ✅ Yes | Primary target |
| Edge 88+ | ✅ Yes | Chromium-based |
| Brave | ✅ Yes | Chromium-based |
| Firefox | ❌ No* | Would need Manifest V2 port |
| Safari | ❌ No* | Different extension format |

*Could be adapted with separate builds

## Development Workflow

```bash
# 1. Install dependencies
pnpm install

# 2. Create icons
# Follow public/create-icons.md

# 3. Build extension
pnpm run build

# 4. Load in Chrome
# chrome://extensions/ → Load unpacked → select dist/

# 5. Make changes
# Edit files in src/ or public/

# 6. Rebuild
pnpm run build

# 7. Reload extension
# Click reload icon in chrome://extensions/
```

## Questions?

- Read `GETTING_STARTED.md` for detailed setup
- Read `EXTENSION_README.md` for feature documentation
- Read `README.md` for project overview

---

**This extension makes the web more accessible, one toggle at a time.** 🎯✨💙

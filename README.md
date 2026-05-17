# Accessibility Modes Chrome Extension 🎯✨💙

A powerful Chrome extension that provides three accessibility modes to enhance your browsing experience: **Focus Mode**, **Simple Mode**, and **Calm Mode**.

![Extension Preview](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Accessibility+Modes+Extension)

## 🌟 Features

### 🎯 Focus Mode
Helps you concentrate by reducing visual clutter:
- Dims sidebars, ads, and non-critical UI elements
- Highlights the main content area with a subtle border
- **Highlights the first sentence of each paragraph** to help track reading position
- Suppresses animations and non-urgent popups
- Groups content with clear visual headers
- Adds visual indicators to primary actions

### ✨ Simple Mode
Makes web content easier to understand:
- Identifies and marks complex jargon with tooltip indicators
- Improves form clarity with larger inputs and helpful examples
- Simplifies navigation with better spacing and visual hierarchy
- Adds clear structure to lists and content sections
- Enhances button readability with larger touch targets

### 💙 Calm Mode
Creates a more relaxing browsing experience:
- Applies a low-stimulation visual theme with softer colors
- Increases text size and spacing for better readability
- Limits line length to optimal reading width (~70 characters)
- De-emphasizes secondary actions to reduce decision fatigue
- Adds step-by-step indicators to complex forms
- Provides consistent navigation hints

## 📦 Installation

### For Development

1. **Clone and setup:**
   ```bash
   pnpm install
   ```

2. **Create extension icons** (required):
   - Follow instructions in `public/create-icons.md`
   - Convert `public/icon.svg` to PNG files:
     - `public/icon16.png` (16×16)
     - `public/icon48.png` (48×48)
     - `public/icon128.png` (128×128)

3. **Build the extension:**
   ```bash
   pnpm run build
   ```

4. **Load in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` folder

### For Users

*(Once published to Chrome Web Store)*
1. Visit the Chrome Web Store
2. Search for "Accessibility Modes"
3. Click "Add to Chrome"

## 🚀 Usage

1. Click the extension icon in your Chrome toolbar
2. Toggle any combination of modes:
   - **Focus Mode** for distraction-free reading
   - **Simple Mode** for easier comprehension
   - **Calm Mode** for a relaxed experience
3. Modes apply instantly to the current page
4. Your preferences are saved automatically

## 🎨 Screenshots

### Extension Popup
The control panel with three toggle switches for each mode.

### Focus Mode in Action
See how distractions are dimmed and main content is highlighted.

### Simple Mode
Complex jargon is marked with helpful indicators.

### Calm Mode
Enhanced readability with larger text and better spacing.

## 🛠️ Technical Details

### Built With
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Radix UI** - Accessible UI primitives
- **Vite** - Build tool
- **Chrome Extension Manifest V3** - Extension platform

### Project Structure
```
├── public/
│   ├── manifest.json          # Extension configuration
│   ├── *.css                  # Mode-specific styles
│   └── icon.svg               # Icon source
├── src/
│   ├── app/
│   │   ├── App.tsx           # Popup UI
│   │   └── components/       # React components
│   ├── content.ts            # Content script
│   └── background.ts         # Service worker
└── docs/
    ├── GETTING_STARTED.md    # Detailed setup guide
    └── EXTENSION_README.md   # Extension documentation
```

### Permissions
- `storage` - Save mode preferences
- `activeTab` - Apply modes to current tab
- `scripting` - Inject content scripts
- `<all_urls>` - Work on all websites

**Privacy First**: No data collection, no analytics, no external requests.

## 🔧 Customization

### Modify Mode Behavior

**Content Script** (`src/content.ts`):
```typescript
// Add custom selectors for Focus Mode
const nonCriticalSelectors = [
  'aside', '.sidebar', '.custom-element'
];
```

**Styles** (`public/*.css`):
```css
/* Customize dim opacity in focus-mode.css */
.accessibility-focus-mode .focus-mode-dimmed {
  opacity: 0.35 !important; /* Adjust this value */
}
```

### Add New Features

1. Edit the popup UI in `src/app/App.tsx`
2. Update content script logic in `src/content.ts`
3. Add new CSS in `public/` directory
4. Rebuild with `pnpm run build`

## 📚 Documentation

- [Getting Started Guide](./GETTING_STARTED.md) - Detailed setup and development
- [Extension Documentation](./EXTENSION_README.md) - Complete feature overview
- [Icon Creation Guide](./public/create-icons.md) - How to generate PNG icons

## 🧪 Testing

Test the extension on various websites:
- News sites (focus on articles)
- Shopping sites (test form improvements)
- Documentation sites (check readability)
- Social media (verify distraction reduction)

Recommended test sites:
- Wikipedia - Great for testing Calm Mode readability
- Reddit - Test Focus Mode's sidebar dimming
- GitHub - Verify Simple Mode's jargon tooltips
- Amazon - Check form field improvements

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- [ ] Add more language translations for Simple Mode
- [ ] Implement focus timer in Focus Mode
- [ ] Create options page for customization
- [ ] Add keyboard shortcuts
- [ ] Support for more website patterns
- [ ] User-defined custom selectors
- [ ] Export/import settings

## 🐛 Troubleshooting

**Extension won't load:**
- Ensure PNG icons exist in `public/`
- Check `manifest.json` is valid JSON
- Verify build completed without errors

**Modes don't apply:**
- Check browser console for errors
- Reload extension from `chrome://extensions/`
- Try disabling and re-enabling modes

**Conflicts with other extensions:**
- Disable other accessibility/styling extensions
- Check for CSS conflicts in DevTools

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Built with [Radix UI](https://www.radix-ui.com/) primitives
- Icons from [Lucide](https://lucide.dev/)
- Inspired by browser reading modes and accessibility tools

## 📞 Support

- Report bugs via GitHub Issues
- Feature requests welcome
- Pull requests encouraged

---

**Made with ❤️ for better web accessibility**

Version 1.0.0 | MIT License | 2026

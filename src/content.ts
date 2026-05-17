// Content script for applying accessibility modes

interface Modes {
  focusMode: boolean;
  simpleMode: boolean;
  calmMode: boolean;
}

type TextSize = 'regular' | 'large' | 'huge';
const MIN_TEXT_SCALE = 100;
const MAX_TEXT_SCALE = 150;

let modes: Modes = {
  focusMode: false,
  simpleMode: false,
  calmMode: false
};
let textSize: TextSize = 'regular';
let textScale = 100;

// Load initial state
chrome.storage.local.get(['focusMode', 'simpleMode', 'calmMode', 'textSize', 'textScale'], (result) => {
  modes = {
    focusMode: result.focusMode || false,
    simpleMode: result.simpleMode || false,
    calmMode: result.calmMode || false
  };
  if (typeof result.textScale === 'number' && Number.isFinite(result.textScale)) {
    textScale = clampTextScale(result.textScale);
  } else {
    if (result.textSize === 'large' || result.textSize === 'huge') {
      textSize = result.textSize;
    } else {
      textSize = 'regular';
    }
    textScale = textSize === 'large' ? 113 : textSize === 'huge' ? 125 : 100;
  }
  applyTextScale(textScale);
  applyAllModes();
});

// Listen for mode toggles
chrome.runtime.onMessage.addListener((message: any) => {
  if (message.type === 'TOGGLE_MODE') {
    modes[message.mode as keyof Modes] = message.enabled;
    applyMode(message.mode, message.enabled);
  }
  if (message.type === 'SET_TEXT_SIZE') {
    if (message.size === 'regular' || message.size === 'large' || message.size === 'huge') {
      textSize = message.size;
      const legacyScale = textSize === 'large' ? 113 : textSize === 'huge' ? 125 : 100;
      textScale = legacyScale;
      applyTextScale(textScale);
    }
  }
  if (message.type === 'SET_TEXT_SCALE' && typeof message.scale === 'number') {
    textScale = clampTextScale(message.scale);
    applyTextScale(textScale);
  }
});

function applyAllModes() {
  Object.keys(modes).forEach(mode => {
    applyMode(mode, modes[mode as keyof Modes]);
  });
}

function clampTextScale(value: number) {
  return Math.min(MAX_TEXT_SCALE, Math.max(MIN_TEXT_SCALE, Math.round(value)));
}

function applyTextScale(scalePercent: number) {
  const clamped = clampTextScale(scalePercent);
  const scale = String(clamped / 100);

  // Root scale (works on rem-based sites)
  document.documentElement.style.fontSize =
    clamped === 100 ? "" : `${clamped}%`;

  // Inject/update override style (works on px-based sites)
  let styleEl = document.getElementById("adaptiveui-text-size-style") as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "adaptiveui-text-size-style";
    document.head.appendChild(styleEl);
  }

  if (clamped === 100) {
    styleEl.textContent = "";
    return;
  }

  styleEl.textContent = `
    :root { --adaptiveui-text-scale: ${scale}; }

    body p, body li, body span, body a, body label, body blockquote,
    body h1, body h2, body h3, body h4, body h5, body h6, body td, body th {
      font-size: calc(1em * var(--adaptiveui-text-scale)) !important;
      line-height: calc(1.2em * var(--adaptiveui-text-scale)) !important;
    }

    /* Avoid blowing up icons/inputs/buttons/layout chrome */
    svg, i, [class*="icon"], button, input, textarea, select {
      font-size: inherit !important;
      line-height: inherit !important;
    }
  `;
}

function applyMode(mode: string, enabled: boolean) {
  const body = document.body;

  switch(mode) {
    case 'focusMode':
      if (enabled) {
        body.classList.add('accessibility-focus-mode');
        applyFocusMode();
      } else {
        body.classList.remove('accessibility-focus-mode');
        removeFocusMode();
      }
      break;

    case 'simpleMode':
      if (enabled) {
        body.classList.add('accessibility-simple-mode');
        applySimpleMode();
      } else {
        body.classList.remove('accessibility-simple-mode');
        removeSimpleMode();
      }
      break;

    case 'calmMode':
      if (enabled) {
        body.classList.add('accessibility-calm-mode');
        applyCalmMode();
      } else {
        body.classList.remove('accessibility-calm-mode');
        removeCalmMode();
      }
      break;
  }
}

// Focus Mode Functions
function applyFocusMode() {
  // Dim sidebars, ads, non-critical panels
  const nonCriticalSelectors = [
    'aside', '[role="complementary"]', '.sidebar', '.ad', '.advertisement',
    '[class*="sidebar"]', '[id*="sidebar"]', 'nav:not(header nav)'
  ];

  nonCriticalSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      if (!el.classList.contains('focus-mode-dimmed')) {
        el.classList.add('focus-mode-dimmed');
      }
    });
  });

  // Add focus indicator to main content
  const mainSelectors = ['main', '[role="main"]', 'article', '.main-content'];
  mainSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      if (!el.classList.contains('focus-mode-highlight')) {
        el.classList.add('focus-mode-highlight');
      }
    });
  });

  // Highlight first sentence of paragraphs to help users track reading
  highlightFirstSentences();

  // Hide images and videos for distraction-free reading
  hideMediaElements();

  // Suppress animations
  document.body.classList.add('reduce-motion');
}

function hideMediaElements() {
  // Hide images - keep the box, remove the content
  document.querySelectorAll('img').forEach(img => {
    if (!img.classList.contains('focus-mode-hidden-media')) {
      img.classList.add('focus-mode-hidden-media');

      // Store original src
      img.setAttribute('data-focus-original-src', img.src || '');

      // Set to transparent 1x1 pixel instead of removing src
      // This prevents the broken image icon from showing
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

      // Remove srcset to prevent loading alternative images
      if (img.srcset) {
        img.setAttribute('data-focus-original-srcset', img.srcset);
        img.removeAttribute('srcset');
      }

      // Store and clear alt text to prevent it from showing
      if (img.alt) {
        img.setAttribute('data-focus-original-alt', img.alt);
        img.alt = '';
      }
    }
  });

  // Hide videos - keep the box, remove the content
  document.querySelectorAll('video').forEach(video => {
    if (!video.classList.contains('focus-mode-hidden-media')) {
      video.classList.add('focus-mode-hidden-media');

      // Pause and remove source
      video.pause();

      // Store and remove sources
      const sources = video.querySelectorAll('source');
      sources.forEach(source => {
        source.setAttribute('data-focus-original-src', source.src || '');
        source.removeAttribute('src');
      });

      if (video.src) {
        video.setAttribute('data-focus-original-src', video.src);
        video.removeAttribute('src');
      }

      video.load(); // Reload to clear video
    }
  });

  // Hide picture elements
  document.querySelectorAll('picture').forEach(picture => {
    if (!picture.classList.contains('focus-mode-hidden-media')) {
      picture.classList.add('focus-mode-hidden-media');

      // Hide images inside picture elements
      const imgs = picture.querySelectorAll('img');
      imgs.forEach(img => {
        img.setAttribute('data-focus-original-src', img.src || '');
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

        if (img.srcset) {
          img.setAttribute('data-focus-original-srcset', img.srcset);
          img.removeAttribute('srcset');
        }

        if (img.alt) {
          img.setAttribute('data-focus-original-alt', img.alt);
          img.alt = '';
        }
      });
    }
  });

  // Hide iframes (embedded content like YouTube)
  document.querySelectorAll('iframe').forEach(iframe => {
    if (!iframe.classList.contains('focus-mode-hidden-media')) {
      iframe.classList.add('focus-mode-hidden-media');

      // Store and remove src to prevent loading
      iframe.setAttribute('data-focus-original-src', iframe.src || '');
      iframe.removeAttribute('src');
    }
  });

  // Hide SVG images (but keep icon SVGs)
  document.querySelectorAll('svg').forEach(svg => {
    // Only hide large SVGs (likely illustrations, not icons)
    const width = svg.width.baseVal.value || 0;
    const height = svg.height.baseVal.value || 0;

    if ((width > 50 || height > 50) && !svg.classList.contains('focus-mode-hidden-media')) {
      svg.classList.add('focus-mode-hidden-media');

      // Store original innerHTML and clear it
      svg.setAttribute('data-focus-original-content', svg.innerHTML);
      svg.innerHTML = '';
    }
  });

  // Hide CSS background-image thumbnails (common in news card UIs like CNN).
  document.querySelectorAll<HTMLElement>('*').forEach((el) => {
    if (el.classList.contains('focus-mode-hidden-bg-media')) {
      return;
    }

    const bgImage = window.getComputedStyle(el).backgroundImage;
    const hasBackgroundMedia = bgImage && bgImage !== 'none' && bgImage.includes('url(');
    if (!hasBackgroundMedia) {
      return;
    }

    // Avoid stripping likely tiny icon backgrounds.
    const rect = el.getBoundingClientRect();
    const isLikelyThumbnail = rect.width >= 60 && rect.height >= 60;
    if (!isLikelyThumbnail) {
      return;
    }

    el.classList.add('focus-mode-hidden-bg-media');
    el.setAttribute('data-focus-original-bg-image', el.style.backgroundImage || '');
    el.style.backgroundImage = 'none';
  });
}

function highlightFirstSentences() {
  // Target all paragraphs, not just in main content
  const paragraphs = document.querySelectorAll('p');

  paragraphs.forEach((paragraph: Element) => {
    // Skip if already processed, too short, or inside dimmed areas
    if (paragraph.classList.contains('focus-first-sentence-processed')) {
      return;
    }

    // Skip paragraphs inside dimmed areas
    if (paragraph.closest('.focus-mode-dimmed')) {
      return;
    }

    const text = paragraph.textContent?.trim();
    if (!text || text.length < 15) {
      return;
    }

    // Mark as processed
    paragraph.classList.add('focus-first-sentence-processed');

    // Get first 3-5 words (more reliable than sentence matching)
    const words = text.split(/\s+/);
    const firstWords = words.slice(0, Math.min(5, words.length)).join(' ');

    if (!firstWords || firstWords.length < 5) {
      return;
    }

    // Create a text walker to find and wrap the first words
    const walker = document.createTreeWalker(
      paragraph,
      NodeFilter.SHOW_TEXT,
      null
    );

    let firstTextNode = walker.nextNode() as Text;

    if (firstTextNode && firstTextNode.nodeValue) {
      const nodeText = firstTextNode.nodeValue;
      const trimmedText = nodeText.trim();

      if (trimmedText.length > 0) {
        // Find where the text actually starts (accounting for leading whitespace)
        const leadingWhitespace = nodeText.match(/^\s*/)?.[0] || '';
        const wordsToHighlight = trimmedText.split(/\s+/).slice(0, 5).join(' ');

        // Only highlight if we found meaningful text
        if (wordsToHighlight.length > 3) {
          const restOfText = nodeText.substring(leadingWhitespace.length + wordsToHighlight.length);

          // Create the highlighted span
          const span = document.createElement('span');
          span.className = 'focus-first-sentence';
          span.textContent = wordsToHighlight;

          // Replace the text node with span + remaining text
          const parent = firstTextNode.parentNode;
          if (parent) {
            const remainingText = document.createTextNode(restOfText);
            const leadingSpace = document.createTextNode(leadingWhitespace);

            parent.insertBefore(leadingSpace, firstTextNode);
            parent.insertBefore(span, firstTextNode);
            parent.insertBefore(remainingText, firstTextNode);
            parent.removeChild(firstTextNode);
          }
        }
      }
    }
  });
}

function removeFocusMode() {
  document.querySelectorAll('.focus-mode-dimmed').forEach(el => {
    el.classList.remove('focus-mode-dimmed');
  });
  document.querySelectorAll('.focus-mode-highlight').forEach(el => {
    el.classList.remove('focus-mode-highlight');
  });

  // Remove first words highlighting
  document.querySelectorAll('.focus-first-sentence').forEach(span => {
    const parent = span.parentNode;
    if (parent) {
      // Replace the span with its text content
      const textNode = document.createTextNode(span.textContent || '');
      parent.replaceChild(textNode, span);
    }
  });

  // Normalize all paragraphs to merge text nodes
  document.querySelectorAll('.focus-first-sentence-processed').forEach(el => {
    el.classList.remove('focus-first-sentence-processed');
    el.normalize();
  });

  // Restore media elements
  document.querySelectorAll('.focus-mode-hidden-media').forEach(el => {
    el.classList.remove('focus-mode-hidden-media');

    // Restore images
    if (el.tagName === 'IMG') {
      const originalSrc = el.getAttribute('data-focus-original-src');
      if (originalSrc) {
        (el as HTMLImageElement).src = originalSrc;
        el.removeAttribute('data-focus-original-src');
      }

      const originalSrcset = el.getAttribute('data-focus-original-srcset');
      if (originalSrcset) {
        el.setAttribute('srcset', originalSrcset);
        el.removeAttribute('data-focus-original-srcset');
      }

      const originalAlt = el.getAttribute('data-focus-original-alt');
      if (originalAlt) {
        el.setAttribute('alt', originalAlt);
        el.removeAttribute('data-focus-original-alt');
      }
    }

    // Restore videos
    if (el.tagName === 'VIDEO') {
      const originalSrc = el.getAttribute('data-focus-original-src');
      if (originalSrc) {
        (el as HTMLVideoElement).src = originalSrc;
        el.removeAttribute('data-focus-original-src');
      }

      // Restore source elements
      const sources = el.querySelectorAll('source');
      sources.forEach(source => {
        const originalSourceSrc = source.getAttribute('data-focus-original-src');
        if (originalSourceSrc) {
          source.src = originalSourceSrc;
          source.removeAttribute('data-focus-original-src');
        }
      });

      (el as HTMLVideoElement).load();
    }

    // Restore picture elements
    if (el.tagName === 'PICTURE') {
      const imgs = el.querySelectorAll('img');
      imgs.forEach(img => {
        const originalSrc = img.getAttribute('data-focus-original-src');
        if (originalSrc) {
          img.src = originalSrc;
          img.removeAttribute('data-focus-original-src');
        }

        const originalSrcset = img.getAttribute('data-focus-original-srcset');
        if (originalSrcset) {
          img.setAttribute('srcset', originalSrcset);
          img.removeAttribute('data-focus-original-srcset');
        }

        const originalAlt = img.getAttribute('data-focus-original-alt');
        if (originalAlt) {
          img.setAttribute('alt', originalAlt);
          img.removeAttribute('data-focus-original-alt');
        }
      });
    }

    // Restore iframes
    if (el.tagName === 'IFRAME') {
      const originalSrc = el.getAttribute('data-focus-original-src');
      if (originalSrc) {
        (el as HTMLIFrameElement).src = originalSrc;
        el.removeAttribute('data-focus-original-src');
      }
    }

    // Restore SVGs
    if (el.tagName === 'SVG') {
      const originalContent = el.getAttribute('data-focus-original-content');
      if (originalContent) {
        el.innerHTML = originalContent;
        el.removeAttribute('data-focus-original-content');
      }
    }
  });

  // Restore stripped background thumbnails.
  document.querySelectorAll<HTMLElement>('.focus-mode-hidden-bg-media').forEach((el) => {
    const originalBgImage = el.getAttribute('data-focus-original-bg-image');
    el.style.backgroundImage = originalBgImage || '';
    el.removeAttribute('data-focus-original-bg-image');
    el.classList.remove('focus-mode-hidden-bg-media');
  });

  document.body.classList.remove('reduce-motion');
}

// Simple Mode Functions
function applySimpleMode() {
  console.log('🔍 Simple Mode: Starting jargon detection...');

  // Comprehensive jargon dictionary with simple explanations
  const jargonDefinitions: { [key: string]: string } = {
    // Business jargon
    'leverage': 'use or take advantage of',
    'utilize': 'use',
    'synergy': 'working together',
    'paradigm': 'pattern or example',
    'holistic': 'considering the whole thing',
    'optimize': 'make better or improve',
    'facilitate': 'make easier or help',
    'implement': 'put into action or start using',
    'integrate': 'combine or bring together',
    'streamline': 'make simpler or more efficient',
    'bandwidth': 'time or capacity to do something',
    'deliverable': 'thing to be completed or delivered',
    'stakeholder': 'person with an interest in something',
    'accountability': 'being responsible',
    'alignment': 'agreement or working together',
    'actionable': 'able to be acted on',
    'best practice': 'recommended way of doing something',
    'core competency': 'main skill or strength',
    'scalable': 'able to grow or expand',
    'sustainable': 'able to continue long-term',

    // Academic/formal language
    'furthermore': 'also or in addition',
    'nevertheless': 'however or despite that',
    'consequently': 'as a result or therefore',
    'subsequently': 'later or afterwards',
    'whereby': 'by which or through which',
    'wherein': 'in which',
    'heretofore': 'until now',
    'aforementioned': 'mentioned before',
    'notwithstanding': 'despite or although',
    'endeavor': 'try or attempt',
    'ascertain': 'find out or discover',
    'commence': 'begin or start',
    'terminate': 'end or stop',
    'adjacent': 'next to or beside',
    'subsequent': 'following or coming after',
    'preliminary': 'initial or first',
    'prior': 'before or earlier',
    'sufficient': 'enough',
    'inadequate': 'not enough',
    'proficient': 'skilled or good at',

    // Complex verbs
    'anticipate': 'expect or predict',
    'comprehend': 'understand',
    'demonstrate': 'show or prove',
    'determine': 'decide or figure out',
    'evaluate': 'assess or judge',
    'identify': 'recognize or find',
    'indicate': 'show or point out',
    'maintain': 'keep or continue',
    'obtain': 'get or acquire',
    'participate': 'take part or join in',
    'perceive': 'notice or become aware of',
    'proceed': 'continue or go forward',
    'acquire': 'get or obtain',
    'establish': 'set up or create',
    'examine': 'look at closely or study',
    'illustrate': 'show or explain',
    'observe': 'watch or notice',
    'recommend': 'suggest',
    'require': 'need',
    'retain': 'keep or hold onto',

    // Abstract concepts
    'ambiguous': 'unclear or having multiple meanings',
    'arbitrary': 'random or without reason',
    'coherent': 'clear and logical',
    'comprehensive': 'complete or covering everything',
    'concurrent': 'happening at the same time',
    'conducive': 'helpful or favorable',
    'cumulative': 'building up over time',
    'inherent': 'natural or built-in',
    'intrinsic': 'essential or natural',
    'marginal': 'small or minimal',
    'nominal': 'small or in name only',
    'pragmatic': 'practical',
    'provisional': 'temporary',
    'redundant': 'unnecessary or repeated',
    'tangible': 'real or physical',
    'ubiquitous': 'everywhere or common',
    'volatile': 'unstable or changing quickly',

    // Words with difficult spelling/pronunciation
    'accommodate': 'provide for or fit in',
    'acquisition': 'getting or obtaining something',
    'anonymous': 'unknown or unnamed',
    'conscience': 'sense of right and wrong',
    'correspondence': 'letters or communication',
    'deteriorate': 'get worse or decline',
    'discipline': 'control or training',
    'embarrass': 'make uncomfortable or ashamed',
    'gauge': 'measure or estimate',
    'guarantee': 'promise or assure',
    'hierarchy': 'ranking or levels of authority',
    'inevitable': 'unavoidable or certain to happen',
    'liaison': 'connection or go-between',
    'occurrence': 'event or happening',
    'perseverance': 'persistence or not giving up',
    'relevant': 'related or important',
    'schedule': 'plan or timetable',
    'sophisticated': 'complex or advanced',
    'threshold': 'entrance point or limit',
    'unanimous': 'everyone agrees',

    // Medical/technical terms
    'chronic': 'long-lasting or ongoing',
    'diagnosis': 'identification of a problem',
    'symptom': 'sign of illness',
    'prescription': 'doctor\'s order for medicine',
    'procedure': 'process or method',
    'protocol': 'set of rules or steps',
    'criteria': 'standards or requirements',
    'hypothesis': 'educated guess or theory',
    'methodology': 'way of doing something',

    // Financial terms
    'allocate': 'distribute or assign',
    'expenditure': 'spending or cost',
    'revenue': 'income or earnings',
    'deficit': 'shortage or loss',
    'assets': 'valuable things owned',
    'liability': 'debt or obligation',
    'depreciation': 'decrease in value',
    'aggregate': 'total or combined',
    'fiscal': 'relating to money or finances',
    'equity': 'ownership or fairness'
  };

  // Create regex pattern from all jargon words
  // Add optional plural/verb endings: s, es, ed, ing, ion
  const jargonWords = Object.keys(jargonDefinitions);
  console.log(`📚 Simple Mode: Dictionary has ${jargonWords.length} words`);

  // Build pattern that matches base word + common endings
  const wordPattern = jargonWords.map(word => {
    // Escape special regex characters
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match the word with optional endings
    return `${escaped}(?:s|es|ed|ing|ion|ions)?`;
  }).join('|');

  const pattern = new RegExp(`\\b(${wordPattern})\\b`, 'gi');

  // Process text nodes to add tooltips
  processTextNodes(document.body, pattern, jargonDefinitions);

  // Count how many were found
  const count = document.querySelectorAll('.simple-mode-jargon').length;
  console.log(`✅ Simple Mode: Found and wrapped ${count} jargon words (including plurals/variants)`);

  if (count === 0) {
    console.log('⚠️ Simple Mode: No jargon words found on this page');
  } else {
    // Log first few examples
    const examples = Array.from(document.querySelectorAll('.simple-mode-jargon')).slice(0, 5);
    examples.forEach(span => {
      console.log(`  - "${span.textContent}" → ${span.getAttribute('data-definition')}`);
    });
    if (count > 5) {
      console.log(`  ... and ${count - 5} more`);
    }
  }
}

function processTextNodes(element: Node, pattern: RegExp, definitions: { [key: string]: string }) {
  // Skip if already processed or if it's a script/style element
  if (element.nodeType === Node.ELEMENT_NODE) {
    const el = element as Element;
    if (el.classList.contains('simple-mode-processed') ||
        el.tagName === 'SCRIPT' ||
        el.tagName === 'STYLE' ||
        el.tagName === 'NOSCRIPT') {
      return;
    }
  }

  if (element.nodeType === Node.TEXT_NODE && element.nodeValue && element.nodeValue.trim()) {
    const text = element.nodeValue;
    const matches = text.match(pattern);

    if (matches && element.parentNode) {
      // Found jargon words - replace with spans
      const parent = element.parentNode;
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      const regex = new RegExp(pattern.source, pattern.flags);
      let match;

      while ((match = regex.exec(text)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
          fragment.appendChild(
            document.createTextNode(text.substring(lastIndex, match.index))
          );
        }

        // Create tooltip span for the jargon word
        const word = match[0];
        const wordLower = word.toLowerCase();
        let definition = definitions[wordLower];

        // If exact match not found, try stripping common endings to find base word
        if (!definition) {
          const baseWord = wordLower
            .replace(/ions?$/, '')      // facilitations -> facilitat, implementation -> implement
            .replace(/(?:ed|ing)$/, '') // implemented -> implement, implementing -> implement
            .replace(/(?:es|s)$/, '');  // symptoms -> symptom, processes -> process

          definition = definitions[baseWord];
        }

        if (definition) {
          const span = document.createElement('span');
          span.className = 'simple-mode-jargon';
          span.textContent = word;
          span.setAttribute('data-definition', definition);
          span.setAttribute('data-word', word);
          fragment.appendChild(span);
        } else {
          fragment.appendChild(document.createTextNode(word));
        }

        lastIndex = regex.lastIndex;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
      }

      parent.replaceChild(fragment, element);
      if (parent.nodeType === Node.ELEMENT_NODE) {
        (parent as Element).classList.add('simple-mode-processed');
      }
    }
  } else {
    // Recurse into child nodes
    const children = Array.from(element.childNodes);
    children.forEach(child => processTextNodes(child, pattern, definitions));
  }
}

function removeSimpleMode() {
  console.log('🔄 Simple Mode: Removing jargon tooltips...');

  // Remove jargon tooltips
  const spanCount = document.querySelectorAll('.simple-mode-jargon').length;
  document.querySelectorAll('.simple-mode-jargon').forEach(span => {
    const parent = span.parentNode;
    if (parent) {
      const textNode = document.createTextNode(span.textContent || '');
      parent.replaceChild(textNode, span);
    }
  });

  // Normalize text nodes
  document.querySelectorAll('.simple-mode-processed').forEach(el => {
    el.classList.remove('simple-mode-processed');
    el.normalize();
  });

  console.log(`✅ Simple Mode: Removed ${spanCount} jargon tooltips`);
}

// Calm Mode Functions
function applyCalmMode() {
  // Increase text readability
  document.body.classList.add('calm-text-enhanced');

  // Reduce choices by collapsing secondary actions
  const secondaryActions = document.querySelectorAll(
    'button:not([type="submit"]):not(.primary), [role="button"]:not(.primary)'
  );

  secondaryActions.forEach(btn => {
    if (!btn.classList.contains('calm-mode-hidden')) {
      btn.classList.add('calm-mode-secondary');
    }
  });
}

function removeCalmMode() {
  document.body.classList.remove('calm-text-enhanced');
  document.querySelectorAll('.calm-mode-secondary').forEach(el => {
    el.classList.remove('calm-mode-secondary');
  });
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyAllModes);
} else {
  applyAllModes();
}

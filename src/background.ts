// Background service worker for Accessibility Modes extension

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Accessibility Modes extension installed');

  // Initialize default state
  chrome.storage.local.set({
    focusMode: false,
    simpleMode: false,
    calmMode: false
  });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message: any, sender, sendResponse) => {
  if (message.type === 'GET_STATE') {
    chrome.storage.local.get(['focusMode', 'simpleMode', 'calmMode'], (result) => {
      sendResponse(result);
    });
    return true; // Keep message channel open for async response
  }
});

// Update icon based on active modes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    const anyModeActive =
      changes.focusMode?.newValue ||
      changes.simpleMode?.newValue ||
      changes.calmMode?.newValue;

    // You could update the extension icon here based on active modes
    if (anyModeActive) {
      console.log('At least one accessibility mode is active');
    }
  }
});

export {};

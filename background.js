// Open the extension side panel when its toolbar action is clicked.

async function enableActionClick() {
  try {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  } catch (error) {
    console.error('Google Tasks Sidebar Pro: could not enable action-click behavior', error);
  }
}

// Apply on worker startup and after installation/update.
enableActionClick();
chrome.runtime.onInstalled.addListener(enableActionClick);
chrome.runtime.onStartup.addListener(enableActionClick);

const accountSelect = document.getElementById('account');
const themeSelect = document.getElementById('theme');
const frame = document.getElementById('tasks');
const settingsButton = document.getElementById('settingsButton');
const settingsPanel = document.getElementById('settingsPanel');
const settingsBackdrop = document.getElementById('settingsBackdrop');
const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let selectedTheme = 'dark';

function setSettingsOpen(open) {
  settingsPanel.hidden = !open;
  settingsBackdrop.hidden = !open;
  settingsButton.setAttribute('aria-expanded', String(open));
}

settingsButton.addEventListener('click', () => {
  setSettingsOpen(settingsPanel.hidden);
});

settingsBackdrop.addEventListener('click', () => setSettingsOpen(false));

document.addEventListener('pointerdown', (event) => {
  if (!settingsPanel.hidden && !settingsPanel.contains(event.target) && !settingsButton.contains(event.target)) {
    setSettingsOpen(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !settingsPanel.hidden) {
    setSettingsOpen(false);
    settingsButton.focus();
  }
});

function applyTheme(theme) {
  selectedTheme = theme;
  const systemDark = systemTheme.matches;
  const dark = theme === 'dark' || (theme === 'system' && systemDark);
  const scheme = theme === 'system' ? 'light dark' : theme;
  document.documentElement.style.colorScheme = scheme;
  document.body.style.colorScheme = scheme;
  frame.style.colorScheme = dark ? 'dark' : 'light';
  frame.classList.toggle('dark-content', dark);
  colorSchemeMeta.setAttribute('content', scheme);
}

function loadTasks(account) {
  const url = new URL('https://tasks.google.com/embed/');
  url.searchParams.set('origin', 'https://mail.google.com');
  url.searchParams.set('fullWidth', '1');
  url.searchParams.set('authuser', String(account));
  frame.src = url.toString();
  frame.title = `Google Tasks — Account ${Number(account)}`;
}

function renderAccounts(selectedAccount) {
  const options = Array.from(accountSelect.options).map(option => option.value);
  const selected = options.includes(String(selectedAccount)) ? String(selectedAccount) : '0';
  accountSelect.value = selected;
  return Number(selected);
}

chrome.storage.local.get({ googleAccount: 0, theme: 'dark' }, (settings) => {
  const selected = renderAccounts(settings.googleAccount);
  themeSelect.value = settings.theme;
  applyTheme(settings.theme);
  loadTasks(selected);
});

accountSelect.addEventListener('change', () => {
  const account = Number(accountSelect.value);
  chrome.storage.local.set({ googleAccount: account });
  loadTasks(account);
});

themeSelect.addEventListener('change', () => {
  const theme = themeSelect.value;
  chrome.storage.local.set({ theme });
  applyTheme(theme);
});


systemTheme.addEventListener('change', () => {
  if (selectedTheme === 'system') applyTheme('system');
});

/* ============================================
   VASLKAAR — Main App Controller
   SPA Router, Navigation, Init
   ============================================ */

// ---- Global State ---- //
const APP = {
  currentScreen: 'landing',
  currentProject: null,       // project being generated/viewed
  generatedResult: null,      // latest AI output
  sidebarOpen: false,
};

// ---- Screen Navigation ---- //
function navigateTo(screenName) {
  // Close mobile sidebar if open
  if (APP.sidebarOpen) {
    toggleSidebar();
  }

  // Determine if we need the app shell
  const fullScreens = ['landing', 'dna'];
  const appScreens = ['dashboard', 'new-project', 'generating', 'results', 'projects', 'project-detail', 'dna-settings', 'crm', 'invoices', 'payments', 'ideas', 'opportunities'];

  // Hide ALL full-page screens
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));

  // Hide ALL app screens
  document.querySelectorAll('.app-screen').forEach(s => s.classList.add('hidden'));

  if (fullScreens.includes(screenName)) {
    // Full-page screen (no sidebar)
    document.getElementById('app-shell').classList.add('hidden');
    const screen = document.getElementById(`screen-${screenName}`);
    if (screen) {
      screen.classList.remove('hidden');
      screen.classList.add('screen-enter');
    }
  } else if (appScreens.includes(screenName)) {
    // App screen (with sidebar)
    document.getElementById('app-shell').classList.remove('hidden');
    const screen = document.getElementById(`screen-${screenName}`);
    if (screen) {
      screen.classList.remove('hidden');
      screen.classList.add('screen-enter');
    }

    // Update sidebar active state
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.screen === screenName) {
        link.classList.add('active');
      }
    });
  }

  APP.currentScreen = screenName;

  // Re-init Lucide icons for the new screen
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Screen-specific init
  onScreenEnter(screenName);

  // Scroll to top
  window.scrollTo(0, 0);
}

// ---- Screen Enter Hooks ---- //
function onScreenEnter(screenName) {
  switch (screenName) {
    case 'dashboard':
      if (typeof updateDashboard === 'function') updateDashboard();
      updateGreeting();
      break;
    case 'projects':
      if (typeof renderProjectsList === 'function') renderProjectsList();
      break;
    case 'new-project':
      // Reset form if needed
      break;
    case 'dna-settings':
      if (typeof renderDnaCard === 'function') renderDnaCard();
      break;
    case 'crm':
      if (typeof renderClientList === 'function') renderClientList();
      break;
    case 'invoices':
      if (typeof renderInvoiceList === 'function') renderInvoiceList();
      break;
    case 'payments':
      if (typeof renderPaymentDashboard === 'function') renderPaymentDashboard();
      break;
  }
}

// ---- Sidebar Toggle (Mobile) ---- //
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  APP.sidebarOpen = !APP.sidebarOpen;

  if (APP.sidebarOpen) {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  } else {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  }
}

// ---- Toast Notification ---- //
function showToast(message, duration = 2000) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  msgEl.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ---- Copy to Clipboard ---- //
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard! ✓');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast('Copied to clipboard! ✓');
  } catch (e) {
    showToast('Failed to copy');
  }
  document.body.removeChild(textarea);
}

// ---- Greeting ---- //
function updateGreeting() {
  const hour = new Date().getHours();
  let greeting;
  if (hour < 12) greeting = 'Good morning ☀️';
  else if (hour < 17) greeting = 'Good afternoon 👋';
  else if (hour < 21) greeting = 'Good evening 🌙';
  else greeting = 'Working late? 🦉';

  const el = document.getElementById('dashboard-greeting');
  if (el) el.textContent = greeting;
}

// ---- Result Tab Switching ---- //
function switchResultTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.result-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.result-tab[data-tab="${tabName}"]`).classList.add('active');

  // Update tab content
  document.querySelectorAll('#screen-results .tab-content').forEach(c => c.classList.add('hidden'));
  document.getElementById(`tab-${tabName}`).classList.remove('hidden');

  // Re-init icons
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function switchDetailTab(tabName) {
  document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.detail-tab[data-tab="${tabName}"]`).classList.add('active');

  // Detail tab content rendering is handled by projects.js
  if (typeof renderDetailTabContent === 'function') {
    renderDetailTabContent(tabName);
  }
}

// ---- App Initialization ---- //
function initApp() {
  // Check if Design DNA exists
  const dna = typeof Storage !== 'undefined' ? localStorage.getItem('vaslkaar_dna') : null;

  if (dna) {
    // Returning user — go to dashboard
    navigateTo('dashboard');
  } else {
    // New user — show landing page
    navigateTo('landing');
  }

  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  console.log('%c VASLKAAR ', 'background: #1A1A1A; color: #C9A84C; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;', 'Your work, connected. ✨');
}

// ---- Skip DNA Setup ---- //
function skipDna() {
  // Save a minimal DNA profile
  const minimalDna = {
    aesthetics: [],
    inspirations: '',
    description: '',
    sampleImages: [],
    createdAt: new Date().toISOString()
  };

  if (typeof saveDNA === 'function') {
    saveDNA(minimalDna);
  } else {
    localStorage.setItem('vaslkaar_dna', JSON.stringify(minimalDna));
  }

  navigateTo('dashboard');
  showToast('You can set up Design DNA later from Settings');
}

// ---- Run on Load ---- //
document.addEventListener('DOMContentLoaded', initApp);

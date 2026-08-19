/**
 * Anti-inspection guard.
 *
 * Deterrents (not bulletproof — client-side code can never be fully hidden):
 *  - Right-click / context menu blocked
 *  - F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S blocked
 *  - console.log / warn / error / info / debug / table / trace silenced
 *  - DevTools open detection (window-size + debugger-timing) -> reload page
 *
 * To build a minified production bundle (harder to read the source):
 *     npm run build
 */

/* eslint-disable no-console */

// 1) Block the context menu (right-click -> Inspect / View Source)
window.addEventListener('contextmenu', (e) => e.preventDefault());

// 2) Block common DevTools / view-source keyboard shortcuts
const BLOCKED_KEYS = ['u', 's', 'i', 'j', 'c', 'k', 'p'];
document.addEventListener(
  'keydown',
  (e: KeyboardEvent) => {
    const key = e.key?.toLowerCase() ?? '';
    if (key === 'f12') {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (
      (e.ctrlKey || e.metaKey) &&
      BLOCKED_KEYS.includes(key)
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  },
  true // capture phase
);

// 3) Silence the console (nothing shows in the Console tab)
const noop = (): void => undefined;
['log', 'debug', 'info', 'warn', 'error', 'table', 'trace'].forEach((method) => {
  (console as unknown as Record<string, unknown>)[method] = noop;
});

// 4) Detect whether DevTools is open
let devtoolsOpen = false;
const THRESHOLD = 160;

const detectBySize = (): void => {
  const widthDelta = window.outerWidth - window.innerWidth;
  const heightDelta = window.outerHeight - window.innerHeight;
  if (widthDelta > THRESHOLD || heightDelta > THRESHOLD) {
    devtoolsOpen = true;
  }
};

const detectByDebugger = (): void => {
  const start = performance.now();
  debugger; // pauses only when DevTools debugger is attached
  if (performance.now() - start > 100) {
    devtoolsOpen = true;
  }
};

const respond = (): void => {
  if (devtoolsOpen) {
    // Wipe the page and reload so the console/source view is cleared
    document.body.innerHTML = '';
    window.location.reload();
  }
};

window.addEventListener('resize', () => {
  detectBySize();
  respond();
});

setInterval(() => {
  detectBySize();
  detectByDebugger();
  respond();
}, 1000);

window.addEventListener('load', () => {
  detectBySize();
  respond();
});

export {};

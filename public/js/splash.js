/* ==========================================================================
   MediMate 6-7 Second Opening Splash Screen Animation Module
   ========================================================================== */

let splashTimer = null;
let sloganInterval = null;
let progressInterval = null;

const SPLASH_DURATION_MS = 6500; // 6.5 seconds total opening sequence

// Attractive health slogans to sequence during opening animation
const ATTRACTIVE_SLOGANS = [
  "Your Health, Your Priority",
  "Never Miss a Scheduled Dose Again",
  "Health Dashboard"
];

/**
 * Initializes and starts the 6.5s opening splash animation sequence.
 */
function initSplashScreen() {
  const splashOverlay = document.getElementById('splashScreen');
  if (!splashOverlay) return;

  // Ensure visible
  splashOverlay.style.display = 'flex';
  splashOverlay.classList.remove('splash-fade-out');

  const sloganEl = document.getElementById('splashSloganText');
  const progressBar = document.getElementById('splashProgressBar');

  let sloganIndex = 0;
  if (sloganEl) {
    sloganEl.textContent = ATTRACTIVE_SLOGANS[0];
    sloganEl.classList.add('splash-text-animate');
  }

  // Slogan rotation sequence: rotate words every ~2.1 seconds
  sloganInterval = setInterval(() => {
    sloganIndex = (sloganIndex + 1) % ATTRACTIVE_SLOGANS.length;
    if (sloganEl) {
      sloganEl.classList.remove('splash-text-animate');
      // Trigger reflow for CSS animation reset
      void sloganEl.offsetWidth;
      sloganEl.textContent = ATTRACTIVE_SLOGANS[sloganIndex];
      sloganEl.classList.add('splash-text-animate');
    }
  }, 2100);

  // Smooth Progress Bar fill animation
  let startTime = Date.now();
  progressInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progressPercent = Math.min(100, (elapsed / SPLASH_DURATION_MS) * 100);
    if (progressBar) {
      progressBar.style.width = `${progressPercent}%`;
    }
    if (elapsed >= SPLASH_DURATION_MS) {
      clearInterval(progressInterval);
    }
  }, 30);

  // Auto dismiss after 6.5 seconds
  splashTimer = setTimeout(() => {
    dismissSplashScreen();
  }, SPLASH_DURATION_MS);
}

/**
 * Gracefully dismisses the splash screen with a smooth fade-out transition.
 */
function dismissSplashScreen() {
  if (splashTimer) clearTimeout(splashTimer);
  if (sloganInterval) clearInterval(sloganInterval);
  if (progressInterval) clearInterval(progressInterval);

  const splashOverlay = document.getElementById('splashScreen');
  if (!splashOverlay) return;

  splashOverlay.classList.add('splash-fade-out');

  setTimeout(() => {
    splashOverlay.style.display = 'none';
  }, 700);
}

// Global exports
window.initSplashScreen = initSplashScreen;
window.dismissSplashScreen = dismissSplashScreen;

// Launch splash sequence on document load
document.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
});

/* ==========================================================================
   MediMate Lightweight Cyber-Neon Sparkle Particle Engine
   ========================================================================== */

(function () {
  'use strict';

  // Neon Color Map (Hex values for particle glow & box-shadows)
  const NEON_COLORS = {
    cyan: '#00f3ff',
    blue: '#0066ff',
    purple: '#b026ff',
    pink: '#ff007f',
    lime: '#39ff14',
    violet: '#8a2be2',
    skyblue: '#00bfff',
    amber: '#ff9900',
    teal: '#0d9488'
  };

  // Throttle helper to avoid excessive hover particle creation
  let lastHoverTime = 0;
  const HOVER_THROTTLE_MS = 120;

  /**
   * Checks if user has enabled prefers-reduced-motion.
   */
  function isReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Checks if current viewport is mobile screen size (<768px).
   */
  function isMobile() {
    return window.innerWidth < 768;
  }

  /**
   * Resolves target element's neon color hex.
   */
  function resolveNeonColor(element) {
    if (!element) return NEON_COLORS.cyan;
    const colorKey = element.getAttribute('data-neon-color') || element.closest('[data-neon-color]')?.getAttribute('data-neon-color');
    return NEON_COLORS[colorKey] || NEON_COLORS.cyan;
  }

  /**
   * Creates a single sparkle particle DOM element.
   */
  function createParticleElement(x, y, color, type = 'dot') {
    const particle = document.createElement('span');
    particle.className = `neon-particle particle-${type}`;

    // Randomize scale & trajectory
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * (isMobile() ? 35 : 55) + 15;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const size = Math.random() * (type === 'star' ? 10 : 6) + 4;
    const duration = Math.random() * 300 + 450; // 450ms - 750ms

    particle.style.cssText = `
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      --particle-tx: ${tx}px;
      --particle-ty: ${ty}px;
      --particle-color: ${color};
      animation-duration: ${duration}ms;
    `;

    if (type === 'star') {
      particle.innerHTML = '✦';
      particle.style.color = color;
      particle.style.fontSize = `${size + 2}px`;
    }

    document.body.appendChild(particle);

    // Auto cleanup after animation ends
    setTimeout(() => {
      particle.remove();
    }, duration + 50);
  }

  /**
   * Generates hover sparkles around an element.
   */
  function triggerHoverSparkles(event, element) {
    if (isReducedMotion()) return;

    const now = Date.now();
    if (now - lastHoverTime < HOVER_THROTTLE_MS) return;
    lastHoverTime = now;

    const rect = element.getBoundingClientRect();
    const color = resolveNeonColor(element);
    const particleCount = isMobile() ? 3 : 5;

    for (let i = 0; i < particleCount; i++) {
      const rx = rect.left + Math.random() * rect.width;
      const ry = rect.top + Math.random() * rect.height;
      const type = Math.random() > 0.6 ? 'star' : 'dot';
      createParticleElement(rx, ry, color, type);
    }
  }

  /**
   * Generates a strong click/tap sparkle burst outwards from click coordinates.
   */
  function triggerClickBurst(event, element) {
    if (isReducedMotion()) return;

    const rect = element.getBoundingClientRect();
    const clickX = event.clientX || (rect.left + rect.width / 2);
    const clickY = event.clientY || (rect.top + rect.height / 2);
    const color = resolveNeonColor(element);
    const particleCount = isMobile() ? 9 : 15;

    for (let i = 0; i < particleCount; i++) {
      const type = i % 3 === 0 ? 'star' : i % 2 === 0 ? 'streak' : 'dot';
      createParticleElement(clickX, clickY, color, type);
    }
  }

  /**
   * Initializes sparkle particle event listeners.
   */
  function initSparkleListeners() {
    const selectors = [
      '.brand',
      '.nav-item',
      '.mobile-nav-item',
      '.primary-btn',
      '.secondary-btn',
      '.danger-btn',
      '.take-action-btn',
      '.summary-card',
      '.med-card',
      '.prompt-chip'
    ];

    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest(selectors.join(','));
      if (target) {
        triggerHoverSparkles(e, target);
      }
    });

    document.addEventListener('click', (e) => {
      const target = e.target.closest(selectors.join(','));
      if (target) {
        triggerClickBurst(e, target);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSparkleListeners);
  } else {
    initSparkleListeners();
  }

  // Global Export
  window.triggerSparkleBurst = (x, y, color = NEON_COLORS.cyan) => {
    for (let i = 0; i < 12; i++) {
      createParticleElement(x, y, color, i % 2 === 0 ? 'star' : 'dot');
    }
  };
})();

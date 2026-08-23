/* ==========================================================================
   MediMate Web Audio API Sound Chime & Speech Synthesis Module
   ========================================================================== */

let audioCtx = null;

// Initialize or resume Web Audio Context safely on user gesture
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch((e) => console.warn('AudioContext resume error:', e));
  }
  return audioCtx;
}

/**
 * Plays a pleasant, melodic healthcare notification chime.
 */
function playChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Harmonic sequence frequencies (C5 -> E5 -> G5)
    const notes = [523.25, 659.25, 783.99];

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.12);

      // Envelope: smooth attack & exponential decay
      gain.gain.setValueAtTime(0.001, now + index * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.3, now + index * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.12);
      osc.stop(now + index * 0.12 + 0.65);
    });
  } catch (err) {
    console.warn('Unable to play audio chime:', err);
  }
}

/**
 * Uses SpeechSynthesis API to pronounce medication voice reminder.
 */
function speakVoiceReminder(medName, dosage) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const text = `MediMate reminder. It is time to take your ${medName}, ${dosage}.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Voice synthesis error:', err);
  }
}

/**
 * Speaks an AI health assistant response text.
 */
function speakAIResponse(text) {
  if (!('speechSynthesis' in window)) {
    showToast('Speech synthesis is not supported in your browser.', 'warning');
    return;
  }

  try {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel(); // Toggle off if already speaking
      return;
    }

    // Clean markdown symbols for cleaner speech
    const cleanText = text.replace(/[*_#`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Error reading AI response aloud:', err);
  }
}

// Bind functions to window
window.playChime = playChime;
window.speakVoiceReminder = speakVoiceReminder;
window.speakAIResponse = speakAIResponse;

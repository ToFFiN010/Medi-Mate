/* ==========================================================================
   MediMate Custom Audio Ringtone, Alarm Styles & Localized Voice Reminder Module
   ========================================================================== */

let audioCtx = null;
let activeCustomAudio = null;
let volumeRampInterval = null;

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
 * Plays a pleasant, melodic healthcare notification chime via Web Audio API.
 * Supports style variations (gentle, standard, urgent, silent_vibe).
 */
function playChime(style = 'standard') {
  if (style === 'silent_vibe') {
    triggerVibration('silent_vibe');
    return;
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5 -> E5 -> G5
    const isGentle = style === 'gentle';
    const isUrgent = style === 'urgent';

    const maxGain = isGentle ? 0.15 : isUrgent ? 0.45 : 0.3;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isUrgent ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.12);

      const startTime = now + index * 0.12;
      const duration = isUrgent ? 0.8 : 0.6;

      if (isGentle) {
        // Soft gradual attack
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(maxGain, startTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      } else {
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(maxGain, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });

    if (isUrgent) {
      triggerVibration('urgent');
    }
  } catch (err) {
    console.warn('Unable to play Web Audio chime:', err);
  }
}

/**
 * Triggers hardware vibration patterns if supported by device browser.
 */
function triggerVibration(style = 'standard') {
  if (!('vibrate' in navigator)) return;

  try {
    if (style === 'urgent') {
      navigator.vibrate([400, 150, 400, 150, 400]);
    } else if (style === 'silent_vibe') {
      navigator.vibrate([500, 200, 500]);
    } else if (style === 'gentle') {
      navigator.vibrate([200, 300, 200]);
    } else {
      navigator.vibrate([300, 100, 300]);
    }
  } catch (e) {
    console.warn('Vibration API error:', e);
  }
}

/**
 * Master Alarm Sound Engine: Plays custom uploaded ringtone OR default chime.
 * Integrates style behavior (Gentle, Standard, Urgent/Persistent, Silent+Vibe).
 */
function playAlarmTone(style = 'standard') {
  stopAlarmAudio(); // Stop any existing playing sound

  const customUrl = window.appSettings ? window.appSettings.customRingtoneUrl : null;

  if (style === 'silent_vibe') {
    triggerVibration('silent_vibe');
    return;
  }

  if (customUrl) {
    try {
      activeCustomAudio = new Audio(customUrl);
      activeCustomAudio.loop = (style === 'urgent');

      if (style === 'gentle') {
        activeCustomAudio.volume = 0.05;
        activeCustomAudio.play().catch(() => playChime(style));
        
        let currentVol = 0.05;
        volumeRampInterval = setInterval(() => {
          if (!activeCustomAudio) {
            clearInterval(volumeRampInterval);
            return;
          }
          currentVol = Math.min(0.8, currentVol + 0.05);
          activeCustomAudio.volume = currentVol;
          if (currentVol >= 0.8) clearInterval(volumeRampInterval);
        }, 1000);
      } else if (style === 'urgent') {
        activeCustomAudio.volume = 1.0;
        activeCustomAudio.play().catch(() => playChime(style));
        triggerVibration('urgent');
      } else {
        // Standard style
        activeCustomAudio.volume = 0.7;
        activeCustomAudio.play().catch(() => playChime(style));
      }
      return;
    } catch (err) {
      console.warn('Custom ringtone playback failed, falling back to Web Audio chime:', err);
      playChime(style);
      return;
    }
  }

  // Fallback to Web Audio API synthesized chime
  playChime(style);
}

/**
 * Stops any currently active alarm audio, volume ramp, and vibration.
 */
function stopAlarmAudio() {
  if (volumeRampInterval) {
    clearInterval(volumeRampInterval);
    volumeRampInterval = null;
  }

  if (activeCustomAudio) {
    try {
      activeCustomAudio.pause();
      activeCustomAudio.currentTime = 0;
    } catch (e) {}
    activeCustomAudio = null;
  }

  if ('vibrate' in navigator) {
    try { navigator.vibrate(0); } catch (e) {}
  }
}

/**
 * Plays preview of user custom ringtone or default chime for testing in Settings.
 */
function playCustomRingtonePreview() {
  playAlarmTone(window.appSettings?.defaultAlarmStyle || 'standard');
}

/**
 * Stops audio preview.
 */
function stopCustomRingtonePreview() {
  stopAlarmAudio();
}

/**
 * Localized Text-to-speech (TTS) reminder alert.
 * Switches voice language to match selected app language (English, Tamil, Hindi).
 */
function speakVoiceReminder(medName, dosage) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'en';
    const localizedText = window.t
      ? window.t('speechReminder', { name: medName, dosage: dosage })
      : `MediMate reminder. It is time to take your ${medName}, ${dosage}.`;

    const utterance = new SpeechSynthesisUtterance(localizedText);
    const locale = window.getTTSLocale ? window.getTTSLocale(currentLang) : 'en-US';
    utterance.lang = locale;

    const matchedVoice = window.getBestVoiceForLocale ? window.getBestVoiceForLocale(locale) : null;
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Voice synthesis error:', err);
  }
}

/**
 * Speaks an AI health assistant response text in active language locale.
 */
function speakAIResponse(text) {
  if (!('speechSynthesis' in window)) {
    if (window.showToast) window.showToast('Speech synthesis is not supported in your browser.', 'warning');
    return;
  }

  try {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }

    const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'en';
    const cleanText = text.replace(/[*_#`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const locale = window.getTTSLocale ? window.getTTSLocale(currentLang) : 'en-US';
    utterance.lang = locale;

    const matchedVoice = window.getBestVoiceForLocale ? window.getBestVoiceForLocale(locale) : null;
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Error reading AI response aloud:', err);
  }
}

// Bind functions to window
window.playChime = playChime;
window.playAlarmTone = playAlarmTone;
window.stopAlarmAudio = stopAlarmAudio;
window.playCustomRingtonePreview = playCustomRingtonePreview;
window.stopCustomRingtonePreview = stopCustomRingtonePreview;
window.speakVoiceReminder = speakVoiceReminder;
window.speakAIResponse = speakAIResponse;

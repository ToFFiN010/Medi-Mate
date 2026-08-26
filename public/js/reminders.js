/* ==========================================================================
   MediMate Automatic Medication Alarm & Reminder System
   ========================================================================== */

let alarmIntervalId = null;
let currentActiveAlarmMed = null;
const triggeredRemindersSet = new Set();
const snoozedRemindersMap = new Map(); // key: medId, value: timestamp

/**
 * Starts the periodic alarm schedule checker.
 */
function startAlarmChecker() {
  if (alarmIntervalId) clearInterval(alarmIntervalId);

  // Initial check
  checkScheduledReminders();

  // Poll periodically (every 10 seconds)
  alarmIntervalId = setInterval(checkScheduledReminders, 10000);
}

/**
 * Checks medications against current system time.
 */
function checkScheduledReminders() {
  if (!window.appSettings || !window.appSettings.enableReminders) return;

  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTimeString = `${currentHours}:${currentMinutes}`;
  const currentDateString = now.toISOString().split('T')[0];

  const medications = window.medications || [];

  medications.forEach((med) => {
    if (med.taken || med.status === 'taken') return; // Skip completed medications

    // Deduplication Key: medId + currentDate + scheduledTime
    const triggerKey = `${med.id}_${currentDateString}_${med.time}`;

    // Check if alarm was already triggered today for this scheduled dose
    if (triggeredRemindersSet.has(triggerKey)) return;

    // Check if snooze timer is currently active for this med
    const snoozeTime = snoozedRemindersMap.get(med.id);
    if (snoozeTime && Date.now() < snoozeTime) return;

    // Trigger condition: Current time matches scheduled time OR snooze timer elapsed
    const isScheduledNow = (currentTimeString === med.time);
    const isSnoozeExpired = (snoozeTime && Date.now() >= snoozeTime);

    if (isScheduledNow || isSnoozeExpired) {
      triggeredRemindersSet.add(triggerKey);
      if (snoozeTime) snoozedRemindersMap.delete(med.id); // clear expired snooze

      triggerMedicationAlarm(med);
    }
  });
}

/**
 * Opens alarm reminder modal and triggers sound/voice dynamically according to alarm style.
 */
function triggerMedicationAlarm(med) {
  currentActiveAlarmMed = med;

  const alarmStyle = med.alarmStyle || (window.appSettings ? window.appSettings.defaultAlarmStyle : 'standard') || 'standard';

  // Format scheduled time according to user 12h/24h preference
  const formattedTime = window.formatTimeDisplay ? window.formatTimeDisplay(med.time) : med.time;

  // Dynamically update Modal UI
  const nameEl = document.getElementById('alarmMedName');
  const dosageEl = document.getElementById('alarmMedDosage');
  const timeEl = document.getElementById('alarmMedTime');
  const modalCard = document.querySelector('.alarm-modal-card');
  const styleBadgeEl = document.getElementById('alarmStyleBadge');

  if (nameEl) nameEl.textContent = med.name;
  if (dosageEl) dosageEl.textContent = med.dosage;
  if (timeEl) {
    const timeLabel = window.t ? window.t('scheduledFor', { time: formattedTime }) : `Scheduled for ${formattedTime}`;
    timeEl.innerHTML = `<i data-lucide="clock"></i> ${timeLabel}`;
  }

  // Update Alarm Style Badge & Card Animation
  if (styleBadgeEl) {
    let badgeText = 'Standard Alarm';
    let badgeClass = 'badge-info';

    if (alarmStyle === 'gentle') {
      badgeText = window.t ? window.t('alarmStyleGentle') : 'Gentle Alarm';
      badgeClass = 'badge-info';
    } else if (alarmStyle === 'urgent') {
      badgeText = window.t ? window.t('alarmStyleUrgent') : 'Urgent Alarm';
      badgeClass = 'badge-warning';
    } else if (alarmStyle === 'silent_vibe') {
      badgeText = window.t ? window.t('alarmStyleSilentVibe') : 'Silent + Vibration';
      badgeClass = 'badge-pending';
    } else {
      badgeText = window.t ? window.t('alarmStyleStandard') : 'Standard Alarm';
    }
    styleBadgeEl.textContent = badgeText;
    styleBadgeEl.className = `badge ${badgeClass}`;
  }

  if (modalCard) {
    if (alarmStyle === 'urgent') {
      modalCard.classList.add('urgent-pulse-card');
    } else {
      modalCard.classList.remove('urgent-pulse-card');
    }
  }

  if (window.lucide) window.lucide.createIcons();

  openModal('alarmModal');

  // Play Sound & Alarm Ringtone according to style
  if (window.appSettings && (window.appSettings.alarmSound || alarmStyle === 'urgent')) {
    if (window.playAlarmTone) {
      window.playAlarmTone(alarmStyle);
    } else if (window.playChime) {
      window.playChime(alarmStyle);
    }
  } else if (alarmStyle === 'silent_vibe') {
    if (window.playAlarmTone) window.playAlarmTone('silent_vibe');
  }

  // Localized Voice Reminder (skip if silent style)
  if (window.appSettings && window.appSettings.voiceReminders && alarmStyle !== 'silent_vibe') {
    if (window.speakVoiceReminder) {
      window.speakVoiceReminder(med.name, med.dosage);
    }
  }

  // Toast notification
  const dueMsg = window.t ? window.t('reminderDueAlert', { name: med.name, dosage: med.dosage }) : `Reminder: ${med.name} (${med.dosage}) is due now.`;
  showToast(dueMsg, 'warning');
}

/**
 * Handles test alarm button in Settings.
 */
function triggerTestAlarm() {
  const currentFormat = window.appSettings ? window.appSettings.timeFormat : '12h';
  const testMed = {
    id: 'test-999',
    name: 'Metformin XR (Test Alarm)',
    dosage: '500 mg (1 tablet)',
    time: currentFormat === '24h' ? '20:00' : '08:00 PM',
    taken: false,
    status: 'pending',
    stock: 42,
    alarmStyle: window.appSettings ? window.appSettings.defaultAlarmStyle : 'standard'
  };

  triggerMedicationAlarm(testMed);
}

/**
 * Handles "Mark Taken" button inside the Alarm Modal.
 */
function handleAlarmTaken() {
  if (currentActiveAlarmMed) {
    if (currentActiveAlarmMed.id !== 'test-999') {
      markTaken(currentActiveAlarmMed.id);
    } else {
      showToast('Test medication marked as taken.', 'success');
    }
  }
  dismissAlarm();
}

/**
 * Handles "Remind Me Later" (Snooze) button inside Alarm Modal.
 */
function handleAlarmSnooze() {
  if (!currentActiveAlarmMed) {
    dismissAlarm();
    return;
  }

  const minutes = parseInt(window.appSettings ? window.appSettings.snoozeMinutes || 10 : 10, 10);
  const snoozeDelayMs = minutes * 60 * 1000;

  snoozedRemindersMap.set(currentActiveAlarmMed.id, Date.now() + snoozeDelayMs);

  showToast(`Reminder snoozed for ${minutes} minutes.`, 'info');
  dismissAlarm();
}

/**
 * Dismisses alarm modal and stops playing alarm tones & vibration loops.
 */
function dismissAlarm() {
  closeModal('alarmModal');
  currentActiveAlarmMed = null;

  if (window.stopAlarmAudio) {
    window.stopAlarmAudio();
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// Global bindings
window.startAlarmChecker = startAlarmChecker;
window.triggerTestAlarm = triggerTestAlarm;
window.handleAlarmTaken = handleAlarmTaken;
window.handleAlarmSnooze = handleAlarmSnooze;
window.dismissAlarm = dismissAlarm;

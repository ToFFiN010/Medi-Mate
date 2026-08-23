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
 * Opens alarm reminder modal and triggers sound/voice dynamically.
 */
function triggerMedicationAlarm(med) {
  currentActiveAlarmMed = med;

  // Dynamically update Modal UI
  const nameEl = document.getElementById('alarmMedName');
  const dosageEl = document.getElementById('alarmMedDosage');
  const timeEl = document.getElementById('alarmMedTime');

  if (nameEl) nameEl.textContent = med.name;
  if (dosageEl) dosageEl.textContent = med.dosage;
  if (timeEl) timeEl.innerHTML = `<i data-lucide="clock"></i> Scheduled for ${med.time}`;

  if (window.lucide) window.lucide.createIcons();

  openModal('alarmModal');

  // Play Sound & Voice according to user settings
  if (window.appSettings.alarmSound) {
    playChime();
  }

  if (window.appSettings.voiceReminders) {
    speakVoiceReminder(med.name, med.dosage);
  }

  // Toast notification
  showToast(`Reminder: ${med.name} (${med.dosage}) is due now.`, 'warning');
}

/**
 * Handles test alarm button in Settings.
 */
function triggerTestAlarm() {
  const testMed = {
    id: 'test-999',
    name: 'Metformin XR (Test Alarm)',
    dosage: '500 mg (1 tablet)',
    time: 'Now',
    taken: false,
    status: 'pending',
    stock: 42
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

  const minutes = parseInt(window.appSettings.snoozeMinutes || 10, 10);
  const snoozeDelayMs = minutes * 60 * 1000;

  snoozedRemindersMap.set(currentActiveAlarmMed.id, Date.now() + snoozeDelayMs);

  showToast(`Reminder snoozed for ${minutes} minutes.`, 'info');
  dismissAlarm();
}

/**
 * Dismisses alarm modal.
 */
function dismissAlarm() {
  closeModal('alarmModal');
  currentActiveAlarmMed = null;
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

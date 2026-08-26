/* ==========================================================================
   MediMate Core Application State & Navigation Router
   ========================================================================== */

// Global Application State
window.medications = [];
window.medicationHistory = [];
window.appSettings = {
  enableReminders: true,
  voiceReminders: true,
  alarmSound: true,
  snoozeMinutes: 10,
  lowStockAlerts: true,
  language: 'en', // 'en' | 'ta' | 'hi'
  timeFormat: '12h', // '12h' | '24h'
  customRingtoneUrl: null,
  customRingtoneName: null,
  defaultAlarmStyle: 'standard' // 'gentle' | 'standard' | 'urgent' | 'silent_vibe'
};
window.currentFilter = 'all';
window.searchQuery = '';

// 20 Sample Active Medications in Cabinet
const DEFAULT_SEED_MEDICATIONS = [
  {
    id: 'med-101',
    name: 'Lisinopril',
    dosage: '10 mg',
    time: '08:00',
    stock: 27,
    category: 'pill',
    neonColor: 'cyan',
    notes: 'Take in the morning with food.',
    taken: true,
    status: 'taken',
    alarmStyle: 'gentle'
  },
  {
    id: 'med-102',
    name: 'Metformin XR',
    dosage: '500 mg',
    time: '20:00',
    stock: 14,
    category: 'capsule',
    neonColor: 'purple',
    notes: 'Take with evening dinner.',
    taken: false,
    status: 'pending',
    alarmStyle: 'urgent'
  },
  {
    id: 'med-103',
    name: 'Atorvastatin',
    dosage: '20 mg',
    time: '21:00',
    stock: 20,
    category: 'pill',
    neonColor: 'teal',
    notes: 'Take at bedtime.',
    taken: false,
    status: 'pending',
    alarmStyle: 'standard'
  },
  {
    id: 'med-104',
    name: 'Amlodipine',
    dosage: '5 mg',
    time: '09:00',
    stock: 30,
    category: 'pill',
    neonColor: 'blue',
    notes: 'Take once daily.',
    taken: true,
    status: 'taken',
    alarmStyle: 'standard'
  },
  {
    id: 'med-105',
    name: 'Losartan',
    dosage: '50 mg',
    time: '08:00',
    stock: 30,
    category: 'pill',
    neonColor: 'lime',
    notes: 'Take in the morning.',
    taken: false,
    status: 'pending',
    alarmStyle: 'gentle'
  },
  {
    id: 'med-106',
    name: 'Omeprazole',
    dosage: '20 mg',
    time: '07:30',
    stock: 30,
    category: 'capsule',
    neonColor: 'amber',
    notes: 'Take before breakfast.',
    taken: true,
    status: 'taken',
    alarmStyle: 'silent_vibe'
  },
  {
    id: 'med-107',
    name: 'Levothyroxine',
    dosage: '50 mcg',
    time: '07:00',
    stock: 30,
    category: 'pill',
    neonColor: 'violet',
    notes: 'Take before breakfast.',
    taken: true,
    status: 'taken',
    alarmStyle: 'standard'
  },
  {
    id: 'med-108',
    name: 'Cetirizine',
    dosage: '10 mg',
    time: '21:00',
    stock: 20,
    category: 'pill',
    neonColor: 'pink',
    notes: 'Take in the evening.',
    taken: false,
    status: 'pending',
    alarmStyle: 'gentle'
  },
  {
    id: 'med-109',
    name: 'Pantoprazole',
    dosage: '40 mg',
    time: '07:30',
    stock: 30,
    category: 'pill',
    neonColor: 'teal',
    notes: 'Take before breakfast.',
    taken: true,
    status: 'taken',
    alarmStyle: 'standard'
  },
  {
    id: 'med-110',
    name: 'Montelukast',
    dosage: '10 mg',
    time: '21:00',
    stock: 30,
    category: 'pill',
    neonColor: 'purple',
    notes: 'Take in the evening.',
    taken: false,
    status: 'pending',
    alarmStyle: 'standard'
  },
  {
    id: 'med-111',
    name: 'Vitamin D3',
    dosage: '1000 IU',
    time: '13:00',
    stock: 60,
    category: 'capsule',
    neonColor: 'amber',
    notes: 'Take with a meal.',
    taken: true,
    status: 'taken',
    alarmStyle: 'gentle'
  },
  {
    id: 'med-112',
    name: 'Calcium Carbonate',
    dosage: '500 mg',
    time: '13:00',
    stock: 60,
    category: 'pill',
    neonColor: 'cyan',
    notes: 'Take with food.',
    taken: true,
    status: 'taken',
    alarmStyle: 'standard'
  },
  {
    id: 'med-113',
    name: 'Folic Acid',
    dosage: '5 mg',
    time: '09:00',
    stock: 30,
    category: 'pill',
    neonColor: 'lime',
    notes: 'Take once daily.',
    taken: true,
    status: 'taken',
    alarmStyle: 'standard'
  },
  {
    id: 'med-114',
    name: 'Aspirin',
    dosage: '75 mg',
    time: '08:00',
    stock: 30,
    category: 'pill',
    neonColor: 'rose',
    notes: 'Take at the scheduled time.',
    taken: true,
    status: 'taken',
    alarmStyle: 'urgent'
  },
  {
    id: 'med-115',
    name: 'Clopidogrel',
    dosage: '75 mg',
    time: '08:00',
    stock: 30,
    category: 'pill',
    neonColor: 'blue',
    notes: 'Take once daily.',
    taken: false,
    status: 'pending',
    alarmStyle: 'standard'
  },
  {
    id: 'med-116',
    name: 'Glimepiride',
    dosage: '2 mg',
    time: '08:00',
    stock: 30,
    category: 'pill',
    neonColor: 'cyan',
    notes: 'Take with breakfast.',
    taken: true,
    status: 'taken',
    alarmStyle: 'gentle'
  },
  {
    id: 'med-117',
    name: 'Paracetamol',
    dosage: '500 mg',
    time: '18:00',
    stock: 20,
    category: 'pill',
    neonColor: 'skyblue',
    notes: 'Use only as directed.',
    taken: false,
    status: 'pending',
    alarmStyle: 'standard'
  },
  {
    id: 'med-118',
    name: 'Ibuprofen',
    dosage: '200 mg',
    time: '14:00',
    stock: 20,
    category: 'pill',
    neonColor: 'amber',
    notes: 'Take with food.',
    taken: true,
    status: 'taken',
    alarmStyle: 'standard'
  },
  {
    id: 'med-119',
    name: 'Azithromycin',
    dosage: '250 mg',
    time: '09:00',
    stock: 6,
    category: 'pill',
    neonColor: 'pink',
    notes: 'Follow the prescribed schedule.',
    taken: true,
    status: 'taken',
    alarmStyle: 'urgent'
  },
  {
    id: 'med-120',
    name: 'Amoxicillin',
    dosage: '500 mg',
    time: '08:00',
    stock: 21,
    category: 'capsule',
    neonColor: 'violet',
    notes: 'Follow the prescribed schedule.',
    taken: false,
    status: 'pending',
    alarmStyle: 'standard'
  }
];

// 20 Sample Medications Catalog for History Log
const SAMPLE_MEDICATIONS_CATALOG = [
  { name: 'Lisinopril', dosage: '10 mg', quantity: '30 tablets', scheduledTime: '08:00 AM' },
  { name: 'Metformin XR', dosage: '500 mg', quantity: '60 tablets', scheduledTime: '08:00 PM' },
  { name: 'Atorvastatin', dosage: '20 mg', quantity: '30 tablets', scheduledTime: '09:00 PM' },
  { name: 'Amlodipine', dosage: '5 mg', quantity: '30 tablets', scheduledTime: '09:00 AM' },
  { name: 'Losartan', dosage: '50 mg', quantity: '30 tablets', scheduledTime: '08:00 AM' },
  { name: 'Omeprazole', dosage: '20 mg', quantity: '30 capsules', scheduledTime: '07:30 AM' },
  { name: 'Levothyroxine', dosage: '50 mcg', quantity: '30 tablets', scheduledTime: '07:00 AM' },
  { name: 'Cetirizine', dosage: '10 mg', quantity: '20 tablets', scheduledTime: '09:00 PM' },
  { name: 'Pantoprazole', dosage: '40 mg', quantity: '30 tablets', scheduledTime: '07:30 AM' },
  { name: 'Montelukast', dosage: '10 mg', quantity: '30 tablets', scheduledTime: '09:00 PM' },
  { name: 'Vitamin D3', dosage: '1000 IU', quantity: '60 tablets', scheduledTime: '01:00 PM' },
  { name: 'Calcium Carbonate', dosage: '500 mg', quantity: '60 tablets', scheduledTime: '01:00 PM' },
  { name: 'Azithromycin', dosage: '250 mg', quantity: '6 tablets', scheduledTime: '09:00 AM' },
  { name: 'Amoxicillin', dosage: '500 mg', quantity: '21 capsules', scheduledTime: '08:00 AM' },
  { name: 'Ibuprofen', dosage: '200 mg', quantity: '20 tablets', scheduledTime: '02:00 PM' },
  { name: 'Paracetamol', dosage: '500 mg', quantity: '20 tablets', scheduledTime: '06:00 PM' },
  { name: 'Folic Acid', dosage: '5 mg', quantity: '30 tablets', scheduledTime: '09:00 AM' },
  { name: 'Aspirin', dosage: '75 mg', quantity: '30 tablets', scheduledTime: '08:00 AM' },
  { name: 'Clopidogrel', dosage: '75 mg', quantity: '30 tablets', scheduledTime: '08:00 AM' },
  { name: 'Glimepiride', dosage: '2 mg', quantity: '30 tablets', scheduledTime: '08:00 AM' }
];

function generateSeedHistory() {
  const records = [];
  const baseDate = new Date(2026, 7, 23); // Aug 23, 2026
  let counter = 1;

  SAMPLE_MEDICATIONS_CATALOG.forEach((med, medIdx) => {
    for (let entry = 0; entry < 4; entry++) {
      const dayOffset = (medIdx * 3 + entry * 7) % 30;
      const recordDate = new Date(baseDate);
      recordDate.setDate(baseDate.getDate() - dayOffset);
      const dateStr = recordDate.toISOString().split('T')[0];

      let status = 'Taken';
      const statusSeed = (medIdx + entry * 3) % 8;
      if (statusSeed === 6) status = 'Missed';
      if (statusSeed === 7) status = 'Pending';

      let actualTime = '—';
      if (status === 'Taken') {
        const offsetMins = (medIdx + entry * 2) % 12 + 1;
        const [timePart, ampm] = med.scheduledTime.split(' ');
        const [hours, mins] = timePart.split(':');
        const calcMins = (parseInt(mins, 10) + offsetMins) % 60;
        const formattedMins = calcMins < 10 ? `0${calcMins}` : calcMins;
        actualTime = `${hours}:${formattedMins} ${ampm}`;
      }

      records.push({
        id: `hist-sample-${counter++}`,
        medId: `med-sample-${medIdx + 1}`,
        medName: med.name,
        dosage: med.dosage,
        quantity: med.quantity,
        scheduledTime: med.scheduledTime,
        actualTakenTime: actualTime,
        status: status,
        date: dateStr,
        timestamp: recordDate.getTime()
      });
    }
  });

  return records.sort((a, b) => b.timestamp - a.timestamp);
}

// Default Seed Medication History Logs
const DEFAULT_SEED_HISTORY = generateSeedHistory();

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  if (window.initAuth) window.initAuth();
  initAppState();
  initHeaderDate();
  initLucideIcons();
  startAlarmChecker();
  initChatHistory();
  renderDashboard();
});

/**
 * Global 12-Hour vs 24-Hour Time Format Converter.
 */
function formatTimeDisplay(timeStr, overrideFormat = null) {
  if (!timeStr || typeof timeStr !== 'string') return '';

  // If time string already has AM/PM or non-standard format (like "Now")
  if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm') || timeStr === 'Now') {
    if ((overrideFormat || window.appSettings?.timeFormat) === '24h' && (timeStr.includes('AM') || timeStr.includes('PM'))) {
      const [timePart, ampm] = timeStr.split(' ');
      let [h, m] = timePart.split(':').map(n => parseInt(n, 10));
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    return timeStr;
  }

  const format = overrideFormat || window.appSettings?.timeFormat || '12h';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;

  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];

  if (isNaN(hours)) return timeStr;

  if (format === '24h') {
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  // 12-hour format with AM/PM
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}

/**
 * Initializes state from localStorage or loads seed data.
 */
function initAppState() {
  const savedMeds = localStorage.getItem('medimate_medications');
  if (savedMeds) {
    try {
      const parsed = JSON.parse(savedMeds);
      if (Array.isArray(parsed) && parsed.length >= 10) {
        window.medications = parsed;
      } else {
        window.medications = [...DEFAULT_SEED_MEDICATIONS];
        saveMedicationsState();
      }
    } catch (e) {
      window.medications = [...DEFAULT_SEED_MEDICATIONS];
    }
  } else {
    window.medications = [...DEFAULT_SEED_MEDICATIONS];
    saveMedicationsState();
  }

  const savedHistory = localStorage.getItem('medimate_history');
  if (savedHistory) {
    try {
      const parsed = JSON.parse(savedHistory);
      if (Array.isArray(parsed) && parsed.length >= 10) {
        window.medicationHistory = parsed;
      } else {
        window.medicationHistory = [...DEFAULT_SEED_HISTORY];
        saveHistoryState();
      }
    } catch (e) {
      window.medicationHistory = [...DEFAULT_SEED_HISTORY];
    }
  } else {
    window.medicationHistory = [...DEFAULT_SEED_HISTORY];
    saveHistoryState();
  }

  const savedSettings = localStorage.getItem('medimate_settings');
  if (savedSettings) {
    try {
      window.appSettings = { ...window.appSettings, ...JSON.parse(savedSettings) };
    } catch (e) {}
  }

  // Sync i18n language module
  if (window.setLanguage && window.appSettings.language) {
    window.setLanguage(window.appSettings.language);
  }

  syncSettingsFormUI();
}

/**
 * Sets current date header text dynamically.
 */
function initHeaderDate() {
  const dateEl = document.getElementById('currentDate');

  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', options);

  if (window.currentUser && window.syncHeaderUserUI) {
    window.syncHeaderUserUI();
  }
}

/**
 * Initializes Lucide icons safely.
 */
function initLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * Single Page Application Tab Router (`switchTab`).
 */
function switchTab(tabId, updateHash = true) {
  if (!window.currentUser && window.checkAuthGuard) {
    window.checkAuthGuard();
    return;
  }

  const tabs = document.querySelectorAll('.tab-content');
  const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');

  tabs.forEach((tab) => {
    if (tab.id === `${tabId}-tab`) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  navItems.forEach((nav) => {
    if (nav.dataset.tab === tabId) {
      nav.classList.add('active');
    } else {
      nav.classList.remove('active');
    }
  });

  if (tabId === 'dashboard') {
    renderDashboard();
  } else if (tabId === 'medications') {
    renderMedications();
  } else if (tabId === 'schedule') {
    renderScheduleTimeline();
  } else if (tabId === 'history') {
    renderHistory();
  } else if (tabId === 'analytics') {
    renderAnalytics();
  } else if (tabId === 'profile' && window.renderProfileView) {
    window.renderProfileView();
  }

  if (updateHash && window.location.hash !== `#${tabId}`) {
    window.location.hash = `#${tabId}`;
  }

  closeMobileSidebar();
  initLucideIcons();
}

window.switchTabInternal = (tabId, updateHash = false) => switchTab(tabId, updateHash);

/**
 * Synchronized UI Refresh Function
 */
function refreshAllViews() {
  renderDashboard();
  renderMedications();
  renderScheduleTimeline();
  renderHistory();
  renderAnalytics();
  if (window.renderProfileView) window.renderProfileView();
  if (window.applyTranslations) window.applyTranslations();
  initLucideIcons();
}

/**
 * Renders Dashboard (Summary Cards + Today's Medication Schedule).
 */
function renderDashboard() {
  const meds = window.medications || [];

  const totalDoses = meds.length;
  const takenCount = meds.filter((m) => m.taken || m.status === 'taken').length;
  const pendingCount = totalDoses - takenCount;
  const adherenceRate = totalDoses > 0 ? Math.round((takenCount / totalDoses) * 100) : 0;
  const lowStockCount = meds.filter((m) => m.stock < 10).length;

  const todayEl = document.getElementById('statTodayDoses');
  const takenEl = document.getElementById('statTakenDoses');
  const pendingEl = document.getElementById('statPendingDoses');
  const rateEl = document.getElementById('statAdherenceRate');
  const lowStockEl = document.getElementById('statLowStock');

  if (todayEl) todayEl.textContent = totalDoses;
  if (takenEl) takenEl.textContent = takenCount;
  if (pendingEl) pendingEl.textContent = pendingCount;
  if (rateEl) rateEl.textContent = `${adherenceRate}%`;
  if (lowStockEl) lowStockEl.textContent = lowStockCount;

  const countBadge = document.getElementById('scheduleCountBadge');
  if (countBadge) countBadge.textContent = `${totalDoses} Scheduled`;

  const container = document.getElementById('scheduleContainer');
  if (!container) return;

  const filteredMeds = filterMedicationsList(meds);

  if (filteredMeds.length === 0) {
    container.innerHTML = `
      <div class="empty-state text-center" style="padding: 2.5rem 1rem;">
        <i data-lucide="pill" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 0.5rem;"></i>
        <h3>No Medications Scheduled</h3>
        <p class="text-secondary">You currently have no matching medications in your schedule.</p>
        <button class="primary-btn margin-top-sm" onclick="openModal('addModal')">
          <i data-lucide="plus"></i> <span data-i18n="addMedication">Add New Medication</span>
        </button>
      </div>
    `;
    if (window.applyTranslations) window.applyTranslations();
    initLucideIcons();
    return;
  }

  container.innerHTML = filteredMeds.map((med) => {
    const isTaken = med.taken || med.status === 'taken';
    const isLowStock = med.stock < 10;
    const categoryClass = med.category || 'pill';
    const displayTime = formatTimeDisplay(med.time);

    return `
      <div class="med-item-row ${isTaken ? 'taken-status' : ''}" style="border-left-color: ${getCategoryColor(categoryClass)};">
        <div class="med-left-info">
          <div class="med-pill-icon ${categoryClass}">
            <i data-lucide="${getCategoryIcon(categoryClass)}"></i>
          </div>
          <div class="med-details">
            <h4>${escapeHtml(med.name)} <span class="text-secondary" style="font-size: 0.85rem; font-weight: normal;">(${escapeHtml(med.dosage)})</span></h4>
            <div class="med-meta">
              <span><i data-lucide="clock" style="width: 14px; height: 14px;"></i> ${escapeHtml(displayTime)}</span>
              <span>Stock: ${med.stock} ${isLowStock ? '<span class="badge badge-warning">⚠ Low Stock</span>' : ''}</span>
              ${getAlarmStyleBadge(med.alarmStyle)}
            </div>
          </div>
        </div>

        <div class="med-actions">
          ${
            isTaken
              ? `<span class="status-badge badge-taken"><i data-lucide="check"></i> ✓ Taken</span>`
              : `<button class="take-action-btn" onclick="markTaken('${med.id}')"><i data-lucide="check"></i> <span data-i18n="markTaken">Mark Taken</span></button>`
          }
          <button class="remove-action-btn" title="Remove from Schedule" onclick="deleteMed('${med.id}')">
            <i data-lucide="trash-2"></i> <span data-i18n="deleteMedication">Remove</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.applyTranslations) window.applyTranslations();
  initLucideIcons();
}

/**
 * Returns HTML badge for medication alarm style.
 */
function getAlarmStyleBadge(style) {
  if (!style || style === 'standard') return '';
  let badgeClass = 'badge-info';
  let label = 'Gentle';

  if (style === 'gentle') {
    badgeClass = 'badge-info';
    label = 'Gentle';
  } else if (style === 'urgent') {
    badgeClass = 'badge-warning';
    label = 'Urgent 🚨';
  } else if (style === 'silent_vibe') {
    badgeClass = 'badge-pending';
    label = 'Silent 🔕';
  }

  return `<span class="badge ${badgeClass}" style="margin-left: 0.3rem;">${label}</span>`;
}

/**
 * Marks medication dose as taken.
 */
function markTaken(medId) {
  const med = window.medications.find((m) => m.id === medId);
  if (!med) return;

  if (med.taken || med.status === 'taken') {
    showToast(`${med.name} is already marked as taken.`, 'info');
    return;
  }

  med.taken = true;
  med.status = 'taken';
  med.stock = Math.max(0, med.stock - 1);

  const now = new Date();
  const timeFormatted = formatTimeDisplay(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
  const dateFormatted = now.toISOString().split('T')[0];

  const historyRecord = {
    id: `hist-${Date.now()}`,
    medId: med.id,
    medName: med.name,
    dosage: med.dosage,
    quantity: `${med.stock} doses`,
    scheduledTime: formatTimeDisplay(med.time),
    actualTakenTime: timeFormatted,
    status: 'Taken',
    date: dateFormatted,
    timestamp: now.getTime()
  };

  window.medicationHistory.unshift(historyRecord);

  saveMedicationsState();
  saveHistoryState();

  showToast(`${med.name} marked as taken. Stock reduced to ${med.stock}.`, 'success');
  if (med.stock < 10 && window.appSettings.lowStockAlerts) {
    showToast(`⚠ Low Stock Warning: ${med.name} has only ${med.stock} doses remaining!`, 'warning');
  }

  refreshAllViews();
}

/**
 * Renders Medications Cabinet Grid page.
 */
function renderMedications() {
  const container = document.getElementById('medicationsGrid');
  if (!container) return;

  const filteredMeds = filterMedicationsList(window.medications || []);

  if (filteredMeds.length === 0) {
    container.innerHTML = `
      <div class="empty-state text-center" style="grid-column: 1 / -1; padding: 3rem 1rem;">
        <i data-lucide="box" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 0.5rem;"></i>
        <h3>Your Medication Cabinet is Empty</h3>
        <p class="text-secondary">Click below to start tracking your prescribed medicines and stock levels.</p>
        <button class="primary-btn margin-top-sm" onclick="openModal('addModal')">
          <i data-lucide="plus"></i> <span data-i18n="addMedication">Add New Medication</span>
        </button>
      </div>
    `;
    if (window.applyTranslations) window.applyTranslations();
    initLucideIcons();
    return;
  }

  container.innerHTML = filteredMeds.map((med) => {
    const isLowStock = med.stock < 10;
    const categoryClass = med.category || 'pill';
    const isTaken = med.taken || med.status === 'taken';
    const neonColor = med.neonColor || 'cyan';
    const displayTime = formatTimeDisplay(med.time);

    return `
      <div class="card med-card glow-${neonColor}" data-neon-color="${neonColor}">
        <div>
          <div class="med-card-top">
            <div class="med-pill-icon ${categoryClass}">
              <i data-lucide="${getCategoryIcon(categoryClass)}"></i>
            </div>
            <div style="display: flex; gap: 0.3rem; align-items: center;">
              ${getAlarmStyleBadge(med.alarmStyle)}
              <span class="badge ${isTaken ? 'badge-taken' : 'badge-pending'}">
                ${isTaken ? '✓ Taken' : 'Pending ⏳'}
              </span>
            </div>
          </div>

          <h3 style="font-size: 1.15rem; font-weight: 600;">${escapeHtml(med.name)}</h3>
          <p class="text-secondary" style="font-size: 0.9rem; margin-top: 0.2rem;">Dosage: <strong>${escapeHtml(med.dosage)}</strong></p>
          <p class="text-secondary" style="font-size: 0.85rem; margin-top: 0.2rem;"><i data-lucide="clock" style="width: 14px;"></i> Scheduled: <strong>${escapeHtml(displayTime)}</strong></p>
          ${med.notes ? `<p class="text-muted" style="font-size: 0.8rem; margin-top: 0.5rem; font-style: italic;">"${escapeHtml(med.notes)}"</p>` : ''}
        </div>

        <div>
          <div class="med-card-stock">
            <span>Stock Level:</span>
            <strong>${med.stock} doses ${isLowStock ? '<span class="badge badge-warning" style="margin-left: 0.4rem;">⚠ Low Stock</span>' : ''}</strong>
          </div>

          <div class="med-card-actions">
            <button class="secondary-btn" style="flex: 1; justify-content: center; padding: 0.45rem;" onclick="openEditModal('${med.id}')">
              <i data-lucide="edit-3"></i> Edit
            </button>
            <button class="btn-icon-action danger" title="Delete Medication" onclick="deleteMed('${med.id}')">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.applyTranslations) window.applyTranslations();
  initLucideIcons();
}

/**
 * Renders Schedule Timeline.
 */
function renderScheduleTimeline() {
  const container = document.getElementById('timelineContainer');
  if (!container) return;

  const meds = window.medications || [];

  const morning = meds.filter((m) => { const h = parseInt(m.time.split(':')[0], 10); return h >= 5 && h < 12; });
  const afternoon = meds.filter((m) => { const h = parseInt(m.time.split(':')[0], 10); return h >= 12 && h < 17; });
  const evening = meds.filter((m) => { const h = parseInt(m.time.split(':')[0], 10); return h >= 17 && h < 21; });
  const night = meds.filter((m) => { const h = parseInt(m.time.split(':')[0], 10); return h >= 21 || h < 5; });

  container.innerHTML = `
    ${renderTimelineGroup('Morning (5:00 AM - 12:00 PM)', morning, 'sun')}
    ${renderTimelineGroup('Afternoon (12:00 PM - 5:00 PM)', afternoon, 'cloud-sun')}
    ${renderTimelineGroup('Evening (5:00 PM - 9:00 PM)', evening, 'sunset')}
    ${renderTimelineGroup('Night & Bedtime (9:00 PM - 5:00 AM)', night, 'moon')}
  `;

  if (window.applyTranslations) window.applyTranslations();
  initLucideIcons();
}

function renderTimelineGroup(title, groupMeds, icon) {
  return `
    <div class="timeline-group">
      <h3><i data-lucide="${icon}"></i> ${title} (${groupMeds.length})</h3>
      ${
        groupMeds.length === 0
          ? `<p class="text-secondary" style="font-size: 0.85rem; padding-left: 1.5rem;">No medications scheduled in this timeframe.</p>`
          : `<div class="medication-list margin-top-xs">
              ${groupMeds.map((med) => {
                const isTaken = med.taken || med.status === 'taken';
                const displayTime = formatTimeDisplay(med.time);
                return `
                  <div class="med-item-row ${isTaken ? 'taken-status' : ''}">
                    <div class="med-left-info">
                      <div class="med-pill-icon ${med.category || 'pill'}">
                        <i data-lucide="${getCategoryIcon(med.category)}"></i>
                      </div>
                      <div>
                        <strong>${escapeHtml(med.name)}</strong> (${escapeHtml(med.dosage)})
                        <span class="text-secondary" style="font-size: 0.85rem; display: block;">Scheduled: ${escapeHtml(displayTime)} ${getAlarmStyleBadge(med.alarmStyle)}</span>
                      </div>
                    </div>
                    <div class="med-actions">
                      ${isTaken ? '<span class="status-badge badge-taken"><i data-lucide="check"></i> ✓ Taken</span>' : `<button class="take-action-btn" onclick="markTaken('${med.id}')"><i data-lucide="check"></i> <span data-i18n="markTaken">Mark Taken</span></button>`}
                      <button class="remove-action-btn" title="Remove from Schedule" onclick="deleteMed('${med.id}')">
                        <i data-lucide="trash-2"></i> <span data-i18n="deleteMedication">Remove</span>
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>`
      }
    </div>
  `;
}

window.historyFilter = 'all';
window.historySearchQuery = '';

function setHistoryFilter(filterType) {
  window.historyFilter = filterType;

  document.querySelectorAll('[data-history-filter]').forEach((pill) => {
    if (pill.dataset.historyFilter === filterType) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  renderHistory();
}

function handleHistorySearchFilter() {
  const input = document.getElementById('historySearch');
  window.historySearchQuery = (input?.value || '').toLowerCase().trim();
  renderHistory();
}

/**
 * Renders Medication History Log Table.
 */
function renderHistory() {
  const container = document.getElementById('historyTableContainer');
  if (!container) return;

  let history = window.medicationHistory || [];

  history = history.filter((record) => {
    const q = window.historySearchQuery;
    const matchQuery =
      !q ||
      record.medName.toLowerCase().includes(q) ||
      record.dosage.toLowerCase().includes(q) ||
      (record.quantity && record.quantity.toLowerCase().includes(q)) ||
      record.date.includes(q) ||
      record.status.toLowerCase().includes(q);

    if (!matchQuery) return false;

    const s = window.historyFilter;
    if (s === 'taken') return record.status === 'Taken';
    if (s === 'missed') return record.status === 'Missed';
    if (s === 'pending') return record.status === 'Pending';

    return true;
  });

  if (history.length === 0) {
    container.innerHTML = `
      <div class="empty-state text-center" style="padding: 2.5rem 1rem;">
        <i data-lucide="history" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 0.5rem;"></i>
        <h3>No Matching History Records</h3>
        <p class="text-secondary">Try adjusting your search query or filter selection.</p>
      </div>
    `;
    initLucideIcons();
    return;
  }

  container.innerHTML = `
    <div style="overflow-x: auto; -webkit-overflow-scrolling: touch;">
      <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; min-width: 680px;">
        <thead>
          <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-secondary); font-size: 0.825rem; text-transform: uppercase;">
            <th style="padding: 0.75rem;">Medicine</th>
            <th style="padding: 0.75rem;">Dosage</th>
            <th style="padding: 0.75rem;">Quantity</th>
            <th style="padding: 0.75rem;">Scheduled</th>
            <th style="padding: 0.75rem;">Actual Time</th>
            <th style="padding: 0.75rem;">Date</th>
            <th style="padding: 0.75rem;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${history.map((record) => {
            const badgeClass =
              record.status === 'Taken'
                ? 'badge-taken'
                : record.status === 'Missed'
                ? 'badge-warning'
                : 'badge-pending';
            const iconSymbol =
              record.status === 'Taken'
                ? '✓ Taken'
                : record.status === 'Missed'
                ? '⚠ Missed'
                : '⏳ Pending';

            const displayScheduled = formatTimeDisplay(record.scheduledTime);
            const displayActual = formatTimeDisplay(record.actualTakenTime);

            return `
              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.04);">
                <td style="padding: 0.85rem; font-weight: 600; color: var(--text-main);">${escapeHtml(record.medName)}</td>
                <td style="padding: 0.85rem; color: var(--text-secondary);">${escapeHtml(record.dosage)}</td>
                <td style="padding: 0.85rem; color: var(--text-secondary);">${escapeHtml(record.quantity || '30 tablets')}</td>
                <td style="padding: 0.85rem; color: var(--text-secondary);">${escapeHtml(displayScheduled)}</td>
                <td style="padding: 0.85rem;">${escapeHtml(displayActual || '—')}</td>
                <td style="padding: 0.85rem; color: var(--text-secondary);">${escapeHtml(record.date)}</td>
                <td style="padding: 0.85rem;">
                  <span class="status-badge ${badgeClass}">
                    ${iconSymbol}
                  </span>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  initLucideIcons();
}

/**
 * Bidirectional Sync between 24h Time Input and AM/PM Selector.
 */
function syncAmPmFromTime(prefix) {
  const timeInput = document.getElementById(`${prefix}MedTime`);
  const ampmSelect = document.getElementById(`${prefix}MedAmPm`);
  if (!timeInput || !ampmSelect) return;

  const val = timeInput.value;
  if (!val || !val.includes(':')) return;

  const parts = val.split(':');
  const h = parseInt(parts[0], 10);
  if (!isNaN(h)) {
    ampmSelect.value = h >= 12 ? 'PM' : 'AM';
  }
}

function syncTimeFromAmPm(prefix) {
  const timeInput = document.getElementById(`${prefix}MedTime`);
  const ampmSelect = document.getElementById(`${prefix}MedAmPm`);
  if (!timeInput || !ampmSelect) return;

  let val = timeInput.value;
  if (!val || !val.includes(':')) {
    val = ampmSelect.value === 'PM' ? '20:00' : '08:00';
    timeInput.value = val;
    return;
  }

  let [h, m] = val.split(':').map((n) => parseInt(n, 10));
  if (isNaN(h) || isNaN(m)) return;

  const isPm = ampmSelect.value === 'PM';
  if (isPm && h < 12) {
    h += 12;
  } else if (!isPm && h >= 12) {
    h -= 12;
  }

  const newH = String(h).padStart(2, '0');
  const newM = String(m).padStart(2, '0');
  timeInput.value = `${newH}:${newM}`;
}

/**
 * Saves a new medication.
 */
function saveNewMedication(event) {
  event.preventDefault();

  syncTimeFromAmPm('add');

  const name = document.getElementById('addMedName').value.trim();
  const dosage = document.getElementById('addMedDosage').value.trim();
  const time = document.getElementById('addMedTime').value;
  const stock = parseInt(document.getElementById('addMedStock').value, 10);
  const category = document.getElementById('addMedCategory').value;
  const alarmStyle = document.getElementById('addMedAlarmStyle')?.value || 'standard';
  const notes = document.getElementById('addMedNotes').value.trim();

  if (!name || !dosage || !time || isNaN(stock) || stock < 0) {
    showToast('Please provide valid medication details. Stock must be 0 or greater.', 'error');
    return;
  }

  const newMed = {
    id: `med-${Date.now()}`,
    name: name,
    dosage: dosage,
    time: time,
    stock: stock,
    category: category,
    alarmStyle: alarmStyle,
    notes: notes,
    taken: false,
    status: 'pending'
  };

  window.medications.push(newMed);
  saveMedicationsState();

  closeModal('addModal');
  document.getElementById('addMedForm').reset();
  showToast(`Medication "${name}" added.`, 'success');

  refreshAllViews();
}

/**
 * Opens Edit Medication Modal.
 */
function openEditModal(medId) {
  const med = window.medications.find((m) => m.id === medId);
  if (!med) return;

  document.getElementById('editMedId').value = med.id;
  document.getElementById('editMedName').value = med.name;
  document.getElementById('editMedDosage').value = med.dosage;
  document.getElementById('editMedTime').value = med.time;
  document.getElementById('editMedStock').value = med.stock;
  document.getElementById('editMedCategory').value = med.category || 'pill';
  if (document.getElementById('editMedAlarmStyle')) {
    document.getElementById('editMedAlarmStyle').value = med.alarmStyle || 'standard';
  }
  document.getElementById('editMedNotes').value = med.notes || '';

  syncAmPmFromTime('edit');
  openModal('editModal');
}

/**
 * Saves edited medication changes.
 */
function saveEditedMedication(event) {
  event.preventDefault();

  syncTimeFromAmPm('edit');

  const id = document.getElementById('editMedId').value;
  const med = window.medications.find((m) => m.id === id);
  if (!med) return;

  const name = document.getElementById('editMedName').value.trim();
  const dosage = document.getElementById('editMedDosage').value.trim();
  const time = document.getElementById('editMedTime').value;
  const stock = parseInt(document.getElementById('editMedStock').value, 10);
  const category = document.getElementById('editMedCategory').value;
  const alarmStyle = document.getElementById('editMedAlarmStyle')?.value || 'standard';
  const notes = document.getElementById('editMedNotes').value.trim();

  if (!name || !dosage || !time || isNaN(stock) || stock < 0) {
    showToast('Invalid edits. Please check your form entries.', 'error');
    return;
  }

  med.name = name;
  med.dosage = dosage;
  med.time = time;
  med.stock = stock;
  med.category = category;
  med.alarmStyle = alarmStyle;
  med.notes = notes;

  saveMedicationsState();
  closeModal('editModal');
  showToast(`Updated "${name}" successfully.`, 'success');

  refreshAllViews();
}

/**
 * Delete Medication Dialog.
 */
function deleteMed(medId) {
  document.getElementById('deleteTargetId').value = medId;
  openModal('deleteModal');
}

function confirmDeleteMedication() {
  const medId = document.getElementById('deleteTargetId').value;
  const index = window.medications.findIndex((m) => m.id === medId);

  if (index !== -1) {
    const deletedName = window.medications[index].name;
    window.medications.splice(index, 1);
    saveMedicationsState();
    showToast(`Removed "${deletedName}" from schedule.`, 'info');
  }

  closeModal('deleteModal');
  refreshAllViews();
}

/**
 * Modal Controls.
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
  if (modalId === 'addModal') {
    const timeInput = document.getElementById('addMedTime');
    if (timeInput && !timeInput.value) {
      timeInput.value = '08:00';
    }
    syncAmPmFromTime('add');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

/**
 * Search & Filtering.
 */
function setFilter(filterType) {
  window.currentFilter = filterType;

  document.querySelectorAll('.filter-pill').forEach((pill) => {
    if (pill.dataset.filter === filterType) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  renderDashboard();
  renderMedications();
}

function handleSearchFilter() {
  const dashSearch = document.getElementById('dashboardSearch');
  const medsSearch = document.getElementById('medsSearch');

  window.searchQuery = (dashSearch?.value || medsSearch?.value || '').toLowerCase().trim();

  renderDashboard();
  renderMedications();
}

function filterMedicationsList(list) {
  return list.filter((med) => {
    const queryMatch =
      !window.searchQuery ||
      med.name.toLowerCase().includes(window.searchQuery) ||
      med.dosage.toLowerCase().includes(window.searchQuery) ||
      (med.category && med.category.toLowerCase().includes(window.searchQuery));

    if (!queryMatch) return false;

    const isTaken = med.taken || med.status === 'taken';
    if (window.currentFilter === 'pending') return !isTaken;
    if (window.currentFilter === 'taken') return isTaken;
    if (window.currentFilter === 'low-stock') return med.stock < 10;

    return true;
  });
}

/**
 * Toast Notifications.
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i data-lucide="${getToastIcon(type)}"></i>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);
  initLucideIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function getToastIcon(type) {
  if (type === 'success') return 'check-circle';
  if (type === 'warning') return 'alert-triangle';
  if (type === 'error') return 'alert-octagon';
  return 'info';
}

function getCategoryIcon(category) {
  switch (category) {
    case 'capsule': return 'pill';
    case 'injection': return 'syringe';
    case 'liquid': return 'droplet';
    case 'topical': return 'sparkles';
    default: return 'pill';
  }
}

function getCategoryColor(category) {
  switch (category) {
    case 'capsule': return 'var(--accent-indigo)';
    case 'injection': return 'var(--accent-rose)';
    case 'liquid': return 'var(--accent-cyan)';
    case 'topical': return 'var(--accent-amber)';
    default: return 'var(--primary-teal)';
  }
}

/**
 * Custom Alarm Ringtone Audio Upload Handler.
 * Validates audio file size (max 3.5 MB) and duration (max 60 sec).
 */
function handleCustomRingtoneUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate format
  const validFormats = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/m4a', 'audio/x-m4a', 'audio/aac', 'audio/mp4'];
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['mp3', 'wav', 'm4a'].includes(ext) && !validFormats.includes(file.type)) {
    showToast('Unsupported audio format. Please upload MP3, WAV, or M4A.', 'error');
    return;
  }

  // Validate file size limit (max 3.5 MB)
  const MAX_SIZE_BYTES = 3.5 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    showToast('File size exceeds limit (Max 3.5 MB). Please choose a smaller audio file.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;

    // Test audio duration limit
    const tempAudio = new Audio();
    tempAudio.src = dataUrl;
    tempAudio.onloadedmetadata = () => {
      if (tempAudio.duration > 60) {
        showToast('Audio file duration is too long (Max 60 seconds allowed).', 'warning');
      }

      window.appSettings.customRingtoneUrl = dataUrl;
      window.appSettings.customRingtoneName = file.name;
      localStorage.setItem('medimate_settings', JSON.stringify(window.appSettings));

      syncSettingsFormUI();
      showToast(`Custom tone "${file.name}" uploaded successfully.`, 'success');
    };
    tempAudio.onerror = () => {
      showToast('Could not decode audio file. Please try another audio file.', 'error');
    };
  };

  reader.onerror = () => {
    showToast('Error reading file. Please try again.', 'error');
  };

  reader.readAsDataURL(file);
}

/**
 * Removes user custom uploaded ringtone and resets to default tone.
 */
function removeCustomRingtone() {
  window.appSettings.customRingtoneUrl = null;
  window.appSettings.customRingtoneName = null;
  localStorage.setItem('medimate_settings', JSON.stringify(window.appSettings));

  syncSettingsFormUI();
  showToast('Reset to default medication chime.', 'info');
}

/**
 * Save Settings Handler.
 */
function saveSettings() {
  const langSelect = document.getElementById('settingLanguage');
  const timeFormatSelect = document.getElementById('settingTimeFormat');
  const alarmStyleSelect = document.getElementById('settingDefaultAlarmStyle');

  const selectedLang = langSelect ? langSelect.value : window.appSettings.language || 'en';
  const selectedTimeFormat = timeFormatSelect ? timeFormatSelect.value : window.appSettings.timeFormat || '12h';
  const selectedAlarmStyle = alarmStyleSelect ? alarmStyleSelect.value : window.appSettings.defaultAlarmStyle || 'standard';

  window.appSettings = {
    ...window.appSettings,
    enableReminders: document.getElementById('settingEnableReminders').checked,
    voiceReminders: document.getElementById('settingVoiceReminders').checked,
    alarmSound: document.getElementById('settingAlarmSound').checked,
    snoozeMinutes: parseInt(document.getElementById('settingSnoozeMinutes').value, 10),
    lowStockAlerts: document.getElementById('settingLowStockAlerts').checked,
    language: selectedLang,
    timeFormat: selectedTimeFormat,
    defaultAlarmStyle: selectedAlarmStyle
  };

  localStorage.setItem('medimate_settings', JSON.stringify(window.appSettings));

  // Apply language update dynamically
  if (window.setLanguage) {
    window.setLanguage(selectedLang);
  }

  showToast('Settings updated successfully.', 'success');
  refreshAllViews();
}

/**
 * Synchronizes Settings UI Controls.
 */
function syncSettingsFormUI() {
  const s = window.appSettings;
  const enableRem = document.getElementById('settingEnableReminders');
  const voiceRem = document.getElementById('settingVoiceReminders');
  const alarmSound = document.getElementById('settingAlarmSound');
  const snoozeMin = document.getElementById('settingSnoozeMinutes');
  const lowStock = document.getElementById('settingLowStockAlerts');
  const langSelect = document.getElementById('settingLanguage');
  const timeFormatSelect = document.getElementById('settingTimeFormat');
  const alarmStyleSelect = document.getElementById('settingDefaultAlarmStyle');

  const customPill = document.getElementById('customRingtonePill');
  const customName = document.getElementById('customRingtoneNameDisplay');
  const previewBtn = document.getElementById('previewCustomToneBtn');
  const resetBtn = document.getElementById('resetCustomToneBtn');

  if (enableRem) enableRem.checked = s.enableReminders;
  if (voiceRem) voiceRem.checked = s.voiceReminders;
  if (alarmSound) alarmSound.checked = s.alarmSound;
  if (snoozeMin) snoozeMin.value = s.snoozeMinutes;
  if (lowStock) lowStock.checked = s.lowStockAlerts;
  if (langSelect) langSelect.value = s.language || 'en';
  if (timeFormatSelect) timeFormatSelect.value = s.timeFormat || '12h';
  if (alarmStyleSelect) alarmStyleSelect.value = s.defaultAlarmStyle || 'standard';

  if (s.customRingtoneUrl) {
    if (customPill) customPill.style.display = 'inline-flex';
    if (customName) customName.textContent = s.customRingtoneName || 'Custom Audio Tone';
    if (previewBtn) previewBtn.disabled = false;
    if (resetBtn) resetBtn.style.display = 'inline-flex';
  } else {
    if (customPill) customPill.style.display = 'none';
    if (previewBtn) previewBtn.disabled = false;
    if (resetBtn) resetBtn.style.display = 'none';
  }
}

/**
 * State Persistence.
 */
function saveMedicationsState() {
  localStorage.setItem('medimate_medications', JSON.stringify(window.medications));
}

function saveHistoryState() {
  localStorage.setItem('medimate_history', JSON.stringify(window.medicationHistory));
}

function clearHistoryLog() {
  if (confirm('Clear all medication history logs?')) {
    window.medicationHistory = [];
    saveHistoryState();
    renderHistory();
    showToast('History log cleared.', 'info');
  }
}

function exportAppData() {
  const data = {
    user: window.currentUser,
    medications: window.medications,
    history: window.medicationHistory,
    settings: window.appSettings,
    exportedAt: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `medimate_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function resetToDemoData() {
  if (confirm('Reset all medication data to initial state?')) {
    window.medications = JSON.parse(JSON.stringify(DEFAULT_SEED_MEDICATIONS));
    window.medicationHistory = JSON.parse(JSON.stringify(DEFAULT_SEED_HISTORY));
    saveMedicationsState();
    saveHistoryState();
    showToast('Reset to initial medication data.', 'info');
    refreshAllViews();
  }
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) {
    const isOpen = sidebar.classList.toggle('mobile-open');
    if (overlay) overlay.classList.toggle('active', isOpen);
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (overlay) overlay.classList.remove('active');
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Global Exports
window.switchTab = switchTab;
window.openModal = openModal;
window.closeModal = closeModal;
window.renderDashboard = renderDashboard;
window.renderMedications = renderMedications;
window.renderHistory = renderHistory;
window.markTaken = markTaken;
window.saveNewMedication = saveNewMedication;
window.saveEditedMedication = saveEditedMedication;
window.openEditModal = openEditModal;
window.deleteMed = deleteMed;
window.confirmDeleteMedication = confirmDeleteMedication;
window.setFilter = setFilter;
window.handleSearchFilter = handleSearchFilter;
window.setHistoryFilter = setHistoryFilter;
window.handleHistorySearchFilter = handleHistorySearchFilter;
window.showToast = showToast;
window.saveSettings = saveSettings;
window.exportAppData = exportAppData;
window.resetToDemoData = resetToDemoData;
window.clearHistoryLog = clearHistoryLog;
window.toggleMobileSidebar = toggleMobileSidebar;
window.escapeHtml = escapeHtml;
window.refreshAllViews = refreshAllViews;
window.formatTimeDisplay = formatTimeDisplay;
window.handleCustomRingtoneUpload = handleCustomRingtoneUpload;
window.removeCustomRingtone = removeCustomRingtone;
window.syncAmPmFromTime = syncAmPmFromTime;
window.syncTimeFromAmPm = syncTimeFromAmPm;

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
  lowStockAlerts: true
};
window.currentFilter = 'all';
window.searchQuery = '';

// Exact Seed Medications as per prompt specifications
const DEFAULT_SEED_MEDICATIONS = [
  {
    id: 'med-101',
    name: 'Lisinopril',
    dosage: '10 mg (1 tablet)',
    time: '08:00',
    stock: 24,
    category: 'pill',
    notes: 'Take in the morning with water.',
    taken: true,
    status: 'taken'
  },
  {
    id: 'med-102',
    name: 'Metformin XR',
    dosage: '500 mg (1 tablet)',
    time: '20:00',
    stock: 42,
    category: 'capsule',
    notes: 'Take with evening meal.',
    taken: false,
    status: 'pending'
  },
  {
    id: 'med-103',
    name: 'Atorvastatin',
    dosage: '20 mg (1 tablet)',
    time: '21:00',
    stock: 8, // Low Stock (< 10)
    category: 'pill',
    notes: 'Take at bedtime.',
    taken: false,
    status: 'pending'
  }
];

// Default Seed Medication History Logs
const DEFAULT_SEED_HISTORY = [
  {
    id: 'hist-1',
    medId: 'med-101',
    medName: 'Lisinopril',
    dosage: '10 mg (1 tablet)',
    scheduledTime: '08:00',
    actualTakenTime: '08:02 AM',
    status: 'Taken',
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now() - 3 * 3600 * 1000
  }
];

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
 * Initializes state from localStorage or loads seed data.
 */
function initAppState() {
  const savedMeds = localStorage.getItem('medimate_medications');
  if (savedMeds) {
    try {
      window.medications = JSON.parse(savedMeds);
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
      window.medicationHistory = JSON.parse(savedHistory);
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
  // Check auth guard before switching protected views
  if (!window.currentUser && window.checkAuthGuard) {
    window.checkAuthGuard();
    return;
  }

  const tabs = document.querySelectorAll('.tab-content');
  const navItems = document.querySelectorAll('.nav-item');

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

  // Re-render target tab view
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
        <h3>No Medications Found</h3>
        <p class="text-secondary">No matching medications scheduled.</p>
      </div>
    `;
    initLucideIcons();
    return;
  }

  container.innerHTML = filteredMeds.map((med) => {
    const isTaken = med.taken || med.status === 'taken';
    const isLowStock = med.stock < 10;
    const categoryClass = med.category || 'pill';

    return `
      <div class="med-item-row ${isTaken ? 'taken-status' : ''}" style="border-left-color: ${getCategoryColor(categoryClass)};">
        <div class="med-left-info">
          <div class="med-pill-icon ${categoryClass}">
            <i data-lucide="${getCategoryIcon(categoryClass)}"></i>
          </div>
          <div class="med-details">
            <h4>${escapeHtml(med.name)} <span class="text-secondary" style="font-size: 0.85rem; font-weight: normal;">(${escapeHtml(med.dosage)})</span></h4>
            <div class="med-meta">
              <span><i data-lucide="clock" style="width: 14px; height: 14px;"></i> ${escapeHtml(med.time)}</span>
              <span>Stock: ${med.stock} ${isLowStock ? '<span class="badge badge-warning">⚠ Low Stock</span>' : ''}</span>
            </div>
          </div>
        </div>

        <div class="med-actions">
          ${
            isTaken
              ? `<span class="status-badge badge-taken"><i data-lucide="check"></i> ✓ Taken</span>`
              : `<button class="take-action-btn" onclick="markTaken('${med.id}')"><i data-lucide="check"></i> Mark Taken</button>`
          }
        </div>
      </div>
    `;
  }).join('');

  initLucideIcons();
}

/**
 * Marks medication dose as taken (`markTaken`).
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
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateFormatted = now.toISOString().split('T')[0];

  const historyRecord = {
    id: `hist-${Date.now()}`,
    medId: med.id,
    medName: med.name,
    dosage: med.dosage,
    scheduledTime: med.time,
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
 * Renders Medications Cabinet Grid page (`renderMedications`).
 */
function renderMedications() {
  const container = document.getElementById('medicationsGrid');
  if (!container) return;

  const filteredMeds = filterMedicationsList(window.medications || []);

  if (filteredMeds.length === 0) {
    container.innerHTML = `
      <div class="empty-state text-center" style="grid-column: 1 / -1; padding: 3rem 1rem;">
        <i data-lucide="box" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 0.5rem;"></i>
        <h3>No Medications Found</h3>
        <p class="text-secondary">Click "+ Add New Medicine" to populate your medication cabinet.</p>
      </div>
    `;
    initLucideIcons();
    return;
  }

  container.innerHTML = filteredMeds.map((med) => {
    const isLowStock = med.stock < 10;
    const categoryClass = med.category || 'pill';
    const isTaken = med.taken || med.status === 'taken';

    return `
      <div class="card med-card glow-teal">
        <div>
          <div class="med-card-top">
            <div class="med-pill-icon ${categoryClass}">
              <i data-lucide="${getCategoryIcon(categoryClass)}"></i>
            </div>
            <span class="badge ${isTaken ? 'badge-taken' : 'badge-pending'}">
              ${isTaken ? '✓ Taken' : 'Pending ⏳'}
            </span>
          </div>

          <h3 style="font-size: 1.15rem; font-weight: 600;">${escapeHtml(med.name)}</h3>
          <p class="text-secondary" style="font-size: 0.9rem; margin-top: 0.2rem;">Dosage: <strong>${escapeHtml(med.dosage)}</strong></p>
          <p class="text-secondary" style="font-size: 0.85rem; margin-top: 0.2rem;"><i data-lucide="clock" style="width: 14px;"></i> Scheduled: <strong>${escapeHtml(med.time)}</strong></p>
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
                return `
                  <div class="med-item-row ${isTaken ? 'taken-status' : ''}">
                    <div class="med-left-info">
                      <div class="med-pill-icon ${med.category || 'pill'}">
                        <i data-lucide="${getCategoryIcon(med.category)}"></i>
                      </div>
                      <div>
                        <strong>${escapeHtml(med.name)}</strong> (${escapeHtml(med.dosage)})
                        <span class="text-secondary" style="font-size: 0.85rem; display: block;">Scheduled: ${escapeHtml(med.time)}</span>
                      </div>
                    </div>
                    <div>
                      ${isTaken ? '<span class="status-badge badge-taken"><i data-lucide="check"></i> ✓ Taken</span>' : `<button class="take-action-btn" onclick="markTaken('${med.id}')"><i data-lucide="check"></i> Mark Taken</button>`}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>`
      }
    </div>
  `;
}

/**
 * Renders Medication History Log Table (`renderHistory`).
 */
function renderHistory() {
  const container = document.getElementById('historyTableContainer');
  if (!container) return;

  const history = window.medicationHistory || [];

  if (history.length === 0) {
    container.innerHTML = `
      <div class="empty-state text-center" style="padding: 2.5rem 1rem;">
        <i data-lucide="history" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 0.5rem;"></i>
        <h3>No History Records</h3>
        <p class="text-secondary">Doses marked as taken will log historical records here.</p>
      </div>
    `;
    initLucideIcons();
    return;
  }

  container.innerHTML = `
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
        <thead>
          <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-secondary); font-size: 0.825rem; text-transform: uppercase;">
            <th style="padding: 0.75rem;">Medicine</th>
            <th style="padding: 0.75rem;">Dosage</th>
            <th style="padding: 0.75rem;">Scheduled</th>
            <th style="padding: 0.75rem;">Actual Time</th>
            <th style="padding: 0.75rem;">Date</th>
            <th style="padding: 0.75rem;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${history.map((record) => `
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.04);">
              <td style="padding: 0.85rem; font-weight: 600;">${escapeHtml(record.medName)}</td>
              <td style="padding: 0.85rem; color: var(--text-secondary);">${escapeHtml(record.dosage)}</td>
              <td style="padding: 0.85rem; color: var(--text-secondary);">${escapeHtml(record.scheduledTime)}</td>
              <td style="padding: 0.85rem;">${escapeHtml(record.actualTakenTime || '-')}</td>
              <td style="padding: 0.85rem; color: var(--text-secondary);">${escapeHtml(record.date)}</td>
              <td style="padding: 0.85rem;">
                <span class="status-badge ${record.status === 'Taken' ? 'badge-taken' : record.status === 'Pending' ? 'badge-pending' : 'badge-warning'}">
                  ${record.status === 'Taken' ? '✓ Taken' : record.status}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  initLucideIcons();
}

/**
 * Saves a new medication (`saveNewMedication`).
 */
function saveNewMedication(event) {
  event.preventDefault();

  const name = document.getElementById('addMedName').value.trim();
  const dosage = document.getElementById('addMedDosage').value.trim();
  const time = document.getElementById('addMedTime').value;
  const stock = parseInt(document.getElementById('addMedStock').value, 10);
  const category = document.getElementById('addMedCategory').value;
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
  document.getElementById('editMedNotes').value = med.notes || '';

  openModal('editModal');
}

/**
 * Saves edited medication changes.
 */
function saveEditedMedication(event) {
  event.preventDefault();

  const id = document.getElementById('editMedId').value;
  const med = window.medications.find((m) => m.id === id);
  if (!med) return;

  const name = document.getElementById('editMedName').value.trim();
  const dosage = document.getElementById('editMedDosage').value.trim();
  const time = document.getElementById('editMedTime').value;
  const stock = parseInt(document.getElementById('editMedStock').value, 10);
  const category = document.getElementById('editMedCategory').value;
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
 * Settings Form.
 */
function saveSettings() {
  window.appSettings = {
    enableReminders: document.getElementById('settingEnableReminders').checked,
    voiceReminders: document.getElementById('settingVoiceReminders').checked,
    alarmSound: document.getElementById('settingAlarmSound').checked,
    snoozeMinutes: parseInt(document.getElementById('settingSnoozeMinutes').value, 10),
    lowStockAlerts: document.getElementById('settingLowStockAlerts').checked
  };

  localStorage.setItem('medimate_settings', JSON.stringify(window.appSettings));
  showToast('Settings saved.', 'success');
}

function syncSettingsFormUI() {
  const s = window.appSettings;
  const enableRem = document.getElementById('settingEnableReminders');
  const voiceRem = document.getElementById('settingVoiceReminders');
  const alarmSound = document.getElementById('settingAlarmSound');
  const snoozeMin = document.getElementById('settingSnoozeMinutes');
  const lowStock = document.getElementById('settingLowStockAlerts');

  if (enableRem) enableRem.checked = s.enableReminders;
  if (voiceRem) voiceRem.checked = s.voiceReminders;
  if (alarmSound) alarmSound.checked = s.alarmSound;
  if (snoozeMin) snoozeMin.value = s.snoozeMinutes;
  if (lowStock) lowStock.checked = s.lowStockAlerts;
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
  if (sidebar) sidebar.classList.toggle('mobile-open');
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.remove('mobile-open');
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
window.showToast = showToast;
window.saveSettings = saveSettings;
window.exportAppData = exportAppData;
window.resetToDemoData = resetToDemoData;
window.clearHistoryLog = clearHistoryLog;
window.toggleMobileSidebar = toggleMobileSidebar;
window.escapeHtml = escapeHtml;
window.refreshAllViews = refreshAllViews;

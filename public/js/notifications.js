/* ==========================================================================
   MediMate Health Dashboard — Dynamic Notifications Engine & Bell Dropdown
   ========================================================================== */

(function () {
  'use strict';

  // State Management
  window.notificationsList = [];
  let isPanelOpen = false;
  let countdownTimerId = null;

  /**
   * Initializes notification system on load.
   */
  function initNotifications() {
    loadSavedNotifications();
    ensureSeedNotifications();
    updateNotificationsUI();
    startCountdownTimer();
    attachGlobalListeners();
  }

  /**
   * Loads persisted notifications from localStorage.
   */
  function loadSavedNotifications() {
    try {
      const saved = localStorage.getItem('medimate_notifications');
      if (saved) {
        window.notificationsList = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load notifications from localStorage:', e);
      window.notificationsList = [];
    }
  }

  /**
   * Saves notifications to localStorage.
   */
  function saveNotificationsState() {
    try {
      localStorage.setItem('medimate_notifications', JSON.stringify(window.notificationsList));
    } catch (e) {
      console.warn('Failed to save notifications to localStorage:', e);
    }
  }

  /**
   * Generates or synchronizes dynamic notifications from window.medications.
   */
  function ensureSeedNotifications() {
    const meds = window.medications || [];
    const now = new Date();

    // 1. Check for Medication Reminder (e.g. Metformin XR 500 mg)
    const metformin = meds.find((m) => m.name.toLowerCase().includes('metformin')) || meds[1] || meds[0];
    if (metformin && !window.notificationsList.some((n) => n.id === 'notif-reminder-metformin')) {
      window.notificationsList.push({
        id: 'notif-reminder-metformin',
        type: 'reminder',
        medId: metformin.id,
        title: 'Medication Reminder',
        medName: `${metformin.name} ${metformin.dosage}`,
        subtext: `Due at ${window.formatTimeDisplay ? window.formatTimeDisplay(metformin.time) : '08:00 PM'}`,
        timestamp: now.getTime() - 1000 * 60 * 12, // 12 mins ago
        status: 'unread',
        actionState: metformin.taken || metformin.status === 'taken' ? 'completed' : 'pending',
        scheduledTime: metformin.time
      });
    }

    // 2. Check for Low Stock (e.g. Lisinopril has 7 tablets remaining)
    const lisinopril = meds.find((m) => m.name.toLowerCase().includes('lisinopril')) || meds[0];
    if (lisinopril) {
      // Ensure low stock count is 7 if not set for seed demonstration
      if (lisinopril.stock === undefined || lisinopril.stock > 9) {
        lisinopril.stock = 7;
      }
      if (!window.notificationsList.some((n) => n.id === 'notif-low-stock-lisinopril')) {
        window.notificationsList.push({
          id: 'notif-low-stock-lisinopril',
          type: 'low_stock',
          medId: lisinopril.id,
          title: 'Low Stock Alert',
          medName: lisinopril.name,
          subtext: `${lisinopril.name} has ${lisinopril.stock} tablets remaining`,
          timestamp: now.getTime() - 1000 * 60 * 45, // 45 mins ago
          status: 'unread',
          actionState: 'pending'
        });
      }
    }

    // 3. Check for Upcoming Dose (e.g. Amlodipine 5 mg in 45 minutes)
    const amlodipine = meds.find((m) => m.name.toLowerCase().includes('amlodipine')) || meds[3] || meds[0];
    if (amlodipine && !window.notificationsList.some((n) => n.id === 'notif-upcoming-amlodipine')) {
      window.notificationsList.push({
        id: 'notif-upcoming-amlodipine',
        type: 'upcoming',
        medId: amlodipine.id,
        title: 'Upcoming Dose',
        medName: `${amlodipine.name} ${amlodipine.dosage}`,
        subtext: 'In 45 minutes',
        minutesAway: 45,
        targetTime: now.getTime() + 45 * 60 * 1000,
        timestamp: now.getTime() - 1000 * 60 * 5, // 5 mins ago
        status: 'unread',
        actionState: 'pending'
      });
    }

    // 4. Additional dynamic low stock alerts for any other med stock < 10
    meds.forEach((med) => {
      if (med.stock < 10 && !window.notificationsList.some((n) => n.medId === med.id && n.type === 'low_stock')) {
        window.notificationsList.push({
          id: `notif-lowstock-${med.id}`,
          type: 'low_stock',
          medId: med.id,
          title: 'Low Stock Alert',
          medName: med.name,
          subtext: `${med.name} has ${med.stock} tablets remaining`,
          timestamp: now.getTime() - 1000 * 60 * 30,
          status: 'unread',
          actionState: 'pending'
        });
      }
    });

    // 5. Additional dynamic refill reminder for stock < 5
    meds.forEach((med) => {
      if (med.stock < 5 && !window.notificationsList.some((n) => n.medId === med.id && n.type === 'refill')) {
        window.notificationsList.push({
          id: `notif-refill-${med.id}`,
          type: 'refill',
          medId: med.id,
          title: 'Refill Reminder',
          medName: med.name,
          subtext: `Critical stock level (${med.stock} left). Request refill now.`,
          timestamp: now.getTime() - 1000 * 60 * 60 * 2,
          status: 'unread',
          actionState: 'pending'
        });
      }
    });

    saveNotificationsState();
  }

  /**
   * Recalculates dynamic fields (e.g., dynamic remaining time for upcoming doses, low stock tablet count).
   */
  function syncDynamicFields() {
    const meds = window.medications || [];
    const now = Date.now();

    window.notificationsList.forEach((notif) => {
      // Sync low stock counts
      if (notif.type === 'low_stock') {
        const med = meds.find((m) => m.id === notif.medId);
        if (med) {
          notif.subtext = `${med.name} has ${med.stock} tablets remaining`;
        }
      }

      // Sync upcoming dose countdown dynamically
      if (notif.type === 'upcoming' && notif.targetTime) {
        const diffMs = notif.targetTime - now;
        if (diffMs > 0) {
          const mins = Math.ceil(diffMs / (1000 * 60));
          if (mins >= 60) {
            const hrs = Math.floor(mins / 60);
            const rMins = mins % 60;
            notif.subtext = `In ${hrs}h ${rMins}m`;
          } else {
            notif.subtext = `In ${mins} minutes`;
          }
        } else {
          notif.subtext = 'Due now';
        }
      }

      // Sync completed status if medication was taken via dashboard/alarm modal
      if (notif.type === 'reminder') {
        const med = meds.find((m) => m.id === notif.medId);
        if (med && (med.taken || med.status === 'taken')) {
          notif.actionState = 'completed';
        }
      }
    });
  }

  /**
   * Updates all notification UI elements (bell badge, dropdown panel, summary bar).
   */
  function updateNotificationsUI() {
    syncDynamicFields();
    updateBellBadge();
    renderDropdownList();
    renderProgressSummary();
    if (document.getElementById('allNotificationsModal')?.classList.contains('active')) {
      renderAllNotificationsList();
    }
  }

  /**
   * Updates top header bell badge count.
   */
  function updateBellBadge() {
    const badgeEl = document.getElementById('notificationBadge');
    const headerUnreadEl = document.getElementById('notificationHeaderUnreadBadge');
    const unreadCount = window.notificationsList.filter((n) => n.status === 'unread').length;

    if (badgeEl) {
      if (unreadCount > 0) {
        badgeEl.textContent = unreadCount > 99 ? '99+' : unreadCount;
        badgeEl.style.display = 'flex';
        badgeEl.classList.add('badge-pulse');
      } else {
        badgeEl.style.display = 'none';
        badgeEl.classList.remove('badge-pulse');
      }
    }

    if (headerUnreadEl) {
      headerUnreadEl.textContent = unreadCount > 0 ? `${unreadCount} New` : 'All read';
      headerUnreadEl.className = unreadCount > 0 ? 'unread-header-count active' : 'unread-header-count';
    }
  }

  /**
   * Renders the top notifications inside the floating dropdown list.
   */
  function renderDropdownList() {
    const listEl = document.getElementById('notificationDropdownList');
    if (!listEl) return;

    if (window.notificationsList.length === 0) {
      listEl.innerHTML = `
        <div class="empty-notifications-state">
          <i data-lucide="bell-off"></i>
          <p>No notifications right now.</p>
        </div>`;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // Show top items (prioritize unread and pending action items)
    const sorted = [...window.notificationsList].sort((a, b) => {
      if (a.status === 'unread' && b.status !== 'unread') return -1;
      if (a.status !== 'unread' && b.status === 'unread') return 1;
      return b.timestamp - a.timestamp;
    });

    const displayItems = sorted.slice(0, 4);

    let html = '';
    displayItems.forEach((notif) => {
      const isUnread = notif.status === 'unread';
      const unreadClass = isUnread ? 'unread-item' : '';

      let iconHtml = '<i data-lucide="bell"></i>';
      let titleHtml = notif.title;
      let badgeTag = '';

      if (notif.type === 'reminder') {
        iconHtml = '<span class="notif-type-icon pill-icon">💊</span>';
        titleHtml = 'Medication Reminder';
      } else if (notif.type === 'low_stock') {
        iconHtml = '<span class="notif-type-icon warning-icon">⚠</span>';
        titleHtml = 'Low Stock';
        badgeTag = '<span class="notif-tag tag-warning">Warning</span>';
      } else if (notif.type === 'upcoming') {
        iconHtml = '<span class="notif-type-icon clock-icon">⏰</span>';
        titleHtml = 'Upcoming Dose';
        badgeTag = '<span class="notif-tag tag-cyan">Upcoming</span>';
      } else if (notif.type === 'missed') {
        iconHtml = '<span class="notif-type-icon danger-icon">🚨</span>';
        titleHtml = 'Missed Dose';
        badgeTag = '<span class="notif-tag tag-danger">Missed</span>';
      } else if (notif.type === 'refill') {
        iconHtml = '<span class="notif-type-icon refill-icon">📦</span>';
        titleHtml = 'Refill Reminder';
      }

      // Action buttons
      let actionsHtml = '';
      if (notif.type === 'reminder' || notif.type === 'missed') {
        if (notif.actionState === 'completed') {
          actionsHtml = `
            <div class="notif-status-done">
              <i data-lucide="check-circle-2"></i> Marked as Taken
            </div>`;
        } else if (notif.actionState === 'snoozed') {
          actionsHtml = `
            <div class="notif-status-snoozed">
              <i data-lucide="clock"></i> Snoozed
            </div>`;
        } else {
          actionsHtml = `
            <div class="notif-actions-row">
              <button class="notif-btn take-now-btn" onclick="handleNotifTakeNow(event, '${notif.id}', '${notif.medId}')">
                <i data-lucide="check"></i> Take Now
              </button>
              <button class="notif-btn snooze-btn" onclick="handleNotifSnooze(event, '${notif.id}', '${notif.medId}')">
                <i data-lucide="clock"></i> Snooze
              </button>
            </div>`;
        }
      } else if (notif.type === 'low_stock' || notif.type === 'refill') {
        actionsHtml = `
          <div class="notif-actions-row">
            <button class="notif-btn view-med-btn" onclick="handleNotifViewMed(event, '${notif.id}', '${notif.medId}')">
              <i data-lucide="eye"></i> View Medication
            </button>
          </div>`;
      }

      html += `
        <div class="notification-card-item ${unreadClass}" onclick="markNotifAsRead('${notif.id}')">
          ${isUnread ? '<span class="unread-glow-dot"></span>' : ''}
          <div class="notif-card-header">
            <div class="notif-title-group">
              ${iconHtml}
              <span class="notif-card-title">${titleHtml}</span>
            </div>
            ${badgeTag}
          </div>
          <div class="notif-card-body">
            <div class="notif-med-name">${escapeHtml(notif.medName)}</div>
            <div class="notif-subtext">${escapeHtml(notif.subtext)}</div>
          </div>
          ${actionsHtml}
        </div>`;
    });

    listEl.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  /**
   * Renders bottom progress summary bar in the notification panel.
   */
  function renderProgressSummary() {
    const meds = window.medications || [];
    const totalDoses = meds.length;
    const takenCount = meds.filter((m) => m.taken || m.status === 'taken').length;
    const adherencePct = totalDoses > 0 ? Math.round((takenCount / totalDoses) * 100) : 0;

    const pctEl = document.getElementById('summaryAdherencePct');
    const dosesEl = document.getElementById('summaryDosesCount');
    const progressBarEl = document.getElementById('summaryProgressBarFill');

    if (pctEl) pctEl.textContent = `${adherencePct}%`;
    if (dosesEl) dosesEl.textContent = `${takenCount} of ${totalDoses} doses completed`;
    if (progressBarEl) progressBarEl.style.width = `${adherencePct}%`;
  }

  /**
   * Starts live interval timer to update remaining minutes on upcoming doses dynamically.
   */
  function startCountdownTimer() {
    if (countdownTimerId) clearInterval(countdownTimerId);
    countdownTimerId = setInterval(() => {
      syncDynamicFields();
      renderDropdownList();
      renderProgressSummary();
    }, 15000); // Check every 15s
  }

  /**
   * Toggles notification dropdown floating panel visibility.
   */
  function toggleNotificationDropdown(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const panel = document.getElementById('notificationDropdownPanel');
    if (!panel) return;

    // Close profile dropdown if open
    if (window.closeProfileDropdown) window.closeProfileDropdown();

    isPanelOpen = !isPanelOpen;

    if (isPanelOpen) {
      updateNotificationsUI();
      panel.classList.add('active');
      adjustPanelViewportPosition(panel);
    } else {
      panel.classList.remove('active');
    }
  }

  /**
   * Adjusts dropdown panel positioning to ensure it stays within viewport bounds on smaller screens.
   */
  function adjustPanelViewportPosition(panel) {
    const rect = panel.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    if (rect.right > viewportWidth - 10) {
      panel.style.right = '0px';
      panel.style.left = 'auto';
    }
    if (rect.left < 10) {
      panel.style.left = '10px';
      panel.style.right = 'auto';
    }
  }

  /**
   * Closes notification panel dropdown.
   */
  function closeNotificationDropdown() {
    const panel = document.getElementById('notificationDropdownPanel');
    if (panel) panel.classList.remove('active');
    isPanelOpen = false;
  }

  /**
   * Marks a notification as read.
   */
  function markNotifAsRead(notifId) {
    const notif = window.notificationsList.find((n) => n.id === notifId);
    if (notif && notif.status === 'unread') {
      notif.status = 'read';
      saveNotificationsState();
      updateNotificationsUI();
    }
  }

  /**
   * Action Handler: Take Now button inside notification card.
   */
  function handleNotifTakeNow(e, notifId, medId) {
    if (e) e.stopPropagation();

    const notif = window.notificationsList.find((n) => n.id === notifId);
    if (notif) {
      notif.actionState = 'completed';
      notif.status = 'read';
    }

    // Call core app markTaken function
    if (window.markTaken) {
      window.markTaken(medId);
    }

    saveNotificationsState();
    updateNotificationsUI();
  }

  /**
   * Action Handler: Snooze button inside notification card.
   */
  function handleNotifSnooze(e, notifId, medId) {
    if (e) e.stopPropagation();

    const notif = window.notificationsList.find((n) => n.id === notifId);
    const snoozeMins = parseInt(window.appSettings ? window.appSettings.snoozeMinutes || 10 : 10, 10);

    if (notif) {
      notif.actionState = 'snoozed';
      notif.status = 'read';
      notif.subtext = `Snoozed for ${snoozeMins} mins`;
    }

    if (window.showToast) {
      window.showToast(`Reminder snoozed for ${snoozeMins} minutes.`, 'info');
    }

    saveNotificationsState();
    updateNotificationsUI();
  }

  /**
   * Action Handler: View Medication button inside notification card.
   */
  function handleNotifViewMed(e, notifId, medId) {
    if (e) e.stopPropagation();

    markNotifAsRead(notifId);
    closeNotificationDropdown();

    // Switch to medications tab
    if (window.switchTab) {
      window.switchTab('medications');
    }

    // Highlight target medication card
    setTimeout(() => {
      const medCards = document.querySelectorAll('.med-card, .medication-card');
      medCards.forEach((card) => {
        if (card.getAttribute('data-id') === medId || card.innerHTML.includes(medId)) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.add('pulse-glow-highlight');
          setTimeout(() => card.classList.remove('pulse-glow-highlight'), 3000);
        }
      });
    }, 150);
  }

  /**
   * Opens Dedicated Notification Center Modal ("View All Notifications").
   */
  function openAllNotificationsModal() {
    closeNotificationDropdown();
    renderAllNotificationsList();
    if (window.openModal) {
      window.openModal('allNotificationsModal');
    }
  }

  /**
   * Renders full notification list in All Notifications Modal with filter pills.
   */
  function renderAllNotificationsList(filterType = 'all') {
    const container = document.getElementById('allNotificationsListContainer');
    if (!container) return;

    let items = [...window.notificationsList];

    if (filterType === 'unread') {
      items = items.filter((n) => n.status === 'unread');
    } else if (filterType === 'reminders') {
      items = items.filter((n) => n.type === 'reminder');
    } else if (filterType === 'low_stock') {
      items = items.filter((n) => n.type === 'low_stock' || n.type === 'refill');
    } else if (filterType === 'upcoming') {
      items = items.filter((n) => n.type === 'upcoming');
    } else if (filterType === 'missed') {
      items = items.filter((n) => n.type === 'missed');
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-modal-notifications">
          <i data-lucide="check-circle" style="width: 48px; height: 48px; color: var(--primary-teal); opacity: 0.5;"></i>
          <p>No notifications found in this category.</p>
        </div>`;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    let html = '';
    items.forEach((notif) => {
      const isUnread = notif.status === 'unread';
      const unreadClass = isUnread ? 'unread-modal-item' : '';
      const dateStr = formatNotifTime(notif.timestamp);

      let badgeClass = 'badge-info';
      let typeLabel = 'Reminder';

      if (notif.type === 'low_stock') { badgeClass = 'badge-warning'; typeLabel = 'Low Stock Alert'; }
      else if (notif.type === 'upcoming') { badgeClass = 'badge-pending'; typeLabel = 'Upcoming Dose'; }
      else if (notif.type === 'missed') { badgeClass = 'badge-danger'; typeLabel = 'Missed Dose'; }
      else if (notif.type === 'refill') { badgeClass = 'badge-warning'; typeLabel = 'Refill Needed'; }

      let stateBadge = '';
      if (notif.actionState === 'completed') {
        stateBadge = '<span class="badge badge-success">✓ Completed</span>';
      } else if (notif.actionState === 'snoozed') {
        stateBadge = '<span class="badge badge-pending">⏰ Snoozed</span>';
      } else if (isUnread) {
        stateBadge = '<span class="badge badge-cyan">Unread</span>';
      } else {
        stateBadge = '<span class="badge badge-secondary">Read</span>';
      }

      html += `
        <div class="all-notif-row ${unreadClass}">
          <div class="all-notif-main">
            <div class="all-notif-header-row">
              <span class="badge ${badgeClass}">${typeLabel}</span>
              ${stateBadge}
              <span class="all-notif-time">${dateStr}</span>
            </div>
            <h4 class="all-notif-title">${escapeHtml(notif.title)} — ${escapeHtml(notif.medName)}</h4>
            <p class="all-notif-desc">${escapeHtml(notif.subtext)}</p>
          </div>
          <div class="all-notif-actions">
            ${notif.type === 'reminder' && notif.actionState !== 'completed' ? `
              <button class="primary-btn btn-sm" onclick="handleNotifTakeNow(event, '${notif.id}', '${notif.medId}')">Take Now</button>
            ` : ''}
            ${notif.type === 'low_stock' || notif.type === 'refill' ? `
              <button class="secondary-btn btn-sm" onclick="handleNotifViewMed(event, '${notif.id}', '${notif.medId}')">View Med</button>
            ` : ''}
            ${isUnread ? `
              <button class="icon-btn btn-sm" title="Mark as Read" onclick="markNotifAsRead('${notif.id}')">
                <i data-lucide="check"></i>
              </button>
            ` : ''}
          </div>
        </div>`;
    });

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  /**
   * Filters All Notifications Modal list.
   */
  function filterAllNotifications(filterType, pillBtn) {
    document.querySelectorAll('#allNotificationsModal .filter-pill').forEach((p) => p.classList.remove('active'));
    if (pillBtn) pillBtn.classList.add('active');
    renderAllNotificationsList(filterType);
  }

  /**
   * Marks all notifications as read.
   */
  function markAllNotificationsAsRead() {
    window.notificationsList.forEach((n) => (n.status = 'read'));
    saveNotificationsState();
    updateNotificationsUI();
    if (window.showToast) window.showToast('All notifications marked as read.', 'success');
  }

  /**
   * Clears read notifications.
   */
  function clearReadNotifications() {
    window.notificationsList = window.notificationsList.filter((n) => n.status === 'unread');
    saveNotificationsState();
    updateNotificationsUI();
    if (window.showToast) window.showToast('Read notifications cleared.', 'info');
  }

  /**
   * Opens Notification Settings Modal.
   */
  function openNotificationSettingsModal(e) {
    if (e) e.stopPropagation();
    closeNotificationDropdown();

    const s = window.appSettings || {};
    const remindersCheck = document.getElementById('settingNotifReminders');
    const upcomingCheck = document.getElementById('settingNotifUpcoming');
    const lowStockCheck = document.getElementById('settingNotifLowStock');
    const refillsCheck = document.getElementById('settingNotifRefills');
    const browserCheck = document.getElementById('settingNotifBrowser');
    const soundCheck = document.getElementById('settingNotifSound');
    const snoozeSelect = document.getElementById('settingNotifSnooze');

    if (remindersCheck) remindersCheck.checked = s.enableReminders !== false;
    if (upcomingCheck) upcomingCheck.checked = s.upcomingDoseAlerts !== false;
    if (lowStockCheck) lowStockCheck.checked = s.lowStockAlerts !== false;
    if (refillsCheck) refillsCheck.checked = s.refillReminders !== false;
    if (browserCheck) browserCheck.checked = s.browserNotifications === true;
    if (soundCheck) soundCheck.checked = s.alarmSound !== false;
    if (snoozeSelect) snoozeSelect.value = String(s.snoozeMinutes || 10);

    if (window.openModal) {
      window.openModal('notificationSettingsModal');
    }
  }

  /**
   * Saves Notification Settings form.
   */
  function saveNotificationSettingsForm(e) {
    if (e) e.preventDefault();

    const remindersCheck = document.getElementById('settingNotifReminders');
    const upcomingCheck = document.getElementById('settingNotifUpcoming');
    const lowStockCheck = document.getElementById('settingNotifLowStock');
    const refillsCheck = document.getElementById('settingNotifRefills');
    const browserCheck = document.getElementById('settingNotifBrowser');
    const soundCheck = document.getElementById('settingNotifSound');
    const snoozeSelect = document.getElementById('settingNotifSnooze');

    // Handle Browser Notification Permission request
    if (browserCheck && browserCheck.checked && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission !== 'granted') {
            browserCheck.checked = false;
            if (window.showToast) window.showToast('Browser notification permission was denied.', 'warning');
          }
        });
      }
    }

    window.appSettings = {
      ...window.appSettings,
      enableReminders: remindersCheck ? remindersCheck.checked : true,
      upcomingDoseAlerts: upcomingCheck ? upcomingCheck.checked : true,
      lowStockAlerts: lowStockCheck ? lowStockCheck.checked : true,
      refillReminders: refillsCheck ? refillsCheck.checked : true,
      browserNotifications: browserCheck ? browserCheck.checked : false,
      alarmSound: soundCheck ? soundCheck.checked : true,
      snoozeMinutes: snoozeSelect ? parseInt(snoozeSelect.value, 10) : 10
    };

    localStorage.setItem('medimate_settings', JSON.stringify(window.appSettings));

    if (window.closeModal) window.closeModal('notificationSettingsModal');
    if (window.showToast) window.showToast('Notification preferences updated successfully.', 'success');

    updateNotificationsUI();
  }

  /**
   * Helper: Formats timestamp to human readable string (e.g. "12 mins ago", "Today at 08:00 PM").
   */
  function formatNotifTime(ts) {
    if (!ts) return 'Today';
    const now = Date.now();
    const diffMins = Math.floor((now - ts) / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const date = new Date(ts);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Helper: Escapes HTML to prevent XSS.
   */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Attaches click outside listener and keydown listeners.
   */
  function attachGlobalListeners() {
    document.addEventListener('click', (e) => {
      const container = document.getElementById('notificationDropdownContainer');
      if (isPanelOpen && container && !container.contains(e.target)) {
        closeNotificationDropdown();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isPanelOpen) {
        closeNotificationDropdown();
      }
    });
  }

  // Export functions to global scope
  window.toggleNotificationDropdown = toggleNotificationDropdown;
  window.closeNotificationDropdown = closeNotificationDropdown;
  window.handleNotifTakeNow = handleNotifTakeNow;
  window.handleNotifSnooze = handleNotifSnooze;
  window.handleNotifViewMed = handleNotifViewMed;
  window.markNotifAsRead = markNotifAsRead;
  window.openAllNotificationsModal = openAllNotificationsModal;
  window.filterAllNotifications = filterAllNotifications;
  window.markAllNotificationsAsRead = markAllNotificationsAsRead;
  window.clearReadNotifications = clearReadNotifications;
  window.openNotificationSettingsModal = openNotificationSettingsModal;
  window.saveNotificationSettingsForm = saveNotificationSettingsForm;
  window.updateNotificationsUI = updateNotificationsUI;
  window.initNotifications = initNotifications;

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotifications);
  } else {
    initNotifications();
  }
})();

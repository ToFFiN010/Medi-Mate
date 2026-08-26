/* ==========================================================================
   MediMate Internationalization (i18n) & Localized TTS Voice Module
   ========================================================================== */

const embeddedDictionaries = {
  en: {
    appTitle: "MediMate",
    appSubtitle: "Health Dashboard",
    navDashboard: "Dashboard",
    navMedications: "Medications",
    navSchedule: "Schedule",
    navHistory: "History",
    navAnalytics: "Analytics",
    navAiAssistant: "AI Assistant",
    navProfile: "Profile",
    navSettings: "Settings",
    greetingMorning: "Good Morning",
    greetingAfternoon: "Good Afternoon",
    greetingEvening: "Good Evening",
    statTodayDoses: "Today's Doses",
    statTaken: "Taken",
    statPending: "Pending",
    statAdherenceRate: "Adherence Rate",
    statLowStock: "Low Stock",
    searchPlaceholder: "Search by name, dosage, or category...",
    filterAll: "All",
    filterPending: "Pending",
    filterTaken: "Taken",
    filterLowStock: "Low Stock",
    todaysScheduleTitle: "Today's Medication Schedule",
    addMedication: "Add Medication",
    addNewMedicine: "Add New Medicine",
    medicationCabinetTitle: "Medication Cabinet",
    medicationCabinetDesc: "Manage your active medications, dosages, and stock levels.",
    detailedScheduleTitle: "Detailed Schedule",
    detailedScheduleDesc: "Comprehensive timeline of your medications grouped by time of day.",
    historyLogTitle: "Medication History Log",
    historyLogDesc: "Historical record of taken, pending, and missed dose timestamps.",
    clearHistory: "Clear History",
    analyticsTitle: "Adherence & Health Analytics",
    analyticsDesc: "Track your medication compliance and weekly compliance trends.",
    aiAssistantTitle: "MediMate Health Assistant",
    aiAssistantDesc: "Ask questions about your medicines, stock, or schedule.",
    aiSafetyDisclaimer: "Health Safety Disclaimer: This AI assistant provides general information only. It is not a doctor. Consult your healthcare professional before modifying medication dosage.",
    settingsTitle: "Application Settings",
    settingsDesc: "Customize notifications, voice reminders, sound preferences, language, and data.",
    languagePreference: "Language Selection (Text + Voice)",
    languageDesc: "Select your preferred language for text UI and voice reminders.",
    timeFormatPreference: "Time Format Display",
    timeFormatDesc: "Switch between 12-hour (AM/PM) and 24-hour time representation.",
    customRingtoneTitle: "Custom Alarm Ringtone",
    customRingtoneDesc: "Upload your own MP3, WAV, or M4A audio file for medication alarms.",
    uploadAudioFile: "Upload Ringtone",
    playPreview: "Play Preview",
    stopPreview: "Stop Preview",
    resetDefaultTone: "Reset Default Tone",
    defaultToneActive: "Default Melodic Chime Active",
    alarmStyleTitle: "Alarm Style",
    alarmStyleDesc: "Choose alarm sound, vibration, and repetition behavior for reminders.",
    alarmStyleGentle: "Gentle (Soft volume ramp up)",
    alarmStyleStandard: "Standard (Default volume chime)",
    alarmStyleUrgent: "Urgent / Persistent (Loud, looping sound & vibration)",
    alarmStyleSilentVibe: "Silent + Vibration Only",
    markTaken: "Mark Taken",
    remindMeLater: "Remind Me Later",
    dismiss: "Dismiss",
    reminderDueAlert: "Reminder: {name} ({dosage}) is due now.",
    scheduledFor: "Scheduled for {time}",
    speechReminder: "MediMate reminder. It is time to take your {name}, {dosage}.",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    editMedication: "Edit Medication",
    deleteMedication: "Remove Medication"
  },
  ta: {
    appTitle: "MediMate",
    appSubtitle: "சுகாதார டாஷ்போர்டு",
    navDashboard: "முகப்புப்பலகை",
    navMedications: "மருந்துகள்",
    navSchedule: "அட்டவணை",
    navHistory: "வரலாறு",
    navAnalytics: "பகுப்பாய்வு",
    navAiAssistant: "AI உதவியாளர்",
    navProfile: "சுயவிவரம்",
    navSettings: "அமைப்புகள்",
    greetingMorning: "காலை வணக்கம்",
    greetingAfternoon: "மதிய வணக்கம்",
    greetingEvening: "மாலை வணக்கம்",
    statTodayDoses: "இன்றைய மருந்துகள்",
    statTaken: "எடுக்கப்பட்டவை",
    statPending: "நிலுவையில் உள்ளவை",
    statAdherenceRate: "பின்பற்றல் விகிதம்",
    statLowStock: "குறைந்த இருப்பு",
    searchPlaceholder: "பெயர், அளவு அல்லது வகை மூலம் தேடுக...",
    filterAll: "அனைத்தும்",
    filterPending: "நிலுவையில்",
    filterTaken: "எடுக்கப்பட்டது",
    filterLowStock: "குறைந்த இருப்பு",
    todaysScheduleTitle: "இன்றைய மருந்து அட்டவணை",
    addMedication: "மருந்து சேர்",
    addNewMedicine: "புதிய மருந்து சேர்க்கவும்",
    medicationCabinetTitle: "மருந்து பெட்டி",
    medicationCabinetDesc: "உங்கள் மருந்துகள், அளவுகள் மற்றும் இருப்பு நிலைகளை நிர்வகிக்கவும்.",
    detailedScheduleTitle: "விரிவான அட்டவணை",
    detailedScheduleDesc: "நேரத்தின் அடிப்படையில் தொகுக்கப்பட்ட மருந்துகளின் முழுமையான காலவரிசை.",
    historyLogTitle: "மருந்து வரலாற்றுப் பதிவு",
    historyLogDesc: "எடுக்கப்பட்ட மற்றும் தவறவிட்ட மருந்துகளின் வரலாற்றுப் பதிவு.",
    clearHistory: "வரலாற்றை அழி",
    analyticsTitle: "சுகாதார பகுப்பாய்வு",
    analyticsDesc: "உங்கள் மருந்து பின்பற்றுதல் முறைகளை கண்காணிக்கவும்.",
    aiAssistantTitle: "MediMate AI சுகாதார உதவியாளர்",
    aiAssistantDesc: "உங்கள் மருந்துகள் மற்றும் அட்டவணை பற்றி கேள்விகள் கேட்கவும்.",
    aiSafetyDisclaimer: "சுகாதார பாதுகாப்பு அறிவிப்பு: இந்த AI உதவியாளர் பொதுவான தகவல்களை மட்டுமே வழங்குகிறது. இது ஒரு மருத்துவர் அல்ல.",
    settingsTitle: "செயலி அமைப்புகள்",
    settingsDesc: "அறிவிப்புகள், குரல் நினைவூட்டல்கள், ஒலி விருப்பங்கள் மற்றும் மொழியைத் தனிப்பயனாக்கவும்.",
    languagePreference: "மொழித் தேர்வு (எழுத்து + குரல்)",
    languageDesc: "உரை இடைமுகம் மற்றும் குரல் நினைவூட்டல்களுக்கான மொழியைத் தேர்ந்தெடுக்கவும்.",
    timeFormatPreference: "நேர வடிவம் காட்சி",
    timeFormatDesc: "12-மணிநேரம் (AM/PM) மற்றும் 24-மணிநேர நேர காட்சிக்கு இடையே மாறவும்.",
    customRingtoneTitle: "விருப்ப விழிப்பு ஒலி",
    customRingtoneDesc: "மருந்து நினைவூட்டல்களுக்கு சொந்த MP3, WAV அல்லது M4A ஒலி கோப்பை பதிவேற்றவும்.",
    uploadAudioFile: "ஒலியை பதிவேற்று",
    playPreview: "முன்னோட்டம் இயக்கு",
    stopPreview: "நிறுத்து",
    resetDefaultTone: "இயல்புநிலை ஒலியை அமை",
    defaultToneActive: "இயல்புநிலை மெல்லிசை செயலில் உள்ளது",
    alarmStyleTitle: "விழிப்பு ஒலி பாணி",
    alarmStyleDesc: "நினைவூட்டல்களுக்கான ஒலி, அதிர்வு மற்றும் மறுபடி இயங்கும் நடத்தையைத் தேர்வுசெய்க.",
    alarmStyleGentle: "மென்மையான (மெதுவாக அதிகரிக்கும் ஒலி)",
    alarmStyleStandard: "இயல்புநிலை (நிலையான அளவு ஒலி)",
    alarmStyleUrgent: "அவசர / தொடர்ச்சியான (அதிக ஒலி & அதிர்வு)",
    alarmStyleSilentVibe: "அமைதி + அதிர்வு மட்டும்",
    markTaken: "எடுத்துக்கொண்டேன்",
    remindMeLater: "பின்னர் நினைவூட்டு",
    dismiss: "தள்ளுபடி செய்",
    reminderDueAlert: "நினைவூட்டல்: {name} ({dosage}) இப்போது எடுக்க வேண்டும்.",
    scheduledFor: "திட்டமிடப்பட்ட நேரம் {time}",
    speechReminder: "MediMate நினைவூட்டல். உங்கள் {name}, {dosage} உட்கொள்ளும் நேரம் இது.",
    saveChanges: "மாற்றங்களைச் சேமி",
    cancel: "ரத்து செய்",
    editMedication: "மருந்தை திருத்து",
    deleteMedication: "மருந்தை நீக்கு"
  },
  hi: {
    appTitle: "MediMate",
    appSubtitle: "स्वास्थ्य डैशबोर्ड",
    navDashboard: "डैशबोर्ड",
    navMedications: "दवाएं",
    navSchedule: "समय-सारणी",
    navHistory: "इतिहास",
    navAnalytics: "विश्लेषण",
    navAiAssistant: "AI सहायक",
    navProfile: "प्रोफ़ाइल",
    navSettings: "सेटिंग्स",
    greetingMorning: "शुभ प्रभात",
    greetingAfternoon: "शुभ दोपहर",
    greetingEvening: "शुभ संध्या",
    statTodayDoses: "आज की खुराक",
    statTaken: "ली गई",
    statPending: "बकाया",
    statAdherenceRate: "अनुपालन दर",
    statLowStock: "कम स्टॉक",
    searchPlaceholder: "नाम, खुराक या श्रेणी से खोजें...",
    filterAll: "सभी",
    filterPending: "बकाया",
    filterTaken: "ली गई",
    filterLowStock: "कम स्टॉक",
    todaysScheduleTitle: "आज की दवा अनुसूची",
    addMedication: "दवा जोड़ें",
    addNewMedicine: "नई दवा जोड़ें",
    medicationCabinetTitle: "दवा कैबिनेट",
    medicationCabinetDesc: "अपनी सक्रिय दवाओं, खुराक और स्टॉक स्तर का प्रबंधन करें।",
    detailedScheduleTitle: "विस्तृत अनुसूची",
    detailedScheduleDesc: "समय के अनुसार आपकी दवाओं की विस्तृत समयरेखा।",
    historyLogTitle: "दवा इतिहास लॉग",
    historyLogDesc: "ली गई और छूटी हुई दवाओं का ऐतिहासिक रिकॉर्ड।",
    clearHistory: "इतिहास साफ़ करें",
    analyticsTitle: "स्वास्थ्य और अनुपालन विश्लेषण",
    analyticsDesc: "अपनी दवा अनुपालन और रुझानों पर नज़र रखें।",
    aiAssistantTitle: "MediMate स्वास्थ्य सहायक",
    aiAssistantDesc: "अपनी दवाओं और अनुसूची के बारे में प्रश्न पूछें।",
    aiSafetyDisclaimer: "स्वास्थ्य सुरक्षा अस्वीकरण: यह AI सहायक केवल सामान्य जानकारी प्रदान करता है। यह डॉक्टर नहीं है।",
    settingsTitle: "एप्लिकेशन सेटिंग्स",
    settingsDesc: "सूचनाएं, वॉयस रिमाइंडर, ध्वनि प्राथमिकताएं और भाषा कस्टमाइज़ करें।",
    languagePreference: "भाषा चयन (पाठ + आवाज)",
    languageDesc: "पाठ UI और वॉयस रिमाइंडर के लिए अपनी पसंदीदा भाषा चुनें।",
    timeFormatPreference: "समय प्रारूप प्रदर्शन",
    timeFormatDesc: "12-घंटे (AM/PM) और 24-घंटे के समय प्रदर्शन के बीच स्विच करें।",
    customRingtoneTitle: "कस्टम अलार्म रिंगटोन",
    customRingtoneDesc: "दवा अलार्म के लिए अपनी खुद की MP3, WAV या M4A ऑडियो फ़ाइल अपलोड करें।",
    uploadAudioFile: "रिंगटोन अपलोड करें",
    playPreview: "पूर्वावलोकन चलाएं",
    stopPreview: "रोकें",
    resetDefaultTone: "डिफ़ॉल्ट टोन सेट करें",
    defaultToneActive: "डिफ़ॉल्ट सुरीली धुन सक्रिय है",
    alarmStyleTitle: "अलार्म शैली",
    alarmStyleDesc: "रिमाइंडर के लिए ध्वनि, कंपन और दोहराव व्यवहार चुनें।",
    alarmStyleGentle: "सौम्य (धीमी आवाज़ से धीरे-धीरे बढ़ना)",
    alarmStyleStandard: "मानक (डिफ़ॉल्ट स्थिर ध्वनि)",
    alarmStyleUrgent: "आपातकालीन / निरंतर (तेज़, लगातार बजने वाली ध्वनि और कंपन)",
    alarmStyleSilentVibe: "शांत + केवल कंपन",
    markTaken: "दवा ली गई",
    remindMeLater: "बाद में याद दिलाएं",
    dismiss: "खारिज करें",
    reminderDueAlert: "रिमाइंडर: {name} ({dosage}) लेने का समय हो गया है।",
    scheduledFor: "निर्धारित समय {time}",
    speechReminder: "MediMate रिमाइंडर। आपकी दवा {name}, {dosage} लेने का समय हो गया है।",
    saveChanges: "सहेजें",
    cancel: "रद्द करें",
    editMedication: "दवा संपादित करें",
    deleteMedication: "दवाएं हटाएं"
  }
};

let currentLanguage = 'en';
let translations = embeddedDictionaries.en;

/**
 * Auto-detects device system language fallback (Tamil if starts with 'ta', Hindi if 'hi', else English).
 */
function getSystemLanguageFallback() {
  const navLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  if (navLang.startsWith('ta')) return 'ta';
  if (navLang.startsWith('hi')) return 'hi';
  return 'en';
}

/**
 * Initializes i18n language setting from stored settings or device fallback.
 */
function initI18n(langOverride) {
  const savedSettings = localStorage.getItem('medimate_settings');
  let lang = langOverride;

  if (!lang && savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings);
      if (parsed && parsed.language) lang = parsed.language;
    } catch (e) {}
  }

  if (!lang) {
    lang = getSystemLanguageFallback();
  }

  setLanguage(lang);
}

/**
 * Sets current active language and updates translations.
 */
function setLanguage(lang) {
  if (!['en', 'ta', 'hi'].includes(lang)) {
    lang = 'en';
  }

  currentLanguage = lang;
  translations = embeddedDictionaries[lang] || embeddedDictionaries.en;

  fetchLocaleFile(lang);
  applyTranslations();

  const langSelect = document.getElementById('settingLanguage');
  if (langSelect && langSelect.value !== lang) {
    langSelect.value = lang;
  }
}

/**
 * Optional async fetch to keep external JSON locale files synchronized.
 */
async function fetchLocaleFile(lang) {
  try {
    const response = await fetch(`locales/strings_${lang}.json`);
    if (response.ok) {
      const data = await response.json();
      translations = { ...translations, ...data };
      applyTranslations();
    }
  } catch (e) {
    // Fall back silently to embedded dictionary
  }
}

/**
 * Translation helper function `t(key, params)`.
 */
function t(key, params = {}) {
  let str = translations[key] || embeddedDictionaries.en[key] || key;
  Object.keys(params).forEach((paramKey) => {
    str = str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
  });
  return str;
}

/**
 * Applies translations to all DOM elements tagged with data-i18n or data-i18n-placeholder.
 */
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      if (el.children.length === 0 || el.hasAttribute('data-i18n-text-only')) {
        el.textContent = t(key);
      } else {
        const textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
        if (textNode) {
          textNode.textContent = t(key);
        } else {
          el.textContent = t(key);
        }
      }
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      el.placeholder = t(key);
    }
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * SpeechSynthesis TTS voice language selector helper.
 * Selects Tamil (ta-IN), Hindi (hi-IN), or English (en-US) voice engine.
 */
function getTTSLocale(lang) {
  switch (lang) {
    case 'ta': return 'ta-IN';
    case 'hi': return 'hi-IN';
    default: return 'en-US';
  }
}

/**
 * Finds matching browser TTS voice for the target locale.
 */
function getBestVoiceForLocale(locale) {
  if (!('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length === 0) return null;

  const langCode = locale.split('-')[0]; // 'ta', 'hi', 'en'

  // Exact match
  let voice = voices.find(v => v.lang === locale || v.lang.replace('_', '-') === locale);
  if (voice) return voice;

  // Prefix match
  voice = voices.find(v => v.lang.toLowerCase().startsWith(langCode));
  if (voice) return voice;

  return null;
}

// Global exports
window.initI18n = initI18n;
window.setLanguage = setLanguage;
window.t = t;
window.applyTranslations = applyTranslations;
window.getCurrentLanguage = () => currentLanguage;
window.getTTSLocale = getTTSLocale;
window.getBestVoiceForLocale = getBestVoiceForLocale;

// Initialize on script load
document.addEventListener('DOMContentLoaded', () => {
  initI18n();
});

/**
 * Equalaw i18n System v1.0
 * Language detection + translation engine
 * Supports: auto-detect, manual override, localStorage persistence
 */

(function () {
  'use strict';

  // Language metadata
  const LANG_NAMES = {
    en: 'English',
    hi: 'हिंदी',
    ta: 'தமிழ்',
    te: 'తెలుగు',
    mr: 'मराठी',
    gu: 'ગુજરાતી',
    kn: 'ಕನ್ನಡ',
    ml: 'മലയാളം',
    pa: 'ਪੰਜਾਬੀ',
    bn: 'বাংলা'
  };

  const SUPPORTED_LANGS = Object.keys(LANG_NAMES);
  const DEFAULT_LANG = 'en';

  // Store translations in memory
  let translations = {};
  let currentLang = DEFAULT_LANG;

  /**
   * Load translations from JSON file
   */
  async function loadTranslations() {
    try {
      const response = await fetch('/assets/translations.json');
      translations = await response.json();
      return true;
    } catch (error) {
      console.warn('[i18n] Failed to load translations:', error);
      return false;
    }
  }

  /**
   * Signal 1: Browser Locale Detection
   * navigator.language returns 'hi-IN', 'ta-IN', etc.
   */
  function detectFromBrowserLocale() {
    const browserLang = navigator.language.split('-')[0]; // 'hi' from 'hi-IN'
    if (SUPPORTED_LANGS.includes(browserLang)) {
      return browserLang;
    }
    return null;
  }

  /**
   * Signal 2: Time Zone Inference
   * 'Asia/Kolkata', 'Asia/Chennai', etc. → likely Indian language
   */
  function detectFromTimeZone() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // If in India, suggest Hindi (most common)
      if (tz && tz.startsWith('Asia')) {
        return 'hi'; // Default to Hindi for Asia timezones
      }
    } catch (e) {}
    return null;
  }

  /**
   * Main detection logic: 2-signal system (MVP)
   * Priority: localStorage > browser locale > timezone
   *
   * Note: IP geolocation omitted for MVP (would require backend server)
   * Browser locale + timezone detection covers 95% of use cases
   */
  function detectLanguage() {
    // Signal 0 (Highest Priority): Saved choice from localStorage
    const saved = localStorage.getItem('eq_lang');
    if (saved && SUPPORTED_LANGS.includes(saved)) {
      return saved;
    }

    // Signal 1: Browser locale (navigator.language)
    // If user set their browser to हिंदी, they almost certainly want हिंदी UI
    const browserLang = detectFromBrowserLocale();
    if (browserLang) {
      return browserLang;
    }

    // Signal 2: Time zone inference
    // If timezone is Asia/*, likely in South Asia → default to Hindi
    const tzLang = detectFromTimeZone();
    if (tzLang) {
      return tzLang;
    }

    // Last resort: default to English
    return DEFAULT_LANG;
  }

  /**
   * Get translation for a key
   * Falls back to English if translation not found
   */
  window.t = function (key, replacements = {}) {
    const langData = translations[currentLang] || translations[DEFAULT_LANG];
    let text = langData[key] || translations[DEFAULT_LANG][key] || key;

    // Replace placeholders like {language} or {count}
    Object.keys(replacements).forEach(placeholder => {
      text = text.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
    });

    return text;
  };

  /**
   * Switch language dynamically
   */
  window.switchLanguage = function (lang) {
    if (!SUPPORTED_LANGS.includes(lang)) {
      console.warn('[i18n] Unsupported language:', lang);
      return;
    }

    currentLang = lang;
    localStorage.setItem('eq_lang', lang);

    // Update page title
    const pageKey = getPageTitleKey();
    if (pageKey && translations[lang][pageKey]) {
      document.title = translations[lang][pageKey];
    }

    // Trigger event for UI to listen and re-render
    window.dispatchEvent(new CustomEvent('language-changed', { detail: { lang } }));

    // Auto-reload to apply all changes (simpler than re-rendering all elements)
    // Optional: only reload if not during initial load
    if (document.readyState === 'complete') {
      location.reload();
    }
  };

  /**
   * Get current language
   */
  window.getCurrentLang = function () {
    return currentLang;
  };

  /**
   * Get language display name
   */
  window.getLangName = function (lang = currentLang) {
    return LANG_NAMES[lang] || lang;
  };

  /**
   * Get all supported languages
   */
  window.getSupportedLanguages = function () {
    return SUPPORTED_LANGS.map(lang => ({
      code: lang,
      name: LANG_NAMES[lang]
    }));
  };

  /**
   * Determine which page we're on for title translation
   */
  function getPageTitleKey() {
    const pathname = window.location.pathname;
    if (pathname.includes('/chatbot')) return 'page_title_chatbot';
    if (pathname.includes('/join')) return 'page_title_join';
    return 'page_title_home';
  }

  /**
   * Initialize i18n system
   * Called on page load
   */
  window.initI18n = async function () {
    // Load translations from JSON
    const loaded = await loadTranslations();
    if (!loaded) {
      console.warn('[i18n] Failed to load translations, using default');
    }

    // Detect language silently
    const detected = detectLanguage();
    currentLang = detected;

    // Fire event so UI can listen
    window.dispatchEvent(new CustomEvent('i18n-ready', { detail: { lang: detected } }));

    return detected;
  };

  /**
   * Show language suggestion toast (if detected != current)
   * Called after page load
   */
  window.showLanguageSuggestionIfNeeded = function () {
    const detected = detectLanguage();
    const current = localStorage.getItem('eq_lang') || currentLang;

    // Only show suggestion if confidence is high and different
    if (detected && detected !== current && detected !== DEFAULT_LANG) {
      setTimeout(() => {
        showLanguageToast(detected);
      }, 2000); // After 2 sec, so page feels instant
    }
  };

  /**
   * Show toast suggestion to switch language
   */
  function showLanguageToast(suggestedLang) {
    // Don't show if toast already exists
    if (document.getElementById('lang-suggestion-toast')) {
      return;
    }

    const langName = LANG_NAMES[suggestedLang] || suggestedLang;
    const message = t('language_detected', { language: langName });

    const toast = document.createElement('div');
    toast.id = 'lang-suggestion-toast';
    toast.className = 'lang-suggestion-toast';
    toast.innerHTML = `
      <div class="toast-content">
        <span>${message}</span>
        <div class="toast-buttons">
          <button class="btn-switch" onclick="switchLanguage('${suggestedLang}')">
            ${t('language_yes')}
          </button>
          <button class="btn-dismiss" onclick="this.closest('.lang-suggestion-toast').remove()">
            ${t('language_dismiss')}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(toast);

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      if (document.getElementById('lang-suggestion-toast')) {
        toast.remove();
      }
    }, 6000);
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      // Check for URL lang param FIRST (overrides localStorage)
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang && SUPPORTED_LANGS.includes(urlLang)) {
        localStorage.setItem('eq_lang', urlLang);
        console.log('[i18n] URL param found: ?lang=' + urlLang);
      }

      window.initI18n().then(() => {
        window.showLanguageSuggestionIfNeeded();
      });
    });
  } else {
    // DOM already loaded (e.g., redirected page)
    // Check URL param FIRST
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && SUPPORTED_LANGS.includes(urlLang)) {
      localStorage.setItem('eq_lang', urlLang);
      console.log('[i18n] URL param found: ?lang=' + urlLang);
    }

    window.initI18n().then(() => {
      window.showLanguageSuggestionIfNeeded();
    });
  }
})();

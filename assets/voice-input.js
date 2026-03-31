/**
 * Deepgram Voice Input System v1.0
 * Language-locked speech-to-text with validation
 *
 * Replaces Web Speech API with Deepgram for better Indian language support
 *
 * Setup:
 * 1. Get free Deepgram API key: https://console.deepgram.com
 * 2. Set DEEPGRAM_API_KEY in environment or config
 * 3. Initialize: initDeepgramVoice()
 */

(function() {
  'use strict';

  // Get API key from window configuration (set by config.js or environment)
  const DEEPGRAM_API_KEY = window._DEEPGRAM_API_KEY || 'YOUR_DEEPGRAM_API_KEY';
  const DEEPGRAM_URL = 'https://api.deepgram.com/v1/listen';

  // Language code mapping for Deepgram
  const LANGUAGE_MAP = {
    'en': 'en',
    'hi': 'hi',      // Hindi (Devanagari script) - MUCH better than Web Speech API
    'ta': 'ta',      // Tamil
    'te': 'te',      // Telugu
    'mr': 'mr',      // Marathi
    'gu': 'gu',      // Gujarati
    'kn': 'kn',      // Kannada
    'ml': 'ml',      // Malayalam
    'pa': 'pa',      // Punjabi
    'bn': 'bn'       // Bengali
  };

  let isRecording = false;
  let mediaRecorder = null;
  let audioChunks = [];
  let recordingTimeout = null;
  let selectedLang = 'en';

  /**
   * Initialize Deepgram voice input
   * Call this after i18n is ready
   */
  window.initDeepgramVoice = function() {
    if (!DEEPGRAM_API_KEY || DEEPGRAM_API_KEY === 'YOUR_DEEPGRAM_API_KEY') {
      console.warn('[deepgram] API key not set. Using fallback to Web Speech API');
      return false;
    }

    // Store current language
    selectedLang = window.getCurrentLang ? window.getCurrentLang() : localStorage.getItem('eq_lang') || 'en';

    // Listen for language changes
    window.addEventListener('language-changed', function(e) {
      selectedLang = e.detail?.lang || window.getCurrentLang?.() || 'en';
      console.log('[deepgram] Language switched to:', selectedLang);
    });

    console.log('[deepgram] Initialized with API key (first 8 chars:', DEEPGRAM_API_KEY.substring(0, 8) + '...)');
    return true;
  };

  /**
   * Start voice recording
   * Records audio, sends to Deepgram, validates language, transcribes
   */
  window.startDeepgramVoiceInput = async function() {
    // Check if browser supports audio recording
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Microphone access not supported in your browser. Please use Chrome, Safari, or Edge.');
      return;
    }

    const btn = document.getElementById('voice-input-btn');
    const input = document.getElementById('legal-query');

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      isRecording = true;
      audioChunks = [];
      selectedLang = window.getCurrentLang ? window.getCurrentLang() : localStorage.getItem('eq_lang') || 'en';

      // Create media recorder
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        isRecording = false;
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        audioChunks = [];

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());

        // Send to Deepgram
        await transcribeWithDeepgram(audioBlob, input, btn);
      };

      // Start recording
      mediaRecorder.start();
      btn.classList.add('recording');
      btn.textContent = '🗣️ ' + (window.t ? window.t('voice_listening') : 'Listening...') + ' (ESC to stop)';
      btn.disabled = false;
      btn.title = 'Click to stop recording (or press ESC)';

      // Track event
      if (typeof eqTrack === 'function') {
        eqTrack('voice_input_started_deepgram', { language: selectedLang });
      }

      // Auto-stop after 30 seconds
      recordingTimeout = setTimeout(() => {
        if (isRecording && mediaRecorder) {
          mediaRecorder.stop();
          console.log('[deepgram] 30-second timeout reached');
        }
      }, 30000);

    } catch (error) {
      console.error('[deepgram] Microphone access denied:', error);
      alert(window.t ? window.t('voice_unsupported') : 'Microphone access required. Please allow microphone permission.');
      resetVoiceButton();
    }
  };

  /**
   * Stop recording manually
   */
  window.stopDeepgramVoiceInput = function() {
    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
    }
    if (recordingTimeout) {
      clearTimeout(recordingTimeout);
    }
  };

  /**
   * Send audio to Deepgram for transcription
   */
  async function transcribeWithDeepgram(audioBlob, inputEl, btnEl) {
    const btn = btnEl || document.getElementById('voice-input-btn');

    try {
      btn.textContent = '🗣️ Processing...';

      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');

      // Get language code for Deepgram
      const langCode = LANGUAGE_MAP[selectedLang] || 'en';

      const response = await fetch(
        `${DEEPGRAM_URL}?model=nova-2&language=${langCode}&smart_format=true`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${DEEPGRAM_API_KEY}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`Deepgram API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const transcript = result.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';

      if (!transcript) {
        throw new Error('No speech detected. Please try again.');
      }

      // Validate language of transcription
      validateAndProcessTranscript(transcript, inputEl, btn);

    } catch (error) {
      console.error('[deepgram] Transcription error:', error);
      showVoiceError(error.message, inputEl, btn);
    }
  }

  /**
   * Validate that transcription is in selected language
   * If transcription seems to be in wrong language, ask user to retry
   */
  function validateAndProcessTranscript(transcript, inputEl, btnEl) {
    const btn = btnEl || document.getElementById('voice-input-btn');
    const input = inputEl || document.getElementById('legal-query');

    console.log('[deepgram] Transcript:', transcript);
    console.log('[deepgram] Expected language:', selectedLang);

    // Check if transcript is likely in wrong language
    // Simple heuristic: if expecting Hindi but transcript is all ASCII, it's probably English/Hinglish
    const isLikelyWrongLang = checkLanguageMismatch(transcript, selectedLang);

    if (isLikelyWrongLang) {
      showLanguageMismatchError(selectedLang, btn);

      if (typeof eqTrack === 'function') {
        eqTrack('voice_input_language_mismatch', {
          expected_language: selectedLang,
          transcript: transcript.substring(0, 50)
        });
      }

      // Prepare for retry
      setTimeout(() => {
        btn.textContent = '🗣️ Retry';
        btn.disabled = false;
        btn.classList.remove('recording');
      }, 2000);

      return;
    }

    // Transcript is in correct language - process it
    input.value = transcript;
    input.focus();

    if (typeof eqTrack === 'function') {
      eqTrack('voice_input_success_deepgram', {
        language: selectedLang,
        transcript_length: transcript.length,
        service: 'deepgram'
      });
    }

    // Auto-submit after brief delay
    setTimeout(() => {
      document.getElementById('inquiry-form').dispatchEvent(new Event('submit'));
    }, 500);
  }

  /**
   * Check if transcript is likely in wrong language
   */
  function checkLanguageMismatch(transcript, expectedLang) {
    // If expecting Hindi but transcript has no Devanagari script, it's wrong
    if (expectedLang === 'hi') {
      const devanagariRegex = /[\u0900-\u097F]/; // Devanagari Unicode range
      if (!devanagariRegex.test(transcript)) {
        console.warn('[deepgram] Hindi expected but no Devanagari script found');
        return true;
      }
    }

    // If expecting Tamil but no Tamil script, it's wrong
    if (expectedLang === 'ta') {
      const tamilRegex = /[\u0B80-\u0BFF]/; // Tamil Unicode range
      if (!tamilRegex.test(transcript)) {
        return true;
      }
    }

    // Similar checks for other Indian languages
    const scriptRanges = {
      'te': /[\u0C00-\u0C7F]/,  // Telugu
      'mr': /[\u0900-\u097F]/,  // Marathi (Devanagari)
      'gu': /[\u0A80-\u0AFF]/,  // Gujarati
      'kn': /[\u0C80-\u0CFF]/,  // Kannada
      'ml': /[\u0D00-\u0D7F]/,  // Malayalam
      'pa': /[\u0A00-\u0A7F]/,  // Punjabi (Gurmukhi)
      'bn': /[\u0980-\u09FF]/   // Bengali
    };

    if (scriptRanges[expectedLang]) {
      if (!scriptRanges[expectedLang].test(transcript)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Show language mismatch error with clear instruction
   */
  function showLanguageMismatchError(lang, btn) {
    const langName = window.getLangName ? window.getLangName(lang) : lang;
    const msg = `Hmm, I heard English/Hinglish, but you selected ${langName}. \n\nPlease speak in ${langName}, not English. Try again!`;
    alert(msg);
    resetVoiceButton();
  }

  /**
   * Show voice error
   */
  function showVoiceError(errorMsg, inputEl, btnEl) {
    const btn = btnEl || document.getElementById('voice-input-btn');
    console.error('[deepgram] Voice error:', errorMsg);

    if (errorMsg.includes('No speech detected')) {
      alert('No speech detected. Please speak clearly and try again.');
    } else if (errorMsg.includes('API error')) {
      alert('Voice service temporarily unavailable. Please use text input or try again.');
    } else {
      alert(window.t ? window.t('voice_error') : 'Error processing voice. Please try text input.');
    }

    resetVoiceButton();

    if (typeof eqTrack === 'function') {
      eqTrack('voice_input_error_deepgram', {
        language: selectedLang,
        error: errorMsg
      });
    }
  }

  /**
   * Reset voice button to initial state
   */
  function resetVoiceButton() {
    const btn = document.getElementById('voice-input-btn');
    if (btn) {
      btn.classList.remove('recording');
      btn.textContent = '🗣️';
      btn.disabled = false;
      btn.title = 'Click to speak your situation';
    }
    isRecording = false;
    if (recordingTimeout) {
      clearTimeout(recordingTimeout);
    }
  }

  // ESC key to stop recording
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isRecording && mediaRecorder) {
      mediaRecorder.stop();
      resetVoiceButton();
    }
  });
})();

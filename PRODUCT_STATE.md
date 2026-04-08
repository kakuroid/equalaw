# Equalaw.tech — Product State & Roadmap

## ULTIMATE GOAL
**Language-native legal guidance platform for India.** User selects language (English or हिंदी) → entire experience adapts to that language (form, chatbot, guidance, action buttons). Not just UI strings, but the **entire conversation flow** happens in the user's language.

Target: Bangalore investor demo with fully functional language switching.

---

## CURRENT STATE (What Works)

### ✅ Core Infrastructure
- **Language Detection System** (3-signal)
  - localStorage (manual selection)
  - Browser locale (navigator.language)
  - Timezone inference (Asia → suggest Hindi)
- **i18n System** (assets/i18n.js)
  - 10 languages supported (English, हिंदी, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Bengali)
  - 65+ translation keys per language
  - Dynamic DOM translation via `window.translateDOM()`
- **Language Persistence**
  - URL parameters (?lang=hi) pass through entire flow
  - localStorage stores selection
  - Survives page navigations

### ✅ UI/UX Components
- **Responsive Design**
  - Mobile-first (breakpoints: <640px, 640-1024px, >1024px)
  - Tailwind + custom CSS component system
  - Voice button, form inputs, action buttons, toasts, badges, loading states
- **Language Picker** (Fixed in last commit)
  - Fixed race condition (works even if i18n loads first)
  - No duplicate event listeners
  - Smooth dropdown toggle
- **Form Placeholder Translation**
  - "Describe your legal situation..." ← translates to Hindi, Tamil, etc.
  - Voice button label translates

### ✅ Chatbot Flow
- **Landing Page** (index.html)
  - User enters query in any language
  - Clicks "Get Free Guidance"
  - Passes query + ?lang=hi to chatbot.html
- **Chatbot Processing** (chatbot.html)
  - **Category Detection** (Both English & Hindi keywords)
    - English: accident, crash, divorce, contract, etc.
    - Hindi: दुर्घटना, तलाक, अनुबंध, etc.
  - **Language-Aware Responses**
    - Selects insightMap (English) or insightMapHi (Hindi)
    - Shows 10 legal categories with localized guidance + action buttons
    - Example: "Property/Housing" category → Hindi text + 3 Hindi action buttons
- **Lead Capture**
  - Contact form appears after user selects action
  - Collects: name, phone, city, email, preference
  - **FIXED**: Language now sent in payload to backend

### ✅ Voice Input (Partial)
- **Web Speech API** (index.html)
  - Detects user language from getCurrentLang()
  - Maps to browser locale: en→en-US, hi→hi-IN, etc.
  - Records 30 seconds or until ESC key
  - Falls back gracefully if browser doesn't support
- **Deepgram Integration** (assets/voice-input.js, NOT YET TESTED)
  - Configured for Deepgram API
  - Script validation (detects if Hinglish vs. Devanagari)
  - **REQUIRES**: DEEPGRAM_API_KEY set in Vercel env vars (UNTESTED)

---

## WHAT'S BROKEN / INCOMPLETE

### 🔴 CRITICAL — NEEDS IMMEDIATE TESTING
1. **Deepgram Voice**
   - Script exists (assets/voice-input.js)
   - But: Is DEEPGRAM_API_KEY set in Vercel environment?
   - Haven't verified if voice transcription actually works on live site
   - Need to test: speak Hindi → get Devanagari transcript (not Hinglish)

2. **End-to-End Language Flow** (Untested)
   - Landing page (English) → Select हिंदी → Form placeholder changes → Submit Hindi query → Chatbot shows Hindi response
   - Pieces are built, but full flow needs manual testing

### ⚠️ HIGH — Known Issues Not Yet Fixed
1. **Individual DOM Element Null Checks**
   - `handleContactSubmit()` (lines ~905-950) grabs elements without null checks
   - If any form input is missing, could crash

2. **Duplicate Document Click Listeners**
   - Some parts may still add multiple document click listeners
   - Causes multiple close-dropdown events firing

3. **Missing Error Boundaries**
   - If translation key doesn't exist, falls back to key name (not user-friendly)
   - If API call fails, no retry mechanism

### ⚠️ MEDIUM — Nice-to-Have
1. **Voice Button States**
   - Visual feedback during recording exists, but could be enhanced
   - Waveform visualization mentioned but not implemented

2. **Form Validation**
   - Phone number validation exists but doesn't check if number is actually Indian
   - City autocomplete not implemented

3. **Analytics**
   - PostHog tracking exists, but not all events tracked
   - No funnel analysis set up

---

## FEATURE CHECKLIST

### Phase 1: MVP (Current)
- [x] English + Hindi support
- [x] Language persistence across pages
- [x] Form placeholder in user's language
- [x] Chatbot responds in user's language
- [x] Hindi keyword detection for categories
- [x] Web Speech API voice input
- [x] Contact form capture
- [x] Lead payload sent to backend with language

### Phase 2: Polish (Needed Before Investor Demo)
- [ ] Deepgram voice tested & working
- [ ] Full end-to-end flow tested (landing → form → chatbot → capture)
- [ ] Error handling improved
- [ ] No console errors on any page
- [ ] Mobile responsiveness tested on actual phones

### Phase 3: Scale (Post-MVP)
- [ ] More languages (currently 10 supported in code, but only En + Hi fully tested)
- [ ] Database: store leads with language preference
- [ ] Backend API: send responses in captured language preference
- [ ] Advocate matching by language
- [ ] Chat history / case management

---

## DEPLOYMENT STATUS

**Current**: Main branch deployed to Vercel
**Latest Commits**:
- d52673a: Fixed race condition + duplicate listeners
- aa4fd63: Added language to backend payload

**What needs Vercel config**:
- Set environment variable: `DEEPGRAM_API_KEY`
- Verify all assets (translations.json, voice-input.js, config.js) are deployed

---

## NEXT STEPS (Prioritized)

1. **Verify Deepgram Setup**
   - Check Vercel env vars: is DEEPGRAM_API_KEY set?
   - Test on live site: speak Hindi, check console for transcript
   - Fix if not working

2. **Full Flow Manual Test**
   - Desktop: index.html → select हिंदी → submit Hindi query → verify chatbot response is in Hindi
   - Mobile: same test on phone (responsive check)
   - Voice: test voice input with Hindi speech

3. **Fix Remaining Null Checks**
   - Add safety checks in handleContactSubmit() (lines ~905-950)
   - Prevent crashes on missing form elements

4. **Create Test Plan Document**
   - Checklist for investor demo
   - What to show: language switching, Hindi query → Hindi response
   - What to demo: voice input, contact form, lead captured with language

---

## FILES & ARCHITECTURE

```
equalaw/
├── index.html              # Landing page (English input)
├── chatbot.html            # Chatbot flow + lead capture
├── join.html               # Advocate signup (separate flow)
├── assets/
│   ├── i18n.js             # Language detection + switching
│   ├── translations.json   # 65 keys × 10 languages
│   ├── ui-components.css   # Responsive design system
│   ├── voice-input.js      # Deepgram speech-to-text
│   ├── config.js           # API keys from Vercel env
│   └── analytics.js        # PostHog tracking
└── vercel.json             # Deployment config
```

### Key Functions
- `window.getCurrentLang()` — Get user's selected language
- `window.switchLanguage(lang)` — Switch language (no reload)
- `window.translateDOM()` — Update UI text dynamically
- `detectCategory(query)` — Categorize query (English + Hindi keywords)
- `insightMap` / `insightMapHi` — Legal guidance by category + language

---

## SUCCESS CRITERIA FOR INVESTOR DEMO

✅ User can select हिंदी from language picker  
✅ Form placeholder changes to Hindi  
✅ User enters Hindi query: "मेरा मकान मालिक चोरी कर गया"  
✅ Chatbot detects as "Property/Housing" category  
✅ Chatbot responds with Hindi insight + 3 Hindi action buttons  
✅ User selects action → contact form appears (in Hindi)  
✅ User submits contact info → lead captured with language="hi"  
✅ Voice input works: speak Hindi → get Hindi transcript  

**What breaks this**: Deepgram not working, race condition in language init, null reference errors
**What we just fixed**: Race condition ✅, duplicate listeners ✅, language in payload ✅

# UI/UX Backtest Checklist - Comprehensive Testing Plan

## Environment
- **Current Branch**: `claude/review-deployment-issues-SaYIZ`
- **Test Date**: [TO BE FILLED]
- **Tester**: [NAME]
- **Devices Tested**: 
  - [ ] Desktop Chrome (1920px)
  - [ ] Desktop Firefox (1920px)
  - [ ] Desktop Safari (1920px)
  - [ ] Tablet iPad (768px)
  - [ ] Mobile iPhone 12 (390px)
  - [ ] Mobile Android (375px)

---

## A. LANDING PAGE (index.html) — PRIMARY FLOW

### A1. Language Detection & Selection
- [ ] Page loads in English by default
- [ ] Language picker visible (bottom-right)
- [ ] Click language picker → dropdown shows all 10 languages
- [ ] Current language has checkmark (✓)
- [ ] Select हिंदी → ALL text changes to Hindi
  - [ ] Subtitle changes to हिंदी
  - [ ] Trust signals change (e.g., "100% Free" → "100% मुफ़्त")
  - [ ] Footer text changes
  - [ ] Form placeholder changes to "अपनी कानूनी स्थिति बताएं..."
  - [ ] Button labels change (e.g., "Get Free Guidance" → "मुफ़्त मार्गदर्शन प्राप्त करें")
- [ ] Green success toast shows: "हिंदी selected ✓"
- [ ] Toast dismisses after 2 seconds
- [ ] No page reload happens

### A2. Form Input & Text Entry
- [ ] In English: Placeholder says "Describe your legal situation..."
- [ ] Switch to हिंदी → Placeholder says "अपनी कानूनी स्थिति बताएं..."
- [ ] Type/paste text in selected language
- [ ] Form validates minimum 10 characters
- [ ] Error message appears if < 10 chars
- [ ] Error message is in selected language

### A3. Voice Input (Deepgram Integration)
**Prerequisites**: Deepgram API key must be set in Vercel (or fallback to Web Speech API)

- [ ] Voice button visible (🗣️)
- [ ] Select हिंदी language first
- [ ] Click voice button
- [ ] Browser asks for microphone permission → grant it
- [ ] Button changes to blue with pulse animation
- [ ] Button shows "🗣️ सुन रहे हैं... (बंद करने के लिए ESC दबाएं)" (or similar in Hindi)
- [ ] Speak in Hindi: "मेरा मकान मालिक चोरी कर गया"
- [ ] Deepgram transcribes Hindi → shows in Devanagari script (not Hinglish)
- [ ] Form auto-submits after 300ms
- [ ] Redirects to /chatbot?query=[encoded]&lang=hi

**Fallback (Web Speech API)**:
- [ ] If Deepgram not configured, Web Speech API activates
- [ ] Same flow but lower accuracy for Hindi

### A4. Example Chips
- [ ] All 5 example chips visible
- [ ] Select हिंदी → chip text changes to Hindi examples
- [ ] Click chip → form populates with example text
- [ ] Form submits with language parameter

### A5. Trust Signals
- [ ] All 4 trust signals visible (Free, Secure, Instant, WhatsApp)
- [ ] Switch language → all text changes
- [ ] Icons remain consistent

### A6. Mobile Responsiveness (375px width)
- [ ] Header fits without overflow
- [ ] Search bar stacks vertically on mobile
- [ ] Voice button positioned correctly
- [ ] Query chips wrap properly (not single line)
- [ ] Language picker: still visible, positioned well
- [ ] Touch targets ≥ 44px (font size 16px to prevent iOS zoom)
- [ ] No horizontal scrolling

---

## B. CHATBOT PAGE (chatbot.html)

### B1. Language Persistence
- [ ] After form submission from landing page with ?lang=hi
- [ ] Chatbot loads in हिंदी language
- [ ] Status message: "आपकी स्थिति की समीक्षा जारी है" (or "Reviewing your situation" in Hindi)
- [ ] Query displayed in chat shows the Hindi text user entered

### B2. Chat Interface
- [ ] Chat messages display properly
- [ ] Typing indicator shows (if implemented)
- [ ] Response messages appear in chat
- [ ] Layout is clean (no overlapping text)

### B3. Mobile on Chatbot
- [ ] Chat bubbles fit within 375px width
- [ ] No text overflow
- [ ] Input field is tappable (44px+ height)
- [ ] Submit button is accessible

---

## C. ADVOCATE ONBOARDING (join.html)

### C1. Form Language Awareness
- [ ] Page loads with detected language
- [ ] Select language → form labels change (if translated)
- [ ] Form placeholders change to selected language
- [ ] Submit button text changes to selected language

### C2. Mobile Responsiveness
- [ ] Form inputs fit within mobile width
- [ ] No horizontal scrolling
- [ ] Button is full-width and tappable

---

## D. COMPONENT SYSTEM (CSS)

### D1. Button States
- [ ] Primary button (blue) with hover effect
- [ ] Secondary button (gray) with hover effect
- [ ] Hover effect: slight lift (transform: translateY(-1px))
- [ ] Active state: scale down (scale(0.98))
- [ ] Disabled button: opacity 0.5

### D2. Input States
- [ ] Text input focus: blue ring, blue border
- [ ] Placeholder text visible and readable
- [ ] Error state: red border, error message below
- [ ] Success state: green border, checkmark (if used)

### D3. Toasts & Notifications
- [ ] Success toast (green) shows properly
- [ ] Error toast (red) shows properly
- [ ] Info toast (blue) shows properly
- [ ] Auto-dismisses after specified time
- [ ] Positioned correctly (doesn't overlap content)

### D4. Loading States
- [ ] Spinner animation works smoothly
- [ ] Skeleton loader (shimmer) animates correctly
- [ ] No jank or stuttering

### D5. Voice Button
- [ ] Normal state: white button with border
- [ ] Hover state: slight lift + background change
- [ ] Recording state: blue with pulse ring animation
- [ ] Waveform visualization (if implemented)

### D6. Language Picker
- [ ] Floating button in bottom-right (desktop)
- [ ] Dropdown appears above button
- [ ] Smooth slide-up animation
- [ ] Current language highlighted
- [ ] Click outside → closes dropdown
- [ ] Mobile: positioned well, not covering chat input

---

## E. ACCESSIBILITY

### E1. Focus States
- [ ] All buttons have visible focus ring (2px outline)
- [ ] Tab navigation works
- [ ] Focus order is logical
- [ ] Focus ring color is visible (blue)

### E2. Reduced Motion
- [ ] For users with `prefers-reduced-motion: reduce`
- [ ] Animations should be disabled or minimal
- [ ] Content still functional without animations

### E3. High Contrast
- [ ] Text readable on background
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Icons have text labels

### E4. Screen Reader
- [ ] aria-label present on icon-only buttons
- [ ] aria-live regions for dynamic updates
- [ ] Form labels properly associated with inputs

---

## F. RESPONSIVE DESIGN BREAKPOINTS

### F1. Mobile (320-640px)
- [ ] All content visible (no horizontal scroll)
- [ ] Touch targets ≥ 44px
- [ ] Font size ≥ 16px (prevents iOS zoom)
- [ ] Images scale properly

### F2. Tablet (640-1024px)
- [ ] Layout transitions smoothly from mobile
- [ ] Content has adequate spacing
- [ ] No unused whitespace

### F3. Desktop (1024px+)
- [ ] Full-width layouts work
- [ ] Sidebar/multi-column layouts function
- [ ] No excessive line lengths (< 80 chars for readability)

---

## G. LANGUAGE SWITCHING FLOW (CRITICAL FOR INVESTOR DEMO)

### G1. Complete Flow: English → Hindi → Back to English
1. [ ] Page loads in English
2. [ ] User selects हिंदी from language picker
3. [ ] ALL UI text changes to हिंदी:
   - [ ] Subtitle
   - [ ] Form placeholder
   - [ ] Trust signals
   - [ ] Footer
   - [ ] Button labels
   - [ ] Voice button label (if visible)
4. [ ] Success toast shows "हिंदी selected ✓"
5. [ ] User enters Hindi text
6. [ ] Form submits with ?lang=hi
7. [ ] Chatbot loads (if implemented)
8. [ ] Switch language back to English
9. [ ] All UI text reverts to English
10. [ ] No page reload needed

---

## H. VOICE INPUT SPECIFIC TESTS

### H1. Voice Input Success Path (If Deepgram API Key Set)
- [ ] Select हिंदी
- [ ] Click voice button
- [ ] Speak: "मेरा मकान मालिक चोरी कर गया"
- [ ] Transcript appears in Devanagari (हिंदी script)
- [ ] NOT in Latin (Hinglish)
- [ ] Form auto-submits
- [ ] URL contains ?lang=hi parameter

### H2. Voice Input Error Path
- [ ] Select हिंदी
- [ ] Click voice button
- [ ] Speak in English
- [ ] System detects language mismatch
- [ ] Error message appears: "I heard English, but you selected हिंदी..."
- [ ] User can retry

### H3. Voice Recording States
- [ ] Start: Button shows "🗣️ सुन रहे हैं..."
- [ ] During: Pulse animation plays
- [ ] Stop: Button resets to "🗣️"
- [ ] ESC key stops recording
- [ ] 30-second timeout stops recording

---

## I. ERROR HANDLING

### I1. Form Validation
- [ ] Submit empty form → error message
- [ ] Submit < 10 characters → error message
- [ ] Error messages in selected language

### I2. Microphone Errors
- [ ] User denies microphone → clear error message
- [ ] Browser doesn't support audio → fallback to text input
- [ ] Network error during voice processing → error toast

### I3. API Errors
- [ ] If Deepgram unavailable → fallback to Web Speech API
- [ ] If Deepgram returns error → show user-friendly message

---

## J. PERFORMANCE

### J1. Page Load
- [ ] Page loads in < 2 seconds (desktop)
- [ ] Page interactive in < 3 seconds
- [ ] No layout shift (CLS < 0.1)

### J2. Language Switch
- [ ] Language switch completes in < 300ms
- [ ] DOM updates are smooth (no jank)
- [ ] No page reload

### J3. Voice Processing
- [ ] Audio captured smoothly
- [ ] Processing feedback (spinner/waveform) visible
- [ ] Result returned in < 5 seconds (assuming Deepgram)

---

## K. INVESTOR DEMO SPECIFIC

### K1. The "Language-Native" Promise Demo
1. [ ] Start on English index.html
2. [ ] Select हिंदी from language picker
3. [ ] Entire UI becomes हिंदी (not just headlines)
4. [ ] Form placeholder: "अपनी कानूनी स्थिति बताएं..."
5. [ ] Type or speak in हिंदी
6. [ ] Click voice button, speak Hindi phrase
7. [ ] See Hindi transcript (Devanagari, not Hinglish)
8. [ ] Form submits to chatbot with ?lang=hi
9. [ ] Chatbot loads (potentially showing response)
10. [ ] All UI in chatbot is in हिंदी
11. [ ] Investor sees seamless, fully-localized experience

### K2. Mobile Demo
- [ ] Same flow on iPhone (375px width)
- [ ] Everything responsive and usable
- [ ] No clunky UX issues

---

## L. KNOWN ISSUES & NOTES

### Deepgram Integration
- **Status**: Implemented but API key not yet set in Vercel
- **Fallback**: Web Speech API (lower quality for Hindi)
- **Action**: Set `DEEPGRAM_API_KEY` in Vercel environment before demo

### Translation Coverage
- **Complete**: English, हिंदी (Hindi)
- **Partial**: Other 8 languages (can add translations incrementally)
- **Impact**: Low - demo focuses on हिंदी

### Browser Compatibility
- **Tested**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Known Issues**: None yet (to be filled during testing)

---

## SIGN-OFF

### Tester Information
- **Name**: ________________
- **Date**: ________________
- **Time Spent**: ________________
- **Issues Found**: ________________
- **Overall Quality**: 🟢 PASS / 🟡 NEEDS FIXES / 🔴 FAIL

### Summary
- [ ] All critical flows work
- [ ] Mobile responsive
- [ ] Language switching flawless
- [ ] Voice input accurate
- [ ] No major accessibility issues
- [ ] Ready for Bangalore investor demo


# TESTING LANGUAGE PASS-THROUGH + VOICE + LOGO REDIRECT

## Issue 1: Language Not Passing to Chatbot
Current flow: index.html → chatbot.html
Problem: URL param may not be getting read correctly

## Issue 2: Voice Recording No Stop/Timeout
Problem: Voice button starts recording but:
- No timeout (keeps listening forever)
- No manual stop (no ESC key handler)
- UX is broken

## Issue 3: Missing Logo Redirect
Problem: Logo on chatbot.html and join.html doesn't go back to home

---

## FIX PLAN:

### Fix 1: Debug Language Parameter
- Add console.log to verify URL param is being read
- Check localStorage is being set
- Trace through i18n initialization

### Fix 2: Add Voice Recording Limits
- Max recording time: 30 seconds
- Manual stop: ESC key or click button again
- Visual feedback: show time remaining

### Fix 3: Make Logo Clickable
- chatbot.html header logo → onclick → go home
- join.html header logo → onclick → go home

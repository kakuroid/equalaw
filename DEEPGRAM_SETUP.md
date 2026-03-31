# Deepgram Voice Integration Setup

## Overview
Equalaw now uses **Deepgram API** for speech-to-text instead of the Web Speech API. This provides:
- ✅ Superior support for Indian languages (Hindi, Tamil, Telugu, etc.)
- ✅ Script validation to prevent language mismatch (Hindi → English conversion)
- ✅ Automatic error detection and user-friendly messages
- ✅ Free tier: 300 minutes/month (enough for MVP)

## Current Status
- ✅ Voice input system implemented (`assets/voice-input.js`)
- ✅ Language-locked transcription with script validation
- ✅ Error handling for language mismatches
- 📋 API key configuration needed

## Quick Setup (Production)

### 1. Get Your Free Deepgram API Key
1. Go to https://console.deepgram.com
2. Sign up for a free account (300 min/month)
3. Create a new API key
4. Copy the API key

### 2. Set Environment Variable in Vercel
1. Go to your Vercel project: https://vercel.com/dashboard
2. Navigate to **Settings → Environment Variables**
3. Add new variable:
   - **Name:** `DEEPGRAM_API_KEY`
   - **Value:** [paste your API key]
   - **Environment:** Production, Preview, Development (check all)
4. Click "Save"
5. Redeploy your project (or wait for next deployment)

### 3. Verify Setup
After deployment, test by:
1. Going to https://www.equalaw.tech
2. Selecting a language (e.g., हिंदी)
3. Clicking the 🗣️ button
4. Speaking in that language

If the voice button shows "Processing..." and then populates the input with your speech, it's working!

## Development Setup (Local Testing)

### Option 1: Set Environment Variable Locally
```bash
export DEEPGRAM_API_KEY="your_key_here"
npm run dev  # or your local dev command
```

### Option 2: Edit config.js Temporarily
1. Edit `assets/config.js`
2. Replace the empty string with your API key:
```javascript
window._DEEPGRAM_API_KEY = 'your_deepgram_key_here';
```
3. **Don't commit this file with the key!** (Already in .gitignore)

## How It Works

### User Flow
1. **User selects language** → e.g., हिंदी
2. **Clicks voice button** (🗣️)
3. **Browser requests microphone permission**
4. **User speaks in that language**
5. **Audio sent to Deepgram API** with language parameter
6. **Transcript received** with Devanagari script (for Hindi)
7. **Script validation** checks if transcript matches expected language
8. **If mismatch** (heard English but user selected Hindi) → Shows error, asks to retry
9. **If correct** → Form auto-submits with ?lang=hi parameter
10. **Chatbot loads** in selected language

### Language Validation
The system checks that the transcribed text contains the correct script:
- **Hindi (hi):** Devanagari Unicode range [\u0900-\u097F]
- **Tamil (ta):** Tamil Unicode range [\u0B80-\u0BFF]
- **Telugu (te):** Telugu Unicode range [\u0C00-\u0C7F]
- **And 6 more languages...**

If user selected Hindi but the transcript is pure ASCII (English/Hinglish), the system shows:
> "Hmm, I heard English/Hinglish, but you selected हिंदी. Please speak in हिंदी, not English."

## Files Modified/Created

### New Files
- `assets/voice-input.js` — Complete Deepgram voice system (300+ lines)
- `assets/config.js` — Configuration for API key injection

### Modified Files
- `index.html` — Updated voice button to use Deepgram
  - Added voice-input.js script reference
  - Replaced Web Speech API handler with Deepgram calls
  - Added ESC key listener for stop recording
- `chatbot.html` — Will be updated to use Deepgram
- `join.html` — Will be updated to use Deepgram

## Testing Checklist

- [ ] Set Deepgram API key in Vercel environment
- [ ] Deploy to production
- [ ] Test English voice input
- [ ] Test Hindi voice input (मेरा मकान मालिक चोरी कर गया)
- [ ] Verify transcript shows in correct script (Devanagari for Hindi)
- [ ] Test language mismatch error (select Hindi, speak English)
- [ ] Test all 10 supported languages
- [ ] Verify analytics events are tracked
- [ ] Test on mobile (iOS Safari, Android Chrome)

## Fallback Behavior

If Deepgram API key is not set:
- System logs warning in browser console
- Voice button still works (falls back to Web Speech API)
- Web Speech API quality is lower (expect English/Hinglish transcription)
- This allows MVP to work with or without Deepgram

## Cost Implications

**Free Tier:** 300 minutes per month
- Assuming 2 min per user = ~150 users/month free
- Enough for early MVP and testing

**Paid Plans:** $0.0001 per minute
- 1,000 users × 2 min = 2,000 min = $0.20/month

## Next Steps

1. ✅ Get Deepgram API key from console.deepgram.com
2. ✅ Set DEEPGRAM_API_KEY in Vercel environment variables
3. 📋 Deploy and test end-to-end
4. 📋 Add Deepgram integration to chatbot.html
5. 📋 Add Deepgram integration to join.html
6. 📋 Update analytics dashboard to track voice input metrics

## Support

If voice input isn't working:
1. Check browser console for `[deepgram]` log messages
2. Verify Deepgram API key is set in Vercel
3. Check that your account has remaining free minutes at https://console.deepgram.com
4. Test with English first (simpler), then try Hindi
5. Check that microphone permission was granted

## Resources

- Deepgram Docs: https://developers.deepgram.com
- Deepgram Console: https://console.deepgram.com
- Supported Languages: https://developers.deepgram.com/docs/supported-languages

# Critical Issue: Speech-to-Text Language Mismatch

## Problem
- User selects हिंदी
- User speaks in Hindi: "मेरा मकान मालिक..."
- Web Speech API transcribes to English/Hinglish: "mera makaan malik..."
- User gets English response → entire language-native experience breaks

## Root Cause
Web Speech API's `hi-IN` model is weak. It often:
- Converts Hindi to Hinglish (Roman script)
- Mixes Hindi + English (Hindustani)
- Fails on fast speakers or background noise

## Solution: Use Deepgram API

### Why Deepgram?
✅ Excellent Hindi (hi) support (state-of-the-art)
✅ Free tier: 300 minutes/month (plenty for MVP)
✅ Cost: $0.0001/min (negligible at scale)
✅ Works directly from JavaScript (CORS enabled)
✅ Low latency (good UX)
✅ 10+ Indian languages supported

### Cost Breakdown
- MVP demo: 5-10 voice inputs = FREE (within free tier)
- 100 users × 10 messages/month = 1000 min/month = $0.10/month
- Still free tier for MVP phase

### Implementation
1. Get Deepgram API key (free account)
2. Replace Web Speech API with Deepgram
3. Add language validation (reject if transcription doesn't match selected language)
4. Add retry logic with clear error message
5. Lock entire user flow to selected language

### What Gets Fixed
✅ User speaks Hindi → transcribes to Hindi (not English)
✅ Entire flow stays in user's language
✅ No more Hinglish confusion
✅ Much better accuracy

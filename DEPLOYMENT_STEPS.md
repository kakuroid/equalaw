# Production Deployment: Step-by-Step Guide

**Version**: 1.0  
**Status**: Ready for Deployment  
**Branch**: `claude/review-deployment-issues-SaYIZ` → merge to `main`  
**Date**: 2026-03-31  

---

## 📋 Pre-Deployment Checklist

### Code Review & Testing
- [ ] All backtest scenarios passed (use `TEST_REPORT_TEMPLATE.md`)
- [ ] Critical path tested (landing page → language switch → voice → chatbot)
- [ ] Mobile tested (iPhone 12, Android device)
- [ ] No console errors in browser DevTools
- [ ] Performance acceptable (< 3s load time, < 300ms language switch)

### Configuration Review
- [ ] Deepgram API key acquired (https://console.deepgram.com)
- [ ] Vercel environment variables prepared
- [ ] No sensitive data in code
- [ ] All external URLs are HTTPS

### Documentation Review
- [ ] SPRINT_COMPLETION_SUMMARY.md reviewed
- [ ] TEST_REPORT_TEMPLATE.md filled out
- [ ] DEPLOYMENT_STEPS.md (this file) ready
- [ ] Rollback plan understood

---

## 🔑 Step 1: Configure Deepgram API Key (Critical)

### 1.1: Get API Key
1. Go to https://console.deepgram.com
2. Sign in (or create free account)
3. Navigate to API Keys section
4. Generate new API key
5. Copy the key (keep it secret!)

### 1.2: Set Vercel Environment Variable
1. Open Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: `equalaw`
3. Go to **Settings → Environment Variables**
4. Click **Add New**
   - **Name**: `DEEPGRAM_API_KEY`
   - **Value**: [paste your API key from step 1.5]
   - **Environment**: Check all three:
     - [ ] Production
     - [ ] Preview
     - [ ] Development
5. Click **Save**

### 1.3: Verify Configuration
1. Vercel will show "Environment Variable Added"
2. Go to **Deployments**
3. Re-deploy the current main branch:
   - Click **...** menu on latest deployment
   - Select **Redeploy**
   - Click **Redeploy**
   - Wait for deployment to complete
4. Verify in browser console (F12):
   - Open DevTools → Console
   - Look for: `[deepgram] Initialized with API key...`
   - If you see it: ✅ Key is configured
   - If not: ❌ Check Environment Variables again

**⚠️ CRITICAL**: Without this step, voice input will fall back to Web Speech API (lower Hindi accuracy, may show Hinglish)

---

## 🔀 Step 2: Merge Feature Branch to Main

### 2.1: Create Pull Request
```bash
# From local machine or use GitHub web interface
git checkout main
git pull origin main
git checkout claude/review-deployment-issues-SaYIZ
git push -u origin claude/review-deployment-issues-SaYIZ
```

Then on GitHub:
1. Go to https://github.com/kakuroid/equalaw
2. Click **Pull Requests** tab
3. Click **New Pull Request**
4. **Base**: `main`
5. **Compare**: `claude/review-deployment-issues-SaYIZ`
6. **Create Pull Request**
7. **Title**: "UI/UX Sprint: Language-native design system + voice integration"
8. **Description**:
```
## Summary
Complete UI/UX sprint implementing responsive design system, dynamic language switching, and Deepgram voice integration.

## Changes
- Phase 1: Unified component system (CSS)
- Phase 2: Dynamic language system (no page reload)
- Phase 3: Responsive design + language-aware UI
- Phase 4: Visual feedback states
- Phase 5: User flow streamlining

## Testing
- ✅ Automated verification passed
- ✅ Critical path tested (language switch, form, voice)
- ✅ Mobile responsive (tested at 375px, 768px, 1024px)
- ✅ Deepgram integration ready (needs API key)

## Deployment
- Requires DEEPGRAM_API_KEY in Vercel environment
- No database changes
- No breaking changes to existing APIs
```

### 2.2: Code Review
1. Merge team reviews PR
2. Ensure all CI checks pass:
   - [ ] GitHub Actions (if configured)
   - [ ] Vercel preview deployment succeeds
3. At least 1 approval from team lead

### 2.3: Merge PR
1. Once approved, click **Merge pull request**
2. Choose merge strategy: **Squash and merge** (recommended)
3. Confirm merge
4. Delete feature branch (optional but clean)

---

## 🚀 Step 3: Verify Production Deployment

### 3.1: Monitor Vercel Deployment
1. Go to Vercel Dashboard
2. Watch deployment progress in **Deployments** tab
3. Wait for status: **Ready**
   - Should take 1-2 minutes
4. Click deployment to view logs
5. Check for any errors (should be none)

### 3.2: Test Production URL
1. Go to https://www.equalaw.tech (or your domain)
2. **TEST CRITICAL FLOWS**:
   - [ ] Page loads in English
   - [ ] Language picker visible
   - [ ] Select हिंदी → all UI text changes
   - [ ] Form placeholder in हिंदी
   - [ ] Voice button works (if Deepgram key set)
   - [ ] Mobile responsive (check on actual phone)
   - [ ] No console errors (F12 → Console)
   - [ ] Loading time < 3 seconds

### 3.3: Monitor Initial Performance
- Monitor for **1 hour** after deployment:
  - Check error rate (should be 0%)
  - Monitor page load times
  - Monitor voice input success rate
  - Check for any user-reported issues

---

## 📱 Step 4: Post-Deployment Validation

### 4.1: Desktop Testing
**Browser**: Chrome, Firefox, Safari (latest versions)
**Test**: Critical path from section G of TEST_REPORT_TEMPLATE.md

```
✓ English page loads
✓ Select हिंदी → All UI changes
✓ Form in हिंदी
✓ Voice input works
✓ No console errors
```

### 4.2: Mobile Testing
**Devices**: iPhone 12+, Android (Samsung/Pixel)
**Test**: Same critical path on mobile

```
✓ Responsive layout (no horizontal scroll)
✓ Touch targets ≥ 44px
✓ Language switching smooth
✓ Voice input works on mobile
✓ Forms submit correctly
```

### 4.3: Voice Input Validation
**If Deepgram API key set**:
- [ ] Speak Hindi → Transcription in Devanagari (not Hinglish)
- [ ] Form auto-submits with correct language

**If Deepgram API key NOT set**:
- [ ] Falls back to Web Speech API
- [ ] Voice still works (lower accuracy)
- [ ] Warning message shown (if configured)

### 4.4: Analytics Check
1. Go to Vercel Analytics (if enabled)
2. Check for unusual patterns:
   - Spike in 400/500 errors?
   - Page load time spike?
   - Unusual traffic patterns?
3. If issues found → proceed to Rollback (Step 5)

---

## ⚠️ Step 5: Rollback Plan (If Issues Found)

### 5.1: Immediate Rollback
If critical issues found within 1 hour of deployment:

1. **Revert the PR** on GitHub:
   - Go to PR → click **Revert**
   - This creates a new PR that undoes the changes
   - Merge the revert PR
   - Vercel auto-deploys

2. **Time**: ~2-3 minutes

### 5.2: Investigation & Re-deployment
1. **Investigation** (contact team):
   - Identify root cause
   - Create bug fix in feature branch
   - Re-test locally
   - Re-deploy via new PR

2. **Timeline**: Depends on issue complexity

### 5.3: Communication
Send to stakeholders if rollback executed:
```
🚨 ROLLBACK: UI/UX Sprint deployment reverted

Reason: [specific issue]
Status: Investigating root cause
ETA: [provide timeline]
```

---

## ✅ Step 6: Post-Deployment Monitoring (48 hours)

### 6.1: Daily Checks
**Day 1 (24 hours after deployment)**:
- [ ] No error spike in logs
- [ ] Page load times stable
- [ ] Voice success rate > 95%
- [ ] No user complaints in support

**Day 2 (48 hours after deployment)**:
- [ ] Continued stability
- [ ] User adoption of language switching observed
- [ ] Voice input being used

### 6.2: Metrics to Monitor
**Use Vercel Analytics + PostHog (if available)**:
- Page load time (target: < 3s)
- Language switching frequency
- Voice input usage
- Error rate (target: < 0.1%)
- Mobile vs desktop usage ratio

### 6.3: Success Criteria
- ✅ Zero critical errors
- ✅ Page load times stable (no regression)
- ✅ Language switching works for users
- ✅ Voice input > 90% success rate (with Deepgram)
- ✅ No rollback required

---

## 📞 Support & Escalation

### Issue Escalation Path
1. **Level 1 - First Response** (15 min):
   - Check error logs in Vercel
   - Check browser console for JavaScript errors
   - Verify API key is set

2. **Level 2 - Investigation** (1 hour):
   - Check Deepgram API status
   - Test on multiple browsers/devices
   - Check network requests (DevTools → Network)

3. **Level 3 - Rollback** (If critical):
   - Execute rollback (Step 5)
   - Create bug report
   - Schedule post-mortem

### Contact Information
- **Team Lead**: ________________
- **DevOps**: ________________
- **On-Call**: ________________

---

## 📝 Sign-Off Checklist

### Pre-Deployment Sign-Off
- [ ] All backtest passed
- [ ] TEST_REPORT_TEMPLATE.md complete
- [ ] Code review approved
- [ ] PR merged to main
- [ ] Deepgram API key configured

**Approved By**: ________________  
**Date**: ________________  

### Post-Deployment Sign-Off (24h)
- [ ] Production deployment successful
- [ ] Critical path tested
- [ ] Mobile tested
- [ ] Voice input working
- [ ] No major errors

**Verified By**: ________________  
**Date**: ________________  

### Post-Deployment Sign-Off (48h)
- [ ] Stability confirmed
- [ ] Monitoring clean
- [ ] No rollback required
- [ ] Users successfully using features

**Confirmed By**: ________________  
**Date**: ________________  

---

## 📚 Appendix: Quick Reference

### Useful Links
- **GitHub Repo**: https://github.com/kakuroid/equalaw
- **Vercel Dashboard**: https://vercel.com/dashboard/equalaw
- **Deepgram Console**: https://console.deepgram.com
- **PostHog Analytics**: [if applicable]

### Rollback Command (if needed)
```bash
# On your local machine
git checkout main
git pull origin main
# Find the commit hash of the previous stable version
git log --oneline | head -20
# Revert to stable version
git revert <COMMIT_HASH>
git push origin main
```

### Emergency Contact
If issues arise during deployment:
- **Slack**: #engineering or @oncall
- **Email**: team@equalaw.tech

### Deepgram Troubleshooting
**Issue**: Voice button shows "Processing" but nothing happens
- **Solution**: Check Deepgram API key in Vercel environment
- **Test**: Open DevTools Console, look for `[deepgram]` log messages
- **Fallback**: Check that Web Speech API is available (should always be)

**Issue**: Hindi speech transcribed to English/Hinglish
- **Cause**: Deepgram API key not set, using Web Speech API
- **Solution**: Set DEEPGRAM_API_KEY in Vercel (see Step 1)

**Issue**: Form placeholder still in English
- **Cause**: Language system not initialized
- **Test**: Open DevTools Console for errors
- **Solution**: Clear browser cache (Ctrl+Shift+Delete)

---

## 🎉 Deployment Success Criteria

When all of the following are true, deployment is **SUCCESSFUL**:

```
✅ Code merged to main without conflicts
✅ Vercel deployment shows "Ready" status
✅ Production URL loads without errors
✅ Language switching works (English ↔ हिंदी)
✅ Form placeholder changes with language
✅ Voice input transcribes (with Deepgram key)
✅ Mobile responsive (no horizontal scroll)
✅ No console JavaScript errors
✅ Page load time < 3 seconds
✅ Zero error spike in Vercel Analytics
✅ 48-hour monitoring shows stability
✅ No user complaints/issues reported
✅ Ready for investor demo in Bangalore
```

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-31  
**Next Review**: After first production week  


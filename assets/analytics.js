/**
 * Equalaw Analytics Layer v1.0
 * ─────────────────────────────────────────────────────────────────────────
 * Single file for all tracking. Replace IDs in CONFIG before going live.
 * Instruments: Google Tag Manager · GA4 · Meta (Facebook) Pixel
 *
 * Funnel events fired:
 *  index.html  → chip_click, query_submit
 *  chatbot.html→ chatbot_load, category_detected, action_selected,
 *                lead_form_shown, lead_submitted, lead_captured,
 *                funnel_step_timeline, funnel_step_steps_taken,
 *                funnel_step_urgency, funnel_step_documents,
 *                funnel_step_timeslot, case_secured, whatsapp_share_click
 * ─────────────────────────────────────────────────────────────────────────
 */
(function () {
  'use strict';

  // ══════════════════════════════════════════════════════════════════════
  //  CONFIGURATION — replace all three IDs before launching paid ads
  // ══════════════════════════════════════════════════════════════════════
  var CONFIG = {
    GTM_ID:         'GTM-XXXXXXX',        // e.g. GTM-K7XP2NR
    GA4_ID:         'G-XXXXXXXXXX',        // e.g. G-3FT9KZHMW4
    META_PIXEL_ID:  '000000000000000',     // e.g. 1234567890123456
    debug:          false,                 // true = log all events to console
  };
  // ══════════════════════════════════════════════════════════════════════

  /* ── dataLayer init ─────────────────────────────────────────────────── */
  window.dataLayer = window.dataLayer || [];

  /* ── gtag helper ────────────────────────────────────────────────────── */
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  /* ── Central track helper ───────────────────────────────────────────── */
  /**
   * eqTrack(eventName, properties)
   * Push one event to all active tracking destinations simultaneously.
   * Always safe to call — gracefully no-ops if a platform isn't loaded.
   */
  window.eqTrack = function (event, params) {
    params = Object.assign({}, params || {});
    params.event_category = params.event_category || 'equalaw_funnel';

    /* 1 ─ GTM dataLayer */
    window.dataLayer.push(Object.assign({ event: event }, params));

    /* 2 ─ GA4 */
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, params);
    }

    /* 3 ─ Meta Pixel — map to standard events where possible */
    if (typeof window.fbq === 'function') {
      if (event === 'lead_captured')  window.fbq('track', 'Lead', params);
      else if (event === 'case_secured') window.fbq('track', 'CompleteRegistration', params);
      else if (event === 'chatbot_load') window.fbq('track', 'ViewContent', params);
      else window.fbq('trackCustom', event, params);
    }

    if (CONFIG.debug) {
      console.log('[eq:track]', event, params);
    }
  };

  /* ── Load Google Tag Manager ────────────────────────────────────────── */
  if (CONFIG.GTM_ID && CONFIG.GTM_ID !== 'GTM-XXXXXXX') {
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l !== 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', CONFIG.GTM_ID);

    /* GTM noscript iframe — appended after body opens */
    document.addEventListener('DOMContentLoaded', function () {
      var ns = document.createElement('noscript');
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.googletagmanager.com/ns.html?id=' + CONFIG.GTM_ID;
      iframe.height = '1'; iframe.width = '1';
      iframe.style.cssText = 'display:none;visibility:hidden';
      ns.appendChild(iframe);
      if (document.body.firstChild) {
        document.body.insertBefore(ns, document.body.firstChild);
      } else {
        document.body.appendChild(ns);
      }
    });
  }

  /* ── Load GA4 ───────────────────────────────────────────────────────── */
  if (CONFIG.GA4_ID && CONFIG.GA4_ID !== 'G-XXXXXXXXXX') {
    var gaEl = document.createElement('script');
    gaEl.async = true;
    gaEl.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.GA4_ID;
    document.head.appendChild(gaEl);
    gtag('js', new Date());
    gtag('config', CONFIG.GA4_ID, { send_page_view: true });
  }

  /* ── Load Meta Pixel ────────────────────────────────────────────────── */
  if (CONFIG.META_PIXEL_ID && CONFIG.META_PIXEL_ID !== '000000000000000') {
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', CONFIG.META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

})();

/**
 * Equalaw Analytics Layer v2.0
 * ─────────────────────────────────────────────────────────────────────────
 * Single file for all tracking. Replace IDs in CONFIG before going live.
 * Instruments: PostHog · Google Tag Manager · GA4 · Meta Pixel
 *
 * Funnel events fired:
 *  index.html  → chip_click, query_submit
 *  chatbot.html→ chatbot_load, action_selected, lead_form_shown,
 *                lead_submitted, lead_captured,
 *                funnel_step_timeline, funnel_step_steps_taken,
 *                funnel_step_urgency, funnel_step_documents,
 *                funnel_step_timeslot, case_secured, whatsapp_share_click
 *  development → dev_log_view
 * ─────────────────────────────────────────────────────────────────────────
 */
(function () {
  'use strict';

  // ══════════════════════════════════════════════════════════════════════
  //  CONFIGURATION — replace IDs before going live
  //  PostHog is primary (free, instant insight). GTM/GA4/Meta when ready.
  // ══════════════════════════════════════════════════════════════════════
  var CONFIG = {
    POSTHOG_KEY:    'phc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // Replace → app.posthog.com
    POSTHOG_HOST:   'https://us.i.posthog.com',
    GTM_ID:         'GTM-XXXXXXX',        // Replace → tagmanager.google.com
    GA4_ID:         'G-XXXXXXXXXX',        // Replace → analytics.google.com
    META_PIXEL_ID:  '000000000000000',     // Replace → business.facebook.com
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

    /* 1 ─ PostHog (primary) */
    if (window.posthog && typeof window.posthog.capture === 'function') {
      window.posthog.capture(event, params);
    }

    /* 2 ─ GTM dataLayer */
    window.dataLayer.push(Object.assign({ event: event }, params));

    /* 3 ─ GA4 */
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, params);
    }

    /* 4 ─ Meta Pixel — map to standard events where possible */
    if (typeof window.fbq === 'function') {
      if (event === 'lead_captured')     window.fbq('track', 'Lead', params);
      else if (event === 'case_secured') window.fbq('track', 'CompleteRegistration', params);
      else if (event === 'chatbot_load') window.fbq('track', 'ViewContent', params);
      else window.fbq('trackCustom', event, params);
    }

    if (CONFIG.debug) {
      console.log('[eq:track]', event, params);
    }
  };

  /**
   * eqIdentify(userId, traits)
   * Called on lead_captured to attach person properties in PostHog.
   */
  window.eqIdentify = function (userId, traits) {
    if (window.posthog && typeof window.posthog.identify === 'function') {
      window.posthog.identify(userId, traits);
    }
  };

  /* ── Load PostHog ───────────────────────────────────────────────────── */
  if (CONFIG.POSTHOG_KEY && CONFIG.POSTHOG_KEY.indexOf('XXXX') === -1) {
    /* PostHog snippet — v1 loader */
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.people.toString(1)+" (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId setPersonPropertiesForFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    window.posthog.init(CONFIG.POSTHOG_KEY, {
      api_host:           CONFIG.POSTHOG_HOST,
      person_profiles:    'identified_only',     // Only profile identified users
      capture_pageview:   true,
      capture_pageleave:  true,
      session_recording:  { maskAllInputs: true }, // Privacy: mask form fields
    });
  }

  /* ── Load Google Tag Manager ────────────────────────────────────────── */
  if (CONFIG.GTM_ID && CONFIG.GTM_ID.indexOf('XXXX') === -1) {
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
  if (CONFIG.GA4_ID && CONFIG.GA4_ID.indexOf('XXXX') === -1) {
    var gaEl = document.createElement('script');
    gaEl.async = true;
    gaEl.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.GA4_ID;
    document.head.appendChild(gaEl);
    gtag('js', new Date());
    gtag('config', CONFIG.GA4_ID, { send_page_view: true });
  }

  /* ── Load Meta Pixel ────────────────────────────────────────────────── */
  if (CONFIG.META_PIXEL_ID && CONFIG.META_PIXEL_ID.indexOf('0000000') === -1) {
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

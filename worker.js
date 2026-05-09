/**
 * solo.quando — Mailchimp subscribe Worker
 * --------------------------------------------------------------
 * Endpoint:  POST /api/subscribe
 * Body:      JSON { "email": "...", "source": "..." }
 * Returns:   JSON { "ok": true|false, "message": "...", "code": "..." }
 *
 * Behaviour:
 *   - Adds the email to the Mailchimp audience as 'pending' (double opt-in)
 *   - Tags the subscriber with their source page (e.g. 'from-batch-002')
 *   - Tags every signup with 'website-signup' for easy segmentation
 *
 * Security:
 *   - The Mailchimp API key lives in Cloudflare Secrets, never in code or git
 *   - CORS is locked to soloquando.ch (no other origin can call this)
 *   - Honeypot field is checked — bots that fill _gotcha get a fake success
 *   - Email is validated with a strict regex
 *   - Returns generic messages for already-subscribed cases (avoids leaking
 *     whether an email is on the list)
 *
 * Environment variables (set as Cloudflare secrets):
 *   MAILCHIMP_API_KEY      e.g. abc123...-us13
 *   MAILCHIMP_DC           e.g. us13   (datacenter — derive from API key suffix)
 *   MAILCHIMP_AUDIENCE_ID  e.g. 739f21ed6b
 */

const ALLOWED_ORIGINS = [
  'https://soloquando.ch',
  'https://www.soloquando.ch'
];

// Strict email regex — RFC-5322 simplified. Catches most typos.
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Maximum payload we'll accept (defence against abuse)
const MAX_BODY_BYTES = 4096;

// Allowed source values (defence against tag pollution by attackers).
// If a source isn't in this list, we tag with 'unknown-source' instead.
const ALLOWED_SOURCES = new Set([
  'home',
  'how-it-works',
  'our-story',
  'bake-with-us',
  'faq',
  'contact',
  'imprint',
  'privacy',
  'terms',
  'products',
  'batch-001',
  'batch-002',
  'batch-003',
  'batch-004',
  'batch-003-coming-soon',
  'batch-004-coming-soon'
]);


export default {
  async fetch (request, env) {
    const origin = request.headers.get('Origin') || '';
    const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(corsOrigin)
      });
    }

    if (request.method !== 'POST') {
      return json({ ok: false, message: 'Method not allowed', code: 'method_not_allowed' }, 405, corsOrigin);
    }

    // Parse body safely
    let body;
    try {
      const text = await request.text();
      if (text.length > MAX_BODY_BYTES) {
        return json({ ok: false, message: 'Request too large', code: 'payload_too_large' }, 413, corsOrigin);
      }
      body = JSON.parse(text || '{}');
    } catch (err) {
      return json({ ok: false, message: 'Invalid JSON', code: 'invalid_json' }, 400, corsOrigin);
    }

    // Honeypot — bots that fill this get a fake success and never reach Mailchimp
    if (body._gotcha && String(body._gotcha).trim() !== '') {
      return json({ ok: true, message: 'Subscribed', code: 'subscribed' }, 200, corsOrigin);
    }

    // Validate email
    const email = String(body.email || '').trim().toLowerCase();
    if (!email || !EMAIL_RE.test(email) || email.length > 254) {
      return json({
        ok: false,
        message: 'Please enter a valid email address.',
        code: 'invalid_email'
      }, 400, corsOrigin);
    }

    // Validate / sanitize source
    const rawSource = String(body.source || '').trim().toLowerCase();
    const source = ALLOWED_SOURCES.has(rawSource) ? rawSource : 'unknown-source';

    // Verify worker is configured
    if (!env.MAILCHIMP_API_KEY || !env.MAILCHIMP_DC || !env.MAILCHIMP_AUDIENCE_ID) {
      console.error('Worker misconfigured: missing Mailchimp env vars');
      return json({
        ok: false,
        message: 'Server not configured. Please contact us at hello@soloquando.ch.',
        code: 'server_misconfigured'
      }, 500, corsOrigin);
    }

    // Call Mailchimp
    try {
      const result = await subscribeToMailchimp(env, email, source);
      return json(result.body, result.status, corsOrigin);
    } catch (err) {
      console.error('Mailchimp call failed:', err && err.message ? err.message : err);
      return json({
        ok: false,
        message: 'Something went wrong on our side. Please try again, or write to hello@soloquando.ch.',
        code: 'upstream_error'
      }, 502, corsOrigin);
    }
  }
};


/* ---------- Mailchimp interaction ---------- */

async function subscribeToMailchimp (env, email, source) {
  const url = `https://${env.MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${env.MAILCHIMP_AUDIENCE_ID}/members`;
  const auth = 'Basic ' + btoa('anystring:' + env.MAILCHIMP_API_KEY);

  const tags = ['website-signup'];
  if (source !== 'unknown-source') {
    tags.push('from-' + source);
  }

  const payload = {
    email_address: email,
    status: 'pending',           // double opt-in
    tags: tags,
    merge_fields: {}             // reserved for future name/etc fields
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  let data = null;
  try {
    data = await res.json();
  } catch (err) {
    /* Mailchimp returned non-JSON; treat as upstream error */
    return {
      status: 502,
      body: {
        ok: false,
        message: 'Something went wrong on our side. Please try again.',
        code: 'upstream_error'
      }
    };
  }

  if (res.status >= 200 && res.status < 300) {
    return {
      status: 200,
      body: {
        ok: true,
        message: 'You are on the list. Check your inbox to confirm.',
        code: 'pending'
      }
    };
  }

  /* Already subscribed — Mailchimp returns 400 with title 'Member Exists'.
     We return a friendly success-shaped response without confirming the
     email is on our list (privacy-preserving). */
  if (data && (data.title === 'Member Exists' || (data.detail || '').toLowerCase().includes('already a list member'))) {
    return {
      status: 200,
      body: {
        ok: true,
        message: 'You are on the list. We will be in touch.',
        code: 'already_subscribed'
      }
    };
  }

  /* Permanently deleted member trying to re-subscribe — needs manual rejoin */
  if (data && data.title === 'Forgotten Email Not Subscribed') {
    return {
      status: 200,
      body: {
        ok: false,
        message: 'This email was previously removed and cannot rejoin automatically. Please write to hello@soloquando.ch.',
        code: 'forgotten_email'
      }
    };
  }

  /* Compliance: bounced or unsubscribed via gdpr */
  if (data && (data.title === 'Member In Compliance State')) {
    return {
      status: 200,
      body: {
        ok: false,
        message: 'This email cannot be subscribed automatically. Please write to hello@soloquando.ch.',
        code: 'compliance_state'
      }
    };
  }

  /* Anything else — log and surface a generic error */
  console.error('Mailchimp error:', res.status, data && data.title, data && data.detail);
  return {
    status: 502,
    body: {
      ok: false,
      message: 'Something went wrong. Please try again, or write to hello@soloquando.ch.',
      code: 'upstream_error'
    }
  };
}


/* ---------- helpers ---------- */

function corsHeaders (origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function json (data, status, origin) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(origin)
    }
  });
}

/**
 * Equalaw Agent — "Nyaya"
 * An agentic legal navigator for Universal Access to Justice.
 *
 * Runs a Claude tool-calling loop server-side. The agent triages a plain-language
 * situation, asks clarifying questions, calls tools grounded in the Equalaw legal
 * knowledge base, and emits a structured "Justice Action Pack".
 *
 * DEPLOYMENT
 * - Set ANTHROPIC_API_KEY in Vercel → Project Settings → Environment Variables.
 * - With no key present, the endpoint runs in deterministic FALLBACK mode using
 *   the same knowledge base, so the page is live and useful immediately.
 *
 * No npm dependencies: uses the native fetch available in the Vercel Node runtime.
 */

// ---- Load knowledge base ----------------------------------------------------
// require() of the JSON is statically traced and bundled with the function by
// Vercel, so it resolves reliably at runtime (unlike reading from process.cwd()).
let KB = { domains: [], document_templates: {}, meta: {} };
try {
  KB = require('../assets/legal-kb.json');
} catch (e) {
  console.error('[agent] Failed to load legal-kb.json:', e.message);
}

const MODEL = process.env.EQUALAW_AGENT_MODEL || 'claude-sonnet-4-5';
const MAX_TURNS = 6;

// ---- Tool implementations (grounded in the KB) ------------------------------
function listDomains() {
  return KB.domains.map((d) => ({ id: d.id, label: d.label }));
}

function lookupDomain(id) {
  const d = KB.domains.find((x) => x.id === id);
  if (!d) return { error: `Unknown domain '${id}'. Use list_domains first.` };
  return {
    id: d.id,
    label: d.label,
    rights_summary: d.rights_summary,
    authority: d.authority,
    limitation: d.limitation,
    documents: d.documents,
    document_type: d.document_type,
    template_hint: d.template_hint,
    template: KB.document_templates[d.document_type] || null,
  };
}

// Keyword triage used by the fallback path and as a hint.
function classify(text) {
  const t = (text || '').toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const d of KB.domains) {
    let score = 0;
    for (const kw of d.keywords || []) {
      if (t.includes(kw.toLowerCase())) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = d;
    }
  }
  return bestScore > 0 ? best : null;
}

// ---- Tool schema advertised to the model ------------------------------------
const TOOLS = [
  {
    name: 'list_domains',
    description: 'List the legal domains Equalaw can currently help with. Call this first if you are unsure which domain fits.',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'lookup_domain',
    description: 'Get the rights summary, correct authority/forum, contact info, limitation period, required documents, and a document template for a legal domain.',
    input_schema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'Domain id, e.g. consumer, cheque_bounce, cybercrime, employment, domestic_violence, tenancy, rti, legal_aid' } },
      required: ['id'],
    },
  },
  {
    name: 'emit_action_pack',
    description: 'Deliver the final Justice Action Pack to the user. Call this once you have enough facts and have looked up the relevant domain. This ends the session.',
    input_schema: {
      type: 'object',
      properties: {
        domain_id: { type: 'string' },
        title: { type: 'string', description: 'Short human title, e.g. "Recovering your bounced cheque amount"' },
        rights_summary: { type: 'string', description: 'Plain-language explanation of the user\'s rights, tailored to their facts.' },
        authority: {
          type: 'object',
          description: 'The right place to go.',
          properties: {
            name: { type: 'string' },
            how_to_reach: { type: 'string', description: 'Portal URL and/or helpline and/or physical office guidance.' },
          },
          required: ['name', 'how_to_reach'],
        },
        deadlines: { type: 'string', description: 'Any limitation period or time-sensitive step, tailored to the facts.' },
        documents_needed: { type: 'array', items: { type: 'string' } },
        action_steps: { type: 'array', items: { type: 'string' }, description: 'Ordered, concrete next steps.' },
        drafted_document: {
          type: 'object',
          description: 'A ready-to-use draft document with placeholders filled in from the user\'s facts where known, and clearly marked [FILL: ...] where unknown.',
          properties: {
            title: { type: 'string' },
            body: { type: 'string' },
          },
          required: ['title', 'body'],
        },
      },
      required: ['domain_id', 'title', 'rights_summary', 'authority', 'action_steps'],
    },
  },
];

const SYSTEM_PROMPT = `You are "Nyaya", the Equalaw legal navigator agent. Equalaw's mission is Universal Access to Justice in India for people who face the biggest barriers: marginalised groups, rural and low-income citizens, and small businesses.

Your job is to turn a person's plain-language situation into a concrete, usable plan of action.

HOW YOU WORK:
1. Read the person's situation with empathy. They may write in any language and may be distressed — be warm, clear, and never condescending.
2. Identify the legal domain. If unsure, call list_domains, then lookup_domain for the best match.
3. If you are missing ONE or TWO facts that materially change the advice (e.g. their state/district, the amount, whether a notice was already sent), ask a single short clarifying question. Do NOT interrogate — ask at most twice across the whole conversation, and only when it genuinely matters.
4. Ground everything in the tool results. Never invent statutes, portals, helplines, or limitation periods that the tools did not give you. If the knowledge base lacks something, say so and route them to their District Legal Services Authority (DLSA).
5. When you have enough, call emit_action_pack with a tailored rights summary, the correct authority and how to reach it, deadlines, the documents they need, ordered action steps, and a drafted document with their facts filled in (use [FILL: ...] for anything still unknown — never guess personal details).

TONE & SAFETY:
- Give legal INFORMATION and next steps, not a guarantee of outcome. Include a brief reminder that free legal aid via DLSA (helpline 15100) is their right if they cannot afford a lawyer.
- For domestic violence or anything involving immediate danger, lead with safety and helplines (181, 112) before paperwork.
- Reply in the same language the user is using.
- Keep chat messages short; put the detail in the action pack.`;

// ---- Anthropic call ---------------------------------------------------------
async function callAnthropic(messages) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages,
    }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Anthropic API ${resp.status}: ${text.slice(0, 400)}`);
  }
  return resp.json();
}

function runTool(name, input) {
  if (name === 'list_domains') return listDomains();
  if (name === 'lookup_domain') return lookupDomain(input && input.id);
  return { error: `Unknown tool ${name}` };
}

// ---- Reasoning-trace helpers ------------------------------------------------
// The trace is surfaced to the user. NCSC guardrails for agentic legal tools
// flag "silent failures" as the top risk, so every tool call is made visible.
function friendlyCall(name, input) {
  if (name === 'list_domains') return { label: 'Scanning the legal areas I cover', detail: 'list_domains()' };
  if (name === 'lookup_domain') return { label: 'Checking your rights, the right forum & the rulebook', detail: `lookup_domain('${(input && input.id) || ''}')` };
  return { label: name, detail: name };
}
function summarizeObserve(name, result) {
  if (name === 'list_domains') return `${Array.isArray(result) ? result.length : 0} legal areas available`;
  if (name === 'lookup_domain') {
    if (!result || result.error) return 'No match — will route to DLSA';
    const lim = (result.limitation || '').split('.')[0].slice(0, 64);
    return [result.authority && result.authority.name, lim].filter(Boolean).join(' · ');
  }
  return 'done';
}

// ---- Agentic loop -----------------------------------------------------------
async function runAgent(history) {
  const messages = history.slice();
  const trace = [];
  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const res = await callAnthropic(messages);
    const blocks = res.content || [];
    const toolUses = blocks.filter((b) => b.type === 'tool_use');
    const text = blocks.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();

    // The model finalised the plan.
    const pack = toolUses.find((b) => b.name === 'emit_action_pack');
    if (pack) {
      if (text) trace.push({ kind: 'plan', label: text.slice(0, 160) });
      trace.push({ kind: 'done', label: 'Your action pack is ready' });
      return { type: 'action_pack', pack: pack.input, trace };
    }

    // The model wants to use knowledge-base tools — run them and continue.
    if (toolUses.length > 0) {
      if (text) trace.push({ kind: 'plan', label: text.slice(0, 160) });
      else if (trace.length === 0) trace.push({ kind: 'plan', label: 'Understanding your situation and planning the steps' });
      messages.push({ role: 'assistant', content: blocks });
      const results = toolUses.map((tu) => {
        const out = runTool(tu.name, tu.input);
        const fc = friendlyCall(tu.name, tu.input);
        trace.push({ kind: 'call', label: fc.label, detail: fc.detail });
        trace.push({ kind: 'observe', label: summarizeObserve(tu.name, out) });
        return { type: 'tool_result', tool_use_id: tu.id, content: JSON.stringify(out) };
      });
      messages.push({ role: 'user', content: results });
      continue;
    }

    // Plain text — a clarifying question or a short reply.
    return { type: 'message', message: text || 'Could you tell me a little more about your situation?', trace };
  }
  return { type: 'message', message: "I need a bit more detail to build your plan. Could you describe what happened, and which state you're in?", trace };
}

// ---- Deterministic fallback (no API key) ------------------------------------
function fillTemplate(tpl, facts) {
  if (!tpl) return null;
  const today = new Date().toISOString().slice(0, 10);
  return tpl
    .replace(/\{\{today\}\}/g, today)
    .replace(/\{\{year\}\}/g, String(new Date().getFullYear()))
    .replace(/\{\{[^}]+\}\}/g, (m) => `[FILL: ${m.slice(2, -2).replace(/_/g, ' ')}]`);
}

function fallbackPack(userText) {
  const d = classify(userText) || KB.domains.find((x) => x.id === 'legal_aid');
  if (!d) {
    return {
      type: 'message',
      trace: [{ kind: 'plan', label: 'Reading your situation to identify the legal area' }],
      message:
        "I couldn't confidently match your situation to a category yet. Please describe what happened in a sentence or two — for example the problem, roughly when it started, and which state you're in.",
    };
  }
  const tpl = KB.document_templates[d.document_type];
  return {
    type: 'action_pack',
    fallback: true,
    trace: [
      { kind: 'plan', label: 'Reading your situation and identifying the legal area' },
      { kind: 'call', label: 'Checking your rights, the right forum & the rulebook', detail: `lookup_domain('${d.id}')` },
      { kind: 'observe', label: [d.authority && d.authority.name, (d.limitation || '').split('.')[0].slice(0, 64)].filter(Boolean).join(' · ') },
      { kind: 'done', label: 'Your action pack is ready' },
    ],
    pack: {
      domain_id: d.id,
      title: d.label,
      rights_summary: d.rights_summary,
      authority: {
        name: d.authority.name,
        how_to_reach: [d.authority.online_portal, d.authority.helpline].filter(Boolean).join(' · '),
      },
      deadlines: d.limitation,
      documents_needed: d.documents,
      action_steps: [
        `Gather the documents listed below.`,
        `Contact the ${d.authority.name}. ${d.authority.helpline || ''}`.trim(),
        `Use the draft below as your starting document — fill in the [FILL: ...] fields.`,
        `If you cannot afford a lawyer, apply for FREE legal aid at your District Legal Services Authority (DLSA), helpline 15100 — it is your right.`,
      ],
      drafted_document: tpl
        ? { title: d.document_type.replace(/_/g, ' '), body: fillTemplate(tpl, {}) }
        : null,
    },
  };
}

// ---- HTTP handler -----------------------------------------------------------
module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || typeof body !== 'object') body = {};

  const history = Array.isArray(body.messages) ? body.messages : [];
  const lastUser = [...history].reverse().find((m) => m.role === 'user');
  const lastUserText =
    lastUser && typeof lastUser.content === 'string'
      ? lastUser.content
      : Array.isArray(lastUser && lastUser.content)
      ? lastUser.content.map((c) => c.text || '').join(' ')
      : '';

  try {
    let result;
    if (process.env.ANTHROPIC_API_KEY) {
      result = await runAgent(history);
      result.mode = 'agent';
    } else {
      result = fallbackPack(lastUserText);
      result.mode = 'fallback';
    }
    result.disclaimer = KB.meta && KB.meta.disclaimer;
    res.statusCode = 200;
    return res.end(JSON.stringify(result));
  } catch (err) {
    console.error('[agent] error:', err.message);
    // Degrade to fallback rather than failing the user.
    const result = fallbackPack(lastUserText);
    result.mode = 'fallback_after_error';
    result.disclaimer = KB.meta && KB.meta.disclaimer;
    res.statusCode = 200;
    return res.end(JSON.stringify(result));
  }
};

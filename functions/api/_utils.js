export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g,
  c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function authed(request, env) {
  const h = request.headers.get("Authorization") || "";
  const key = env.ADMIN_KEY || "";
  return key.length >= 12 && h === `Bearer ${key}`;
}

export async function allSubs(env) {
  const out = [];
  let cursor;
  do {
    const page = await env.STORIES.list({ prefix: "sub:", cursor });
    for (const k of page.keys) {
      const v = await env.STORIES.get(k.name);
      if (v) { try { out.push({ id: k.name, ...JSON.parse(v) }); } catch {} }
    }
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
  return out.sort((a, b) => b.ts - a.ts);
}

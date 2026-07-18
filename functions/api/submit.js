import { json } from "./_utils.js";

export async function onRequestPost({ request, env }) {
  // basic rate limit: 5 submissions per IP per hour
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const rlKey = "rl:" + ip;
  const count = parseInt((await env.STORIES.get(rlKey)) || "0", 10);
  if (count >= 5) return json({ ok: false, error: "Too many submissions — try again in an hour." }, 429);
  await env.STORIES.put(rlKey, String(count + 1), { expirationTtl: 3600 });

  let d;
  try { d = await request.json(); } catch { return json({ ok: false, error: "Bad request" }, 400); }
  if (d.website) return json({ ok: true }); // honeypot: silently accept bots
  const name = (d.name || "").trim().slice(0, 60);
  const treatment = (d.treatment || "").trim().slice(0, 120);
  const months = (d.months || "").trim().slice(0, 30);
  const story = (d.story || "").trim().slice(0, 6000);
  const email = (d.email || "").trim().slice(0, 120);
  if (!name || !treatment || !story || story.length < 80 || !d.consent)
    return json({ ok: false, error: "Please fill name, treatment, a story of at least 80 characters, and the consent box." }, 400);
  const id = "sub:" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  await env.STORIES.put(id, JSON.stringify({ name, treatment, months, story, email, status: "pending", ts: Date.now() }));
  return json({ ok: true });
}

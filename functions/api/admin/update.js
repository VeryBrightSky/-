import { json, authed } from "../_utils.js";

export async function onRequestPost({ request, env }) {
  if (!authed(request, env)) return json({ ok: false, error: "Unauthorized" }, 401);
  let d; try { d = await request.json(); } catch { return json({ ok: false }, 400); }
  const { id, action } = d;
  if (!id || !id.startsWith("sub:")) return json({ ok: false, error: "Bad id" }, 400);
  if (action === "delete") { await env.STORIES.delete(id); return json({ ok: true }); }
  if (!["approve", "reject"].includes(action)) return json({ ok: false, error: "Bad action" }, 400);
  const v = await env.STORIES.get(id);
  if (!v) return json({ ok: false, error: "Not found" }, 404);
  const s = JSON.parse(v);
  s.status = action === "approve" ? "approved" : "rejected";
  await env.STORIES.put(id, JSON.stringify(s));
  return json({ ok: true });
}

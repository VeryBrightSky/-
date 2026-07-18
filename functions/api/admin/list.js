import { json, authed, allSubs } from "../_utils.js";

export async function onRequestGet({ request, env }) {
  if (!authed(request, env)) return json({ ok: false, error: "Unauthorized" }, 401);
  return json({ ok: true, subs: await allSubs(env) });
}

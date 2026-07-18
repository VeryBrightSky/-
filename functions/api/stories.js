import { json, allSubs } from "./_utils.js";

export async function onRequestGet({ env }) {
  const subs = await allSubs(env);
  const pub = subs.filter(s => s.status === "approved").slice(0, 100)
    .map(({ name, treatment, months, story, ts }) => ({ name, treatment, months, story, ts })); // email never exposed
  return json({ ok: true, stories: pub });
}

# Deploying The Crown Report (with working submissions + admin)

1. **Cloudflare Pages**: dash.cloudflare.com → Workers & Pages → Create → Pages → Upload assets → drag this whole folder (functions/ included). Or connect a Git repo.
2. **Create the database**: Workers & Pages → KV → Create namespace → name it anything (e.g. crown-stories).
3. **Bind it**: your Pages project → Settings → Functions → KV namespace bindings → Add:
   - Variable name: STORIES  (must be exactly this)
   - Namespace: the one you created
4. **Set the admin key**: Settings → Environment variables → Add:
   - Name: ADMIN_KEY
   - Value: a long random password (20+ chars, use a password manager). This is your admin login.
5. Redeploy after adding bindings/vars.
6. **Find & replace** YOURDOMAIN.com with your real domain in all files (canonicals, sitemap.xml, robots.txt).
7. Admin panel: https://yourdomain.com/admin.html, sign in with ADMIN_KEY. Approve/reject/delete submissions; approved ones appear automatically on /reader-results.html.
8. Affiliate link: paste your Katalys tracking link into the marked line at the top of aff.js.

Notes:
- The form and stories only work on the deployed site (Pages Functions don't run when opening files locally).
- robots.txt hides admin.html from search; the ADMIN_KEY is what actually protects it, keep it long and private.
- Free tier limits (KV: 1k writes/day, 100k reads/day) are far beyond what this needs.

/* The Crown Report, site.js
   ============================================================
   AFFILIATE LINK, the only line you ever edit:
   Paste your Katalys tracking link between the quotes below.
   While empty, partner buttons show a "coming soon" notice
   instead of a dead or misleading link.
   ============================================================ */
window.AFF_URL = ""; // <-- PASTE YOUR KATALYS TRACKING LINK HERE (e.g. "https://track.katalys.com/...")

(function () {
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---- affiliate buttons ---- */
  const live = typeof AFF_URL === "string" && AFF_URL.startsWith("http");
  $$("a.aff").forEach(a => {
    if (live) { a.href = AFF_URL; a.rel = "sponsored noopener"; a.target = "_blank"; }
    else { a.href = "#"; a.classList.add("aff-pending"); }
  });
  function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600);
  }
  document.addEventListener("click", e => {
    const a = e.target.closest("a.aff");
    if (a && !live) { e.preventDefault(); toast("Partner link isn't active yet, launching soon."); }
  });

  /* ---- reading progress ---- */
  const pb = document.getElementById("progress");
  if (pb) addEventListener("scroll", () => {
    const d = document.documentElement;
    pb.style.width = (d.scrollTop / (d.scrollHeight - d.clientHeight || 1) * 100) + "%";
  }, { passive: true });

  /* ---- mobile menu ---- */
  const mb = document.getElementById("menuBtn"), mn = document.getElementById("menu");
  if (mb && mn) {
    mb.addEventListener("click", () => {
      const open = mn.classList.toggle("open");
      document.body.classList.toggle("menu-open", open);
      mb.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", mn).forEach(a => a.addEventListener("click", () => {
      mn.classList.remove("open"); document.body.classList.remove("menu-open");
      mb.setAttribute("aria-expanded", "false");
    }));
  }

  /* ---- desktop dropdowns (click support for Safari) ---- */
  $$("nav.links > div").forEach(d => {
    const t = d.querySelector(".top");
    if (!t || t.tagName === "A") return;
    t.setAttribute("aria-haspopup", "true"); t.setAttribute("aria-expanded", "false");
    t.addEventListener("click", () => {
      if (matchMedia("(max-width:820px)").matches) return;
      const was = d.classList.contains("open");
      $$("nav.links > div.open").forEach(x => { x.classList.remove("open");
        const b = x.querySelector(".top"); if (b && b.tagName !== "A") b.setAttribute("aria-expanded", "false"); });
      if (!was) { d.classList.add("open"); t.setAttribute("aria-expanded", "true"); }
    });
  });
  document.addEventListener("click", e => {
    if (!e.target.closest("nav.links"))
      $$("nav.links > div.open").forEach(x => { x.classList.remove("open");
        const b = x.querySelector(".top"); if (b && b.tagName !== "A") b.setAttribute("aria-expanded", "false"); });
  });

  /* ---- active page marker in nav ---- */
  const here = location.pathname.split("/").pop() || "index.html";
  $$("nav.links a").forEach(a => {
    if (a.getAttribute("href") === here) {
      a.classList.add("active"); a.setAttribute("aria-current","page");
      const parent = a.closest("nav.links > div");
      if (parent) parent.querySelector(".top")?.classList.add("active");
    }
  });

  /* ---- homepage chooser ---- */
  $$(".chooser .opts button").forEach(b => b.addEventListener("click", () => {
    $$(".chooser .opts button").forEach(x => x.classList.remove("sel"));
    $$(".cpanel").forEach(x => x.classList.remove("show"));
    b.classList.add("sel");
    document.getElementById("cp-" + b.dataset.p)?.classList.add("show");
  }));

  /* ---- scroll reveal (auto-applied, staggered) ---- */
  $$("main h2, main .card, main .tool, main .rx, main .tbl-scroll, main .pc > div, main .faq details, main .note, main .toc, main .chooser, main .hero-stats").forEach(el => {
    if (!el.classList.contains("reveal")) el.classList.add("reveal");
  });
  let stg = 0, lastTop = -1;
  $$(".reveal").forEach(el => {
    const top = el.getBoundingClientRect().top;
    stg = (Math.abs(top - lastTop) < 40) ? stg + 1 : 0;
    lastTop = top;
    el.style.transitionDelay = Math.min(stg * 70, 280) + "ms";
  });

  /* ---- kinetic hero words ---- */
  const heroH1 = document.querySelector(".hero.center h1");
  if (heroH1 && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const nodes = [...heroH1.childNodes]; heroH1.textContent = "";
    let wi = 0;
    nodes.forEach(n => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { heroH1.appendChild(document.createTextNode(part)); return; }
          const s = document.createElement("span"); s.className = "w"; s.textContent = part;
          s.style.animationDelay = (wi++ * 90) + "ms"; heroH1.appendChild(s);
        });
      } else {
        n.classList && n.classList.add("w");
        n.style && (n.style.animationDelay = (wi++ * 90) + "ms");
        heroH1.appendChild(n);
      }
    });
  }

  /* ---- orb parallax ---- */
  const orbs = document.querySelector(".orbs");
  if (orbs && !matchMedia("(prefers-reduced-motion: reduce)").matches)
    addEventListener("scroll", () => { orbs.style.transform = "translateY(" + scrollY * 0.12 + "px)"; }, { passive: true });

  /* ---- condensing header ---- */
  const hd = document.querySelector("header");
  if (hd) addEventListener("scroll", () => hd.classList.toggle("scrolled", scrollY > 24), { passive: true });

  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px" }) : null;
  $$(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("in"));

  /* ---- sticky CTA: fallback padding + hide at footer ---- */
  const sc = document.querySelector(".sticky-cta"), ft = document.querySelector("footer");
  if (sc) document.body.classList.add("has-sticky");
  if (sc && ft && "IntersectionObserver" in window)
    new IntersectionObserver(es => { sc.style.display = es[0].isIntersecting ? "none" : ""; }).observe(ft);
})();

// cursor spotlight coords for cards/steps
document.addEventListener("pointermove", e => {
  const t = e.target.closest(".card,.step");
  if (!t) return;
  const r = t.getBoundingClientRect();
  t.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
  t.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
}, { passive: true });

// ===== v22 premium interactions =====
(function(){
  const fine = matchMedia("(hover:hover)").matches;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // count-up numbers in hero stats and score when they enter view
  if (!calm && "IntersectionObserver" in window) {
    const els = document.querySelectorAll(".hstat b, .score b");
    const io2 = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; io2.unobserve(e.target);
      const el = e.target, parts = el.textContent.split(/(\d+\.?\d*)/);
      const t0 = performance.now(), D = 900;
      const ease = x => 1 - Math.pow(1 - x, 3);
      (function tick(now){
        const p = Math.min(1,(now - t0)/D), k = ease(p);
        el.textContent = parts.map(s => /^\d/.test(s)
          ? (s.includes(".") ? (parseFloat(s)*k).toFixed(1) : Math.round(parseFloat(s)*k))
          : s).join("");
        if (p < 1) requestAnimationFrame(tick); else el.textContent = parts.join("");
      })(t0);
    }), {threshold:.6});
    els.forEach(el => io2.observe(el));
  }

  // magnetic buttons: drift a few px toward the cursor
  if (fine && !calm) document.querySelectorAll(".btn").forEach(b => {
    b.addEventListener("pointermove", e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.22}px)`;
    });
    b.addEventListener("pointerleave", () => { b.style.transform = ""; });
  });

  // 3D tilt on cards (pairs with the spotlight)
  if (fine && !calm) document.querySelectorAll(".card").forEach(c => {
    c.addEventListener("pointermove", e => {
      const r = c.getBoundingClientRect();
      c.classList.add("tilting");
      c.style.setProperty("--ry", ((e.clientX-r.left)/r.width-.5)*6+"deg");
      c.style.setProperty("--rx", (.5-(e.clientY-r.top)/r.height)*5+"deg");
    });
    c.addEventListener("pointerleave", () => { c.classList.remove("tilting");
      c.style.removeProperty("--rx"); c.style.removeProperty("--ry"); });
  });

  // scroll-to-top with progress ring
  const bt = document.createElement("button");
  bt.id = "toTop"; bt.setAttribute("aria-label","Back to top");
  bt.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 19V6M6 12l6-6 6 6"/></svg>';
  document.body.appendChild(bt);
  addEventListener("scroll", () => {
    const d = document.documentElement, p = d.scrollTop/(d.scrollHeight-d.clientHeight||1)*100;
    bt.style.setProperty("--p", p);
    bt.classList.toggle("show", d.scrollTop > 600);
  }, {passive:true});
  bt.addEventListener("click", () => scrollTo({top:0, behavior: calm ? "auto" : "smooth"}));
})();

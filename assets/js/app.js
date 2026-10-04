/* ==========================================================================
   DEMO — site engine v2
   data · layout · bag · search · motion system
   ========================================================================== */
const IMG = "assets/images/";
const LOGO = IMG + "logo.svg";
const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* z  = optical zoom so every piece reads at the same size on a white square
   az = zoom for the hover image; altCover = hover image is a full-bleed photo */
const PRODUCTS = [
  { id:"archways-bangle", name:"The Archways Bangle", cat:"Bracelets", price:4800, tag:"Signature", z:1.08,
    img:"archways-bangle.jpg", thumb:"archways-bangle-sm.jpg", alt:"lifestyle-archways-bangle-sm.png", altCover:true,
    sketch:"sketch-archways-bangle.png", stones:"Diamonds", sizes:["S","M","L"],
    desc:"A hinged bangle traced with the pointed arches of Beirut's old façades, centred on a pavé panel framed by two baguette-cut stones." },
  { id:"gate-of-echoes-pendant", name:"Large Gate of Echoes Pendant", cat:"Necklaces", price:3000, tag:"Signature", z:1.05,
    img:"gate-of-echoes-pendant.jpg", thumb:"gate-of-echoes-pendant-sm.jpg", stones:"Diamonds", sizes:["42 cm","45 cm"],
    desc:"A gate of light suspended on a fine chain — a triple arch drawn from the qanater of a traditional Lebanese house, outlined in pavé." },
  { id:"luminous-arch-earrings", name:"The Luminous Arch Earrings", cat:"Earrings", price:2370, z:1.3,
    img:"luminous-arch-earrings.jpg", thumb:"luminous-arch-earrings-sm.jpg", stones:"Diamonds", sizes:["One size"],
    desc:"Elongated drops that echo the tall windows of Gemmayzeh, catching the light with every movement." },
  { id:"lantern-ring", name:"The Lantern Ring", cat:"Rings", price:1970, tag:"New", z:1.6, az:1.6,
    img:"lantern-ring.jpg", thumb:"lantern-ring-sm.jpg", alt:"lantern-ring-alt.jpg", stones:"Diamonds", sizes:["48","50","52","54","56"],
    desc:"Inspired by the lanterns that glow in old Beirut doorways — a sculpted band crowned with a row of arches." },
  { id:"arches-pinky-ring", name:"Arches Pinky Ring", cat:"Rings", price:1650, z:1.7, az:1.7,
    img:"arches-pinky-ring.jpg", thumb:"arches-pinky-ring.jpg", alt:"arches-pinky-ring-alt.jpg", stones:"Diamonds", sizes:["44","46","48","50"],
    desc:"A refined pinky ring shaped as a single arched window, its lattice set with a pavé outline." },
  { id:"arabesque-bracelet", name:"Beirut Arabesque Bracelet", cat:"Bracelets", price:600, z:1,
    img:"arabesque-bracelet.jpg", thumb:"arabesque-bracelet.jpg", stones:"—", sizes:["Adjustable"],
    desc:"An engraved arabesque plaque on an adjustable cord. Light enough to stack, meaningful enough to wear alone." },
  { id:"arabesque-necklace", name:"Beirut Arabesque Necklace", cat:"Necklaces", price:1250, z:1,
    img:"arabesque-necklace.jpg", thumb:"arabesque-necklace.jpg", stones:"—", sizes:["42 cm","45 cm"],
    desc:"The arabesque motif of Lebanese mashrabiya, engraved on a slender bar and set on a delicate chain." },
  { id:"dancing-arches-necklace", name:"Dancing Arches Necklace", cat:"Necklaces", price:1650, tag:"New", z:1.05,
    img:"dancing-arches-necklace.jpg", thumb:"dancing-arches-necklace.jpg", stones:"Diamonds", sizes:["42 cm","45 cm"],
    desc:"Interlaced arches meet inside a pavé-rimmed silhouette — movement, rhythm and light in a single pendant." },
];
const CATS = ["Rings","Necklaces","Bracelets","Earrings"];
const byId = id => PRODUCTS.find(p => p.id === id);
const money = n => "$" + n.toLocaleString("en-US");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeIO = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;

/* ---------- Icons ---------- */
const ARCH_D = "M6 78V32C6 16 17 5 30 1c13 4 24 15 24 31v46";
const ICON = {
  arch:`<svg class="icon-arch" viewBox="0 0 60 80" fill="none" stroke="currentColor" stroke-width="5" aria-hidden="true"><path d="${ARCH_D}"/></svg>`,
  search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/></svg>',
  bag:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 8.5h15l-1.1 12h-12.8z"/><path d="M8.5 8.5V7a3.5 3.5 0 0 1 7 0v1.5"/></svg>',
  plus:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M8 2v12M2 8h12"/></svg>',
};

/* ---------- Layout ---------- */
function layout(){
  const page = document.body.dataset.page;
  const cur = p => page === p ? ' aria-current="page"' : "";

  document.body.insertAdjacentHTML("afterbegin", `
  <header class="header" id="header">
    <div class="container header__inner">
      <nav class="nav" aria-label="Primary">
        <a href="index.html"${cur("home")}>Home</a>
        <a href="shop.html"${cur("shop")}>Shop</a>
        <a href="contact.html"${cur("contact")}>Contact</a>
      </nav>
      <button class="burger" id="burger" aria-label="Open menu"><i></i></button>
      <a class="brand" href="index.html" aria-label="DEMO — Home"><img src="${LOGO}" alt="DEMO"></a>
      <div class="tools">
        <button data-search aria-label="Search">${ICON.search}<span class="t-hide">Search</span></button>
        <button data-bag aria-label="Open bag">${ICON.bag}<span class="t-hide">Bag</span><span class="bag-count" id="bagCount">0</span></button>
      </div>
    </div>
  </header>
  <div class="menu" id="menu" aria-hidden="true">
    <button class="menu__close" id="menuClose">Close</button>
    <nav>
      <a href="index.html"><span>Home</span></a>
      <a href="shop.html"><span>Shop</span></a>
      <a href="contact.html"><span>Contact</span></a>
    </nav>
    <div class="menu__foot"><a href="https://www.instagram.com/baki.jewellery" target="_blank" rel="noopener">Instagram</a><span>Beirut</span></div>
  </div>`);

  document.body.insertAdjacentHTML("beforeend", `
  <footer class="footer">
    <div class="container">
      <div class="footer__news">
        <h2 class="t-title" data-r="words">Hear about new pieces first.</h2>
        <form id="footNews" novalidate data-r>
          <div class="field-line">
            <input type="email" required placeholder="Your email address" aria-label="Email address">
            <button type="submit">Subscribe</button>
          </div>
        </form>
      </div>
      <div class="footer__grid">
        <div><p class="footer__tag">A contemporary interpretation of Lebanese heritage.</p></div>
        <div><h4>Shop</h4><ul>${CATS.map(c => `<li><a href="shop.html?cat=${c}">${c}</a></li>`).join("")}</ul></div>
        <div><h4>Maison</h4><ul><li><a href="index.html#maison">Our story</a></li><li><a href="contact.html">Private viewings</a></li><li><a href="contact.html#faq">Care &amp; FAQ</a></li></ul></div>
        <div><h4>Follow</h4><ul><li><a href="https://www.instagram.com/baki.jewellery" target="_blank" rel="noopener">Instagram</a></li><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li></ul></div>
      </div>
      <div class="footer__legal"><span>© ${new Date().getFullYear()} DEMO Fine Jewellery</span><span>Beirut — Lebanon</span></div>
    </div>
    <div class="footer__word" aria-hidden="true">DEMO</div>
  </footer>

  <div class="scrim" id="scrim"></div>
  <aside class="drawer" id="drawer" aria-label="Shopping bag" aria-hidden="true">
    <div class="drawer__head"><h3 class="t-sub">Your Bag</h3><button class="drawer__close" data-close>Close</button></div>
    <div class="ship-bar" id="shipBar"></div>
    <div class="drawer__items" id="bagItems"></div>
    <div class="drawer__foot" id="bagFoot">
      <div class="drawer__total"><span class="t-label">Subtotal</span><strong class="t-sub" id="bagTotal">$0</strong></div>
      <p>Duties and insured shipping calculated at checkout.</p>
      <a class="btn btn--block" href="#">Secure checkout</a>
    </div>
  </aside>

  <div class="search" id="search" aria-hidden="true">
    <div class="container">
      <div class="search__top"><span class="t-label muted">Search the collection</span><button class="drawer__close" data-close>Close</button></div>
      <input class="search__input" id="searchInput" type="search" placeholder="Rings, arches, pendant…" autocomplete="off">
      <div class="search__res" id="searchRes"></div>
    </div>
  </div>
  <div class="toast" id="toast" role="status">${ICON.arch}<span></span></div>`);
}

/* ---------- Product card ---------- */
function card(p, i = 0, reveal = true){
  return `
  <article class="card"${reveal ? ` data-r style="transition-delay:${(i % 4) * 90}ms"` : ""}>
    <a href="product.html?id=${p.id}" class="card__media" style="--z:${p.z || 1};--az:${p.az || 1}" aria-label="${esc(p.name)}">
      ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ""}
    </a>
    <button class="card__quick" data-add="${p.id}" aria-label="Add ${esc(p.name)} to bag">${ICON.plus}</button>
    <a href="product.html?id=${p.id}" class="card__info">
      <div><h3 class="card__name">${p.name}</h3><div class="card__cat">${p.cat}</div></div>
      <span class="card__price">${money(p.price)}</span>
    </a>
  </article>`;
}

/* ---------- Bag ---------- */
const GIFT_AT = 3000;
let bag = [];
try { bag = JSON.parse(localStorage.getItem("baki.bag")) || []; } catch(e) {}
bag = bag.filter(l => byId(l.id));
const save = () => { try { localStorage.setItem("baki.bag", JSON.stringify(bag)); } catch(e) {} };

function addToBag(id, qty = 1, size){
  const p = byId(id); if (!p) return;
  size = size || p.sizes[0];
  const line = bag.find(l => l.id === id && l.size === size);
  line ? line.qty += qty : bag.push({ id, size, qty });
  save(); renderBag(true); openPanel("bag");
}
function renderBag(bump){
  const count = bag.reduce((s, l) => s + l.qty, 0);
  const total = bag.reduce((s, l) => s + byId(l.id).price * l.qty, 0);
  const c = document.getElementById("bagCount");
  c.textContent = count;
  if (bump){ c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
  document.getElementById("bagTotal").textContent = money(total);
  document.getElementById("bagFoot").style.display = count ? "" : "none";
  const ship = document.getElementById("shipBar");
  ship.style.display = count ? "" : "none";
  ship.innerHTML = count ? (total < GIFT_AT
      ? `You are <strong>${money(GIFT_AT - total)}</strong> away from complimentary engraving.`
      : `Complimentary engraving included.`) + `<div><span style="width:${Math.min(100, total / GIFT_AT * 100)}%"></span></div>` : "";
  document.getElementById("bagItems").innerHTML = count ? bag.map((l, i) => { const p = byId(l.id); return `
    <div class="line-item">
      <a class="li-img" href="product.html?id=${p.id}" style="--z:${p.z || 1}"></a>
      <div>
        <h5>${p.name}</h5>
        <div class="muted">${p.cat} · ${l.size}</div>
        <div class="qty"><button data-q="${i}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button data-q="${i}" data-d="1" aria-label="Increase">+</button></div>
      </div>
      <div class="line-item__side"><span>${money(p.price * l.qty)}</span><button class="line-item__rm" data-rm="${i}">Remove</button></div>
    </div>`; }).join("")
    : `<div class="drawer__empty"><p class="t-sub">Your bag is empty</p><p class="muted">Discover pieces made to be treasured.</p><a class="btn" href="shop.html">Explore the collection</a></div>`;
  enhanceButtons(document.getElementById("drawer"));
}

/* ---------- Panels · toast · search ---------- */
function openPanel(which){
  document.body.classList.add(which === "bag" ? "bag-open" : "search-open");
  document.getElementById(which === "bag" ? "drawer" : "search").setAttribute("aria-hidden", "false");
  if (which === "search") setTimeout(() => document.getElementById("searchInput").focus(), 350);
}
function closePanels(){
  document.body.classList.remove("bag-open", "search-open");
  ["drawer", "search"].forEach(id => document.getElementById(id).setAttribute("aria-hidden", "true"));
}
function toast(msg){
  const t = document.getElementById("toast");
  t.querySelector("span").textContent = msg;
  t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 2600);
}
function runSearch(q){
  q = q.trim().toLowerCase();
  const hits = q ? PRODUCTS.filter(p => (p.name + " " + p.cat + " " + p.desc).toLowerCase().includes(q)) : PRODUCTS.slice(0, 4);
  document.getElementById("searchRes").innerHTML = hits.length
    ? hits.slice(0, 8).map((p, i) => card(p, i, false)).join("")
    : `<p class="muted">No pieces match “${esc(q)}”.</p>`;
}

/* ==========================================================================
   Motion system
   ========================================================================== */

/* Buttons: label rolls up on hover (duplicate text via data-t) */
function enhanceButtons(root = document){
  root.querySelectorAll(".btn:not(.btn-ready)").forEach(b => {
    const t = b.textContent.trim();
    b.innerHTML = `<span class="btn__m"><span class="btn__t" data-t="${esc(t)}">${esc(t)}</span></span>`;
    b.classList.add("btn-ready");
  });
}
function setBtn(b, text){
  const t = b.querySelector(".btn__t");
  if (!t){ b.textContent = text; return; }
  t.textContent = text; t.dataset.t = text;
}

/* Words: wrap each word in a mask so it can rise into place */
function splitWords(root = document){
  root.querySelectorAll('[data-r="words"]:not(.split)').forEach(el => {
    let i = 0;
    const base = +(el.dataset.delay || 0);
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3){
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(" "));
          const w = document.createElement("span"); w.className = "w";
          const s = document.createElement("span"); s.textContent = part;
          s.style.transitionDelay = (base + i++ * 54) + "ms";
          w.appendChild(s); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
    });
    walk(el);
    el.classList.add("split");
  });
}

/* Stagger: children of [data-stagger] reveal one after another */
function stagger(root = document){
  root.querySelectorAll("[data-stagger]").forEach(g => {
    const step = +g.dataset.stagger || 90;
    [...g.querySelectorAll(":scope > [data-r], :scope > * > [data-r]")].forEach((el, i) => {
      if (!el.style.transitionDelay) el.style.transitionDelay = i * step + "ms";
    });
  });
}

let io = null;
/* Clip-path reveals start fully clipped, and Chrome treats a fully clipped element
   as zero-size, so it never "intersects". Watch the parent for those instead. */
const proxies = new Map();
function observe(root = document){
  splitWords(root); stagger(root); enhanceButtons(root);
  if (!io) return;
  root.querySelectorAll("[data-r]:not(.in)").forEach(el => {
    if (/^(arch|img)$/.test(el.dataset.r) && el.parentElement){
      const host = el.parentElement;
      if (!proxies.has(host)) proxies.set(host, []);
      proxies.get(host).push(el);
      io.observe(host);
    } else io.observe(el);
  });
}
function startReveals(){
  if (REDUCE || !("IntersectionObserver" in window)){
    document.querySelectorAll("[data-r]").forEach(el => el.classList.add("in")); return;
  }
  io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const targets = proxies.get(e.target);
    if (targets){ targets.forEach(t => t.classList.add("in")); proxies.delete(e.target); if (e.target.hasAttribute("data-r")) e.target.classList.add("in"); }
    else e.target.classList.add("in");
    io.unobserve(e.target);
  }), { threshold: .2, rootMargin: "0px 0px -18% 0px" });
  observe(document);
}

/* Parallax: [data-speed] drifts against the scroll */
function parallax(){
  if (REDUCE) return;
  const els = [...document.querySelectorAll("[data-speed]")];
  if (!els.length) return;
  const absTop = el => { let t = 0; while (el){ t += el.offsetTop; el = el.offsetParent; } return t; };
  let tops = [];
  const measure = () => { tops = els.map(el => absTop(el) + el.offsetHeight / 2); };
  const update = () => {
    const mid = scrollY + innerHeight / 2;
    els.forEach((el, i) => {
      const d = tops[i] - mid;
      if (Math.abs(d) > innerHeight * 1.5) return;
      el.style.transform = `translate3d(0,${(d * -parseFloat(el.dataset.speed)).toFixed(1)}px,0)`;
    });
  };
  let raf = 0;
  addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
  addEventListener("resize", () => { measure(); update(); });
  addEventListener("load", () => { measure(); update(); });
  measure(); update();
}

/* Pinned scene: the sketch becomes the jewel through a growing arch */
function craftScene(){
  const sec = document.querySelector(".craft"); if (!sec) return;
  const frame = sec.querySelector(".craft__frame");
  const layer = sec.querySelector(".craft__reveal");
  const prod = layer.querySelector("img");
  const zoom = parseFloat(getComputedStyle(prod).getPropertyValue("--z")) || 1;
  const steps = [...sec.querySelectorAll(".craft__step")];
  const labels = [...sec.querySelectorAll(".craft__nav span")];
  const bars = [...sec.querySelectorAll(".craft__nav i")];
  let current = -1;

  const update = () => {
    const r = sec.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - innerHeight));

    const m = easeIO(clamp((p - .3) / .38));                 // arch mask 0 → 1
    const side = (1 - m) * 36, top = (1 - m) * 100;
    const visibleW = frame.clientWidth * (1 - side / 50);
    const radius = (visibleW / 2) * (1 - m * m * m);
    layer.style.clipPath = `inset(${top}% ${side}% 0 ${side}% round ${radius}px ${radius}px 0 0)`;
    prod.style.setProperty("--s", ((1.2 - .2 * easeIO(clamp((p - .6) / .4))) * zoom).toFixed(4));

    bars[0] && bars[0].style.setProperty("--f", clamp(p / .33));
    bars[1] && bars[1].style.setProperty("--f", clamp((p - .33) / .33));

    const step = p < .33 ? 0 : p < .66 ? 1 : 2;
    if (step !== current){
      current = step;
      steps.forEach((s, i) => s.classList.toggle("on", i === step));
      labels.forEach((l, i) => l.classList.toggle("on", i <= step));
    }
  };
  let raf = 0;
  addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
  addEventListener("resize", update);
  update();
}

/* Header: transparent over the hero, hides on scroll down, returns on scroll up */
function headerScroll(){
  const hero = document.querySelector(".hero");
  const header = document.getElementById("header");
  let last = scrollY;
  const on = () => {
    const y = scrollY;
    const limit = hero ? hero.offsetHeight - header.offsetHeight : 40;
    document.body.classList.toggle("scrolled", y > limit);
    const locked = document.body.matches(".bag-open,.search-open");
    if (y < 200 || y < last - 4 || locked) document.body.classList.remove("header-hidden");
    else if (y > last + 4 && y > innerHeight * .8) document.body.classList.add("header-hidden");
    last = y;
  };
  addEventListener("scroll", on, { passive: true }); on();
}

/* Page transitions: fade the page out before leaving */
function pageTransitions(){
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === "_blank" || a.hasAttribute("download")) return;
    const url = new URL(a.getAttribute("href"), location.href);
    if (url.origin !== location.origin || url.href === location.href) return;
    if (url.pathname === location.pathname && url.hash){
      const t = document.querySelector(url.hash);
      if (t){ e.preventDefault(); t.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth" }); }
      return;
    }
    if (a.getAttribute("href") === "#") return;
    e.preventDefault();
    document.documentElement.classList.add("is-leaving");
    setTimeout(() => { location.href = url.href; }, REDUCE ? 0 : 420);
  });
  addEventListener("pageshow", e => { if (e.persisted) document.documentElement.classList.remove("is-leaving"); });
}

/* Loading screen (home only): the arch draws itself, the logo appears, the curtain lifts */
function preloader(onDone){
  const pl = document.getElementById("preloader");
  if (!pl) return onDone();
  const MIN = REDUCE ? 0 : 2300, MAX = 6500;
  document.documentElement.style.overflow = "hidden";
  const tasks = [document.fonts ? document.fonts.ready : Promise.resolve()];
  const v = document.getElementById("heroVideo");
  if (v && v.readyState < 3) tasks.push(new Promise(r => { v.addEventListener("canplay", r, { once: true }); v.addEventListener("error", r, { once: true }); }));
  let done = false;
  const finish = () => {
    if (done) return; done = true;
    pl.classList.add("lift");
    document.documentElement.style.overflow = "";
    setTimeout(onDone, 250);
    setTimeout(() => pl.remove(), 1500);
  };
  Promise.all([Promise.all(tasks), new Promise(r => setTimeout(r, MIN))]).then(finish);
  setTimeout(finish, MAX);
}

/* Custom pointer: exact dot + trailing ring; ring grows on links, says "View" on products */
function cursor(){
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.body.insertAdjacentHTML("beforeend", `<div class="cursor" aria-hidden="true"><span class="cursor__ring"><svg class="cursor__arch" viewBox="0 0 60 80"><path d="M4 79V32C4 16 16 4.5 30 1c14 3.5 26 15 26 31v47z"/></svg><em>View</em></span><span class="cursor__dot"></span></div>`);
  const root = document.documentElement;
  const el = document.querySelector(".cursor");
  const ring = el.querySelector(".cursor__ring"), dot = el.querySelector(".cursor__dot");
  root.classList.add("has-cursor");
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf = 0;
  const loop = () => {
    rx += (x - rx) * (REDUCE ? 1 : .16);
    ry += (y - ry) * (REDUCE ? 1 : .16);
    ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    raf = Math.abs(x - rx) + Math.abs(y - ry) > .1 ? requestAnimationFrame(loop) : 0;
  };
  addEventListener("mousemove", e => {
    x = e.clientX; y = e.clientY;
    dot.style.transform = `translate3d(${x}px,${y}px,0)`;
    el.classList.add("on");
    if (!raf) raf = requestAnimationFrame(loop);
    const t = e.target;
    el.classList.toggle("is-view", !!t.closest(".card__media, .stage"));
    el.classList.toggle("is-link", !el.classList.contains("is-view") && !!t.closest("a, button, summary, label, select, .chip, [data-shot]"));
    el.classList.toggle("is-text", !!t.closest("input, textarea"));
  }, { passive: true });
  document.addEventListener("mouseleave", () => el.classList.remove("on"));
  addEventListener("mousedown", () => el.classList.add("is-down"));
  addEventListener("mouseup", () => el.classList.remove("is-down"));
}

/* ---------- Boot ---------- */
function boot(){
  layout();
  renderBag();
  enhanceButtons();
  splitWords();
  stagger();
  headerScroll();
  pageTransitions();

  document.addEventListener("click", e => {
    const t = e.target;
    const add = t.closest("[data-add]");
    if (add){ e.preventDefault(); addToBag(add.dataset.add); toast("Added to your bag"); return; }
    if (t.closest("[data-bag]")) return openPanel("bag");
    if (t.closest("[data-search]")){ runSearch(""); return openPanel("search"); }
    if (t.closest("[data-close]") || t.id === "scrim") return closePanels();
    const q = t.closest("[data-q]");
    if (q){ const l = bag[q.dataset.q]; l.qty += +q.dataset.d; if (l.qty < 1) bag.splice(q.dataset.q, 1); save(); renderBag(); return; }
    const rm = t.closest("[data-rm]");
    if (rm){ bag.splice(rm.dataset.rm, 1); save(); renderBag(); }
  });
  document.getElementById("searchInput").addEventListener("input", e => runSearch(e.target.value));

  const m = document.getElementById("menu");
  const menu = open => { m.classList.toggle("open", open); m.setAttribute("aria-hidden", !open); document.documentElement.style.overflow = open ? "hidden" : ""; };
  document.getElementById("burger").onclick = () => menu(true);
  document.getElementById("menuClose").onclick = () => menu(false);
  document.addEventListener("keydown", e => { if (e.key === "Escape"){ closePanels(); menu(false); } });

  document.getElementById("footNews").addEventListener("submit", e => {
    e.preventDefault(); const f = e.target;
    if (!f.checkValidity()){ f.reportValidity(); return; }
    f.innerHTML = `<p class="footer__thanks">Thank you — you're on the list.</p>`;
  });

  parallax();
  craftScene();
  cursor();
  preloader(() => { document.querySelector(".hero")?.classList.add("in"); startReveals(); });
}

window.DEMO = { observe, setBtn, card, money, byId, PRODUCTS, CATS, IMG, ICON, toast, addToBag };

/* Home only: insert the loading screen before the page paints */
if (document.body.dataset.page === "home") document.body.insertAdjacentHTML("afterbegin", `
  <div class="preloader" id="preloader" role="status" aria-label="Loading DEMO">
    <div class="preloader__inner">
      <svg class="preloader__arch" viewBox="0 0 60 80" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength="1" d="M1 80V32C1 15 13 4 30 .5c17 3.5 29 14.5 29 31.5v48"/>
        <path pathLength="1" d="M7 80V34c0-13 9-22 23-26 14 4 23 13 23 26v46"/>
      </svg>
      <img class="preloader__logo" src="${LOGO}" alt="">
      <span class="preloader__tag">Fine Jewellery · Beirut</span>
    </div>
  </div>`);
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();

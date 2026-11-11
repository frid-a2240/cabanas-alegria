/* =========================================================
   Cabañas Alegría
   ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Texto letra por letra ---------- */
function splitText(el, baseDelay = 0) {
  let i = 0;
  const targets = $$(".line", el).length ? $$(".line", el) : [el];
  targets.forEach(t => {
    const text = t.textContent;
    t.textContent = "";
    [...text].forEach(c => {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = c === " " ? " " : c;
      s.style.setProperty("--i", i++);
      t.appendChild(s);
    });
  });
  el.style.setProperty("--d", baseDelay + "ms");
}

/* ---------- Intro: árbol ---------- */
function buildTree() {
  $$(".tree-lines path").forEach(p => p.setAttribute("pathLength", "1"));

  const g = $(".leaves");
  const colors = ["#9a2f26", "#c2463b", "#7f9774", "#a9bf9c", "#1e5a58", "#3f7a72"];
  const ns = "http://www.w3.org/2000/svg";
  // racimos de hojas en las puntas de las ramas
  const clusters = [[42, 98], [60, 120], [160, 88], [142, 112], [68, 50], [78, 74], [135, 46], [124, 72], [100, 38], [100, 62], [84, 92], [118, 94]];
  let n = 0;
  clusters.forEach(([cx, cy]) => {
    for (let k = 0; k < 5; k++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 13;
      const leaf = document.createElementNS(ns, "ellipse");
      leaf.setAttribute("cx", (cx + Math.cos(a) * r).toFixed(1));
      leaf.setAttribute("cy", (cy + Math.sin(a) * r * .8).toFixed(1));
      leaf.setAttribute("rx", (3 + Math.random() * 2.5).toFixed(1));
      leaf.setAttribute("ry", (1.6 + Math.random() * 1.2).toFixed(1));
      leaf.setAttribute("fill", colors[Math.floor(Math.random() * colors.length)]);
      leaf.setAttribute("opacity", (.75 + Math.random() * .25).toFixed(2));
      leaf.classList.add("leaf");
      leaf.style.setProperty("--r", Math.floor(Math.random() * 180) + "deg");
      leaf.style.animationDelay = `${1.4 + n * 0.018 + Math.random() * .3}s, ${Math.random() * 3}s`;
      g.appendChild(leaf);
      n++;
    }
  });
}

/* ---------- Intro: entrar ---------- */
const intro = $("#intro");
let entered = false;
function enter() {
  if (entered) return;
  entered = true;
  intro.classList.add("leaving");
  document.body.classList.remove("locked");
  document.body.classList.add("entered");
  $(".hero-title").classList.add("play");
  setTimeout(() => intro.classList.add("gone"), 2200);
}

/* ---------- Aparecer al hacer scroll ---------- */
function reveals() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal, .reveal-img").forEach(el => io.observe(el));
}

/* ---------- Nav ---------- */
function nav() {
  const header = $(".nav");
  const links = $$(".links a");
  $(".burger").addEventListener("click", () => header.classList.toggle("open"));
  links.forEach(a => a.addEventListener("click", () => header.classList.remove("open")));

  const sections = $$("main section[id]");
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => spy.observe(s));
}

/* ---------- Parallax + estado del nav ---------- */
function onScroll() {
  const header = $(".nav");
  const heroBg = $(".hero-bg");
  const nightImg = $(".night-bg img");
  const night = $(".night");
  const floats = $$("[data-speed]");
  let ticking = false;

  const frame = () => {
    const y = scrollY;
    header.classList.toggle("scrolled", y > 60);
    if (!reduceMotion) {
      heroBg.style.transform = `translateY(${y * 0.35}px)`;
      const nr = night.getBoundingClientRect();
      nightImg.style.transform = `translateY(${(nr.top / innerHeight) * -80}px)`;
      floats.forEach(el => {
        const r = el.getBoundingClientRect();
        const off = (r.top + r.height / 2 - innerHeight / 2) * parseFloat(el.dataset.speed);
        el.style.translate = `0 ${off}px`;
      });
    }
    ticking = false;
  };
  addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(frame); ticking = true; }
  }, { passive: true });
  frame();
}

/* ---------- Noche: estrellas, foquitos y brasas ---------- */
function nightScene() {
  const section = $(".night");

  const stars = $(".stars");
  for (let i = 0; i < 90; i++) {
    const s = document.createElement("i");
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    const size = Math.random() < .15 ? 3 : Math.random() * 1.6 + .8;
    s.style.width = s.style.height = size + "px";
    s.style.setProperty("--t", 2 + Math.random() * 4 + "s");
    s.style.setProperty("--dl", Math.random() * 4 + "s");
    stars.appendChild(s);
  }

  // foquitos colgados del cable
  const wire = $(".string-lights .wire");
  const bulbs = $(".string-lights .bulbs");
  const len = wire.getTotalLength();
  const count = 22;
  for (let i = 1; i < count; i++) {
    const p = wire.getPointAtLength((len / count) * i);
    const c = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    c.setAttribute("cx", p.x);
    c.setAttribute("cy", p.y + 7);
    c.setAttribute("rx", 4);
    c.setAttribute("ry", 6);
    c.classList.add("bulb");
    c.style.setProperty("--t", 0.6 + Math.random() * 1.6 + "s");
    c.style.setProperty("--dl", i * 0.07 + "s");
    bulbs.appendChild(c);
  }

  // brasas de la fogata
  const canvas = $(".embers");
  const ctx = canvas.getContext("2d");
  let w, h, particles = [], running = false;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = section.offsetWidth; h = section.offsetHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const spawn = () => ({
    x: w / 2 + (Math.random() - .5) * Math.min(w * .5, 420),
    y: h + 10,
    vx: (Math.random() - .5) * .5,
    vy: -(0.6 + Math.random() * 1.6),
    r: Math.random() * 2.2 + .6,
    life: 0,
    max: 200 + Math.random() * 260,
    hue: 18 + Math.random() * 25,
  });
  const loop = () => {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    if (particles.length < 120) particles.push(spawn(), spawn());
    ctx.globalCompositeOperation = "lighter";
    particles = particles.filter(p => {
      p.life++;
      p.x += p.vx + Math.sin((p.life + p.max) * .03) * .4;
      p.y += p.vy;
      const a = 1 - p.life / p.max;
      if (a <= 0) return false;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${a})`);
      g.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();
      return true;
    });
    requestAnimationFrame(loop);
  };

  resize();
  addEventListener("resize", resize);
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      section.classList.add("lit");
      if (!running && !reduceMotion) { running = true; loop(); }
    } else {
      running = false;
    }
  }, { threshold: 0.1 }).observe(section);
}

/* ---------- Mapa ilustrado: Cómo llegar ---------- */
function routeMap() {
  const card = $(".map-card");
  const motion = $(".car animateMotion");
  const steps = $$(".steps li");
  const pins = $$(".pin");
  let timers = [];

  const highlight = n => {
    steps.forEach(li => li.classList.toggle("on", li.dataset.step === String(n)));
    pins.forEach(pn => pn.classList.toggle("on", pn.dataset.pin === String(n)));
  };

  // el recorrido dura 6 s; cada paso se ilumina cuando el coche pasa por ahí
  const play = () => {
    timers.forEach(clearTimeout);
    card.classList.remove("go");
    void card.offsetWidth;
    card.classList.add("go");
    if (motion && !reduceMotion) motion.beginElement();
    timers = [[0, 1], [1700, 2], [3000, 3], [5200, 4]].map(([t, n]) => setTimeout(() => highlight(n), t));
  };

  new IntersectionObserver(([e], obs) => {
    if (e.isIntersecting) { play(); obs.disconnect(); }
  }, { threshold: 0.4 }).observe(card);

  $(".replay").addEventListener("click", play);
  steps.forEach(li => li.addEventListener("mouseenter", () => highlight(li.dataset.step)));
  pins.forEach(pn => pn.addEventListener("mouseenter", () => highlight(pn.dataset.pin)));

  // pestañas Mapa / Vista de calle
  const frame = $(".map-frame iframe");
  $$(".map-tabs button").forEach(btn => btn.addEventListener("click", () => {
    $$(".map-tabs button").forEach(b => b.classList.toggle("active", b === btn));
    frame.src = btn.dataset.map === "street" ? frame.dataset.streetSrc : frame.dataset.mapSrc;
  }));
}

/* ---------- Galería ---------- */
function lightbox() {
  const lb = $(".lightbox");
  const img = $("img", lb);
  const close = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); };
  $$(".g-item").forEach(btn => btn.addEventListener("click", () => {
    img.src = btn.dataset.src;
    img.alt = $("img", btn).alt;
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
  }));
  lb.addEventListener("click", e => { if (e.target !== img) close(); });
  addEventListener("keydown", e => { if (e.key === "Escape") close(); });
}

/* ---------- Formularios ---------- */
function forms() {
  $$(".notify").forEach(form => {
    const msg = $(".form-msg", form);
    form.addEventListener("submit", e => {
      e.preventDefault();
      const input = $("input", form);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        msg.textContent = "Escribe un correo válido, por favor.";
        form.classList.remove("shake");
        void form.offsetWidth;
        form.classList.add("shake");
        return;
      }
      // Aquí se conectaría el envío real (Formspree, Mailchimp, etc.)
      msg.textContent = "¡Gracias! Te contactaremos pronto para confirmar tu reservación.";
      input.value = "";
    });
  });
}


/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  $(".year").textContent = new Date().getFullYear();

  buildTree();
  const introTitle = $(".intro-title");
  splitText(introTitle, 2100);
  splitText($(".hero-title"), 600);
  requestAnimationFrame(() => introTitle.classList.add("play"));

  intro.addEventListener("click", enter);
  addEventListener("wheel", () => { if (!entered) enter(); }, { passive: true });
  addEventListener("touchmove", () => { if (!entered) enter(); }, { passive: true });
  addEventListener("keydown", e => {
    if (!entered && ["Enter", " ", "ArrowDown", "PageDown"].includes(e.key)) { e.preventDefault(); enter(); }
  });

  routeMap();
  reveals();
  nav();
  onScroll();
  nightScene();
  lightbox();
  forms();
});

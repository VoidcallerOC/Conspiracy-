const GAMES = [
  { tag: "Community", name: "Community Nights", note: "Bring your favorite game or learn something new around the table.", rarity: "OPEN", no: "001", art: "/assets/media/community-night.webp" },
  { tag: "Tabletop", name: "Tabletop Play", note: "Find your seat, start a story and make the next session memorable.", rarity: "PLAY", no: "002", art: "/assets/media/tabletop-action.webp" },
  { tag: "Campaigns", name: "Campaigns", note: "Bring your party together for the next chapter.", rarity: "JOIN", no: "003", art: "/assets/media/tabletop-space.webp" },
  { tag: "Games", name: "Games & Merch", note: "Explore the shelves, products and official Conspiracy gear.", rarity: "FIND", no: "004", art: "/assets/media/products-display.webp" },
  { tag: "Inside", name: "The Store", note: "A welcoming space for players, collectors and curious newcomers.", rarity: "ALL", no: "005", art: "/assets/media/store-shelves.webp" },
  { tag: "Community", name: "The Gathering", note: "Room to play, gather and make the next session memorable.", rarity: "CG", no: "006", art: "/assets/media/floor-space.webp" },
];

const HOURS = [
  { day: "Sunday", open: "12:00 PM", close: "6:00 PM", openMin: 12 * 60, closeMin: 18 * 60 },
  { day: "Monday", closed: true },
  { day: "Tuesday", closed: true },
  { day: "Wednesday", open: "5:00 PM", close: "9:00 PM", openMin: 17 * 60, closeMin: 21 * 60 },
  { day: "Thursday", open: "5:00 PM", close: "9:00 PM", openMin: 17 * 60, closeMin: 21 * 60 },
  { day: "Friday", open: "5:00 PM", close: "9:00 PM", openMin: 17 * 60, closeMin: 21 * 60 },
  { day: "Saturday", open: "12:00 PM", close: "9:00 PM", openMin: 12 * 60, closeMin: 21 * 60 },
];

const PHOTOS = [
  { src: "/assets/media/community-night.webp", alt: "Conspiracy Gaming community gathered around tables", caption: "Community night", w: 2560, h: 1440, widths: [480, 768, 1280] },
  { src: "/assets/media/tabletop-action.webp", alt: "Players gathered around a tabletop game", caption: "Play together", w: 2560, h: 1440, widths: [480, 768, 1280] },
  { src: "/assets/media/products-display.webp", alt: "Conspiracy Gaming products and tabletop displays", caption: "Games & merch", w: 2560, h: 1440, widths: [480, 768, 1280] },
  { src: "/assets/media/store-shelves.webp", alt: "Conspiracy Gaming shelves and store interior", caption: "Find your next game", w: 2560, h: 1440, widths: [480, 768, 1280] },
  { src: "/assets/media/collectibles.webp", alt: "Conspiracy Gaming collectibles display", caption: "Collectibles", w: 2560, h: 1440, widths: [480, 768, 1280] },
  { src: "/assets/media/collectibles-detail.webp", alt: "Close detail of dice and collectibles at Conspiracy Gaming", caption: "The details", w: 2560, h: 1440, widths: [480, 768, 1280] },
  { src: "/assets/media/snacks.webp", alt: "Snacks and drinks at Conspiracy Gaming", caption: "Snacks & drinks", w: 2560, h: 1440, widths: [480, 768, 1280] },
  { src: "/assets/media/tabletop-space.webp", alt: "Tabletop gaming space inside Conspiracy Gaming", caption: "Tabletop space", w: 2560, h: 1440, widths: [480, 768, 1280] },
  { src: "/assets/media/floor-space.webp", alt: "Open floor space inside Conspiracy Gaming", caption: "Room to gather", w: 2560, h: 1440, widths: [480, 768, 1280] },
];

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

function responsiveSrcset(src, widths, extension) {
  return `${src} 1x`;
}

function responsiveImage({ src, sizes, alt = "", width, height, className = "", loading = "lazy", decoding = "async", fetchPriority = "" }) {
  const classAttr = className ? ` class="${className}"` : "";
  const loadingAttr = loading ? ` loading="${loading}"` : "";
  const fetchPriorityAttr = fetchPriority ? ` fetchpriority="${fetchPriority}"` : "";
  return `<picture class="responsive-picture"><img${classAttr} src="${src}" alt="${alt}" width="${width}" height="${height}" sizes="${sizes}"${loadingAttr} decoding="${decoding}"${fetchPriorityAttr} /></picture>`;
}
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
const DESKTOP_SCROLL_FX = FINE && matchMedia("(min-width: 768px)").matches;
const HERO_SCROLL_FX = DESKTOP_SCROLL_FX;
const SCROLL_REVEAL_FX = DESKTOP_SCROLL_FX;

function easternNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const pick = (t) => parts.find((p) => p.type === t)?.value ?? "";
  const dayIndex = Math.max(0, DAYS.indexOf(pick("weekday")));
  return { dayIndex, nowMin: Number(pick("hour")) * 60 + Number(pick("minute")) };
}

function nextOpenDay(from) {
  for (let i = 1; i <= 7; i++) {
    const row = HOURS[(from + i) % 7];
    if (!row.closed) return row.day;
  }
  return "Monday";
}

function getStatus() {
  const { dayIndex, nowMin } = easternNow();
  const today = HOURS[dayIndex];
  if (!today.closed && nowMin >= today.openMin && nowMin < today.closeMin) {
    const remaining = today.closeMin - nowMin;
    return {
      open: true,
      dayIndex,
      nowMin,
      label: "Open now",
      detail: remaining <= 60 ? `Closes in ${remaining} min` : "Closes at 9:00 PM",
    };
  }
  if (today.closed) {
    return { open: false, dayIndex, nowMin, label: "Closed today", detail: "Check the Events page for the latest schedule" };
  }
  if (!today.closed && nowMin < today.openMin) {
    return { open: false, dayIndex, nowMin, label: "Closed", detail: "Opens today at 5:00 PM" };
  }
  return { open: false, dayIndex, nowMin, label: "Closed", detail: `Opens ${nextOpenDay(dayIndex)} at 5:00 PM` };
}

function renderBadge(el, status) {
  const compact = el.hasAttribute("data-compact");
  el.classList.toggle("is-open", status.open);
  el.innerHTML = `<span class="dot"></span><span class="label">${status.label}</span>${
    compact ? "" : `<span class="detail">· ${status.detail}</span>`
  }`;
}

function tcgHTML(card) {
  return `<article class="tcg" data-tilt data-rarity="${card.rarity}">
      <div class="tcg-face">
        <span class="tcg-set">CG · ${card.no}</span>
        <div class="tcg-art">${responsiveImage({ src: card.art, widths: [240, 400, 640], sizes: "(min-width: 960px) 240px, (min-width: 640px) 45vw, 50vw", width: 400, height: 400, loading: "lazy" })}</div>
        <div class="tcg-plate"><h4>${card.name}</h4><span>${card.rarity}</span></div>
        <p class="tcg-flavor">${card.note}</p>
        <span class="tcg-foil" aria-hidden="true"></span>
      </div>
    </article>`;
}

function renderGames() {
  const grid = $("#gamesGrid");
  if (!grid) return;
  grid.innerHTML = GAMES.map((g) => tcgHTML(g)).join("");
}

function renderHours(status) {
  const list = $("#hoursList");
  if (!list) return;
  list.innerHTML = HOURS.map((h, i) => {
    const time = h.closed ? "Closed" : `${h.open} – ${h.close}`;
    return `<li class="${i === status.dayIndex ? "today" : ""}"><span class="d">${h.day}</span><span class="t">${time}</span></li>`;
  }).join("");
}

function renderClock(status) {
  const clock = $("#clock");
  if (clock) {
    const time = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());
    clock.textContent = `${time} in Wolcott`;
  }
  const meter = $("#dayMeter");
  if (!meter) return;
  const today = HOURS[status.dayIndex];
  if (!status.open || today.closed) {
    meter.hidden = true;
    return;
  }
  const span = today.closeMin - today.openMin;
  const pct = Math.min(100, Math.max(0, ((status.nowMin - today.openMin) / span) * 100));
  meter.hidden = false;
  meter.firstElementChild.style.setProperty("--m", `${pct}%`);
  meter.firstElementChild.style.width = `${pct}%`;
}

function shot(i, extra = "") {
  const p = PHOTOS[i];
  const cls = ["shot", extra, p.wide ? "shot--wide" : "", p.top ? "shot--top" : ""].filter(Boolean).join(" ");
  return `<button class="${cls}" type="button" data-photo="${i}">
    ${responsiveImage({ src: p.src, widths: p.widths, sizes: "(min-width: 1200px) 600px, (min-width: 768px) 50vw, 100vw", alt: p.alt, width: p.w, height: p.h })}
    <span class="gleam" aria-hidden="true"></span>
    <span>${p.caption}</span>
  </button>`;
}

function renderGalleries() {
  const gallery = $("#gallery");
  const play = $("#playGrid");
  if (gallery) gallery.innerHTML = [0, 1, 2, 3, 4, 5].map((i) => shot(i)).join("");
  if (play) play.innerHTML = [6, 7, 8].map((i) => shot(i)).join("");
}

function initNav() {
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 16);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const menu = $("#navMenu");
  const toggle = $("#navToggle");
  const closeBtn = $("#navClose");
  const open = () => {
    menu.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  toggle?.addEventListener("click", () => (menu.hidden ? open() : close()));
  closeBtn?.addEventListener("click", close);
  menu?.addEventListener("click", (e) => { if (e.target === menu) close(); });
  $$("#navMenu a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

function initLightbox() {
  const dialog = $("#lightbox");
  const avif = $("#lightboxAvif");
  const webp = $("#lightboxWebp");
  const img = $("#lightboxImg");
  const cap = $("#lightboxCap");
  const count = $("#lightboxCount");
  const strip = $("#lightboxStrip");
  if (!dialog) return;
  let index = 0;
  let startX = 0;

  if (strip) {
    strip.innerHTML = PHOTOS.map((p, i) => `<button type="button" data-jump="${i}" aria-label="${p.caption}"><img src="${p.src}" alt="" width="56" height="72" loading="lazy" decoding="async"></button>`).join("");
  }

  const show = (i) => {
    index = (i + PHOTOS.length) % PHOTOS.length;
    const p = PHOTOS[index];
    avif.removeAttribute("srcset");
    webp.srcset = p.src;
    img.sizes = "100vw";
    img.src = p.src;
    img.alt = p.alt;
    cap.textContent = p.caption;
    if (count) count.textContent = `${index + 1} / ${PHOTOS.length}`;
    strip?.querySelectorAll("button").forEach((b, n) => b.classList.toggle("is-on", n === index));
    if (!dialog.open) dialog.showModal();
  };

  document.addEventListener("click", (e) => {
    const jump = e.target.closest("[data-jump]");
    if (jump && dialog.contains(jump)) {
      show(Number(jump.dataset.jump));
      return;
    }
    const btn = e.target.closest("[data-photo]");
    if (btn) show(Number(btn.dataset.photo));
  });
  dialog.querySelector("[data-close]")?.addEventListener("click", () => dialog.close());
  dialog.querySelector("[data-prev]")?.addEventListener("click", () => show(index - 1));
  dialog.querySelector("[data-next]")?.addEventListener("click", () => show(index + 1));
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener("touchstart", (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
  dialog.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (dx > 48) show(index - 1);
    if (dx < -48) show(index + 1);
  }, { passive: true });
  document.addEventListener("keydown", (e) => {
    if (!dialog.open) return;
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
}

function bindTilt(scope = document) {
  if (REDUCE || !FINE) return;
  $$("[data-tilt]", scope).forEach((el) => {
    if (el.dataset.tiltBound) return;
    el.dataset.tiltBound = "1";
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--px", x.toFixed(3));
      el.style.setProperty("--py", y.toFixed(3));
      el.style.setProperty("--ry", `${((x - 0.5) * 14).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${((0.5 - y) * 10).toFixed(2)}deg`);
      el.classList.add("is-lit");
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--rx", "0deg");
      el.classList.remove("is-lit");
    });
  });
}

function initTilt() {
  bindTilt();
}

function initMagnetic() {
  if (REDUCE || !FINE) return;
  $$("[data-magnetic]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.28}px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });
}

function initScrollFx() {
  const sprog = $("#sprog");
  const photo = $("#heroPhoto");
  const word = $("#wordmark");
  const tick = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, scrollY / max) : 0;
    if (sprog) sprog.style.setProperty("--p", `${(p * 100).toFixed(2)}%`);
    if (REDUCE || !HERO_SCROLL_FX) return;
    const heroP = Math.min(1, scrollY / (innerHeight * 0.72));
    if (photo) photo.style.setProperty("--hero-y", `${(heroP * 70).toFixed(1)}px`);
    if (word) word.style.setProperty("--rubber", `${(-0.04 + heroP * 0.07).toFixed(3)}em`);
  };
  tick();
  window.addEventListener("scroll", tick, { passive: true });
}

function initReveal() {
  const nodes = $$(".reveal");
  if (!nodes.length) return;
  if (REDUCE || !SCROLL_REVEAL_FX || !("IntersectionObserver" in window)) {
    nodes.forEach((n) => n.classList.add("is-in"));
    return;
  }
  document.documentElement.classList.add("reveal-ready");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  nodes.forEach((n) => io.observe(n));
}

function initCopy() {
  const toast = $("#toast");
  let hide;
  const ping = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add("is-on"));
    clearTimeout(hide);
    hide = setTimeout(() => {
      toast.classList.remove("is-on");
      setTimeout(() => { toast.hidden = true; }, 280);
    }, 1800);
  };
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy") || "";
      try {
        await navigator.clipboard.writeText(text);
        ping("Address copied");
      } catch {
        ping("Copy from the listing");
      }
    });
  });
}

function initEaster() {
  const sun = $("#sunMark");
  const photo = $("#heroPhoto");
  let taps = 0;
  sun?.addEventListener("click", () => {
    taps += 1;
    if (taps < 7) return;
    taps = 0;
    document.documentElement.classList.add("gear5");
    setTimeout(() => document.documentElement.classList.remove("gear5"), 900);
  });
  photo?.addEventListener("click", () => {
    if (REDUCE) return;
    photo.classList.remove("is-bounce");
    void photo.offsetWidth;
    photo.classList.add("is-bounce");
  });
}

function initCaseReveal() {
  const region = $("#caseRevealRegion");
  const button = $("#caseReveal");
  const label = button?.querySelector(".case-reveal-label");
  if (!region || !button || !label) return;

  const setOpen = (open) => {
    region.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
    label.textContent = open ? "Close the case" : "Open the case";
  };

  button.addEventListener("click", () => setOpen(!region.classList.contains("is-open")));
}

function initOfferFlow() {
  const form = $("#offerForm");
  const photos = $("#offerPhotos");
  const count = $("#offerPhotoCount");
  const status = $("#offerStatus");

  photos?.addEventListener("change", () => {
    const total = Math.min(photos.files.length, 6);
    if (photos.files.length > 6) {
      count.textContent = `${total} selected · first 6 suggested`;
      return;
    }
    count.textContent = total ? `${total} photo${total === 1 ? "" : "s"} selected` : "Optional · up to 6";
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const type = data.get("offerType");
    const category = data.get("offerCategory");
    const details = String(data.get("offerDetails") || "").trim();
    const photoTotal = Math.min(photos?.files.length || 0, 6);
    const body = [
      "Hi Conspiracy — I’d like to start an offer.",
      `I want to: ${type}.`,
      `I’m bringing: ${category}.`,
      details ? `Quick inventory: ${details}` : "Quick inventory: I’ll share the details in person.",
      photoTotal ? `I have ${photoTotal} photo${photoTotal === 1 ? "" : "s"} to add.` : "",
    ].filter(Boolean).join("\n");
    if (status) status.textContent = "Your text draft is ready. Add the selected photos to the message before you send it.";
    window.location.href = "https://www.conspiracygamingtts.com/events";
  });

  $$('[data-interest]').forEach((button) => {
    button.addEventListener("click", () => {
      const interest = button.dataset.interest;
      const body = `Hi Conspiracy — please let me know when ${interest} events or tables are posted.`;
      window.location.href = "https://www.conspiracygamingtts.com/events";
    });
  });
}

function tickStatus() {
  const status = getStatus();
  $$("[data-open-badge]").forEach((el) => renderBadge(el, status));
  renderHours(status);
  renderClock(status);
  return status;
}

document.addEventListener("DOMContentLoaded", () => {
  renderGames();
  renderGalleries();
  tickStatus();
  initNav();
  initLightbox();
  initCaseReveal();
  initTilt();
  initMagnetic();
  initScrollFx();
  initReveal();
  initCopy();
  initEaster();
  initOfferFlow();
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
  const track = $("#marquee");
  if (track) track.innerHTML += track.innerHTML;
  setInterval(tickStatus, 30_000);
});

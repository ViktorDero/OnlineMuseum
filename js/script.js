/* =====================================================================
   VIKTORS FOSSIELENKAST — INTERACTIE (geen externe bibliotheken)
   ===================================================================== */
'use strict';

/* ---------- 1. Mobiel menu ---------- */
const menuKnop = document.querySelector('.menu-knop');
const menu = document.querySelector('.menu');
if (menuKnop && menu) {
  menuKnop.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuKnop.setAttribute('aria-expanded', String(open));
  });
}

/* ---------- 2. Rustig verschijnen bij scrollen ---------- */
const verschijnen = document.querySelectorAll('.verschijn');
if ('IntersectionObserver' in window) {
  const kijker = new IntersectionObserver((items) => {
    items.forEach((item) => {
      if (item.isIntersecting) { item.target.classList.add('zichtbaar'); kijker.unobserve(item.target); }
    });
  }, { threshold: 0.08 });
  verschijnen.forEach((el) => kijker.observe(el));
} else {
  verschijnen.forEach((el) => el.classList.add('zichtbaar'));
}

/* ---------- 3. Fotogalerij op objectpagina's ---------- */
const hoofdFoto = document.querySelector('.galerij .hoofd img');
document.querySelectorAll('.duimen button').forEach((knop) => {
  knop.addEventListener('click', () => {
    hoofdFoto.src = knop.dataset.foto;
    hoofdFoto.alt = knop.dataset.alt;
    document.querySelectorAll('.duimen button').forEach((b) => b.setAttribute('aria-pressed', String(b === knop)));
  });
});

/* ---------- 4. Lichtbak: klik op een foto om te vergroten ---------- */
const lichtbak = document.getElementById('lichtbak');
if (lichtbak) {
  const groot = lichtbak.querySelector('img');
  document.querySelectorAll('.zoom').forEach((el) => {
    el.addEventListener('click', () => {
      const img = el.tagName === 'IMG' ? el : el.querySelector('img');
      groot.src = img.src; groot.alt = img.alt;
      lichtbak.showModal();
    });
  });
  lichtbak.querySelector('button').addEventListener('click', () => lichtbak.close());
  lichtbak.addEventListener('click', (e) => { if (e.target === lichtbak) lichtbak.close(); });
}

/* ---------- 5. Verkenners (tandenplaat én eigen vondsten) ----------
   Elk element met data-info="id" toont bij hover/klik de tekst uit
   het verborgen blok <div class="info-bron" id="id"> in het paneel. */
document.querySelectorAll('[data-verkenner]').forEach((verkenner) => {
  const paneel = verkenner.querySelector('[data-paneel]');
  const knoppen = verkenner.querySelectorAll('[data-info]');
  function toon(knop) {
    const bron = document.getElementById(knop.dataset.info);
    if (!bron) return;
    paneel.innerHTML = bron.innerHTML;
    knoppen.forEach((k) => k.classList.toggle('actief', k === knop));
  }
  knoppen.forEach((knop) => {
    knop.addEventListener('mouseenter', () => toon(knop));
    knop.addEventListener('focus', () => toon(knop));
    knop.addEventListener('click', () => {
      toon(knop);
      if (window.innerWidth < 1000) paneel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
  if (verkenner.hasAttribute('data-start')) toon(knoppen[0]);
});

/* ---------- 6. Zoeken & filteren in de collectie ---------- */
const zoekveld = document.getElementById('zoeken');
if (zoekveld) {
  const kaarten = document.querySelectorAll('[data-zoek]');
  const filters = document.querySelectorAll('.filter');
  const teller = document.getElementById('teller');
  let gekozen = 'Alles';
  function filter() {
    const woord = zoekveld.value.trim().toLowerCase();
    let aantal = 0;
    kaarten.forEach((k) => {
      const past = (gekozen === 'Alles' || k.dataset.cat === gekozen) && k.dataset.zoek.includes(woord);
      k.hidden = !past; if (past) aantal++;
    });
    teller.textContent = aantal + (aantal === 1 ? ' stuk gevonden' : ' stukken gevonden');
  }
  filters.forEach((f) => f.addEventListener('click', () => {
    gekozen = f.dataset.filter;
    filters.forEach((x) => x.setAttribute('aria-pressed', String(x === f)));
    filter();
  }));
  zoekveld.addEventListener('input', filter);
  filter();
}

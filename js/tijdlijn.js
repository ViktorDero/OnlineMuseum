/* =====================================================================
   TIJDLIJN: wisselende sfeerachtergrond + tijdmachine
   De teksten per periode staan in tijdlijn.html.
   ===================================================================== */
'use strict';

const blokken = Array.from(document.querySelectorAll('.periode-blok'));
const achtergronden = document.querySelectorAll('.tijd-achtergrond img');

/* Toon de achtergrond van een periode (zachte overgang) */
function zetAchtergrond(id) {
  achtergronden.forEach((img) => img.classList.toggle('actief', img.dataset.periode === id));
}

/* 1. Bij scrollen: de periode in het midden van het scherm bepaalt de achtergrond */
if ('IntersectionObserver' in window) {
  const kijker = new IntersectionObserver((items) => {
    items.forEach((item) => { if (item.isIntersecting) zetAchtergrond(item.target.id); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  blokken.forEach((b) => kijker.observe(b));
}

/* 2. Tijdmachine bovenaan */
const schuif = document.getElementById('tijdschuif');
const knoppenBalk = document.getElementById('periode-knoppen');
const MAX = 538.8;
const formaat = new Intl.NumberFormat('nl-BE', { maximumFractionDigits: 1 });

blokken.forEach((b) => {
  const knop = document.createElement('button');
  knop.type = 'button';
  knop.textContent = b.dataset.naam;
  knop.addEventListener('click', () => {
    schuif.value = String(Math.round((MAX - (Number(b.dataset.start) + Number(b.dataset.einde)) / 2) * 10));
    toon();
  });
  knoppenBalk.append(knop);
});

function toon() {
  const ma = MAX - Number(schuif.value) / 10;
  let index = blokken.findIndex((b) => ma <= Number(b.dataset.start) && ma >= Number(b.dataset.einde));
  if (index < 0) index = 0;
  const b = blokken[index];
  document.getElementById('tm-leeftijd').textContent = ma < 0.05 ? 'Vandaag' : formaat.format(ma) + ' miljoen jaar geleden';
  document.getElementById('tm-naam').textContent = b.dataset.naam;
  document.getElementById('tm-tekst').textContent = b.dataset.kort;
  const link = document.getElementById('tm-link');
  link.href = '#' + b.id;
  link.textContent = 'Ga naar het ' + b.dataset.naam + ' ↓';
  knoppenBalk.querySelectorAll('button').forEach((k, i) => k.setAttribute('aria-pressed', String(i === index)));
  schuif.setAttribute('aria-valuetext', b.dataset.naam + ', ' + document.getElementById('tm-leeftijd').textContent);
  zetAchtergrond(b.id);
}

/* 3. Afspelen / pauzeren */
let timer = null;
const speel = document.getElementById('tm-speel');
function stop() { clearInterval(timer); timer = null; speel.textContent = '▶ Speel af'; }
speel.addEventListener('click', () => {
  if (timer) { stop(); return; }
  if (Number(schuif.value) >= Number(schuif.max)) schuif.value = '0';
  speel.textContent = '❚❚ Pauze';
  timer = setInterval(() => {
    schuif.value = String(Number(schuif.value) + 15);
    toon();
    if (Number(schuif.value) >= Number(schuif.max)) stop();
  }, 80);
});
schuif.addEventListener('input', () => { if (timer) stop(); toon(); });
toon();

// Illustrated scenes for the Renault Duster test-drive demo, built in Node at build time.
// People are Desi Log characters (Juhi Chitra, desilog.in, CC BY 4.0) drawn by the HUL CDP v2
// people kit (../kit/people.js); the Duster is car.mjs. Stage: 1280 × 760, floor at y = 600.
import { person, bubble, bubbleH, hlTag, okPill, wallClock, plant, esc, tW, wrapW } from '../kit/people.js';
import { carSide, renaultMark } from './car.mjs';

export const W = 1280;
export const H = 760;
const F = 600;
const S = 1; // people scale; the car is drawn at ~1.4 so it reads true to life
const head = (o = {}) => F - (o.sit ? 283 : 319) * (o.s ?? S);
const INK = '#0f172a';
const NAVY = '#0a3578';
const BLUE = '#1f4fd1';
const ORANGE = '#ff6b00';
const YELLOW = '#efdf00';
const BLACK = '#17181c';

// ───────────────────────────── the cast ─────────────────────────────
// A Renault lanyard and ID card on the chest (drawn under the role label).
const lanyard = `<path d="M-14 -254L0 -196L14 -254" stroke="${YELLOW}" stroke-width="5" fill="none" stroke-linejoin="round"/><rect x="-11" y="-198" width="22" height="30" rx="3" fill="#fff" stroke="#161616" stroke-width="1.4"/>${renaultMark(0, -188, 10, BLACK, 1.1)}<rect x="-7" y="-178" width="14" height="3" fill="#94a3b8"/>`;
export const CAST = {
  shubham: { desi: 'p94', label: 'CUSTOMER', labelInk: NAVY },
  ranjan: { desi: 'p85', label: 'SALES CONSULTANT', labelInk: BLACK, front: lanyard },
  manager: { desi: 'p98', label: 'SHOWROOM MANAGER', labelInk: BLACK, front: lanyard },
  wife: { desi: 'p63', label: '' },
};
const who = (base, o) => person({ s: S, y: F, ...CAST[base], ...o });

// A head-and-shoulders crop of a cast member, for profile pictures.
export function avatar(base, bg = '#eaf0fb') {
  const p = person({ ...CAST[base], x: 0, y: 0, s: 1, label: '', front: '' });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-58 -336 116 116" preserveAspectRatio="xMidYMid slice"><rect x="-80" y="-360" width="160" height="200" fill="${bg}"/>${p}</svg>`;
}

// ───────────────────────────── shared props ─────────────────────────────
const plane = (wall, floor, line) => `<rect x="-20" y="-20" width="${W + 40}" height="${F + 20}" fill="${wall}"/><rect x="-20" y="${F}" width="${W + 40}" height="${H - F + 20}" fill="${floor}"/><rect x="-20" y="${F}" width="${W + 40}" height="3" fill="${line}"/>`;
const sayAt = (x, lines, o = {}) => {
  const fs = o.fs || 22;
  const h = bubbleH(lines.length, fs);
  const w = Math.ceil(Math.max(...lines.map((l) => tW(l, fs)))) + 40;
  const bx = Math.max(16, Math.min(W - w - 16, o.bx ?? x - w / 2));
  const top = (o.tip ?? head(o) - 12) - 18 - h;
  return bubble(bx, top, lines, { tx: x, fs, cls: 'sv-pop', style: `animation-delay:${o.d ?? 0.35}s`, stroke: NAVY });
};
const tag = (x, y, lines, d, o = {}) => hlTag(x, y, lines, { bg: NAVY, sub: '#c7d6f5', cls: 'sv-pop', style: `animation-delay:${d}s`, ...o });
const keyFob = (hx, hy) => `<g><rect x="${hx - 9}" y="${hy - 22}" width="18" height="28" rx="7" fill="${BLACK}"/>${renaultMark(hx, hy - 13, 9, '#cfd4da', 1)}<circle cx="${hx}" cy="${hy - 1}" r="2.6" fill="#9aa3ad"/><path d="M${hx} ${hy - 22}v-10" stroke="#9aa3ad" stroke-width="2.5"/><circle cx="${hx}" cy="${hy - 36}" r="6" fill="none" stroke="#9aa3ad" stroke-width="2.5"/></g>`;
const phoneInHand = (hx, hy, scr = '#25d366') => `<g><rect x="${hx - 13}" y="${hy - 40}" width="26" height="48" rx="5" fill="#111827"/><rect x="${hx - 10}" y="${hy - 36}" width="20" height="38" rx="2" fill="${scr}"/></g>`;
const tablet = (hx, hy, o = {}) => {
  const w = 74,
    h = 96,
    x = hx - w / 2,
    y = hy - h + 24;
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="#1b1d22"/><rect x="${x + 5}" y="${y + 6}" width="${w - 10}" height="${h - 12}" rx="2" fill="#f4f6f8"/>
    <rect x="${x + 5}" y="${y + 6}" width="${w - 10}" height="15" fill="${NAVY}"/><text x="${x + 10}" y="${y + 17}" font-size="7.5" font-weight="800" fill="#fff">FreeStand Dealer</text>
    <rect x="${x + 10}" y="${y + 27}" width="${w - 20}" height="26" rx="3" fill="#fff" stroke="#cbd5e1"/><rect x="${x + 14}" y="${y + 32}" width="14" height="8" rx="2" fill="#16a34a"/><text x="${x + 16}" y="${y + 38.5}" font-size="6" font-weight="900" fill="#fff">A</text><rect x="${x + 32}" y="${y + 32}" width="${w - 48}" height="4" fill="#94a3b8"/><rect x="${x + 32}" y="${y + 40}" width="${w - 58}" height="4" fill="#cbd5e1"/>
    <rect x="${x + 10}" y="${y + h - 30}" width="${w - 20}" height="13" rx="3" fill="${o.ok ? '#16a34a' : ORANGE}"/><text x="${x + w / 2}" y="${y + h - 21}" text-anchor="middle" font-size="7" font-weight="800" fill="#fff">${o.ok ? 'ACCEPTED ✓' : 'ACCEPT LEAD'}</text></g>`;
};
const tree = (cx, by, s = 1) => `<g transform="translate(${cx} ${by}) scale(${s})"><rect x="-8" y="-120" width="16" height="120" fill="#7a5230"/><circle cx="0" cy="-150" r="62" fill="#4c9a4c"/><circle cx="-40" cy="-120" r="40" fill="#5aa95a"/><circle cx="42" cy="-124" r="42" fill="#3f8a3f"/><circle cx="6" cy="-196" r="38" fill="#5aa95a"/></g>`;

// The Renault AI voice-call card: black header with the diamond, waveform, transcript.
function callCard(x, y, w, o = {}) {
  const fs = o.fs || 17,
    lh = fs + 6;
  const ind = 92;
  const rows = (o.lines || []).map((l) => ({ ...l, wr: wrapW([l.text], fs, w - ind - 18) }));
  let bars = '';
  for (let i = 0; i < 30; i++) {
    const bh = 8 + ((i * 37) % 23);
    bars += `<rect x="${x + 24 + i * ((w - 48) / 30)}" y="${y + 92 - bh / 2}" width="${(w - 48) / 30 - 4}" height="${bh}" rx="2" fill="#22c55e" class="wbar" style="animation-delay:${(i % 7) * 0.11}s"/>`;
  }
  let ty = y + 134;
  const body = rows
    .map((r, k) => {
      const ai = r.who === 'ai';
      const chip = ai ? 'AI · ARIA' : r.name || 'SHUBHAM';
      const out = `<g class="sv-pop" style="animation-delay:${0.5 + k * 0.9}s"><rect x="${x + 18}" y="${ty - 14}" width="${ind - 26}" height="20" rx="10" fill="${ai ? NAVY : ORANGE}"/><text x="${x + 18 + (ind - 26) / 2}" y="${ty + 1}" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" letter-spacing=".6">${esc(chip)}</text>${r.wr
        .map((l, i) => `<text x="${x + ind}" y="${ty + 2 + i * lh}" font-size="${fs}" font-weight="${ai ? 600 : 700}" fill="${ai ? '#334155' : INK}">${esc(l)}</text>`)
        .join('')}</g>`;
      ty += r.wr.length * lh + 14;
      return out;
    })
    .join('');
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${ty - y + 6}" rx="18" fill="#fff" stroke="${NAVY}" stroke-width="3" filter="url(#sh)"/>
    <path d="M${x + 18} ${y}H${x + w - 18}Q${x + w} ${y} ${x + w} ${y + 18}V${y + 60}H${x}V${y + 18}Q${x} ${y} ${x + 18} ${y}Z" fill="${BLACK}"/>
    <rect x="${x + 14}" y="${y + 11}" width="38" height="38" rx="9" fill="${BLACK}" stroke="${YELLOW}" stroke-width="2"/>${renaultMark(x + 33, y + 30, 26, '#fff', 2.2)}
    <text x="${x + 64}" y="${y + 27}" font-size="12.5" font-weight="800" fill="#fff" letter-spacing="1.4">${esc(o.title || 'AI VOICE CALL')}</text>
    <text x="${x + 64}" y="${y + 46}" font-size="12.5" font-weight="600" fill="#b8bec7">${esc(o.sub || '')}</text>
    <circle cx="${x + w - 64}" cy="${y + 30}" r="6" fill="#22c55e" class="blink"/><text x="${x + w - 52}" y="${y + 35}" font-size="15" font-weight="800" fill="#fff">${esc(o.dur || '0:41')}</text>
    ${bars}<line x1="${x + 18}" y1="${y + 112}" x2="${x + w - 18}" y2="${y + 112}" stroke="#e5e7eb"/>${body}</g>`;
}

const defs = `<defs><filter id="sh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#0b1220" flood-opacity=".18"/></filter>
<linearGradient id="spot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1a33"/><stop offset="1" stop-color="#2b3a5c"/></linearGradient>
<linearGradient id="day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd9f2"/><stop offset="1" stop-color="#e3eef8"/></linearGradient>
<linearGradient id="adbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#17181c"/><stop offset="1" stop-color="#3b2a12"/></linearGradient></defs>`;

function skyline(x, y, w, h, night) {
  let b = '';
  const cols = night ? ['#1d2945', '#22314f', '#18233d'] : ['#9fb4c9', '#b3c4d6', '#8ea5bd'];
  let cx = x - 10;
  let i = 0;
  while (cx < x + w) {
    const bw = 38 + ((i * 29) % 34),
      bh = h * (0.35 + ((i * 17) % 40) / 100);
    b += `<rect x="${cx}" y="${y + h - bh}" width="${bw}" height="${bh}" fill="${cols[i % 3]}"/>`;
    if (night) for (let r = 0; r < bh / 22 - 1; r++) for (let c = 0; c < bw / 14 - 1; c++) if ((r * 7 + c * 3 + i) % 4 === 0) b += `<rect x="${cx + 6 + c * 12}" y="${y + h - bh + 8 + r * 20}" width="5" height="7" fill="#f8d77a" opacity=".85"/>`;
    cx += bw + 4;
    i++;
  }
  return `<g><clipPath id="sk${x}${y}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#sk${x}${y})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${night ? 'night' : 'day'})"/>${night ? `<circle cx="${x + w * 0.78}" cy="${y + 50}" r="16" fill="#f1f5f9" opacity=".9"/>` : ''}${b}</g></g>`;
}

// ───────────────────────────── 1. the ad, at home ─────────────────────────────
function sceneAd() {
  let s = plane('#ece6dd', '#c9ad8b', '#b8996f');
  s += `<rect x="70" y="60" width="330" height="330" rx="4" fill="#6b5a48"/>${skyline(82, 72, 306, 306, true)}<rect x="233" y="72" width="6" height="306" fill="#6b5a48"/>
    <path d="M52 44h70v380q-35 8-70 0z" fill="#b9825b"/><path d="M348 44h70v380q-35 8-70 0z" fill="#b9825b"/><rect x="40" y="36" width="390" height="10" rx="5" fill="#5b4636"/>`;
  s += wallClock(520, 120, 9, 12, 30);
  s += `<rect x="478" y="260" width="6" height="340" fill="#3f3f46"/><path d="M450 260h62l-12 -60h-38z" fill="#f5e6c8"/><ellipse cx="481" cy="${F}" rx="34" ry="6" fill="#3f3f46"/><path d="M450 260l-60 340h182l-60 -340z" fill="#fff6d6" opacity=".18"/>`;
  s += `<rect x="560" y="364" width="420" height="140" rx="26" fill="#56657a"/><rect x="540" y="430" width="54" height="150" rx="20" fill="#4b586b"/><rect x="946" y="430" width="54" height="150" rx="20" fill="#4b586b"/>
    <rect x="580" y="486" width="380" height="64" rx="16" fill="#62738a"/><rect x="560" y="546" width="420" height="34" rx="10" fill="#4b586b"/><rect x="584" y="580" width="12" height="20" fill="#2f3440"/><rect x="944" y="580" width="12" height="20" fill="#2f3440"/>
    <rect x="610" y="400" width="96" height="74" rx="18" fill="#c99b4b"/>`;
  s += who('shubham', { x: 790, sit: true, y: F - 20, armR: 'hold', itemR: (hx, hy) => phoneInHand(hx, hy, BLACK) });
  s += plant(1210, F, 1.3);
  // the phone, zoomed: an Instagram ad for the Duster
  const px = 1000,
    py = 46,
    pw = 236,
    ph = 470;
  s += `<path d="M820 ${F - 270} C 880 ${F - 330}, 940 ${py + 270}, ${px} ${py + 260}" stroke="${ORANGE}" stroke-width="2.5" stroke-dasharray="6 6" fill="none" class="flow"/>`;
  s += `<g class="sv-pop" style="animation-delay:.15s" filter="url(#sh)"><rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="30" fill="#111"/><rect x="${px + 9}" y="${py + 10}" width="${pw - 18}" height="${ph - 20}" rx="22" fill="#fff"/>
    <rect x="${px + pw / 2 - 30}" y="${py + 16}" width="60" height="9" rx="4.5" fill="#111"/>
    <circle cx="${px + 32}" cy="${py + 50}" r="13" fill="${BLACK}"/>${renaultMark(px + 32, py + 50, 15, '#fff', 1.6)}
    <text x="${px + 52}" y="${py + 48}" font-size="12" font-weight="800" fill="#111">renaultindia</text><text x="${px + 52}" y="${py + 62}" font-size="10" fill="#6b7280">Sponsored</text><text x="${px + pw - 30}" y="${py + 54}" font-size="16" font-weight="800" fill="#111">⋯</text>
    <rect x="${px + 9}" y="${py + 74}" width="${pw - 18}" height="240" fill="url(#adbg)"/>
    <text x="${px + 24}" y="${py + 106}" font-size="11" font-weight="700" fill="${YELLOW}" letter-spacing="2">THE NEW</text>
    <text x="${px + 24}" y="${py + 136}" font-size="27" font-weight="900" fill="#fff" letter-spacing="1">DUSTER</text>
    <text x="${px + 24}" y="${py + 156}" font-size="11" font-weight="600" fill="#cbd5e1">1.3 Turbo · automatic · 4x4 ready</text>
    ${carSide(px + 14, py + 292, { s: 0.4, id: 'adcar', badge: false })}
    <rect x="${px + 9}" y="${py + 314}" width="${pw - 18}" height="38" fill="${YELLOW}"/><text x="${px + 22}" y="${py + 338}" font-size="12.5" font-weight="800" fill="#111">Book a test drive</text><text x="${px + pw - 26}" y="${py + 338}" font-size="15" font-weight="800" fill="#111">›</text>
    <text x="${px + 22}" y="${py + 378}" font-size="15">♡  💬  ➤</text><text x="${px + 22}" y="${py + 402}" font-size="11" font-weight="700" fill="#111">24,610 likes</text>
    <text x="${px + 22}" y="${py + 420}" font-size="10.5" fill="#374151"><tspan font-weight="800">renaultindia</tspan> Test drive at home or at</text><text x="${px + 22}" y="${py + 435}" font-size="10.5" fill="#374151">the showroom, booked in 60 s.</text>
    <circle cx="${px + pw / 2 + 2}" cy="${py + 333}" r="20" fill="none" stroke="${ORANGE}" stroke-width="3" class="blink"/></g>`;
  s += sayAt(790, ['Duster ka test drive…', 'ghar pe bhi aa jaayega?'], { sit: true, bx: 540 });
  s += tag(40, 440, ['AD CLICK · INSTAGRAM', 'utm: duster_td_delhi · 9:12 PM'], 0.8);
  return s;
}

// ───────────────────────────── 2. three nearest dealers ─────────────────────────────
export const DEALERS = [
  { id: 'kn', name: 'Renault Kirti Nagar', km: '3.2', x: 820, y: 320 },
  { id: 'pb', name: 'Renault Punjabi Bagh', km: '5.4', x: 540, y: 170 },
  { id: 'jp', name: 'Renault Janakpuri', km: '6.1', x: 290, y: 560 },
];
function sceneMap(o = {}) {
  const home = { x: 640, y: 400 };
  let s = `<rect x="-20" y="-20" width="${W + 40}" height="${H + 40}" fill="#eef1f4"/>`;
  s += `<path d="M80 50h210v150h-210z M960 480h230v200h-230z M410 600h170v140h-170z" fill="#d7ebd5"/><path d="M1080 -20C1060 200 1140 380 1120 560S1180 820 1160 900h160v-920z" fill="#cfe3f3"/>`;
  for (let i = 0; i < 18; i++) for (let j = 0; j < 11; j++) if ((i * 3 + j * 5) % 7 > 2) s += `<rect x="${i * 74 + 8}" y="${j * 74 + 8}" width="58" height="58" rx="4" fill="#e3e7ec"/>`;
  const road = (d, w = 18) => `<path d="${d}" stroke="#cfd6df" stroke-width="${w + 6}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#fff" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  s += road('M-20 400H1300', 26) + road('M640 -20V900', 18) + road('M-20 100C300 140 700 40 1300 140', 22) + road('M100 900C300 600 520 490 900 280S1200 110 1300 50', 22) + road('M-20 660C400 640 800 720 1300 680', 16);
  s += `<path d="M-20 440C300 450 520 440 700 410S1100 350 1300 370" stroke="#2b6cd6" stroke-width="5" stroke-dasharray="14 8" fill="none" opacity=".75"/>`;
  const label = (x, y, t, r = 0) => `<text x="${x}" y="${y}" font-size="13" font-weight="700" fill="#8a94a3" letter-spacing="1" transform="rotate(${r} ${x} ${y})">${t}</text>`;
  s += label(40, 390, 'NAJAFGARH ROAD') + label(652, 30, 'PATEL ROAD', 90) + label(120, 130, 'RING ROAD', 2) + label(900, 230, 'SHIVAJI MARG', -32) + label(1000, 672, 'PANKHA ROAD') + label(40, 470, 'METRO · BLUE LINE');
  s += `<circle cx="${home.x}" cy="${home.y}" r="320" fill="${BLUE}" fill-opacity=".04" stroke="${NAVY}" stroke-width="2" stroke-dasharray="8 8"/><text x="${home.x + 228}" y="${home.y + 250}" font-size="13" font-weight="800" fill="${NAVY}" letter-spacing="1">8 KM</text>`;
  [[150, 740, 'Dwarka · 12.8 km'], [1150, 230, 'Karol Bagh · 9.6 km'], [380, 16, 'Pitampura · 10.4 km']].forEach(([x, y, t]) => {
    s += `<g opacity=".55"><circle cx="${x}" cy="${y}" r="13" fill="#9aa3ad"/>${renaultMark(x, y, 14, '#fff', 1.4)}<text x="${x + 20}" y="${y + 5}" font-size="13" font-weight="700" fill="#6b7280">${t}</text></g>`;
  });
  DEALERS.forEach((d, i) => {
    const st = o.states?.[d.id] || 'notified';
    const col = st === 'accepted' ? '#16a34a' : st === 'withdrawn' ? '#9aa3ad' : ORANGE;
    const sub = `${d.km} km · ${st === 'accepted' ? 'Accepted in 1 m 48 s' : st === 'withdrawn' ? 'Offer withdrawn' : 'Lead offered · 15:00'}`;
    const cw = Math.max(tW(d.name, 15), tW(sub, 12.5)) + 96;
    s += `<path d="M${home.x} ${home.y}L${d.x} ${d.y}" stroke="${col}" stroke-width="3.5" stroke-dasharray="${st === 'accepted' ? '0' : '9 7'}" class="${st === 'notified' ? 'flow' : ''}"/>`;
    s += `<g class="sv-pop" style="animation-delay:${0.4 + i * 0.35}s"><circle cx="${d.x}" cy="${d.y}" r="34" fill="${col}" opacity=".16" class="${st === 'notified' ? 'pulse' : ''}"/><path d="M${d.x} ${d.y + 8}c-16 -18 -26 -30 -26 -44a26 26 0 0 1 52 0c0 14 -10 26 -26 44z" fill="${BLACK}"/>${renaultMark(d.x, d.y - 37, 22, YELLOW, 2.2)}
      <rect x="${d.x + 32}" y="${d.y - 62}" width="${cw}" height="56" rx="10" fill="#fff" stroke="${col}" stroke-width="2.5" filter="url(#sh)"/>
      <text x="${d.x + 46}" y="${d.y - 40}" font-size="15" font-weight="800" fill="${INK}">${d.name}</text><text x="${d.x + 46}" y="${d.y - 20}" font-size="12.5" font-weight="600" fill="#64748b">${sub}</text>
      <rect x="${d.x + 32 + cw - 46}" y="${d.y - 54}" width="36" height="20" rx="10" fill="${col}"/><text x="${d.x + 32 + cw - 28}" y="${d.y - 40}" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">#${i + 1}</text></g>`;
  });
  s += `<circle cx="${home.x}" cy="${home.y}" r="46" fill="${BLUE}" opacity=".15" class="pulse"/><circle cx="${home.x}" cy="${home.y}" r="24" fill="${BLUE}" stroke="#fff" stroke-width="5"/><path d="M${home.x - 10} ${home.y + 7}v-10l10 -8 10 8v10z" fill="#fff"/>
    <rect x="${home.x - 128}" y="${home.y + 34}" width="256" height="52" rx="10" fill="${NAVY}"/><text x="${home.x}" y="${home.y + 56}" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">Shubham K. · Rajouri Garden</text><text x="${home.x}" y="${home.y + 75}" text-anchor="middle" font-size="12" font-weight="600" fill="#c7d6f5">PIN 110027 · address verified</text>`;
  s += tag(40, 216, ['LEAD LD-26-10419 · GRADE A', 'Offered to the 3 nearest dealers only', 'Contact masked until a dealer accepts'], 1.4, { fs: 17 });
  return s;
}

// ───────────────────────────── 3. the showroom accepts ─────────────────────────────
function sceneShowroom() {
  let s = plane('#f1f2f4', '#dcdfe4', '#c9ced6');
  for (let i = 0; i < 16; i++) s += `<line x1="${i * 100 - 40}" y1="${F}" x2="${i * 140 - 360}" y2="${H}" stroke="#cfd4db" stroke-width="1.5"/>`;
  s += `<rect x="10" y="40" width="230" height="560" fill="#b9c6d3"/>${skyline(20, 50, 210, 390, false)}<rect x="20" y="440" width="210" height="160" fill="#c7cfd8"/><rect x="121" y="40" width="8" height="560" fill="#8d99a6"/><rect x="10" y="34" width="230" height="10" fill="#8d99a6"/>`;
  s += `<rect x="440" y="10" width="860" height="590" fill="${BLACK}"/><rect x="440" y="10" width="860" height="8" fill="${YELLOW}"/>
    <g>${renaultMark(730, 92, 74, '#fff', 6)}<text x="790" y="112" font-size="50" font-weight="800" fill="#fff" letter-spacing="10" font-family="Arial, sans-serif">RENAULT</text></g>
    <text x="870" y="166" text-anchor="middle" font-size="14" font-weight="700" fill="#9aa3ad" letter-spacing="5">RENAULT KIRTI NAGAR · NEW DELHI</text>`;
  [620, 900, 1180].forEach((x) => (s += `<path d="M${x - 10} 10L${x - 150} 600H${x + 150}L${x + 10} 10Z" fill="url(#spot)" opacity=".2"/><rect x="${x - 18}" y="10" width="36" height="10" rx="3" fill="#e5e7eb"/>`));
  s += `<ellipse cx="850" cy="${F}" rx="420" ry="36" fill="#2b2f36"/><ellipse cx="850" cy="${F - 6}" rx="408" ry="30" fill="#3a3f47"/>`;
  s += `<g opacity=".16" transform="translate(0 ${2 * F - 6}) scale(1 -1)">${carSide(484, F - 3, { s: 1.4, id: 'refl', badge: false })}</g>`;
  s += carSide(484, F - 3, { s: 1.4, id: 'show' });
  s += who('manager', { x: 120 });
  s += who('ranjan', { x: 330, armR: 'forward', armL: 'forward', itemOver: (L, R) => tablet((L[0] + R[0]) / 2, (L[1] + R[1]) / 2 + 30, { ok: true }) });
  s += sayAt(330, ['Grade-A lead, 3.2 km.', 'Main le raha hoon.'], { bx: 250 });
  s += okPill(620, 200, 'LEAD ACCEPTED', '1 m 48 s · SLA 15 min', { cls: 'sv-pop', style: 'animation-delay:.9s' });
  s += tag(940, 192, ['DEALER DLR-DEL-KN-01', '3 consultants on the floor', '2 Duster demo cars free'], 1.2, { bg: ORANGE, sub: '#ffe3cc' });
  return s;
}

// ───────────────────────────── 4. the AI call ─────────────────────────────
function sceneCall() {
  let s = plane('#e6ebf2', '#cfd6df', '#bec7d3');
  s += `<rect x="50" y="60" width="380" height="340" rx="4" fill="#94a3b8"/>${skyline(60, 70, 360, 320, false)}<rect x="236" y="70" width="6" height="320" fill="#94a3b8"/>`;
  s += `<rect x="470" y="90" width="140" height="100" rx="4" fill="#fff" stroke="#cbd5e1" stroke-width="3"/><text x="540" y="130" text-anchor="middle" font-size="13" font-weight="800" fill="${INK}">Q4 ROADMAP</text><rect x="490" y="142" width="100" height="6" fill="#cbd5e1"/><rect x="490" y="156" width="70" height="6" fill="#cbd5e1"/>`;
  s += `<rect x="300" y="460" width="430" height="16" rx="4" fill="#9a7b5b"/><rect x="316" y="476" width="16" height="124" fill="#7c6248"/><rect x="698" y="476" width="16" height="124" fill="#7c6248"/>
    <path d="M360 460l14 -84h132l14 84z" fill="#2b2f36"/><rect x="374" y="384" width="128" height="68" fill="#cfe0f5"/><rect x="384" y="394" width="70" height="8" fill="${NAVY}"/><rect x="384" y="410" width="104" height="5" fill="#94a3b8"/><rect x="384" y="422" width="90" height="5" fill="#94a3b8"/>
    <rect x="560" y="430" width="44" height="30" rx="4" fill="#fff"/><path d="M604 438h10a8 8 0 0 1 0 16h-10" stroke="#fff" stroke-width="4" fill="none"/>`;
  s += `<rect x="560" y="380" width="120" height="120" rx="20" fill="#2f3440"/><rect x="608" y="500" width="16" height="70" fill="#2f3440"/><path d="M560 600l56 -30 56 30" stroke="#2f3440" stroke-width="10" fill="none"/>`;
  s += who('shubham', { x: 620, sit: true, y: F - 14, armR: 'up', itemR: (hx, hy) => `<rect x="${hx - 2}" y="${hy - 26}" width="15" height="38" rx="4" fill="#111827" transform="rotate(14 ${hx} ${hy})"/>` });
  s += callCard(770, 40, 470, {
    title: 'AI VOICE CALL · HINGLISH',
    sub: 'Renault test-drive desk · via FreeStand',
    dur: '0:52',
    lines: [
      { who: 'ai', text: 'Namaste Shubham ji, Renault se Aria. Kal 11 baje Duster ka test drive ghar pe hai. Confirm hai?' },
      { who: 'c', text: 'Haan, par 11:30 kar sakte hain?' },
      { who: 'ai', text: 'Bilkul. 11:30 confirm. Ranjan 11:15 pe call karenge, DL ready rakhiyega.' },
      { who: 'c', text: 'Perfect. Wife bhi saath hogi.' },
    ],
  });
  s += tag(40, 440, ['T-18 H REMINDER · ATTEMPT 1', 'Answered · recorded-call consent', 'Tue 20 Oct · 5:42 PM'], 3.6);
  return s;
}

// ───────────────────────────── 5. the test drive starts ─────────────────────────────
function sceneDrive() {
  let s = `<rect x="-20" y="-20" width="${W + 40}" height="${F + 20}" fill="url(#day)"/><rect x="-20" y="${F}" width="${W + 40}" height="${H - F + 20}" fill="#c3c9d1"/><rect x="-20" y="${F}" width="${W + 40}" height="14" fill="#e5e7eb"/><rect x="-20" y="${F + 14}" width="${W + 40}" height="4" fill="#9aa3ad"/>`;
  for (let i = 0; i < 8; i++) s += `<rect x="${i * 180 + 60}" y="${F + 110}" width="90" height="8" rx="4" fill="#f1f5f9"/>`;
  s += `<rect x="-20" y="0" width="560" height="600" fill="#eadfcd"/>`;
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) s += `<rect x="${20 + c * 130}" y="${40 + r * 112}" width="88" height="66" rx="3" fill="#8fb3cf"/><rect x="${20 + c * 130}" y="${40 + r * 112}" width="88" height="66" rx="3" fill="none" stroke="#fff" stroke-width="5"/><rect x="${12 + c * 130}" y="${108 + r * 112}" width="104" height="10" fill="#bfa98a"/>`;
  s += `<rect x="580" y="260" width="34" height="340" fill="#b8a07e"/><rect x="1000" y="260" width="34" height="340" fill="#b8a07e"/><rect x="566" y="226" width="482" height="54" rx="6" fill="#2f3440"/><text x="807" y="261" text-anchor="middle" font-size="21" font-weight="800" fill="#f4e3c3" letter-spacing="3">VISHAL ENCLAVE · C BLOCK</text>`;
  s += `<path d="M614 600V330M680 600V330M746 600V330M812 600V330M878 600V330M944 600V330" stroke="#6b7280" stroke-width="5"/><path d="M614 340H1000M614 460H1000" stroke="#6b7280" stroke-width="5"/>`;
  s += tree(1120, F - 4, 1.15) + tree(1270, F - 4, 0.95);
  s += carSide(470, F + 64, { s: 1.4, id: 'drive', body: '#e9ecef', facing: 'left' });
  s += who('wife', { x: 70 });
  s += who('shubham', { x: 190, armR: 40 });
  s += who('ranjan', { x: 400, armL: 40, itemL: (hx, hy) => keyFob(hx, hy + 6) });
  s += sayAt(400, ['Good morning sir!', 'Yeh rahi chaabi.'], { bx: 340 });
  s += sayAt(190, ['DL phone pe hai,', 'chalo chalte hain!'], { bx: 30, d: 0.9 });
  s += okPill(660, 60, 'TEST DRIVE STARTED', 'Wed 21 Oct · 11:34 AM · OTP handshake', { cls: 'sv-pop', style: 'animation-delay:1.3s' });
  s += tag(660, 126, ['DEMO CAR · DL 12 DE 0987', 'Duster Turbo AT · fuel ¾', 'DL re-checked at handover'], 1.6, { bg: ORANGE, sub: '#ffe3cc' });
  return s;
}

// ───────────────────────────── cover ─────────────────────────────
function sceneCover() {
  let s = `<rect x="-20" y="-20" width="${W + 40}" height="${H + 40}" fill="#eaf0fb"/><rect x="-20" y="${F}" width="${W + 40}" height="${H}" fill="#d9e2f1"/>`;
  [360, 700, 1040].forEach((x) => (s += `<path d="M${x - 10} -20L${x - 230} 660H${x + 230}L${x + 10} -20Z" fill="#fff" opacity=".7"/>`));
  s += `<ellipse cx="660" cy="${F}" rx="440" ry="38" fill="#c9d4e6"/>`;
  s += `<g opacity=".12" transform="translate(0 ${2 * F - 4}) scale(1 -1)">${carSide(290, F - 2, { s: 1.42, id: 'crefl', badge: false })}</g>`;
  s += carSide(290, F - 2, { s: 1.42, id: 'cover' });
  s += who('shubham', { x: 160 });
  s += who('ranjan', { x: 1150 });
  return s;
}

const BUILDERS = { ad: sceneAd, map: sceneMap, showroom: sceneShowroom, call: sceneCall, drive: sceneDrive, cover: sceneCover };

// Every Desi Log drawing becomes a <use> of the page's one shared <image id="dl-pNN">.
const shareDrawings = (svg) => svg.replace(/<image href="DL:(p\w+)\.webp"[^>]*?preserveAspectRatio="none"/g, '<use href="#dl-$1"');

export function renderScene(name, o) {
  return shareDrawings(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" class="scene-svg" font-family="Inter, Arial, sans-serif">${defs}${BUILDERS[name](o)}</svg>`);
}
export const renderAvatar = (base, bg) => shareDrawings(avatar(base, bg));

// The geometry people.js gives each drawing, for the shared <image> definitions.
export function drawingGeometry() {
  const m = person({ desi: 'p94' }).match(/<image href="DL:p94\.webp" x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)"/);
  return { x: m[1], y: m[2], w: m[3], h: m[4] };
}

// The Renault Duster, side profile, as SVG markup: an upright SUV with a flat roof and rails,
// squared black wheel-arch cladding, a contrast roof, Y-shaped lamps and diamond-cut alloys.
// carSide(x, groundY, { s, body, roof, facing, id, badge }) — x is the rear bumper (front when
// facing 'left'), groundY is where the tyres meet the floor. Drawn 524 long, about 214 tall.
import { shade } from '../kit/kit.js';

let n = 0;

// The Renault diamond, centred at (cx, cy), h tall: two nested rhombus outlines.
export function renaultMark(cx, cy, h, col = '#fff', sw) {
  const t = sw ?? Math.max(1, h * 0.09);
  const r = (k) => {
    const a = (h / 2) * k,
      b = h * 0.34 * k;
    return `<path d="M${cx} ${cy - a}L${cx + b} ${cy}L${cx} ${cy + a}L${cx - b} ${cy}Z" fill="none" stroke="${col}" stroke-width="${t}" stroke-linejoin="miter"/>`;
  };
  return r(1) + r(0.56);
}

function wheel(cx, cy, id) {
  const spokes = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 72 * Math.PI) / 180;
    const p = (r, t) => `${(cx + Math.sin(t) * r).toFixed(1)} ${(cy - Math.cos(t) * r).toFixed(1)}`;
    return `<path d="M${p(9, a - 0.24)}L${p(30, a - 0.16)}L${p(30, a + 0.16)}L${p(9, a + 0.24)}Z" fill="url(#${id}-rim)"/><path d="M${p(9, a + 0.6)}L${p(30, a + 0.5)}L${p(30, a + 0.7)}L${p(9, a + 0.78)}Z" fill="#c9ced6"/>`;
  }).join('');
  return `<g>
    <circle cx="${cx}" cy="${cy}" r="46" fill="#16181c"/>
    <circle cx="${cx}" cy="${cy}" r="42" fill="none" stroke="#2a2d33" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="32" fill="#2b2f36"/>
    <circle cx="${cx}" cy="${cy}" r="31.5" fill="none" stroke="#a7afb9" stroke-width="2"/>
    ${spokes}
    <circle cx="${cx}" cy="${cy}" r="9.5" fill="#2b2f36" stroke="#a7afb9" stroke-width="1.5"/>
    ${renaultMark(cx, cy, 11, '#e5e7eb', 1.2)}
  </g>`;
}

// Squared arch cladding around a wheel centred at x = c.
const arch = (c) =>
  `<path d="M${c - 70} -40L${c - 63} -86Q${c - 52} -106 ${c - 22} -108L${c + 22} -108Q${c + 52} -106 ${c + 63} -86L${c + 70} -40L${c + 58} -40A58 58 0 0 0 ${c - 58} -40Z" fill="#1d1f24"/>`;

export function carSide(x, groundY, o = {}) {
  const id = o.id || `car${++n}`;
  const s = o.s ?? 1;
  const body = o.body || '#b4472b';
  const roof = o.roof || '#17181c';
  const hi = shade(body, 26);
  const lo = shade(body, -30);
  const W = -46;
  const g = `
  <defs>
    <linearGradient id="${id}-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset=".45" stop-color="${body}"/><stop offset="1" stop-color="${lo}"/></linearGradient>
    <linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#425166"/><stop offset=".55" stop-color="#1c232c"/><stop offset="1" stop-color="#11161c"/></linearGradient>
    <linearGradient id="${id}-rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset="1" stop-color="#9aa3ad"/></linearGradient>
    <linearGradient id="${id}-shine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  </defs>
  <ellipse cx="262" cy="2" rx="270" ry="11" fill="#0b1220" opacity=".22"/>
  <!-- body shell -->
  <path d="M20 -40C10 -42 6 -52 6 -66L6 -128C6 -146 10 -170 18 -186C22 -196 30 -200 44 -201L318 -204C336 -204 348 -199 358 -190L404 -152C450 -149 492 -146 510 -138C520 -133 523 -122 523 -108L522 -62C521 -48 514 -40 500 -40L170 -40Z" fill="url(#${id}-b)"/>
  <!-- contrast roof and rails -->
  <path d="M18 -186C22 -196 30 -200 44 -201L318 -204C336 -204 348 -199 358 -190L350 -186C340 -194 330 -197 316 -197L46 -195C36 -195 30 -192 26 -184Z" fill="${roof}"/>
  <rect x="58" y="-211" width="262" height="5" rx="2.5" fill="#2b2f36"/><rect x="70" y="-208" width="10" height="7" fill="#2b2f36"/><rect x="300" y="-208" width="10" height="7" fill="#2b2f36"/>
  <!-- glasshouse with pillars -->
  <path d="M34 -150L40 -188C44 -193 50 -195 60 -195L316 -196C330 -196 340 -192 350 -184L392 -154Z" fill="url(#${id}-g)"/>
  <path d="M34 -150L40 -188C44 -193 50 -195 60 -195L82 -195L92 -150Z" fill="${shade(body, -6)}"/>
  <path d="M126 -195L136 -195L142 -150L132 -150Z M232 -196L246 -196L248 -150L234 -150Z" fill="#111418"/>
  <path d="M150 -192L226 -193L226 -154L154 -152Z" fill="#fff" opacity=".07"/><path d="M256 -193L316 -193C326 -193 334 -190 342 -184L330 -176L258 -180Z" fill="#fff" opacity=".12"/>
  <path d="M34 -150L392 -154" stroke="#0f1216" stroke-width="3"/>
  <!-- shoulder highlight and creases -->
  <path d="M24 -140C150 -146 330 -150 480 -142" stroke="url(#${id}-shine)" stroke-width="4" fill="none"/>
  <path d="M20 -112C150 -116 330 -118 506 -112" stroke="${lo}" stroke-width="1.6" fill="none" opacity=".8"/>
  <!-- door shut lines and handles -->
  <path d="M240 -150L240 -46M352 -182C356 -140 356 -96 352 -62M138 -150C134 -112 136 -84 142 -62" stroke="${shade(body, -45)}" stroke-width="1.6" fill="none"/>
  <rect x="200" y="-130" width="24" height="5" rx="2.5" fill="${shade(body, -40)}"/><rect x="312" y="-131" width="24" height="5" rx="2.5" fill="${shade(body, -40)}"/>
  <!-- mirror -->
  <path d="M358 -172C368 -180 386 -180 390 -170L386 -158L362 -158Z" fill="${roof}"/>
  <!-- cladding: sill, squared arches, bumpers -->
  <path d="M60 -40L456 -40L452 -60L64 -60Z" fill="#1d1f24"/>
  <path d="M54 -40A58 58 0 0 1 170 -40Z M342 -40A58 58 0 0 1 458 -40Z" fill="#0d0e11"/>
  ${arch(112)}${arch(400)}
  <path d="M470 -40L500 -40C514 -40 521 -48 522 -62L522 -70L466 -66Z" fill="#1d1f24"/>
  <path d="M42 -40L20 -40C10 -42 6 -52 6 -66L6 -72L46 -68Z" fill="#1d1f24"/>
  <rect x="494" y="-56" width="26" height="8" rx="3" fill="#b9c0c9"/><rect x="8" y="-56" width="24" height="7" rx="3" fill="#b9c0c9"/>
  <!-- front: slim Y lamps, grille -->
  <path d="M474 -138L520 -126L520 -116L476 -128Z" fill="#e8f4ff"/><path d="M496 -132L506 -118L516 -118" stroke="#fff" stroke-width="2" fill="none"/>
  <path d="M510 -112L523 -110L523 -78L512 -80Z" fill="#1d1f24"/>
  ${renaultMark(517, -96, 14, '#e5e7eb', 1.4)}
  <!-- rear: vertical Y lamp -->
  <path d="M6 -152L16 -152L18 -118L6 -118Z" fill="#d8202c"/><path d="M8 -146L14 -136L8 -126" stroke="#ff8a8f" stroke-width="1.6" fill="none"/>
  ${wheel(112, W, id)}${wheel(400, W, id)}`;
  const left = o.facing === 'left';
  const fx = (v) => (left ? 524 - v : v);
  const flip = left ? ` translate(524 0) scale(-1 1)` : '';
  const txt = o.badge !== false ? `<text x="${fx(left ? 230 : 166)}" y="-47" font-size="9.5" font-weight="800" fill="#cfd4da" letter-spacing="2" font-family="Arial, sans-serif">DUSTER</text>` : '';
  return `<g class="${o.cls || ''}" style="${o.style || ''}" transform="translate(${x} ${groundY}) scale(${s})"><g transform="translate(0 0)${flip}">${g}</g>${txt}</g>`;
}

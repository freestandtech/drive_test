// The Citroën Basalt X, side profile, as SVG markup. A coupé-SUV: high bonnet, sloping roofline,
// black wheel-arch cladding, dual-tone body (contrast roof), split LED lamps, diamond-cut alloys.
// carSide(x, groundY, { s, body, roof, facing, plate, id }) — x is the rear bumper (front when
// facing 'left'), groundY is where the tyres meet the floor.
import { shade } from '../kit/kit.js';

let n = 0;

function wheel(cx, cy, id) {
  const spokes = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 72 * Math.PI) / 180;
    const b = a + 0.3;
    const p = (r, t) => `${(cx + Math.sin(t) * r).toFixed(1)} ${(cy - Math.cos(t) * r).toFixed(1)}`;
    return `<path d="M${p(9, a - 0.2)}L${p(29, a - 0.17)}L${p(29, b + 0.04)}L${p(9, b - 0.1)}Z" fill="url(#${id}-rim)"/><path d="M${p(10, a + 0.12)}L${p(29, b - 0.05)}" stroke="#2b2f36" stroke-width="2.4"/>`;
  }).join('');
  return `<g>
    <circle cx="${cx}" cy="${cy}" r="45" fill="#16181c"/>
    <circle cx="${cx}" cy="${cy}" r="41" fill="none" stroke="#2a2d33" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="31.5" fill="#23262c"/>
    <circle cx="${cx}" cy="${cy}" r="31" fill="none" stroke="#9aa3ad" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="24" fill="#5a3a2a" opacity=".55"/>
    ${spokes}
    <circle cx="${cx}" cy="${cy}" r="9.5" fill="#cfd5dc" stroke="#6b737d" stroke-width="1.5"/>
    ${chevrons(cx, cy, 5.2, '#2b2f36')}
  </g>`;
}

// The double-chevron mark, centred at (cx, cy), w = half width.
export function chevrons(cx, cy, w, col = '#fff', sw) {
  const t = sw ?? Math.max(1, w * 0.32);
  const v = (dy) => `<path d="M${cx - w} ${cy + dy + w * 0.42}L${cx} ${cy + dy - w * 0.08}L${cx + w} ${cy + dy + w * 0.42}" fill="none" stroke="${col}" stroke-width="${t}" stroke-linecap="square" stroke-linejoin="miter"/>`;
  return v(-w * 0.42) + v(w * 0.36);
}

export function carSide(x, groundY, o = {}) {
  const id = o.id || `car${++n}`;
  const s = o.s ?? 1;
  const body = o.body || '#8e1b24';
  const roof = o.roof || '#16181c';
  const hi = shade(body, 28);
  const lo = shade(body, -32);
  const plate = o.plate || 'DL 12 DE 0987';
  // Drawn facing right (front at x ≈ 520), wheels at 112 and 392, tyre bottom at y = 0.
  const W = -45; // wheel centre y
  const g = `
  <defs>
    <linearGradient id="${id}-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset=".42" stop-color="${body}"/><stop offset="1" stop-color="${lo}"/></linearGradient>
    <linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3d4a5a"/><stop offset=".55" stop-color="#1c232c"/><stop offset="1" stop-color="#11161c"/></linearGradient>
    <linearGradient id="${id}-rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset="1" stop-color="#9aa3ad"/></linearGradient>
    <linearGradient id="${id}-shine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  </defs>
  <ellipse cx="258" cy="2" rx="268" ry="11" fill="#0b1220" opacity=".22"/>
  <!-- body shell -->
  <path d="M18 -42 C8 -46 4 -62 5 -80 L7 -118 C9 -128 18 -134 34 -138 L64 -146
    C112 -172 168 -199 236 -205 L300 -205 C326 -204 346 -197 364 -183 L402 -154
    C446 -150 486 -144 508 -130 C519 -122 523 -110 522 -96 L519 -60 C518 -48 510 -42 498 -42
    L452 -42 A60 60 0 0 0 332 -42 L172 -42 A60 60 0 0 0 52 -42 Z" fill="url(#${id}-b)"/>
  <!-- contrast roof -->
  <path d="M64 -146 C112 -172 168 -199 236 -205 L300 -205 C326 -204 346 -197 364 -183 L352 -184 C334 -195 318 -199 298 -199 L238 -199 C176 -194 124 -172 80 -148 Z" fill="${roof}"/>
  <!-- glasshouse -->
  <path d="M84 -148 C126 -170 176 -192 238 -196 L298 -196 C318 -196 334 -191 350 -180 L382 -156 Z" fill="url(#${id}-g)"/>
  <path d="M226 -197 L236 -150 L248 -150 L240 -197 Z" fill="#111418"/>
  <path d="M96 -151 C128 -168 168 -186 214 -192 L218 -151 Z" fill="#fff" opacity=".07"/>
  <path d="M262 -192 L300 -192 C316 -192 330 -187 344 -178 L330 -170 L262 -186 Z" fill="#fff" opacity=".12"/>
  <path d="M84 -148 L382 -156" stroke="#0f1216" stroke-width="3"/>
  <!-- shoulder highlight and character line -->
  <path d="M40 -132 C160 -146 330 -152 470 -142" stroke="url(#${id}-shine)" stroke-width="4" fill="none"/>
  <path d="M30 -100 C150 -108 330 -112 500 -104" stroke="${lo}" stroke-width="1.6" fill="none" opacity=".8"/>
  <!-- door shut lines and handles -->
  <path d="M238 -150 L240 -48 M352 -176 C356 -140 356 -90 350 -50 M128 -158 C124 -120 128 -80 140 -52" stroke="${shade(body, -45)}" stroke-width="1.6" fill="none"/>
  <rect x="198" y="-126" width="24" height="5" rx="2.5" fill="${shade(body, -40)}"/><rect x="310" y="-128" width="24" height="5" rx="2.5" fill="${shade(body, -40)}"/>
  <!-- mirror -->
  <path d="M356 -168 C366 -176 384 -176 388 -166 L384 -156 L360 -156 Z" fill="${roof}"/>
  <!-- wheel wells, arch flares, sill and bumper cladding -->
  <path d="M52 -42 A60 60 0 0 1 172 -42 Z M332 -42 A60 60 0 0 1 452 -42 Z" fill="#0d0e11"/>
  <path d="M44 -42 A68 68 0 0 1 180 -42" stroke="#1b1d22" stroke-width="10" fill="none"/>
  <path d="M324 -42 A68 68 0 0 1 460 -42" stroke="#1b1d22" stroke-width="10" fill="none"/>
  <path d="M176 -42 L328 -42 L326 -56 L178 -56 Z" fill="#1b1d22"/>
  <path d="M458 -42 L498 -42 C510 -42 518 -48 519 -60 L519 -64 L462 -60 Z" fill="#1b1d22"/>
  <path d="M46 -42 L18 -42 C12 -44 9 -50 8 -58 L48 -56 Z" fill="#1b1d22"/>
  <rect x="190" y="-52" width="124" height="4" rx="2" fill="#9aa3ad" opacity=".55"/>
  <!-- front: split lamps, grille, bumper -->
  <path d="M488 -132 L518 -120 L516 -114 L484 -126 Z" fill="#e8f4ff"/>
  <path d="M496 -102 L520 -98 L520 -84 L498 -86 Z" fill="#cfd8e3"/><path d="M500 -98 L516 -96" stroke="#fff" stroke-width="2"/>
  <path d="M508 -80 L521 -80 L519 -60 L506 -62 Z" fill="#1b1d22"/>
  ${chevrons(511, -112, 4.5, '#e6e8eb', 1.6)}
  <!-- rear: lamp, spoiler -->
  <path d="M6 -118 L34 -136 L40 -130 L10 -112 Z" fill="#d8202c"/><path d="M8 -116 L32 -132" stroke="#ff8a8f" stroke-width="1.6"/>
  <path d="M28 -140 L70 -150 L68 -144 L32 -136 Z" fill="${roof}"/>
  <rect x="6" y="-76" width="8" height="10" rx="2" fill="#f59e0b" opacity=".9"/>
  ${wheel(112, W, id)}${wheel(392, W, id)}
`;
  const left = o.facing === 'left';
  const fx = (v) => (left ? 524 - v : v);
  const flip = left ? ` translate(524 0) scale(-1 1)` : '';
  const txt = `${o.badge !== false ? `<text x="${fx(left ? 488 : 456)}" y="-78" font-size="9" font-weight="800" fill="#d5d9de" letter-spacing="1.2" font-family="Arial, sans-serif">TURBO</text>` : ''}${o.plateSide ? `<g transform="translate(${fx(256) - 52} -30)"><rect width="104" height="22" rx="3" fill="#fff" stroke="#111" stroke-width="1.5"/><text x="52" y="16" text-anchor="middle" font-size="12.5" font-weight="800" fill="#111" font-family="Arial, sans-serif" letter-spacing=".6">${plate}</text></g>` : ''}`;
  return `<g class="${o.cls || ''}" style="${o.style || ''}" transform="translate(${x} ${groundY}) scale(${s})"><g transform="translate(0 0)${flip}">${g}</g>${txt}</g>`;
}

// A front-three-quarter-free badge: the Citroën wordmark plate used on signage.
export function citroenMark(x, y, h = 40, col = '#fff', o = {}) {
  const w = h * 0.62;
  return `<g>${chevrons(x + w / 2, y + h / 2, w / 2, col, h * 0.13)}${o.word ? `<text x="${x + w + h * 0.32}" y="${y + h * 0.7}" font-size="${h * 0.56}" font-weight="700" fill="${col}" letter-spacing="${h * 0.06}" font-family="Arial, sans-serif">CITROËN</text>` : ''}</g>`;
}

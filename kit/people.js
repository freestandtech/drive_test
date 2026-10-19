// Copied from freestand_HUL_CDP/src/v2/kit/people.js (imports point at this folder).
// The v2 build's scene kit: everything from the shared kit (src/hul/scenes/kit.js) except
// person(), which draws a Desi Log character (./cast.js) instead of the flat drawn figure.
// vite.config.js (mode v2) points every import of the shared kit at this module, so the shared
// templates (src/hul/scenes/templates.js) and the v2 art draw the new cast while the root and
// /platform/ builds, and the Node tests that import src/hul, keep the original.
//
// Same contract as the kit's person(o): feet at (o.x, o.y), scale o.s, head top at the same
// height (so bubbles from headTop() still point at the head), the role label pill, and the
// arms: a pose that lifts an arm ('forward', 'up', 'raise', 'hold' or an angle) hides that arm of
// the drawing and draws one in the character's skin and sleeve colours with the Desi Log
// outline, ending at exactly the hand point the kit's person() uses, where itemL / itemR /
// itemOver are called — so phones, packs, scan beams and ticks line up as before. A promoter
// (o.vest) wears a bib in the brand's colour with the brand name. Node-safe, deterministic.
import { person as drawnPerson, FLOOR, esc, shade } from './kit.js';
import { PEOPLE, castFor, castUrl } from './cast.js';

export * from './kit.js';
export { drawnPerson };

const INK = '#161616'; // the Desi Log outline (not pure black: rebrand.js maps shades of colours)
// The drawings share one body template. Source pixels (1404-high export, feet on y 1291, body
// centred on x 270) → figure units (the kit's: feet at 0, head top at -319).
const K = 319 / 1186;
const ux = (px) => +((px - 270) * K).toFixed(2);
const uy = (py) => +((py - 1291) * K).toFixed(2);
// The exported WebP is the source crop x 23…517, y feet-1270…feet+10.
const IMG = { x: ux(23), y: uy(1291 - 1270), w: +(494 * K).toFixed(2), h: +(1280 * K).toFixed(2) };
// Each arm of the drawing, from outside the figure in to the line between arm and body (that line
// stays, as the body's edge), shoulder to below the hand.
const ARM_PX = {
  L: [[-40, 440], [191, 440], [183, 460], [176, 480], [169, 500], [163, 520], [159, 540], [154, 560], [149, 580], [143, 600], [140, 620], [136, 640], [134, 660], [131, 680], [129, 700], [127, 720], [126, 740], [126, 760], [124, 780], [122, 800], [118, 820], [118, 846], [-40, 846]],
  R: [[580, 440], [384, 440], [379, 460], [378, 480], [378, 500], [379, 520], [381, 540], [383, 560], [386, 580], [389, 600], [391, 620], [395, 640], [398, 660], [402, 680], [405, 700], [408, 720], [410, 740], [411, 760], [413, 780], [415, 800], [416, 820], [417, 840], [421, 860], [421, 900], [580, 900]],
};
const poly = (pts) => 'M' + pts.map(([x, y]) => `${ux(x)} ${uy(y)}`).join('L') + 'Z';
const FRAME = `M-90 -400H90V40H-90Z`;
// Where the drawn arms pivot: the drawing's shoulder joints (the top of each arm, inside the
// rounded cap that covers the cut), figure units. The arm's two bones are as long as the drawing's
// own (shoulder → elbow → hand centre, about 90 units, source px 470 → 815).
const SHOULDER = { L: [ux(166), uy(470)], R: [ux(400), uy(470)] };
const BONE = 44;
// Clip paths that hide one or both arms (evenodd: the frame minus the arm shapes), and the one
// that cuts a sitting figure at the hips.
const CLIP = {
  L: `<clipPath id="dl-arm-L" clipPathUnits="userSpaceOnUse"><path clip-rule="evenodd" d="${FRAME}${poly(ARM_PX.L)}"/></clipPath>`,
  R: `<clipPath id="dl-arm-R" clipPathUnits="userSpaceOnUse"><path clip-rule="evenodd" d="${FRAME}${poly(ARM_PX.R)}"/></clipPath>`,
  LR: `<clipPath id="dl-arm-LR" clipPathUnits="userSpaceOnUse"><path clip-rule="evenodd" d="${FRAME}${poly(ARM_PX.L)}${poly(ARM_PX.R)}"/></clipPath>`,
  sit: `<clipPath id="dl-sit" clipPathUnits="userSpaceOnUse"><path d="M-90 -400H90V${(uy(842) + 36).toFixed(2)}H-90Z"/></clipPath>`,
};

// The hand point and arm polyline the kit's person() uses for a pose (its own geometry, copied
// so the items land where they always did).
export function kitArm(side, pose, sit = false) {
  const dy = sit ? 36 : 0;
  const headY = -292 + dy,
    tTop = -256 + dy,
    tBot = -132 + dy;
  const shY = tTop + 17;
  const sx = side * 44;
  const A = (deg, len = 104) => {
    const r = (deg * Math.PI) / 180;
    return [sx + side * Math.sin(r) * len, shY + Math.cos(r) * len];
  };
  if (pose === 'forward') return { pts: [[sx, shY], [side * 48, shY + 66], [side * 16, shY + 70]], hand: [side * 16, shY + 70] };
  if (pose === 'up') return { pts: [[sx, shY], [side * 58, shY + 56], [side * 24, headY + 4]], hand: [side * 24, headY + 4] };
  if (pose === 'raise') return { pts: [[sx, shY], [side * 62, shY + 44], [side * 70, shY - 18]], hand: [side * 70, shY - 18] };
  if (pose === 'hold') return { pts: [[sx, shY], [side * 54, shY + 50], [side * 20, shY + 18]], hand: [side * 20, shY + 18] };
  if (typeof pose === 'number') {
    const hand = A(pose);
    return { pts: [[sx, shY], hand], hand };
  }
  // v2 only: a hand placed by the scene, { hand: [x, y] } in figure units (the shared kit draws
  // such an arm down, so only the v2 art uses it)
  if (pose && typeof pose === 'object' && Array.isArray(pose.hand)) {
    const hand = [pose.hand[0], pose.hand[1] + dy];
    return { pts: [[sx, shY], hand], hand };
  }
  return { pts: [[sx, shY], [side * 46, tBot - 2]], hand: [side * 46, tBot - 2], down: true };
}

const line = (pts, col, w) =>
  `<polyline points="${pts.map((p) => p.map((v) => +v.toFixed(2)).join(',')).join(' ')}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

// The elbow for a shoulder S and a hand H: two bones of BONE, bent outward and down (away from
// the body), like the drawing's own arms; a hand out of reach gets a straight arm.
export function elbowOf(side, S, H) {
  const dx = H[0] - S[0],
    dy = H[1] - S[1];
  const d = Math.hypot(dx, dy);
  if (d >= 2 * BONE - 0.5 || d < 1e-6) return [S[0] + dx / 2, S[1] + dy / 2];
  const a = Math.acos(Math.min(1, d / (2 * BONE)));
  const ang = Math.atan2(dy, dx);
  const cand = [ang + a, ang - a].map((t) => [S[0] + Math.cos(t) * BONE, S[1] + Math.sin(t) * BONE]);
  const score = (E) => side * (E[0] - S[0]) + 1.5 * (E[1] - S[1]);
  return score(cand[0]) >= score(cand[1]) ? cand[0] : cand[1];
}

// The shoulder an arm hangs from. Reaching further than the arm is long, the shoulder comes
// forward a little toward the hand (up to 8 units), as a real one does, so the arm stretches less.
function shoulderFor(side, H, dy) {
  const sh = SHOULDER[side < 0 ? 'L' : 'R'];
  const S = [sh[0], sh[1] + dy];
  const d = Math.hypot(H[0] - S[0], H[1] - S[1]);
  const k = Math.min(Math.max(0, d - 2 * BONE), 8) / (d || 1);
  return [S[0] + (H[0] - S[0]) * k, S[1] + (H[1] - S[1]) * k];
}

// A lifted arm in the character's colours: shoulder → elbow → hand, outlined like the drawing,
// the upper arm a little thicker than the forearm; a short sleeve covers the shoulder and the top
// of the upper arm, a long sleeve runs to a cuff at the wrist, a bare arm is all skin.
function drawnArm(c, side, kit, dy) {
  const S = shoulderFor(side, kit.hand, dy),
    H = kit.hand;
  const E = elbowOf(side, S, H);
  // the drawing's arms are about 12 (near) to 14 (far, turned to us) units wide
  const w1 = side < 0 ? 12.5 : 13.5,
    w2 = side < 0 ? 10.5 : 11.5;
  const bare = c.upper === c.skin;
  const longSleeve = c.fore !== c.skin;
  const O = 3;
  let g = line([S, E], INK, w1 + O) + line([E, H], INK, w2 + O);
  g += line([S, E], longSleeve ? c.fore : c.skin, w1) + line([E, H], longSleeve ? c.fore : c.skin, w2);
  if (longSleeve) {
    // the cuff, just short of the hand
    const ux_ = (H[0] - E[0]) / (Math.hypot(H[0] - E[0], H[1] - E[1]) || 1),
      uy_ = (H[1] - E[1]) / (Math.hypot(H[0] - E[0], H[1] - E[1]) || 1);
    const C0 = [H[0] - ux_ * 11, H[1] - uy_ * 11],
      C1 = [H[0] - ux_ * 7, H[1] - uy_ * 7];
    g += line([C0, C1], INK, w2 + O + 1) + line([C0, C1], shade(c.fore, -8), w2 + 1);
  } else if (!bare) {
    // a short sleeve: the shoulder and the top 45% of the upper arm, a little wider, with a hem
    const M = [S[0] + (E[0] - S[0]) * 0.45, S[1] + (E[1] - S[1]) * 0.45];
    g += line([S, M], INK, w1 + O + 2) + line([S, M], c.upper, w1 + 2);
  }
  return g;
}
// The hand: a rounded mitten along the forearm, as the drawing draws hands.
function hand(c, side, kit, dy) {
  const S = shoulderFor(side, kit.hand, dy),
    [x, y] = kit.hand;
  const E = elbowOf(side, S, kit.hand);
  const deg = (Math.atan2(y - E[1], x - E[0]) * 180) / Math.PI - 90;
  return `<ellipse cx="${+x.toFixed(2)}" cy="${+y.toFixed(2)}" rx="6" ry="7.6" transform="rotate(${+deg.toFixed(1)} ${+x.toFixed(2)} ${+y.toFixed(2)})" fill="${c.skin}" stroke="${INK}" stroke-width="1.7"/>`;
}

// The promoter's bib in the brand's colour, the brand name across the chest.
function bib(o, dy) {
  const col = o.vest;
  const P = (x, y) => `${ux(x)} ${+(uy(y) + dy).toFixed(2)}`;
  const d = `M${P(196, 452)}Q${P(214, 440)} ${P(236, 440)}L${P(276, 500)}L${P(318, 440)}Q${P(352, 440)} ${P(372, 456)}L${P(384, 600)}L${P(392, 790)}Q${P(272, 806)} ${P(150, 794)}L${P(162, 600)}Z`;
  let g = `<path d="${d}" fill="${col}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`;
  g += `<path d="M${P(158, 742)}Q${P(272, 754)} ${P(390, 740)}" stroke="${o.vestStripe || '#fff'}" stroke-width="4" fill="none" opacity=".85"/>`;
  g += `<path d="M${P(214, 470)}Q${P(272, 520)} ${P(344, 468)}" stroke="${shade(col, -18)}" stroke-width="1.4" fill="none" opacity=".7"/>`;
  if (o.vestText) {
    const t = String(o.vestText);
    g += `<text x="${ux(274)}" y="${+(uy(700) + dy).toFixed(2)}" text-anchor="middle" font-size="${Math.min(11, 96 / t.length).toFixed(2)}" font-weight="900" fill="#fff" letter-spacing=".6">${esc(t)}</text>`;
  }
  return g;
}

// A helmet over the drawing's head.
function helmet(col, dy) {
  const P = (x, y) => `${ux(x)} ${+(uy(y) + dy).toFixed(2)}`;
  return `<path d="M${P(158, 262)}C${P(150, 40)} ${P(428, 40)} ${P(424, 262)}Z" fill="${col}" stroke="${INK}" stroke-width="1.6"/><path d="M${P(150, 262)}H${P(440, 262).split(' ')[0]}" stroke="${shade(col, -30)}" stroke-width="5" stroke-linecap="round"/>`;
}

// A sitting figure: the drawing cut at the hips, on a seat, shins down to the floor.
function seatedLegs(c) {
  const pants = c.pants;
  let g = `<rect x="-40" y="-104" width="80" height="30" rx="10" fill="${c.lap || pants}" stroke="${INK}" stroke-width="1.6"/>`;
  g += `<rect x="-33" y="-82" width="24" height="70" rx="4" fill="${shade(pants, -8)}" stroke="${INK}" stroke-width="1.6"/><rect x="9" y="-82" width="24" height="70" rx="4" fill="${shade(pants, -8)}" stroke="${INK}" stroke-width="1.6"/>`;
  g += `<path d="M-38 0v-5a7 7 0 0 1 7 -7h22v12z" fill="${c.skin}" stroke="${INK}" stroke-width="1.4"/><path d="M38 0v-5a7 7 0 0 0 -7 -7H9v12z" fill="${c.skin}" stroke="${INK}" stroke-width="1.4"/>`;
  return g;
}

export function person(o = {}) {
  const key = castFor(o);
  const c = PEOPLE[key];
  const x = o.x ?? 0,
    y = o.y ?? FLOOR,
    s = o.s ?? (o.age === 'child' ? 0.62 : 1);
  const sit = !!o.sit,
    dy = sit ? 36 : 0;
  const headY = -292 + dy,
    tTop = -256 + dy,
    tBot = -132 + dy;
  const shY = tTop + 17;
  const aL = kitArm(-1, o.armL || 'down', sit),
    aR = kitArm(1, o.armR || 'down', sit);
  const hide = (aL.down ? '' : 'L') + (aR.down ? '' : 'R');
  let g = `<ellipse cx="0" cy="1" rx="${sit ? 64 : 50}" ry="7" fill="#0b2e6e" opacity=".08"/>`;
  if (sit) g += seatedLegs(c);
  // the drawing, arms that lift hidden, cut at the hips when sitting
  let img = `<image href="${castUrl(c.file)}" x="${IMG.x}" y="${IMG.y}" width="${IMG.w}" height="${IMG.h}" preserveAspectRatio="none"${hide ? ` clip-path="url(#dl-arm-${hide})"` : ''}/>`;
  if (hide) img = CLIP[hide] + img;
  if (dy) img = `<g transform="translate(0 ${dy})">${img}</g>`;
  if (sit) img = `${CLIP.sit}<g clip-path="url(#dl-sit)">${img}</g>`;
  g += `<g class="dl-person" data-desi="${key}">${img}</g>`;
  if (o.helmet) g += helmet(o.helmet, dy);
  if (o.vest) g += bib(o, dy);
  if (o.bag) g += line([[ux(200), uy(452) + dy], [ux(392), uy(780) + dy]], INK, 8.4) + line([[ux(200), uy(452) + dy], [ux(392), uy(780) + dy]], o.bagStrap || '#1f2937', 6);
  if (o.satchel) g += `<rect x="${ux(400)}" y="${uy(700) + dy}" width="30" height="38" rx="6" fill="${o.satchel}" stroke="${INK}" stroke-width="1.6"/><rect x="${ux(400)}" y="${uy(700) + dy}" width="30" height="12" rx="4" fill="${shade(o.satchel, -18)}" stroke="${INK}" stroke-width="1.6"/>`;
  if (o.front) g += o.front;
  // the role label on the chest (over the body, under the arms and held items)
  if (o.label) {
    const fs = 11.5,
      lw = String(o.label).length * 8.4 + 14;
    const ly = uy(492) + dy;
    const shirt = o.saree ? o.blouse || shade(typeof o.saree === 'string' ? o.saree : o.shirt || '#c0466a', -30) : o.shirt || '#3f7f5f';
    g += `<rect x="${-lw / 2 + 4}" y="${ly}" width="${lw}" height="21" rx="10.5" fill="#fff" stroke="${INK}" stroke-opacity=".25"/><text x="4" y="${ly + 15}" text-anchor="middle" font-size="${fs}" font-weight="800" letter-spacing="1" fill="${o.labelInk || shade(o.vest || shirt, -30)}">${esc(o.label)}</text>`;
  }
  if (!aL.down) g += drawnArm(c, -1, aL, dy);
  if (!aR.down) g += drawnArm(c, 1, aR, dy);
  if (o.itemL) g += o.itemL(aL.hand[0], aL.hand[1]);
  if (o.itemR) g += o.itemR(aR.hand[0], aR.hand[1]);
  if (!aL.down) g += hand(c, -1, aL, dy);
  if (!aR.down) g += hand(c, 1, aR, dy);
  if (o.itemOver) g += o.itemOver(aL.hand, aR.hand);
  if (o.over) g += o.over({ headY, tTop, tBot, shY });
  return `<g class="${o.cls || ''}" style="${o.style || ''}"><g transform="translate(${x} ${y}) scale(${s})">${g}</g></g>`;
}

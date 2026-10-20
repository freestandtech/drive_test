/* Renault × FreeStand test-drive demo.
   Problem → what we solve → booking → validation → fulfilment → confirmation & AI calling → analytics.
   Vanilla JS. Images are Renault's own Duster campaign visuals (assets/img) and Pexels portraits. */
(function () {
  const IMG = (f) => `assets/img/${f}`;
  const D = window.__DATA;
  const ORANGE = '#ff6b00';
  const $ = (s) => document.querySelector(s);
  let cur = document; // the slide on stage: live updates only touch elements inside it
  const $$ = (s) => cur.querySelector(s);

  // ───────────────────────────── icons and marks ─────────────────────────────
  const ICONS = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2.2"/><path d="M14 10h4M14 14h4"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    pin: '<path d="M12 22s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    radar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 12 18 6"/>',
    calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
    msg: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    car: '<path d="M5 17H3v-5l2.5-5h13l2.5 5v5h-2"/><path d="M3 12h18"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    mega: '<path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M16 9a3 3 0 0 1 0 6M19 6a7 7 0 0 1 0 12"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c1-3.5 3.8-5 7-5s6 1.5 7 5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 20c-.6-2.5-2.2-4-4.5-4.6"/>',
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    home: '<path d="m3 11 9-7 9 7"/><path d="M5 10v10h14V10"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    eyeoff: '<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9M6.6 6.6C3.9 8.4 2 12 2 12s4 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    route: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H16a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h7.5"/>',
    video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3"/>',
    dots: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
    send: '<path d="m22 2-7 20-4-9-9-4z"/>',
    bookmark: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  };
  const ic = (n, s = 18, st = '') => `<svg class="i" viewBox="0 0 24 24" style="width:${s}px;height:${s}px;${st}">${ICONS[n]}</svg>`;
  // The Renault logo (the official mark from renault.co.in).
  const RL = 'm52.3 43-23 43H23L0 43 22.9 0h6.5L6.5 43l19.6 36.9L45.7 43 34.3 21.5l3.3-6.1zM42.5 0h-6.6L13.1 43l14.7 27.6 3.2-6.1L19.6 43 39.2 6l19.6 37-22.9 43h6.6l22.8-43z';
  const rlogo = (h = 20, col = '#fff') => `<svg viewBox="0 0 66 86" style="height:${h}px;width:auto;display:block"><path fill="${col}" d="${RL}"/></svg>`;
  const pillH = (t, cls = '') => `<span class="pill ${cls}"><i></i>${t}</span>`;
  const ph = (icon, title, sub, st, cls) => `<div class="ph"><div class="ic">${ic(icon, 19)}</div><div><div class="tt">${title}</div><div class="ss">${sub}</div></div>${st ? pillH(st, cls) : ''}</div>`;
  const row = (t, s, v = '', cls = '', d = 0) =>
    `<div class="row ${cls}" style="animation-delay:${d}s"><div class="d">${cls === 'wait' ? ic('clock', 12) : cls === 'info' ? ic('lock', 12) : ic('check', 12)}</div><div><div class="t">${t}</div>${s ? `<div class="s">${s}</div>` : ''}</div>${v ? `<div class="v">${v}</div>` : ''}</div>`;
  const rows = (arr, d0 = 0.2, step = 0.18) => `<div class="rows">${arr.map((r, i) => row(r[0], r[1], r[2], r[3], d0 + i * step)).join('')}</div>`;
  const chips = (arr) => `<div class="chips">${arr.map((c) => (typeof c === 'string' ? `<span class="chip">${c}</span>` : `<span class="chip ${c[1]}">${c[0]}</span>`)).join('')}</div>`;
  const note = (i, html) => `<div class="note">${ic(i, 17)}<div>${html}</div></div>`;
  const avatar = (f, sz, r = 14, pos = 'center') => `<div class="avatar" style="width:${sz}px;height:${sz}px;border-radius:${r}px"><img src="${IMG(f)}" alt="" style="object-position:${pos}"></div>`;
  const photo = (f, w, h, pos = 'center', r = 14) => `<div class="photo" style="width:${w}px;height:${h}px;border-radius:${r}px"><img src="${IMG(f)}" alt="" style="object-position:${pos}"></div>`;
  const strip = (h) => String(h).replace(/<[^>]+>/g, '');

  // ───────────────────────────── the people and the facts ─────────────────────────────
  const P = {
    name: 'Gurpreet Singh', first: 'Gurpreet', phone: '+91 98374 92834', masked: '98XXX XX834', email: 'gurpreet.singh@gmail.com',
    addr: 'C-42, 2nd Floor, Vishal Enclave, Rajouri Garden, New Delhi 110027', lead: 'LD-26-10419',
    model: 'Duster E-Tech 160 hybrid', face: 'customer.webp',
  };
  const C = { name: 'Arjun Menon', face: 'consultant.webp', pos: '62% 30%', dealer: 'Renault Kirti Nagar' };

  // ───────────────────────────── WhatsApp thread (played live) ─────────────────────────────
  const dlCard = (w = 212) => `<svg class="dlimg" width="${w}" viewBox="0 0 212 134"><defs><clipPath id="dlc${w}"><rect x="10" y="32" width="50" height="62" rx="3"/></clipPath></defs><rect width="212" height="134" rx="8" fill="#eaf0f8"/><rect width="212" height="24" rx="8" fill="#284a8c"/><rect y="16" width="212" height="8" fill="#284a8c"/><text x="10" y="16" font-size="8.5" font-weight="700" fill="#fff" letter-spacing=".6" font-family="Inter,Arial">INDIAN UNION DRIVING LICENCE</text><text x="202" y="16" text-anchor="end" font-size="7.5" font-weight="600" fill="#cfe0ff" font-family="Inter,Arial">DELHI</text><image href="${IMG(P.face)}" x="10" y="32" width="50" height="62" preserveAspectRatio="xMidYMid slice" clip-path="url(#dlc${w})"/><g font-family="Inter,Arial"><text x="70" y="42" font-size="7" fill="#64748b">DL No.</text><text x="70" y="53" font-size="9.5" font-weight="700" fill="#111">DL04 20180012345</text><text x="70" y="67" font-size="7" fill="#64748b">Name</text><text x="70" y="77" font-size="9" font-weight="700" fill="#111">GURPREET SINGH</text><text x="70" y="91" font-size="7" fill="#64748b">DOB 14-08-1994 · Valid to 11-03-2038</text><text x="10" y="113" font-size="7.5" fill="#334155">Class: LMV-NT · MCWG</text><text x="10" y="124" font-size="7" fill="#64748b">Issued: RTO Janakpuri (DL04) · 12-03-2018</text></g><circle cx="184" cy="110" r="13" fill="none" stroke="#c49a2c" stroke-width="1.6"/></svg>`;
  const miniMap = (o = {}) => `<svg viewBox="0 0 220 110" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><rect width="220" height="110" fill="#eef1f4"/><path d="M0 62H220M120 0V110M0 18C80 30 150 6 220 26" stroke="#fff" stroke-width="9" fill="none"/><path d="M20 110C70 70 120 60 220 40" stroke="#fff" stroke-width="7" fill="none"/><rect x="20" y="70" width="50" height="30" fill="#dcefe0"/>${o.route ? `<path d="M40 30C80 44 110 50 150 58" stroke="${ORANGE}" stroke-width="3.5" fill="none" stroke-dasharray="7 5" class="flow"/><rect x="${o.car ?? 92}" y="38" width="20" height="11" rx="4" fill="#000"/><circle cx="40" cy="30" r="5" fill="#000"/>` : ''}<circle cx="150" cy="58" r="15" fill="#1f4fd1" opacity=".18" class="ping"/><circle cx="150" cy="58" r="6.5" fill="#1f4fd1" stroke="#fff" stroke-width="3"/></svg>`;
  const waCard = (img, title, body) => `<div class="wacard"><img src="${IMG(img)}" alt=""><div style="padding:9px 3px 2px"><div style="font-size:11px;font-weight:700;letter-spacing:.6px;color:#667781">${title}</div><div style="font-size:12.5px;line-height:1.55;margin-top:3px">${body}</div></div></div>`;
  const AF = C.name.split(' ')[0];

  const WA = [
    { div: 'MON 19 OCT' },
    { sys: 'Messages from this business are secured by Meta. Tap to learn more.' },
    { bot: `Hi ${P.first}, thanks for booking a test drive of the new <b>Renault Duster</b>.\n\nBefore we assign your dealer, we’ll confirm three quick details. It takes about a minute.`, t: '9:13 PM' },
    { bot: '<b>1 of 3 · Driving licence</b>\nPlease share a photo of the front of your driving licence. We need it before a car is handed over.', opts: ['Upload licence'], picked: 0, t: '9:13 PM' },
    { user: dlCard(), t: '9:13 PM' },
    { bot: '✓ <b>Licence verified</b>\nDL04 2018 0012345 · LMV · valid to 2038', t: '9:13 PM', wait: 2600 },
    { bot: '<b>2 of 3 · Soft credit check</b> (optional)\nShare your PAN for a soft check. It does <b>not</b> affect your credit score and helps us prioritise your test drive.', opts: ['Share PAN', 'Skip'], picked: 0, t: '9:14 PM' },
    { user: 'AFZPK7190K', t: '9:14 PM' },
    { bot: '✓ <b>Done.</b> Your details stay private. Your dealer never sees your score.', t: '9:14 PM', wait: 2200 },
    { bot: '<b>3 of 3 · Address</b>\nYour test drive is at home. Where should we bring the car?', opts: ['Share location', 'Type address'], picked: 0, t: '9:14 PM' },
    { user: `<div class="locimg">${miniMap()}</div><div style="font-size:11.5px;margin-top:4px">Rajouri Garden, New Delhi</div>`, t: '9:15 PM' },
    { user: P.addr, t: '9:15 PM' },
    { bot: '✓ <b>Address confirmed.</b> Three Renault dealers are within 8 km of you.', t: '9:15 PM', wait: 2200 },
    { bot: 'Two last questions so your consultant comes prepared.\n\nWhen are you planning to buy?', opts: ['This month', 'In 1–3 months', 'Just exploring'], picked: 0, t: '9:15 PM' },
    { user: 'This month', t: '9:15 PM' },
    { bot: 'Will anyone join you on the drive?', opts: ['Yes, my wife', 'Just me'], picked: 0, t: '9:16 PM' },
    { user: 'Yes, my wife', t: '9:16 PM' },
    { bot: `Thank you, ${P.first}. We’re assigning the nearest Renault dealer now.`, t: '9:16 PM' },
    { bot: waCard('duster-city.webp', 'TEST DRIVE CONFIRMED', `<b>Renault Duster · E-Tech 160 hybrid</b><br>Wed 21 Oct · 11:00 AM · at your home<br>Consultant: ${C.name}, ${C.dealer}<br>Demo car: DL 12 DE 0987`) + 'Please keep your original licence handy. We’ll call the day before to confirm.', opts: ['Add to calendar', 'Reschedule', `Call ${AF}`], t: '9:18 PM' },
    { div: 'TUE 20 OCT' },
    { bot: `<b>Updated after your call</b>\nYour test drive is now on <b>Wed 21 Oct at 11:30 AM</b>. ${AF} will call you at 11:15 AM.`, t: '5:43 PM' },
    { div: 'WED 21 OCT' },
    { bot: `Good morning, ${P.first}. <b>${AF} is on his way</b> with your Duster.` + `<div style="margin:8px -6px 6px;border-radius:6px;overflow:hidden;height:110px">${miniMap({ route: true })}</div>` + 'Live location · <b>arriving in 9 min</b>', t: '11:18 AM' },
    { bot: `Your handover code is <b>4831</b>. Share it with ${AF} when he arrives to start the drive.`, t: '11:18 AM' },
    { div: 'WED 21 OCT · 12:20 PM' },
    { bot: `Thank you for driving the new Duster, ${P.first}. How was your test drive?`, opts: ['Excellent', 'Good', 'Not great'], picked: 0, t: '12:20 PM' },
    { user: 'Excellent', t: '12:21 PM' },
    { bot: 'What stood out most?', opts: ['Hybrid drive', 'Ride comfort', 'Space and features'], picked: 0, t: '12:21 PM' },
    { user: 'Hybrid drive', t: '12:21 PM' },
    { bot: waCard('duster-bridge.webp', 'YOUR TEST DRIVE', `26 minutes · 14.2 km · city and Ring Road<br>Consultant: ${C.name} · rated 5 of 5`) + `${AF} will send you the brochure and is available for any questions.`, opts: ['Download brochure'], t: '12:22 PM', wait: 400 },
  ];

  function msgHTML(m, i, picked, live) {
    const cls = live ? ' live' : '';
    if (m.div) return `<div class="div${cls}" data-m="${i}"><span>${m.div}</span></div>`;
    if (m.sys) return `<div class="sysm${cls}" data-m="${i}"><span>${m.sys}</span></div>`;
    if (m.user) return `<div class="msg u${cls}" data-m="${i}"><div class="b">${m.user}<span class="tm">${m.t} <span style="color:#53bdeb">✓✓</span></span></div></div>`;
    return `<div class="msg${cls}" data-m="${i}"><div class="b">${m.bot}<span class="tm">${m.t}</span>${m.opts ? `<div class="opts">${m.opts.map((o, k) => `<div class="${k === picked ? 'pk' : ''}">${o}</div>`).join('')}</div>` : ''}</div></div>`;
  }
  function waPhone(start) {
    const msgs = WA.slice(0, start).map((m, i) => msgHTML(m, i, m.picked !== undefined && i + 1 < start ? m.picked : -1)).join('');
    return `<div class="phone wa"><div class="status"><span>9:41</span><i>5G ▮▮▮</i></div><div class="hd">${ic('left', 20, 'color:#1d8a4e')}<div class="lg">${rlogo(19)}</div><div><div class="n">Renault India <img src="${D.img.badge}" alt=""></div><div class="o" id="wastate">Business account</div></div><div class="ac">${ic('video', 20)}${ic('phone', 18)}</div></div><div class="body" id="wabody">${msgs}</div><div class="foot"><div class="in2">Message</div>${ic('mic', 20, 'color:#54656f')}</div></div>`;
  }

  // ───────────────────────────── Instagram ad ─────────────────────────────
  function igPhone() {
    return `<div class="phone ig"><div class="status"><span>9:12</span><i>5G ▮▮▮</i></div><div class="top"><span>Instagram</span><span style="display:flex;gap:16px;font-family:Inter">${ic('heart', 21)}${ic('send', 20)}</span></div>
      <div class="post"><div class="ph2"><div class="lg">${rlogo(16)}</div><div><div style="font-size:12.5px;font-weight:600">renaultindia</div><div style="font-size:10.5px;color:#737373">Sponsored</div></div><span style="margin-left:auto">${ic('dots', 18)}</span></div>
      <div class="media"><img src="${IMG('duster-trail.webp')}" alt="Renault Duster"></div>
      <div class="cta press"><span>Book a test drive</span>${ic('right', 16)}</div>
      <div class="acts">${ic('heart', 22)}${ic('msg', 21)}${ic('send', 21)}<span style="margin-left:auto">${ic('bookmark', 21)}</span></div>
      <div class="cap"><b>24,610 likes</b></div>
      <div class="cap"><b>renaultindia</b> The new Duster. Book a test drive at home or at your nearest Renault showroom.</div></div></div>`;
  }

  // ───────────────────────────── Renault website (booking) ─────────────────────────────
  const typed = (txt, d, dur = 0.9) => `<span class="typed" style="--n:${txt.length};--w:${txt.length + 0.5}ch;--d:${d}s;--dur:${dur}s">${txt}</span>`;
  function sitePhone(mode) {
    const live = mode === 'filled';
    const form = `
      <div class="hero"><img src="${IMG('duster-city.webp')}" alt="Renault Duster"><div class="t"><div class="k">THE NEW</div><div class="h">DUSTER</div></div></div>
      <div class="form">
        <div style="font-size:17px;font-weight:700;letter-spacing:-.3px">Book a test drive</div>
        <div class="fl">Engine</div><div class="seg"><div>1.3 Turbo<small>Petrol</small></div><div class="on">E-Tech 160<small>Strong hybrid</small></div></div>
        <div class="fl">Where</div><div class="seg"><div class="on">At home</div><div>At a showroom</div></div>
        <div class="fl">When</div><div class="seg"><div>Tue<small>20 Oct</small></div><div class="on">Wed<small>21 Oct</small></div><div>Thu<small>22 Oct</small></div><div>11:00<small>AM</small></div></div>
        <div class="fl">Your details</div>
        <div class="inp">${live ? typed(P.name, 0.5) : P.name}<span class="tick">${ic('check', 14)}</span></div>
        <div style="display:flex;gap:6px;margin-top:6px"><div class="inp" style="flex:1.6"><span class="pre">+91</span>${live ? typed('98374 92834', 1.6) : '98374 92834'}</div><div class="inp" style="flex:1"><span class="pre">PIN</span>${live ? typed('110027', 2.6, 0.6) : '110027'}</div></div>
        <div class="cons"><div class="bx">${ic('check', 10)}</div><div>I agree to be contacted by Renault and its dealers on WhatsApp, SMS and calls about my test drive.</div></div>
        <div class="rcta ${live ? 'press' : ''}" style="${live ? 'animation-delay:3.4s' : ''}">Book my test drive</div>
      </div>`;
    const otp =
      mode === 'otp'
        ? `<div class="dim"></div><div class="sheet"><div style="font-size:17px;font-weight:700">Verify your mobile</div><div style="font-size:12px;color:#6b7280;margin-top:4px">Enter the 6-digit code sent to +91 98374 92834</div><div class="otp">${'481902'.split('').map((c, i) => `<div class="in" style="animation-delay:${0.6 + i * 0.22}s;border-color:#000">${c}</div>`).join('')}</div><div class="in" style="animation-delay:2.1s;display:flex;align-items:center;gap:6px;font-size:12px;color:#129a4a;font-weight:600;margin:4px 0 14px">${ic('check', 14)} Number verified</div><div class="rcta in" style="margin-top:0;background:#25d366;animation-delay:2.5s">Continue on WhatsApp</div><div style="font-size:10.5px;color:#6b7280;text-align:center;margin-top:10px">We’ll finish three quick checks on WhatsApp.</div></div>`
        : '';
    return `<div class="phone br"><div class="status"><span>9:13</span><i>5G ▮▮▮</i></div><div class="url"><div>${ic('lock', 11)} renault.co.in</div></div><div class="site-hd"><div class="w">${rlogo(22)} RENAULT</div>${ic('dots', 20)}</div><div class="site">${form}${otp}</div></div>`;
  }

  // ───────────────────────────── dealer app ─────────────────────────────
  function dealerPhone(mode) {
    const head = `<div class="status"><span>9:16</span><i>5G ▮▮▮</i></div><div class="hd"><div class="a"><img src="${D.img.fsApp}" alt=""><div><div class="n">FreeStand Dealer</div><div class="o">${C.dealer} · ${C.name}</div></div></div></div>`;
    let body;
    if (mode === 'offer') {
      body = `<div style="font-size:10.5px;font-weight:700;letter-spacing:1.4px;color:#98a3b5;margin:2px 2px 10px">NEW TEST-DRIVE LEAD</div>
      <div class="lead"><div class="tp" id="leadtp"><span>OFFERED TO 3 DEALERS</span><span class="mono" id="cd">14:59 left</span></div><div class="in3">
        <div style="display:flex;gap:12px;align-items:center"><div class="grade">A</div><div><div style="font-size:15px;font-weight:700">Gurpreet S. · ${P.masked}</div><div style="font-size:12px;color:#5b6b82">Rajouri Garden · <b>3.2 km</b> from you</div></div></div>
        <div style="margin:12px 0 0;border-radius:12px;overflow:hidden;position:relative;height:96px"><img src="${IMG('duster-city.webp')}" style="width:100%;height:100%;object-fit:cover"><div style="position:absolute;left:10px;bottom:8px;color:#fff;font-size:12px;font-weight:600;text-shadow:0 1px 6px rgba(0,0,0,.5)">Duster E-Tech 160 · home drive</div></div>
        <div style="font-size:12px;line-height:1.75;margin:10px 2px 2px;color:#3b4352">Wed 21 Oct · 11:00 AM<br>Buying this month · wife joining</div>
        <div class="chips" style="margin:10px 0 12px"><span class="chip green">Licence verified</span><span class="chip green">Credit: excellent</span><span class="chip green">Address 94/100</span></div>
        <div class="btn or" id="accept">Accept test drive</div><div class="btn ghost" style="margin-top:7px;height:40px" id="pass">Pass</div>
      </div></div>
      <div style="font-size:11px;color:#6b7280;margin-top:12px;line-height:1.5;padding:0 2px">Name, number and address unlock when you accept. If another dealer accepts first, this offer closes.</div>`;
    } else {
      body = `<div style="display:flex;align-items:center;gap:8px;margin:0 2px 10px"><span class="chip green">Accepted in 1 m 48 s</span><span style="font-size:11px;color:#5b6b82">${P.lead}</span></div>
      <div class="card in" style="padding:12px;margin-bottom:12px"><div style="display:flex;gap:10px;align-items:center">${avatar(P.face, 42, 12)}<div><div style="font-weight:700;font-size:14px">${P.name}</div><div style="font-size:12px;color:#5b6b82">${P.phone}</div></div><span style="margin-left:auto;color:#129a4a">${ic('phone', 18)}</span></div><div style="font-size:11.5px;color:#5b6b82;margin-top:8px;line-height:1.45">${P.addr}</div></div>
      <div class="fl" style="margin-top:0">Consultant</div>
      <div class="opt on in" style="animation-delay:.4s"><div class="rd"></div>${avatar(C.face, 32, 9, C.pos)}<div><div style="font-size:12.5px;font-weight:600">${C.name}</div><div style="font-size:11px;color:#6b7280">Free 10:30–12:30 · 4.8 rating</div></div></div>
      <div class="opt in" style="animation-delay:.5s"><div class="rd"></div><div><div style="font-size:12.5px;font-weight:600">Neha Arora</div><div style="font-size:11px;color:#6b7280">On showroom duty until 1 PM</div></div></div>
      <div class="fl">Demo car</div>
      <div class="opt on in" style="animation-delay:.8s"><div class="rd"></div>${photo('duster-bridge.webp', 64, 40, '60% 60%', 8)}<div><div style="font-size:12.5px;font-weight:600">DL 12 DE 0987</div><div style="font-size:11px;color:#6b7280">E-Tech 160 · Pearl White · charged</div></div></div>
      <div class="fl">Slot</div><div class="seg in" style="animation-delay:1.1s"><div class="on">Wed 21 Oct · 11:00 AM</div></div>
      <div class="btn dark in" id="confirm" style="margin-top:14px;animation-delay:1.4s">Confirm and notify customer</div>`;
    }
    return `<div class="phone dl">${head}<div class="bd">${body}</div></div>`;
  }

  // ───────────────────────────── AI call phone ─────────────────────────────
  function callPhone() {
    let bars = '';
    for (let i = 0; i < 34; i++) bars += `<i style="display:inline-block;width:3.5px;margin:0 1.5px;border-radius:2px;background:#4ade80;height:${8 + ((i * 37) % 30)}px;animation:wbar .9s ${(i % 7) * 0.11}s ease-in-out infinite"></i>`;
    const btn = (n, l) => `<div style="text-align:center;font-size:11px;color:#9aa6bd"><div style="width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,.1);display:grid;place-items:center;margin-bottom:6px;color:#fff">${ic(n, 22)}</div>${l}</div>`;
    return `<div class="phone call"><div class="status"><span>5:42</span><i>5G ▮▮▮</i></div>
      <div style="text-align:center;padding-top:64px"><div style="width:92px;height:92px;margin:0 auto;border-radius:50%;background:#000;display:grid;place-items:center;box-shadow:0 0 0 1px rgba(255,255,255,.15),0 0 0 12px rgba(255,255,255,.04)">${rlogo(42)}</div>
      <div style="font-size:24px;font-weight:600;margin-top:24px;letter-spacing:-.3px">Renault India</div><div style="font-size:13px;color:#9aa6bd;margin-top:5px">Test-drive desk · AI assistant</div>
      <div style="display:inline-flex;align-items:center;gap:6px;margin-top:12px;font-size:11px;color:#c9d3e6;background:rgba(255,255,255,.08);padding:5px 11px;border-radius:999px">${ic('shield', 13)} Verified business caller</div>
      <div style="font-size:34px;font-weight:300;margin-top:34px;font-variant-numeric:tabular-nums;letter-spacing:1px" id="calltime">00:00</div>
      <div style="height:44px;display:flex;align-items:center;justify-content:center;margin-top:18px">${bars}</div>
      <div style="font-size:11px;color:#9aa6bd;margin-top:12px">This call is recorded. Consent given.</div></div>
      <div style="position:absolute;left:0;right:0;bottom:150px;display:flex;justify-content:space-around;padding:0 38px">${btn('mic', 'Mute')}${btn('dots', 'Keypad')}${btn('phone', 'Speaker')}</div>
      <div style="position:absolute;left:50%;bottom:56px;width:68px;height:68px;border-radius:50%;background:#ef4444;display:grid;place-items:center;color:#fff;transform:translateX(-50%) rotate(135deg)">${ic('phone', 26)}</div></div>`;
  }

  // ───────────────────────────── panels ─────────────────────────────
  const waitPanel = (icon, title, sub, msg) => `<div class="panel" id="panel">${ph(icon, title, sub, 'Waiting', 'amber')}<div class="waiting"><div class="sp"></div><div>${msg}</div><div class="skel" style="width:40%"></div><div class="skel" style="width:32%"></div></div></div>`;

  function campaignPanel() {
    return `<div class="panel show" id="panel">${ph('mega', 'Campaign', 'Renault India · Meta Ads → FreeStand', 'Live')}
      <div class="pb"><div style="display:grid;grid-template-columns:300px 1fr;gap:26px">
        <div>${photo('duster-trail.webp', 300, 375, '55% center', 16)}<div class="lbl" style="margin-top:8px">Creative: Renault’s Duster campaign visual</div></div>
        <div><div class="sec">Setup</div><div class="kv in" style="grid-template-columns:104px 1fr;animation-delay:.2s">
          <div class="k">Platform</div><div class="v">Instagram · feed and Reels</div><div class="k">Campaign</div><div class="v">Duster · test drive · Delhi NCR</div><div class="k">Audience</div><div class="v">In-market SUV buyers, 25–45</div><div class="k">Landing</div><div class="v">renault.co.in · test-drive form</div><div class="k">Tracking</div><div class="v mono" style="font-size:12px">utm=duster_td_delhi</div></div>
          <div class="sec" style="margin-top:22px">What changes</div>
          ${rows([['The source travels with the lead', 'Every click carries its campaign into the customer profile', 'ATTRIBUTED'], ['Optimised for real test drives', 'Meta receives a “test drive completed” event, not just form fills', 'CAPI'], ['Cost per completed test drive', 'Measured end to end, per campaign and per dealer', 'TRACKED']], 0.5, 0.25)}
        </div></div></div></div>`;
  }

  function leadCapturedPanel() {
    return `<div class="panel show" id="panel">${ph('inbox', 'Lead captured', 'renault.co.in → FreeStand · in real time', 'New', 'orange')}
      <div class="pb">
        <div style="display:flex;gap:14px;align-items:center;margin-bottom:18px"><div class="big mono" style="font-size:22px;letter-spacing:0">${P.lead}</div><span class="chip orange">Not yet verified</span><span class="lbl" style="margin-left:auto">Mon 19 Oct · 9:13:06 PM</span></div>
        <div class="grid2">
          <div class="card in"><div class="sec">From the form</div><div class="kv" style="grid-template-columns:90px 1fr">
            <div class="k">Name</div><div class="v">${P.name}</div><div class="k">Mobile</div><div class="v">${P.phone}</div><div class="k">PIN code</div><div class="v">110027</div>
            <div class="k">Model</div><div class="v">Duster E-Tech 160</div><div class="k">Where</div><div class="v">At home</div><div class="k">Slot</div><div class="v">Wed 21 Oct · 11:00 AM</div></div></div>
          <div class="card in" style="animation-delay:.2s"><div class="sec">Captured with it</div><div class="kv" style="grid-template-columns:90px 1fr">
            <div class="k">Source</div><div class="v">Instagram · paid</div><div class="k">Campaign</div><div class="v mono" style="font-size:12px">duster_td_delhi</div><div class="k">Device</div><div class="v">Android · Chrome</div>
            <div class="k">Session</div><div class="v">48 s · two engines viewed</div><div class="k">Consent</div><div class="v">WhatsApp, SMS, calls</div><div class="k">Language</div><div class="v">English</div></div></div>
        </div>
        <div class="sec" style="margin-top:22px">Instant checks</div>
        ${rows([['No duplicate', 'No open test-drive lead for this number in 90 days', 'UNIQUE'], ['PIN code serviceable', '110027 · three Renault dealers within 8 km', '3 DEALERS'], ['Not a bot or a dealer number', 'Human typing pattern · not on the dealer staff list', 'PASS'], ['Mobile ownership', 'One-time code sent to +91 98374 92834', 'NEXT', 'wait']], 0.5, 0.3)}
      </div></div>`;
  }

  // The customer profile: the record every later step adds to.
  function profileHead(o) {
    const v = (t, on) => `<span class="chip ${on ? 'green' : ''}" style="${on ? '' : 'color:#98a3b5'}">${on ? '✓ ' : ''}${t}</span>`;
    return `<div style="display:flex;gap:20px;align-items:center">${avatar(P.face, 104, 18)}
      <div style="flex:1"><div style="font-size:21px;font-weight:700;letter-spacing:-.4px">${P.name}</div><div style="font-size:12.5px;color:#5b6b82;margin-top:3px">${P.phone}${o.addr ? ' · Rajouri Garden, New Delhi 110027' : ' · PIN 110027'}</div>
      <div class="chips" style="margin-top:10px">${v('Mobile', 1)}${v('WhatsApp', 1)}${v('Licence', o.dl)}${v('Credit', o.cr)}${v('Address', o.addr)}</div></div>
      ${o.grade ? `<div style="text-align:center" class="pop"><div style="width:92px;height:92px;border-radius:50%;background:conic-gradient(#129a4a 0 91%, #eef1f6 0);display:grid;place-items:center"><div style="width:74px;height:74px;border-radius:50%;background:#fff;display:grid;place-items:center"><div><div style="font-size:26px;font-weight:800;line-height:1;letter-spacing:-.5px">91</div><div style="font-size:9.5px;font-weight:700;color:#129a4a;letter-spacing:.6px">GRADE A</div></div></div></div><div class="lbl" style="margin-top:4px">Lead score</div></div>` : ''}</div>`;
  }

  function otpProfilePanel() {
    return `<div class="panel show" id="panel">${ph('user', 'Customer profile', `${P.lead} · Renault India`, 'Synced')}
      <div class="pb">${profileHead({})}
        <div class="grid2" style="margin-top:24px">
          <div><div class="sec">Booking</div><div class="card" style="font-size:13px;line-height:1.9"><b>Duster E-Tech 160 hybrid</b><br>At home · Wed 21 Oct · 11:00 AM<br>Source: Instagram · <span class="mono" style="font-size:11.5px">duster_td_delhi</span></div></div>
          <div><div class="sec">Cohorts</div>${chips([['Home test drive', 'new'], ['Paid social', 'new'], ['Hybrid interest', 'new']])}</div>
        </div>
        <div class="sec" style="margin-top:22px">Validation</div>
        ${rows([['Mobile verified', 'One-time code auto-read', 'OTP'], ['WhatsApp consent recorded', 'Purpose: test drive and updates · Mon 9:13:41 PM', 'DPDP'], ['Driving licence', 'Next, on WhatsApp', 'PENDING', 'wait'], ['Soft credit check', 'Next, on WhatsApp · optional', 'PENDING', 'wait'], ['Address', 'Next, on WhatsApp', 'PENDING', 'wait']], 0.9, 0.22)}
      </div></div>`;
  }

  function dlPanel() {
    return `<div class="panel show" id="panel">${ph('id', 'Driving licence', 'Read from the photo and matched to the Parivahan record', 'Verified')}
      <div class="pb"><div style="display:grid;grid-template-columns:300px 1fr;gap:26px">
        <div><div style="border-radius:12px;overflow:hidden;box-shadow:0 12px 30px rgba(13,42,105,.14)">${dlCard(300)}</div>
          <div class="sec" style="margin-top:22px">Read from the photo</div>
          <div class="kv in" style="grid-template-columns:96px 1fr;font-size:12.5px;animation-delay:.3s"><div class="k">Licence no.</div><div class="v mono">DL04 20180012345</div><div class="k">Name</div><div class="v">Gurpreet Singh</div><div class="k">Date of birth</div><div class="v">14 Aug 1994</div><div class="k">Class</div><div class="v">LMV-NT, MCWG</div><div class="k">Valid to</div><div class="v">11 Mar 2038</div><div class="k">Issued by</div><div class="v">RTO Janakpuri</div></div></div>
        <div><div class="sec">Checks <span class="r">2.8 s</span></div>
          ${rows([['Clear, complete photo', 'Front side · no glare · not cropped', '98%'], ['Not edited or reused', 'Original photo · not a screenshot', 'PASS'], ['Government record', 'Parivahan Sarathi: active, details match', 'MATCH'], ['Same person who booked', '“GURPREET SINGH” matches the booking', '100%'], ['Allowed to drive this car', 'LMV-NT covers a four-wheeler', 'LMV'], ['Valid on the test-drive date', 'Wed 21 Oct 2026', 'VALID'], ['No suspension on record', '', 'CLEAR']], 0.3, 0.28)}
          <div class="in" style="margin-top:16px;animation-delay:2.4s">${note('shield', '<b>Why it matters:</b> the dealer’s insurance needs a valid licence before a demo car leaves the showroom. Unverified leads never reach a dealer.')}</div>
        </div></div></div></div>`;
  }

  function creditPanel() {
    const sc = 784, a = ((sc - 300) / 600) * 180;
    const r = 92, cx = 120, cy = 116;
    const ex = cx - r * Math.cos((a * Math.PI) / 180), ey = cy - r * Math.sin((a * Math.PI) / 180);
    const gauge = `<svg width="240" height="140" viewBox="0 0 240 140"><path d="M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}" stroke="#eef1f6" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M${cx - r} ${cy}A${r} ${r} 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#129a4a" stroke-width="14" fill="none" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" style="animation:dash2 1.4s .3s forwards"/><text x="${cx}" y="${cy - 14}" text-anchor="middle" font-size="40" font-weight="700" fill="#0b1324" font-family="Inter,Arial" letter-spacing="-1">${sc}</text><text x="${cx}" y="${cy + 10}" text-anchor="middle" font-size="11" font-weight="700" fill="#129a4a" letter-spacing="1" font-family="Inter,Arial">EXCELLENT</text></svg>`;
    return `<div class="panel show" id="panel">${ph('card', 'Soft credit check', 'Consented bureau check · no effect on the customer’s score', 'Done')}
      <div class="pb"><div style="display:grid;grid-template-columns:280px 1fr;gap:26px">
        <div class="card" style="text-align:center;padding:18px">${gauge}<div class="lbl">CIBIL · soft enquiry · 19 Oct 2026</div>
          <div style="text-align:left;margin-top:18px" class="kv"><div class="k">PAN</div><div class="v mono">AFZPK••90K</div><div class="k">Active loans</div><div class="v">1</div><div class="k">Missed EMIs</div><div class="v">None in 24 months</div></div></div>
        <div><div class="sec">How it is used</div>
          ${rows([['Consent recorded', 'Purpose: test-drive prioritisation · valid 30 days', 'DPDP'], ['Dealer sees a band, not a score', '“Credit: excellent” on the lead card; the number stays with Renault', 'MASKED'], ['Raises the lead score', 'Ability to buy is one of four signals', '+18'], ['Optional by design', 'Customers who skip are still verified on licence, address and intent', 'OPTIONAL', 'info']], 0.5, 0.3)}
          <div class="sec" style="margin-top:20px">Cohorts added</div>${chips([['Credit: excellent', 'green new'], ['Priority lead', 'new']])}
        </div></div></div></div>`;
  }

  function addrPanel() {
    return `<div class="panel show" id="panel">${ph('pin', 'Address quality', 'Parsed, standardised, located and checked for a home test drive', 'Scored')}
      <div class="pb"><div style="display:grid;grid-template-columns:1fr 250px;gap:24px">
        <div><div class="grid2" style="gap:10px">
          <div class="card"><div class="lbl">As typed</div><div style="font-size:12.5px;margin-top:6px;line-height:1.5">${P.addr}</div></div>
          <div class="card in" style="border-color:#cdebd8;background:#f7fcf9;animation-delay:.4s"><div class="lbl">Standardised</div><div style="font-size:11.5px;margin-top:6px;line-height:1.6" class="mono">FLAT C-42 · FLOOR 2<br>VISHAL ENCLAVE, C BLOCK<br>RAJOURI GARDEN, WEST DELHI<br>DELHI 110027</div></div></div>
          <div class="sec" style="margin-top:20px">Checks</div>
          ${rows([['PIN code matches the area', '110027 is Rajouri Garden, West Delhi', 'MATCH'], ['Flat number present', 'A driver can find the door', 'YES'], ['Located on the map', 'Rooftop accuracy · 28.6449 N, 77.1210 E', '0.97'], ['A home, not an office', 'Residential apartment society', 'HOME'], ['Home test drive possible', 'Three dealers within 8 km; nearest 3.2 km', '3 IN 8 KM'], ['Gate pass needed', 'Society security asks for visitor names; shared with the consultant', 'NOTE', 'info']], 0.6, 0.25)}
        </div>
        <div><div class="card" style="text-align:center;padding:20px 12px"><div class="lbl">Address quality</div><div class="big" style="font-size:52px;color:#129a4a;letter-spacing:-2px">94</div><div class="lbl">out of 100</div><div class="bar2" style="margin:12px 6px 0"><i style="width:94%"></i></div></div>
          <div style="height:150px;border-radius:14px;overflow:hidden;margin-top:12px;border:1px solid var(--line)">${miniMap()}</div>
          <div class="sec" style="margin-top:16px">Cohorts added</div>${chips([['West Delhi', 'new'], ['Apartment', 'new']])}</div>
      </div></div></div>`;
  }

  function enrichedBody() {
    const col = (t, icon, rws, d) => `<div class="card in" style="padding:13px 15px;animation-delay:${d}s"><div style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;margin-bottom:8px;color:#0a3578">${ic(icon, 15)}${t}</div>${rws.map(([k, v]) => `<div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0"><span style="color:#98a3b5">${k}</span><b style="font-weight:600">${v}</b></div>`).join('')}</div>`;
    return `${profileHead({ dl: 1, cr: 1, addr: 1, grade: 1 })}
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:22px">
          ${col('Identity', 'id', [['Mobile', 'Verified'], ['Licence', 'Valid · LMV'], ['Fraud screen', 'Clear']], 0.2)}
          ${col('Ability to buy', 'card', [['Credit band', 'Excellent'], ['Missed EMIs', 'None'], ['Signal', '+18']], 0.35)}
          ${col('Intent', 'radar', [['Buying', 'This month'], ['Drive', 'At home'], ['Source', 'Instagram']], 0.5)}
          ${col('Location', 'pin', [['Address', '94 / 100'], ['Area', 'West Delhi'], ['Dealers ≤ 8 km', '3']], 0.65)}
          ${col('The drive', 'car', [['Engine', 'E-Tech hybrid'], ['Slot', 'Wed 11:00 AM'], ['Joining', 'Wife']], 0.8)}
          ${col('Engagement', 'msg', [['Replies', '7 of 7'], ['Time taken', '3 m 10 s'], ['Channel', 'WhatsApp']], 0.95)}
        </div>
        <div class="sec" style="margin-top:20px">Cohorts</div>
        ${chips([['In market · 0–30 days', 'orange'], ['Credit: excellent', 'green'], ['Hybrid interest', ''], ['Home test drive', ''], ['West Delhi', ''], ['Paid social', ''], ['Grade A', 'navy']])}`;
  }
  function enrichedPanel() {
    return `<div class="panel show" id="panel">${ph('star', 'Customer profile', `${P.lead} · verified and ready to route`, 'Grade A')}
      <div class="pb">${enrichedBody()}
        <div style="margin-top:18px">${note('route', '<b>Routing rule:</b> grade A and B leads go to the three nearest dealers with a 15-minute window. Grade C gets an AI qualification call first. Unverified leads never reach a dealer.')}</div>
      </div></div>`;
  }

  // The dealer map, drawn for the routing modal.
  const DEALERS = [
    { id: 'kn', name: 'Renault Kirti Nagar', km: '3.2 km · 12 min', x: 300, y: 150 },
    { id: 'pb', name: 'Renault Punjabi Bagh', km: '5.4 km · 18 min', x: 160, y: 70 },
    { id: 'jp', name: 'Renault Janakpuri', km: '6.1 km · 21 min', x: 90, y: 330 },
  ];
  function routeMap() {
    const home = { x: 230, y: 230 };
    let s = `<rect width="460" height="460" fill="#f3f5f8"/>`;
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) if ((i * 3 + j * 5) % 7 > 2) s += `<rect x="${i * 60 + 6}" y="${j * 60 + 6}" width="48" height="48" rx="6" fill="#eaedf2"/>`;
    s += `<path d="M330 -10C320 120 380 260 360 470" stroke="#dbe7f5" stroke-width="22" fill="none"/>`;
    const road = (d, w) => `<path d="${d}" stroke="#fff" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
    s += road('M-10 230H470', 16) + road('M230 -10V470', 12) + road('M-10 60C150 80 300 30 470 70', 13) + road('M40 470C120 330 220 300 470 150', 13);
    s += `<circle cx="${home.x}" cy="${home.y}" r="200" fill="none" stroke="#0a3578" stroke-opacity=".25" stroke-dasharray="5 6"/><text x="${home.x + 120}" y="${home.y + 176}" font-size="11" font-weight="600" fill="#0a3578" opacity=".6" font-family="Inter,Arial">8 km</text>`;
    DEALERS.forEach((d) => {
      s += `<path id="ln-${d.id}" d="M${home.x} ${home.y}L${d.x} ${d.y}" stroke="${ORANGE}" stroke-width="2.5" stroke-dasharray="6 6" class="flow"/>`;
    });
    DEALERS.forEach((d, i) => {
      s += `<g class="pop" style="animation-delay:${0.4 + i * 0.25}s"><circle cx="${d.x}" cy="${d.y}" r="22" fill="${ORANGE}" opacity=".18" class="ping" id="pg-${d.id}"/><circle cx="${d.x}" cy="${d.y}" r="15" fill="#000"/><g transform="translate(${d.x - 6.5} ${d.y - 8.5}) scale(.2)"><path fill="#fff" d="${RL}"/></g><rect x="${d.x - 10}" y="${d.y + 19}" width="20" height="15" rx="7.5" fill="#fff" stroke="#e6eaf1"/><text x="${d.x}" y="${d.y + 30}" text-anchor="middle" font-size="9" font-weight="700" fill="#0b1324" font-family="Inter,Arial">${i + 1}</text></g>`;
    });
    s += `<circle cx="${home.x}" cy="${home.y}" r="30" fill="#1f4fd1" opacity=".15" class="ping"/><circle cx="${home.x}" cy="${home.y}" r="13" fill="#1f4fd1" stroke="#fff" stroke-width="4"/><rect x="${home.x - 64}" y="${home.y + 20}" width="128" height="24" rx="12" fill="#0b1324"/><text x="${home.x}" y="${home.y + 36}" text-anchor="middle" font-size="11" font-weight="600" fill="#fff" font-family="Inter,Arial">Gurpreet · 110027</text>`;
    return `<svg viewBox="0 0 460 460" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  }
  function routingPanel() {
    const dl = DEALERS.map((d, i) => `<div class="dealer in" id="dl-${d.id}" style="animation-delay:${0.5 + i * 0.2}s"><div class="n">${i + 1}</div><div><div class="t">${d.name}</div><div class="s">${d.km}</div></div><span class="chip orange">Offered</span></div>`).join('');
    return `<div class="panel show" id="panel">${ph('star', 'Customer profile', `${P.lead} · verified and ready to route`, 'Grade A')}
      <div class="pb">${enrichedBody()}</div>
      <div class="scrim"></div>
      <div class="modal"><div class="mh"><div class="ph" style="height:auto;padding:0;border:none"><div class="ic">${ic('radar', 19)}</div></div><div><div class="tt">Finding the nearest dealer</div><div class="ss">Offered to the three closest Renault dealers · first to accept wins · 15-minute window</div></div><span id="mpill" style="margin-left:auto">${pillH('Offered', 'orange')}</span></div>
        <div class="mb"><div style="position:relative;border-right:1px solid var(--line)">${routeMap()}</div>
          <div style="padding:16px 16px 12px;display:flex;flex-direction:column"><div class="sec">Dealers <span class="r mono" id="race">00:00</span></div>${dl}
            <div style="margin-top:auto">${note('eyeoff', 'Dealers see the grade, the slot and the distance. Name, number and address unlock only for the dealer who accepts.')}</div></div></div></div>
    </div>`;
  }

  function assignedPanel() {
    return `<div class="panel show" id="panel">${ph('user', 'Customer profile', `${P.lead} · assigned to ${C.dealer}`, 'Assigned', 'blue')}
      <div class="pb">${profileHead({ dl: 1, cr: 1, addr: 1, grade: 1 })}
        <div class="sec" style="margin-top:24px">Test drive</div>
        <div class="card in" style="padding:0;overflow:hidden;display:grid;grid-template-columns:260px 1fr;animation-delay:.2s">${photo('duster-bridge.webp', 260, 196, '60% 60%', 0)}
          <div style="padding:16px 18px"><div style="font-size:16px;font-weight:700;letter-spacing:-.2px">Duster E-Tech 160 · DL 12 DE 0987</div><div class="lbl" style="margin-top:2px">Pearl White · charged · insured</div>
            <div style="display:flex;gap:12px;align-items:center;margin-top:14px">${avatar(C.face, 46, 12, C.pos)}<div><div style="font-size:13.5px;font-weight:600">${C.name}</div><div class="lbl">Sales consultant · ${C.dealer} · 4.8 rating</div></div></div>
            <div style="display:flex;gap:18px;margin-top:14px;font-size:12.5px"><span style="display:flex;gap:6px;align-items:center">${ic('calendar', 15)} Wed 21 Oct · 11:00 AM</span><span style="display:flex;gap:6px;align-items:center">${ic('home', 15)} At home</span></div></div></div>
        <div class="sec" style="margin-top:20px">Handover to the dealer</div>
        ${rows([['Lead created in the dealer’s DMS', 'DMS-KN-88412 · source and campaign attached', 'SYNCED'], ['Consultant briefed', 'Hybrid interest · buying this month · wife joining · gate pass', 'SENT'], ['Car and consultant blocked', '11:00–12:00 including travel', 'BLOCKED'], ['Customer confirmation', 'Goes out on WhatsApp when the dealer confirms', 'NEXT', 'wait']], 0.5, 0.25)}
      </div></div>`;
  }

  function commsPanel() {
    const tl = (t, x, s, done, d) => `<div class="in" style="display:flex;gap:14px;animation-delay:${d}s"><div style="display:flex;flex-direction:column;align-items:center"><div style="width:12px;height:12px;border-radius:50%;background:${done ? '#129a4a' : '#fff'};border:2px solid ${done ? '#129a4a' : '#c9d1de'};margin-top:3px"></div><div style="flex:1;width:1.5px;background:#e6eaf1;min-height:28px"></div></div><div style="padding-bottom:14px"><div style="font-size:13px;font-weight:600">${x}</div><div style="font-size:11.5px;color:#5b6b82;margin-top:1px">${t} · ${s}</div></div></div>`;
    return `<div class="panel show" id="panel">${ph('msg', 'Confirmation and reminders', 'Automated by FreeStand · no salesperson’s phone involved', 'Active')}
      <div class="pb"><div class="grid2" style="gap:24px">
        <div><div class="sec">Confirmation</div>
          ${rows([['Sent on WhatsApp', 'Rich card with the car, slot, consultant', '9:18:01'], ['Delivered', '', '9:18:02'], ['Read', '29 seconds after delivery', '9:18:30'], ['Calendar invite added', 'Address, consultant and car', 'ADDED']], 0.2, 0.3)}
          <div class="sec" style="margin-top:20px">If something slips</div>
          ${note('alert', 'Not delivered in 2 minutes → <b>SMS</b>.<br>Not read in 2 hours → <b>AI call</b>.<br>A reschedule from any message updates the dealer instantly.')}
        </div>
        <div><div class="sec">Scheduled</div>
          ${tl('Mon 9:18 PM', 'Confirmation', 'WhatsApp, delivered and read', 1, 0.3)}
          ${tl('Tue 5:40 PM', 'AI confirmation call', 'the evening before', 0, 0.45)}
          ${tl('Wed 9:00 AM', 'Morning reminder', 'WhatsApp, with a documents checklist', 0, 0.6)}
          ${tl('Wed 10:45 AM', 'Consultant on the way', 'live location and handover code', 0, 0.75)}
          ${tl('Wed, after the drive', 'Feedback', 'rating and what stood out', 0, 0.9)}
        </div></div></div></div>`;
  }

  function callPanel() {
    const line = (w, t, d) => `<div class="in" style="display:flex;gap:10px;margin-bottom:11px;animation-delay:${d}s"><span style="flex:none;width:92px;white-space:nowrap;font-size:10px;font-weight:700;letter-spacing:.8px;color:${w === 'ai' ? '#0a3578' : '#c25000'};padding-top:2px">${w === 'ai' ? 'AI ASSISTANT' : 'GURPREET'}</span><span style="font-size:13px;line-height:1.5;color:${w === 'ai' ? '#3b4352' : '#0b1324'};font-weight:${w === 'ai' ? 400 : 600}">${t}</span></div>`;
    const ex = (k, v, d, cls = '') => `<div class="in" style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f0f2f6;font-size:12.5px;animation-delay:${d}s"><span style="color:#5b6b82">${k}</span><span class="chip ${cls}">${v}</span></div>`;
    return `<div class="panel show" id="panel">${ph('mic', 'AI confirmation call', 'Tue 20 Oct · 5:42 PM · answered on the first attempt', 'On call')}
      <div class="pb"><div style="display:grid;grid-template-columns:1.3fr 1fr;gap:26px">
        <div><div class="sec">Transcript</div>
          ${line('ai', 'Hello Gurpreet, this is Renault’s test-drive assistant. Your Duster test drive is booked for tomorrow at 11 AM at your home. Is that still a good time?', 0.3)}
          ${line('c', 'Yes, but could we make it 11:30?', 2.2)}
          ${line('ai', 'Of course. I’ve moved it to 11:30 AM. Arjun, your consultant, will call you at 11:15.', 3.6)}
          ${line('c', 'Great. My wife will join us too.', 5.4)}
          ${line('ai', 'Noted, I’ll let Arjun know. Please keep your original driving licence handy. Anything else I can help with?', 6.8)}
          ${line('c', 'No, that’s all. Thanks.', 8.6)}
        </div>
        <div><div class="sec">Captured</div>
          ${ex('Test drive', 'Confirmed', 2.4, 'green')}${ex('Time', '11:00 → 11:30 AM', 3.8, 'orange')}${ex('Joining', 'Wife', 5.6)}${ex('Documents', 'Licence ready', 7.0, 'green')}${ex('Sentiment', 'Positive', 8.8, 'green')}
          <div class="sec" style="margin-top:18px">Done automatically</div>
          ${rows([['Slot moved in the DMS', 'Car and consultant re-blocked', 'DONE'], ['Arjun notified', 'FreeStand Dealer app', 'DONE'], ['WhatsApp updated', 'New time sent to Gurpreet', 'DONE']], 4.0, 2.4)}
        </div></div></div></div>`;
  }

  function trackPanel() {
    return `<div class="panel show" id="panel">${ph('route', 'On the day', 'Wed 21 Oct · consultant on the way', 'Live')}
      <div class="pb"><div style="display:grid;grid-template-columns:1fr 280px;gap:22px">
        <div><div style="height:310px;border-radius:16px;overflow:hidden;border:1px solid var(--line);position:relative">${miniMap({ route: true, car: 104 })}<div style="position:absolute;left:14px;top:14px;background:#0b1324;color:#fff;border-radius:10px;padding:8px 12px;font-size:12px"><b>Arriving in 9 min</b> · 2.1 km</div></div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px"><div class="card"><div class="lbl">Left showroom</div><div style="font-size:18px;font-weight:700;margin-top:2px">11:12 AM</div></div><div class="card"><div class="lbl">Expected at gate</div><div style="font-size:18px;font-weight:700;margin-top:2px">11:27 AM</div></div><div class="card"><div class="lbl">Slot</div><div style="font-size:18px;font-weight:700;margin-top:2px">11:30 AM</div></div></div></div>
        <div><div class="card" style="display:flex;gap:12px;align-items:center">${avatar(C.face, 52, 12, C.pos)}<div><div style="font-weight:700">${C.name}</div><div class="lbl">DL 12 DE 0987 · Pearl White</div></div></div>
          <div class="sec" style="margin-top:18px">Checks</div>
          ${rows([['Morning reminder read', '9:02 AM', 'READ'], ['Consultant called ahead', '11:15 AM · 48 s', 'DONE'], ['Handover code sent', 'Starts the drive', 'SENT'], ['Arrival at the gate', 'Alert at 200 m', 'WAITING', 'wait']], 0.2, 0.2)}
          <div style="margin-top:14px">${note('clock', '<b>On time, or told.</b> If the car is 10+ minutes late, Gurpreet is updated automatically and the showroom manager is alerted.')}</div>
        </div></div></div></div>`;
  }

  function outcomePanel() {
    const k = (l, v, s, d) => `<div class="card in" style="animation-delay:${d}s"><div class="lbl">${l}</div><div class="big" style="font-size:24px;margin-top:2px">${v}</div><div class="lbl">${s}</div></div>`;
    return `<div class="panel show" id="panel">${ph('star', 'Test drive completed', `${P.lead} · closed loop to Renault and the dealer`, 'Completed')}
      <div class="pb">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">${k('Started', '11:34 AM', 'handover code + licence re-check', 0)}${k('Drive', '26 min', '14.2 km · city and Ring Road', 0.15)}${k('Rating', '5 / 5', '“Excellent”', 0.3)}${k('Stood out', 'Hybrid', 'drive feel', 0.45)}</div>
        <div class="grid2" style="margin-top:20px;gap:22px">
          <div><div class="sec">Closed loop</div>
            ${rows([['Test drive verified', 'Started 11:34 AM · car back 12:00 PM', 'DONE'], ['Dealer DMS updated', 'Stage: test drive done', 'SYNCED'], ['Consultant rated', `${C.name} · 5 of 5`, 'RATED'], ['Meta told what happened', '“Test drive completed” event for the campaign', 'CAPI']], 0.6, 0.25)}
          </div>
          <div><div class="sec">Cohorts</div>
            ${chips([['Test drive: done', 'green new'], ['Rated 5 / 5', 'green new'], ['Hybrid interest', ''], ['In market · 0–30 days', 'orange'], ['Grade A', 'navy']])}
            <div class="sec" style="margin-top:20px">Hand back to the dealer</div>
            ${note('users', `The verified profile, the drive and the feedback are with ${C.dealer}. What happens next in the sale is the dealer’s; FreeStand’s job ends with a test drive that happened.`)}
          </div></div>
      </div></div>`;
  }

  // ───────────────────────────── full-canvas pages ─────────────────────────────
  function problemOne() {
    const T = [
      ['2:15 PM', '“Will you send the car for a test drive today?”'],
      ['2:15 PM', '“The car is not available today, so I didn’t send a message.”', 1],
      ['2:16 PM', '“I’ll check and let you know.” Nothing follows.'],
      ['3:12 PM', '“When will the car come? I need to finalise.” No reply.'],
      ['3:20 PM', 'He calls the dealer. No answer.', 1],
      ['5:56 PM', '“If you’re not interested, we leave it.”', 1],
      ['6:05 PM', 'The complaint goes public on X: 33K views.', 1],
    ];
    return `<div class="full dark">
      <div style="position:absolute;left:64px;top:64px;width:500px">
        <div class="kicker in">The problem</div>
        <div class="display in" style="margin-top:14px;animation-delay:.1s">A test drive was booked.<br>Then nobody showed up.</div>
        <div class="lede in" style="margin-top:16px;animation-delay:.2s">A real exchange from 19 October 2026: a buyer ready to finalise the new Duster, chasing a Renault dealer in Ahmedabad for a test drive.</div>
        <div class="tl" style="margin-top:30px">${T.map((r, i) => `<div class="r ${r[2] ? 'hot' : ''}" style="animation-delay:${0.5 + i * 0.32}s"><div class="tm">${r[0]}</div><div class="x">${r[1]}</div></div>`).join('')}</div>
      </div>
      <div class="shot pop" style="position:absolute;left:640px;top:64px;width:300px;animation-delay:.3s"><img src="${IMG('problem-chat.webp')}" alt="WhatsApp chat between the buyer and the dealer"></div>
      <div class="shot pop" style="position:absolute;left:968px;top:110px;width:250px;height:600px;animation-delay:.6s"><img src="${IMG('problem-tweet.webp')}" alt="The buyer’s post on X" style="margin-top:-20px"></div>
      <div style="position:absolute;left:640px;bottom:30px;font-size:11px;color:#6b7690">Screenshots shared by the customer. The author’s name is blurred.</div>
    </div>`;
  }

  function problemTwo() {
    const P2 = [
      ['inbox', 'Leads arrive unverified', 'Booking forms accept any number. Dealers spend their day calling duplicates, wrong numbers and people without a licence.', 'Booking'],
      ['eyeoff', 'Nobody owns the lead', 'It lands with one dealer, with no deadline. If the car isn’t free, the customer simply isn’t told.', 'Fulfilment'],
      ['phone', 'Coordination lives on one phone', 'Confirmations, reschedules and reminders depend on one salesperson remembering. Calls go unanswered.', 'Confirmation'],
      ['chart', 'Renault can’t see any of it', 'Renault pays for the lead but can’t see whether the test drive happened, or why it didn’t.', 'Analytics'],
    ];
    return `<div class="full" style="background:#f6f8fb">
      <div style="position:absolute;left:64px;top:60px;right:64px">
        <div class="kicker in">Why it happens</div>
        <div class="display in" style="margin-top:14px;font-size:40px;animation-delay:.1s">The test drive breaks between the ad and the dealer.</div>
        <div class="lede in" style="margin-top:12px;max-width:760px;animation-delay:.2s">Marketing spends to win the booking. What happens after it is invisible, manual and slow, and the customer experiences it as silence.</div>
      </div>
      <div style="position:absolute;left:64px;right:64px;top:290px;display:grid;grid-template-columns:repeat(4,1fr);gap:16px">${P2.map((p, i) => `<div class="pain" style="animation-delay:${0.4 + i * 0.15}s;min-height:300px"><div style="display:flex;justify-content:space-between;align-items:center"><div class="ic">${ic(p[0], 20)}</div><div class="no">0${i + 1}</div></div><h3>${p[1]}</h3><p>${p[2]}</p><div style="margin-top:auto;font-size:11.5px;color:#98a3b5;font-weight:600">FIXED IN · <span style="color:#0a3578">${p[3].toUpperCase()}</span></div></div>`).join('')}</div>
      <div class="in" style="position:absolute;left:64px;right:64px;bottom:44px;display:flex;align-items:center;gap:14px;font-size:15px;color:#0b1324;animation-delay:1.1s"><span style="width:4px;height:28px;border-radius:2px;background:${ORANGE}"></span>The car is ready. The buyer is ready. The test drive still doesn’t happen.</div>
    </div>`;
  }

  function solution() {
    const S = [
      ['01', 'Booking', 'A 60-second booking from any ad, on the web, the app or WhatsApp.'],
      ['02', 'Validation', 'Licence, soft credit and address checked before a dealer sees the lead.'],
      ['03', 'Fulfilment', 'The three nearest dealers get the lead; the first to accept in 15 minutes wins.'],
      ['04', 'Confirmation & AI calling', 'WhatsApp and AI calls confirm, reschedule and track the car to the gate.'],
    ];
    return `<div class="full">
      <div style="position:absolute;left:64px;top:60px;width:520px">
        <div class="kicker in">What we’re solving</div>
        <div class="display in" style="margin-top:14px;font-size:40px;animation-delay:.1s">Every booked test drive happens.</div>
        <div class="lede in" style="margin-top:12px;animation-delay:.2s">Verified before a dealer spends a minute on it, delivered on time, and measured for Renault from ad to drive.</div>
        <div style="margin-top:28px">${S.map((s, i) => `<div class="in" style="display:flex;gap:16px;padding:14px 0;border-top:1px solid var(--line);animation-delay:${0.35 + i * 0.12}s"><div style="font-size:12px;font-weight:700;color:${ORANGE};width:24px;padding-top:2px">${s[0]}</div><div><div style="font-size:15px;font-weight:700">${s[1]}</div><div style="font-size:13px;color:#5b6b82;margin-top:2px;line-height:1.5">${s[2]}</div></div></div>`).join('')}
          <div class="in" style="display:flex;gap:16px;padding:14px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);animation-delay:.85s"><div style="color:#0a3578;width:24px">${ic('chart', 18)}</div><div><div style="font-size:15px;font-weight:700">Live analytics for Renault</div><div style="font-size:13px;color:#5b6b82;margin-top:2px">Every lead, every dealer, every drive.</div></div></div></div>
        <div class="in" style="margin-top:18px;font-size:12px;color:#98a3b5;animation-delay:1s">In scope: the test drive and its analytics. Pricing and the sale stay with the dealer.</div>
      </div>
      <div class="pop" style="position:absolute;left:640px;top:40px;width:600px;height:720px;border-radius:24px;overflow:hidden;animation-delay:.2s"><img src="${IMG('duster-road.webp')}" alt="Renault Duster" style="width:100%;height:100%;object-fit:cover;object-position:40% center">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(0,0,0,.55))"></div>
        ${[['Licence verified · grade A', 'shield', 70, 0.9], ['Accepted by the nearest dealer in 1 m 48 s', 'radar', 140, 1.2], ['Test drive completed · rated 5 / 5', 'star', 210, 1.5]].map(([t, i, b, d]) => `<div class="pop" style="position:absolute;left:28px;bottom:${b}px;display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.94);backdrop-filter:blur(8px);border-radius:12px;padding:10px 14px;font-size:13px;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,.2);animation-delay:${d}s"><span style="color:#129a4a">${ic(i, 17)}</span>${t}</div>`).join('')}
      </div></div>`;
  }

  function analytics() {
    const F = [['Test drives booked', 12480], ['Mobile verified', 11902], ['Validated', 9861], ['Accepted by a dealer', 9402], ['Confirmed', 8577], ['Test drive completed', 7118], ['Feedback received', 5694]];
    const max = F[0][1];
    const fmt = (n) => n.toLocaleString('en-IN');
    const funnel = F.map(([l, v], i) => `<div class="rw"><span>${l}</span><div class="b" data-tip="${l}: ${fmt(v)} (${((v / max) * 100).toFixed(1)}% of bookings)"><i class="${i === 5 ? 'hi' : ''}" style="width:${(v / max) * 100}%;animation-delay:${i * 0.1}s"></i></div><span class="n">${fmt(v)}<small>${i ? ((v / F[i - 1][1]) * 100).toFixed(0) + '%' : ''}</small></span></div>`).join('');
    const R = [['Invalid or expired licence', 742], ['Address not serviceable', 498], ['Duplicate booking', 381], ['Dealer or agent number', 236], ['Consent withdrawn', 184]];
    const reasons = R.map(([l, v], i) => `<div class="rw" style="grid-template-columns:176px 1fr 46px"><span>${l}</span><div class="b" data-tip="${l}: ${fmt(v)} bookings stopped before a dealer saw them"><i style="width:${(v / R[0][1]) * 100}%;background:#98a3b5;animation-delay:${i * 0.1}s"></i></div><span class="n">${fmt(v)}</span></div>`).join('');
    const T = [['Kirti Nagar', 1214, '1 m 52 s', '97%', '81%', '4.8'], ['Punjabi Bagh', 1032, '2 m 05 s', '96%', '79%', '4.7'], ['Janakpuri', 1086, '2 m 30 s', '95%', '77%', '4.6'], ['Dwarka', 790, '3 m 12 s', '93%', '74%', '4.5'], ['Karol Bagh', 874, '4 m 10 s', '88%', '68%', '4.3']];
    return `<div class="full"><div class="dash"><div class="side"><div class="lg"><img src="${D.img.fs}" alt="FreeStand"></div>
      ${[['chart', 'Overview', 1], ['car', 'Test drives'], ['shield', 'Validation'], ['users', 'Dealers'], ['mic', 'AI calls'], ['msg', 'WhatsApp']].map(([i, t, on]) => `<a class="${on ? 'on' : ''}">${ic(i, 16)} ${t}</a>`).join('')}
      <div style="margin-top:auto;padding:0 18px;font-size:11px;opacity:.7;line-height:1.5">Renault India<br>Duster test drives · Delhi NCR</div></div>
      <div class="mainp">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px"><div><div style="font-size:20px;font-weight:700;letter-spacing:-.4px">Test drives · Delhi NCR</div><div class="lbl">Renault Duster · 1 Aug – 21 Oct 2026 · 5 dealers · demo data</div></div><div class="chips"><span class="chip">Last 12 weeks</span><span class="chip">All dealers</span></div></div>
        <div class="kpis">
          <div class="kpi in"><div class="v">12,480</div><div class="l">Test drives booked</div><div class="d">+18% vs previous 12 weeks</div></div>
          <div class="kpi in" style="animation-delay:.1s"><div class="v">79%</div><div class="l">Verified before a dealer saw them</div><div class="d">2,041 bad bookings stopped</div></div>
          <div class="kpi in" style="animation-delay:.2s"><div class="v">2 m 41 s</div><div class="l">Median time to dealer acceptance</div><div class="d">95% within 15 minutes</div></div>
          <div class="kpi in" style="animation-delay:.3s"><div class="v">76%</div><div class="l">Completed after confirmation</div><div class="d">7,118 test drives</div></div>
          <div class="kpi in" style="animation-delay:.4s"><div class="v">4.6</div><div class="l">Average test-drive rating</div><div class="d">5,694 ratings</div></div>
        </div>
        <div style="display:grid;grid-template-columns:1.25fr 1fr;gap:12px;margin-top:12px">
          <div class="card funnel"><div class="sec">From booking to completed test drive</div>${funnel}</div>
          <div class="card funnel"><div class="sec">Stopped before a dealer <span class="r">2,041</span></div>${reasons}
            <div class="sec" style="margin-top:16px">AI calls</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px"><div><div style="font-size:19px;font-weight:700">21,340</div><div class="lbl">calls made</div></div><div><div style="font-size:19px;font-weight:700">73%</div><div class="lbl">answered</div></div><div><div style="font-size:19px;font-weight:700">1,912</div><div class="lbl">reschedules handled</div></div></div></div>
        </div>
        <div class="card" style="margin-top:12px"><div class="sec">Dealers</div><table class="t"><thead><tr><th>Dealer</th><th class="r">Leads offered</th><th class="r">Median acceptance</th><th class="r">Within 15 min</th><th class="r">Completed</th><th class="r">Rating</th></tr></thead><tbody>${T.map((r) => `<tr><td><b style="font-weight:600">Renault ${r[0]}</b></td><td class="r">${fmt(r[1])}</td><td class="r">${r[2]}</td><td class="r">${r[3]}</td><td class="r">${r[4]}</td><td class="r"><b style="font-weight:600">${r[5]}</b></td></tr>`).join('')}</tbody></table></div>
      </div></div></div>`;
  }

  function thanks() {
    const rows2 = [['Booking', 'From the ad to a verified mobile number in under a minute'], ['Validation', 'Licence, soft credit and address checked: a grade-A lead'], ['Fulfilment', 'The nearest dealer accepted in 1 m 48 s'], ['Confirmation & AI calling', 'Confirmed, rescheduled by voice, tracked to the gate']];
    return `<div class="full dark">
      <div style="position:absolute;right:0;top:0;bottom:0;width:560px"><img src="${IMG('duster-bridge.webp')}" alt="" style="width:100%;height:100%;object-fit:cover;object-position:62% center"><div style="position:absolute;inset:0;background:linear-gradient(90deg,#070b14 0%,rgba(7,11,20,.2) 40%,rgba(7,11,20,0) 100%)"></div></div>
      <div style="position:absolute;left:64px;top:70px;width:600px">
        <div class="in" style="display:flex;align-items:center;gap:16px">${rlogo(34)}<span style="width:1px;height:26px;background:rgba(255,255,255,.25)"></span><img src="${D.img.fs}" alt="FreeStand" style="height:18px;filter:brightness(0) invert(1)"></div>
        <div class="display in" style="margin-top:40px;animation-delay:.1s">Every booked test drive,<br>verified, delivered and measured.</div>
        <div style="margin-top:34px">${rows2.map((r, i) => `<div class="in" style="display:flex;gap:16px;padding:14px 0;border-top:1px solid rgba(255,255,255,.12);animation-delay:${0.3 + i * 0.12}s"><span style="font-size:12px;font-weight:700;color:${ORANGE};width:24px;padding-top:2px">0${i + 1}</span><div><div style="font-size:15px;font-weight:600">${r[0]}</div><div style="font-size:13px;color:#a9b4c8;margin-top:2px">${r[1]}</div></div></div>`).join('')}</div>
        <div class="in" style="margin-top:26px;font-size:15px;color:#fff;animation-delay:.9s">Thank you.</div>
      </div></div>`;
  }

  // ───────────────────────────── chapters and steps ─────────────────────────────
  const CH = [
    { n: '·', t: 'Introduction' },
    { n: '1', t: 'Booking', banner: 'Gurpreet books a Duster test drive in under a minute' },
    { n: '2', t: 'Validation', banner: 'Before any dealer sees the lead, it is verified' },
    { n: '3', t: 'Fulfilment', banner: 'The verified lead goes to the three nearest dealers' },
    { n: '4', t: 'Confirmation & AI calling', banner: 'Confirmed on WhatsApp, coordinated by AI calls' },
    { n: '·', t: 'Analytics' },
  ];
  const STEPS = [
    { c: 0, label: 'A real customer', eb: 'Ahmedabad · 19 Oct 2026', h: 'The test drive that never happened', p: 'Before the demo, one real conversation. It is the reason this flow exists.', render: problemOne },
    { c: 0, label: 'Why it happens', eb: 'Four gaps', h: 'Where test drives break today', p: 'Each gap maps to one stage of what follows.', render: problemTwo },
    { c: 0, label: 'What we’re solving', eb: 'Renault × FreeStand', h: 'What FreeStand changes', p: 'Booking, validation, fulfilment and confirmation in one flow, measured end to end. Follow Gurpreet.', render: solution },
    { c: 1, label: 'Sees the ad', eb: 'Instagram · Mon 19 Oct · 9:12 PM', h: 'Gurpreet sees the new Duster on Instagram', p: 'Renault’s own campaign creative. A tap on “Book a test drive” carries the campaign into everything that follows.', split: igPhone, panel: campaignPanel, panelDelay: 900, wait: ['mega', 'Campaign', 'Renault India · Meta Ads', 'Loading the campaign…'] },
    { c: 1, label: 'Books online', eb: 'renault.co.in · 9:13 PM', h: 'He books a home test drive in 48 seconds', p: 'The lead is created as he types. Duplicate, PIN-code and spam checks run before he taps Book.', split: () => sitePhone('filled'), panel: leadCapturedPanel, panelDelay: 3700, wait: ['inbox', 'Lead captured', 'renault.co.in → FreeStand', 'Waiting for Gurpreet to book…'] },
    { c: 1, label: 'Verifies his number', eb: 'renault.co.in · 9:13 PM', h: 'One code, then the journey moves to WhatsApp', p: 'The verified number and his consent become the anchor of the profile.', split: () => sitePhone('otp'), panel: otpProfilePanel, panelDelay: 2300, wait: ['user', 'Customer profile', P.lead, 'Waiting for the one-time code…'] },
    { c: 2, label: 'Driving licence', eb: 'WhatsApp · 9:13 PM', h: 'His licence is checked against the government record', p: 'A photo on WhatsApp is read, matched to Parivahan and to the name he booked with.', wa: [0, 6], panel: dlPanel, panelAt: 4, wait: ['id', 'Driving licence', 'Parivahan match', 'Waiting for the licence photo…'] },
    { c: 2, label: 'Soft credit check', eb: 'WhatsApp · 9:14 PM', h: 'An optional soft credit check, with no effect on his score', p: 'It raises the lead’s priority. The dealer only ever sees a band.', wa: [6, 9], panel: creditPanel, panelAt: 7, wait: ['card', 'Soft credit check', 'Consented bureau check', 'Waiting for consent…'] },
    { c: 2, label: 'Address quality', eb: 'WhatsApp · 9:15 PM', h: 'An address a driver can actually find', p: 'Parsed, located and scored, and checked for a home test drive.', wa: [9, 13], panel: addrPanel, panelAt: 11, wait: ['pin', 'Address quality', 'Parse → locate → check', 'Waiting for the address…'] },
    { c: 2, label: 'Grade A', eb: 'WhatsApp · 9:16 PM', h: 'Two more answers and the lead is grade A', p: 'His buying window and who is joining complete the profile.', wa: [13, 18], panel: enrichedPanel, panelAt: 17, wait: ['star', 'Customer profile', P.lead, 'Scoring the lead…'] },
    { c: 3, label: 'Nearest dealers', eb: 'Lead routing · 9:16 PM', h: 'The three nearest dealers get the lead, and Kirti Nagar accepts', p: 'The routing opens over his profile, so nothing is lost. The first dealer to accept within 15 minutes wins.', split: () => dealerPhone('offer'), panel: routingPanel, panelDelay: 0, live: 'race' },
    { c: 3, label: 'Car and consultant', eb: 'FreeStand Dealer · 9:18 PM', h: 'Consultant, demo car and slot in one tap', p: 'The lead reaches the dealer’s DMS with a brief for Arjun.', split: () => dealerPhone('assign'), panel: assignedPanel, panelDelay: 900, wait: ['user', 'Customer profile', P.lead, 'Assigning a consultant and a car…'] },
    { c: 4, label: 'Confirmation', eb: 'WhatsApp · Mon 9:18 PM', h: 'Gurpreet has his confirmation within two minutes', p: 'Reminders, the AI call and fallbacks are scheduled automatically.', wa: [18, 19], panel: commsPanel, panelAt: 18 },
    { c: 4, label: 'AI call', eb: 'AI voice call · Tue 20 Oct · 5:42 PM', h: 'The evening before, an AI call confirms the slot', p: 'It moves the drive to 11:30, notes who is joining and briefs the dealer. Nobody at the showroom picks up a phone.', split: () => callPhone(), panel: callPanel, panelDelay: 0, live: 'call' },
    { c: 4, label: 'On the day', eb: 'WhatsApp · Wed 21 Oct · 11:18 AM', h: 'No “where are you?” calls on the day', p: 'The new time, the consultant’s live location and a handover code arrive on WhatsApp.', wa: [19, 24], panel: trackPanel, panelAt: 22, wait: ['route', 'On the day', 'Wed 21 Oct', 'Waiting for the consultant to leave…'] },
    { c: 4, label: 'Completed', eb: 'WhatsApp · Wed 12:20 PM', h: 'The test drive happened, and everyone knows it', p: 'Feedback in two taps. Renault, the dealer and the ad platform all see a completed test drive.', wa: [24, 30], panel: outcomePanel, panelAt: 29, wait: ['star', 'Test drive', P.lead, 'Waiting for feedback…'] },
    { c: 5, label: 'Analytics', eb: 'FreeStand · programme view', h: 'Every test drive, from booking to rating', p: 'Where bookings were stopped, how fast dealers accepted and how many drives were completed (demo data).', render: analytics },
    { c: 5, label: 'Thank you', eb: 'Renault × FreeStand', h: 'Every booked test drive happens', p: 'Verified, delivered and measured.', render: thanks },
  ];

  // ───────────────────────────── live sequencing ─────────────────────────────
  let gen = 0;
  const sleep = (ms, g) => new Promise((res, rej) => setTimeout(() => (g === gen ? res() : rej('stale')), ms));
  const later = (ms, fn) => { const g = gen; setTimeout(() => g === gen && fn(), ms); };
  const scrollChat = () => { const b = $$('#wabody'); if (b) b.scrollTo({ top: b.scrollHeight, behavior: 'smooth' }); };
  const revealPanel = (s) => { const p = $$('#panel'); if (p) p.outerHTML = s.panel(); };

  async function playChat(s) {
    const g = gen;
    const body = $$('#wabody');
    const state = $$('#wastate');
    const [start, end] = s.wa;
    if (s.panelAt !== undefined && s.panelAt < start) revealPanel(s);
    try {
      await sleep(500, g);
      for (let i = start; i < end; i++) {
        const m = WA[i];
        if (m.div || m.sys) {
          body.insertAdjacentHTML('beforeend', msgHTML(m, i, -1, true));
          scrollChat();
          await sleep(350, g);
        } else if (m.user) {
          await sleep(650, g);
          const prevBot = WA[i - 1];
          if (prevBot && prevBot.opts && prevBot.picked !== undefined) {
            const opt = body.querySelector(`[data-m="${i - 1}"] .opts div:nth-child(${prevBot.picked + 1})`);
            if (opt) { opt.classList.add('tap', 'pk'); await sleep(500, g); }
          }
          body.insertAdjacentHTML('beforeend', msgHTML(m, i, -1, true));
          scrollChat();
          await sleep(300, g);
        } else {
          if (m.wait) await sleep(m.wait, g);
          state.textContent = 'typing…';
          body.insertAdjacentHTML('beforeend', `<div class="msg typing live" id="typing"><div class="b"><span></span><span></span><span></span></div></div>`);
          scrollChat();
          await sleep(650 + Math.min(strip(m.bot).length * 7, 1300), g);
          $$('#typing')?.remove();
          state.textContent = 'online';
          body.insertAdjacentHTML('beforeend', msgHTML(m, i, -1, true));
          scrollChat();
          await sleep(350, g);
        }
        if (i === s.panelAt) revealPanel(s);
      }
      state.textContent = 'Business account';
      nudge();
    } catch (e) { if (e !== 'stale') console.error(e); }
  }

  function runLive(s) {
    if (s.wa) return playChat(s);
    if (s.panel && s.panelDelay > 0) later(s.panelDelay, () => revealPanel(s));
    else if (s.panel) revealPanel(s);
    if (s.live === 'race') {
      let left = 14 * 60 + 59, t = 0;
      const g = gen;
      const tick = setInterval(() => {
        if (g !== gen) return clearInterval(tick);
        left -= 1; t += 1;
        const cd = $$('#cd'); if (cd && left > 0 && t <= 108) cd.textContent = `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')} left`;
        const race = $$('#race'); if (race && t <= 108) race.textContent = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
      }, 32);
      later(1400, () => { const r = $$('#dl-pb .chip'); if (r) r.textContent = 'Viewing'; });
      later(2000, () => { const r = $$('#dl-jp .chip'); if (r) r.textContent = 'Viewing'; const k = $$('#dl-kn .chip'); if (k) k.textContent = 'Viewing'; });
      later(3300, () => { const a = $$('#accept'); if (a) a.classList.add('press'); });
      later(3800, () => {
        const a = $$('#accept'), tp = $$('#leadtp'), pass = $$('#pass');
        if (a) { a.className = 'btn green'; a.textContent = 'Accepted · the lead is yours'; }
        if (pass) pass.style.visibility = 'hidden';
        if (tp) { tp.style.background = '#129a4a'; tp.innerHTML = '<span>YOU WON THIS LEAD</span><span class="mono">1 m 48 s</span>'; }
        const k = $$('#dl-kn');
        if (k) { k.classList.add('win'); k.querySelector('.chip').className = 'chip green'; k.querySelector('.chip').textContent = 'Accepted'; k.querySelector('.s').textContent = 'Arjun Menon accepted in 1 m 48 s'; }
        const ln = $$('#ln-kn'); if (ln) { ln.setAttribute('stroke', '#129a4a'); ln.setAttribute('stroke-dasharray', '0'); ln.setAttribute('stroke-width', '3.5'); }
        const pg = $$('#pg-kn'); if (pg) pg.setAttribute('fill', '#129a4a');
        const mp = $$('#mpill'); if (mp) mp.innerHTML = pillH('Accepted · Kirti Nagar');
      });
      later(4700, () => {
        ['pb', 'jp'].forEach((id) => { const r = $$(`#dl-${id}`); if (r) { r.classList.add('gone'); r.querySelector('.chip').className = 'chip'; r.querySelector('.chip').textContent = 'Closed'; } const ln = $$(`#ln-${id}`); if (ln) ln.setAttribute('opacity', '.15'); const pg = $$(`#pg-${id}`); if (pg) pg.setAttribute('opacity', '0'); });
        nudge();
      });
    }
    if (s.live === 'call') {
      let t = 0;
      const g = gen;
      const tick = setInterval(() => {
        if (g !== gen) return clearInterval(tick);
        t = Math.min(t + 1, 52);
        const el = $$('#calltime'); if (el) el.textContent = `00:${String(t).padStart(2, '0')}`;
      }, 190);
      later(9800, nudge);
    }
    if (!s.wa && !s.live) later(s.panelDelay ? s.panelDelay + 1800 : 2800, nudge);
  }
  function nudge() { $('#next')?.classList.add('pulse'); }

  // ───────────────────────────── render ─────────────────────────────
  const canvas = $('#canvas');
  const KEY = 'renault-td-v3';
  let idx = 0;
  try { const h = parseInt((location.hash.match(/\d+/) || [])[0], 10); idx = h ? h - 1 : parseInt(localStorage.getItem(KEY) || '0', 10) || 0; } catch (e) {}
  idx = Math.min(Math.max(0, idx), STEPS.length - 1);

  function slideHTML(s) {
    if (s.render) return s.render();
    const phone = s.wa ? waPhone(s.wa[0]) : s.split();
    const panel = s.wait ? waitPanel(...s.wait) : '<div class="panel" id="panel"></div>';
    return `<div class="split">${phone}${panel}</div>`;
  }

  function draw(prev) {
    gen++;
    const s = STEPS[idx];
    canvas.querySelectorAll('.slide:not(.leave)').forEach((old) => { old.classList.add('leave'); setTimeout(() => old.remove(), 250); });
    const el = document.createElement('div');
    el.className = 'slide enter';
    el.innerHTML = slideHTML(s);
    canvas.appendChild(el);
    cur = el;
    const wb = el.querySelector('#wabody');
    if (wb) wb.scrollTop = wb.scrollHeight;
    if (prev !== undefined && prev < idx && STEPS[prev].c !== s.c && CH[s.c].banner) {
      const b = document.createElement('div');
      b.className = 'banner';
      b.innerHTML = `<b>STAGE ${CH[s.c].n} · ${CH[s.c].t.toUpperCase()}</b>${CH[s.c].banner}`;
      $('#stage').appendChild(b);
      setTimeout(() => b.remove(), 3500);
    }
    $('#head').innerHTML = `<div class="hx"><div class="eb">${s.c >= 1 && s.c <= 4 ? `<b>Stage ${CH[s.c].n}</b> · ${CH[s.c].t} · ` : `<b>${CH[s.c].t}</b> · `}${s.eb}</div><h1>${s.h}</h1><p>${s.p}</p></div>`;
    renderRail();
    $('#prev').disabled = idx === 0;
    const nx = $('#next');
    nx.disabled = idx === STEPS.length - 1;
    nx.classList.remove('pulse');
    $('#upnext').innerHTML = idx < STEPS.length - 1 ? `Up next<b>${STEPS[idx + 1].label}</b>` : '';
    document.querySelectorAll('#prog button').forEach((b) => { const k = +b.dataset.c; b.className = k === s.c ? 'on' : k < s.c ? 'done' : ''; });
    $('#count').innerHTML = `<b>${idx + 1}</b> of ${STEPS.length}`;
    try { localStorage.setItem(KEY, String(idx)); history.replaceState(null, '', `#${idx + 1}`); } catch (e) {}
    runLive(s);
  }

  function renderRail() {
    const s = STEPS[idx];
    $('#chapters').innerHTML = CH.map((c, k) => {
      const first = STEPS.findIndex((x) => x.c === k);
      const list = k === s.c ? `<div class="steps">${STEPS.map((x, i) => (x.c === k ? `<div data-i="${i}" class="${i === idx ? 'cur' : i < idx ? 'past' : ''}"><i></i>${x.label}</div>` : '')).join('')}</div>` : '';
      return `<div class="chap ${k === s.c ? 'on' : k < s.c ? 'done' : ''}" data-i="${first}"><div class="n">${k < s.c ? ic('check', 12, 'stroke-width:3') : c.n}</div><div class="t">${c.t}</div>${list}</div>`;
    }).join('');
    $('#chapters').querySelectorAll('[data-i]').forEach((e) => e.addEventListener('click', (ev) => { ev.stopPropagation(); go(+e.dataset.i); }));
  }

  function go(i) { const n = Math.min(Math.max(0, i), STEPS.length - 1); if (n === idx) return; const p = idx; idx = n; draw(p); }

  $('#prog').innerHTML = CH.slice(1, 5).map((c, k) => `${k ? '<span class="sep"></span>' : ''}<button data-c="${k + 1}"><i></i>${c.t.replace(' & AI calling', '')}</button>`).join('');
  $('#prog').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => go(STEPS.findIndex((x) => x.c === +b.dataset.c))));
  $('#prev').addEventListener('click', () => go(idx - 1));
  $('#next').addEventListener('click', () => go(idx + 1));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { go(idx + 1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { go(idx - 1); e.preventDefault(); }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(STEPS.length - 1);
  });

  function fit() {
    const st = $('#stage');
    const k = Math.min(st.clientWidth / 1280, st.clientHeight / 800);
    const w = 1280 * k, h = 800 * k;
    const fr = $('#frame');
    fr.style.width = `${w}px`; fr.style.height = `${h}px`;
    fr.style.left = `${(st.clientWidth - w) / 2}px`; fr.style.top = `${(st.clientHeight - h) / 2}px`;
    canvas.style.transform = `scale(${k})`;
  }
  window.addEventListener('resize', fit);

  const tip = $('#tip');
  document.addEventListener('mousemove', (e) => {
    const t = e.target.closest && e.target.closest('[data-tip]');
    if (!t) { tip.style.opacity = 0; return; }
    tip.textContent = t.dataset.tip; tip.style.opacity = 1;
    tip.style.left = `${e.clientX + 14}px`; tip.style.top = `${e.clientY + 14}px`;
  });

  fit();
  draw();
})();

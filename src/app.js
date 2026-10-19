/* Renault Duster test-drive demo: booking → validation → dealer fulfilment → confirmation & AI calling.
   Vanilla JS in the FreeStand UI shell. Scenes, avatars, the car and the Desi Log drawings are
   pre-rendered at build time into window.__DATA (and one shared SVG sprite). */
(function () {
  const D = window.__DATA;
  const ORANGE = '#ff6b00';
  const NAVY = '#0a3578';
  const YELLOW = '#efdf00';
  const $ = (s) => document.querySelector(s);
  let cur = document; // the slide on stage: live updates look up elements only inside it
  const $$ = (s) => cur.querySelector(s);

  // ───────────────────────────── helpers ─────────────────────────────
  const dia = (size = 16, col = '#fff') => {
    const a = size / 2, b = size * 0.34, t = Math.max(1.2, size * 0.09);
    const r = (k) => `<path d="M0 ${-a * k}L${b * k} 0L0 ${a * k}L${-b * k} 0Z" fill="none" stroke="${col}" stroke-width="${t}"/>`;
    return `<svg width="${size}" height="${size}" viewBox="${-a} ${-a} ${size} ${size}">${r(0.92)}${r(0.52)}</svg>`;
  };
  const ph = (icon, title, sub, st = 'LIVE', col) =>
    `<div class="ph"><div class="ic">${icon}</div><div><div class="tt">${title}</div><div class="ss">${sub}</div></div><div class="st" style="${col ? `color:${col}` : ''}"><i style="${col ? `background:${col}` : ''}"></i>${st}</div></div>`;
  const chk = (t, s, v = '', cls = '', d = 0) =>
    `<div class="chk ${cls} in" style="animation-delay:${d}s"><div class="d">${cls === 'wait' ? '…' : cls === 'info' ? 'i' : '✓'}</div><div><div class="t">${t}</div>${s ? `<div class="s">${s}</div>` : ''}</div>${v ? `<div class="v">${v}</div>` : ''}</div>`;
  const chips = (arr) => `<div class="chips">${arr.map((c) => (typeof c === 'string' ? `<span class="chip2">${c}</span>` : `<span class="chip2 ${c[1]}">${c[0]}</span>`)).join('')}</div>`;
  const note = (i, html) => `<div class="note"><div class="i">${i}</div><div>${html}</div></div>`;
  const av = (k, sz) => `<div class="av" style="width:${sz}px;height:${sz}px">${D.avatars[k]}</div>`;
  const strip = (h) => String(h).replace(/<[^>]+>/g, '');

  // ───────────────────────────── the persona and the facts ─────────────────────────────
  const P = {
    name: 'Shubham Kohli', phone: '+91 98374 92834', masked: '98XXX XX834', email: 'shubham.kohli@gmail.com',
    addr: 'C-42, 2nd Floor, Vishal Enclave, Rajouri Garden, New Delhi 110027', lead: 'LD-26-10419',
  };

  // ───────────────────────────── WhatsApp thread (one conversation, played live) ─────────────────────────────
  const dlThumb = (w = 210) => `<svg class="dlimg" width="${w}" viewBox="0 0 210 132"><rect width="210" height="132" rx="8" fill="#e9eef7"/><rect width="210" height="24" rx="8" fill="#2c4a8a"/><rect y="16" width="210" height="8" fill="#2c4a8a"/><text x="10" y="16" font-size="8.5" font-weight="800" fill="#fff" letter-spacing=".6">INDIAN UNION DRIVING LICENCE</text><text x="200" y="16" text-anchor="end" font-size="7.5" font-weight="700" fill="#cfe0ff">DELHI</text><rect x="10" y="32" width="52" height="64" rx="3" fill="#cbd5e1"/><g transform="translate(10 32)"><svg width="52" height="64">${D.avatars.shubhamPlain}</svg></g><text x="72" y="42" font-size="7" fill="#64748b">DL No.</text><text x="72" y="53" font-size="9.5" font-weight="800" fill="#111">DL04 20180012345</text><text x="72" y="67" font-size="7" fill="#64748b">Name</text><text x="72" y="77" font-size="9" font-weight="700" fill="#111">SHUBHAM KOHLI</text><text x="72" y="91" font-size="7" fill="#64748b">DOB 14-08-1994 · Valid till 11-03-2038</text><text x="10" y="112" font-size="7.5" fill="#334155">Class: LMV-NT · MCWG</text><text x="10" y="123" font-size="7" fill="#64748b">Issued: RTO Janakpuri (DL04) · 12-03-2018</text><circle cx="182" cy="108" r="14" fill="none" stroke="#c49a2c" stroke-width="2"/><text x="182" y="111" text-anchor="middle" font-size="6" font-weight="800" fill="#c49a2c">INDIA</text></svg>`;
  const miniMap = (o = {}) => `<svg viewBox="0 0 220 110" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><rect width="220" height="110" fill="#eef1f4"/><path d="M0 62H220M120 0V110M0 18C80 30 150 6 220 26" stroke="#fff" stroke-width="9"/><path d="M20 110C70 70 120 60 220 40" stroke="#fff" stroke-width="7"/><rect x="20" y="70" width="50" height="30" fill="#d7ebd5"/>${o.route ? `<path d="M40 30C80 44 110 50 150 58" stroke="${ORANGE}" stroke-width="4" fill="none" stroke-dasharray="7 5" class="flow"/><rect x="${o.car ?? 92}" y="38" width="22" height="12" rx="4" fill="#17181c"/><circle cx="40" cy="30" r="6" fill="#17181c"/>` : ''}<circle cx="150" cy="58" r="16" fill="#1f4fd1" opacity=".18" class="pulse"/><circle cx="150" cy="58" r="7" fill="#1f4fd1" stroke="#fff" stroke-width="3"/></svg>`;
  const card = (rows) => `<div class="wacard"><div style="background:#17181c;color:#fff;padding:9px 11px;display:flex;align-items:center;gap:8px"><span style="width:26px;height:26px;border-radius:6px;border:1.5px solid ${YELLOW};display:grid;place-items:center">${dia(17)}</span><b style="font-size:12px;letter-spacing:.4px">${rows.title}</b></div><div style="padding:6px 11px 2px;background:#fff;font-size:11.5px;line-height:1.55">${rows.body}</div></div>`;

  // wait: extra ms before the bot starts typing (a check running in the background)
  const WA = [
    { div: 'MON 19 OCT' },
    { sys: '🔒 This business uses a secure service from Meta to manage this chat. Tap to learn more.' },
    { bot: 'Hi Shubham 👋 Thanks for booking a <b>Duster</b> test drive with Renault.\n\nTo keep every drive safe, we verify a few details before a dealer is assigned. It takes about a minute.', t: '9:13 PM' },
    { bot: '<b>Step 1 of 3 · Driving licence</b>\nPlease upload a clear photo of the front of your DL.', opts: ['📎 Upload driving licence'], picked: 0, t: '9:13 PM' },
    { user: dlThumb(), t: '9:13 PM' },
    { bot: '✅ <b>Driving licence verified</b>\nDL04 2018 0012345 · LMV · valid till 2038', t: '9:13 PM', wait: 2600 },
    { bot: '<b>Step 2 of 3 · Finance check</b> (optional)\nShare your PAN for a soft credit check. It <b>does not</b> affect your credit score and unlocks pre-approved finance at your test drive.', opts: ['Share PAN', 'Skip for now'], picked: 0, t: '9:14 PM' },
    { user: 'AFZPK7190K', t: '9:14 PM' },
    { bot: '✅ You’re <b>pre-approved</b> for car finance up to <b>₹14 lakh</b>.\nYour dealer only sees that you’re finance-ready, never your score.', t: '9:14 PM', wait: 2200 },
    { bot: '<b>Step 3 of 3 · Address</b>\nYour test drive is <b>at home</b> 🏠 Where should we bring the car?', opts: ['📍 Share location', 'Type address'], picked: 0, t: '9:14 PM' },
    { user: `<div class="locimg">${miniMap()}</div><div style="font-size:11px;margin-top:4px">📍 Rajouri Garden, New Delhi</div>`, t: '9:15 PM' },
    { user: 'C-42, 2nd Floor, Vishal Enclave, Rajouri Garden, New Delhi 110027', t: '9:15 PM' },
    { bot: '✅ Address confirmed. 3 Renault dealers are within 8 km of you.', t: '9:15 PM', wait: 2200 },
    { bot: 'Two quick questions so your consultant comes prepared.\n\nDo you own a car today?', opts: ['Yes', 'No'], picked: 0, t: '9:15 PM' },
    { user: 'Yes, Maruti Swift (2017)', t: '9:15 PM' },
    { bot: 'When are you planning to buy?', opts: ['This month', 'In 1–3 months', 'Just exploring'], picked: 0, t: '9:16 PM' },
    { user: 'This month', t: '9:16 PM' },
    { bot: 'Thanks Shubham! We’re finding the nearest Renault dealer for you. Confirmation in a few minutes ⏳', t: '9:16 PM' },
    { bot: card({ title: 'TEST DRIVE CONFIRMED ✅', body: '<b>Duster · Turbo AT</b><br>📅 Wed 21 Oct · <b>11:00 AM</b><br>🏠 At home · Vishal Enclave, C Block<br>👤 Ranjan Mehta, Sales Consultant<br>🏢 Renault Kirti Nagar<br>🚗 Demo car DL 12 DE 0987' }) + 'Please keep your <b>original DL</b> handy. We’ll call you a day before to confirm.', opts: ['📅 Add to calendar', '🔁 Reschedule', '📞 Call Ranjan'], t: '9:18 PM' },
    { div: 'TUE 20 OCT' },
    { bot: '🔁 <b>Updated after your call with Aria</b>\nYour test drive is now <b>Wed 21 Oct · 11:30 AM</b>. Ranjan will call you at 11:15 AM.', t: '5:43 PM' },
    { div: 'WED 21 OCT' },
    { bot: 'Good morning Shubham! 🚗 <b>Ranjan is on his way</b> with your Duster.' + `<div style="margin:8px -5px 4px;border-radius:8px;overflow:hidden;height:110px">${miniMap({ route: true })}</div>` + '📍 Live location · <b>ETA 9 min</b>', t: '11:18 AM' },
    { bot: '🔐 Your handover code is <b>4831</b>.\nShare it with Ranjan when he arrives, and the drive starts.', t: '11:18 AM' },
    { div: 'TODAY · 1:05 PM' },
    { bot: 'Hope you enjoyed the Duster, Shubham! How was your test drive?', opts: ['😍 Loved it', '🙂 It was good', '😐 Not for me'], picked: 0, t: '1:05 PM' },
    { user: '😍 Loved it', t: '1:06 PM' },
    { bot: 'Brilliant! What would you like to do next?', opts: ['💰 On-road price', '📝 Book for ₹21,000', '📞 Talk to Ranjan'], picked: 0, t: '1:06 PM' },
    { user: '💰 On-road price', t: '1:06 PM' },
    { bot: card({ title: 'YOUR DUSTER · INDICATIVE', body: 'Turbo AT · Delhi on-road <b>₹16.9 lakh*</b><br>Swift (2017) exchange estimate <b>₹3.1–3.6 lakh</b><br>Pre-approved finance · EMI from <b>₹23,900/mo</b>' }) + '<span style="font-size:10px;color:#8a9499">*Demo figures. Ranjan will share the final quote.</span>', opts: ['📝 Book for ₹21,000'], t: '1:07 PM', wait: 600 },
  ];

  function msgHTML(m, i, picked, live) {
    const cls = live ? ' live' : '';
    if (m.div) return `<div class="div${cls}" data-m="${i}"><span>${m.div}</span></div>`;
    if (m.sys) return `<div class="sysm${cls}" data-m="${i}"><span>${m.sys}</span></div>`;
    if (m.user) return `<div class="msg u${cls}" data-m="${i}"><div class="b">${m.user}<span class="tm">${m.t} ✓✓</span></div></div>`;
    return `<div class="msg${cls}" data-m="${i}"><div class="b">${m.bot}<span class="tm">${m.t}</span>${m.opts ? `<div class="opts">${m.opts.map((o, k) => `<div class="${k === picked ? 'pk' : ''}">${o}</div>`).join('')}</div>` : ''}</div></div>`;
  }
  function waPhone(start) {
    const msgs = WA.slice(0, start).map((m, i) => msgHTML(m, i, m.picked !== undefined && i + 1 < start ? m.picked : -1)).join('');
    return `<div class="phone wa"><div class="status"><span>9:41</span><i>5G ▮▮▮ 92%</i></div><div class="hd"><span style="font-size:18px">‹</span><div class="lg">${dia(22, YELLOW)}</div><div><div class="n">Renault India <img src="${D.img.badge}" alt=""></div><div class="o" id="wastate">Official business account</div></div><div class="ac"><span>📹</span><span>📞</span><span>⋮</span></div></div><div class="body" id="wabody">${msgs}</div><div class="foot"><span style="opacity:.5">😊</span><div class="in2">Message</div><span style="opacity:.5">📎</span><div class="mic">🎤</div></div></div>`;
  }

  // ───────────────────────────── Renault website (booking) ─────────────────────────────
  const typed = (txt, d, dur = 0.9) => `<span class="typed" style="--n:${txt.length};--w:${txt.length + 0.5}ch;--d:${d}s;--dur:${dur}s">${txt}</span>`;
  function sitePhone(mode) {
    const live = mode === 'filled';
    const form = `
      <div class="hero"><div class="k">THE NEW</div><div class="h">DUSTER</div><div class="s">1.3 Turbo · automatic · book a test drive</div>${D.car.hero}</div>
      <div class="form">
        <div class="fl">Variant</div><div class="seg"><div>Turbo MT<small>Manual</small></div><div class="on">Turbo AT<small>Automatic</small></div></div>
        <div class="fl">Where</div><div class="seg"><div class="on">🏠 At home</div><div>🏢 At showroom</div></div>
        <div class="fl">When</div><div class="seg"><div>Tue<small>20 Oct</small></div><div class="on">Wed<small>21 Oct</small></div><div>Thu<small>22 Oct</small></div><div>Sat<small>24 Oct</small></div></div>
        <div class="seg" style="margin-top:6px"><div>10:00</div><div class="on">11:00</div><div>14:00</div><div>17:00</div></div>
        <div class="fl">Your details</div>
        <div class="inp ok">${live ? typed('Shubham Kohli', 0.5) : 'Shubham Kohli'}<span class="tick">✓</span></div>
        <div style="display:flex;gap:6px;margin-top:6px"><div class="inp ok" style="flex:1.6"><span class="pre">+91</span>${live ? typed('98374 92834', 1.6) : '98374 92834'}</div><div class="inp ok" style="flex:1"><span class="pre">PIN</span>${live ? typed('110027', 2.6, 0.6) : '110027'}</div></div>
        <div class="cons"><div class="bx">✓</div><div>I agree to be contacted by Renault and its dealers on WhatsApp, SMS and calls about my test drive. <u>Privacy notice</u></div></div>
        <div class="cta ${live ? 'press' : ''}" style="${live ? 'animation-delay:3.4s' : ''}">BOOK MY TEST DRIVE</div>
      </div>`;
    const otp =
      mode === 'otp'
        ? `<div class="dim"></div><div class="sheet"><div style="font-size:16px;font-weight:800">Verify your mobile</div><div style="font-size:11.5px;color:#6b7280;margin-top:3px">Enter the 6-digit code sent to +91 98374 92834</div><div class="otp">${'481902'.split('').map((c, i) => `<div class="f in" style="animation-delay:${0.6 + i * 0.22}s">${c}</div>`).join('')}</div><div class="in" style="animation-delay:2.1s;display:flex;align-items:center;gap:8px;font-size:12px;color:#16a34a;font-weight:700;margin:4px 0 12px">✓ Number verified · auto-read from SMS</div><div class="cta in" style="margin-top:0;background:#25d366;color:#fff;animation-delay:2.5s">Continue on WhatsApp →</div><div style="font-size:10px;color:#6b7280;text-align:center;margin-top:8px">We’ll finish 3 quick checks on WhatsApp before assigning your dealer.</div></div>`
        : '';
    return `<div class="phone br"><div class="status"><span>9:13</span><i>5G ▮▮▮ 92%</i></div><div class="url"><div>🔒 renault.co.in/duster/test-drive</div></div><div class="site-hd"><div class="w">${dia(20, '#111')} RENAULT</div><span style="font-size:18px">☰</span></div><div class="site">${form}${otp}</div></div>`;
  }

  // ───────────────────────────── dealer app ─────────────────────────────
  function dealerPhone(mode) {
    const head = `<div class="status"><span>9:17</span><i>5G ▮▮▮ 71%</i></div><div class="hd"><div class="a"><img src="${D.img.fsApp}" alt=""><div><div class="n">FreeStand Dealer</div><div class="o">Renault Kirti Nagar · Ranjan M.</div></div><span style="margin-left:auto;font-size:15px">🔔</span></div></div>`;
    let body;
    if (mode === 'offer') {
      body = `<div style="font-size:10.5px;font-weight:800;letter-spacing:1.4px;color:#5b6b82;margin:2px 2px 8px">NEW TEST-DRIVE LEAD</div>
      <div class="lead"><div class="tp" id="leadtp"><span>⚡ OFFERED TO 3 DEALERS</span><span class="mono" id="cd">14:59 left</span></div><div class="in3">
        <div style="display:flex;gap:12px;align-items:center"><div class="grade">A</div><div><div style="font-size:15px;font-weight:800">Shubham K. · ${P.masked}</div><div style="font-size:11.5px;color:#5b6b82">Rajouri Garden · <b>3.2 km</b> from you</div></div></div>
        <div style="margin:12px 0 4px;padding:10px;border-radius:8px;background:#f5f7fb;font-size:12px;line-height:1.7"><b>Duster · Turbo AT</b><br>🏠 Home test drive · Wed 21 Oct · 11:00 AM<br>🔁 Exchange: Maruti Swift 2017<br>🗓️ Buying: this month</div>
        <div class="chips" style="margin:10px 0 12px"><span class="chip2 green">DL verified</span><span class="chip2 green">Finance-ready</span><span class="chip2 green">Address 94/100</span><span class="chip2">Instagram ad</span></div>
        <div class="btn or" id="accept">Accept test drive</div><div class="btn ghost" style="margin-top:7px;height:38px" id="pass">Pass</div>
      </div></div>
      <div style="font-size:10.5px;color:#6b7280;margin-top:10px;line-height:1.5">Full name, number and address unlock once you accept. If another dealer accepts first, this offer closes.</div>`;
    } else {
      body = `<div style="display:flex;align-items:center;gap:8px;margin:0 2px 10px"><span class="chip2 green">✓ Accepted · 1 m 48 s</span><span style="font-size:11px;color:#5b6b82">${P.lead}</span></div>
      <div class="card in" style="padding:12px;margin-bottom:10px"><div style="display:flex;gap:10px;align-items:center">${av('shubham', 44)}<div><div style="font-weight:800;font-size:14px">${P.name}</div><div style="font-size:11.5px;color:#5b6b82">${P.phone}</div></div><span style="margin-left:auto;font-size:18px">📞</span></div><div style="font-size:11px;color:#5b6b82;margin-top:8px;line-height:1.45">${P.addr}</div></div>
      <div class="fl" style="margin-top:0">Consultant</div>
      <div class="opt on in" style="animation-delay:.4s"><div class="rd"></div>${av('ranjan', 32)}<div><div style="font-size:12.5px;font-weight:700">Ranjan Mehta</div><div style="font-size:10.5px;color:#6b7280">Free 10:30–12:30 · 4.8★</div></div></div>
      <div class="opt in" style="animation-delay:.5s"><div class="rd"></div><div><div style="font-size:12.5px;font-weight:700">Neha Arora</div><div style="font-size:10.5px;color:#6b7280">Showroom duty till 1 PM</div></div></div>
      <div class="fl">Demo car</div>
      <div class="opt on in" style="animation-delay:.8s"><div class="rd"></div><div style="width:70px">${D.car.whiteSmall}</div><div><div style="font-size:12.5px;font-weight:700">DL 12 DE 0987</div><div style="font-size:10.5px;color:#6b7280">Turbo AT · Pearl White · fuel ¾</div></div></div>
      <div class="fl">Slot</div><div class="seg in" style="animation-delay:1.1s"><div class="on">Wed 21 Oct · 11:00 AM</div></div>
      <div class="btn dark in" id="confirm" style="margin-top:12px;animation-delay:1.4s">Confirm & notify customer</div>`;
    }
    return `<div class="phone dl">${head}<div class="bd">${body}</div></div>`;
  }

  // ───────────────────────────── AI call phone ─────────────────────────────
  function callPhone() {
    let bars = '';
    for (let i = 0; i < 34; i++) bars += `<i style="display:inline-block;width:4px;margin:0 1.5px;border-radius:2px;background:#22c55e;height:${8 + ((i * 37) % 30)}px;animation:wbar .9s ${(i % 7) * 0.11}s ease-in-out infinite"></i>`;
    return `<div class="phone call"><div class="status"><span>5:42</span><i>5G ▮▮▮ 64%</i></div>
      <div style="text-align:center;padding-top:58px"><div style="width:96px;height:96px;margin:0 auto;border-radius:24px;background:#17181c;border:2px solid ${YELLOW};display:grid;place-items:center;box-shadow:0 0 0 10px rgba(255,255,255,.08)">${dia(58)}</div>
      <div style="font-size:22px;font-weight:700;margin-top:22px">Renault India</div><div style="font-size:12.5px;color:#c7d6f5;margin-top:4px">Test-drive desk · AI assistant “Aria”</div>
      <div style="display:inline-flex;align-items:center;gap:6px;margin-top:10px;font-size:11px;background:rgba(255,255,255,.1);padding:5px 10px;border-radius:999px">✓ Verified caller · Truecaller &amp; CNAP</div>
      <div style="font-size:30px;font-weight:300;margin-top:30px;font-variant-numeric:tabular-nums" id="calltime">00:00</div>
      <div style="height:44px;display:flex;align-items:center;justify-content:center;margin-top:18px">${bars}</div>
      <div style="font-size:11px;color:#c7d6f5;margin-top:10px">🔴 This call is recorded for quality. Consent given.</div></div>
      <div style="position:absolute;left:0;right:0;bottom:150px;display:flex;justify-content:space-around;padding:0 40px">${['🔇|Mute', '⌨️|Keypad', '🔊|Speaker'].map((x) => { const [a, b] = x.split('|'); return `<div style="text-align:center;font-size:10.5px;color:#c7d6f5"><div style="width:58px;height:58px;border-radius:50%;background:rgba(255,255,255,.12);display:grid;place-items:center;font-size:20px;margin-bottom:6px">${a}</div>${b}</div>`; }).join('')}</div>
      <div style="position:absolute;left:50%;bottom:56px;width:68px;height:68px;border-radius:50%;background:#ef4444;display:grid;place-items:center;font-size:26px;transform:translateX(-50%) rotate(135deg)">📞</div></div>`;
  }

  // ───────────────────────────── panels ─────────────────────────────
  // A panel that is waiting for the customer (shown until the chat reaches the message it needs).
  const waitPanel = (icon, title, sub, msg) => `<div class="panel" id="panel">${ph(icon, title, sub, 'WAITING', '#d79b00')}<div class="waiting"><div class="sp"></div><div>${msg}</div><div class="skel" style="width:46%"></div><div class="skel" style="width:38%"></div></div></div>`;

  function profilePanel(s) {
    const field = (k, v, ok, d) => `<div class="k">${k}</div><div class="v ${v ? 'in' : ''}" style="animation-delay:${d}s">${v ? v + (ok ? ' <span style="color:#16a34a">✓</span>' : '') : '<span style="display:inline-block;width:220px;height:10px;border-radius:5px;background:#eef1f6;vertical-align:middle"></span>'}</div>`;
    return `<div class="panel show" id="panel">${ph('👤', 'Customer profile', `${P.lead} · Renault India · Duster test drive`, 'SYNCED')}
      <div class="pb">
        <div style="display:flex;gap:22px">${av('shubham', 150)}
          <div style="flex:1"><div class="sec">Personal details</div><div class="kv">
            ${field('Name', 'Shubham Kohli', false, 0.1)}${field('Mobile', s.phone ? P.phone : '', s.otp, 0.4)}${field('Email', '', false, 0.3)}${field('PIN code', '110027 · Rajouri Garden', false, 0.6)}${field('Address', '', true, 0.5)}
          </div></div></div>
        <div class="grid2" style="margin-top:22px">
          <div><div class="sec">Booking</div><div class="card" style="font-size:12.5px;line-height:1.85"><b>Duster · Turbo AT</b><br>🏠 At home · Wed 21 Oct · 11:00 AM<br>📣 Source: Instagram ad · <span class="mono" style="font-size:11px">duster_td_delhi</span><br>📱 Android · Chrome · Hindi/English</div></div>
          <div><div class="sec">Relevant cohorts</div>${chips(s.cohorts)}</div>
        </div>
        <div class="sec" style="margin-top:20px">Validation</div>
        ${s.checks.map((c, i) => chk(c[0], c[1], c[2], c[3], 0.8 + i * 0.25)).join('')}
      </div></div>`;
  }

  function leadCapturedPanel() {
    return `<div class="panel show" id="panel">${ph('📥', 'Lead captured', 'Renault website → FreeStand · in real time', 'NEW', ORANGE)}
      <div class="pb">
        <div style="display:flex;gap:14px;align-items:center;margin-bottom:16px"><div class="big mono" style="font-size:24px">${P.lead}</div><span class="chip2 amber">Unverified</span><span class="lbl" style="margin-left:auto">Mon 19 Oct · 9:13:06 PM</span></div>
        <div class="grid2">
          <div class="card in"><div class="sec">Form fields</div><div class="kv" style="grid-template-columns:96px 1fr">
            <div class="k">Name</div><div class="v">Shubham Kohli</div><div class="k">Mobile</div><div class="v">+91 98374 92834</div><div class="k">PIN</div><div class="v">110027</div>
            <div class="k">Model</div><div class="v">Duster · Turbo AT</div><div class="k">Where</div><div class="v">At home</div><div class="k">Slot</div><div class="v">Wed 21 Oct · 11:00 AM</div></div></div>
          <div class="card in" style="animation-delay:.2s"><div class="sec">Captured silently</div><div class="kv" style="grid-template-columns:96px 1fr">
            <div class="k">Source</div><div class="v">Instagram · paid</div><div class="k">Campaign</div><div class="v mono" style="font-size:12px">duster_td_delhi</div><div class="k">Creative</div><div class="v">“The new Duster · 60 s booking”</div>
            <div class="k">Device</div><div class="v">Android 15 · Chrome</div><div class="k">Session</div><div class="v">48 s on page · 2 variants viewed</div><div class="k">Consent</div><div class="v">WhatsApp · SMS · calls</div></div></div>
        </div>
        <div class="sec" style="margin-top:20px">Instant checks</div>
        ${chk('Duplicate check', 'No open test-drive lead for this number in the last 90 days', 'UNIQUE', '', 0.5)}
        ${chk('Serviceable PIN code', '110027 · 3 Renault dealers within 8 km · home test drive available', '3 DEALERS', '', 0.8)}
        ${chk('Bot & spam screen', 'Human typing pattern · not a known dealer or agent number', 'PASS', '', 1.1)}
        ${chk('Mobile ownership', 'OTP sent to +91 98374 92834', 'NEXT: OTP', 'wait', 1.4)}
      </div></div>`;
  }

  function dlPanel() {
    return `<div class="panel show" id="panel">${ph('🪪', 'Driving licence verification', 'OCR + Parivahan (Sarathi) record match · 2.8 s', 'VERIFYING', ORANGE)}
      <div class="pb"><div style="display:grid;grid-template-columns:300px 1fr;gap:22px">
        <div><div style="border-radius:10px;overflow:hidden;box-shadow:0 8px 24px rgba(13,42,105,.12)">${dlThumb(300)}</div>
          <div class="sec" style="margin-top:18px">Read from the photo</div>
          <div class="kv in" style="grid-template-columns:96px 1fr;font-size:12.5px;animation-delay:.3s"><div class="k">DL number</div><div class="v mono">DL04 20180012345</div><div class="k">Name</div><div class="v">Shubham Kohli</div><div class="k">Date of birth</div><div class="v">14 Aug 1994 · 32 y</div><div class="k">Class</div><div class="v">LMV-NT, MCWG</div><div class="k">Valid till</div><div class="v">11 Mar 2038</div><div class="k">Issued by</div><div class="v">RTO Janakpuri (DL04)</div></div></div>
        <div><div class="sec">Checks</div>
          ${chk('Image quality', 'Sharp, uncropped, no glare · front side', '98%', '', 0.3)}
          ${chk('Tamper & screenshot check', 'Original photo · no edits or reused image', 'PASS', '', 0.6)}
          ${chk('Government record match', 'Parivahan Sarathi: DL active, details match', 'MATCH', '', 0.9)}
          ${chk('Name match with booking', '“SHUBHAM KOHLI” = “Shubham Kohli”', '100%', '', 1.2)}
          ${chk('Licence class allows the car', 'LMV-NT covers a 4-wheeler test drive', 'LMV', '', 1.5)}
          ${chk('Valid on the test-drive date', 'Wed 21 Oct 2026 · 11+ years left', 'VALID', '', 1.8)}
          ${chk('No suspension or endorsement', 'No active suspension on record', 'CLEAR', '', 2.1)}
          <div class="in" style="margin-top:14px;animation-delay:2.4s">${note('🛡️', '<b>Why it matters:</b> the dealer’s insurance needs a valid licence before a demo car leaves the showroom. Unverified leads never reach a dealer.')}</div>
        </div></div></div></div>`;
  }

  function creditPanel() {
    const sc = 784, a = ((sc - 300) / 600) * 180;
    const r = 92, cx = 120, cy = 116;
    const ex = cx - r * Math.cos((a * Math.PI) / 180), ey = cy - r * Math.sin((a * Math.PI) / 180);
    const gauge = `<svg width="240" height="140" viewBox="0 0 240 140"><path d="M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}" stroke="#eef1f6" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M${cx - r} ${cy}A${r} ${r} 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#16a34a" stroke-width="18" fill="none" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" style="animation:dash2 1.4s .3s forwards"/><text x="${cx}" y="${cy - 12}" text-anchor="middle" font-size="40" font-weight="800" fill="#0f172a">${sc}</text><text x="${cx}" y="${cy + 12}" text-anchor="middle" font-size="12" font-weight="700" fill="#16a34a">EXCELLENT</text><text x="${cx - r}" y="${cy + 22}" text-anchor="middle" font-size="10" fill="#94a3b8">300</text><text x="${cx + r}" y="${cy + 22}" text-anchor="middle" font-size="10" fill="#94a3b8">900</text></svg>`;
    return `<div class="panel show" id="panel">${ph('💳', 'Soft credit check', 'Consented bureau pull · no impact on the customer’s score', 'DONE')}
      <div class="pb"><div style="display:grid;grid-template-columns:270px 1fr;gap:24px">
        <div class="card" style="text-align:center">${gauge}<div class="lbl">CIBIL score · soft enquiry · 19 Oct 2026</div>
          <div style="text-align:left;margin-top:16px" class="kv"><div class="k">PAN</div><div class="v mono">AFZPK••90K</div><div class="k">Active loans</div><div class="v">1 · personal loan</div><div class="k">Missed EMIs</div><div class="v">0 in 24 months</div><div class="k">Utilisation</div><div class="v">22% of card limits</div></div></div>
        <div><div class="sec">What the platform derives</div>
          <div class="grid2" style="gap:10px">
            <div class="card in" style="animation-delay:.8s"><div class="lbl">Pre-approved car finance</div><div class="big">₹14 L</div><div class="lbl">from 8.9% p.a. · 3 lender partners</div></div>
            <div class="card in" style="animation-delay:1s"><div class="lbl">Comfortable EMI</div><div class="big">₹26k/mo</div><div class="lbl">covers the Turbo AT on 5-year finance</div></div>
          </div>
          <div style="margin-top:14px">${chk('Consent artefact recorded', 'Purpose: test-drive finance offer · valid 30 days', 'DPDP', '', 1.2)}${chk('Score band shared, not the score', 'Dealer sees “Finance-ready”; the number stays in the CDP', 'MASKED', '', 1.4)}${chk('Optional by design', 'Customers who skip are still verified; they’re graded on DL, address and intent', 'OPTIONAL', 'info', 1.6)}</div>
          <div class="sec" style="margin-top:14px">Cohorts added</div>${chips([['High credit', 'green new'], ['Finance-ready', 'green new'], ['EMI ≤ ₹26k', 'new']])}
        </div></div></div></div>`;
  }

  function addrPanel() {
    return `<div class="panel show" id="panel">${ph('🏠', 'Address quality', 'Parse → standardise → geocode → serviceability', 'SCORED')}
      <div class="pb"><div style="display:grid;grid-template-columns:1fr 250px;gap:22px">
        <div><div class="grid2" style="gap:10px">
          <div class="card"><div class="lbl">As typed</div><div style="font-size:12.5px;margin-top:6px;line-height:1.5">C-42, 2nd Floor, Vishal Enclave, Rajouri Garden, New Delhi 110027</div></div>
          <div class="card in" style="border-color:#b7e2c6;background:#f6fcf8;animation-delay:.4s"><div class="lbl">Standardised</div><div style="font-size:12px;margin-top:6px;line-height:1.55" class="mono">FLAT C-42 · FLOOR 2<br>VISHAL ENCLAVE (C BLOCK)<br>RAJOURI GARDEN · WEST DELHI<br>DELHI 110027</div></div></div>
          <div class="sec" style="margin-top:16px">Checks</div>
          ${chk('PIN code ↔ locality', '110027 belongs to Rajouri Garden, West Delhi', 'MATCH', '', 0.6)}
          ${chk('House or flat number present', 'Flat C-42, floor 2 · a driver can find the door', 'YES', '', 0.85)}
          ${chk('Geocode confidence', 'Rooftop-level · 28.6449 N, 77.1210 E', '0.97', '', 1.1)}
          ${chk('Residential, not commercial or PG', 'Apartment society · gated', 'HOME', '', 1.35)}
          ${chk('Home test drive serviceable', '3 dealers within 8 km; nearest 3.2 km', '3 IN 8 KM', '', 1.6)}
          ${chk('Gate pass needed', 'Society security will ask for the visitor’s name; shared with the consultant', 'INFO', 'info', 1.85)}
        </div>
        <div><div class="card" style="text-align:center;padding:18px 12px"><div class="lbl">Address quality score</div><div class="big" style="font-size:52px;color:#16a34a">94</div><div class="lbl">out of 100 · deliverable</div><div class="bar2" style="margin:12px 6px 0"><i style="width:94%"></i></div></div>
          <div style="height:150px;border-radius:10px;overflow:hidden;margin-top:12px;border:1px solid var(--line)">${miniMap()}</div>
          <div class="sec" style="margin-top:14px">Enriched</div>${chips([['Locality: high affluence', 'green new'], ['Apartment', 'new'], ['West Delhi', 'new']])}</div>
      </div></div></div>`;
  }

  function enrichedPanel() {
    const col = (t, ic, rows, d) => `<div class="card in" style="padding:12px 14px;animation-delay:${d}s"><div class="sec" style="margin-bottom:8px">${ic} ${t}</div>${rows.map(([k, v]) => `<div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0"><span style="color:#94a3b8">${k}</span><b>${v}</b></div>`).join('')}</div>`;
    return `<div class="panel show" id="panel">${ph('⭐', 'Enriched lead', `${P.lead} · ready to route`, 'GRADE A')}
      <div class="pb">
        <div style="display:flex;gap:20px;align-items:center;margin-bottom:16px">
          ${av('shubham', 86)}<div><div style="font-size:20px;font-weight:800">Shubham Kohli</div><div style="font-size:12.5px;color:#5b6b82">${P.phone} · Rajouri Garden 110027 · Duster Turbo AT</div>
          <div class="chips" style="margin-top:8px"><span class="chip2 green">OTP ✓</span><span class="chip2 green">WhatsApp ✓</span><span class="chip2 green">DL ✓</span><span class="chip2 green">Credit ✓</span><span class="chip2 green">Address ✓</span></div></div>
          <div style="margin-left:auto;text-align:center" class="in"><div style="width:96px;height:96px;border-radius:50%;background:conic-gradient(#16a34a 0 91%, #eef1f6 0);display:grid;place-items:center"><div style="width:74px;height:74px;border-radius:50%;background:#fff;display:grid;place-items:center"><div><div style="font-size:26px;font-weight:900;line-height:1">91</div><div style="font-size:10px;font-weight:800;color:#16a34a">GRADE A</div></div></div></div><div class="lbl" style="margin-top:4px">Lead score</div></div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
          ${col('Identity', '🪪', [['Mobile', 'OTP-verified'], ['Licence', 'Valid · LMV'], ['Fraud screen', 'Clear']], 0.2)}
          ${col('Ability to buy', '💳', [['Credit band', 'Excellent'], ['Pre-approved', '₹14 L'], ['EMI comfort', '≤ ₹26k']], 0.35)}
          ${col('Intent', '🎯', [['Buying', 'This month'], ['Mode', 'Home drive'], ['Source', 'Instagram ad']], 0.5)}
          ${col('Location', '📍', [['Address score', '94 / 100'], ['Locality', 'High affluence'], ['Dealers ≤ 8 km', '3']], 0.65)}
          ${col('Exchange', '🔁', [['Owns', 'Swift 2017'], ['Est. value', '₹3.1–3.6 L'], ['Upgrade', 'Hatch → SUV']], 0.8)}
          ${col('Engagement', '💬', [['Replies', '6 of 6'], ['Time to finish', '3 m 10 s'], ['Language', 'English']], 0.95)}
        </div>
        <div class="sec" style="margin-top:16px">Relevant cohorts</div>
        ${chips([['In-market · 0–30 days', 'orange'], ['High credit', 'green'], ['Exchange: hatchback owner', 'amber'], ['Home test drive', ''], ['West Delhi · metro', ''], ['Paid social', ''], ['Grade A', 'dark']])}
        <div style="margin-top:16px">${note('🧭', '<b>Routing rule:</b> grade A and B leads go to the 3 nearest dealers with a 15-minute SLA. Grade C gets an AI qualification call first. Unverified leads never reach a dealer.')}</div>
      </div></div>`;
  }

  function broadcastPanel() {
    const row = (n, name, km, st, t, cls, d, id) => `<div class="card in" id="${id}" style="display:flex;align-items:center;gap:14px;padding:12px 16px;margin-bottom:8px;animation-delay:${d}s"><div class="nb" style="width:30px;height:30px;border-radius:8px;background:${NAVY};color:#fff;display:grid;place-items:center;font-weight:800">${n}</div><div style="flex:1"><div style="font-weight:700;font-size:13.5px">${name}</div><div class="sub" style="font-size:11.5px;color:#5b6b82">${km} km · ${t}</div></div><span class="chip2 ${cls}">${st}</span></div>`;
    const ev = (t, x, d) => `<div class="in" style="display:flex;gap:12px;font-size:12px;padding:5px 0;animation-delay:${d}s"><span class="mono" style="color:#94a3b8;width:66px">${t}</span><span>${x}</span></div>`;
    return `<div class="panel show" id="panel">${ph('📡', 'Dealer offer', `${P.lead} · offered to the 3 nearest dealers`, 'RACING', ORANGE)}
      <div class="pb">
        <div class="sec">Race to accept <span class="r" id="race">SLA 15:00</span></div>
        ${row(1, 'Renault Kirti Nagar', '3.2', 'VIEWING', 'Ranjan Mehta has it open', 'amber', 0.1, 'r1')}
        ${row(2, 'Renault Punjabi Bagh', '5.4', 'VIEWING', 'Opened at 9:16:40 PM', 'amber', 0.25, 'r2')}
        ${row(3, 'Renault Janakpuri', '6.1', 'VIEWING', 'Opened at 9:17:12 PM', 'amber', 0.4, 'r3')}
        <div class="grid2" style="margin-top:16px">
          <div><div class="sec">Event log</div><div id="evlog">${ev('9:16:04', 'Lead offered to 3 dealers · masked preview', 0.5)}${ev('9:16:40', 'Punjabi Bagh opened the offer', 0.7)}${ev('9:17:12', 'Janakpuri opened the offer', 0.9)}</div></div>
          <div><div class="sec">Rules</div>${note('⚖️', '<b>Nearest 3, first to accept wins.</b> Distance is by road from the verified address, not the PIN code.<br><br><b>Masked until accepted.</b> Dealers see grade, model, slot and distance, not the name or number.<br><br><b>No-show protection.</b> If nobody accepts in 15 min, the next ring of dealers is offered and the region head is alerted.')}</div>
        </div>
      </div></div>`;
  }

  function allocationPanel() {
    const slots = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00'];
    const busy = { 0: 'Showroom', 1: 'Showroom', 5: 'Kalra · TD', 6: 'Kalra · TD' };
    return `<div class="panel show" id="panel">${ph('🗓️', 'Dealer handover', 'Renault Kirti Nagar · DMS synced', 'ASSIGNED')}
      <div class="pb">
        <div class="grid2">
          <div class="card"><div class="sec">Consultant</div><div style="display:flex;gap:12px;align-items:center">${av('ranjan', 64)}<div><div style="font-weight:800;font-size:15px">Ranjan Mehta</div><div class="lbl">Sales consultant · 6 yrs · 4.8★ (212 drives)</div><div style="font-size:12px;margin-top:4px">+91 99883 37493</div></div></div></div>
          <div class="card"><div class="sec">Demo car</div><div style="display:flex;gap:12px;align-items:center"><div style="width:110px">${D.car.whiteSmall}</div><div><div style="font-weight:800;font-size:15px">DL 12 DE 0987</div><div class="lbl">Duster Turbo AT · Pearl White</div><div style="font-size:12px;margin-top:4px">Fuel ¾ · insured · last service 2 Oct</div></div></div></div>
        </div>
        <div class="sec" style="margin-top:18px">Wed 21 Oct · demo car DL 12 DE 0987</div>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">${slots.map((t, i) => `<div style="text-align:center" class="in" style="animation-delay:${0.2 + i * 0.06}s"><div style="height:42px;border-radius:6px;display:grid;place-items:center;font-size:10.5px;font-weight:700;${i === 2 || i === 3 ? `background:${ORANGE};color:#fff` : busy[i] ? 'background:#e5e7eb;color:#6b7280' : 'background:#e8f6ee;color:#11622f'}">${i === 2 ? 'Shubham K.' : i === 3 ? '+ drive' : busy[i] || 'Free'}</div><div class="lbl" style="margin-top:4px">${t}</div></div>`).join('')}</div>
        <div style="margin-top:16px">${chk('Lead created in the dealer DMS', 'DMS-KN-88412 · source FreeStand · campaign duster_td_delhi', 'SYNCED', '', 0.5)}${chk('Consultant briefed', 'Swift 2017 exchange · finance-ready · wants AT · gate pass needed', 'SENT', '', 0.8)}${chk('Car and consultant blocked', '11:00–12:00 including travel (3.2 km · 12 min)', 'BLOCKED', '', 1.1)}${chk('Customer confirmation', 'WhatsApp confirmation goes out on “Confirm”', 'NEXT', 'wait', 1.4)}</div>
      </div></div>`;
  }

  function commsPanel() {
    const tl = (t, x, s, cls, d) => `<div class="in" style="display:flex;gap:14px;animation-delay:${d}s"><div style="display:flex;flex-direction:column;align-items:center"><div style="width:14px;height:14px;border-radius:50%;background:${cls === 'done' ? '#16a34a' : '#fff'};border:3px solid ${cls === 'done' ? '#16a34a' : '#c3c8cf'}"></div><div style="flex:1;width:2px;background:#e2e8f0;min-height:26px"></div></div><div style="padding-bottom:12px"><div style="font-size:13px;font-weight:700">${x} <span class="mono" style="font-size:11px;color:#94a3b8;font-weight:500;margin-left:6px">${t}</span></div><div style="font-size:11.5px;color:#5b6b82">${s}</div></div></div>`;
    return `<div class="panel show" id="panel">${ph('✉️', 'Confirmation & reminders', 'Customer journey · automated by FreeStand', 'ACTIVE')}
      <div class="pb"><div class="grid2">
        <div><div class="sec">Confirmation</div>
          ${chk('WhatsApp confirmation sent', 'Template “td_confirmed_v3” · rich card + 3 buttons', '9:18:01', '', 0.1)}
          ${chk('Delivered', 'Single tick → double tick', '9:18:02', '', 0.5)}
          ${chk('Read', 'Opened 29 s after delivery', '9:18:30', '', 0.9)}
          ${chk('Calendar invite', '.ics with the address, consultant and car', 'ADDED', '', 1.3)}
          <div class="sec" style="margin-top:16px">Fallbacks</div>
          ${note('🔁', 'Not delivered in 2 min → <b>SMS</b>.<br>Not read in 2 h → <b>AI call</b>.<br>Cancel or reschedule from any message updates the dealer instantly.')}
        </div>
        <div><div class="sec">Scheduled journey</div>
          ${tl('Mon 9:18 PM', 'Confirmation', 'WhatsApp · delivered and read', 'done', 0.3)}
          ${tl('Tue 5:40 PM', 'AI confirmation call (T-18 h)', 'Hinglish · confirms, reschedules, answers FAQs', '', 0.5)}
          ${tl('Wed 9:00 AM', 'Morning reminder (T-2 h)', 'WhatsApp · documents checklist', '', 0.7)}
          ${tl('Wed 10:45 AM', 'Consultant live location (T-30 m)', 'Map card + handover code', '', 0.9)}
          ${tl('Wed +90 min', 'Feedback & next step', 'Rating, on-road price, booking link', '', 1.1)}
          ${tl('+48 h', 'AI follow-up call', 'Only if no booking yet', '', 1.3)}
        </div></div></div></div>`;
  }

  function callPanel() {
    const line = (w, t, d) => `<div class="in" style="display:flex;gap:10px;margin-bottom:9px;animation-delay:${d}s"><span style="flex:none;font-size:9.5px;font-weight:800;letter-spacing:.6px;color:#fff;background:${w === 'ai' ? NAVY : ORANGE};border-radius:10px;padding:3px 8px;height:18px">${w === 'ai' ? 'AI · ARIA' : 'SHUBHAM'}</span><span style="font-size:12.5px;line-height:1.5;color:${w === 'ai' ? '#3b4352' : '#0f172a'};font-weight:${w === 'ai' ? 500 : 650}">${t}</span></div>`;
    const ex = (k, v, d, cls = '') => `<div class="in" style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f0f1f3;font-size:12.5px;animation-delay:${d}s"><span style="color:#5b6b82">${k}</span><span class="chip2 ${cls}">${v}</span></div>`;
    return `<div class="panel show" id="panel">${ph('🎙️', 'AI confirmation call', 'Tue 20 Oct · 5:42 PM · answered on the first attempt', 'ON CALL')}
      <div class="pb"><div style="display:grid;grid-template-columns:1.25fr 1fr;gap:22px">
        <div><div class="sec">Live transcript <span class="r">HINGLISH</span></div>
          ${line('ai', 'Namaste Shubham ji, main Renault se Aria bol rahi hoon. Kal 11 baje aapka Duster test drive ghar pe hai. Kya yeh confirm hai?', 0.3)}
          ${line('c', 'Haan, but kya 11:30 kar sakte hain? Thoda late free hounga.', 2.0)}
          ${line('ai', 'Bilkul. 11:30 slot available hai, maine update kar diya. Ranjan aapko 11:15 pe call karenge.', 3.6)}
          ${line('c', 'Perfect. Meri wife bhi saath hogi. Aur exchange ke baare mein bhi baat karni hai.', 5.4)}
          ${line('ai', 'Noted. Ranjan Swift ki exchange value bhi bata denge. Original DL ready rakhiyega. Kuch aur?', 7.0)}
          ${line('c', 'Nahi, bas. Thank you!', 8.6)}
        </div>
        <div><div class="sec">Captured from the call</div>
          ${ex('Test drive', 'Confirmed', 2.2, 'green')}${ex('Time', '11:00 → 11:30 AM', 3.8, 'amber')}${ex('Co-passenger', 'Spouse', 5.6)}${ex('Topic to prepare', 'Swift exchange value', 5.9)}${ex('Documents', 'DL ready', 7.2, 'green')}${ex('Sentiment', 'Positive · high intent', 8.8, 'green')}
          <div class="sec" style="margin-top:16px">Actions taken</div>
          ${chk('Slot moved in the dealer DMS', 'Car and consultant re-blocked 11:30–12:30', 'DONE', '', 4.0)}
          ${chk('Ranjan notified', 'FreeStand Dealer push + exchange brief', 'DONE', '', 6.0)}
          ${chk('WhatsApp updated', 'New time sent to Shubham', 'DONE', '', 9.2)}
        </div></div></div></div>`;
  }

  function trackPanel() {
    return `<div class="panel show" id="panel">${ph('📍', 'Day-of tracking', 'Wed 21 Oct · consultant en route', 'LIVE')}
      <div class="pb"><div style="display:grid;grid-template-columns:1fr 280px;gap:20px">
        <div><div style="height:300px;border-radius:12px;overflow:hidden;border:1px solid var(--line);position:relative">${miniMap({ route: true, car: 104 })}<div style="position:absolute;left:14px;top:14px;background:${NAVY};color:#fff;border-radius:8px;padding:8px 12px;font-size:12px"><b id="eta">ETA 9 min</b> · 2.1 km left</div></div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px"><div class="card"><div class="lbl">Left showroom</div><div style="font-size:17px;font-weight:800">11:12 AM</div></div><div class="card"><div class="lbl">Expected at gate</div><div style="font-size:17px;font-weight:800">11:27 AM</div></div><div class="card"><div class="lbl">Slot</div><div style="font-size:17px;font-weight:800">11:30 AM</div></div></div></div>
        <div><div class="card" style="display:flex;gap:12px;align-items:center">${av('ranjan', 56)}<div><div style="font-weight:800">Ranjan Mehta</div><div class="lbl">DL 12 DE 0987 · Pearl White</div></div></div>
          <div class="sec" style="margin-top:16px">Checks</div>
          ${chk('Morning reminder read', 'T-2 h WhatsApp · 9:02 AM', 'READ', '', 0.2)}
          ${chk('Consultant pre-call', 'Ranjan called at 11:15 AM · 0:48', 'DONE', '', 0.4)}
          ${chk('Handover code issued', 'Code 4831 starts the drive', 'SENT', '', 0.6)}
          ${chk('Geofence arrival', 'Alert when the car is 200 m from the gate', 'WAITING', 'wait', 0.8)}
          ${note('⏱️', '<b>On-time SLA.</b> If the car is 10+ min late, Shubham gets an automatic update and the showroom manager is alerted.')}
        </div></div></div></div>`;
  }

  function outcomePanel() {
    return `<div class="panel show" id="panel">${ph('🏁', 'Test-drive outcome', `${P.lead} · closed loop to the dealer`, 'HOT LEAD', ORANGE)}
      <div class="pb">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
          <div class="card in"><div class="lbl">Drive</div><div class="big" style="font-size:24px">24 min</div><div class="lbl">14.2 km · city + Ring Road</div></div>
          <div class="card in" style="animation-delay:.15s"><div class="lbl">Rating</div><div class="big" style="font-size:24px">😍 5/5</div><div class="lbl">“Loved it”</div></div>
          <div class="card in" style="animation-delay:.3s"><div class="lbl">Next step chosen</div><div class="big" style="font-size:20px">On-road price</div><div class="lbl">opened in 38 s</div></div>
          <div class="card in" style="border-color:#ffd2b0;background:#fff7f1;animation-delay:.45s"><div class="lbl">Purchase intent</div><div class="big" style="font-size:24px;color:${ORANGE}">Hot</div><div class="lbl">booking likely in 7 days</div></div>
        </div>
        <div class="grid2" style="margin-top:16px">
          <div><div class="sec">Closed loop</div>
            ${chk('Drive verified', 'Handover code 11:34 AM · return 11:58 AM', 'DONE', '', 0.6)}
            ${chk('Dealer DMS updated', 'Stage: Test drive done → Negotiation', 'SYNCED', '', 0.8)}
            ${chk('Quote shared', 'Indicative on-road price + exchange estimate on WhatsApp', 'SENT', '', 1.0)}
            ${chk('Follow-up booked', 'AI call in 48 h if no booking · Ranjan gets the transcript', 'SCHEDULED', 'wait', 1.2)}
          </div>
          <div><div class="sec">Relevant cohorts</div>
            ${chips([['Test drive: done', 'green new'], ['Hot lead', 'orange new'], ['Exchange: Swift 2017', 'amber'], ['Finance-ready', 'green'], ['In-market · 0–30 days', 'orange'], ['Grade A', 'dark']])}
            <div class="sec" style="margin-top:16px">Next best action</div>
            <div class="card" style="display:flex;gap:12px;align-items:center"><span style="font-size:22px">📝</span><div><div style="font-weight:700;font-size:13px">Send a ₹21,000 booking link with the exchange bonus</div><div class="lbl">Hot leads who see a price within 2 h book 2.3× more often (demo data)</div></div></div>
            <div class="card" style="display:flex;gap:12px;align-items:center;margin-top:8px"><span style="font-size:22px">🎯</span><div><div style="font-weight:700;font-size:13px">Add to the lookalike seed</div><div class="lbl">Grade-A test-drivers improve paid-social targeting for the next wave</div></div></div>
          </div></div>
      </div></div>`;
  }

  // ───────────────────────────── full-canvas pages ─────────────────────────────
  function cover() {
    const stages = [['01', 'Booking', 'Website or app in 60 seconds'], ['02', 'Validation', 'Licence, credit, address'], ['03', 'Fulfilment', 'Nearest 3 dealers race'], ['04', 'Confirmation', 'WhatsApp + AI calling']];
    return `<div class="full" style="background:linear-gradient(135deg,#0d2a69 0%,#1f4fd1 100%);color:#fff">
      <div style="position:absolute;left:56px;top:56px;width:520px">
        <div style="display:flex;align-items:center;gap:12px" class="in"><img src="${D.img.fs}" alt="FreeStand" style="height:20px;filter:brightness(0) invert(1)"><span style="opacity:.5">|</span><span style="display:flex;align-items:center;gap:8px;font-weight:800;letter-spacing:3px;font-size:13px"><span style="width:30px;height:30px;border-radius:7px;background:#17181c;display:grid;place-items:center">${dia(20, YELLOW)}</span>RENAULT</span></div>
        <div class="in" style="font-size:11.5px;font-weight:800;letter-spacing:2px;color:#ffb27a;margin-top:44px;animation-delay:.1s">TEST-DRIVE DEMO · DUSTER · DELHI NCR</div>
        <div class="in" style="font-size:46px;font-weight:800;line-height:1.08;letter-spacing:-1px;margin-top:12px;animation-delay:.2s">Every test drive verified, routed and confirmed.</div>
        <div class="in" style="font-size:16px;color:#c7d6f5;margin-top:16px;line-height:1.55;animation-delay:.3s">Follow one Duster lead from an Instagram ad to the key handover at Shubham’s gate: four stages, no manual follow-up.</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:28px">${stages.map((s, i) => `<div class="in" style="border:1px solid rgba(255,255,255,.25);border-radius:12px;padding:12px 14px;animation-delay:${0.45 + i * 0.12}s"><div style="font-size:11px;font-weight:800;color:#ffb27a;letter-spacing:2px">${s[0]}</div><div style="font-size:15px;font-weight:800;margin-top:3px">${s[1]}</div><div style="font-size:12px;color:#c7d6f5;margin-top:2px">${s[2]}</div></div>`).join('')}</div>
        <button id="startbtn" class="in" style="margin-top:28px;background:${ORANGE};color:#fff;border:none;border-radius:8px;padding:13px 22px;font-size:14px;font-weight:700;animation-delay:1s;box-shadow:0 8px 20px rgba(255,107,0,.35)">See how it works →</button>
      </div>
      <div style="position:absolute;right:44px;top:44px;width:620px;height:712px;border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 20px 50px rgba(0,0,0,.3)" class="in">
        <div class="loc" style="height:36px;font-size:10.5px">RENAULT KIRTI NAGAR<i>·</i>NEW DELHI</div>
        <div style="position:absolute;top:36px;left:0;right:0;height:470px">${D.scenes.cover}</div>
        <div style="position:absolute;left:0;right:0;bottom:0;height:206px;background:${NAVY};padding:18px 22px;display:grid;grid-template-columns:auto 1fr;gap:10px 18px;align-items:center;font-size:13px;color:#c7d6f5">
          <b style="font-size:24px;color:#fff">79%</b><span>of booked test drives validated before a dealer sees them</span>
          <b style="font-size:24px;color:#fff">2 m 41 s</b><span>median time for the nearest dealer to accept</span>
          <b style="font-size:24px;color:#fff">76%</b><span>show-up rate after AI confirmation calls <span style="opacity:.6">(demo data)</span></span>
        </div>
      </div></div>`;
  }

  function analytics() {
    const F = [['Test drives booked', 12480], ['Mobile verified (OTP)', 11902], ['Validated (DL + address)', 9861], ['Accepted by a dealer', 9402], ['Confirmed by AI call', 8577], ['Test drives done', 7118], ['Cars booked', 1281]];
    const max = F[0][1];
    const fmt = (n) => n.toLocaleString('en-IN');
    const funnel = F.map(([l, v], i) => `<div class="row"><span>${l}</span><div class="b" data-tip="${l}: ${fmt(v)} (${((v / max) * 100).toFixed(1)}% of bookings)"><i class="${i === F.length - 1 ? 'hi' : ''}" style="width:${(v / max) * 100}%;animation-delay:${i * 0.1}s"></i></div><span class="n">${fmt(v)}<small>${i ? ((v / F[i - 1][1]) * 100).toFixed(0) + '%' : ''}</small></span></div>`).join('');
    const R = [['Invalid or expired licence', 742], ['Address not serviceable', 498], ['Duplicate lead', 381], ['Dealer or agent number', 236], ['Consent withdrawn', 184]];
    const rmax = R[0][1];
    const reasons = R.map(([l, v], i) => `<div class="row" style="grid-template-columns:180px 1fr 52px"><span>${l}</span><div class="b" data-tip="${l}: ${fmt(v)} leads stopped before a dealer saw them"><i style="width:${(v / rmax) * 100}%;background:#94a3b8;animation-delay:${i * 0.1}s"></i></div><span class="n">${fmt(v)}</span></div>`).join('');
    const T = [['Kirti Nagar', 1214, 1152, '1 m 52 s', '81%', 214], ['Punjabi Bagh', 1032, 958, '2 m 05 s', '79%', 176], ['Janakpuri', 1086, 1001, '2 m 30 s', '77%', 171], ['Dwarka', 790, 731, '3 m 12 s', '74%', 118], ['Karol Bagh', 874, 772, '4 m 10 s', '68%', 102]];
    return `<div class="full"><div class="dash"><div class="side"><div class="lg"><img src="${D.img.fs}" alt="FreeStand"></div>
      ${[['📊', 'Overview', 1], ['🚗', 'Test drives'], ['🛡️', 'Validation'], ['🏢', 'Dealers'], ['🎙️', 'AI calls'], ['💬', 'WhatsApp'], ['👥', 'Audiences'], ['⚙️', 'Settings']].map(([i, t, on]) => `<a class="${on ? 'on' : ''}">${i} ${t}</a>`).join('')}
      <div style="margin-top:auto;padding:0 18px;font-size:11px;opacity:.7">Renault India · Delhi NCR<br>Duster test-drive programme</div></div>
      <div class="mainp">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px"><div><div style="font-size:20px;font-weight:800;color:${NAVY}">Test-drive programme · Delhi NCR</div><div class="lbl">Duster · 1 Aug – 21 Oct 2026 · 5 dealers · demo data</div></div><div class="chips"><span class="chip2">Last 12 weeks ▾</span><span class="chip2">All dealers ▾</span><span class="chip2 dark">Export</span></div></div>
        <div class="kpis">
          <div class="kpi in"><div class="v">12,480</div><div class="l">Test drives booked</div><div class="d">▲ 18% vs prior 12 wks</div></div>
          <div class="kpi in" style="animation-delay:.1s"><div class="v">79%</div><div class="l">Validated before a dealer saw them</div><div class="d">2,041 junk leads stopped</div></div>
          <div class="kpi in" style="animation-delay:.2s"><div class="v">2 m 41 s</div><div class="l">Median dealer acceptance</div><div class="d">95% inside the 15-min SLA</div></div>
          <div class="kpi in" style="animation-delay:.3s"><div class="v">76%</div><div class="l">Show-up rate</div><div class="d">after AI confirmation calls</div></div>
          <div class="kpi in" style="animation-delay:.4s"><div class="v">18%</div><div class="l">Drive → booking</div><div class="d">1,281 cars booked</div></div>
        </div>
        <div style="display:grid;grid-template-columns:1.25fr 1fr;gap:12px;margin-top:12px">
          <div class="card funnel"><div class="sec">Funnel · ad to booking</div>${funnel}</div>
          <div class="card funnel"><div class="sec">Why leads were stopped <span class="r">2,041</span></div>${reasons}
            <div class="sec" style="margin-top:14px">AI calls</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:11.5px"><div><div style="font-size:18px;font-weight:800">21,340</div><div class="lbl">calls placed</div></div><div><div style="font-size:18px;font-weight:800">73%</div><div class="lbl">answered</div></div><div><div style="font-size:18px;font-weight:800">1,912</div><div class="lbl">reschedules handled</div></div></div></div>
        </div>
        <div class="card" style="margin-top:12px"><div class="sec">Dealer leaderboard</div><table class="t"><thead><tr><th>Dealer</th><th class="r">Offered</th><th class="r">Accepted</th><th class="r">Median accept</th><th class="r">Show-up</th><th class="r">Bookings</th></tr></thead><tbody>${T.map((r) => `<tr><td><b>Renault ${r[0]}</b></td><td class="r">${fmt(r[1])}</td><td class="r">${fmt(r[2])}</td><td class="r">${r[3]}</td><td class="r">${r[4]}</td><td class="r"><b>${r[5]}</b></td></tr>`).join('')}</tbody></table></div>
      </div></div></div>`;
  }

  function thanks() {
    const rows = [['Booking', 'Ad → website → OTP → WhatsApp in under a minute'], ['Validation', 'Licence, soft credit, address quality and intent: a grade-A lead'], ['Fulfilment', 'Nearest 3 dealers raced; Kirti Nagar won in 1 m 48 s'], ['Confirmation & AI calling', 'Confirmed, rescheduled by voice, tracked to the gate']];
    return `<div class="full" style="background:linear-gradient(135deg,#0d2a69 0%,#1f4fd1 100%)"><div style="position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:0 70px;gap:50px;color:#fff">
      <div class="in"><img src="${D.img.fs}" alt="FreeStand" style="height:22px;filter:brightness(0) invert(1)"><div style="font-size:48px;font-weight:800;line-height:1.08;margin-top:30px;letter-spacing:-1px">Thank you.</div><div style="font-size:17px;color:#c7d6f5;margin-top:14px;line-height:1.55">One lead, four stages, zero manual follow-up.<br>Every Renault test drive verified before a dealer spends a minute on it.</div><div style="margin-top:28px;font-size:11px;color:#9fb3db">Illustrations: <a href="https://desilog.in" target="_blank" rel="noopener" style="color:inherit">Desi Log by Juhi Chitra · desilog.in</a> (CC BY 4.0)</div></div>
      <div>${rows.map((r, i) => `<div class="in" style="display:flex;gap:16px;align-items:flex-start;padding:18px 0;border-bottom:1px solid rgba(255,255,255,.15);animation-delay:${0.2 + i * 0.15}s"><span style="font-size:13px;font-weight:800;color:#ffb27a;width:28px">0${i + 1}</span><div><div style="font-size:18px;font-weight:700">${r[0]}</div><div style="font-size:13px;color:#c7d6f5;margin-top:3px">${r[1]}</div></div></div>`).join('')}</div></div></div>`;
  }

  // ───────────────────────────── chapters and steps ─────────────────────────────
  const CH = [
    { n: '00', t: 'Introduction', s: 'One lead, end to end' },
    { n: '01', t: 'Booking', s: 'Website or app · OTP · WhatsApp', banner: 'Shubham books a Duster test drive in under a minute' },
    { n: '02', t: 'Validation', s: 'Licence · credit · address · enrichment', banner: 'Before any dealer sees the lead, it is verified and enriched' },
    { n: '03', t: 'Fulfilment', s: 'Nearest 3 dealers race to accept', banner: 'The validated lead goes to the 3 nearest Renault dealers' },
    { n: '04', t: 'Confirmation & AI calling', s: 'WhatsApp · AI call · handover', banner: 'Confirmed on WhatsApp, coordinated by AI calls' },
    { n: '05', t: 'Results', s: 'Programme analytics' },
  ];
  // scene(): an illustrated moment. split(): a phone and a panel. Each step: c (chapter), label,
  // eb (eyebrow), h (headline), p (one line).
  const scene = (name) => ({ kind: 'scene', name });
  const STEPS = [
    { c: 0, label: 'Overview', eb: 'Renault × FreeStand', h: 'A test-drive programme that runs itself', p: 'Booking, validation, dealer fulfilment and confirmation in one flow. Press Next to follow Shubham.', render: cover },
    { c: 1, label: 'Sees the ad', eb: 'Home · Rajouri Garden · Mon 19 Oct · 9:12 PM', h: 'Shubham sees the new Duster on Instagram', p: 'The ad deep-links to the test-drive page. The campaign source travels with the lead from here on.', ...scene('ad'), loc: 'HOME · RAJOURI GARDEN, NEW DELHI · MON 19 OCT · 9:12 PM' },
    { c: 1, label: 'Books on the website', eb: 'renault.co.in · 9:13 PM', h: 'He books a home test drive in 48 seconds', p: 'The lead lands in the CDP as he types: duplicate, PIN-code and spam checks run before he taps Book.', split: () => sitePhone('filled'), panel: leadCapturedPanel, panelDelay: 3700, wait: ['📥', 'Lead captured', 'Renault website → FreeStand', 'Waiting for Shubham to tap “Book”…'] },
    { c: 1, label: 'OTP + WhatsApp', eb: 'renault.co.in · 9:13 PM', h: 'One OTP, then the journey moves to WhatsApp', p: 'The verified number and the consent record anchor everything that follows.', split: () => sitePhone('otp'), panel: () => profilePanel({ phone: 1, otp: 1, cohorts: [['Home test drive', 'new'], ['Instagram ad', 'new'], ['Duster · AT', 'new']], checks: [['Mobile verified', 'OTP auto-read · +91 98374 92834', 'OTP ✓'], ['WhatsApp opt-in', 'Consent artefact: test drive + offers · Mon 9:13:41 PM', 'DPDP ✓'], ['Driving licence', 'Next: on WhatsApp', 'PENDING', 'wait'], ['Credit (optional)', 'Next: on WhatsApp', 'PENDING', 'wait'], ['Address', 'Next: on WhatsApp', 'PENDING', 'wait']] }), panelDelay: 2300, wait: ['👤', 'Customer profile', P.lead, 'Waiting for the OTP…'] },
    { c: 2, label: 'Driving licence', eb: 'WhatsApp · 9:13 PM', h: 'His driving licence is checked against the government record', p: 'A photo on WhatsApp is read, matched to Parivahan and to the name he booked with.', wa: [0, 6], panel: dlPanel, panelAt: 4, wait: ['🪪', 'Driving licence verification', 'OCR + Parivahan match', 'Waiting for the licence photo…'] },
    { c: 2, label: 'Credit score', eb: 'WhatsApp · 9:14 PM', h: 'An optional soft credit check, with no impact on his score', p: 'The dealer only learns that he is finance-ready, never the number.', wa: [6, 9], panel: creditPanel, panelAt: 7, wait: ['💳', 'Soft credit check', 'Consented bureau pull', 'Waiting for consent and PAN…'] },
    { c: 2, label: 'Address quality', eb: 'WhatsApp · 9:15 PM', h: 'An address a driver can actually find', p: 'Parsed, geocoded, scored and checked for home test-drive serviceability.', wa: [9, 13], panel: addrPanel, panelAt: 11, wait: ['🏠', 'Address quality', 'Parse → geocode → serviceability', 'Waiting for the address…'] },
    { c: 2, label: 'Enriched lead', eb: 'WhatsApp · 9:16 PM', h: 'Two more answers and the lead is grade A', p: 'Current car and buying window complete the profile, ready to route.', wa: [13, 18], panel: enrichedPanel, panelAt: 17, wait: ['⭐', 'Enriched lead', P.lead, 'Building the lead score…'] },
    { c: 3, label: 'Nearest 3 dealers', eb: 'Lead routing · West Delhi · 9:16 PM', h: 'The lead is offered to the 3 nearest Renault dealers', p: 'Each dealer sees a masked preview and has 15 minutes to accept.', ...scene('map'), loc: 'LEAD ROUTING · WEST DELHI · MON 19 OCT · 9:16 PM' },
    { c: 3, label: 'Dealer accepts', eb: 'FreeStand Dealer app · 9:17 PM', h: 'First to accept wins: Kirti Nagar takes it in 1 m 48 s', p: 'The other two offers close automatically and the full profile unlocks for the winner.', split: () => dealerPhone('offer'), panel: broadcastPanel, panelDelay: 0, live: 'race' },
    { c: 3, label: 'Showroom', eb: 'Renault Kirti Nagar · 9:17 PM', h: 'The nearest dealer takes over', p: 'Ranjan accepts on the FreeStand Dealer app, with the verified profile in hand.', ...scene('showroom'), loc: 'RENAULT KIRTI NAGAR · NEW DELHI · MON 19 OCT · 9:17 PM' },
    { c: 3, label: 'Car + consultant', eb: 'FreeStand Dealer app · 9:18 PM', h: 'Consultant, demo car and slot in one tap', p: 'The lead lands in the dealer DMS with a brief for Ranjan.', split: () => dealerPhone('assign'), panel: allocationPanel, panelDelay: 900, wait: ['🗓️', 'Dealer handover', 'Renault Kirti Nagar', 'Assigning a consultant and a demo car…'] },
    { c: 4, label: 'WhatsApp confirmation', eb: 'WhatsApp · Mon 9:18 PM', h: 'Shubham gets his confirmation within 2 minutes', p: 'Reminders, the AI call and fallbacks are scheduled automatically.', wa: [18, 19], panel: commsPanel, panelAt: 18 },
    { c: 4, label: 'AI call', eb: 'Office · Gurugram · Tue 20 Oct · 5:42 PM', h: 'The evening before, an AI call confirms the slot', p: 'Aria speaks Hinglish, moves the slot to 11:30 and briefs the dealer. Nobody at the showroom picks up a phone.', ...scene('call'), loc: 'OFFICE · CYBER CITY, GURUGRAM · TUE 20 OCT · 5:42 PM' },
    { c: 4, label: 'Call outcome', eb: 'AI voice call · 5:42 PM', h: 'Every call becomes data for the dealer', p: 'The new time, the co-passenger and the exchange question go straight to Ranjan.', split: () => callPhone(), panel: callPanel, panelDelay: 0, live: 'call' },
    { c: 4, label: 'Day-of tracking', eb: 'WhatsApp · Wed 21 Oct · 11:18 AM', h: 'No “where are you?” calls on the day', p: 'The rescheduled time, the consultant’s live location and a handover code arrive on WhatsApp.', wa: [19, 24], panel: trackPanel, panelAt: 22, wait: ['📍', 'Day-of tracking', 'Wed 21 Oct', 'Waiting for the consultant to leave…'] },
    { c: 4, label: 'Handover', eb: 'Vishal Enclave · Wed 21 Oct · 11:34 AM', h: 'Keys handed over at the gate', p: 'The handover code starts the drive and the licence is re-checked against the verified copy.', ...scene('drive'), loc: 'VISHAL ENCLAVE · RAJOURI GARDEN · WED 21 OCT · 11:34 AM' },
    { c: 4, label: 'Feedback', eb: 'WhatsApp · Wed 1:05 PM', h: 'From drive to quote in 90 minutes', p: 'Feedback, an indicative price and the next step, with the dealer kept in the loop.', wa: [24, 30], panel: outcomePanel, panelAt: 29, wait: ['🏁', 'Test-drive outcome', P.lead, 'Waiting for feedback…'] },
    { c: 5, label: 'Analytics', eb: 'FreeStand Studio · programme view', h: 'The whole programme, from ad to booking', p: 'Where leads were stopped, how fast dealers accepted and how many drives became bookings (demo data).', render: analytics },
    { c: 5, label: 'Thank you', eb: 'Renault × FreeStand', h: 'Every test drive verified, routed and confirmed', p: 'Booking, validation, dealer fulfilment and AI-led confirmation for Renault, on FreeStand.', render: thanks },
  ];

  // ───────────────────────────── live sequencing ─────────────────────────────
  let gen = 0; // bumps on every step change: stale timers and chat loops stop
  const sleep = (ms, g) => new Promise((res, rej) => setTimeout(() => (g === gen ? res() : rej('stale')), ms));
  const later = (ms, fn) => { const g = gen; setTimeout(() => g === gen && fn(), ms); };
  const scrollChat = () => { const b = $$('#wabody'); if (b) b.scrollTo({ top: b.scrollHeight, behavior: 'smooth' }); };

  function revealPanel(s) {
    const p = $$('#panel');
    if (p) p.outerHTML = s.panel();
  }

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
          // the tap on the option he picked, in the message before
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
      state.textContent = 'Official business account';
      nudge();
    } catch (e) { if (e !== 'stale') console.error(e); }
  }

  function runLive(s) {
    if (s.wa) return playChat(s);
    if (s.panel && s.panelDelay > 0) later(s.panelDelay, () => revealPanel(s));
    else if (s.panel) revealPanel(s);
    if (s.live === 'race') {
      let left = 14 * 60 + 59;
      const g = gen;
      const tick = setInterval(() => {
        if (g !== gen) return clearInterval(tick);
        left -= 1;
        const cd = $$('#cd');
        if (cd) cd.textContent = `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')} left`;
      }, 1000);
      later(2600, () => {
        const a = $$('#accept');
        if (a) { a.classList.add('cta', 'press'); }
      });
      later(3200, () => {
        const a = $$('#accept'), tp = $$('#leadtp'), pass = $$('#pass');
        if (a) { a.className = 'btn green'; a.textContent = '✓ Accepted · lead is yours'; }
        if (pass) pass.style.visibility = 'hidden';
        if (tp) { tp.style.background = '#16a34a'; tp.innerHTML = '<span>✓ YOU WON THIS LEAD</span><span class="mono">1 m 48 s</span>'; }
        const r1 = $$('#r1');
        if (r1) { r1.style.border = '2px solid #16a34a'; r1.style.background = '#f6fcf8'; r1.querySelector('.chip2').className = 'chip2 green'; r1.querySelector('.chip2').textContent = 'ACCEPTED'; r1.querySelector('.nb').style.background = '#16a34a'; r1.querySelector('.sub').textContent = '3.2 km · Ranjan Mehta accepted in 1 m 48 s'; }
        const ev = $$('#evlog');
        if (ev) ev.insertAdjacentHTML('beforeend', `<div class="in" style="display:flex;gap:12px;font-size:12px;padding:5px 0"><span class="mono" style="color:#94a3b8;width:66px">9:17:52</span><span><b>Kirti Nagar accepted · lead locked</b></span></div>`);
        const race = $$('#race');
        if (race) race.textContent = 'WON IN 1:48';
      });
      later(4300, () => {
        ['#r2', '#r3'].forEach((id) => { const r = $$(id); if (r) { r.style.opacity = '.6'; r.querySelector('.chip2').className = 'chip2'; r.querySelector('.chip2').textContent = 'WITHDRAWN'; } });
        const ev = $$('#evlog');
        if (ev) ev.insertAdjacentHTML('beforeend', `<div class="in" style="display:flex;gap:12px;font-size:12px;padding:5px 0"><span class="mono" style="color:#94a3b8;width:66px">9:17:53</span><span>Offer withdrawn from 2 dealers · full profile unlocked</span></div>`);
        const st = $$('#panel .ph .st');
        if (st) st.innerHTML = '<i></i>LOCKED', (st.style.color = '#16a34a');
        nudge();
      });
    }
    if (s.live === 'call') {
      let t = 0;
      const g = gen;
      const tick = setInterval(() => {
        if (g !== gen) return clearInterval(tick);
        t = Math.min(t + 1, 52);
        const el = $$('#calltime');
        if (el) el.textContent = `00:${String(t).padStart(2, '0')}`;
      }, 190);
      later(9600, nudge);
    }
    if (!s.wa && !s.live) later(s.panelDelay ? s.panelDelay + 1500 : 2600, nudge);
  }
  function nudge() { $('#next')?.classList.add('pulse'); }

  // ───────────────────────────── render ─────────────────────────────
  const canvas = $('#canvas');
  const KEY = 'renault-td-step';
  let idx = 0;
  try { const h = parseInt((location.hash.match(/\d+/) || [])[0], 10); idx = h ? h - 1 : parseInt(localStorage.getItem(KEY) || '0', 10) || 0; } catch (e) {}
  idx = Math.min(Math.max(0, idx), STEPS.length - 1);

  function slideHTML(s) {
    if (s.render) return s.render();
    if (s.kind === 'scene') return `<div class="scene"><div class="loc">${s.loc.split(' · ').join('<i>·</i>')}</div><div class="art">${D.scenes[s.name]}</div><div class="illus">ILLUSTRATIVE</div></div>`;
    const phone = s.wa ? waPhone(s.wa[0]) : s.split();
    const panel = s.wait ? waitPanel(...s.wait) : '<div class="panel" id="panel"></div>';
    return `<div class="split">${phone}${panel}</div>`;
  }

  function draw(prev) {
    gen++;
    const s = STEPS[idx];
    // slide transition
    canvas.querySelectorAll('.slide:not(.leave)').forEach((old) => { old.classList.add('leave'); setTimeout(() => old.remove(), 220); });
    const el = document.createElement('div');
    el.className = 'slide enter';
    el.innerHTML = slideHTML(s);
    canvas.appendChild(el);
    cur = el;
    const wb = el.querySelector('#wabody');
    if (wb) wb.scrollTop = wb.scrollHeight;
    // chapter banner when a new chapter starts going forward
    if (prev !== undefined && prev < idx && STEPS[prev].c !== s.c && CH[s.c].banner) {
      const b = document.createElement('div');
      b.className = 'banner';
      b.innerHTML = `<b>${CH[s.c].n} · ${CH[s.c].t.toUpperCase()}</b>${CH[s.c].banner}`;
      $('#stage').appendChild(b);
      setTimeout(() => b.remove(), 3300);
    }
    // head
    $('#head').innerHTML = `<div class="hx"><div class="eb"><b>${CH[s.c].n}</b> · ${CH[s.c].t} · ${s.eb}</div><h1>${s.h}</h1><p>${s.p}</p></div>`;
    renderRail();
    // bar
    $('#prev').disabled = idx === 0;
    const nx = $('#next');
    nx.disabled = idx === STEPS.length - 1;
    nx.classList.remove('pulse');
    nx.textContent = idx === 0 ? 'Start →' : 'Next →';
    $('#upnext').innerHTML = idx < STEPS.length - 1 ? `Up next<b>${STEPS[idx + 1].label}</b>` : '';
    document.querySelectorAll('.chips-bar button').forEach((b) => { const k = +b.dataset.c; b.className = k === s.c ? 'on' : k < s.c ? 'done' : ''; });
    $('#counter').innerHTML = `<b>${idx + 1} / ${STEPS.length}</b> · ${CH[s.c].t}<br>${s.label}`;
    try { localStorage.setItem(KEY, String(idx)); history.replaceState(null, '', `#${idx + 1}`); } catch (e) {}
    const sb = el.querySelector('#startbtn');
    if (sb) sb.addEventListener('click', () => go(idx + 1));
    runLive(s);
  }

  function renderRail() {
    const s = STEPS[idx];
    $('#chapters').innerHTML = CH.map((c, k) => {
      const first = STEPS.findIndex((x) => x.c === k);
      const list = k === s.c && STEPS.filter((x) => x.c === k).length > 1
        ? `<div class="steps">${STEPS.map((x, i) => (x.c === k ? `<div data-i="${i}" class="${i === idx ? 'cur' : i < idx ? 'past' : ''}"><i></i>${x.label}</div>` : '')).join('')}</div>`
        : '';
      return `<div class="chap ${k === s.c ? 'on' : k < s.c ? 'done' : ''}" data-i="${first}"><div class="n">${k < s.c ? '✓' : c.n}</div><div><div class="t">${c.t}</div><div class="s">${c.s}</div></div>${list}</div>`;
    }).join('');
    $('#chapters').querySelectorAll('[data-i]').forEach((e) => e.addEventListener('click', (ev) => { ev.stopPropagation(); go(+e.dataset.i); }));
  }

  function go(i) { const n = Math.min(Math.max(0, i), STEPS.length - 1); if (n === idx) return; const p = idx; idx = n; draw(p); }

  $('#chipsbar').innerHTML = CH.slice(1, 5).map((c, k) => `<button data-c="${k + 1}"><i>${c.n.slice(1)}</i>${c.t.split(' &')[0]}</button>`).join('');
  $('#chipsbar').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => go(STEPS.findIndex((x) => x.c === +b.dataset.c))));
  $('#prev').addEventListener('click', () => go(idx - 1));
  $('#next').addEventListener('click', () => go(idx + 1));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { go(idx + 1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { go(idx - 1); e.preventDefault(); }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(STEPS.length - 1);
  });

  // fit the 1280 × 800 canvas to the stage, as large as it goes
  function fit() {
    const st = $('#stage');
    const k = Math.min(st.clientWidth / 1280, st.clientHeight / 800);
    const w = 1280 * k, h = 800 * k;
    const fr = $('#frame');
    fr.style.width = `${w}px`;
    fr.style.height = `${h}px`;
    fr.style.left = `${(st.clientWidth - w) / 2}px`;
    fr.style.top = `${(st.clientHeight - h) / 2}px`;
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

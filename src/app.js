/* Citroën Basalt X test-drive demo: booking → validation → dealer fulfilment → confirmation & AI calling.
   Vanilla JS; scenes, avatars and car drawings are pre-rendered at build time into window.__DATA. */
(function () {
  const D = window.__DATA;
  const RED = '#da291c';

  // ───────────────────────────── helpers ─────────────────────────────
  const chev = (size = 16, col = '#fff') => {
    const w = size / 2, t = Math.max(1.4, w * 0.34);
    const v = (dy) => `<path d="M${-w} ${dy + w * 0.42}L0 ${dy - w * 0.08}L${w} ${dy + w * 0.42}" fill="none" stroke="${col}" stroke-width="${t}" stroke-linecap="square"/>`;
    return `<svg width="${size}" height="${size}" viewBox="${-w * 1.15} ${-w * 1.05} ${w * 2.3} ${w * 2.1}">${v(-w * 0.42)}${v(w * 0.36)}</svg>`;
  };
  const ph = (icon, title, sub, st = 'LIVE', col) =>
    `<div class="ph"><div class="ic">${icon}</div><div><div class="tt">${title}</div><div class="ss">${sub}</div></div><div class="st"><i style="${col ? `background:${col}` : ''}"></i>${st}</div></div>`;
  const chk = (t, s, v = '', cls = '', d = 0) =>
    `<div class="chk ${cls} in" style="animation-delay:${d}s"><div class="d">${cls === 'wait' ? '…' : cls === 'off' ? '–' : cls === 'info' ? 'i' : '✓'}</div><div><div class="t">${t}</div>${s ? `<div class="s">${s}</div>` : ''}</div>${v ? `<div class="v">${v}</div>` : ''}</div>`;
  const chips = (arr) => `<div class="chips">${arr.map((c) => (typeof c === 'string' ? `<span class="chip2">${c}</span>` : `<span class="chip2 ${c[1]}">${c[0]}</span>`)).join('')}</div>`;
  const note = (i, html) => `<div class="note"><div class="i">${i}</div><div>${html}</div></div>`;
  const av = (k, sz) => `<div class="av" style="width:${sz}px;height:${sz}px">${D.avatars[k]}</div>`;
  const stepnote = (chip, html, red) => `<div class="stepnote"><span class="chip ${red ? 'red' : ''}">${chip}</span><span>${html}</span></div>`;

  // ───────────────────────────── the persona and the facts ─────────────────────────────
  const P = {
    name: 'Shubham Kohli', phone: '+91 98374 92834', masked: '98XXX XX834', email: 'shubham.kohli@gmail.com',
    addr: 'C-42, 2nd Floor, Vishal Enclave, Rajouri Garden, New Delhi 110027', lead: 'LD-26-10419',
  };

  // ───────────────────────────── WhatsApp thread ─────────────────────────────
  const dlThumb = `<svg class="dlimg" viewBox="0 0 210 132"><rect width="210" height="132" rx="8" fill="#e9eef7"/><rect width="210" height="24" rx="8" fill="#2c4a8a"/><rect y="16" width="210" height="8" fill="#2c4a8a"/><text x="10" y="16" font-size="8.5" font-weight="800" fill="#fff" letter-spacing=".6">INDIAN UNION DRIVING LICENCE</text><text x="200" y="16" text-anchor="end" font-size="7.5" font-weight="700" fill="#cfe0ff">DELHI</text><rect x="10" y="32" width="52" height="64" rx="3" fill="#cbd5e1"/><g transform="translate(10 32)"><svg width="52" height="64">${D.avatars.shubhamPlain}</svg></g><text x="72" y="42" font-size="7" fill="#64748b">DL No.</text><text x="72" y="53" font-size="9.5" font-weight="800" fill="#111">DL04 20180012345</text><text x="72" y="67" font-size="7" fill="#64748b">Name</text><text x="72" y="77" font-size="9" font-weight="700" fill="#111">SHUBHAM KOHLI</text><text x="72" y="91" font-size="7" fill="#64748b">DOB 14-08-1994 · Valid till 11-03-2038</text><text x="10" y="112" font-size="7.5" fill="#334155">Class: LMV-NT · MCWG</text><text x="10" y="123" font-size="7" fill="#64748b">Issued: RTO Janakpuri (DL04) · 12-03-2018</text><circle cx="182" cy="108" r="14" fill="none" stroke="#c49a2c" stroke-width="2"/><text x="182" y="111" text-anchor="middle" font-size="6" font-weight="800" fill="#c49a2c">INDIA</text></svg>`;
  const miniMap = (o = {}) => `<svg viewBox="0 0 220 110" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><rect width="220" height="110" fill="#eef1f4"/><path d="M0 62H220M120 0V110M0 18C80 30 150 6 220 26" stroke="#fff" stroke-width="9"/><path d="M20 110C70 70 120 60 220 40" stroke="#fff" stroke-width="7"/><rect x="20" y="70" width="50" height="30" fill="#d7ebd5"/>${o.route ? `<path d="M40 30C80 44 110 50 150 58" stroke="${RED}" stroke-width="4" fill="none" stroke-dasharray="7 5" class="flow"/><rect x="${o.car ?? 92}" y="38" width="22" height="12" rx="4" fill="#1b1d22"/><circle cx="40" cy="30" r="6" fill="#1b1d22"/>` : ''}<circle cx="150" cy="58" r="16" fill="#2563eb" opacity=".18" class="pulse"/><circle cx="150" cy="58" r="7" fill="#2563eb" stroke="#fff" stroke-width="3"/></svg>`;

  const card = (rows) => `<div class="wacard"><div style="background:#1b1d22;color:#fff;padding:9px 11px;display:flex;align-items:center;gap:8px"><span style="width:26px;height:26px;border-radius:6px;background:${RED};display:grid;place-items:center">${chev(15)}</span><b style="font-size:12px;letter-spacing:.4px">${rows.title}</b></div><div style="padding:6px 11px 2px;background:#fff;font-size:11.5px;line-height:1.55">${rows.body}</div></div>`;

  const WA = [
    { div: 'MON 19 OCT' },
    { sys: '🔒 This business uses a secure service from Meta to manage this chat. Tap to learn more.' },
    { bot: 'Hi Shubham 👋 Thanks for booking a <b>Basalt X</b> test drive with Citroën.\n\nTo keep every drive safe, we verify a few details before a dealer is assigned. It takes about a minute.', t: '9:13 PM' },
    { bot: '<b>Step 1 of 3 · Driving licence</b>\nPlease upload a clear photo of the front of your DL.', opts: ['📎 Upload driving licence'], picked: 0, t: '9:13 PM' },
    { user: dlThumb, t: '9:13 PM' },
    { bot: '✅ <b>Driving licence verified</b>\nDL04 2018 0012345 · LMV · valid till 2038', t: '9:13 PM' },
    // credit
    { bot: '<b>Step 2 of 3 · Finance check</b> (optional)\nShare your PAN for a soft credit check. It <b>does not</b> affect your credit score and unlocks pre-approved finance at your test drive.', opts: ['Share PAN', 'Skip for now'], picked: 0, t: '9:14 PM' },
    { user: 'AFZPK7190K', t: '9:14 PM' },
    { bot: '✅ You’re <b>pre-approved</b> for car finance up to <b>₹12.5 lakh</b>.\nYour dealer only sees that you’re finance-ready, never your score.', t: '9:14 PM' },
    // address
    { bot: '<b>Step 3 of 3 · Address</b>\nYour test drive is <b>at home</b> 🏠 Where should we bring the car?', opts: ['📍 Share location', 'Type address'], picked: 0, t: '9:14 PM' },
    { user: `<div class="locimg">${miniMap()}</div><div style="font-size:11px;margin-top:4px">📍 Rajouri Garden, New Delhi</div>`, t: '9:15 PM' },
    { user: 'C-42, 2nd Floor, Vishal Enclave, Rajouri Garden, New Delhi 110027', t: '9:15 PM' },
    { bot: '✅ Address confirmed. 3 Citroën dealers are within 8 km of you.', t: '9:15 PM' },
    // intent
    { bot: 'Two quick questions so your consultant comes prepared.\n\nDo you own a car today?', opts: ['Yes', 'No'], picked: 0, t: '9:15 PM' },
    { user: 'Yes, Maruti Swift (2017)', t: '9:15 PM' },
    { bot: 'When are you planning to buy?', opts: ['This month', 'In 1–3 months', 'Just exploring'], picked: 0, t: '9:16 PM' },
    { user: 'This month', t: '9:16 PM' },
    { bot: 'Thanks Shubham! We’re finding the nearest dealer for you. Confirmation in a few minutes ⏳', t: '9:16 PM' },
    // confirmation
    { bot: card({ title: 'TEST DRIVE CONFIRMED ✅', body: '<b>Basalt X · Max Turbo AT</b><br>📅 Wed 21 Oct · <b>11:00 AM</b><br>🏠 At home · Vishal Enclave, C Block<br>👤 Ranjan Mehta, Sales Consultant<br>🏢 La Maison Citroën, Kirti Nagar<br>🚗 Demo car DL 12 DE 0987' }) + 'Please keep your <b>original DL</b> handy. We’ll call you a day before to confirm.', opts: ['📅 Add to calendar', '🔁 Reschedule', '📞 Call Ranjan'], t: '9:18 PM' },
    { div: 'TUE 20 OCT' },
    { bot: '🔁 <b>Updated after your call with Aria</b>\nYour test drive is now <b>Wed 21 Oct · 11:30 AM</b>. Ranjan will call you at 11:15 AM.', t: '5:43 PM' },
    { div: 'WED 21 OCT' },
    { bot: 'Good morning Shubham! 🚗 <b>Ranjan is on his way</b> with your Basalt X.' + `<div style="margin:8px -5px 4px;border-radius:8px;overflow:hidden;height:110px">${miniMap({ route: true })}</div>` + '📍 Live location · <b>ETA 9 min</b>', t: '11:18 AM' },
    { bot: '🔐 Your handover code is <b>4831</b>.\nShare it with Ranjan when he arrives, and the drive starts.', t: '11:18 AM' },
    { div: 'TODAY · 1:05 PM' },
    { bot: 'Hope you enjoyed the Basalt X, Shubham! How was your test drive?', opts: ['😍 Loved it', '🙂 It was good', '😐 Not for me'], picked: 0, t: '1:05 PM' },
    { user: '😍 Loved it', t: '1:06 PM' },
    { bot: 'Brilliant! What would you like to do next?', opts: ['💰 On-road price', '📝 Book for ₹11,000', '📞 Talk to Ranjan'], picked: 0, t: '1:06 PM' },
    { user: '💰 On-road price', t: '1:06 PM' },
    { bot: card({ title: 'YOUR BASALT X · INDICATIVE', body: 'Max Turbo AT · Delhi on-road <b>₹15.2 lakh*</b><br>Swift (2017) exchange estimate <b>₹3.1–3.6 lakh</b><br>Pre-approved finance · EMI from <b>₹21,400/mo</b>' }) + '<span style="font-size:10px;color:#8a9499">*Demo figures. Ranjan will share the final quote.</span>', opts: ['📝 Book for ₹11,000'], t: '1:07 PM' },
  ];
  const waEnd = { dl: 6, credit: 9, addr: 13, intent: 18, confirm: 19, day: 24, fb: 30 };

  function waPhone(upto, prevUpto) {
    const msgs = WA.slice(0, upto)
      .map((m, i) => {
        const isNew = i >= prevUpto;
        const st = isNew ? `class="in" style="animation-delay:${Math.min((i - prevUpto) * 0.18, 1.2)}s"` : '';
        if (m.div) return `<div ${st}><div class="div"><span>${m.div}</span></div></div>`;
        if (m.sys) return `<div ${st}><div class="sysm"><span>${m.sys}</span></div></div>`;
        if (m.user) return `<div ${st}><div class="msg u"><div class="b">${m.user}<span class="tm">${m.t} ✓✓</span></div></div></div>`;
        const picked = m.picked !== undefined && i + 1 < upto ? m.picked : -1;
        return `<div ${st}><div class="msg"><div class="b">${m.bot}<span class="tm">${m.t}</span>${m.opts ? `<div class="opts">${m.opts.map((o, k) => `<div class="${k === picked ? 'pk' : ''}">${o}</div>`).join('')}</div>` : ''}</div></div></div>`;
      })
      .join('');
    return `<div class="phone wa"><div class="status"><span>9:41</span><i>5G ▮▮▮ 92%</i></div><div class="hd"><span style="font-size:18px">‹</span><div class="lg">${chev(20)}</div><div><div class="n">Citroën India <img src="${D.img.badge}" alt=""></div><div class="o">Official business account</div></div><div class="ac"><span>📹</span><span>📞</span><span>⋮</span></div></div><div class="body" id="wabody">${msgs}</div><div class="foot"><span style="opacity:.5">😊</span><div class="in2">Message</div><span style="opacity:.5">📎</span><div class="mic">🎤</div></div></div>`;
  }

  // ───────────────────────────── website (booking) ─────────────────────────────
  function sitePhone(mode) {
    const filled = mode !== 'empty';
    const form = `
      <div class="hero"><div class="k">BOOK A TEST DRIVE</div><div class="h">BASALT X</div><div class="s">Coupé SUV · 1.2 Turbo · 6-speed automatic</div>${D.car.red}</div>
      <div class="form">
        <div class="fl">Variant</div><div class="seg"><div>Plus Turbo<small>Manual</small></div><div class="on">Max Turbo AT<small>Automatic</small></div></div>
        <div class="fl">Where</div><div class="seg"><div class="on">🏠 At home</div><div>🏢 At showroom</div></div>
        <div class="fl">When</div><div class="seg"><div>Tue<small>20 Oct</small></div><div class="on">Wed<small>21 Oct</small></div><div>Thu<small>22 Oct</small></div><div>Sat<small>24 Oct</small></div></div>
        <div class="seg" style="margin-top:6px"><div>10:00</div><div class="on">11:00</div><div>14:00</div><div>17:00</div></div>
        <div class="fl">Your details</div>
        <div class="inp ${filled ? 'ok' : ''}">${filled ? 'Shubham Kohli' : '<span class="pre">Full name</span>'}${filled ? '<span class="tick">✓</span>' : ''}</div>
        <div style="display:flex;gap:6px;margin-top:6px"><div class="inp ${filled ? 'ok' : ''}" style="flex:1.6"><span class="pre">+91</span>${filled ? '98374 92834' : ''}</div><div class="inp ${filled ? 'ok' : ''}" style="flex:1"><span class="pre">PIN</span>${filled ? '110027' : ''}</div></div>
        <div class="cons"><div class="bx">✓</div><div>I agree to be contacted by Citroën and its dealers on WhatsApp, SMS and calls about my test drive. <u>Privacy notice</u></div></div>
        <div class="cta">BOOK MY TEST DRIVE</div>
      </div>`;
    const otp =
      mode === 'otp'
        ? `<div class="dim"></div><div class="sheet"><div style="font-size:16px;font-weight:800">Verify your mobile</div><div style="font-size:11.5px;color:#6b7280;margin-top:3px">Enter the 6-digit code sent to +91 98374 92834</div><div class="otp">${'481902'.split('').map((c) => `<div class="f">${c}</div>`).join('')}</div><div style="display:flex;align-items:center;gap:8px;font-size:12px;color:#16a34a;font-weight:700;margin:4px 0 12px">✓ Number verified · auto-read from SMS</div><div class="cta" style="margin-top:0;background:#25d366">Continue on WhatsApp →</div><div style="font-size:10px;color:#6b7280;text-align:center;margin-top:8px">We’ll finish 3 quick checks on WhatsApp before assigning your dealer.</div></div>`
        : '';
    return `<div class="phone br"><div class="status"><span>9:13</span><i>5G ▮▮▮ 92%</i></div><div class="url"><div>🔒 citroen.in/basalt-x/test-drive</div></div><div class="site-hd"><div class="w">${chev(18, '#111')} CITROËN</div><span style="font-size:18px">☰</span></div><div class="site">${form}${otp}</div></div>`;
  }

  // ───────────────────────────── dealer app ─────────────────────────────
  function dealerPhone(mode) {
    const head = `<div class="status"><span>9:17</span><i>5G ▮▮▮ 71%</i></div><div class="hd"><div class="a"><img src="${D.img.fsApp}" alt=""><div><div class="n">FreeStand Dealer</div><div class="o">La Maison Citroën · Kirti Nagar · Ranjan M.</div></div><span style="margin-left:auto;font-size:15px">🔔</span></div></div>`;
    let body;
    if (mode === 'offer') {
      body = `<div style="font-size:10.5px;font-weight:800;letter-spacing:1.4px;color:#5b6474;margin:2px 2px 8px">NEW TEST-DRIVE LEAD</div>
      <div class="lead"><div class="tp"><span>⚡ OFFERED TO 3 DEALERS</span><span class="mono">14:12 left</span></div><div class="in3">
        <div style="display:flex;gap:12px;align-items:center"><div class="grade">A</div><div><div style="font-size:15px;font-weight:800">Shubham K. · ${P.masked}</div><div style="font-size:11.5px;color:#5b6474">Rajouri Garden · <b>3.2 km</b> from you</div></div></div>
        <div style="margin:12px 0 4px;padding:10px;border-radius:8px;background:#f6f7f9;font-size:12px;line-height:1.7"><b>Basalt X · Max Turbo AT</b><br>🏠 Home test drive · Wed 21 Oct · 11:00 AM<br>🔁 Exchange: Maruti Swift 2017<br>🗓️ Buying: this month</div>
        <div class="chips" style="margin:10px 0 12px"><span class="chip2 green">DL verified</span><span class="chip2 green">Finance-ready</span><span class="chip2 green">Address 94/100</span><span class="chip2">Instagram ad</span></div>
        <div class="btn red">Accept test drive</div><div class="btn ghost" style="margin-top:7px;height:38px">Pass</div>
      </div></div>
      <div style="font-size:10.5px;color:#6b7280;margin-top:10px;line-height:1.5">Full name, number and address unlock once you accept. If another dealer accepts first, this offer closes.</div>`;
    } else {
      body = `<div style="display:flex;align-items:center;gap:8px;margin:0 2px 10px"><span class="chip2 green">✓ Accepted · 1 m 48 s</span><span style="font-size:11px;color:#5b6474">${P.lead}</span></div>
      <div class="card" style="padding:12px;margin-bottom:10px"><div style="display:flex;gap:10px;align-items:center">${av('shubham', 44)}<div><div style="font-weight:800;font-size:14px">${P.name}</div><div style="font-size:11.5px;color:#5b6474">${P.phone}</div></div><span style="margin-left:auto;font-size:18px">📞</span></div><div style="font-size:11px;color:#5b6474;margin-top:8px;line-height:1.45">${P.addr}</div></div>
      <div class="fl" style="margin-top:0">Consultant</div>
      <div class="opt on"><div class="rd"></div>${av('ranjan', 32)}<div><div style="font-size:12.5px;font-weight:700">Ranjan Mehta</div><div style="font-size:10.5px;color:#6b7280">Free 10:30–12:30 · 4.8★</div></div></div>
      <div class="opt"><div class="rd"></div><div><div style="font-size:12.5px;font-weight:700">Neha Arora</div><div style="font-size:10.5px;color:#6b7280">Showroom duty till 1 PM</div></div></div>
      <div class="fl">Demo car</div>
      <div class="opt on"><div class="rd"></div><div style="width:70px">${D.car.whiteSmall}</div><div><div style="font-size:12.5px;font-weight:700">DL 12 DE 0987</div><div style="font-size:10.5px;color:#6b7280">Max Turbo AT · Polar White · fuel ¾</div></div></div>
      <div class="fl">Slot</div><div class="seg"><div class="on">Wed 21 Oct · 11:00 AM</div></div>
      <div class="btn dark" style="margin-top:12px">Confirm & notify customer</div>`;
    }
    return `<div class="phone dl">${head}<div class="bd">${body}</div></div>`;
  }

  // ───────────────────────────── AI call phone ─────────────────────────────
  function callPhone() {
    let bars = '';
    for (let i = 0; i < 34; i++) bars += `<i style="display:inline-block;width:4px;margin:0 1.5px;border-radius:2px;background:#22c55e;height:${8 + ((i * 37) % 30)}px;animation:wbar .9s ${(i % 7) * 0.11}s ease-in-out infinite"></i>`;
    return `<div class="phone call"><div class="status"><span>5:42</span><i>5G ▮▮▮ 64%</i></div>
      <div style="text-align:center;padding-top:58px"><div style="width:96px;height:96px;margin:0 auto;border-radius:24px;background:${RED};display:grid;place-items:center;box-shadow:0 0 0 10px rgba(218,41,28,.18)">${chev(54)}</div>
      <div style="font-size:22px;font-weight:700;margin-top:22px">Citroën India</div><div style="font-size:12.5px;color:#c9ced6;margin-top:4px">Test-drive desk · AI assistant “Aria”</div>
      <div style="display:inline-flex;align-items:center;gap:6px;margin-top:10px;font-size:11px;background:rgba(255,255,255,.1);padding:5px 10px;border-radius:999px">✓ Verified caller · Truecaller &amp; CNAP</div>
      <div style="font-size:30px;font-weight:300;margin-top:30px;font-variant-numeric:tabular-nums">00:52</div>
      <div style="height:44px;display:flex;align-items:center;justify-content:center;margin-top:18px">${bars}</div>
      <div style="font-size:11px;color:#c9ced6;margin-top:10px">🔴 This call is recorded for quality. Consent given.</div></div>
      <div style="position:absolute;left:0;right:0;bottom:150px;display:flex;justify-content:space-around;padding:0 40px">${['🔇|Mute', '⌨️|Keypad', '🔊|Speaker'].map((x) => { const [a, b] = x.split('|'); return `<div style="text-align:center;font-size:10.5px;color:#c9ced6"><div style="width:58px;height:58px;border-radius:50%;background:rgba(255,255,255,.12);display:grid;place-items:center;font-size:20px;margin-bottom:6px">${a}</div>${b}</div>`; }).join('')}</div>
      <div style="position:absolute;left:50%;bottom:56px;transform:translateX(-50%);width:68px;height:68px;border-radius:50%;background:#ef4444;display:grid;place-items:center;font-size:26px;transform:translateX(-50%) rotate(135deg)">📞</div></div>`;
  }

  // ───────────────────────────── panels ─────────────────────────────
  function profilePanel(s) {
    const field = (k, v, ok, d) => `<div class="k">${k}</div><div class="v ${v ? 'in' : ''}" style="animation-delay:${d}s">${v ? v + (ok ? ' <span style="color:#16a34a">✓</span>' : '') : '<span style="display:inline-block;width:220px;height:10px;border-radius:5px;background:#eef0f3;vertical-align:middle"></span>'}</div>`;
    return `<div class="panel">${ph('👤', 'Customer profile', `${P.lead} · Citroën India · Basalt X test drive`, 'SYNCED')}
      <div class="pb">
        <div style="display:flex;gap:22px">${av('shubham', 150)}
          <div style="flex:1"><div class="sec">Personal details</div><div class="kv">
            ${field('Name', 'Shubham Kohli', false, 0.1)}${field('Mobile', s.phone ? P.phone : '', s.otp, 0.2)}${field('Email', s.email ? P.email : '', false, 0.3)}${field('PIN code', '110027 · Rajouri Garden', false, 0.4)}${field('Address', s.addr ? P.addr : '', true, 0.5)}
          </div></div></div>
        <div class="grid2" style="margin-top:22px">
          <div><div class="sec">Booking</div><div class="card" style="font-size:12.5px;line-height:1.85"><b>Basalt X · Max Turbo AT</b><br>🏠 At home · Wed 21 Oct · 11:00 AM<br>📣 Source: Instagram ad · <span class="mono" style="font-size:11px">basaltx_td_delhi</span><br>📱 Android · Chrome · Hindi/English</div></div>
          <div><div class="sec">Relevant cohorts</div>${chips(s.cohorts)}</div>
        </div>
        <div class="sec" style="margin-top:20px">Validation <span class="r">${s.score || ''}</span></div>
        ${s.checks.map((c, i) => chk(c[0], c[1], c[2], c[3], 0.2 + i * 0.12)).join('')}
      </div></div>`;
  }

  function leadCapturedPanel() {
    return `<div class="panel">${ph('📥', 'Lead captured', 'Citroën website → FreeStand · in real time', 'NEW', RED)}
      <div class="pb">
        <div style="display:flex;gap:14px;align-items:center;margin-bottom:16px"><div class="big mono" style="font-size:24px">${P.lead}</div><span class="chip2 amber">Unverified</span><span class="lbl" style="margin-left:auto">Mon 19 Oct · 9:13:06 PM</span></div>
        <div class="grid2">
          <div class="card"><div class="sec">Form fields</div><div class="kv" style="grid-template-columns:96px 1fr">
            <div class="k">Name</div><div class="v">Shubham Kohli</div><div class="k">Mobile</div><div class="v">+91 98374 92834</div><div class="k">PIN</div><div class="v">110027</div>
            <div class="k">Model</div><div class="v">Basalt X · Max Turbo AT</div><div class="k">Where</div><div class="v">At home</div><div class="k">Slot</div><div class="v">Wed 21 Oct · 11:00 AM</div></div></div>
          <div class="card"><div class="sec">Captured silently</div><div class="kv" style="grid-template-columns:96px 1fr">
            <div class="k">Source</div><div class="v">Instagram · paid</div><div class="k">Campaign</div><div class="v mono" style="font-size:12px">basaltx_td_delhi</div><div class="k">Creative</div><div class="v">“Coupé SUV · 60 s booking”</div>
            <div class="k">Device</div><div class="v">Android 15 · Chrome</div><div class="k">Session</div><div class="v">48 s on page · 2 variants viewed</div><div class="k">Consent</div><div class="v">WhatsApp · SMS · calls</div></div></div>
        </div>
        <div class="sec" style="margin-top:20px">Instant checks</div>
        ${chk('Duplicate check', 'No open test-drive lead for this number in the last 90 days', 'UNIQUE', '', 0.2)}
        ${chk('Serviceable PIN code', '110027 · 3 Citroën dealers within 8 km · home test drive available', '3 DEALERS', '', 0.35)}
        ${chk('Bot & spam screen', 'Human typing pattern · not a known dealer or agent number', 'PASS', '', 0.5)}
        ${chk('Mobile ownership', 'OTP sent to +91 98374 92834', 'PENDING', 'wait', 0.65)}
      </div></div>`;
  }

  function dlPanel() {
    return `<div class="panel">${ph('🪪', 'Driving licence verification', 'OCR + Parivahan (Sarathi) record match · 2.8 s', 'VERIFIED')}
      <div class="pb"><div style="display:grid;grid-template-columns:300px 1fr;gap:22px">
        <div><div style="border-radius:10px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.12)">${dlThumb.replace('class="dlimg"', 'width="300"')}</div>
          <div class="sec" style="margin-top:18px">Read from the photo</div>
          <div class="kv" style="grid-template-columns:96px 1fr;font-size:12.5px"><div class="k">DL number</div><div class="v mono">DL04 20180012345</div><div class="k">Name</div><div class="v">Shubham Kohli</div><div class="k">Date of birth</div><div class="v">14 Aug 1994 · 32 y</div><div class="k">Class</div><div class="v">LMV-NT, MCWG</div><div class="k">Valid till</div><div class="v">11 Mar 2038</div><div class="k">Issued by</div><div class="v">RTO Janakpuri (DL04)</div></div></div>
        <div><div class="sec">Checks</div>
          ${chk('Image quality', 'Sharp, uncropped, no glare · front side', '98%', '', 0.15)}
          ${chk('Tamper & screenshot check', 'Original photo · no edits or reused image', 'PASS', '', 0.3)}
          ${chk('Government record match', 'Parivahan Sarathi: DL active, details match', 'MATCH', '', 0.45)}
          ${chk('Name match with booking', '“SHUBHAM KOHLI” = “Shubham Kohli”', '100%', '', 0.6)}
          ${chk('Licence class allows the car', 'LMV-NT covers a 4-wheeler test drive', 'LMV', '', 0.75)}
          ${chk('Valid on the test-drive date', 'Wed 21 Oct 2026 · 11+ years left', 'VALID', '', 0.9)}
          ${chk('No suspension or endorsement', 'No active suspension on record', 'CLEAR', '', 1.05)}
          <div style="margin-top:14px">${note('🛡️', '<b>Why it matters:</b> the dealer’s insurance needs a valid licence before a demo car leaves the showroom. Unverified leads never reach a dealer.')}</div>
        </div></div></div></div>`;
  }

  function creditPanel() {
    const sc = 784, a = ((sc - 300) / 600) * 180;
    const r = 92, cx = 120, cy = 116;
    const pt = (deg) => [cx - r * Math.cos((deg * Math.PI) / 180), cy - r * Math.sin((deg * Math.PI) / 180)];
    const [ex, ey] = pt(a);
    const gauge = `<svg width="240" height="140" viewBox="0 0 240 140"><path d="M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}" stroke="#eef0f3" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M${cx - r} ${cy}A${r} ${r} 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#16a34a" stroke-width="18" fill="none" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" style="animation:dash2 1.1s .2s forwards"/><text x="${cx}" y="${cy - 12}" text-anchor="middle" font-size="40" font-weight="800" fill="#13203b">${sc}</text><text x="${cx}" y="${cy + 12}" text-anchor="middle" font-size="12" font-weight="700" fill="#16a34a">EXCELLENT</text><text x="${cx - r}" y="${cy + 22}" text-anchor="middle" font-size="10" fill="#8a93a3">300</text><text x="${cx + r}" y="${cy + 22}" text-anchor="middle" font-size="10" fill="#8a93a3">900</text></svg>`;
    return `<div class="panel">${ph('💳', 'Soft credit check', 'Consented bureau pull · no impact on the customer’s score', 'DONE')}
      <div class="pb"><div style="display:grid;grid-template-columns:270px 1fr;gap:24px">
        <div class="card" style="text-align:center">${gauge}<div class="lbl">CIBIL score · soft enquiry · 19 Oct 2026</div>
          <div style="text-align:left;margin-top:16px" class="kv"><div class="k">PAN</div><div class="v mono">AFZPK••90K</div><div class="k">Active loans</div><div class="v">1 · personal loan</div><div class="k">Missed EMIs</div><div class="v">0 in 24 months</div><div class="k">Utilisation</div><div class="v">22% of card limits</div></div></div>
        <div><div class="sec">What the platform derives</div>
          <div class="grid2" style="gap:10px">
            <div class="card"><div class="lbl">Pre-approved car finance</div><div class="big">₹12.5 L</div><div class="lbl">from 8.9% p.a. · 3 lender partners</div></div>
            <div class="card"><div class="lbl">Comfortable EMI</div><div class="big">₹24k/mo</div><div class="lbl">covers Max Turbo AT on 5-year finance</div></div>
          </div>
          <div style="margin-top:14px">${chk('Consent artefact recorded', 'Purpose: test-drive finance offer · valid 30 days', 'DPDP', '', 0.2)}${chk('Score band shared, not the score', 'Dealer sees “Finance-ready”; the number stays in the CDP', 'MASKED', '', 0.35)}${chk('Optional by design', 'Customers who skip are still verified; they’re graded on DL, address and intent', 'OPTIONAL', 'info', 0.5)}</div>
          <div class="sec" style="margin-top:14px">Cohorts added</div>${chips([['High credit', 'green new'], ['Finance-ready', 'green new'], ['EMI ≤ ₹25k', 'new']])}
        </div></div></div></div>`;
  }

  function addrPanel() {
    return `<div class="panel">${ph('🏠', 'Address quality', 'Parse → standardise → geocode → serviceability', 'SCORED')}
      <div class="pb"><div style="display:grid;grid-template-columns:1fr 250px;gap:22px">
        <div><div class="grid2" style="gap:10px">
          <div class="card"><div class="lbl">As typed</div><div style="font-size:12.5px;margin-top:6px;line-height:1.5">C-42, 2nd Floor, Vishal Enclave, Rajouri Garden, New Delhi 110027</div></div>
          <div class="card" style="border-color:#b7e2c6;background:#f6fcf8"><div class="lbl">Standardised</div><div style="font-size:12px;margin-top:6px;line-height:1.55" class="mono">FLAT C-42 · FLOOR 2<br>VISHAL ENCLAVE (C BLOCK)<br>RAJOURI GARDEN · WEST DELHI<br>DELHI 110027</div></div></div>
          <div class="sec" style="margin-top:16px">Checks</div>
          ${chk('PIN code ↔ locality', '110027 belongs to Rajouri Garden, West Delhi', 'MATCH', '', 0.15)}
          ${chk('House or flat number present', 'Flat C-42, floor 2 · a driver can find the door', 'YES', '', 0.3)}
          ${chk('Geocode confidence', 'Rooftop-level · 28.6449 N, 77.1210 E', '0.97', '', 0.45)}
          ${chk('Residential, not commercial or PG', 'Apartment society · gated', 'HOME', '', 0.6)}
          ${chk('Home test drive serviceable', '3 dealers within 8 km; nearest 3.2 km', '3 IN 8 KM', '', 0.75)}
          ${chk('Gate pass needed', 'Society security will ask for the visitor’s name; shared with the consultant', 'INFO', 'info', 0.9)}
        </div>
        <div><div class="card" style="text-align:center;padding:18px 12px"><div class="lbl">Address quality score</div><div class="big" style="font-size:52px;color:#16a34a">94</div><div class="lbl">out of 100 · deliverable</div><div class="bar" style="margin:12px 6px 0"><i style="width:94%"></i></div></div>
          <div style="height:150px;border-radius:10px;overflow:hidden;margin-top:12px;border:1px solid var(--line)">${miniMap()}</div>
          <div class="sec" style="margin-top:14px">Enriched</div>${chips([['Locality: high affluence', 'green new'], ['Apartment', 'new'], ['West Delhi', 'new']])}</div>
      </div></div></div>`;
  }

  function enrichedPanel() {
    const col = (t, ic, rows) => `<div class="card in" style="padding:12px 14px"><div class="sec" style="margin-bottom:8px">${ic} ${t}</div>${rows.map(([k, v]) => `<div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0"><span style="color:#8a93a3">${k}</span><b>${v}</b></div>`).join('')}</div>`;
    return `<div class="panel">${ph('⭐', 'Enriched lead', `${P.lead} · ready to route`, 'GRADE A')}
      <div class="pb">
        <div style="display:flex;gap:20px;align-items:center;margin-bottom:16px">
          ${av('shubham', 86)}<div><div style="font-size:20px;font-weight:800">Shubham Kohli</div><div style="font-size:12.5px;color:#5b6474">${P.phone} · Rajouri Garden 110027 · Basalt X Max Turbo AT</div>
          <div class="chips" style="margin-top:8px"><span class="chip2 green">OTP ✓</span><span class="chip2 green">WhatsApp ✓</span><span class="chip2 green">DL ✓</span><span class="chip2 green">Credit ✓</span><span class="chip2 green">Address ✓</span></div></div>
          <div style="margin-left:auto;text-align:center"><div style="width:96px;height:96px;border-radius:50%;background:conic-gradient(#16a34a 0 91%, #eef0f3 0);display:grid;place-items:center"><div style="width:74px;height:74px;border-radius:50%;background:#fff;display:grid;place-items:center"><div><div style="font-size:26px;font-weight:900;line-height:1">91</div><div style="font-size:10px;font-weight:800;color:#16a34a">GRADE A</div></div></div></div><div class="lbl" style="margin-top:4px">Lead score</div></div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
          ${col('Identity', '🪪', [['Mobile', 'OTP-verified'], ['Licence', 'Valid · LMV'], ['Fraud screen', 'Clear']])}
          ${col('Ability to buy', '💳', [['Credit band', 'Excellent'], ['Pre-approved', '₹12.5 L'], ['EMI comfort', '≤ ₹24k']])}
          ${col('Intent', '🎯', [['Buying', 'This month'], ['Mode', 'Home drive'], ['Source', 'Instagram ad']])}
          ${col('Location', '📍', [['Address score', '94 / 100'], ['Locality', 'High affluence'], ['Dealers ≤ 8 km', '3']])}
          ${col('Exchange', '🔁', [['Owns', 'Swift 2017'], ['Est. value', '₹3.1–3.6 L'], ['Upgrade', 'Hatch → SUV']])}
          ${col('Engagement', '💬', [['Replies', '6 of 6'], ['Time to finish', '3 m 10 s'], ['Language', 'English']])}
        </div>
        <div class="sec" style="margin-top:16px">Relevant cohorts</div>
        ${chips([['In-market · 0–30 days', 'red'], ['High credit', 'green'], ['Exchange: hatchback owner', 'amber'], ['Home test drive', ''], ['West Delhi · metro', ''], ['Paid social', ''], ['Grade A', 'dark']])}
        <div style="margin-top:16px">${note('🧭', '<b>Routing rule:</b> grade A and B leads go to the 3 nearest dealers with a 15-minute SLA. Grade C gets an AI qualification call first. Unverified leads never reach a dealer.')}</div>
      </div></div>`;
  }

  function broadcastPanel() {
    const row = (n, name, km, st, t, cls, d) => `<div class="card in" style="display:flex;align-items:center;gap:14px;padding:12px 16px;margin-bottom:8px;animation-delay:${d}s;${cls === 'win' ? 'border:2px solid #16a34a;background:#f6fcf8' : ''}"><div style="width:30px;height:30px;border-radius:8px;background:${cls === 'win' ? '#16a34a' : '#1b1d22'};color:#fff;display:grid;place-items:center;font-weight:800">${n}</div><div style="flex:1"><div style="font-weight:700;font-size:13.5px">La Maison Citroën · ${name}</div><div style="font-size:11.5px;color:#5b6474">${km} km · ${t}</div></div><span class="chip2 ${cls === 'win' ? 'green' : cls === 'gone' ? '' : 'amber'}">${st}</span></div>`;
    const ev = (t, x, d) => `<div class="in" style="display:flex;gap:12px;font-size:12px;padding:5px 0;animation-delay:${d}s"><span class="mono" style="color:#8a93a3;width:66px">${t}</span><span>${x}</span></div>`;
    return `<div class="panel">${ph('📡', 'Dealer offer', `${P.lead} · offered to the 3 nearest dealers`, 'LOCKED', '#16a34a')}
      <div class="pb">
        <div class="sec">Race to accept <span class="r">SLA 15:00 · WON IN 1:48</span></div>
        ${row(1, 'Kirti Nagar', '3.2', 'ACCEPTED', 'Ranjan Mehta accepted in 1 m 48 s', 'win', 0.1)}
        ${row(2, 'Punjabi Bagh', '5.4', 'WITHDRAWN', 'Viewed at 9:16:40 PM · offer closed', 'gone', 0.25)}
        ${row(3, 'Janakpuri', '6.1', 'WITHDRAWN', 'Viewed at 9:17:12 PM · offer closed', 'gone', 0.4)}
        <div class="grid2" style="margin-top:16px">
          <div><div class="sec">Event log</div>${ev('9:16:04', 'Lead offered to 3 dealers · masked preview', 0.5)}${ev('9:16:40', 'Punjabi Bagh opened the offer', 0.6)}${ev('9:17:12', 'Janakpuri opened the offer', 0.7)}${ev('9:17:52', '<b>Kirti Nagar accepted · lead locked</b>', 0.8)}${ev('9:17:53', 'Offer withdrawn from 2 dealers', 0.9)}${ev('9:17:53', 'Full profile unlocked for Kirti Nagar', 1.0)}</div>
          <div><div class="sec">Rules</div>${note('⚖️', '<b>Nearest 3, first to accept wins.</b> Distance is by road from the verified address, not the PIN code.<br><br><b>Masked until accepted.</b> Dealers see grade, model, slot and distance, not the name or number.<br><br><b>No-show protection.</b> If nobody accepts in 15 min, the next ring of dealers is offered and the region head is alerted.')}</div>
        </div>
      </div></div>`;
  }

  function allocationPanel() {
    const slots = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00'];
    const busy = { 0: 'Showroom', 1: 'Showroom', 5: 'Kalra · TD', 6: 'Kalra · TD' };
    return `<div class="panel">${ph('🗓️', 'Dealer handover', 'La Maison Citroën · Kirti Nagar · DMS synced', 'ASSIGNED')}
      <div class="pb">
        <div class="grid2">
          <div class="card"><div class="sec">Consultant</div><div style="display:flex;gap:12px;align-items:center">${av('ranjan', 64)}<div><div style="font-weight:800;font-size:15px">Ranjan Mehta</div><div class="lbl">Sales consultant · 6 yrs · 4.8★ (212 drives)</div><div style="font-size:12px;margin-top:4px">+91 99883 37493</div></div></div></div>
          <div class="card"><div class="sec">Demo car</div><div style="display:flex;gap:12px;align-items:center"><div style="width:110px">${D.car.whiteSmall}</div><div><div style="font-weight:800;font-size:15px">DL 12 DE 0987</div><div class="lbl">Basalt X Max Turbo AT · Polar White</div><div style="font-size:12px;margin-top:4px">Fuel ¾ · insured · last service 2 Oct</div></div></div></div>
        </div>
        <div class="sec" style="margin-top:18px">Wed 21 Oct · demo car DL 12 DE 0987</div>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">${slots.map((t, i) => `<div style="text-align:center"><div style="height:42px;border-radius:6px;display:grid;place-items:center;font-size:10.5px;font-weight:700;${i === 2 || i === 3 ? 'background:#da291c;color:#fff' : busy[i] ? 'background:#e5e7eb;color:#6b7280' : 'background:#e8f6ee;color:#11622f'}">${i === 2 ? 'Shubham K.' : i === 3 ? '+ drive' : busy[i] || 'Free'}</div><div class="lbl" style="margin-top:4px">${t}</div></div>`).join('')}</div>
        <div style="margin-top:16px">${chk('Lead created in the dealer DMS', 'DMS-KN-88412 · source FreeStand · campaign basaltx_td_delhi', 'SYNCED', '', 0.15)}${chk('Consultant briefed', 'Swift 2017 exchange · finance-ready · wants AT · gate pass needed', 'SENT', '', 0.3)}${chk('Car and consultant blocked', '11:00–12:00 including travel (3.2 km · 12 min)', 'BLOCKED', '', 0.45)}${chk('Customer confirmation', 'WhatsApp confirmation goes out on “Confirm”', 'NEXT', 'wait', 0.6)}</div>
      </div></div>`;
  }

  function commsPanel() {
    const tl = (t, x, s, cls, d) => `<div class="in" style="display:flex;gap:14px;animation-delay:${d}s"><div style="display:flex;flex-direction:column;align-items:center"><div style="width:14px;height:14px;border-radius:50%;background:${cls === 'done' ? '#16a34a' : '#fff'};border:3px solid ${cls === 'done' ? '#16a34a' : '#c3c8cf'}"></div><div style="flex:1;width:2px;background:#e4e7ec;min-height:26px"></div></div><div style="padding-bottom:12px"><div style="font-size:13px;font-weight:700">${x} <span class="mono" style="font-size:11px;color:#8a93a3;font-weight:500;margin-left:6px">${t}</span></div><div style="font-size:11.5px;color:#5b6474">${s}</div></div></div>`;
    return `<div class="panel">${ph('✉️', 'Confirmation & reminders', 'Customer journey · automated by FreeStand', 'ACTIVE')}
      <div class="pb"><div class="grid2">
        <div><div class="sec">Confirmation</div>
          ${chk('WhatsApp confirmation sent', 'Template “td_confirmed_v3” · rich card + 3 buttons', '9:18:01', '', 0.1)}
          ${chk('Delivered', 'Single tick → double tick', '9:18:02', '', 0.2)}
          ${chk('Read', 'Opened 29 s after delivery', '9:18:30', '', 0.3)}
          ${chk('Calendar invite', '.ics with the address, consultant and car', 'ADDED', '', 0.4)}
          <div class="sec" style="margin-top:16px">Fallbacks</div>
          ${note('🔁', 'Not delivered in 2 min → <b>SMS</b>.<br>Not read in 2 h → <b>AI call</b>.<br>Cancel or reschedule from any message updates the dealer instantly.')}
        </div>
        <div><div class="sec">Scheduled journey</div>
          ${tl('Mon 9:18 PM', 'Confirmation', 'WhatsApp · delivered and read', 'done', 0.2)}
          ${tl('Tue 5:40 PM', 'AI confirmation call (T-18 h)', 'Hinglish · confirms, reschedules, answers FAQs', '', 0.3)}
          ${tl('Wed 9:00 AM', 'Morning reminder (T-2 h)', 'WhatsApp · documents checklist', '', 0.4)}
          ${tl('Wed 10:45 AM', 'Consultant live location (T-30 m)', 'Map card + handover code', '', 0.5)}
          ${tl('Wed +90 min', 'Feedback & next step', 'Rating, on-road price, booking link', '', 0.6)}
          ${tl('+48 h', 'AI follow-up call', 'Only if no booking yet', '', 0.7)}
        </div></div></div></div>`;
  }

  function callPanel() {
    const line = (w, t, d) => `<div class="in" style="display:flex;gap:10px;margin-bottom:9px;animation-delay:${d}s"><span style="flex:none;font-size:9.5px;font-weight:800;letter-spacing:.6px;color:#fff;background:${w === 'ai' ? '#1b1d22' : RED};border-radius:10px;padding:3px 8px;height:18px">${w === 'ai' ? 'AI · ARIA' : 'SHUBHAM'}</span><span style="font-size:12.5px;line-height:1.5;color:${w === 'ai' ? '#3b4352' : '#13203b'};font-weight:${w === 'ai' ? 500 : 650}">${t}</span></div>`;
    const ex = (k, v, d, cls = '') => `<div class="in" style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f0f1f3;font-size:12.5px;animation-delay:${d}s"><span style="color:#5b6474">${k}</span><span class="chip2 ${cls}">${v}</span></div>`;
    return `<div class="panel">${ph('🎙️', 'AI confirmation call', 'Tue 20 Oct · 5:42 PM · answered on the first attempt', 'ON CALL', '#22c55e')}
      <div class="pb"><div style="display:grid;grid-template-columns:1.25fr 1fr;gap:22px">
        <div><div class="sec">Live transcript <span class="r">HINGLISH</span></div>
          ${line('ai', 'Namaste Shubham ji, main Citroën se Aria bol rahi hoon. Kal 11 baje aapka Basalt X test drive ghar pe hai. Kya yeh confirm hai?', 0.1)}
          ${line('c', 'Haan, but kya 11:30 kar sakte hain? Thoda late free hounga.', 0.4)}
          ${line('ai', 'Bilkul. 11:30 slot available hai, maine update kar diya. Ranjan aapko 11:15 pe call karenge.', 0.7)}
          ${line('c', 'Perfect. Meri wife bhi saath hogi. Aur exchange ke baare mein bhi baat karni hai.', 1.0)}
          ${line('ai', 'Noted. Ranjan Swift ki exchange value bhi bata denge. Original DL ready rakhiyega. Kuch aur?', 1.3)}
          ${line('c', 'Nahi, bas. Thank you!', 1.6)}
        </div>
        <div><div class="sec">Captured from the call</div>
          ${ex('Test drive', 'Confirmed', 0.4, 'green')}${ex('Time', '11:00 → 11:30 AM', 0.7, 'amber')}${ex('Co-passenger', 'Spouse', 1.0)}${ex('Topic to prepare', 'Swift exchange value', 1.3)}${ex('Documents', 'DL ready', 1.5, 'green')}${ex('Sentiment', 'Positive · high intent', 1.7, 'green')}
          <div class="sec" style="margin-top:16px">Actions taken</div>
          ${chk('Slot moved in the dealer DMS', 'Car and consultant re-blocked 11:30–12:30', 'DONE', '', 1.8)}
          ${chk('Ranjan notified', 'FreeStand Dealer push + exchange brief', 'DONE', '', 1.95)}
          ${chk('WhatsApp updated', 'New time sent to Shubham', 'DONE', '', 2.1)}
        </div></div></div></div>`;
  }

  function trackPanel() {
    return `<div class="panel">${ph('📍', 'Day-of tracking', 'Wed 21 Oct · consultant en route', 'LIVE')}
      <div class="pb"><div style="display:grid;grid-template-columns:1fr 280px;gap:20px">
        <div><div style="height:300px;border-radius:12px;overflow:hidden;border:1px solid var(--line);position:relative">${miniMap({ route: true, car: 104 })}<div style="position:absolute;left:14px;top:14px;background:#1b1d22;color:#fff;border-radius:8px;padding:8px 12px;font-size:12px"><b>ETA 9 min</b> · 2.1 km left</div></div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px"><div class="card"><div class="lbl">Left showroom</div><div style="font-size:17px;font-weight:800">11:12 AM</div></div><div class="card"><div class="lbl">Expected at gate</div><div style="font-size:17px;font-weight:800">11:27 AM</div></div><div class="card"><div class="lbl">Slot</div><div style="font-size:17px;font-weight:800">11:30 AM</div></div></div></div>
        <div><div class="card" style="display:flex;gap:12px;align-items:center">${av('ranjan', 56)}<div><div style="font-weight:800">Ranjan Mehta</div><div class="lbl">DL 12 DE 0987 · Polar White</div></div></div>
          <div class="sec" style="margin-top:16px">Checks</div>
          ${chk('Morning reminder read', 'T-2 h WhatsApp · 9:02 AM', 'READ', '', 0.1)}
          ${chk('Consultant pre-call', 'Ranjan called at 11:15 AM · 0:48', 'DONE', '', 0.25)}
          ${chk('Handover code issued', 'Code 4831 starts the drive', 'SENT', '', 0.4)}
          ${chk('Geofence arrival', 'Alert when the car is 200 m from the gate', 'WAITING', 'wait', 0.55)}
          ${note('⏱️', '<b>On-time SLA.</b> If the car is 10+ min late, Shubham gets an automatic update and the showroom manager is alerted.')}
        </div></div></div></div>`;
  }

  function outcomePanel() {
    return `<div class="panel">${ph('🏁', 'Test-drive outcome', `${P.lead} · closed loop to the dealer`, 'HOT LEAD', RED)}
      <div class="pb">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
          <div class="card"><div class="lbl">Drive</div><div class="big" style="font-size:24px">24 min</div><div class="lbl">14.2 km · city + Ring Road</div></div>
          <div class="card"><div class="lbl">Rating</div><div class="big" style="font-size:24px">😍 5/5</div><div class="lbl">“Loved it”</div></div>
          <div class="card"><div class="lbl">Next step chosen</div><div class="big" style="font-size:20px">On-road price</div><div class="lbl">opened in 38 s</div></div>
          <div class="card" style="border-color:#f3b4b8;background:#fff7f6"><div class="lbl">Purchase intent</div><div class="big" style="font-size:24px;color:${RED}">Hot</div><div class="lbl">booking likely in 7 days</div></div>
        </div>
        <div class="grid2" style="margin-top:16px">
          <div><div class="sec">Closed loop</div>
            ${chk('Drive verified', 'Handover code 11:34 AM · return 11:58 AM', 'DONE', '', 0.1)}
            ${chk('Dealer DMS updated', 'Stage: Test drive done → Negotiation', 'SYNCED', '', 0.25)}
            ${chk('Quote shared', 'Indicative on-road price + exchange estimate on WhatsApp', 'SENT', '', 0.4)}
            ${chk('Follow-up booked', 'AI call in 48 h if no booking · Ranjan gets the transcript', 'SCHEDULED', 'wait', 0.55)}
          </div>
          <div><div class="sec">Relevant cohorts</div>
            ${chips([['Test drive: done', 'green new'], ['Hot lead', 'red new'], ['Exchange: Swift 2017', 'amber'], ['Finance-ready', 'green'], ['In-market · 0–30 days', 'red'], ['Grade A', 'dark']])}
            <div class="sec" style="margin-top:16px">Next best action</div>
            <div class="card" style="display:flex;gap:12px;align-items:center"><span style="font-size:22px">📝</span><div><div style="font-weight:700;font-size:13px">Send a ₹11,000 booking link with the exchange bonus</div><div class="lbl">Hot leads who see a price within 2 h book 2.3× more often (demo data)</div></div></div>
            <div class="card" style="display:flex;gap:12px;align-items:center;margin-top:8px"><span style="font-size:22px">🎯</span><div><div style="font-weight:700;font-size:13px">Add to the lookalike seed</div><div class="lbl">Grade-A test-drivers improve paid-social targeting for the next wave</div></div></div>
          </div></div>
      </div></div>`;
  }

  // ───────────────────────────── full-canvas pages ─────────────────────────────
  function cover() {
    const stages = [['01', 'Booking', 'Website or app, 60-second booking'], ['02', 'Validation', 'Licence, credit, address, enrichment'], ['03', 'Fulfilment', 'Nearest 3 dealers race to accept'], ['04', 'Confirmation', 'WhatsApp + AI calling to the drive']];
    return `<div class="scene"><div class="art" style="top:0">${D.scenes.cover}</div>
      <div style="position:absolute;left:54px;top:50px;max-width:640px;animation:fadeInUp .6s both">
        <div style="display:flex;align-items:center;gap:12px"><span style="width:44px;height:44px;border-radius:10px;background:${RED};display:grid;place-items:center">${chev(26)}</span><span style="font-size:13px;font-weight:800;letter-spacing:3px;color:#1b1d22">CITROËN × <img src="${D.img.fs}" alt="FreeStand" style="height:14px;vertical-align:-1px;margin-left:4px"></span></div>
        <div style="font-size:44px;font-weight:800;line-height:1.08;letter-spacing:-1px;margin-top:22px;color:#13203b">Every test drive verified,<br>routed and confirmed.</div>
        <div style="font-size:16px;color:#5b6474;margin-top:12px;line-height:1.5">Follow one Basalt X lead from an Instagram ad to the handover at Shubham’s gate.</div></div>
      <div style="position:absolute;left:54px;right:54px;bottom:44px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px">${stages.map((s, i) => `<div style="background:#1b1d22;color:#fff;border-radius:10px;padding:14px 16px;animation:fadeInUp .5s ${0.3 + i * 0.12}s both"><div style="font-size:11px;font-weight:800;color:#f3b4b8;letter-spacing:2px">${s[0]}</div><div style="font-size:16px;font-weight:800;margin-top:4px">${s[1]}</div><div style="font-size:12px;color:#c9ced6;margin-top:3px">${s[2]}</div></div>`).join('')}</div></div>`;
  }

  function analytics() {
    const F = [['Test drives booked', 12480], ['Mobile verified (OTP)', 11902], ['Validated (DL + address)', 9861], ['Accepted by a dealer', 9402], ['Confirmed by AI call', 8577], ['Test drives done', 7118], ['Cars booked', 1281]];
    const max = F[0][1];
    const fmt = (n) => n.toLocaleString('en-IN');
    const funnel = F.map(([l, v], i) => `<div class="row"><span>${l}</span><div class="b" data-tip="${l}: ${fmt(v)} (${((v / max) * 100).toFixed(1)}% of bookings)"><i class="${i === F.length - 1 ? 'hi' : ''}" style="width:${(v / max) * 100}%;animation-delay:${i * 0.08}s"></i></div><span class="n">${fmt(v)}<small>${i ? ((v / F[i - 1][1]) * 100).toFixed(0) + '%' : ''}</small></span></div>`).join('');
    const R = [['Invalid or expired licence', 742], ['Address not serviceable', 498], ['Duplicate lead', 381], ['Dealer or agent number', 236], ['Consent withdrawn', 184]];
    const rmax = R[0][1];
    const reasons = R.map(([l, v], i) => `<div class="row" style="grid-template-columns:180px 1fr 52px"><span>${l}</span><div class="b" data-tip="${l}: ${fmt(v)} leads stopped before a dealer saw them"><i style="width:${(v / rmax) * 100}%;background:#8a93a3;animation-delay:${i * 0.08}s"></i></div><span class="n">${fmt(v)}</span></div>`).join('');
    const T = [['Kirti Nagar', 1214, 1152, '1 m 52 s', '81%', 214], ['Punjabi Bagh', 1032, 958, '2 m 05 s', '79%', 176], ['Janakpuri', 1086, 1001, '2 m 30 s', '77%', 171], ['Dwarka', 790, 731, '3 m 12 s', '74%', 118], ['Karol Bagh', 874, 772, '4 m 10 s', '68%', 102]];
    return `<div class="full"><div class="dash"><div class="side"><div class="lg"><img src="${D.img.fs}" alt="FreeStand"></div>
      ${[['📊', 'Overview', 1], ['🚗', 'Test drives'], ['🛡️', 'Validation'], ['🏢', 'Dealers'], ['🎙️', 'AI calls'], ['💬', 'WhatsApp'], ['👥', 'Audiences'], ['⚙️', 'Settings']].map(([i, t, on]) => `<a class="${on ? 'on' : ''}">${i} ${t}</a>`).join('')}
      <div style="margin-top:auto;padding:0 18px;font-size:11px;opacity:.6">Citroën India · Delhi NCR<br>Basalt X test-drive programme</div></div>
      <div class="main">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px"><div><div style="font-size:20px;font-weight:800">Test-drive programme · Delhi NCR</div><div class="lbl">Basalt X · 1 Aug – 21 Oct 2026 · 5 dealers · demo data</div></div><div class="chips"><span class="chip2">Last 12 weeks ▾</span><span class="chip2">All dealers ▾</span><span class="chip2 dark">Export</span></div></div>
        <div class="kpis">
          <div class="kpi"><div class="v">12,480</div><div class="l">Test drives booked</div><div class="d">▲ 18% vs prior 12 wks</div></div>
          <div class="kpi"><div class="v">79%</div><div class="l">Validated before a dealer saw them</div><div class="d">2,041 junk leads stopped</div></div>
          <div class="kpi"><div class="v">2 m 41 s</div><div class="l">Median dealer acceptance</div><div class="d">95% inside the 15-min SLA</div></div>
          <div class="kpi"><div class="v">76%</div><div class="l">Show-up rate</div><div class="d">after AI confirmation calls</div></div>
          <div class="kpi"><div class="v">18%</div><div class="l">Drive → booking</div><div class="d">1,281 cars booked</div></div>
        </div>
        <div style="display:grid;grid-template-columns:1.25fr 1fr;gap:12px;margin-top:12px">
          <div class="card funnel"><div class="sec">Funnel · ad to booking</div>${funnel}</div>
          <div class="card funnel"><div class="sec">Why leads were stopped <span class="r">2,041</span></div>${reasons}
            <div class="sec" style="margin-top:14px">AI calls</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:11.5px"><div><div style="font-size:18px;font-weight:800">21,340</div><div class="lbl">calls placed</div></div><div><div style="font-size:18px;font-weight:800">73%</div><div class="lbl">answered</div></div><div><div style="font-size:18px;font-weight:800">1,912</div><div class="lbl">reschedules handled</div></div></div></div>
        </div>
        <div class="card" style="margin-top:12px"><div class="sec">Dealer leaderboard</div><table class="t"><thead><tr><th>Dealer</th><th class="r">Offered</th><th class="r">Accepted</th><th class="r">Median accept</th><th class="r">Show-up</th><th class="r">Bookings</th></tr></thead><tbody>${T.map((r) => `<tr><td><b>La Maison Citroën · ${r[0]}</b></td><td class="r">${fmt(r[1])}</td><td class="r">${fmt(r[2])}</td><td class="r">${r[3]}</td><td class="r">${r[4]}</td><td class="r"><b>${r[5]}</b></td></tr>`).join('')}</tbody></table></div>
      </div></div></div>`;
  }

  function thanks() {
    const rows = [['Booking', 'Ad → website → OTP → WhatsApp in under a minute'], ['Validation', 'Licence, soft credit, address quality and intent: a grade-A lead'], ['Fulfilment', 'Nearest 3 dealers raced; Kirti Nagar won in 1 m 48 s'], ['Confirmation & AI calling', 'Confirmed, rescheduled by voice, tracked to the gate']];
    return `<div class="scene" style="background:#141518"><div style="position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:0 70px;gap:50px;color:#fff">
      <div style="animation:fadeInUp .6s both"><span style="width:56px;height:56px;border-radius:12px;background:${RED};display:grid;place-items:center">${chev(32)}</span><div style="font-size:46px;font-weight:800;line-height:1.08;margin-top:26px;letter-spacing:-1px">Thank you.</div><div style="font-size:17px;color:#c9ced6;margin-top:14px;line-height:1.55">One lead, four stages, zero manual follow-up.<br>Every test drive verified before a dealer spends a minute on it.</div><div style="margin-top:28px;display:flex;align-items:center;gap:10px;font-size:12px;color:#9aa3ad">Powered by <img src="${D.img.fs}" alt="FreeStand" style="height:16px;filter:brightness(0) invert(1)"></div></div>
      <div>${rows.map((r, i) => `<div style="display:flex;gap:16px;align-items:flex-start;padding:18px 0;border-bottom:1px solid rgba(255,255,255,.1);animation:fadeInUp .5s ${0.2 + i * 0.12}s both"><span style="font-size:13px;font-weight:800;color:${RED};width:28px">0${i + 1}</span><div><div style="font-size:18px;font-weight:700">${r[0]}</div><div style="font-size:13px;color:#9aa3ad;margin-top:3px">${r[1]}</div></div></div>`).join('')}</div></div></div>`;
  }

  // ───────────────────────────── steps ─────────────────────────────
  const GROUPS = ['Intro', 'Booking', 'Validation', 'Fulfilment', 'Confirmation & AI calling', 'Results'];
  const scene = (name, loc, n, tt, ss) => ({ kind: 'scene', name, loc, n, tt, ss });
  const STEPS = [
    { g: 0, label: 'Cover', render: cover },
    { g: 1, label: 'Sees the ad', ...scene('ad', 'HOME · RAJOURI GARDEN, NEW DELHI · MON 19 OCT · 9:12 PM', 'STEP 1', 'Shubham sees the Basalt X ad', 'An Instagram ad deep-links to the test-drive page. The campaign source travels with the lead from here on.') },
    { g: 1, label: 'Books on the website', split: () => sitePhone('filled') + leadCapturedPanel() + stepnote('STEP 2', '<b>Booked in 48 seconds.</b> The lead exists in the CDP before he even taps “Book”: duplicate, PIN and spam checks run instantly.', true) },
    { g: 1, label: 'OTP + WhatsApp', split: () => sitePhone('otp') + profilePanel({ phone: 1, otp: 1, cohorts: [['Home test drive', 'new'], ['Instagram ad', 'new'], ['Basalt X · AT', 'new']], checks: [['Mobile verified', 'OTP auto-read · +91 98374 92834', 'OTP ✓'], ['WhatsApp opt-in', 'Consent artefact: test drive + offers · Mon 9:13:41 PM', 'DPDP ✓'], ['Driving licence', 'Next: on WhatsApp', 'PENDING', 'wait'], ['Credit (optional)', 'Next: on WhatsApp', 'PENDING', 'wait'], ['Address', 'Next: on WhatsApp', 'PENDING', 'wait']] }) + stepnote('STEP 3', '<b>One OTP, then WhatsApp.</b> The verified number and the consent record are the anchor for everything that follows.', true) },
    { g: 2, label: 'Driving licence', split: (pv) => waPhone(waEnd.dl, pv) + dlPanel() + stepnote('STEP 4', '<b>Licence first.</b> A photo on WhatsApp is read, checked against the government record and matched to the booking name.') , wa: waEnd.dl },
    { g: 2, label: 'Credit score', split: (pv) => waPhone(waEnd.credit, pv) + creditPanel() + stepnote('STEP 5', '<b>Optional soft credit check.</b> No impact on his score; the dealer only learns he’s finance-ready.'), wa: waEnd.credit },
    { g: 2, label: 'Address quality', split: (pv) => waPhone(waEnd.addr, pv) + addrPanel() + stepnote('STEP 6', '<b>Address that a driver can actually find.</b> Parsed, geocoded, scored, and checked for home test-drive serviceability.'), wa: waEnd.addr },
    { g: 2, label: 'Enriched lead', split: (pv) => waPhone(waEnd.intent, pv) + enrichedPanel() + stepnote('STEP 7', '<b>A grade-A lead.</b> Two more answers (current car, buying window) and the profile is ready to route.'), wa: waEnd.intent },
    { g: 3, label: 'Nearest 3 dealers', ...scene('map', 'LEAD ROUTING · WEST DELHI · MON 19 OCT · 9:16 PM', 'STEP 8', 'Offered to the 3 nearest dealerships', 'Only validated leads are routed. Each dealer sees a masked preview and has 15 minutes to accept.') },
    { g: 3, label: 'Dealer accepts', split: () => dealerPhone('offer') + broadcastPanel() + stepnote('STEP 9', '<b>First to accept wins.</b> Kirti Nagar takes it in 1 m 48 s; the other two offers close automatically.') },
    { g: 3, label: 'Showroom', ...scene('showroom', 'LA MAISON CITROËN · KIRTI NAGAR · MON 19 OCT · 9:17 PM', 'STEP 10', 'The nearest dealer takes over', 'The consultant accepts on the FreeStand Dealer app, and the full verified profile unlocks only now.') },
    { g: 3, label: 'Car + consultant', split: () => dealerPhone('assign') + allocationPanel() + stepnote('STEP 11', '<b>Consultant, demo car and slot in one tap.</b> The lead lands in the dealer DMS with a brief.') },
    { g: 4, label: 'WhatsApp confirmation', split: (pv) => waPhone(waEnd.confirm, pv) + commsPanel() + stepnote('STEP 12', '<b>Confirmed on WhatsApp in 2 minutes.</b> Reminders, the AI call and fallbacks are scheduled automatically.', true), wa: waEnd.confirm },
    { g: 4, label: 'AI call', ...scene('call', 'OFFICE · CYBER CITY, GURUGRAM · TUE 20 OCT · 5:42 PM', 'STEP 13', 'The AI calls the evening before', 'Aria confirms in Hinglish, moves the slot to 11:30 and briefs the dealer. Nobody at the showroom picks up a phone.') },
    { g: 4, label: 'Call outcome', split: () => callPhone() + callPanel() + stepnote('STEP 14', '<b>Every call becomes data.</b> The new time, the co-passenger and the exchange question go straight to Ranjan.', true) },
    { g: 4, label: 'Day-of tracking', split: (pv) => waPhone(waEnd.day, pv) + trackPanel() + stepnote('STEP 15', '<b>No “where are you?” calls.</b> Live location and a handover code arrive on WhatsApp.', true), wa: waEnd.day },
    { g: 4, label: 'Handover', ...scene('drive', 'VISHAL ENCLAVE · RAJOURI GARDEN · WED 21 OCT · 11:34 AM', 'STEP 16', 'Handover at the gate', 'The handover code starts the drive, and the licence is re-checked against the verified copy.') },
    { g: 4, label: 'Feedback', split: (pv) => waPhone(waEnd.fb, pv) + outcomePanel() + stepnote('STEP 17', '<b>From drive to quote in 90 minutes.</b> Feedback, an indicative price and the next step, with the dealer kept in the loop.', true), wa: waEnd.fb },
    { g: 5, label: 'Analytics', render: analytics },
    { g: 5, label: 'Thank you', render: thanks },
  ];

  // ───────────────────────────── render ─────────────────────────────
  const canvas = document.getElementById('canvas');
  const KEY = 'citroen-td-step';
  let idx = 0;
  try { idx = Math.min(Math.max(0, parseInt(localStorage.getItem(KEY) || '0', 10) || 0), STEPS.length - 1); } catch (e) {}
  let prev = idx;

  function draw() {
    const s = STEPS[idx];
    const ps = STEPS[prev];
    let html;
    if (s.render) html = s.render();
    else if (s.kind === 'scene')
      html = `<div class="scene"><div class="loc">${s.loc.split(' · ').join('<i style="font-style:normal;margin:0 .7em;opacity:.6">·</i>')}</div><div class="art">${D.scenes[s.name]}</div><div class="caption"><span class="chip">${s.n}</span><div><div class="tt">${s.tt}</div><div class="ss">${s.ss}</div></div></div></div>`;
    else {
      // only new WhatsApp messages animate: when stepping forward between chat steps, start after the last shown one
      const pv = s.wa && ps && ps.wa && prev < idx ? ps.wa : s.wa && prev === idx ? s.wa : 0;
      html = `<div class="split">${s.split(pv)}</div>`;
    }
    canvas.innerHTML = html;
    const wb = document.getElementById('wabody');
    if (wb) { wb.style.scrollBehavior = 'auto'; wb.scrollTop = wb.scrollHeight; }
    // nav
    document.querySelectorAll('.segs button').forEach((b, i) => (b.className = i === idx ? 'on' : i < idx ? 'past' : ''));
    document.querySelectorAll('.groups div').forEach((g) => g.classList.toggle('on', +g.dataset.g === s.g));
    document.querySelectorAll('.stages div').forEach((g) => { const k = +g.dataset.g; g.className = k === s.g ? 'on' : k < s.g ? 'done' : ''; });
    document.getElementById('prev').disabled = idx === 0;
    document.getElementById('next').disabled = idx === STEPS.length - 1;
    document.getElementById('where').innerHTML = `<b>${String(idx + 1).padStart(2, '0')} / ${STEPS.length} · ${s.label}</b> &nbsp; ← → keys · Home / End`;
    try { localStorage.setItem(KEY, String(idx)); } catch (e) {}
  }
  function go(i) { const n = Math.min(Math.max(0, i), STEPS.length - 1); if (n === idx) return; prev = idx; idx = n; draw(); }

  // nav markup: group labels spanning their steps, then one segment per step
  const segs = document.getElementById('segs');
  const groups = document.getElementById('groups');
  segs.style.gridTemplateColumns = groups.style.gridTemplateColumns = `repeat(${STEPS.length}, 1fr)`;
  segs.innerHTML = STEPS.map((s, i) => `<button title="${s.label}">${String(i + 1).padStart(2, '0')}</button>`).join('');
  segs.querySelectorAll('button').forEach((b, i) => b.addEventListener('click', () => go(i)));
  let gi = 0;
  groups.innerHTML = GROUPS.map((g, k) => { const n = STEPS.filter((s) => s.g === k).length; const start = gi + 1; gi += n; return `<div data-g="${k}" style="grid-column:${start} / span ${n}">${g}</div>`; }).join('');
  document.getElementById('stages').innerHTML = GROUPS.slice(1, 5).map((g, k) => `<div data-g="${k + 1}"><b>0${k + 1}</b>${g}</div>`).join('');
  document.getElementById('prev').addEventListener('click', () => go(idx - 1));
  document.getElementById('next').addEventListener('click', () => go(idx + 1));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { go(idx + 1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { go(idx - 1); e.preventDefault(); }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(STEPS.length - 1);
  });

  // fit the 1280 × 890 canvas to the window
  function fit() {
    const sc = Math.min(1, (window.innerWidth - 56) / 1280, (window.innerHeight - 210) / 890);
    const k = Math.max(0.4, sc);
    canvas.style.transform = `scale(${k})`;
    document.documentElement.style.setProperty('--cw', `${Math.round(1280 * k)}px`);
    document.documentElement.style.setProperty('--ch', `${Math.round(890 * k)}px`);
  }
  window.addEventListener('resize', fit);

  // hover tooltips for chart marks
  const tip = document.getElementById('tip');
  document.addEventListener('mousemove', (e) => {
    const t = e.target.closest && e.target.closest('[data-tip]');
    if (!t) { tip.style.opacity = 0; return; }
    tip.textContent = t.dataset.tip; tip.style.opacity = 1;
    tip.style.left = `${e.clientX + 14}px`; tip.style.top = `${e.clientY + 14}px`;
  });

  fit();
  draw();
})();

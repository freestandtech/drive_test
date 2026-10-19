// HUL brands and categories in scope, the two LSM clusters, and the channels each cluster uses.
// Brands and categories are the categories HUL is building (premiumisation), not powders. Colours are neutral demo marks, not brand artwork.

export const CLUSTERS = {
  lsm37: {
    id: 'lsm37',
    short: 'LSM 3–7',
    name: 'Door-to-door & stores',
    color: '#2a78d6',
    tint: '#eaf2fc',
    who: 'Door-to-door, kirana and stores · Hindi and regional languages · many keypad phones',
    channels: ['Home-to-home promoters', 'AI voice calls', 'MT stalls & shelf QR', 'GT kirana coupons'],
    identify: 'At the door the promoter enters the mobile number; in store the shopper scans a QR or the promoter bot captures it. No OTP, no code, no photo. Shoppers who decline still join a pixel audience.',
    verify: 'An AI call in the household’s language or a WhatsApp tap confirms the purchase; retailers verify coupon codes and bill uploads are read by AI.',
    retarget: 'Consented numbers become hashed custom audiences with lookalikes; pixel audiences cover shoppers who share nothing.',
    loyalty: 'Pack codes, retailer-verified kirana purchases, bill uploads and buy 5 get 1.',
  },
  lsm7: {
    id: 'lsm7',
    short: 'LSM 7+',
    name: 'Digital & quick commerce',
    color: '#1baf7a',
    tint: '#e8f7f1',
    who: 'Metro and digital-first consumers who already sample through websites, WhatsApp and quick commerce.',
    channels: ['Website & WhatsApp sampling', 'Quick-commerce loyalty sign-up', 'Clean rooms', 'UGC'],
    identify: 'OTP-verified sign-up with consent and profiling questions (zero-party data).',
    verify: 'Courier proof of delivery, reviews, and quick-commerce invoices read by AI.',
    retarget: 'Consented audiences on Meta and Google; clean-room matches with quick-commerce partners.',
    loyalty: 'Invoice uploads, milestone rewards (₹100 gift card), sampling boxes and UGC.',
  },
};
export const CLUSTER_IDS = ['lsm37', 'lsm7'];
// Old links and saved rules may still name the retired lowest-tier id; that tier is now part of LSM 3–7.
export const TIER_ALIASES = { lsm13: 'lsm37' }; // legacy-tier-alias: only place the old id may appear
export const tierId = (id) => TIER_ALIASES[id] || id;

export const BRANDS = {
  surf: { name: 'Surf Excel', mark: 'SE', bg: '#1653a8', fg: '#fff', accent: '#f39200' },
  comfort: { name: 'Comfort', mark: 'C', bg: '#6b3fa0', fg: '#fff', accent: '#f0a8d0' },
  sunsilk: { name: 'Sunsilk', mark: 'S', bg: '#b0185a', fg: '#fff', accent: '#ffc2dc' },
  dove: { name: 'Dove', mark: 'D', bg: '#14306b', fg: '#fff', accent: '#d9b56a' },
  tresemme: { name: 'TRESemmé', mark: 'T', bg: '#151515', fg: '#fff', accent: '#c9a96e' },
  ponds: { name: 'Pond’s', mark: 'P', bg: '#2a5aa8', fg: '#fff', accent: '#f4b6c8' },
  bebeautiful: { name: 'Be Beautiful', mark: 'BB', bg: '#d63c6e', fg: '#fff', accent: '#ffd4e1' },
  pears: { name: 'Pears', mark: 'Pe', bg: '#a8561a', fg: '#fff', accent: '#ffd29c' },
  lux: { name: 'Lux', mark: 'L', bg: '#8b1e5a', fg: '#fff', accent: '#f6c7df' },
  vaseline: { name: 'Vaseline', mark: 'V', bg: '#123f8c', fg: '#fff', accent: '#f6d34a' },
  horlicks: { name: 'Horlicks', mark: 'H', bg: '#c62a2f', fg: '#fff', accent: '#ffd36b' },
  horlicks_mp: { name: 'Horlicks Mother’s Plus', mark: 'H', bg: '#e05a8a', fg: '#fff', accent: '#ffd36b' },
  horlicks_dp: { name: 'Horlicks Diabetes Plus', mark: 'H', bg: '#6a2c8f', fg: '#fff', accent: '#ffd36b' },
  horlicks_pp: { name: 'Horlicks Protein Plus', mark: 'H', bg: '#d81f26', fg: '#fff', accent: '#ffd36b' },
  rin: { name: 'Rin', mark: 'R', bg: '#1784c7', fg: '#fff', accent: '#ffe066' },
  simple: { name: 'Simple', mark: 'Si', bg: '#2f7d4a', fg: '#fff', accent: '#cdeccf' },
  lakme: { name: 'Lakmé', mark: 'La', bg: '#111', fg: '#fff', accent: '#e9c7d3' },
};

// A brand's pack shot shows one product. Where the product named is a different one, the
// product text picks a second pack: Dove's pack shot is a scalp serum (hair), so a Dove body
// wash draws assets/packs/dove_bodywash (an illustration, not an official pack shot).
// PACK_BRAND maps such a pack key back to its brand.
export const PACK_BRAND = { dove_bodywash: 'dove' };
const BODY_WASH = /body[\s-]?wash|shower|deeply nourishing/i;
const HAIR = /hair|scalp|shampoo|conditioner|serum/i;
// The pack key for brand key `brand` given any product text ("Dove Deeply Nourishing Body Wash 250 ml").
export function packVariant(brand, text = '') {
  if (brand === 'dove' && BODY_WASH.test(text) && !HAIR.test(text)) return 'dove_bodywash';
  return brand;
}
export const packBrand = (k) => PACK_BRAND[k] || k;

// Categories HUL is building, the brands in each, and the clusters each runs in.
export const CATEGORIES = [
  {
    id: 'laundry',
    name: 'Laundry liquids',
    brands: ['surf', 'rin'],
    clusters: ['lsm37', 'lsm7'],
    job: 'Move powder users to liquid, with a demo at the doorstep',
  },
  {
    id: 'fabcon',
    name: 'Fabric conditioners',
    brands: ['comfort'],
    clusters: ['lsm37', 'lsm7'],
    job: 'Create the habit: one cap in the last rinse',
  },
  {
    id: 'conditioner',
    name: 'Hair conditioners',
    brands: ['sunsilk', 'dove', 'tresemme'],
    clusters: ['lsm37', 'lsm7'],
    job: 'Teach shampoo-only households the second step',
  },
  {
    id: 'mask',
    name: 'Hair masks',
    brands: ['tresemme', 'dove', 'sunsilk'],
    clusters: ['lsm37', 'lsm7'],
    job: 'Premium trial for frizz and damage',
  },
  {
    id: 'bodywash',
    name: 'Body washes',
    brands: ['dove', 'pears', 'lux'],
    clusters: ['lsm37', 'lsm7'],
    job: 'Move bar-soap users to body wash',
  },
  {
    id: 'facewash',
    name: 'Face washes',
    brands: ['ponds', 'simple'],
    clusters: ['lsm37', 'lsm7'],
    job: 'Match the variant to the skin type at the stall',
  },
  {
    id: 'wellbeing',
    name: 'Health & wellbeing',
    brands: ['horlicks', 'horlicks_mp', 'horlicks_dp', 'horlicks_pp'],
    clusters: ['lsm37', 'lsm7'],
    job: 'Keep high-lifetime-value families in the funnel (loyalty)',
  },
];

export const categoryOf = (brand) => CATEGORIES.find((c) => c.brands.includes(brand));

// The cast for the Renault test-drive demo: Desi Log characters (illustrations by Juhi Chitra,
// desilog.in, CC BY 4.0), picked from freestand_HUL_CDP/src/v2/kit/cast.js. Colours are the ones
// that file samples from each drawing, for the arms people.js redraws when a pose lifts an arm.
// castUrl() returns a marker; scenes.mjs swaps each drawing for a <use> of one shared <image>,
// so every character is embedded in the page once.

export const CREDIT = {
  text: 'Illustrations: Desi Log by Juhi Chitra · desilog.in',
  href: 'https://desilog.in',
};

const JEANS = '#4f88cd';
const P = (file, role, skin, upper, fore, pants, lap) => ({ file, role, skin, upper, fore, pants, lap });
export const PEOPLE = {
  p94: P('p94.webp', 'Customer · Shubham Kohli (checked shirt, glasses, jeans)', '#d7a39c', '#dfe1e3', '#dfe1e3', JEANS),
  p85: P('p85.webp', 'Sales consultant · Ranjan Mehta (beard, black tee, jeans)', '#d7a39c', '#1f1f24', '#d7a39c', JEANS),
  p98: P('p98.webp', 'Showroom manager (bob, glasses, black tee, jeans)', '#b77f76', '#1f1f24', '#b77f76', JEANS),
  p63: P('p63.webp', 'Co-passenger · Shubham’s wife (long hair, white top, jeans)', '#d7a39c', '#d7a39c', '#d7a39c', JEANS),
};

export const castFor = (o = {}) => (PEOPLE[o.desi] ? o.desi : 'p94');
export const castUrl = (file) => `DL:${file}`;

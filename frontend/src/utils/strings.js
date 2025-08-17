// XSS Validation
export const ZERO_WIDTH = /[\u200B-\u200D\uFEFF]/g;

export function stripZeroWidth(s = '') {
  return String(s).replace(ZERO_WIDTH, '');
}

export function collapseWhitespace(s = '') {
  return String(s).replace(/\s+/g, ' ').trim();
}

export function sanitizeName(s = '') {
  return collapseWhitespace(stripZeroWidth(s)).slice(0, 50);
}

export function sanitizeEmail(s = '') {
  s = stripZeroWidth(String(s)).trim();
  if (!s) return '';
  const parts = s.split('@');
  if (parts.length !== 2) return s.toLowerCase(); // best effort
  const [local, domain] = parts;
  return `${local}@${domain.toLowerCase()}`;
}

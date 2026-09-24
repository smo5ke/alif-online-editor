/**
 * Share-link encode/decode helpers for Alif code.
 * Encoding is UTF-8 safe: btoa(encodeURIComponent(code)).
 * Decoding tolerates '+' characters that URL parsers may turn into spaces.
 */

export function encodeSharedCode(code: string): string {
  return btoa(encodeURIComponent(code));
}

export function decodeSharedCode(raw: string): string {
  const normalized = raw.replace(/ /g, '+');
  return decodeURIComponent(atob(normalized));
}

export function buildShareUrl(origin: string, pathname: string, code: string): string {
  return `${origin}${pathname}?code=${encodeURIComponent(encodeSharedCode(code))}`;
}

export function parseSharedCode(search: string): string | null {
  try {
    const params = new URLSearchParams(search);
    const raw = params.get('code');
    if (!raw) return null;
    const decoded = decodeSharedCode(raw);
    return decoded || null;
  } catch {
    return null;
  }
}

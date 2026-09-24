import { describe, it, expect } from 'vitest';
import {
  encodeSharedCode,
  decodeSharedCode,
  buildShareUrl,
  parseSharedCode,
} from '../shareCode';

describe('shareCode', () => {
  it('round-trips Arabic text with emoji', () => {
    const original = 'اطبع("مرحباً بك في لغة ألف 5.3!")\nانطلاق 🚀!';
    expect(decodeSharedCode(encodeSharedCode(original))).toBe(original);
  });

  it('round-trips through URL build/parse', () => {
    const original = 'س = 10\nاطبع(م"النتيجة: {س}")';
    const url = buildShareUrl('https://x.test', '/repo/', original);
    const search = new URL(url).search;
    expect(parseSharedCode(search)).toBe(original);
  });

  it('recovers "+" corrupted into spaces by URL parsing', () => {
    // '~' is left unescaped by encodeURIComponent and btoa('~~~') === 'fn5+'
    const sample = 'اطبع~~~نهاية';
    expect(encodeSharedCode(sample)).toContain('+');
    const corrupted = encodeSharedCode(sample).replace(/\+/g, ' ');
    expect(decodeSharedCode(corrupted)).toBe(sample);
  });

  it('returns null for missing or invalid code param', () => {
    expect(parseSharedCode('')).toBeNull();
    expect(parseSharedCode('?foo=bar')).toBeNull();
    expect(parseSharedCode('?code=!!!not-base64!!!')).toBeNull();
  });
});

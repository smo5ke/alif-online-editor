import { describe, it, expect } from 'vitest';
import { highlightAlifCode, formatAlifCode } from '../alifHighlighter';

describe('highlightAlifCode', () => {
  it('highlights keywords and comments', () => {
    const html = highlightAlifCode('اذا س == 1:');
    expect(html).toContain('text-fuchsia-400');
    expect(html).toContain('اذا');
  });

  it('renders full-line comments as muted italic', () => {
    const html = highlightAlifCode('# تعليق تجريبي');
    expect(html).toContain('text-slate-500 italic');
  });

  it('highlights interpolated expressions inside formatted strings', () => {
    const html = highlightAlifCode('اطبع(م"النتيجة: {س}")');
    expect(html).toContain('text-orange-300');
    expect(html).toContain('text-cyan-300');
  });
});

describe('formatAlifCode', () => {
  it('indents blocks opened by colons with tabs', () => {
    const input = 'اذا س > 3:\nاطبع("كبير")\nوالا:\nاطبع("صغير")';
    const expected = 'اذا س > 3:\n\tاطبع("كبير")\nوالا:\n\tاطبع("صغير")';
    expect(formatAlifCode(input)).toBe(expected);
  });

  it('drops blank lines to empty and keeps nesting', () => {
    const input = 'لكل س في مدى(3):\n\nاطبع(س)';
    expect(formatAlifCode(input)).toBe('لكل س في مدى(3):\n\n\tاطبع(س)');
  });
});

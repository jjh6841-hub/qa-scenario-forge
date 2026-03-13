import { describe, it, expect } from 'vitest';
import { formatDate, truncateText, parseRisksFromText } from '../../utils/formatters';

describe('formatDate', () => {
  it('should return a date string in YYYY-MM-DD format', () => {
    const date = formatDate();
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('should return the current date', () => {
    const now = new Date();
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    expect(formatDate()).toBe(expected);
  });
});

describe('truncateText', () => {
  it('should return the original text if shorter than maxLength', () => {
    const text = '안녕하세요';
    expect(truncateText(text, 10)).toBe(text);
  });

  it('should truncate text and add ellipsis if longer than maxLength', () => {
    const text = '이것은 매우 긴 텍스트입니다';
    const result = truncateText(text, 5);
    expect(result).toBe('이것은 매...');
    expect(result.endsWith('...')).toBe(true);
  });

  it('should return text unchanged if exactly at maxLength', () => {
    const text = 'hello';
    expect(truncateText(text, 5)).toBe(text);
  });

  it('should handle empty string', () => {
    expect(truncateText('', 10)).toBe('');
  });
});

describe('parseRisksFromText', () => {
  it('should parse valid JSON from text', () => {
    const text = '다음 결과입니다: {"risks": [{"id": "RISK-001"}]}';
    const result = parseRisksFromText(text);
    expect(result).toEqual({ risks: [{ id: 'RISK-001' }] });
  });

  it('should return null when no JSON found', () => {
    const text = '이것은 JSON이 없는 텍스트입니다';
    const result = parseRisksFromText(text);
    expect(result).toBeNull();
  });

  it('should return null for invalid JSON', () => {
    const text = '{invalid json}';
    const result = parseRisksFromText(text);
    expect(result).toBeNull();
  });

  it('should extract JSON from surrounding text', () => {
    const text = '분석 결과: {"key": "value"} 이상입니다.';
    const result = parseRisksFromText(text);
    expect(result).toEqual({ key: 'value' });
  });
});

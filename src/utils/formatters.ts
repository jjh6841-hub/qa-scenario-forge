export function formatDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function parseRisksFromText(text: string): unknown {
  try {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('JSON 객체를 찾을 수 없습니다.');
    }
    const jsonString = text.slice(firstBrace, lastBrace + 1);
    return JSON.parse(jsonString);
  } catch (err) {
    console.error('JSON 파싱 오류:', err);
    return null;
  }
}

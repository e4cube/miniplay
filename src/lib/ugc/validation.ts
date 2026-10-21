export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function plainText(value: unknown, min: number, max: number): string | null {
  if (typeof value !== 'string') return null;
  const text = value.normalize('NFC').replace(/\s+/g, ' ').trim();
  if (text.length < min || text.length > max || /[<>\u0000-\u001f\u007f]/.test(text)) return null;
  return text;
}

export function locale(value: unknown): 'en' | 'zh-CN' | null {
  return value === 'en' || value === 'zh-CN' ? value : null;
}

export function email(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  return normalized.length <= 254 && emailPattern.test(normalized) ? normalized : null;
}

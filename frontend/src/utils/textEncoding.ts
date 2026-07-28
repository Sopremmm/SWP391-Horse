const WINDOWS_1252_BYTES: Record<number, number> = {
  0x20ac: 0x80,
  0x201a: 0x82,
  0x0192: 0x83,
  0x201e: 0x84,
  0x2026: 0x85,
  0x2020: 0x86,
  0x2021: 0x87,
  0x02c6: 0x88,
  0x2030: 0x89,
  0x0160: 0x8a,
  0x2039: 0x8b,
  0x0152: 0x8c,
  0x017d: 0x8e,
  0x2018: 0x91,
  0x2019: 0x92,
  0x201c: 0x93,
  0x201d: 0x94,
  0x2022: 0x95,
  0x2013: 0x96,
  0x2014: 0x97,
  0x02dc: 0x98,
  0x2122: 0x99,
  0x0161: 0x9a,
  0x203a: 0x9b,
  0x0153: 0x9c,
  0x017e: 0x9e,
  0x0178: 0x9f,
};

const MOJIBAKE_MARKERS = /(?:Ã|Â|Ä|Æ|áº|á»|â€|â€“|â€”|â€™|â€œ|â€�|ï¿½)/;

function decodeOnePass(value: string) {
  const bytes: number[] = [];

  for (const character of value) {
    const codePoint = character.codePointAt(0) ?? 0;
    const byte = codePoint <= 0xff ? codePoint : WINDOWS_1252_BYTES[codePoint];
    if (byte === undefined) return value;
    bytes.push(byte);
  }

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(bytes));
  } catch {
    return value;
  }
}

/**
 * Repairs UTF-8 text that was accidentally interpreted as Latin-1/Windows-1252.
 * Correct Unicode text and ordinary English strings are returned unchanged.
 */
export function normalizeDisplayText(value: string) {
  let normalized = value;
  const wasMojibake = MOJIBAKE_MARKERS.test(value);

  for (let pass = 0; pass < 2 && MOJIBAKE_MARKERS.test(normalized); pass += 1) {
    const decoded = decodeOnePass(normalized);
    if (decoded === normalized) break;
    normalized = decoded;
  }

  // Some legacy values contain a space inserted in the middle of a Vietnamese
  // syllable after the broken byte sequence (for example "cáº¥ p"). Only run
  // this repair for strings that were positively identified as mojibake.
  if (wasMojibake) {
    normalized = normalized.replace(
      /([ăâêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ])\s+([cptmn])(?=\s|[.,!?:;"')\]}]|$)/giu,
      '$1$2',
    );
  }

  return normalized;
}

export function normalizeApiText<T>(value: T): T {
  if (typeof value === 'string') return normalizeDisplayText(value) as T;
  if (Array.isArray(value)) return value.map((item) => normalizeApiText(item)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, normalizeApiText(item)]),
    ) as T;
  }
  return value;
}

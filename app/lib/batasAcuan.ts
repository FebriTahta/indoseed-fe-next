/**
 * Cermin dari `src/utils/batasAcuan.ts` di backend — hanya untuk pratinjau status
 * saat pengguna mengetik. Nilai final selalu dihitung ulang oleh server.
 */
const NUMBER = '(-?\\d+(?:[.,]\\d+)?)';
const toNumber = (raw?: string) => {
  if (!raw) return undefined;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
};

type Parsed = { operator: '>=' | '<=' | '>' | '<' | '=' | 'range'; value?: number; min?: number; max?: number };

export const parseBatasAcuan = (batas?: string | null): Parsed | null => {
  if (!batas) return null;
  const str = batas.trim();
  const range = str.match(new RegExp(`^${NUMBER}\\s*[-–]\\s*${NUMBER}`));
  if (range) {
    const min = toNumber(range[1]);
    const max = toNumber(range[2]);
    if (min !== undefined && max !== undefined) return { operator: 'range', min, max };
  }
  const op = str.match(new RegExp(`^(≥|>=|≤|<=|<|>|=)\\s*${NUMBER}`));
  if (!op) return null;
  const value = toNumber(op[2]);
  if (value === undefined) return null;
  const operator = op[1] === '≥' || op[1] === '>=' ? '>=' : op[1] === '≤' || op[1] === '<=' ? '<=' : (op[1] as Parsed['operator']);
  return { operator, value };
};

/** true bila batas acuan dapat dievaluasi otomatis dari nilai numerik. */
export const isNumericBatas = (batas?: string | null) => parseBatasAcuan(batas) !== null;

export const evaluateHasil = (nilai: number | null | undefined, batas?: string | null): 'Lulus' | 'Tidak Lulus' | null => {
  if (nilai === null || nilai === undefined || !Number.isFinite(nilai)) return null;
  const p = parseBatasAcuan(batas);
  if (!p) return null;
  const v = p.value as number;
  const lulus =
    p.operator === 'range'
      ? nilai >= (p.min as number) && nilai <= (p.max as number)
      : p.operator === '>='
        ? nilai >= v
        : p.operator === '<='
          ? nilai <= v
          : p.operator === '>'
            ? nilai > v
            : p.operator === '<'
              ? nilai < v
              : nilai === v;
  return lulus ? 'Lulus' : 'Tidak Lulus';
};

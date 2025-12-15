// Shared utility functions used across apps.
// Minimal implementations so `tsc` has concrete exports to compile.

export const noop = (): void => {};

export const identity = <T>(v: T): T => v;

export const formatCurrency = (
  value: number | string | null | undefined,
  opts: { locale?: string; currency?: string } = {}
): string => {
  const { locale = "en-US", currency = "USD" } = opts;
  if (value == null || value === "") return "";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(num);
  } catch {
    return `${currency} ${num.toFixed(2)}`;
  }
};

export const clone = <T>(obj: T): T => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return obj;
  }
};

export const isObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === "object" && !Array.isArray(v);

export default {
  noop,
  identity,
  formatCurrency,
  clone,
  isObject,
};

export const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
] as const;

export type CurrencyCode = (typeof currencies)[number]['code'];

export function getCurrencyByCode(code: string) {
  return currencies.find((c) => c.code === code);
}

export function formatCurrencyOption(c: { code: string; symbol: string }) {
  return `${c.code} (${c.symbol})`;
}

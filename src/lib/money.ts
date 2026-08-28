export function formatMoney(cents: number, currency = 'USD'): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(dollars);
}

export function parseDollarsToCents(amountStr: string): number {
  const parsed = parseFloat(amountStr);
  if (isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

export function calculateSummary(incomeCents: number, expenseCents: number) {
  const netIncome = incomeCents - expenseCents;
  const savingsRate = incomeCents > 0 ? Math.max(0, netIncome / incomeCents) : 0;
  return {
    income: incomeCents,
    expenses: expenseCents,
    netIncome,
    savingsRate,
  };
}

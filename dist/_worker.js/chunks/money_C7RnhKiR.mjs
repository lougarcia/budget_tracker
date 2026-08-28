globalThis.process ??= {}; globalThis.process.env ??= {};
function formatMoney(cents, currency = "USD") {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(dollars);
}

export { formatMoney as f };

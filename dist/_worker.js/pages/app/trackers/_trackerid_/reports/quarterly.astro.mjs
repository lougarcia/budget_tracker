globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, b as createAstro, d as defineScriptVars, e as addAttribute, m as maybeRenderHead } from '../../../../../chunks/astro/server_BZuKIedG.mjs';
import { $ as $$Layout } from '../../../../../chunks/Layout_uP9enraT.mjs';
import { b as trackers, e as eq, f as transactions, c as categories, a as and, l as lte, g as gte } from '../../../../../chunks/schema_D3bIJDv1.mjs';
import { r as requireTrackerAccess } from '../../../../../chunks/auth-guards_eXZIgznn.mjs';
import { f as formatMoney } from '../../../../../chunks/money_C7RnhKiR.mjs';
import { d as desc } from '../../../../../chunks/select_DzL3WofE.mjs';
export { renderers } from '../../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Quarterly = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Quarterly;
  const { trackerId } = Astro2.params;
  const user = Astro2.locals.user;
  const db = Astro2.locals.db;
  const member = await requireTrackerAccess(db, user.id, trackerId).catch(() => null);
  if (!member) {
    return Astro2.redirect("/app/trackers");
  }
  const [tracker] = await db.select().from(trackers).where(eq(trackers.id, trackerId)).limit(1);
  if (!tracker) {
    return Astro2.redirect("/app/trackers");
  }
  const url = new URL(Astro2.request.url);
  const now = /* @__PURE__ */ new Date();
  const year = parseInt(url.searchParams.get("year") || String(now.getFullYear()));
  const quarter = parseInt(url.searchParams.get("quarter") || String(Math.floor(now.getMonth() / 3) + 1));
  const quarterStartMonth = (quarter - 1) * 3 + 1;
  const startDate = `${year}-${String(quarterStartMonth).padStart(2, "0")}-01`;
  const endMonth = quarterStartMonth + 2;
  const lastDay = new Date(year, endMonth, 0).getDate();
  const endDate = `${year}-${String(endMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  const quarterMonths = [
    { num: quarterStartMonth, name: new Date(0, quarterStartMonth - 1).toLocaleString("default", { month: "long" }) },
    { num: quarterStartMonth + 1, name: new Date(0, quarterStartMonth).toLocaleString("default", { month: "long" }) },
    { num: quarterStartMonth + 2, name: new Date(0, quarterStartMonth + 1).toLocaleString("default", { month: "long" }) }
  ];
  const quarterTransactions = await db.select({
    id: transactions.id,
    type: transactions.type,
    amount: transactions.amount,
    transactionDate: transactions.transactionDate,
    merchant: transactions.merchant,
    categoryName: categories.name,
    categoryId: transactions.categoryId
  }).from(transactions).innerJoin(categories, eq(transactions.categoryId, categories.id)).where(
    and(
      eq(transactions.trackerId, trackerId),
      gte(transactions.transactionDate, startDate),
      lte(transactions.transactionDate, endDate)
    )
  ).orderBy(desc(transactions.amount));
  let totalIncome = 0;
  let totalExpenses = 0;
  const categorySpendMap = /* @__PURE__ */ new Map();
  const monthlyData = /* @__PURE__ */ new Map();
  for (const m of quarterMonths) {
    monthlyData.set(m.num, { income: 0, expenses: 0 });
  }
  for (const tx of quarterTransactions) {
    const txMonth = parseInt(tx.transactionDate.split("-")[1]);
    if (tx.type === "income") {
      totalIncome += tx.amount;
      const monthData = monthlyData.get(txMonth);
      if (monthData) monthData.income += tx.amount;
    } else if (tx.type === "expense") {
      totalExpenses += tx.amount;
      const monthData = monthlyData.get(txMonth);
      if (monthData) monthData.expenses += tx.amount;
      const current = categorySpendMap.get(tx.categoryName) || 0;
      categorySpendMap.set(tx.categoryName, current + tx.amount);
    }
  }
  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.max(0, netIncome / totalIncome) : 0;
  const categoryBreakdown = Array.from(categorySpendMap.entries()).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total);
  const monthlyBreakdown = quarterMonths.map((m) => ({
    ...m,
    ...monthlyData.get(m.num) || { income: 0, expenses: 0 }
  }));
  const topPurchases = [...quarterTransactions].filter((tx) => tx.type === "expense").slice(0, 10);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Quarterly Report \u2014 ${tracker.name}` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="space-y-8"> <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <div> <div class="flex items-center gap-3"> <a', ' class="text-sm font-medium text-indigo-600 hover:underline">\u2190 Back to Dashboard</a> <span class="text-slate-300">/</span> <h1 class="text-2xl font-bold text-slate-900">Quarterly Financial Report</h1> </div> <p class="text-slate-600 text-sm mt-1">Q', " ", " \u2014 ", " to ", '</p> </div> <div class="flex items-center gap-2"> <select id="quarter-select" class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"> ', ' </select> <select id="year-select" class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"> ', ' </select> </div> </div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Total Income</p> <p class="text-2xl font-extrabold text-emerald-600 mt-2">', '</p> </div> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Total Expenses</p> <p class="text-2xl font-extrabold text-rose-600 mt-2">', '</p> </div> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Net Income</p> <p', "> ", ' </p> </div> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Savings Rate</p> <p class="text-2xl font-extrabold text-slate-900 mt-2">', '%</p> </div> </div> <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"> <h2 class="text-lg font-bold text-slate-900 mb-4">Monthly Breakdown</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> ', ' </div> </div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8"> <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"> <h2 class="text-lg font-bold text-slate-900 mb-4">Expenses by Category</h2> ', ' </div> <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"> <h2 class="text-lg font-bold text-slate-900 mb-4">Top 10 Purchases</h2> ', " </div> </div> </div> <script>(function(){", "\n    const quarterSelect = document.getElementById('quarter-select');\n    const yearSelect = document.getElementById('year-select');\n\n    function updatePeriod() {\n      const q = quarterSelect.value;\n      const y = yearSelect.value;\n      window.location.href = `/app/trackers/${trackerId}/reports/quarterly?year=${y}&quarter=${q}`;\n    }\n\n    quarterSelect?.addEventListener('change', updatePeriod);\n    yearSelect?.addEventListener('change', updatePeriod);\n  })();<\/script> "], [" ", '<div class="space-y-8"> <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <div> <div class="flex items-center gap-3"> <a', ' class="text-sm font-medium text-indigo-600 hover:underline">\u2190 Back to Dashboard</a> <span class="text-slate-300">/</span> <h1 class="text-2xl font-bold text-slate-900">Quarterly Financial Report</h1> </div> <p class="text-slate-600 text-sm mt-1">Q', " ", " \u2014 ", " to ", '</p> </div> <div class="flex items-center gap-2"> <select id="quarter-select" class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"> ', ' </select> <select id="year-select" class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"> ', ' </select> </div> </div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Total Income</p> <p class="text-2xl font-extrabold text-emerald-600 mt-2">', '</p> </div> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Total Expenses</p> <p class="text-2xl font-extrabold text-rose-600 mt-2">', '</p> </div> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Net Income</p> <p', "> ", ' </p> </div> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Savings Rate</p> <p class="text-2xl font-extrabold text-slate-900 mt-2">', '%</p> </div> </div> <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"> <h2 class="text-lg font-bold text-slate-900 mb-4">Monthly Breakdown</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> ', ' </div> </div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8"> <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"> <h2 class="text-lg font-bold text-slate-900 mb-4">Expenses by Category</h2> ', ' </div> <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"> <h2 class="text-lg font-bold text-slate-900 mb-4">Top 10 Purchases</h2> ', " </div> </div> </div> <script>(function(){", "\n    const quarterSelect = document.getElementById('quarter-select');\n    const yearSelect = document.getElementById('year-select');\n\n    function updatePeriod() {\n      const q = quarterSelect.value;\n      const y = yearSelect.value;\n      window.location.href = \\`/app/trackers/\\${trackerId}/reports/quarterly?year=\\${y}&quarter=\\${q}\\`;\n    }\n\n    quarterSelect?.addEventListener('change', updatePeriod);\n    yearSelect?.addEventListener('change', updatePeriod);\n  })();<\/script> "])), maybeRenderHead(), addAttribute(`/app/trackers/${trackerId}`, "href"), quarter, year, startDate, endDate, [1, 2, 3, 4].map((q) => renderTemplate`<option${addAttribute(q, "value")}${addAttribute(q === quarter, "selected")}>Q${q}</option>`), [2024, 2025, 2026, 2027].map((y) => renderTemplate`<option${addAttribute(y, "value")}${addAttribute(y === year, "selected")}>${y}</option>`), formatMoney(totalIncome, tracker.currency), formatMoney(totalExpenses, tracker.currency), addAttribute(`text-2xl font-extrabold mt-2 ${netIncome >= 0 ? "text-indigo-600" : "text-rose-600"}`, "class"), formatMoney(netIncome, tracker.currency), (savingsRate * 100).toFixed(1), monthlyBreakdown.map((m) => renderTemplate`<div class="bg-slate-50 rounded-xl p-4"> <h3 class="font-semibold text-slate-900 mb-3">${m.name}</h3> <div class="space-y-2 text-sm"> <div class="flex justify-between"> <span class="text-slate-600">Income</span> <span class="font-bold text-emerald-600">${formatMoney(m.income, tracker.currency)}</span> </div> <div class="flex justify-between"> <span class="text-slate-600">Expenses</span> <span class="font-bold text-rose-600">${formatMoney(m.expenses, tracker.currency)}</span> </div> <div class="flex justify-between pt-2 border-t border-slate-200"> <span class="text-slate-600">Net</span> <span${addAttribute(`font-bold ${m.income - m.expenses >= 0 ? "text-emerald-600" : "text-rose-600"}`, "class")}> ${formatMoney(m.income - m.expenses, tracker.currency)} </span> </div> </div> </div>`), categoryBreakdown.length === 0 ? renderTemplate`<p class="text-sm text-slate-500 py-8 text-center">No expense categories recorded this quarter.</p>` : renderTemplate`<div class="space-y-4"> ${categoryBreakdown.map((cat) => {
    const pct = totalExpenses > 0 ? cat.total / totalExpenses * 100 : 0;
    return renderTemplate`<div> <div class="flex justify-between text-sm mb-1"> <span class="font-semibold text-slate-800">${cat.name}</span> <span class="font-bold text-slate-900">${formatMoney(cat.total, tracker.currency)} (${pct.toFixed(1)}%)</span> </div> <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden"> <div class="bg-indigo-600 h-2 rounded-full"${addAttribute(`width: ${pct}%`, "style")}></div> </div> </div>`;
  })} </div>`, topPurchases.length === 0 ? renderTemplate`<p class="text-sm text-slate-500 py-8 text-center">No purchases recorded this quarter.</p>` : renderTemplate`<div class="divide-y divide-slate-100"> ${topPurchases.map((tx) => renderTemplate`<div class="py-3 flex justify-between items-center"> <div> <p class="font-semibold text-slate-900">${tx.merchant}</p> <p class="text-xs text-slate-500">${tx.categoryName} • ${tx.transactionDate}</p> </div> <span class="font-bold text-rose-600">${formatMoney(tx.amount, tracker.currency)}</span> </div>`)} </div>`, defineScriptVars({ trackerId, year, quarter })) })}`;
}, "C:/workspace/personal/mvp/buget_tracker/src/pages/app/trackers/[trackerId]/reports/quarterly.astro", void 0);

const $$file = "C:/workspace/personal/mvp/buget_tracker/src/pages/app/trackers/[trackerId]/reports/quarterly.astro";
const $$url = "/app/trackers/[trackerId]/reports/quarterly";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Quarterly,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

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
const $$Yearly = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Yearly;
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
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  const yearTransactions = await db.select({
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
  for (let m = 1; m <= 12; m++) {
    monthlyData.set(m, { income: 0, expenses: 0 });
  }
  for (const tx of yearTransactions) {
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
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const monthlyBreakdown = months.map((m) => ({
    num: m,
    name: new Date(0, m - 1).toLocaleString("default", { month: "short" }),
    fullName: new Date(0, m - 1).toLocaleString("default", { month: "long" }),
    ...monthlyData.get(m) || { income: 0, expenses: 0 }
  }));
  const topPurchases = [...yearTransactions].filter((tx) => tx.type === "expense").slice(0, 10);
  const maxMonthlyExpense = Math.max(...monthlyBreakdown.map((m) => m.expenses));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Yearly Report \u2014 ${tracker.name}` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="space-y-8"> <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <div> <div class="flex items-center gap-3"> <a', ' class="text-sm font-medium text-indigo-600 hover:underline">\u2190 Back to Dashboard</a> <span class="text-slate-300">/</span> <h1 class="text-2xl font-bold text-slate-900">Yearly Financial Report</h1> </div> <p class="text-slate-600 text-sm mt-1">', " \u2014 ", " to ", '</p> </div> <div class="flex items-center gap-2"> <select id="year-select" class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"> ', ' </select> </div> </div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Total Income</p> <p class="text-2xl font-extrabold text-emerald-600 mt-2">', '</p> </div> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Total Expenses</p> <p class="text-2xl font-extrabold text-rose-600 mt-2">', '</p> </div> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Net Income</p> <p', "> ", ' </p> </div> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Savings Rate</p> <p class="text-2xl font-extrabold text-slate-900 mt-2">', '%</p> </div> </div> <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"> <h2 class="text-lg font-bold text-slate-900 mb-6">Monthly Overview</h2> <div class="overflow-x-auto"> <table class="w-full text-left border-collapse"> <thead> <tr class="border-b border-slate-200"> <th class="pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Month</th> <th class="pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Income</th> <th class="pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Expenses</th> <th class="pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Net</th> <th class="pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Visual</th> </tr> </thead> <tbody class="divide-y divide-slate-100 text-sm"> ', ' </tbody> </table> </div> </div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8"> <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"> <h2 class="text-lg font-bold text-slate-900 mb-4">Expenses by Category</h2> ', ' </div> <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"> <h2 class="text-lg font-bold text-slate-900 mb-4">Top 10 Purchases</h2> ', " </div> </div> </div> <script>(function(){", "\n    const yearSelect = document.getElementById('year-select');\n\n    function updatePeriod() {\n      const y = yearSelect.value;\n      window.location.href = `/app/trackers/${trackerId}/reports/yearly?year=${y}`;\n    }\n\n    yearSelect?.addEventListener('change', updatePeriod);\n  })();<\/script> "], [" ", '<div class="space-y-8"> <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <div> <div class="flex items-center gap-3"> <a', ' class="text-sm font-medium text-indigo-600 hover:underline">\u2190 Back to Dashboard</a> <span class="text-slate-300">/</span> <h1 class="text-2xl font-bold text-slate-900">Yearly Financial Report</h1> </div> <p class="text-slate-600 text-sm mt-1">', " \u2014 ", " to ", '</p> </div> <div class="flex items-center gap-2"> <select id="year-select" class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"> ', ' </select> </div> </div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Total Income</p> <p class="text-2xl font-extrabold text-emerald-600 mt-2">', '</p> </div> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Total Expenses</p> <p class="text-2xl font-extrabold text-rose-600 mt-2">', '</p> </div> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Net Income</p> <p', "> ", ' </p> </div> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Savings Rate</p> <p class="text-2xl font-extrabold text-slate-900 mt-2">', '%</p> </div> </div> <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"> <h2 class="text-lg font-bold text-slate-900 mb-6">Monthly Overview</h2> <div class="overflow-x-auto"> <table class="w-full text-left border-collapse"> <thead> <tr class="border-b border-slate-200"> <th class="pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Month</th> <th class="pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Income</th> <th class="pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Expenses</th> <th class="pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Net</th> <th class="pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Visual</th> </tr> </thead> <tbody class="divide-y divide-slate-100 text-sm"> ', ' </tbody> </table> </div> </div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8"> <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"> <h2 class="text-lg font-bold text-slate-900 mb-4">Expenses by Category</h2> ', ' </div> <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"> <h2 class="text-lg font-bold text-slate-900 mb-4">Top 10 Purchases</h2> ', " </div> </div> </div> <script>(function(){", "\n    const yearSelect = document.getElementById('year-select');\n\n    function updatePeriod() {\n      const y = yearSelect.value;\n      window.location.href = \\`/app/trackers/\\${trackerId}/reports/yearly?year=\\${y}\\`;\n    }\n\n    yearSelect?.addEventListener('change', updatePeriod);\n  })();<\/script> "])), maybeRenderHead(), addAttribute(`/app/trackers/${trackerId}`, "href"), year, startDate, endDate, [2024, 2025, 2026, 2027].map((y) => renderTemplate`<option${addAttribute(y, "value")}${addAttribute(y === year, "selected")}>${y}</option>`), formatMoney(totalIncome, tracker.currency), formatMoney(totalExpenses, tracker.currency), addAttribute(`text-2xl font-extrabold mt-2 ${netIncome >= 0 ? "text-indigo-600" : "text-rose-600"}`, "class"), formatMoney(netIncome, tracker.currency), (savingsRate * 100).toFixed(1), monthlyBreakdown.map((m) => {
    const net = m.income - m.expenses;
    const barWidth = maxMonthlyExpense > 0 ? m.expenses / maxMonthlyExpense * 100 : 0;
    return renderTemplate`<tr class="hover:bg-slate-50/50 transition"> <td class="py-3 font-semibold text-slate-900">${m.fullName}</td> <td class="py-3 text-right font-bold text-emerald-600">${formatMoney(m.income, tracker.currency)}</td> <td class="py-3 text-right font-bold text-rose-600">${formatMoney(m.expenses, tracker.currency)}</td> <td${addAttribute(`py-3 text-right font-bold ${net >= 0 ? "text-emerald-600" : "text-rose-600"}`, "class")}> ${formatMoney(net, tracker.currency)} </td> <td class="py-3"> <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden"> <div class="bg-indigo-500 h-2 rounded-full"${addAttribute(`width: ${barWidth}%`, "style")}></div> </div> </td> </tr>`;
  }), categoryBreakdown.length === 0 ? renderTemplate`<p class="text-sm text-slate-500 py-8 text-center">No expense categories recorded this year.</p>` : renderTemplate`<div class="space-y-4"> ${categoryBreakdown.map((cat) => {
    const pct = totalExpenses > 0 ? cat.total / totalExpenses * 100 : 0;
    return renderTemplate`<div> <div class="flex justify-between text-sm mb-1"> <span class="font-semibold text-slate-800">${cat.name}</span> <span class="font-bold text-slate-900">${formatMoney(cat.total, tracker.currency)} (${pct.toFixed(1)}%)</span> </div> <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden"> <div class="bg-indigo-600 h-2 rounded-full"${addAttribute(`width: ${pct}%`, "style")}></div> </div> </div>`;
  })} </div>`, topPurchases.length === 0 ? renderTemplate`<p class="text-sm text-slate-500 py-8 text-center">No purchases recorded this year.</p>` : renderTemplate`<div class="divide-y divide-slate-100"> ${topPurchases.map((tx) => renderTemplate`<div class="py-3 flex justify-between items-center"> <div> <p class="font-semibold text-slate-900">${tx.merchant}</p> <p class="text-xs text-slate-500">${tx.categoryName} • ${tx.transactionDate}</p> </div> <span class="font-bold text-rose-600">${formatMoney(tx.amount, tracker.currency)}</span> </div>`)} </div>`, defineScriptVars({ trackerId, year })) })}`;
}, "C:/workspace/personal/mvp/buget_tracker/src/pages/app/trackers/[trackerId]/reports/yearly.astro", void 0);

const $$file = "C:/workspace/personal/mvp/buget_tracker/src/pages/app/trackers/[trackerId]/reports/yearly.astro";
const $$url = "/app/trackers/[trackerId]/reports/yearly";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Yearly,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

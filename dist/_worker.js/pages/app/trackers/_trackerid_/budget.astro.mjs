globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, b as createAstro, d as defineScriptVars, e as addAttribute, m as maybeRenderHead } from '../../../../chunks/astro/server_BZuKIedG.mjs';
import { $ as $$Layout } from '../../../../chunks/Layout_uP9enraT.mjs';
import { b as trackers, e as eq, c as categories, a as and, d as budgets, f as transactions, s as sql, l as lte, g as gte } from '../../../../chunks/schema_D3bIJDv1.mjs';
import { r as requireTrackerAccess } from '../../../../chunks/auth-guards_eXZIgznn.mjs';
import { f as formatMoney } from '../../../../chunks/money_C7RnhKiR.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Budget = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Budget;
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
  const month = parseInt(url.searchParams.get("month") || String(now.getMonth() + 1));
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  const expenseCategories = await db.select().from(categories).where(and(eq(categories.trackerId, trackerId), eq(categories.type, "expense")));
  const monthBudgets = await db.select().from(budgets).where(
    and(
      eq(budgets.trackerId, trackerId),
      eq(budgets.year, year),
      eq(budgets.month, month)
    )
  );
  const budgetMap = new Map(monthBudgets.map((b) => [b.categoryId, b.amount]));
  const actuals = await db.select({
    categoryId: transactions.categoryId,
    total: sql`sum(${transactions.amount})`
  }).from(transactions).where(
    and(
      eq(transactions.trackerId, trackerId),
      eq(transactions.type, "expense"),
      gte(transactions.transactionDate, startDate),
      lte(transactions.transactionDate, endDate)
    )
  ).groupBy(transactions.categoryId);
  const actualMap = new Map(actuals.map((a) => [a.categoryId, a.total || 0]));
  let totalBudgeted = 0;
  let totalActual = 0;
  const budgetRows = expenseCategories.map((cat) => {
    const budget = Number(budgetMap.get(cat.id) || 0);
    const actual = Number(actualMap.get(cat.id) || 0);
    const remaining = budget - actual;
    const percentage = budget > 0 ? actual / budget * 100 : 0;
    totalBudgeted += budget;
    totalActual += actual;
    return {
      ...cat,
      budget,
      actual,
      remaining,
      percentage
    };
  });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Budgets \u2014 ${tracker.name}` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="space-y-8"> <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <div> <div class="flex items-center gap-3"> <a', ' class="text-sm font-medium text-indigo-600 hover:underline">\u2190 Back to Dashboard</a> <span class="text-slate-300">/</span> <h1 class="text-2xl font-bold text-slate-900">Monthly Budgets</h1> </div> <p class="text-slate-600 text-sm mt-1">', '</p> </div> <div class="flex items-center gap-2"> <select id="month-select" class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"> ', ' </select> <select id="year-select" class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"> ', ' </select> </div> </div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-6"> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Total Budgeted</p> <p class="text-2xl font-extrabold text-slate-900 mt-2">', '</p> </div> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Total Spent</p> <p class="text-2xl font-extrabold text-rose-600 mt-2">', '</p> </div> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Remaining Budget</p> <p', "> ", ' </p> </div> </div> <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"> <div class="px-6 py-4 border-b border-slate-200"> <h2 class="text-lg font-bold text-slate-900">Expense Categories & Budgets</h2> </div> <div class="overflow-x-auto"> <table class="w-full text-left border-collapse"> <thead> <tr class="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200"> <th class="px-6 py-3">Category</th> <th class="px-6 py-3 text-right">Budget</th> <th class="px-6 py-3 text-right">Actual</th> <th class="px-6 py-3 text-right">Remaining</th> <th class="px-6 py-3 w-48">Progress</th> <th class="px-6 py-3 text-right">Action</th> </tr> </thead> <tbody class="divide-y divide-slate-100 text-sm"> ', ' </tbody> </table> </div> </div> </div> <div id="budget-modal" class="fixed inset-0 bg-black/50 hidden items-center justify-center p-4 z-50"> <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl"> <h2 id="modal-title" class="text-xl font-bold text-slate-900 mb-4">Set Budget</h2> <form id="budget-form" class="space-y-4"> <input type="hidden" id="modal-cat-id"> <div> <label class="block text-sm font-medium text-slate-700 mb-1">Monthly Budget Amount (', ')</label> <input type="number" step="0.01" min="0" id="modal-amount" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> </div> <div id="budget-modal-error" class="text-sm text-red-600 hidden"></div> <div class="flex justify-end gap-3 pt-2"> <button type="button" onclick="closeBudgetModal()" class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Cancel</button> <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Save Budget</button> </div> </form> </div> </div> <script>(function(){', "\n    const monthSelect = document.getElementById('month-select');\n    const yearSelect = document.getElementById('year-select');\n\n    function updatePeriod() {\n      const m = monthSelect.value;\n      const y = yearSelect.value;\n      window.location.href = `/app/trackers/${trackerId}/budget?year=${y}&month=${m}`;\n    }\n\n    monthSelect?.addEventListener('change', updatePeriod);\n    yearSelect?.addEventListener('change', updatePeriod);\n\n    const modal = document.getElementById('budget-modal');\n    const modalTitle = document.getElementById('modal-title');\n    const modalCatId = document.getElementById('modal-cat-id');\n    const modalAmount = document.getElementById('modal-amount');\n    const budgetForm = document.getElementById('budget-form');\n    const errorDiv = document.getElementById('budget-modal-error');\n\n    window.openBudgetModal = (catId, catName, currentAmount) => {\n      if (modalTitle) modalTitle.textContent = `Set Budget: ${catName}`;\n      if (modalCatId) modalCatId.value = catId;\n      if (modalAmount) modalAmount.value = currentAmount ? currentAmount : '';\n      modal?.classList.remove('hidden');\n      modal?.classList.add('flex');\n    };\n\n    window.closeBudgetModal = () => {\n      modal?.classList.add('hidden');\n      modal?.classList.remove('flex');\n    };\n\n    budgetForm?.addEventListener('submit', async (e) => {\n      e.preventDefault();\n      if (errorDiv) errorDiv.classList.add('hidden');\n      const rawAmount = parseFloat(modalAmount.value || '0');\n      const amountCents = Math.round(rawAmount * 100);\n\n      const payload = {\n        trackerId,\n        categoryId: modalCatId.value,\n        year,\n        month,\n        amount: amountCents,\n      };\n\n      try {\n        const res = await fetch('/api/rpc', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ action: 'budget.set', payload }),\n        });\n        const data = await res.json();\n        if (data.success) {\n          window.location.reload();\n        } else {\n          if (errorDiv) {\n            errorDiv.textContent = data.error.message;\n            errorDiv.classList.remove('hidden');\n          }\n        }\n      } catch (err) {\n        if (errorDiv) {\n          errorDiv.textContent = 'Failed to save budget';\n          errorDiv.classList.remove('hidden');\n        }\n      }\n    });\n  })();<\/script> "], [" ", '<div class="space-y-8"> <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <div> <div class="flex items-center gap-3"> <a', ' class="text-sm font-medium text-indigo-600 hover:underline">\u2190 Back to Dashboard</a> <span class="text-slate-300">/</span> <h1 class="text-2xl font-bold text-slate-900">Monthly Budgets</h1> </div> <p class="text-slate-600 text-sm mt-1">', '</p> </div> <div class="flex items-center gap-2"> <select id="month-select" class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"> ', ' </select> <select id="year-select" class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"> ', ' </select> </div> </div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-6"> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Total Budgeted</p> <p class="text-2xl font-extrabold text-slate-900 mt-2">', '</p> </div> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Total Spent</p> <p class="text-2xl font-extrabold text-rose-600 mt-2">', '</p> </div> <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <p class="text-sm font-medium text-slate-500">Remaining Budget</p> <p', "> ", ' </p> </div> </div> <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"> <div class="px-6 py-4 border-b border-slate-200"> <h2 class="text-lg font-bold text-slate-900">Expense Categories & Budgets</h2> </div> <div class="overflow-x-auto"> <table class="w-full text-left border-collapse"> <thead> <tr class="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200"> <th class="px-6 py-3">Category</th> <th class="px-6 py-3 text-right">Budget</th> <th class="px-6 py-3 text-right">Actual</th> <th class="px-6 py-3 text-right">Remaining</th> <th class="px-6 py-3 w-48">Progress</th> <th class="px-6 py-3 text-right">Action</th> </tr> </thead> <tbody class="divide-y divide-slate-100 text-sm"> ', ' </tbody> </table> </div> </div> </div> <div id="budget-modal" class="fixed inset-0 bg-black/50 hidden items-center justify-center p-4 z-50"> <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl"> <h2 id="modal-title" class="text-xl font-bold text-slate-900 mb-4">Set Budget</h2> <form id="budget-form" class="space-y-4"> <input type="hidden" id="modal-cat-id"> <div> <label class="block text-sm font-medium text-slate-700 mb-1">Monthly Budget Amount (', ')</label> <input type="number" step="0.01" min="0" id="modal-amount" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> </div> <div id="budget-modal-error" class="text-sm text-red-600 hidden"></div> <div class="flex justify-end gap-3 pt-2"> <button type="button" onclick="closeBudgetModal()" class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Cancel</button> <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Save Budget</button> </div> </form> </div> </div> <script>(function(){', "\n    const monthSelect = document.getElementById('month-select');\n    const yearSelect = document.getElementById('year-select');\n\n    function updatePeriod() {\n      const m = monthSelect.value;\n      const y = yearSelect.value;\n      window.location.href = \\`/app/trackers/\\${trackerId}/budget?year=\\${y}&month=\\${m}\\`;\n    }\n\n    monthSelect?.addEventListener('change', updatePeriod);\n    yearSelect?.addEventListener('change', updatePeriod);\n\n    const modal = document.getElementById('budget-modal');\n    const modalTitle = document.getElementById('modal-title');\n    const modalCatId = document.getElementById('modal-cat-id');\n    const modalAmount = document.getElementById('modal-amount');\n    const budgetForm = document.getElementById('budget-form');\n    const errorDiv = document.getElementById('budget-modal-error');\n\n    window.openBudgetModal = (catId, catName, currentAmount) => {\n      if (modalTitle) modalTitle.textContent = \\`Set Budget: \\${catName}\\`;\n      if (modalCatId) modalCatId.value = catId;\n      if (modalAmount) modalAmount.value = currentAmount ? currentAmount : '';\n      modal?.classList.remove('hidden');\n      modal?.classList.add('flex');\n    };\n\n    window.closeBudgetModal = () => {\n      modal?.classList.add('hidden');\n      modal?.classList.remove('flex');\n    };\n\n    budgetForm?.addEventListener('submit', async (e) => {\n      e.preventDefault();\n      if (errorDiv) errorDiv.classList.add('hidden');\n      const rawAmount = parseFloat(modalAmount.value || '0');\n      const amountCents = Math.round(rawAmount * 100);\n\n      const payload = {\n        trackerId,\n        categoryId: modalCatId.value,\n        year,\n        month,\n        amount: amountCents,\n      };\n\n      try {\n        const res = await fetch('/api/rpc', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ action: 'budget.set', payload }),\n        });\n        const data = await res.json();\n        if (data.success) {\n          window.location.reload();\n        } else {\n          if (errorDiv) {\n            errorDiv.textContent = data.error.message;\n            errorDiv.classList.remove('hidden');\n          }\n        }\n      } catch (err) {\n        if (errorDiv) {\n          errorDiv.textContent = 'Failed to save budget';\n          errorDiv.classList.remove('hidden');\n        }\n      }\n    });\n  })();<\/script> "])), maybeRenderHead(), addAttribute(`/app/trackers/${trackerId}?year=${year}&month=${month}`, "href"), new Date(year, month - 1).toLocaleString("default", { month: "long", year: "numeric" }), Array.from({ length: 12 }, (_, i) => i + 1).map((m) => renderTemplate`<option${addAttribute(m, "value")}${addAttribute(m === month, "selected")}> ${new Date(0, m - 1).toLocaleString("default", { month: "long" })} </option>`), [2024, 2025, 2026, 2027].map((y) => renderTemplate`<option${addAttribute(y, "value")}${addAttribute(y === year, "selected")}>${y}</option>`), formatMoney(totalBudgeted, tracker.currency), formatMoney(totalActual, tracker.currency), addAttribute(`text-2xl font-extrabold mt-2 ${totalBudgeted - totalActual >= 0 ? "text-emerald-600" : "text-rose-600"}`, "class"), formatMoney(totalBudgeted - totalActual, tracker.currency), budgetRows.map((row) => renderTemplate`<tr class="hover:bg-slate-50/50 transition"> <td class="px-6 py-4 font-semibold text-slate-900">${row.name}</td> <td class="px-6 py-4 text-right font-medium text-slate-700">${formatMoney(row.budget, tracker.currency)}</td> <td class="px-6 py-4 text-right font-bold text-rose-600">${formatMoney(row.actual, tracker.currency)}</td> <td${addAttribute(`px-6 py-4 text-right font-semibold ${row.remaining >= 0 ? "text-emerald-600" : "text-rose-600"}`, "class")}> ${formatMoney(row.remaining, tracker.currency)} </td> <td class="px-6 py-4"> <div class="flex items-center gap-3"> <div class="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden"> <div${addAttribute(`h-2.5 rounded-full ${row.percentage > 100 ? "bg-rose-500" : row.percentage > 80 ? "bg-amber-500" : "bg-emerald-500"}`, "class")}${addAttribute(`width: ${Math.min(row.percentage, 100)}%`, "style")}></div> </div> <span class="text-xs font-semibold text-slate-600 w-12 text-right">${row.percentage.toFixed(0)}%</span> </div> </td> <td class="px-6 py-4 text-right"> <button${addAttribute(`openBudgetModal('${row.id}', '${row.name}', ${row.budget / 100})`, "onclick")} class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition">
Edit Budget
</button> </td> </tr>`), tracker.currency, defineScriptVars({ trackerId, year, month })) })}`;
}, "C:/workspace/personal/mvp/buget_tracker/src/pages/app/trackers/[trackerId]/budget.astro", void 0);

const $$file = "C:/workspace/personal/mvp/buget_tracker/src/pages/app/trackers/[trackerId]/budget.astro";
const $$url = "/app/trackers/[trackerId]/budget";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Budget,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

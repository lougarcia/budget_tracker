globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, b as createAstro, d as defineScriptVars, e as addAttribute, m as maybeRenderHead } from '../../../../chunks/astro/server_BZuKIedG.mjs';
import { $ as $$Layout } from '../../../../chunks/Layout_uP9enraT.mjs';
import { b as trackers, e as eq, c as categories, f as transactions, s as sql, a as and } from '../../../../chunks/schema_D3bIJDv1.mjs';
import { r as requireTrackerAccess } from '../../../../chunks/auth-guards_eXZIgznn.mjs';
import { f as formatMoney } from '../../../../chunks/money_C7RnhKiR.mjs';
import { d as desc, a as asc } from '../../../../chunks/select_DzL3WofE.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Transactions = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Transactions;
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
  const search = url.searchParams.get("search") || "";
  const typeFilter = url.searchParams.get("type") || "";
  const categoryFilter = url.searchParams.get("category") || "";
  const sortBy = url.searchParams.get("sort") || "date-desc";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;
  const trackerCategories = await db.select().from(categories).where(eq(categories.trackerId, trackerId));
  db.select({
    id: transactions.id,
    type: transactions.type,
    amount: transactions.amount,
    transactionDate: transactions.transactionDate,
    merchant: transactions.merchant,
    description: transactions.description,
    categoryId: transactions.categoryId,
    categoryName: categories.name,
    paymentMethod: transactions.paymentMethod,
    notes: transactions.notes
  }).from(transactions).innerJoin(categories, eq(transactions.categoryId, categories.id)).where(eq(transactions.trackerId, trackerId));
  const conditions = [eq(transactions.trackerId, trackerId)];
  if (search) {
    conditions.push(
      sql`(${transactions.merchant} LIKE ${`%${search}%`} OR ${transactions.description} LIKE ${`%${search}%`} OR ${transactions.notes} LIKE ${`%${search}%`})`
    );
  }
  if (typeFilter && (typeFilter === "income" || typeFilter === "expense")) {
    conditions.push(eq(transactions.type, typeFilter));
  }
  if (categoryFilter) {
    conditions.push(eq(transactions.categoryId, categoryFilter));
  }
  const whereClause = and(...conditions);
  const [countResult] = await db.select({ count: sql`count(*)` }).from(transactions).where(whereClause);
  const totalCount = countResult?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);
  let orderClause;
  switch (sortBy) {
    case "date-asc":
      orderClause = asc(transactions.transactionDate);
      break;
    case "amount-desc":
      orderClause = desc(transactions.amount);
      break;
    case "amount-asc":
      orderClause = asc(transactions.amount);
      break;
    default:
      orderClause = desc(transactions.transactionDate);
  }
  const allTransactions = await db.select({
    id: transactions.id,
    type: transactions.type,
    amount: transactions.amount,
    transactionDate: transactions.transactionDate,
    merchant: transactions.merchant,
    description: transactions.description,
    categoryId: transactions.categoryId,
    categoryName: categories.name,
    paymentMethod: transactions.paymentMethod,
    notes: transactions.notes
  }).from(transactions).innerJoin(categories, eq(transactions.categoryId, categories.id)).where(whereClause).orderBy(orderClause).limit(limit).offset(offset);
  function buildUrl(params) {
    const newUrl = new URL(Astro2.request.url);
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        newUrl.searchParams.set(key, value);
      } else {
        newUrl.searchParams.delete(key);
      }
    }
    if (params.search || params.type || params.category || params.sort) {
      newUrl.searchParams.delete("page");
    }
    return newUrl.pathname + newUrl.search;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Transactions \u2014 ${tracker.name}` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="space-y-6"> <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <div> <div class="flex items-center gap-3"> <a', ' class="text-sm font-medium text-indigo-600 hover:underline">\u2190 Back to Dashboard</a> <span class="text-slate-300">/</span> <h1 class="text-2xl font-bold text-slate-900">All Transactions</h1> </div> <p class="text-slate-600 text-sm mt-1">', ' transactions found</p> </div> <button id="open-tx-modal" class="bg-indigo-600 text-white font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition text-sm">\n+ Add Transaction\n</button> </div> <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"> <form id="filter-form" class="flex flex-col sm:flex-row gap-3"> <div class="flex-1"> <label for="search-input" class="sr-only">Search transactions</label> <input type="text" id="search-input" name="search"', ' placeholder="Search by merchant, description, or notes..." class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> </div> <div class="flex gap-2"> <select name="type" class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"> <option value="">All Types</option> <option value="income"', '>Income</option> <option value="expense"', '>Expense</option> </select> <select name="category" class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"> <option value="">All Categories</option> ', ' </select> <select name="sort" class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"> <option value="date-desc"', '>Newest First</option> <option value="date-asc"', '>Oldest First</option> <option value="amount-desc"', '>Highest Amount</option> <option value="amount-asc"', '>Lowest Amount</option> </select> <button type="submit" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium text-sm">\nFilter\n</button> </div> </form> </div> <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"> ', " </div> ", ' </div> <div id="tx-modal" class="fixed inset-0 bg-black/50 hidden items-center justify-center p-4 z-50"> <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto"> <h2 class="text-xl font-bold text-slate-900 mb-4">Add Transaction</h2> <form id="tx-form" class="space-y-4"> <input type="hidden" name="trackerId"', '> <div class="grid grid-cols-2 gap-4"> <div> <label for="tx-type" class="block text-sm font-medium text-slate-700 mb-1">Type</label> <select name="type" id="tx-type" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> <option value="expense">Expense</option> <option value="income">Income</option> </select> </div> <div> <label for="tx-amount" class="block text-sm font-medium text-slate-700 mb-1">Amount (', ')</label> <input type="number" step="0.01" min="0.01" name="amount" id="tx-amount" required placeholder="0.00" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> </div> </div> <div class="grid grid-cols-2 gap-4"> <div> <label for="tx-date" class="block text-sm font-medium text-slate-700 mb-1">Date</label> <input type="date" name="transactionDate" id="tx-date" required', ' class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> </div> <div> <label for="tx-merchant" class="block text-sm font-medium text-slate-700 mb-1">Merchant</label> <input type="text" name="merchant" id="tx-merchant" required placeholder="e.g. Whole Foods" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> </div> </div> <div> <label for="category-select" class="block text-sm font-medium text-slate-700 mb-1">Category</label> <select name="categoryId" id="category-select" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> ', ' </select> </div> <div> <label for="tx-description" class="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label> <input type="text" name="description" id="tx-description" placeholder="Brief details" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> </div> <div> <label for="tx-payment" class="block text-sm font-medium text-slate-700 mb-1">Payment Method (Optional)</label> <select name="paymentMethod" id="tx-payment" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> <option value="">Select...</option> <option value="cash">Cash</option> <option value="credit_card">Credit Card</option> <option value="debit_card">Debit Card</option> <option value="bank_transfer">Bank Transfer</option> <option value="digital_wallet">Digital Wallet</option> <option value="other">Other</option> </select> </div> <div> <label for="tx-notes" class="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label> <textarea name="notes" id="tx-notes" rows="2" placeholder="Additional notes..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"></textarea> </div> <div id="tx-modal-error" class="text-sm text-red-600 hidden" role="alert"></div> <div class="flex justify-end gap-3 pt-2"> <button type="button" id="close-tx-modal" class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Cancel</button> <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Save Transaction</button> </div> </form> </div> </div> <script>(function(){', "\n    const modal = document.getElementById('tx-modal');\n    const openBtn = document.getElementById('open-tx-modal');\n    const closeBtn = document.getElementById('close-tx-modal');\n    const form = document.getElementById('tx-form');\n    const errorDiv = document.getElementById('tx-modal-error');\n    const typeSelect = document.getElementById('tx-type');\n    const categorySelect = document.getElementById('category-select');\n\n    openBtn?.addEventListener('click', () => {\n      modal?.classList.remove('hidden');\n      modal?.classList.add('flex');\n    });\n    closeBtn?.addEventListener('click', () => {\n      modal?.classList.add('hidden');\n      modal?.classList.remove('flex');\n    });\n\n    typeSelect?.addEventListener('change', () => {\n      const selectedType = typeSelect.value;\n      Array.from(categorySelect.options).forEach((opt) => {\n        const type = opt.getAttribute('data-type');\n        if (type === selectedType) {\n          opt.hidden = false;\n        } else {\n          opt.hidden = true;\n        }\n      });\n      const firstVisible = Array.from(categorySelect.options).find(opt => !opt.hidden);\n      if (firstVisible) categorySelect.value = firstVisible.value;\n    });\n    typeSelect?.dispatchEvent(new Event('change'));\n\n    form?.addEventListener('submit', async (e) => {\n      e.preventDefault();\n      if (errorDiv) errorDiv.classList.add('hidden');\n      const formData = new FormData(form);\n      const rawAmount = parseFloat(formData.get('amount') || '0');\n      const amountCents = Math.round(rawAmount * 100);\n\n      const payload = {\n        trackerId,\n        type: formData.get('type'),\n        amount: amountCents,\n        currency: 'USD',\n        transactionDate: formData.get('transactionDate'),\n        merchant: formData.get('merchant'),\n        description: formData.get('description'),\n        categoryId: formData.get('categoryId'),\n        paymentMethod: formData.get('paymentMethod'),\n        notes: formData.get('notes'),\n      };\n\n      try {\n        const res = await fetch('/api/rpc', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ action: 'transaction.create', payload }),\n        });\n        const data = await res.json();\n        if (data.success) {\n          window.location.reload();\n        } else {\n          if (errorDiv) {\n            errorDiv.textContent = data.error.message;\n            errorDiv.classList.remove('hidden');\n          }\n        }\n      } catch (err) {\n        if (errorDiv) {\n          errorDiv.textContent = 'Failed to create transaction';\n          errorDiv.classList.remove('hidden');\n        }\n      }\n    });\n\n    window.deleteTransaction = async (txId) => {\n      if (!confirm('Are you sure you want to delete this transaction?')) return;\n      try {\n        const res = await fetch('/api/rpc', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ action: 'transaction.delete', payload: { id: txId, trackerId } }),\n        });\n        const data = await res.json();\n        if (data.success) {\n          window.location.reload();\n        } else {\n          alert(data.error.message || 'Failed to delete transaction');\n        }\n      } catch (err) {\n        alert('Failed to delete transaction');\n      }\n    };\n  })();<\/script> "])), maybeRenderHead(), addAttribute(`/app/trackers/${trackerId}`, "href"), totalCount, addAttribute(search, "value"), addAttribute(typeFilter === "income", "selected"), addAttribute(typeFilter === "expense", "selected"), trackerCategories.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(categoryFilter === c.id, "selected")}>${c.name}</option>`), addAttribute(sortBy === "date-desc", "selected"), addAttribute(sortBy === "date-asc", "selected"), addAttribute(sortBy === "amount-desc", "selected"), addAttribute(sortBy === "amount-asc", "selected"), allTransactions.length === 0 ? renderTemplate`<div class="p-12 text-center text-slate-500"> <p class="text-base font-medium">No transactions found.</p> <p class="text-sm mt-1"> ${search || typeFilter || categoryFilter ? "Try adjusting your filters." : 'Click "+ Add Transaction" to get started.'} </p> </div>` : renderTemplate`<div class="overflow-x-auto"> <table class="w-full text-left border-collapse"> <thead> <tr class="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200"> <th class="px-6 py-3">Date</th> <th class="px-6 py-3">Merchant</th> <th class="px-6 py-3">Category</th> <th class="px-6 py-3">Type</th> <th class="px-6 py-3">Payment Method</th> <th class="px-6 py-3 text-right">Amount</th> <th class="px-6 py-3 text-right">Actions</th> </tr> </thead> <tbody class="divide-y divide-slate-100 text-sm"> ${allTransactions.map((tx) => renderTemplate`<tr class="hover:bg-slate-50/50 transition"> <td class="px-6 py-4 text-slate-600 font-medium">${tx.transactionDate}</td> <td class="px-6 py-4"> <div class="text-slate-900 font-semibold">${tx.merchant}</div> ${tx.description && renderTemplate`<div class="text-xs text-slate-500 mt-0.5">${tx.description}</div>`} </td> <td class="px-6 py-4"> <span class="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">${tx.categoryName}</span> </td> <td class="px-6 py-4"> <span${addAttribute(`px-2 py-0.5 text-xs font-bold uppercase rounded-full ${tx.type === "income" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`, "class")}> ${tx.type} </span> </td> <td class="px-6 py-4 text-slate-600 text-xs">${tx.paymentMethod || "\u2014"}</td> <td${addAttribute(`px-6 py-4 text-right font-bold ${tx.type === "income" ? "text-emerald-600" : "text-rose-600"}`, "class")}> ${tx.type === "income" ? "+" : "-"}${formatMoney(tx.amount, tracker.currency)} </td> <td class="px-6 py-4 text-right"> <button${addAttribute(`deleteTransaction('${tx.id}')`, "onclick")} class="px-3 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-lg text-xs font-medium transition">
Delete
</button> </td> </tr>`)} </tbody> </table> </div>`, totalPages > 1 && renderTemplate`<div class="flex items-center justify-center gap-2"> ${page > 1 && renderTemplate`<a${addAttribute(buildUrl({ page: String(page - 1), search, type: typeFilter, category: categoryFilter, sort: sortBy }), "href")} class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm">
← Previous
</a>`} <span class="text-sm text-slate-600">
Page ${page} of ${totalPages} </span> ${page < totalPages && renderTemplate`<a${addAttribute(buildUrl({ page: String(page + 1), search, type: typeFilter, category: categoryFilter, sort: sortBy }), "href")} class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm">
Next →
</a>`} </div>`, addAttribute(trackerId, "value"), tracker.currency, addAttribute((/* @__PURE__ */ new Date()).toISOString().split("T")[0], "value"), trackerCategories.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.type, "data-type")}>${c.name} (${c.type})</option>`), defineScriptVars({ trackerId })) })}`;
}, "C:/workspace/personal/mvp/buget_tracker/src/pages/app/trackers/[trackerId]/transactions.astro", void 0);

const $$file = "C:/workspace/personal/mvp/buget_tracker/src/pages/app/trackers/[trackerId]/transactions.astro";
const $$url = "/app/trackers/[trackerId]/transactions";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Transactions,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, b as createAstro, m as maybeRenderHead, e as addAttribute, f as renderScript } from '../../chunks/astro/server_BZuKIedG.mjs';
import { $ as $$Layout } from '../../chunks/Layout_uP9enraT.mjs';
import { t as trackerMembers, b as trackers, e as eq } from '../../chunks/schema_D3bIJDv1.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const db = Astro2.locals.db;
  const user = Astro2.locals.user;
  const userTrackers = await db.select({
    id: trackers.id,
    name: trackers.name,
    description: trackers.description,
    currency: trackers.currency,
    role: trackerMembers.role
  }).from(trackerMembers).innerJoin(trackers, eq(trackerMembers.trackerId, trackers.id)).where(eq(trackerMembers.userId, user.id));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Your Trackers" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <div class="flex justify-between items-center"> <div> <h1 class="text-3xl font-extrabold text-slate-900">Your Financial Trackers</h1> <p class="text-slate-600 mt-1">Select a tracker to view budgets, transactions, and reports.</p> </div> <button id="new-tracker-btn" class="bg-indigo-600 text-white font-medium px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition">
+ New Tracker
</button> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${userTrackers.map((t) => renderTemplate`<a${addAttribute(`/app/trackers/${t.id}`, "href")} class="block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition group"> <div class="flex justify-between items-start mb-4"> <h2 class="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition">${t.name}</h2> <span class="text-xs uppercase px-2.5 py-1 bg-slate-100 text-slate-600 font-semibold rounded-full">${t.role}</span> </div> <p class="text-slate-600 text-sm mb-4 line-clamp-2">${t.description || "No description provided."}</p> <div class="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100"> <span>Currency: ${t.currency}</span> <span class="text-indigo-600 font-medium group-hover:underline">Open Workspace →</span> </div> </a>`)} </div> </div> <div id="tracker-modal" class="fixed inset-0 bg-black/50 hidden items-center justify-center p-4 z-50"> <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"> <h2 class="text-xl font-bold text-slate-900 mb-4">Create New Tracker</h2> <form id="tracker-form" class="space-y-4"> <div> <label class="block text-sm font-medium text-slate-700 mb-1">Tracker Name</label> <input type="text" name="name" required placeholder="e.g. Household Budget" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> </div> <div> <label class="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label> <textarea name="description" rows="2" placeholder="Brief notes about this workspace" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"></textarea> </div> <div> <label class="block text-sm font-medium text-slate-700 mb-1">Currency</label> <select name="currency" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> <option value="USD">USD ($)</option> <option value="EUR">EUR (€)</option> <option value="GBP">GBP (£)</option> <option value="CAD">CAD ($)</option> <option value="AUD">AUD ($)</option> </select> </div> <div id="modal-error" class="text-sm text-red-600 hidden"></div> <div class="flex justify-end gap-3 pt-2"> <button type="button" id="close-modal" class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Cancel</button> <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Create Tracker</button> </div> </form> </div> </div> ${renderScript($$result2, "C:/workspace/personal/mvp/buget_tracker/src/pages/app/trackers/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/workspace/personal/mvp/buget_tracker/src/pages/app/trackers/index.astro", void 0);

const $$file = "C:/workspace/personal/mvp/buget_tracker/src/pages/app/trackers/index.astro";
const $$url = "/app/trackers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

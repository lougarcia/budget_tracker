globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, b as createAstro, m as maybeRenderHead } from '../chunks/astro/server_BZuKIedG.mjs';
import { $ as $$Layout } from '../chunks/Layout_uP9enraT.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  if (Astro2.locals.user) {
    return Astro2.redirect("/app/trackers");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Welcome" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="py-16 text-center max-w-3xl mx-auto space-y-8"> <h1 class="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
Master Your Money, <span class="text-indigo-600">Together.</span> </h1> <p class="text-lg text-slate-600">
A production-quality personal and collaborative budgeting application. Track income, expenses, monthly budgets, and insightful reports across multiple trackers.
</p> <div class="flex justify-center gap-4"> <a href="/register" class="bg-indigo-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
Get Started Free
</a> <a href="/login" class="bg-white border border-slate-300 text-slate-700 font-medium px-6 py-3 rounded-xl hover:bg-slate-50 transition">
Sign In
</a> </div> </div> ` })}`;
}, "C:/workspace/personal/mvp/buget_tracker/src/pages/index.astro", void 0);

const $$file = "C:/workspace/personal/mvp/buget_tracker/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

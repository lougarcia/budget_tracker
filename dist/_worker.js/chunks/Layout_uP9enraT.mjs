globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, e as addAttribute, f as renderScript, a as renderTemplate, b as createAstro, g as renderSlot, h as renderHead, r as renderComponent } from './astro/server_BZuKIedG.mjs';
/* empty css                          */

const $$Astro$1 = createAstro();
const $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ClientRouter;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "C:/workspace/personal/mvp/buget_tracker/node_modules/.pnpm/astro@5.18.2_@types+node@26_e30c0377287b980d0d932a369957c3f6/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/workspace/personal/mvp/buget_tracker/node_modules/.pnpm/astro@5.18.2_@types+node@26_e30c0377287b980d0d932a369957c3f6/node_modules/astro/components/ClientRouter.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  const user = Astro2.locals.user;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', " \u2014 Budget Tracker</title>", "", '</head> <body class="min-h-screen bg-slate-50 text-slate-900 flex flex-col"> <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-4 py-2 rounded-lg z-50">\nSkip to main content\n</a> <header class="bg-white border-b border-slate-200 sticky top-0 z-50" role="banner"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"> <a href="/app/trackers" class="text-xl font-bold text-indigo-600 flex items-center gap-2" aria-label="BudgetTracker Home"> <span aria-hidden="true">\u{1F4B0}</span> BudgetTracker\n</a> <nav class="flex items-center gap-4" aria-label="User menu"> ', ' </nav> </div> </header> <main id="main-content" class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main"> ', ` </main> <footer class="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500" role="contentinfo">
Personal & Collaborative Budget Tracker \u2014 Built with Astro & Cloudflare
</footer> <script>
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          try {
            await fetch('/api/auth/sign-out', { method: 'POST' });
            window.location.href = '/login';
          } catch (err) {
            console.error('Logout failed', err);
          }
        });
      }
    <\/script> </body> </html>`])), title, renderComponent($$result, "ViewTransitions", $$ClientRouter, {}), renderHead(), user ? renderTemplate`<div class="flex items-center gap-4"> <span class="text-sm text-slate-600 font-medium">${user.name || user.email}</span> <a href="/login" id="logout-btn" class="text-sm text-slate-500 hover:text-slate-700" aria-label="Logout">Logout</a> </div>` : renderTemplate`<div class="flex items-center gap-3"> <a href="/login" class="text-sm font-medium text-slate-600 hover:text-slate-900">Login</a> <a href="/register" class="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Register</a> </div>`, renderSlot($$result, $$slots["default"]));
}, "C:/workspace/personal/mvp/buget_tracker/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };

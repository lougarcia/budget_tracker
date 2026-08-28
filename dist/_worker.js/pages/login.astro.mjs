globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, b as createAstro, m as maybeRenderHead } from '../chunks/astro/server_BZuKIedG.mjs';
import { $ as $$Layout } from '../chunks/Layout_uP9enraT.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  if (Astro2.locals.user) {
    return Astro2.redirect("/app/trackers");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sign In" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", `<div class="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mt-8"> <h1 class="text-2xl font-bold text-slate-900 mb-6">Welcome Back</h1> <form id="login-form" class="space-y-4"> <div> <label class="block text-sm font-medium text-slate-700 mb-1">Email address</label> <input type="email" name="email" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> </div> <div> <label class="block text-sm font-medium text-slate-700 mb-1">Password</label> <input type="password" name="password" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> </div> <div id="error-msg" class="text-sm text-red-600 hidden"></div> <button type="submit" class="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition">
Sign In
</button> </form> <p class="text-sm text-slate-600 text-center mt-6">
Don't have an account? <a href="/register" class="text-indigo-600 font-medium hover:underline">Register</a> </p> </div> <script>
    const form = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMsg.classList.add('hidden');
      const formData = new FormData(form);
      const email = formData.get('email');
      const password = formData.get('password');

      try {
        const res = await fetch('/api/auth/sign-in/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok) {
          window.location.href = '/app/trackers';
        } else {
          errorMsg.textContent = data.message || 'Invalid email or password';
          errorMsg.classList.remove('hidden');
        }
      } catch (err) {
        errorMsg.textContent = 'An unexpected error occurred';
        errorMsg.classList.remove('hidden');
      }
    });
  <\/script> `])), maybeRenderHead()) })}`;
}, "C:/workspace/personal/mvp/buget_tracker/src/pages/login.astro", void 0);

const $$file = "C:/workspace/personal/mvp/buget_tracker/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

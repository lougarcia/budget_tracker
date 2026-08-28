globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, b as createAstro, m as maybeRenderHead } from '../chunks/astro/server_BZuKIedG.mjs';
import { $ as $$Layout } from '../chunks/Layout_uP9enraT.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Register = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Register;
  if (Astro2.locals.user) {
    return Astro2.redirect("/app/trackers");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Register" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", `<div class="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mt-8"> <h1 class="text-2xl font-bold text-slate-900 mb-6">Create an Account</h1> <form id="register-form" class="space-y-4"> <div> <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label> <input type="text" name="name" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> </div> <div> <label class="block text-sm font-medium text-slate-700 mb-1">Email address</label> <input type="email" name="email" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> </div> <div> <label class="block text-sm font-medium text-slate-700 mb-1">Password (min 6 chars)</label> <input type="password" name="password" required minlength="6" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> </div> <div id="error-msg" class="text-sm text-red-600 hidden"></div> <button type="submit" class="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition">
Create Account & Setup Tracker
</button> </form> <p class="text-sm text-slate-600 text-center mt-6">
Already have an account? <a href="/login" class="text-indigo-600 font-medium hover:underline">Sign In</a> </p> </div> <script>
    const form = document.getElementById('register-form');
    const errorMsg = document.getElementById('error-msg');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMsg.classList.add('hidden');
      const formData = new FormData(form);
      const name = formData.get('name');
      const email = formData.get('email');
      const password = formData.get('password');

      try {
        const res = await fetch('/api/auth/sign-up/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (res.ok) {
          window.location.href = '/app/trackers';
        } else {
          errorMsg.textContent = data.message || 'Registration failed';
          errorMsg.classList.remove('hidden');
        }
      } catch (err) {
        errorMsg.textContent = 'An unexpected error occurred';
        errorMsg.classList.remove('hidden');
      }
    });
  <\/script> `])), maybeRenderHead()) })}`;
}, "C:/workspace/personal/mvp/buget_tracker/src/pages/register.astro", void 0);

const $$file = "C:/workspace/personal/mvp/buget_tracker/src/pages/register.astro";
const $$url = "/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Register,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

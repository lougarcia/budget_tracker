globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as createAuth } from '../../../chunks/index_BYBH5494.mjs';
export { renderers } from '../../../renderers.mjs';

const ALL = async (context) => {
  const runtimeEnv = context.locals?.runtime?.env;
  const auth = createAuth({
    DATABASE_URL: runtimeEnv?.DATABASE_URL,
    DATABASE_AUTH_TOKEN: runtimeEnv?.DATABASE_AUTH_TOKEN,
    BETTER_AUTH_SECRET: runtimeEnv?.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: runtimeEnv?.BETTER_AUTH_URL
  });
  return auth.handler(context.request);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

globalThis.process ??= {}; globalThis.process.env ??= {};
import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DvZ56wJX.mjs';
import { manifest } from './manifest_Bpht3dgd.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/auth/_---all_.astro.mjs');
const _page2 = () => import('./pages/api/rpc.astro.mjs');
const _page3 = () => import('./pages/app/trackers/_trackerid_/budget.astro.mjs');
const _page4 = () => import('./pages/app/trackers/_trackerid_/categories.astro.mjs');
const _page5 = () => import('./pages/app/trackers/_trackerid_/collaborate.astro.mjs');
const _page6 = () => import('./pages/app/trackers/_trackerid_/recurring.astro.mjs');
const _page7 = () => import('./pages/app/trackers/_trackerid_/reports/monthly.astro.mjs');
const _page8 = () => import('./pages/app/trackers/_trackerid_/reports/quarterly.astro.mjs');
const _page9 = () => import('./pages/app/trackers/_trackerid_/reports/yearly.astro.mjs');
const _page10 = () => import('./pages/app/trackers/_trackerid_/transactions.astro.mjs');
const _page11 = () => import('./pages/app/trackers/_trackerid_.astro.mjs');
const _page12 = () => import('./pages/app/trackers.astro.mjs');
const _page13 = () => import('./pages/login.astro.mjs');
const _page14 = () => import('./pages/register.astro.mjs');
const _page15 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/@astrojs+cloudflare@12.6.13_6cc7a5f2fd7040e9a7e500cdad6fbd2d/node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/api/auth/[...all].ts", _page1],
    ["src/pages/api/rpc.ts", _page2],
    ["src/pages/app/trackers/[trackerId]/budget.astro", _page3],
    ["src/pages/app/trackers/[trackerId]/categories.astro", _page4],
    ["src/pages/app/trackers/[trackerId]/collaborate.astro", _page5],
    ["src/pages/app/trackers/[trackerId]/recurring.astro", _page6],
    ["src/pages/app/trackers/[trackerId]/reports/monthly.astro", _page7],
    ["src/pages/app/trackers/[trackerId]/reports/quarterly.astro", _page8],
    ["src/pages/app/trackers/[trackerId]/reports/yearly.astro", _page9],
    ["src/pages/app/trackers/[trackerId]/transactions.astro", _page10],
    ["src/pages/app/trackers/[trackerId]/index.astro", _page11],
    ["src/pages/app/trackers/index.astro", _page12],
    ["src/pages/login.astro", _page13],
    ["src/pages/register.astro", _page14],
    ["src/pages/index.astro", _page15]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };

globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, b as createAstro, d as defineScriptVars, e as addAttribute, m as maybeRenderHead } from '../../../../chunks/astro/server_BZuKIedG.mjs';
import { $ as $$Layout } from '../../../../chunks/Layout_uP9enraT.mjs';
import { b as trackers, e as eq, u as user, t as trackerMembers, h as trackerInvitations, a as and } from '../../../../chunks/schema_D3bIJDv1.mjs';
import { r as requireTrackerAccess } from '../../../../chunks/auth-guards_eXZIgznn.mjs';
import { d as desc } from '../../../../chunks/select_DzL3WofE.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Collaborate = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Collaborate;
  const { trackerId } = Astro2.params;
  const currentUser = Astro2.locals.user;
  const db = Astro2.locals.db;
  const member = await requireTrackerAccess(db, currentUser.id, trackerId).catch(() => null);
  if (!member) {
    return Astro2.redirect("/app/trackers");
  }
  const [tracker] = await db.select().from(trackers).where(eq(trackers.id, trackerId)).limit(1);
  if (!tracker) {
    return Astro2.redirect("/app/trackers");
  }
  const isOwner = member.role === "owner";
  const members = await db.select({
    id: trackerMembers.id,
    userId: trackerMembers.userId,
    role: trackerMembers.role,
    createdAt: trackerMembers.createdAt,
    userName: user.name,
    userEmail: user.email,
    userImage: user.image
  }).from(trackerMembers).innerJoin(user, eq(trackerMembers.userId, user.id)).where(eq(trackerMembers.trackerId, trackerId)).orderBy(desc(trackerMembers.createdAt));
  const invitations = await db.select().from(trackerInvitations).where(
    and(
      eq(trackerInvitations.trackerId, trackerId),
      eq(trackerInvitations.status, "pending")
    )
  ).orderBy(desc(trackerInvitations.createdAt));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Collaborate \u2014 ${tracker.name}` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="space-y-8"> <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"> <div> <div class="flex items-center gap-3"> <a', ' class="text-sm font-medium text-indigo-600 hover:underline">\u2190 Back to Dashboard</a> <span class="text-slate-300">/</span> <h1 class="text-2xl font-bold text-slate-900">Collaboration</h1> </div> <p class="text-slate-600 text-sm mt-1">Manage members and invitations for this tracker</p> </div> ', ' </div> <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"> <div class="px-6 py-4 border-b border-slate-200"> <h2 class="text-lg font-bold text-slate-900">Members (', ")</h2> </div> ", " </div> ", ' <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"> <h2 class="text-lg font-bold text-slate-900 mb-4">How Collaboration Works</h2> <div class="space-y-3 text-sm text-slate-600"> <p><strong>Owners</strong> can manage members, set budgets, and invite new users.</p> <p><strong>Members</strong> can view all data and add transactions.</p> <p>Invitations expire after 7 days if not accepted.</p> </div> </div> </div> <div id="invite-modal" class="fixed inset-0 bg-black/50 hidden items-center justify-center p-4 z-50"> <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"> <h2 class="text-xl font-bold text-slate-900 mb-4">Invite Member</h2> <form id="invite-form" class="space-y-4"> <div> <label for="invitee-email" class="block text-sm font-medium text-slate-700 mb-1">Email Address</label> <input type="email" id="invitee-email" name="inviteeEmail" required placeholder="colleague@example.com" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> </div> <div> <label for="invite-role" class="block text-sm font-medium text-slate-700 mb-1">Role</label> <select name="role" id="invite-role" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"> <option value="member">Member</option> </select> <p class="text-xs text-slate-500 mt-1">Members can view data and add transactions.</p> </div> <div id="invite-error" class="text-sm text-red-600 hidden" role="alert"></div> <div class="flex justify-end gap-3 pt-2"> <button type="button" id="close-invite-modal" class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Cancel</button> <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Send Invitation</button> </div> </form> </div> </div> <script>(function(){', "\n    const modal = document.getElementById('invite-modal');\n    const openBtn = document.getElementById('invite-btn');\n    const closeBtn = document.getElementById('close-invite-modal');\n    const form = document.getElementById('invite-form');\n    const errorDiv = document.getElementById('invite-error');\n\n    openBtn?.addEventListener('click', () => {\n      modal?.classList.remove('hidden');\n      modal?.classList.add('flex');\n    });\n    closeBtn?.addEventListener('click', () => {\n      modal?.classList.add('hidden');\n      modal?.classList.remove('flex');\n    });\n\n    form?.addEventListener('submit', async (e) => {\n      e.preventDefault();\n      if (errorDiv) errorDiv.classList.add('hidden');\n      const formData = new FormData(form);\n\n      const payload = {\n        trackerId,\n        inviteeEmail: formData.get('inviteeEmail'),\n        role: formData.get('role'),\n      };\n\n      try {\n        const res = await fetch('/api/rpc', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ action: 'invitation.create', payload }),\n        });\n        const data = await res.json();\n        if (data.success) {\n          window.location.reload();\n        } else {\n          if (errorDiv) {\n            errorDiv.textContent = data.error.message;\n            errorDiv.classList.remove('hidden');\n          }\n        }\n      } catch (err) {\n        if (errorDiv) {\n          errorDiv.textContent = 'Failed to send invitation';\n          errorDiv.classList.remove('hidden');\n        }\n      }\n    });\n\n    window.cancelInvitation = async (invId) => {\n      if (!confirm('Are you sure you want to cancel this invitation?')) return;\n      try {\n        const res = await fetch('/api/rpc', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ action: 'invitation.cancel', payload: { id: invId, trackerId } }),\n        });\n        const data = await res.json();\n        if (data.success) {\n          window.location.reload();\n        } else {\n          alert(data.error.message || 'Failed to cancel invitation');\n        }\n      } catch (err) {\n        alert('Failed to cancel invitation');\n      }\n    };\n  })();<\/script> "])), maybeRenderHead(), addAttribute(`/app/trackers/${trackerId}`, "href"), isOwner && renderTemplate`<button id="invite-btn" class="bg-indigo-600 text-white font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition text-sm">
+ Invite Member
</button>`, members.length, members.length === 0 ? renderTemplate`<div class="p-12 text-center text-slate-500"> <p class="text-base font-medium">No members found.</p> </div>` : renderTemplate`<div class="divide-y divide-slate-100"> ${members.map((m) => renderTemplate`<div class="px-6 py-4 flex items-center justify-between"> <div class="flex items-center gap-4"> ${m.userImage ? renderTemplate`<img${addAttribute(m.userImage, "src")} alt="" class="w-10 h-10 rounded-full">` : renderTemplate`<div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center"> <span class="text-indigo-600 font-semibold text-sm">${(m.userName || m.userEmail || "?")[0].toUpperCase()}</span> </div>`} <div> <p class="font-semibold text-slate-900">${m.userName || "Unnamed User"}</p> <p class="text-xs text-slate-500">${m.userEmail}</p> </div> </div> <div class="flex items-center gap-3"> <span${addAttribute(`text-xs uppercase px-2.5 py-1 font-semibold rounded-full ${m.role === "owner" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`, "class")}> ${m.role} </span> ${m.userId === currentUser.id && renderTemplate`<span class="text-xs text-slate-400">(You)</span>`} </div> </div>`)} </div>`, invitations.length > 0 && renderTemplate`<div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"> <div class="px-6 py-4 border-b border-slate-200"> <h2 class="text-lg font-bold text-slate-900">Pending Invitations (${invitations.length})</h2> </div> <div class="divide-y divide-slate-100"> ${invitations.map((inv) => renderTemplate`<div class="px-6 py-4 flex items-center justify-between"> <div> <p class="font-semibold text-slate-900">${inv.inviteeEmail}</p> <p class="text-xs text-slate-500">
Invited as ${inv.role} • Expires ${new Date(inv.expiresAt).toLocaleDateString()} </p> </div> ${isOwner && renderTemplate`<button${addAttribute(`cancelInvitation('${inv.id}')`, "onclick")} class="px-3 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-lg text-xs font-medium transition">
Cancel
</button>`} </div>`)} </div> </div>`, defineScriptVars({ trackerId })) })}`;
}, "C:/workspace/personal/mvp/buget_tracker/src/pages/app/trackers/[trackerId]/collaborate.astro", void 0);

const $$file = "C:/workspace/personal/mvp/buget_tracker/src/pages/app/trackers/[trackerId]/collaborate.astro";
const $$url = "/app/trackers/[trackerId]/collaborate";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Collaborate,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

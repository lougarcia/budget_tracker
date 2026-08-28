# Budget Tracker

## Project

This repository contains a production-oriented personal and collaborative budgeting application.

The application tracks:

* Income
* Expenses
* Monthly budgets
* Categories
* Recurring transactions
* Financial trends
* Monthly reports
* Quarterly reports
* Yearly reports

Users can create multiple financial **Trackers** and invite other users to collaborate on one or more Trackers.

A Tracker is the primary tenancy and authorization boundary.

---

# 1. Core Engineering Principles

These rules apply to every change in this repository.

## YAGNI — You Aren't Gonna Need It

**Always follow YAGNI.**

Do not implement functionality, abstractions, infrastructure, configuration, or architecture merely because it might be useful in the future.

Before adding something, ask:

> Is this required by the current feature or required to keep the current architecture correct?

If not, do not add it.

Prefer:

* simple code over clever code
* direct solutions over abstractions
* existing dependencies over new dependencies
* existing patterns over new patterns
* incremental evolution over speculative architecture

Do not build:

* unused abstractions
* generic frameworks
* speculative APIs
* unnecessary repository layers
* unnecessary design-system infrastructure
* future integrations
* premature optimization
* features that are not currently required

However, YAGNI does **not** mean ignoring known architectural constraints.

The application must still preserve:

* Tracker tenancy isolation
* authorization boundaries
* financial accuracy
* Cloudflare compatibility
* type safety
* testability
* database integrity

---

# 2. Technology Stack

Use the existing project stack.

Primary technologies:

* Astro
* TypeScript
* Tailwind CSS
* Drizzle ORM
* SQLite
* Zod
* Better Auth
* GSAP
* Astro View Transitions
* Cloudflare
* Turso/libSQL for production

Do not introduce another framework or ORM unless there is a documented technical reason that an existing technology cannot satisfy a requirement.

Do not introduce React, Vue, Svelte, Next.js, Prisma, Supabase, Firebase, or similar alternatives without explicit approval.

Prefer Astro-native solutions.

---

# 3. Skills

Before implementing a feature, determine whether an OpenCode skill exists that is relevant to the task.

**Install and use relevant skills before implementation when they are available and applicable.**

Relevant skills may include skills related to:

* Astro
* TypeScript
* Tailwind CSS
* Drizzle ORM
* SQLite
* Turso/libSQL
* Better Auth
* Zod
* Cloudflare Workers
* accessibility
* web performance
* testing
* UI/UX
* GSAP
* database design
* security

Do not install skills merely for the sake of installing them.

Apply YAGNI here too:

> Install a skill when it provides meaningful guidance for the current task.

When a relevant skill is installed, read and follow its instructions.

If skill instructions conflict with this `AGENTS.md`, follow the higher-priority project/runtime requirements and use judgment.

---

# 4. Before Changing Code

Before making changes:

1. Inspect the repository.
2. Inspect `package.json`.
3. Inspect the current architecture.
4. Inspect relevant existing files.
5. Check Git status.
6. Search for existing implementations before creating new ones.
7. Check whether a relevant skill should be installed.
8. Understand existing conventions.
9. Make a concise implementation plan.
10. Then implement.

Do not recreate functionality that already exists.

Do not replace working infrastructure without a reason.

---

# 5. Keep the Application Runnable

Work incrementally.

After meaningful changes:

* run type checking
* run relevant tests
* run the production build when appropriate

Fix errors before continuing.

Do not leave the repository in a knowingly broken state.

Do not hide errors by weakening TypeScript configuration or removing tests.

---

# 6. Architecture

Keep responsibilities separated.

Use this conceptual flow:

```text
UI
 ↓
RPC / Server Action
 ↓
Authentication
 ↓
Authorization
 ↓
Zod Validation
 ↓
Business Logic
 ↓
Drizzle
 ↓
Database
```

Do not put business logic inside UI components.

Do not allow UI components to directly mutate the database.

---

# 7. RPC Rule

## ALL DATABASE MUTATIONS MUST GO THROUGH RPCs.

This is a hard requirement.

Examples:

```text
tracker.create
tracker.update
tracker.archive
tracker.delete

transaction.create
transaction.update
transaction.delete

category.create
category.update
category.archive

budget.set
budget.copy

invitation.create
invitation.accept
invitation.decline
invitation.cancel

member.remove
member.updateRole

recurring.create
recurring.update
recurring.delete
```

These are conceptual names. Follow the repository's established RPC conventions.

Every mutation must:

1. authenticate the request
2. authorize the user
3. validate input with Zod
4. execute business logic
5. use Drizzle for persistence
6. return a typed result

Never trust authorization information supplied by the client.

---

# 8. Authentication

Use Better Auth.

Never implement a second authentication system.

Protected application functionality must require an authenticated user.

Never accept a user ID from the client as proof of identity.

Determine the current user from the authenticated session.

---

# 9. Authorization

Authorization is server-side.

The frontend may hide controls for UX, but hiding a button is **not** authorization.

Every protected operation must verify:

```text
authenticated user
+
Tracker membership
+
required permission
```

The Tracker is the primary tenancy boundary.

A user must never be able to access another Tracker's:

* transactions
* categories
* budgets
* reports
* recurring transactions
* members
* invitations

merely by changing an ID in a request.

Pay particular attention to IDOR vulnerabilities.

---

# 10. Tracker Model

A Tracker is an independent financial workspace.

A user can belong to multiple Trackers.

Every financial resource must belong to exactly one Tracker.

Examples:

```text
Tracker
 ├── Members
 ├── Categories
 ├── Transactions
 ├── Budgets
 ├── Recurring Transactions
 └── Reports
```

Do not create global financial records that bypass Tracker ownership unless explicitly required.

---

# 11. Financial Data

Never use floating-point values for money.

Use integer minor units.

Example:

```text
$10.99 → 1099
$100.00 → 10000
```

Centralize money-related calculations and formatting.

Do not duplicate financial calculations across components.

Handle:

* zero income
* zero budget
* empty datasets
* over-budget conditions
* negative net income

without producing:

```text
NaN
Infinity
undefined
```

---

# 12. Database

Use Drizzle ORM.

Do not introduce another ORM.

Local development should use SQLite.

Production must remain compatible with Turso/libSQL.

Use migrations.

Do not manually modify production schemas.

Prefer database constraints for data integrity where practical.

Use indexes based on actual query patterns.

Avoid premature indexing.

---

# 13. Queries and Reports

Keep expensive aggregation on the server.

Do not load an entire transaction history into the browser just to calculate:

* monthly totals
* quarterly totals
* yearly totals
* category totals
* merchant totals
* budget comparisons
* spending trends

Prefer SQL aggregation through Drizzle.

The browser should primarily render already-aggregated data.

---

# 14. Validation

Use Zod for all external input.

Validate:

* RPC arguments
* forms
* URL parameters where appropriate
* filters
* query parameters
* invitations
* transactions
* budgets
* categories
* Tracker operations

Do not use TypeScript casts as a substitute for runtime validation.

Avoid:

```ts
const input = body as SomeType;
```

Prefer:

```ts
const input = schema.parse(body);
```

---

# 15. TypeScript

Use strict TypeScript.

Avoid:

```ts
any
```

unless there is a compelling, documented reason.

Prefer inferred types where they are clear.

Do not create duplicate types when an existing type can be reused safely.

Do not create elaborate type-level abstractions for simple problems.

Again:

**YAGNI.**

---

# 16. Astro

Prefer Astro server rendering and Astro components.

Use client-side JavaScript only when interaction requires it.

Do not turn the entire application into a client-side SPA.

Use islands intentionally.

Use Astro View Transitions for navigation where appropriate.

Avoid unnecessary hydration.

---

# 17. Tailwind

Use Tailwind consistently.

Reuse established styles and components.

Before creating a new component or styling pattern, search for an existing equivalent.

Do not create a giant design system unless the project actually needs one.

---

# 18. GSAP

Use GSAP for meaningful UI animation.

Good use cases:

* dashboard entrance
* number transitions
* budget progress
* dialogs
* list transitions
* subtle interaction feedback

Do not animate everything.

Animations must not interfere with usability.

Respect:

```text
prefers-reduced-motion
```

---

# 19. Accessibility

Accessibility is part of implementation, not a later polish step.

Use:

* semantic HTML
* labels
* keyboard navigation
* focus management
* accessible dialogs
* meaningful error messages
* sufficient contrast

Do not rely solely on color to communicate:

* over budget
* under budget
* income
* expense
* success
* error

Charts should have accessible alternatives where the information is important.

---

# 20. Cloudflare Compatibility

The application will run on Cloudflare.

Before introducing a dependency, verify that it is compatible with the intended Cloudflare runtime.

Avoid unnecessary Node-specific APIs.

Do not rely on:

* filesystem persistence
* process-level state
* long-running processes
* Node-only database drivers
* server-local mutable state

Local development must remain convenient with SQLite.

Production must support Turso/libSQL.

---

# 21. Dependencies

Before adding a dependency:

1. Check whether the existing stack can solve the problem.
2. Check whether a relevant installed skill recommends an approach.
3. Verify Cloudflare compatibility.
4. Consider bundle/runtime impact.
5. Consider maintenance cost.
6. Ask whether the dependency is actually necessary.

If the answer is no:

**Do not add it.**

YAGNI applies to dependencies too.

---

# 22. Error Handling

Use consistent application errors.

Never expose:

* SQL errors
* stack traces
* secrets
* internal implementation details

to end users.

Prefer stable error categories such as:

```text
UNAUTHENTICATED
FORBIDDEN
NOT_FOUND
VALIDATION_ERROR
CONFLICT
INVALID_STATE
DATABASE_ERROR
```

---

# 23. UI States

Every important data-driven view should have:

* loading state
* empty state
* error state
* success feedback where appropriate

Never leave users staring at an unexplained blank area.

---

# 24. Testing

Prioritize tests around business-critical behavior.

Especially test:

### Authorization

* user cannot access another Tracker
* member cannot perform owner operations
* cross-Tracker resource access fails

### Transactions

* create
* update
* delete
* validation
* money calculations

### Budgets

* actual totals
* remaining budget
* over-budget calculations

### Invitations

* duplicate invitation prevention
* accepting invitations
* expired invitations
* duplicate memberships

### Reports

* monthly aggregation
* quarterly aggregation
* yearly aggregation

Do not write tests merely to increase coverage numbers.

Test behavior that protects the application.

---

# 25. Performance

Optimize based on actual problems.

Always avoid obvious waste such as:

* N+1 queries
* loading entire datasets unnecessarily
* duplicate database queries
* unnecessary client hydration
* unnecessary chart rendering

Do not add caching, queues, memoization, or complex state management without a demonstrated need.

**YAGNI applies to performance architecture too.**

---

# 26. Security Mindset

Assume all client input is malicious or incorrect.

For every operation ask:

> What happens if the user changes this ID?

> What happens if the user changes this role?

> What happens if the user sends this request directly instead of through the UI?

> What happens if the user does not belong to this Tracker?

> What happens if the invitation is expired?

> What happens if the request is repeated?

Design the server-side implementation accordingly.

---

# 27. Code Style

Prefer code that is:

* boring
* explicit
* readable
* typed
* testable
* easy to delete
* easy for another developer to understand

Avoid clever abstractions.

Avoid premature generalization.

Avoid deeply nested abstractions.

Avoid building infrastructure for hypothetical requirements.

---

# 28. Feature Development Process

For each feature:

### Step 1 — Understand

Inspect the relevant code and database schema.

### Step 2 — Search

Find existing implementations and patterns.

### Step 3 — Skills

Determine whether a relevant OpenCode skill should be installed/used.

### Step 4 — Plan

Write a concise implementation plan.

### Step 5 — Implement

Make the smallest coherent change that fully solves the requirement.

### Step 6 — Verify

Run:

* type checking
* relevant tests
* linting if configured
* build when appropriate

### Step 7 — Review

Check:

* authorization
* validation
* database integrity
* Cloudflare compatibility
* accessibility
* unnecessary complexity

### Step 8 — Clean up

Remove:

* dead code
* unused imports
* unnecessary dependencies
* temporary debugging code
* abandoned approaches

---

# 29. Do Not Over-Engineer

When deciding between two implementations:

Prefer the simpler one unless the more complex implementation provides a concrete current benefit.

For example:

Prefer:

```text
one clear service
```

over:

```text
factory
+
strategy
+
repository
+
adapter
+
provider
```

unless those abstractions are genuinely required.

Prefer:

```text
one focused RPC
```

over:

```text
generic RPC framework
```

unless the application actually needs the framework.

Prefer:

```text
SQL aggregation
```

over:

```text
fetch everything
+
complex client analytics engine
```

Prefer:

```text
Astro component
```

over:

```text
client-side framework
```

when interactivity does not require one.

---

# 30. No Speculative Features

Do not implement these unless explicitly requested:

* AI financial advice
* bank integrations
* receipt OCR
* Google Sheets synchronization
* CSV import
* automatic currency conversion
* financial forecasting
* investment tracking
* debt management
* net worth tracking
* notifications
* email campaigns
* audit-log systems
* complex permission systems
* offline synchronization

The architecture should not prevent future implementation, but the features themselves should not be built prematurely.

---

# 31. Definition of Done

A feature is complete when it is actually usable.

Depending on the feature, this may require:

```text
database schema
+
migration
+
Zod validation
+
authorization
+
server/business logic
+
RPC mutation
+
UI
+
loading state
+
empty state
+
error handling
+
tests
```

Do not call a feature complete because the UI exists.

---

# 32. When Requirements Conflict

Use this priority order:

1. Security
2. Data integrity
3. Explicit project requirements
4. Cloudflare/runtime compatibility
5. Correctness
6. Maintainability
7. Performance
8. UX polish
9. Convenience

Do not sacrifice security or data integrity for implementation convenience.

---

# 33. When Unsure

Do not immediately introduce an abstraction.

First:

1. inspect the existing code,
2. search the repository,
3. check installed skills/documentation,
4. determine the simplest solution,
5. implement it consistently with the existing architecture.

If ambiguity materially affects architecture, stop and ask for clarification.

If ambiguity only affects implementation details, choose the simplest reasonable option and continue.

---

# 34. Final Rule

Build what is needed.

Build it correctly.

Keep it simple.

Keep it secure.

Keep it typed.

Keep it testable.

Keep it compatible with Astro + Cloudflare + Drizzle + SQLite/Turso.

And above all:

**Follow YAGNI.**
**Do not build tomorrow's problems today.**

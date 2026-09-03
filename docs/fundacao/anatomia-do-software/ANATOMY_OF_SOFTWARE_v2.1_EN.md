# ANATOMY OF SOFTWARE — Navigation System v2.1

**For anyone building with AI who wants the result to look (and be) professional.**

**Date:** August 1, 2026
**Version:** 2.1 — Operational (with Structured Prompts, Gate Checklists and a complete Case Study)

---

## How This Map Was Created

Anatomy of Software is not the work of one person.

It was developed through continuous collaboration between:
- A human architect (Tiago)
- A council of specialized AIs (Claude, DeepSeek, ChatGPT, Gemini, Perplexity, Copilot)
- Continuous cross-validation and iteration

**My role (Tiago):** define vision, ask questions, validate, decide what stays.
**Council's role:** challenge, simplify, expose gaps, turn theory into usable protocol.

Not a "genius method from one person." A map that only exists because multiple perspectives — human and AI —
worked together, with humility and rigor, until the result made real-world sense.

> "If this helps you, credit belongs to the whole table. I was just one piece."

---

## The Navigation Map

```
YOU DRIVE

M0            M1            M2            M3            M4            M5
Mindset   →  Discover   →  Design    →  Build      →  Protect   →  Deliver
  Vision       Briefing      Architecture     Code         Security      Production
   ✓             ✓              ✓             ✓             ✓            ✓
```

**Supporting tools along the way:** Anatomy Radar™ (7 health dimensions) · The Translator (human language →
technical specification) · 9 Traffic Signals (hard rules) · Adaptive profiles (Beginner / Intermediate / Senior).

**The Philosophy:** *"You drive. AI executes. Anatomy guarantees the path."* Without this map, code turns into a
chaotic monolith in a few months. With this map, any AI builds structured, professional software.

If you look at this for one minute, you understand 80% of Anatomy.

---

## Start Here

### Why This Matters

Every week, thousands of people start projects with AI.

**Week 1:** Fast. A feature ships in hours.
**Week 3:** One change breaks another. Context disappears.
**Month 1:** Duplicated code. Nobody knows where anything is.
**Month 2:** The AI is now fixing bugs it created itself.
**Month 6:** 400 files. Nobody can add a feature without breaking something.

### Why This Happens

It's not the AI's fault. The AI knows how to build professional software.

**The problem is this:** nobody told it **how** to work, **when** to validate, **what** is good enough.

The user asks: "I want login." The AI delivers code. Nobody validated whether the code is secure, testable,
scalable, or fits with the rest.

### The Solution

**Anatomy of Software** is a **navigation system** that changes this.

It's not a framework. It's not a rigid protocol. It doesn't turn anyone into a senior engineer.

It's a **map** that tells you:
- **Where you are now** (project maturity)
- **Where you're going** (next destination)
- **What needs to be ready** before advancing
- **When you've arrived** (real definition of done)

---

## How It Works

**Before (Vibe Coding):** Idea → AI → Code → More Code → Chaos

**After (With Anatomy):**
```
Idea
  ↓
Rigid Briefing
  ↓
Where am I? (Radar)
  ↓
What's next?
  ↓
What needs validation?
  ↓
AI executes
  ↓
Validate + Advance
```

**The Roles:**
- **You:** Driver (decide, guide, validate)
- **AI:** Executor (run what you decide)
- **Anatomy:** Navigator (show the path, prevent getting lost)

---

## Start in 10 Minutes

If you don't have time to read everything now:

**1. Answer this (Rigid Briefing):**
```
Problem: (2-3 sentences, what you're solving)
Users: (who will use it, why)
Success: (how you'll know it's done)
Stack: (ex: React/Node/PostgreSQL)
Constraints: (time, budget, compliance)
Sensitive Data: (yes/no, what types)
```

**2. Paste this to the AI:**
```
You have a new project.
Its structure will be:
- Isolated domain (pure logic, no external dependencies)
- Explicit contracts (modules communicate only via interfaces)
- Early validation (mandatory gates between phases)

Before coding anything, you must:
1. Validate the briefing above
2. Draw minimum viable architecture
3. Implement one small slice
4. Test + audit
5. Only then expand

Clear? Let's start with MODULE 1: DISCOVER
```

**3. Continue with the 6 modules below.**

---

## The 6 Navigation Modules

Each module is a **clear destination** in your project. You must pass through all of them, but not necessarily
linearly — you can recalibrate, go back if needed, advance as the project justifies.

### Module 0: Mindset

**Objective:** Understand what engineering means, as opposed to vibing.

**What this is:**
- Engineering = documented, validated, auditable decisions
- Vibe = code that works but nobody knows how, why, or whether it's safe
- Anatomy forces the former, even when using AI

**Entry Gate:**
- [ ] I understand AI is not the GPS (it doesn't make decisions)
- [ ] I understand I'm the navigator + driver
- [ ] I understand that without a rigid briefing, I'm just vibe coding with more steps

**Expected output:** a clear mindset that quality is not an accident — it's a decision repeated at every commit.

---

### Module 1: Discover

**Objective:** capture context, define limits, map risks.

**1.1 Rigid Briefing (30 min)**
```
PROBLEM
What are you solving? (2-3 sentences, concrete)

USERS
Who are they? (3 real profiles: age, context, skills)
What do they do with the software? (specific workflow)

SUCCESS
How will you know it's done? (measurable metric)
What's the minimum that makes it viable? (MVP)

TECHNICAL CONTEXT
Stack: [React/Node/Python/other]
Scale: [10 users / 10k / 1M]
Timeline: [1 month / 3 months / 6 months]

CONSTRAINTS
Budget: [amount or "startup"]
Compliance: [GDPR / PCI-DSS / other]

SENSITIVE DATA
PII? [yes/no]
Financial data? [yes/no]
Medical data? [yes/no]
```

**1.2 Risk Map (30 min)**
For each item above, ask: "What can go wrong here?"
```
Risk: [what can fail]
Impact: [what breaks if this fails]
Probability: [high/medium/low]
Mitigation: [what I do to prevent it]
```

**Prompt for the AI:**
```
Data: [Paste briefing above]

Task:
1. Reformulate the problem in 3 clear sentences
2. Identify 2-3 architectural risks (scale, security, complexity)
3. For each risk, propose a way to block it early (in Module 2)

Report:
- Problem confirmed?
- Real users identified?
- Risks mapped?
- Ready for Module 2?
```

**Exit Gate:**
- [ ] Briefing documented and validated
- [ ] Risks mapped
- [ ] Everyone on the same page
→ YES: advance to Module 2 · → NO: go back and redo

---

### Module 2: Design

**Objective:** draw the smallest viable architecture that blocks monoliths.

**2.1 Minimum Architecture (1-2 days)**
```
LAYER 1 (Presentation): UI/API/CLI
LAYER 2 (Application): Use cases, orchestration
LAYER 3 (Domain): Pure logic, isolated ← HEART
LAYER 4 (Infra): Database, external APIs

DEPENDENCY: L1 → L2 → L3 ← L4 (always inward)
```

Example for "Login": L1 = login form · L2 = use case "AuthenticateUser" · L3 = aggregate "User" + "Password" ·
L4 = repository (which DB? which hash?).

**2.2 Explicit Contracts (1 day)** — each layer communicates only via contracts (interfaces). L3 defines, L4
implements.

**2.3 Map Modules (1 day)** — which modules will you create (`@modules/authentication`, `@modules/users`, each
with `domain/`, `use-cases/`, `adapters/`, `tests/`).

**Prompt for the AI:**
```
Context: [Briefing + Risks]

Task:
1. Draw 4 layers for the project (including dependencies)
2. Identify 3-4 main modules
3. For each module, list required contracts
4. Propose a way to isolate the domain (test without DB/UI)

Report: architecture diagram, modules, contracts, way to test isolated domain.
```

**Exit Gate:**
- [ ] Architecture drawn · [ ] Layers clear · [ ] Contracts defined · [ ] Way to isolate domain identified
→ YES: advance to Module 3 · → NO: go back and redo

---

### Module 3: Build

**Objective:** code one small slice following the architecture.

**Micro Cycle (repeat for each feature):**
1. **Code** — follow exactly the design from Module 2; don't invent features; every line has a purpose.
2. **Test** — happy path, sad path (invalid inputs), stress test, boundary (empty, limit, duplicates).
3. **Evaluate** — "Is this what I imagined? Can another dev maintain this? Performance OK?" If problem, go back
   to step 1.
4. **Reflect** — "Is there coupling I shouldn't have? Can I divide more? Does this scale or is it a dead end?"

**Prompt for the AI:**
```
Feature: [name]
Architecture: [from M2]

Task:
1. Implement the feature
2. Write tests (happy + sad + boundary)
3. Validate that L3 (Domain) is testable without a DB
4. If you found something undecided: STOP and report

Report: code implemented, tests (coverage %), domain testable without infra?, problems found?
```

**Exit Gate:**
- [ ] Feature implemented per design · [ ] Tests >80% coverage · [ ] Domain testable in isolation ·
  [ ] Performance acceptable
→ YES: advance to Module 4 · → NO: go back and redo

---

### Module 4: Protect

**Objective:** validate security, audit, robustness.

**4.1 Security:** input validated (SQL injection, XSS) · sensitive data identified + encrypted · authorization on
every use case · secrets outside the code · rate limiting · audit logging of critical actions.

**4.2 Boundary Tests:** empty · limit · duplicate · corruption · timeout.

**4.3 Critical Audit:** obvious vulnerabilities? untested edge cases? fragile dependencies? if it grows 10x, does
it hold?

**Prompt for the AI:**
```
Code: [Feature ready]
Security Requirements: [from Briefing]

Task:
1. Security audit (input, data, authorization)
2. Boundary tests (empty, limit, duplicate)
3. Critical analysis (vulnerabilities, edge cases)
4. Residual risk report

Report: vulnerabilities found, severity, boundary tests implemented?, production ready?
```

**Exit Gate:**
- [ ] Security audited · [ ] Boundary tests complete · [ ] Vulnerabilities resolved · [ ] Production ready
→ YES: advance to Module 5 · → NO: go back to Module 3 and fix

---

### Module 5: Deliver

**Objective:** polish, documentation, ready for real use.

**5.1 Polish:** code with no warnings · performance <200ms p95 · WCAG AA accessibility · intuitive UX ·
responsive.

**5.2 Documentation:** README (how to start) · architecture (diagram + explanation) · documented APIs ·
decisions (why of each structure).

**5.3 Operationalize:** automatic CI/CD · tests running in the pipeline · structured, auditable logs · active
monitoring with key metrics.

**Prompt for the AI:**
```
Feature: [ready + audited]

Task:
1. Final checklist (linting, performance, accessibility)
2. Documentation: README + API docs
3. CI/CD: ready scripts
4. Final report

Report: checklist all green?, documentation complete?, production ready?
```

**Exit Gate:**
- [ ] Linter passes · [ ] Benchmarks OK · [ ] Documentation complete · [ ] CI/CD configured
→ Deliver for use

---

## The 9 Traffic Signals (Hard Rules)

These are **non-negotiable**. Break one, go back to the previous module.

| Signal | Rule | Test |
|--------|------|------|
| 🔴 Domain never imports infra | L3 doesn't know DB, HTTP, UI | Delete L4 — does L3 code still compile? |
| 🔴 Communicate only by contracts | No direct coupling | Modules import interfaces, not implementations |
| 🔴 One Composition Root | Single point creating services | All services come from one place |
| 🟡 Dependencies injected | Nothing instantiated internally | Factory vs. `new()` |
| 🟡 No circular dependencies | If A→B, B never→A | Dependency graph analysis |
| 🟡 Validation on entry | Mental firewall active | Every input validated before entering |
| 🟡 Boundary tests mandatory | Empty, limit, duplicate | Test suite covers edge cases |
| 🟢 Testable code in isolation | Domain without framework | `node test.js` suffices |
| 🟢 Robustness by inducing failure | Not just success | Failures are simulated and tested |

🔴 = break this, the project gets fragile · 🟡 = break this, complications later · 🟢 = have this, you can evolve

---

## Maturity Radar

Evaluate your project now (0-10 each dimension):

```
Architecture      ████████░░ (8/10)  "Is domain isolated?"
Tests             ███░░░░░░░ (3/10)  "Coverage >80%?"
Security          ██░░░░░░░░ (2/10)  "Audited?"
Documentation     █░░░░░░░░░ (1/10)  "README + API docs?"
Scalability       ████████░░ (8/10)  "Holds 10x?"
Performance       ███░░░░░░░ (3/10)  "Queries <200ms?"
Maintainability   █████░░░░░ (5/10)  "Can another dev understand?"

AVERAGE: ████░░░░░░ (4.3/10)
```

**Interpretation:** <3 = Vibe coding, go back to Modules 0-2 · 3-6 = Weak foundation, prioritize Module 4
(security) · 6-8 = Good, can evolve · >8 = Ready, scale with confidence.

---

## The Translator

The user says: **"I want a user CRUD."**

The Translator automatically converts it to:

**Use Cases:** list · create · edit · delete · search by email.
**Domain:** User aggregate · Email value object · Password value object · rule: unique email.
**Security:** password hash (bcrypt) · email validation · rate limiting (10 reqs/min) · audit (who
created/edited).
**Persistence:** `users` table · `email` index · `unique`, `not null` constraints.
**Tests:** create valid · duplicate email → error · weak password → error · cascade delete → verify.
**API:** `POST/GET/PATCH/DELETE /users` + `GET /users?email=X`.

The AI sees this automatically and works with clear structure.

---

## Usage Profiles

**Profile A — Never Coded** (40% of content): simplified briefing, Modules 0-2 only, very short prompts, focus
on decisions.

**Profile B — Regular AI User** (70% of content): complete briefing, Modules 0-5, medium prompts, focus on
structure + execution.

**Profile C — I'm a Developer** (100% of content): briefing + risks, complete Modules 0-5, detailed prompts, hard
rules + edge cases.

---

## Lessons From the Field

**Lesson 1 — Building New Is Easy, Killing Old Is Hard.** A clean domain can pass every test while the old code
still exists alongside it. As long as it exists, there are two truths in the system. The project only becomes
professional when the last old copy dies. *Application:* set aside time (and courage) to eliminate the old.

**Lesson 2 — AI Daydreams Become Real Bugs.** An AI can "dream up" a rule that sounds elegant and was never
tested — and it becomes a production bug. *Application:* always test everything, never trust poetic
explanations.

**Lesson 3 — An Empty Array Is a Trap.** "All connections are valid" is trivially true when there are no
connections — `.every()` on an empty array returns `true`. *Application:* always test with empty collections.

**Lesson 4 — Twin States Need Names.** Two states can show the same value (e.g. zero) but mean opposite things
(inertia vs. error). *Application:* semantics live in the state's name, not in the number.

**Lesson 5 — Clean With Method, Not Rush.** Deleting code without checking references can introduce a defect.
The right order is: map references → confirm orphan → delete. *Application:* cleanup is necessary, but
structured.

---

## Commercial Positioning

**For whom:** Vibe Coders who want to stop creating chaos · Junior Devs who want to learn engineering ·
Experienced Developers who want consistency when using AI.

**Promise:** "Anatomy of Software doesn't turn anyone into a senior engineer. But it teaches you to guide an AI
the way an engineer would guide a team. The result is code that looks professional because it is — structured,
tested, auditable, scalable. No monoliths, no chaos, no vibe coding dressed up as structure."

**Success metric after using Anatomy:** code structured in 4 clear layers · domain isolated and testable ·
mandatory gates before expanding · security validated from the start · project auditable (any dev understands
it).

---

## Honest Ending

**What works (proven):** the 6 modules (applied in real projects) · rigid briefing as a mandatory gate · 4 layers
+ domain isolation · boundary tests (reveal real traps) · immune system (structured defense).

**What's maturing:** the Maturity Radar (tool in development) · the Translator (works well, needs more examples)
· integration across stacks (TypeScript validated, others being tested).

**Realistic promise:** Anatomy doesn't create perfect software. It creates professional software: structured,
testable, scalable, sustainable. The difference from vibe coding is huge.

---

## Get Started: 15-Minute Quick Start

**Step 1 — Look at the Map (2 min):** You (driver) decide; the 6 Modules (M0-M5) are the structured path; Gates
are mandatory validations; the Radar is the project's current diagnosis; the Translator turns ideas into
specifications; the AI (executor) builds as instructed.

**Step 2 — Fill the Rigid Briefing (5 min):** use the template from the "Start in 10 Minutes" section above, in
simple language.

**Step 3 — Start in M0 (3 min):** read only the Module 0: Mindset section — 2 paragraphs. The message: "Engineering
≠ Vibe Coding. Code is a decision, not an accident."

**Step 4 — Go to M1, tell the AI (3 min):** paste your filled briefing and ask it to identify risks, map
dependencies, and list what needs validation before coding.

**Step 5 — Read the output, validate Gate 1 (2 min):** "Does this make sense? Is anything obvious missing? Do I
agree with the identified risks?" If yes, advance to M2. This isn't bureaucracy — it's protection.

If at any point you feel like you're "falling back into chaos": do you have a Gate left to validate? Are you
breaking a Traffic Signal? Does the Radar say something is very low? **Stop. Validate. Then advance.**

---

## Appendix: Technical Glossary

**Coupling** — when a component's code depends directly on another component's internal workings. High coupling
makes changes dangerous.

**Boundary Tests** — tests that validate the limits of what code accepts: empty, null, maximum, minimum,
duplicate values.

**Composition Root** — the single place in the application where all components are wired together.

**Contract (Interface)** — a clear definition of a component's input and output, without exposing how it works
internally.

**Domain** — the pure business logic, isolated from database, UI, or frameworks.

**Isolated Domain** — when business code (L3) knows nothing about how it's stored, displayed, or sent.

**Gate** — a mandatory validation checkpoint between modules.

**Dependency Injection** — instead of a component creating its own dependencies, they are supplied from outside.

**Monolith** — a giant block of code where everything is together, coupled, hard to change.

**Maturity Radar** — a diagnostic tool that measures project health across 7 dimensions.

**Traffic Signals** — nine hard rules (critical / important / for strength) that protect the project's structure.

**Translator** — a tool that converts a request in human language into a complete technical specification.

**Value Object** — an object representing a business concept, identified by its value and validity, not by an ID.

**Vibe Coding** — chaotic development where code "gets written as things come up," with no structure, tests, or
prior validation.

---

## Note on the 9 Traffic Signals

The 9 Signals are a **simplified operational compression** of the 39 Connection Rules (RL-01 to RL-39) developed
in the Skeleton Manual v1.0/v2.0 (the engineering laboratory that preceded this product).

| Signal | Refers to… |
|--------|------------|
| Domain never imports infra | RL-01, RL-02, RL-10 |
| Communicate only by contracts | RL-03, RL-04, RL-05 |
| One Composition Root | RL-06, RL-19 |
| Dependencies injected | RL-05, RL-17 |
| No circular dependencies | RL-07 |
| Validation on entry | RL-24 |
| Boundary tests mandatory | RL-32, RL-38 |
| Testable code in isolation | RL-35 |
| Robustness by induced failure | RL-38 |

Anatomy simplifies without losing essence. The 9 Signals are not a reduction of quality — they are a synthesis of
clarity. Break a Signal, break the structure. Respect the 9 Signals, your project can take growth.

---

## Acknowledgements & Co-Creation

Anatomy of Software is the result of collective work. No complex system is built alone — this work is the
synthesis of a continuous partnership between human vision and artificial intelligence.

**Orchestration:** Tiago Moraes Chaves
**Collaboration Council:** Claude, DeepSeek, ChatGPT, Gemini, Perplexity, GitHub Copilot

Each of these AI systems contributed distinct perspectives throughout the document's various iterations:
rigorous technical critique, identification of logical gaps, simplification of excesses, transformation of theory
into usable protocol, cross-validation of decisions.

**Final responsibility:** stayed with the author, who selected, integrated, and refined these contributions. But
this work would not have reached its current form without that collaboration.

*"You drive. AI executes."* But the truth is: **Quality driver + Quality executors = real engineering.**

---
---

# PART II — STRUCTURED PROMPTS (v2.1)

**How to use:** 1. Choose the module (M0-M5) · 2. Copy the prompt · 3. Paste into ChatGPT / Claude / Gemini ·
4. Adapt it to your specific project · 5. Save the output in `docs/`.

## M0 — Mindset

**Prompt: "Structure a Rigid Briefing"**
```
I'm starting a new software project using Anatomy of Software v2.1.
I need to structure a RIGID BRIEFING (1-page document maximum).

Project: [Your project here, ex: "Login System for SaaS"]

Help me with:
1. PROBLEM — one clear sentence of what will be solved
2. USERS — who uses it (3 maximum)
3. SUCCESS — 3 measurable criteria (numbers!)
4. CONSTRAINTS — tech, budget, time, legal
5. WHAT'S NOT INCLUDED — features for v2.0

Format: Markdown with clear headers.
Result: BRIEFING.md ready to hand off to M1.
```

## M1 — Discover

**Prompt 1: "Map Technical Risks"**
```
I'm in M1 (DISCOVER) of Anatomy of Software.
Project: [Your project] · Briefing available: [Paste the BRIEFING.md from M0]

I need to identify TECHNICAL RISKS for this project.
For each risk: threat name, severity (HIGH/MEDIUM/LOW), description, mitigation (concrete action).
Focus on: security (SQL Injection, XSS, auth), performance (bottlenecks), external integrations (failures),
data loss (backup, recovery), compliance (GDPR, local regulation).

Output: Markdown table with 8-12 risks. Reference: "RISKS.md" document in the project.
```

**Prompt 2: "Map Dependencies"**
```
I'm in M1 - DISCOVER.
Project: [Your project]

I need to map EXTERNAL DEPENDENCIES.
For each dependency: ID (dep_1, dep_2...), name, type (library/service/infrastructure/external),
status (exists/create/integrate), estimated effort (hours), description (1 line).

Dependencies to consider: libraries (JWT, bcrypt), internal services (database, cache),
external services (email, payment, SMS), infrastructure (cloud provider, CDN).

Output: structured JSON. Reference: "DEPENDENCIES.md".
```

**Prompt 3: "List Critical Validations"**
```
I'm in M1 - DISCOVER.
Project: [Your project] · Briefing: [Paste BRIEFING.md] · Risks: [Paste RISKS.md]

I need CRITICAL VALIDATIONS (essential test cases).
For each validation: input (what to test), expected output (what you expect), type (happy-path/boundary/error),
reason (why it's critical).
Focus on: happy path (normal user), boundaries (limits: empty, very large, minimum), errors (invalid states),
security (common attacks).

Output: Markdown table or JSON. Minimum: 15 validations. Reference: "VALIDATIONS.md".
```

## M2 — Design

**Prompt 1: "Draw the 4-Layer Architecture"**
```
I'm in M2 - DESIGN.
Project: [Your project] · M1 analysis: [Paste RISKS.md + DEPENDENCIES.md] · Stack: [ex: Node.js + Express + PostgreSQL + TypeScript]

I need to draw the 4-LAYER ARCHITECTURE.
For each layer: L4 Infrastructure (where? DB, APIs, cache, email), L3 Domain (what? pure business logic, no
external dependencies), L2 Application (how? orchestration, use cases), L1 Presentation (for whom? UI, HTTP
endpoints).

Show: responsibility of each layer, dependencies each one has, direction of dependencies (always inward),
concrete examples of classes/modules in each layer.

Output: Markdown document with ASCII diagram. Reference: "ARCHITECTURE.md".
```

**Prompt 2: "Define Contracts (Interfaces)"**
```
I'm in M2 - DESIGN.
Project: [Your project] · Architecture: [Paste ARCHITECTURE.md]

I need to define the CONTRACTS (interfaces) between layers: Input DTOs, Output DTOs, Errors/Exceptions,
Repository interfaces, Service interfaces (injected dependencies).
For each contract: name, fields/properties, description, validations.

Output: TypeScript interfaces (or JSON if not using TS). Reference: "CONTRACTS.ts".
```

**Prompt 3: "Generate File Structure"**
```
I'm in M2 - DESIGN.
Project: [Your project] · Stack: Node.js + TypeScript · Architecture: [Paste ARCHITECTURE.md] · Contracts: [Paste CONTRACTS.ts]

I need the complete FILE STRUCTURE.
Create: src/domain, src/application, src/infrastructure, src/presentation folders; subfolders by responsibility;
index.ts file per folder (exports); empty .ts file with a "TODO: Implement [feature]" comment.
Also include: tests/ (unit, integration), docs/, scripts/.

Output: ASCII tree of the structure (or `mkdir -p` script). Reference: structure ready for M3 to fill in the
TODOs.
```

## M3 — Build

**Prompt 1: "Implement the Domain Layer (L3)"**
```
I'm in M3 - BUILD.
Project: [Your project] · Architecture: [Paste ARCHITECTURE.md] · Contracts: [Paste CONTRACTS.ts] · Structure: [Paste the structure]

I need to IMPLEMENT the DOMAIN LAYER (L3).
Rules: no external dependency (no imports from L4, L2, L1); Value Objects are immutable, validate in the
constructor; Entities contain pure business logic; Errors are their own classes, not generic ones.
Implement: value-objects/, entities/, errors/. For each VO/Entity: private constructor + static create(),
complete validations, business methods (no I/O), immutability (readonly properties).

Output: complete TypeScript files, 100% testable without mocks. Tests: unit tests (>90% coverage).
```

**Prompt 2: "Implement the Application Layer (L2)"**
```
I'm in M3 - BUILD.
Project: [Your project] · Contracts: [Paste CONTRACTS.ts] · Implemented Domain: [Paste the L3 files]

I need to IMPLEMENT the APPLICATION LAYER (L2).
Rules: use cases orchestrate L3 + L4; dependency injection via constructor; no business logic (that's L3);
error handling + logging.
Implement: use-cases/, services/ (if coordination is needed). For each Use Case: constructor with dependencies,
execute() returning a DTO, try-catch with logging, delegates pure logic to L3.

Output: TypeScript files ready for L1 to call. Tests: unit tests with mocks (>80% coverage).
```

**Prompt 3: "Implement the Infrastructure Layer (L4)"**
```
I'm in M3 - BUILD.
Project: [Your project] · Contracts: [Paste CONTRACTS.ts] · Implemented Application: [Paste L2]

I need to IMPLEMENT the INFRASTRUCTURE LAYER (L4).
Implement: database/repositories (PostgreSQL, prepared statements), services/ (email, payment, auth),
middleware/ (rate limiting, logging).
Rules: implements interfaces from CONTRACTS.ts; prepared statements for SQL; error handling with retry logic;
operation logging; connection pooling, configured timeouts.

Output: ready TypeScript files. Tests: integration tests against a test database.
```

**Prompt 4: "Implement the Presentation Layer (L1)"**
```
I'm in M3 - BUILD.
Project: [Your project] · Use Cases (L2): [Paste] · Contracts: [Paste]

I need to IMPLEMENT the PRESENTATION LAYER (L1).
Implement: controllers/ (HTTP endpoints), middleware/ (request validation, auth), formatters/ (response
formatting).
Rules: thin controllers (parsing + delegate to L2); input validation; error handling with correct status codes;
request logging; no business logic.

Output: TypeScript files (Express, Fastify, or NestJS). Tests: e2e tests for each endpoint.
```

**Prompt 5: "Write Unit Tests"**
```
I'm in M3 - BUILD.
Project: [Your project] · Implemented code: [complete L1-L4] · Critical validations: [Paste VALIDATIONS.md]

I need to WRITE UNIT TESTS. Target coverage: >80%.
Tests for: Domain (zero mocks), Application (mocks of repositories/services), Infrastructure (mocks of
DB/external APIs), Controllers (mocks of use cases).
For each test: AAA (Arrange, Act, Assert), descriptive name (should_[what]_[when]), happy path + error cases,
test boundaries (empty, null, max, min).

Output: Jest/Vitest test files. Command: `npm test -- --coverage`.
```

**Prompt 6: "Write Integration Tests"**
```
I'm in M3 - BUILD.
Project: [Your project] · Code: [everything implemented] · Unit tests: [created]

I need INTEGRATION TESTS. Target coverage: >60%.
Tests for: complete flows (L1 → L2 → L3 → L4), real database (test database), external services (mocked).
For each integration test: set up database (migrations), execute the complete flow, verify result + side
effects, cleanup.

Output: test files under tests/integration/. Command: `npm run test:integration`.
```

## M4 — Protect

**Prompt: "Implement Security"**
```
I'm in M4 - PROTECT.
Project: [Your project] · Code (M3): [ready] · Risks (M1): [Paste RISKS.md]

I need to implement SECURITY. Risk mitigation: [for each HIGH/MEDIUM risk from M1, paste it here].

Implement: password hashing (bcrypt 12 rounds), JWT with expiration (access 15min, refresh 7d), HTTPS
enforcement, CSRF tokens, rate limiting, SQL injection prevention (prepared statements), XSS prevention (CSP
headers, sanitization), audit logging, secrets management (env vars), security headers (HSTS, X-Frame-Options,
etc).

Output: TypeScript code with all implementations + SECURITY_CHECKLIST.md with an item per measure.
```

## M5 — Deliver

**Prompt 1: "Write Documentation"**
```
I'm in M5 - DELIVER.
Project: [Your project] · Code: [complete and secured]

I need DOCUMENTATION: README.md (setup, commands, overview), API.md or Swagger (all endpoints with examples),
ARCHITECTURE.md (4-layer diagram), DEPLOYMENT.md (how to deploy), TROUBLESHOOTING.md (common errors).
Each document: well-formatted Markdown, concrete examples, copy/paste-ready commands.

Output: 5 .md files ready for docs/.
```

**Prompt 2: "Configure CI/CD"**
```
I'm in M5 - DELIVER.
Project: [Your project] · GitHub Actions / GitLab CI (choose one)

I need a CI/CD PIPELINE.
Steps: checkout code, npm ci, npm run lint, npm run test (unit + integration), npm run build, deploy to Staging
(blue-green), smoke tests, deploy to Production (if everything is OK).

Output: `.github/workflows/deploy.yml` (or `.gitlab-ci.yml`).
```

**Prompt 3: "Configure Observability"**
```
I'm in M5 - DELIVER.
Project: [Your project] · Stack: [ex: Node.js + Express]

I need MONITORING + ALERTS.
Integrate: centralized logs (ELK / Loki), metrics (Prometheus / DataDog), alerts (Grafana / PagerDuty),
dashboard.
Important metrics: login success/failed, response time (p50/p95/p99), error rate, database query duration, rate
limit hits. Alerts: error rate >5%, response time >500ms, DB pool >80%, deployment failed.

Output: docker-compose.yml for the stack + configuration (or instructions for DataDog/Sentry/New Relic).
```

## Quick Workflow

**If you use Claude:**
1. M0: copy Prompt M0 → generates `BRIEFING.md`
2. M1: copy the 3 M1 Prompts → generates `RISKS.md`, `DEPENDENCIES.md`, `VALIDATIONS.md`
3. M2: copy the 3 M2 Prompts → `ARCHITECTURE.md`, `CONTRACTS.ts`, folder structure
4. M3: copy the 6 M3 Prompts → complete code L4→L3→L2→L1 + tests
5. M4: copy Prompt M4 → security integrated
6. M5: copy the 3 M5 Prompts → docs, CI/CD, monitoring

**Estimated total time:** M0 30min · M1 2-3h · M2 2-3h · M3 5-7h · M4 2-3h · M5 1-2h → **~15-20 hours of AI work
for production-ready.**

## Best Practices

1. Read the full output before using it — the AI can make mistakes.
2. Test each phase — don't skip validations.
3. Save the outputs — documentation stays in the repo.
4. Review the code — the AI is a tool, you are responsible.
5. Adapt the prompts — every project is different.

## Checkpoints

M0: does `BRIEFING.md` exist? · M1: do `RISKS.md`, `DEPENDENCIES.md`, `VALIDATIONS.md` exist? · M2: are
`ARCHITECTURE.md`, `CONTRACTS.ts`, folder structure ready? · M3: does the code compile? do tests pass (>80%)? ·
M4: security review approved? · M5: automatic deploy? monitoring active?

When all checkpoints are ✅, you can go to production with confidence.

---
---

# PART III — VALIDATION CHECKLISTS: THE GATES OF ANATOMY

**How to use:** before moving to the next module, validate ALL points of the Gate.

## Gate 0 — M0 → M1 (Is the Briefing Clear?)

**File:** `docs/BRIEFING.md`

**Structure (required):** title "BRIEFING: [Project name]" · Problem section (1 paragraph) · Users section (3
max, with roles/permissions) · Success section (3 measurable metrics, with numbers) · Constraints section (Tech,
Budget, Time, Legal) · What's Not Included section (features for v2.0).

**Content (quality):** the problem is specific (not vague) · users have concrete names/roles · success has
NUMBERS (100 logins/day, <200ms, 99.9% uptime) · constraints are realistic · document fits on 1 page · clear
language.

**Communication:** the product owner confirms "this is what we want" · the technical team confirms "we can do
this" · documentation saved + git commit.

✅ **Gate 0 passed?** YES → advance to M1 · NO → go back to M0, refine the Briefing.

## Gate 1 — M1 → M2 (Is the Analysis Complete?)

**Files:** `docs/RISKS.md`, `docs/DEPENDENCIES.md`, `docs/VALIDATIONS.md`

**RISKS.md:** minimum 5 risks identified · each with name, severity, description, concrete mitigation · HIGH
risks have a mitigation plan before M3 · cover security, performance, data, compliance.

**DEPENDENCIES.md:** minimum 3 dependencies mapped · each with ID, name, type, status, effort · status is
`exists`/`create`/`integrate` · none left undefined.

**VALIDATIONS.md:** minimum 15 critical test cases · each with input, expected output, type, reason · types cover
happy path (1+), boundary (5+), error (5+) · cases come directly from the mapped risks.

✅ **Gate 1 passed?** YES → advance to M2 · NO → go back to M1, complete the missing analysis.

## Gate 2 — M2 → M3 (Is the Architecture Validated?)

**Files:** `docs/ARCHITECTURE.md`, `src/`, `docs/CONTRACTS.ts`

**ARCHITECTURE.md:** describes the 4 layers (responsibility, dependencies, examples) · shows the direction of
dependencies (always inward, L3 sovereign) · explains at least 5 of the 9 Signals · contains a diagram · justifies
decisions.

**Folder structure:** `src/` with `domain`, `application`, `infrastructure`, `presentation` · each folder with an
`index.ts` · empty files with TODO comments (no implementation yet) · `tests/` with `unit/` and `integration/`.

**Contracts:** all Input/Output DTOs defined · all Errors/Exceptions defined · all Repository and Service
interfaces defined · no implementation (types only).

**Architecture validation:** L3 doesn't depend on L4 · dependency injection will be used · L3 is pure (no I/O) ·
each layer has clear responsibility.

✅ **Gate 2 passed?** YES → advance to M3 · NO → go back to M2, redo the architecture.

## Gate 3 — M3 → M4 (Are the Tests OK?)

**Files:** `src/` (complete code), `tests/`, `coverage/`

**Code:** no remaining TODOs to implement · lint passes (0 errors) · compiles (0 type errors) · no forgotten
`console.log`s.

**Unit tests:** >80% line coverage · happy path tested · boundary cases tested (empty, minimum, maximum) · error
cases tested · independent tests · fast tests (<500ms total).

**Integration tests:** >60% flow coverage · complete L1→L2→L3→L4 test · real test database · mocked external
services · correct setup/teardown.

**Reference to M1:** all cases from `VALIDATIONS.md` have a test · all risks from `RISKS.md` have a mitigation
test (ex: "SQL Injection" → test with a malicious query).

✅ **Gate 3 passed?** YES → advance to M4 · NO → go back to M3, fix tests/code.

## Gate 4 — M4 → M5 (Is Security Approved?)

**Files:** `SECURITY_REVIEW.md`, code with security implemented

**Security checklist (summary):** passwords with bcrypt (12 rounds) · minimum 8 characters with strength rules ·
short JWT access (15-30min) + long refresh (7 days) · HttpOnly + Secure + SameSite=Strict cookies · HTTPS + HSTS
+ TLS 1.3 · prepared statements (SQL Injection) · CSP + sanitization (XSS) · CSRF tokens · rate limiting (5
attempts/15min) · audit logging of every attempt · secrets in environment variables · clean `npm audit` ·
sensitive data encrypted at rest · defined data retention policy · OWASP Top 10 reviewed.

**SECURITY_REVIEW.md:** document with the complete checklist · for each HIGH/MEDIUM item, description of the
implementation · explicit conclusion: "APPROVED FOR PRODUCTION" or "NOT APPROVED — issues: [list]".

✅ **Gate 4 passed?** YES → advance to M5 · NO → go back to M4, fix the security issues.

## Gate 5 — M5 → Production (Ready to Deploy?)

**Files:** `docs/`, CI/CD pipeline, monitoring

**Documentation:** README (>200 words) · API docs · architecture diagram · deployment guide · troubleshooting.

**Deployment pipeline:** CI/CD configured (lint → test → build → deploy-staging → smoke-tests → deploy-prod) ·
blue-green deployment · automatic rollback if something breaks · post-deploy smoke tests.

**Observability:** centralized logging · metrics collected · dashboard created · alerts configured (error rate,
response time, connection pool, deployment failed) · SLA/uptime monitored.

**Database migrations:** versioned · reversible · no secrets or test data · tested in staging before production.

**Health checks:** fast `/health` endpoint (<100ms) · validates DB connection and critical services · readiness
and liveness probes.

**Rollback plan:** documented (`docs/ROLLBACK.md`) · you know how to roll back manually in a panic scenario.

**Staging validation:** deploy tested in staging first (faithful copy of production) · smoke + performance +
load testing carried out.

**Go-live checklist:** confirmation from product, tech lead, QA, security, ops, and backup.

✅ **Gate 5 passed?** YES → **PRODUCTION READY** · NO → go back to M5, complete the deployment checklist.

## Quick Gate Summary

| Gate | Key file | Question | Passes if… |
|------|----------|----------|------------|
| G0 | BRIEFING.md | Briefing clear? | 1 page, measurable metrics, ok with product owner |
| G1 | RISKS.md + DEPENDENCIES.md + VALIDATIONS.md | Analysis complete? | Everything mapped, risks mitigated, testable validations |
| G2 | ARCHITECTURE.md + CONTRACTS.ts | Architecture validated? | 4 clear layers, sovereign L3, defined interfaces |
| G3 | tests/ + coverage | Tests OK? | >80% coverage, no TODOs, lint passes, compiles |
| G4 | SECURITY_REVIEW.md | Security approved? | OWASP reviewed, clean npm audit, review approved |
| G5 | docs/ + CI/CD | Deploy ready? | Complete docs, automatic pipeline, monitoring active |

**Gates are rigorous:** each one has mandatory requirements, not suggestions. If a requirement fails, the gate
doesn't pass. Gates are not skipped (you can't go straight from M3 to M5) — gates exist precisely to prevent
problems later, when they are more expensive to fix.

> ❌ Wrong: "I'll do security later, right now I want code." ✅ Right: Gate 3 includes tests, Gate 4 includes
> security, Gate 5 includes deploy — each thing in its place.

When `G0 ✅ + G1 ✅ + G2 ✅ + G3 ✅ + G4 ✅ + G5 ✅` = **FEATURE PRODUCTION READY**. You have a well-documented
system, with test coverage, secure, deployable with confidence, monitorable, and recoverable if it breaks.

---
---

# PART IV — CASE STUDY: IMPLEMENTING LOGIN WITH ANATOMY OF SOFTWARE

**Objective:** demonstrate how Anatomy guides a real project, from concept to production.
**Project:** authentication system for a SaaS platform (Login + Sign Up + Password Reset).
**Timeline:** 18-19 days (2-3 days per module).
**Stack:** Node.js + TypeScript + Express + PostgreSQL + JWT.

## M0 — Mindset (Days 1-2)

**Input:** the idea — "We need secure login for our SaaS platform."

**Problem:** users need to authenticate to access the platform.
**Measurable success:** 100 logins/day without failures · response time <200ms · zero unauthorized
authentications · automatic recovery on failure.
**Target users:** Admin (manage users/roles) · Customer (login, recover password) · Staff (support, logs).
**Scope:** basic login (email+password), sign up with validation, password recovery. Out of scope (v2.0):
OAuth/SSO, 2FA.
**Context:** external dependencies (email service, existing PostgreSQL database, JWT library) · constraints
(Node.js stack already in production, ~€5k budget, 3 weeks to MVP, GDPR compliance).

**Output — `BRIEFING.md`:**
```
# BRIEFING: Authentication System

## Problem
Users need a secure way to authenticate on the platform.

## Users
- Customer (2000+ potential) · Admin (5 internal) · Staff (10 support)

## Success
100 logins/day, <200ms · zero breaches · 99.9% uptime · automatic recovery

## Constraints
Node.js stack · PostgreSQL · EU data residency (GDPR) · 3 weeks to MVP

## Not included (v2.0)
OAuth · 2FA · Social login
```

**Gate 0: ✅ APPROVED** — clear, brief briefing, with measurable criteria.

## M1 — Discover (Days 3-5)

**Identified risks (summary):**

| Risk | Severity | Mitigation |
|------|----------|------------|
| SQL Injection (email) | HIGH | Prepared statements |
| Password exposed (transport) | HIGH | HTTPS only, TLS 1.3 |
| Session hijacking | HIGH | Secure/HttpOnly cookies + JWT expiration |
| Brute force | HIGH | Rate limiting (5 attempts/15min per IP) |
| Weak password | MEDIUM | Regex validation: min. 8 chars, number, special |
| Duplicate email | MEDIUM | Unique constraint + validation |
| Token theft | HIGH | Short expiration (15min), refresh tokens (7 days) |
| Database breach | MEDIUM | bcrypt hashing, salts |
| Password reset abuse | MEDIUM | Token expiration (30min), IP validation |

**Mapped dependencies:** user schema (create, 2h) · JWT library (already exists, 0h) · password hashing service
(create, 4h) · email service for reset (integrate SendGrid/Mailgun, 2h) · IP-based rate limiter (create, 3h).

**Critical validations (excerpt):** valid login → success + token · empty email → error · invalid email → error
· short password → error · password without special character → error · registration with existing email →
error · 6 failures in 15 min → blocked · expired token (>15min) → error + redirect to login.

**Gate 1: ✅ APPROVED** — all risks mapped, dependencies clear, validations documented.

## M2 — Design (Days 6-8)

**4-layer architecture:**
- **L4 Infrastructure:** `PostgresUserRepository` (prepared statements, transactions) · `SendGridEmailService`.
- **L3 Domain (sovereign):** `User` entity (id, email, passwordHash, createdAt) · `Email` value object (validates
  format, normalizes) · `Password` value object (validates strength; hashing is done by L2).
- **L2 Application:** `LoginUserUseCase` (receives injected repository, hasher, and JWT generator; orchestrates
  `findByEmail` → `verify` → `generate token`).
- **L1 Presentation:** `POST /auth/login` — thin controller that calls the use case and sets the httpOnly cookie.

**Contracts (excerpt):** `CreateUserDTO { email, password }` · `UserDTO { id, email, createdAt }` ·
`LoginInput { email, password }` · `LoginOutput { token, user }` · errors: `InvalidCredentialsError`,
`UserNotFoundError`, `WeakPasswordError`.

**File structure created:** `src/domain/{entities,value-objects,errors}` · `src/application/{use-cases,dto}` ·
`src/infrastructure/{database,services,middleware}` · `src/presentation/controllers` · `tests/{unit,integration}`
· `docs/{ARCHITECTURE.md,CONTRACTS.md,VALIDATIONS.md}` — all with TODOs ready for M3 to fill in.

**Gate 2: ✅ APPROVED** — architecture respects the 9 Signals (independent domain, dependency injection, etc).

## M3 — Build (Days 9-14)

Complete implementation of the 4 layers according to the M2 contracts:
- `Email.create()` validates format and normalizes (lowercase, trim); throws `InvalidEmailError` if invalid.
- `User.create()` generates the entity with a validated `Email` and the already-computed password hash.
- `LoginUserUseCase.execute()` orchestrates: find user → verify password (bcrypt) → generate JWT → return
  `{ token, user }`; throws `UserNotFoundError` or `InvalidCredentialsError` as appropriate, logging every
  attempt.
- `PostgresUserRepository` implements `create`/`findByEmail` with parameterized queries.
- `POST /auth/login` sets the cookie (`httpOnly`, `secure`, `sameSite: 'Strict'`, 15-minute `maxAge`) and
  translates domain errors into HTTP codes (401 for invalid credentials).

**Tests:** unit tests for `Email`, `User`, `LoginUserUseCase` (success cases, invalid password, user not found)
and integration tests covering the complete flow (create user → login → verify JWT) and failure scenarios
(database unavailable).

**Coverage result:** unit tests ~85% · integration tests ~70% · all M1 validations covered by at least one test.

**Gate 3: ✅ APPROVED** — all tests pass, coverage >80%.

## M4 — Protect (Days 15-17)

Implemented: password hashing with bcrypt (12 rounds) · JWT generation with short expiration (access 15min,
refresh 7 days) · rate-limiting middleware by IP (15-minute window, 5-attempt limit) · enforced HTTPS + HSTS
header · CSRF protection · audit logger (records login attempts and password resets with IP and timestamp) ·
security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Content-Security-Policy`).

**`SECURITY_REVIEW.md` (summary):** authentication and passwords ✅ · session and tokens ✅ · network security ✅ ·
application security (SQL/XSS/CSRF/rate limit/audit) ✅ · database security ✅ · secrets management (environment
variables, monthly rotation) ✅ · dependencies (`npm audit` clean) ✅ · GDPR compliance ✅ · penetration testing
(OWASP Top 10 reviewed) ✅.

**Conclusion:** ✅ APPROVED FOR PRODUCTION.

**Gate 4: ✅ APPROVED** — security review passed with zero known vulnerabilities.

## M5 — Deliver (Days 18-19)

**Documentation:** `README.md` (setup, API endpoints with request/response examples, environment variables,
links to deployment and monitoring).

**CI/CD pipeline:** GitHub Actions — test job (`npm ci`, `npm test`, `npm run lint`) followed by a deploy job
(blue-green deploy to staging, smoke tests, deploy to production, post-deploy health check).

**Observability:** dashboard (Grafana) with login attempt metrics (success/failure), response time (p50/p95/p99),
error rate, rate-limit activations, JWT generation time · alerts (error rate >5%, response time >500ms, rate
limit triggered >10x/hour, DB connection pool >80%) · centralized logs (ELK stack, all login attempts
searchable by email/IP/timestamp).

**Final outputs:** `README.md`, API documentation, deployment guide, monitoring dashboard, CI/CD pipeline —
Login + Sign Up + Password Reset feature ready for production, with an expected 99.9% uptime, OWASP compliance,
and real-time alerts.

## Summary: Anatomy in Action

| Module | Days | Input | Output | Gate |
|--------|------|-------|--------|------|
| M0 | 1-2 | Idea | BRIEFING.md | Briefing clear? ✅ |
| M1 | 3-5 | Briefing | RISKS.md, DEPENDENCIES.md, VALIDATIONS.md | Analysis complete? ✅ |
| M2 | 6-8 | Analysis | ARCHITECTURE.md, CONTRACTS.ts | Architecture validated? ✅ |
| M3 | 9-14 | Architecture | Code + tests (85%) | Tests pass? ✅ |
| M4 | 15-17 | Code | Security review | Security approved? ✅ |
| M5 | 18-19 | Secured | Docs + deploy | Production ready? ✅ |

**Total: 19 days for a production-ready Login.**

## How to Use This Case Study

**For a new dev on the project:** read M0 (vision) → M1 (what was tested) → M2 (architecture) → open the code in
M3 (ready implementation).

**To audit:** confirm M2 (architecture) → M3 (tests >80%?) → M4 (security review approved?) → M5 (deployment
complete?).

**To replicate on another feature:** copy the `BRIEFING.md` template (M0) → copy the `RISKS.md` template (M1) →
adapt `ARCHITECTURE.md` (M2) → follow the M3 code pattern → reuse `SECURITY_REVIEW.md` (M4).

## Conclusion

Anatomy turned a potentially chaotic project into: documented decisions · risk mapped from the start · testable
architecture · security that isn't a crystal ball · predictable deploy · monitoring ready.

**Next feature? Repeat starting from M0.**

---

> **Anatomy of Software v2.1.** A language-, framework-, and AI-agnostic method. Proven by survival to real code
> — not by approval.
>
> *Clean software is not an accident. It's an intentional decision, repeated at every commit, protected by tests
> that don't lie.*

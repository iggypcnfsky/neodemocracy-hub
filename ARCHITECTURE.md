## NeoDemocracy Platform — Architecture

### Goal
A GitHub-like platform for democratic policymaking. People and institutions create policy repositories, open issues, propose changes via pull requests, review, deliberate, vote, and merge—with a cryptographically auditable history, transparent governance rules, and flexible voting strategies.

### Non-goals (initially)
- Build a full blockchain L1/L2. We remain chain-agnostic and optionally integrate for attestations.
- Replace public processes wholesale. Start as a collaboration layer that can be adopted by communities and institutions.

---

## High-level Architecture
- **Clients**: Web app (Next.js) + Admin console. Optional mobile later.
- **APIs**: GraphQL (primary), Webhooks, Realtime over WebSocket (events, presence, live deliberation), REST for webhooks/integrations.
- **Services**:
  - Policy Repository Service (versioned policy content, branches, diffs, PRs)
  - Issue/Discussion Service (threads, comments, reactions)
  - Governance/Voting Engine (strategies, snapshots, quorums, tallies)
  - Identity & Membership (orgs, roles, eligibility, residency checks)
  - Notifications & Subscriptions (email, web, integrations)
  - Search/Indexing (full‑text, facets)
  - Background Workers (tallies, snapshots, exports)
- **Storage**:
  - Postgres (primary relational store)
  - Object Storage (S3 compatible) for attachments, exports
  - Search (Meilisearch or OpenSearch)
  - Cache/Queues (Redis)
  - Optional: Attestation/Anchoring (e.g., Ethereum/OP for proofs)

### Deployment
- Kubernetes (K8s) with horizontal autoscaling.
- Observability: OpenTelemetry, Prometheus, Grafana, Loki.
- CI/CD: Build, migrations, seed, e2e smoke tests, blue/green.

---

## Core Concepts and Domain Model
- **Organization**: Tenant root (city, university, NGO, agency).
- **Space**: Sub-scope within an org (department, neighborhood, topic).
- **Repository (Policy Repo)**: Versioned policy content; analogous to a GitHub repo.
- **Branch**: Parallel policy lines (e.g., `main`, `draft/*`).
- **Commit**: Immutable change to policy content and metadata.
- **Pull Request (Proposal)**: Proposed merge between branches; encapsulates diffs, motivation, and impact assessment.
- **Issue**: Problem/idea/agenda item tracked to inform PRs.
- **Review**: Structured review comments, suggestions, requested changes.
- **Vote**: Formal decision record tied to a proposal, with strategy and rules.
- **Snapshot**: Frozen voter roll & weights at a particular timepoint.
- **GovernanceRule**: Quorum, eligibility, voting method, thresholds, windows.
- **Delegation**: Optional vote delegation graph per space/topic.
- **AuditLog**: Append-only log for critical events.

### ER Outline (abridged)
- `organizations (id, name, slug, metadata)`
- `spaces (id, organization_id, name, slug, governance_rule_id)`
- `memberships (id, user_id, org_id, roles[])`
- `repositories (id, space_id, name, slug, visibility)`
- `branches (id, repository_id, name, head_commit_id)`
- `commits (id, repository_id, author_id, message, created_at)`
- `files (id, repository_id, path, mime, latest_blob_id)`
- `blobs (id, content_hash, size, storage_ref)`
- `trees (id, commit_id)` and `tree_entries (tree_id, path, blob_id)`
- `issues (id, repo_id, author_id, state, title, body)`
- `pull_requests (id, repo_id, source_branch_id, target_branch_id, author_id, state, governance_rule_id)`
- `pr_reviews (id, pr_id, reviewer_id, state, body)`
- `comments (id, parent_kind, parent_id, author_id, body)`
- `votes (id, pr_id, voter_id, weight, option, strategy, ballot_hash?, revealed_choice?)`
- `vote_snapshots (id, pr_id, rule_id, taken_at)`
- `governance_rules (id, scope_kind, scope_id, strategy, quorum, threshold, window_start, window_end, secret_ballot, eligibility_config)`
- `delegations (id, scope_id, delegator_id, delegate_id)`
- `subscriptions (id, user_id, scope_kind, scope_id, event_kinds[])`
- `notifications (id, user_id, event_kind, payload, read_at)`
- `webhooks (id, org_id, url, secret, event_kinds[])`
- `audit_logs (id, actor_id, action, scope_kind, scope_id, payload, created_at)`

Notes:
- Use RLS (Row Level Security) by `org_id` and `space_id` where possible.
- Many-to-many via junction tables where needed; JSONB for extensible metadata.

---

## Governance & Voting Engine
- **Strategies (pluggable)**:
  - `single_choice` (Yes/No/Abstain)
  - `approval` (approve any subset of options)
  - `ranked_choice` (IRV/Condorcet configurable)
  - `quadratic` (QF with cost function and caps)
  - `score` (e.g., 0–5 rating)
- **Quorum & Thresholds**: Absolute or relative to snapshot electorate.
- **Eligibility**:
  - Membership roles, residency proofs, verified email/SSO, allowlists.
  - Optional civic identity integrations (eID, World ID, university SSO).
- **Snapshots**: Freeze voter roll and weights at `window_start` to avoid gaming.
- **Secret Ballots** (optional): commit‑reveal scheme
  - Commit: store `ballot_hash = H(choice || nonce || voter_id || pr_id)`.
  - Reveal: submit `choice, nonce`; verify hash; then tally.
- **Delegation**: Acyclic graph per space/topic with bounded depth to avoid cycles.
- **Tallying**: Deterministic tallies by workers; results immutable and auditable.

---

## Policy Repository & Versioning
- Phase 1: **Git‑like model in Postgres** for simplicity; store blobs and trees, compute diffs server‑side. Pros: transactional integrity, simpler ops.
- Phase 2: Optional **libgit2-backed** storage for repositories to interop with external Git, enabling mirrors and advanced diff tooling.
- Content: Markdown + frontmatter for metadata (title, effective date, scope). Support attachments stored in S3.
- Diffs: Semantic diff for Markdown (headings/sections), plus raw diff view.

---

## APIs
- **GraphQL** (primary):
  - Query: orgs/spaces/repos, issues, PRs, commits, governance rules, votes, tallies.
  - Mutations: create/update org/space/repo; open issue; open PR; comment; request review; configure governance; open vote; cast/reveal vote; merge PR.
  - Subscriptions: PR updates, review events, vote status, merge events.
- **Webhooks**: `issue.opened`, `pull_request.opened`, `review.submitted`, `vote.opened`, `vote.closed`, `pr.merged`.
- **Realtime**: presence in discussions, live typing, soft locks on PR description edits.

---

## Security & Compliance
- **AuthN**: OIDC (Auth.js) with SSO providers; optional wallet linking.
- **AuthZ**: Roles at org/space/repo levels; fine-grained permissions for PRs and votes.
- **RLS** in Postgres; secrets via KMS.
- **Auditability**: append‑only audit logs; optional periodic merkle root anchoring to a public chain.
- **Sybil Resistance**: pluggable attestations (email/phone/SSO/residency). Rate limits, bot filters, CAPTCHA.
- **Privacy**: optional secret ballots; PII minimization; GDPR tooling (export/delete).

---

## Code Architecture
Recommend a monorepo for cohesive evolution and shared types.

```text
.
├─ apps/
│  ├─ web/                # Next.js user-facing app
│  └─ admin/              # Admin console (optional)
├─ services/
│  ├─ api/                # GraphQL API (Node/NestJS or Fastify + Mercurius)
│  ├─ voting-engine/      # Isolated domain service (workers + library)
│  ├─ worker/             # Queue consumers: tallies, snapshots, notifications
│  └─ realtime/           # WebSocket gateway (WS or Socket.IO)
├─ packages/
│  ├─ ui/                 # Design system (React/Tailwind)
│  ├─ types/              # Shared TypeScript types (zod/io-ts)
│  ├─ auth/               # Auth helpers, RBAC policies
│  └─ sdk/                # Client SDK for 3rd-party integrations
└─ infra/
   ├─ k8s/                # Helm charts / manifests
   ├─ terraform/          # Cloud infra
   └─ migrations/         # Database migrations (SQL)
```

### Suggested Tech Choices
- Web: Next.js 15, React 19, Tailwind 4.
- API: Node 20 + Fastify/NestJS, GraphQL (Code‑First), Subscriptions over WS.
- DB: Postgres 15+, Prisma or SQL migrations; RLS.
- Cache/Queue: Redis.
- Search: Meilisearch (fast developer velocity) or OpenSearch (managed clusters).
- Object Storage: S3 compatible.
- Realtime: WS gateway with auth contexts and topic ACLs.
- Background Jobs: BullMQ or Cloud Tasks; idempotent consumers.
- Telemetry: OpenTelemetry + OTLP exporter.

---

## Key Flows

### Open a Policy Proposal (PR)
1. User creates branch from `main`.
2. Edits policy markdown and metadata.
3. Opens PR with summary, impact analysis, linked issues.
4. Reviewers comment; requested changes cycle.
5. Maintainer (or governance rules) opens vote with strategy.
6. Snapshot electorate; voting window opens.
7. Votes cast (optionally commit‑reveal).
8. On success (quorum+threshold): PR auto‑merge; policy version increments.
9. Notifications + webhooks emitted.

### Issue to Agenda to PR
- Issue raised → discussed → labeled/prioritized → linked to PR(s) → closed on merge.

### Delegation Update
- User delegates vote for `transport` topic in `City/Traffic` space to a delegate.
- Snapshot picks up delegation edges at window start.

---

## Data Retention and Transparency
- Immutable commit history and PR timelines.
- Votes and tallies preserved; if secret ballots, reveal data is limited to successful reveals only.
- Public/Private repositories: Public by default for civic processes, private for drafting.

---

## Internationalization & Accessibility
- Full i18n (date/number formats, RTL languages).
- WCAG 2.2 AA: keyboard nav, focus states, text contrast, motion-reduced.

---

## Rollout Plan (Milestones)
- **M0: Foundations**
  - Org/Space/Repo, Issues, PRs, Comments, Reviews, basic roles
  - Markdown policies with semantic diff
  - Webhooks, notifications (email)
- **M1: Governance MVP**
  - Governance rules per repo; single-choice voting
  - Snapshots, quorums, thresholds, simple tallies
  - Delegation (one-level), public results dashboard
- **M2: Advanced Governance**
  - Multiple strategies (approval, ranked, quadratic)
  - Commit‑reveal secret ballots
  - Eligibility providers (residency/SSO), RLS hardening
- **M3: Scale & Integrations**
  - Search, exports, API keys and SDK, admin console
  - Anchoring audit logs to chain (optional)
  - Performance hardening & HA

---

## Risks and Mitigations
- **Sybil attacks**: layered attestations, rate limits, moderation tools.
- **Coordination capture**: diversified roles, quorum rules, transparent logs.
- **Privacy concerns**: secret ballots, PII minimization, scoped access.
- **Complexity creep**: phased delivery, feature flags, clear governance defaults.

---

## Next Steps
- Finalize schema and migrations for M0.
- Stand up GraphQL API with auth context and RLS.
- Build repo/issue/PR flows in web app.
- Implement GovernanceRule model and basic vote flow.
- Integrate Meilisearch for issues/PRs search.

---

## Frontend Prototype Status (Implemented)

### Tech & Design
- Next.js App Router, React 19, Tailwind CSS v4 (dark-only shell).
- shadcn-style primitives implemented locally: `Button`, `Input`, `Textarea`, `Card` (+Header/Content/Footer), `Badge`, `Tabs`.
- Icons: `lucide-react`. Graph canvas: `reactflow`.
- Global UI: sticky dark top nav with icons, compact Create dropdown, search input.

### Navigation & IA
- Top nav links: Policy, Issues, Proposals, Governance (Governance removed from Explore tabs but present in nav).
- Explore tabs (in order): Countries (default), Cities, Policy, Issues, Proposals. Each tab supports rich previews and sorting (Latest/Trending) where applicable.
- Breadcrumbs component shows hierarchical context on all pages (Countries → City → Policy → Issue/Proposal/Editor), including emoji flags.

### Routes (user-facing)
- Explore: `/`
  - Tabs: Countries, Cities, Policy, Issues, Proposals
  - Sorting control on Policy/Issues/Proposals (Latest/Trending)
- Countries: `/countries/[slug]`
- Cities: `/cities/[slug]`
- Policy library (profile): `/libraries/[org]/[repo]`
- Policy editor: `/libraries/[org]/[repo]/editor`
- Issues: list `/issues`, detail `/issues/[id]`, new `/issues/new`
- Proposals: list `/proposals`, detail `/proposals/[id]`, new `/proposals/new`
- New Policy Library: `/libraries/new`

### Explore Content
- Countries (default tab): cards with flag, citizens, counts (policies/issues/proposals), policy links, recent issues/proposals, and chips listing cities. Clicking country opens `/countries/[slug]`; city chips open `/cities/[slug]`.
- Cities: similar card structure with city-level citizens and links to policy/issue/proposal detail pages.
- Policy: cards show org/repo, visibility, stars/forks/updated, location (city, country), open issues and recent proposals (all clickable), and an Open button.
- Issues/Proposals: list items include title, branches (for proposals), associated Policy link, and city/country.

### Policy Library Profile (`/libraries/[org]/[repo]`)
- Left: Files tree (links into Editor). Center: README preview (frontmatter-style summary).
- Right: Open Issues and Open Proposals cards.
- Systemic Lens: interactive canvas (React Flow) showing current policy centered, with related country-level (complementary) and city-level (operational) policies as nodes; nodes link to their pages.
- Impact sections:
  - Who will it impact: simple percentage bars for affected groups (transit riders, night shift workers, etc.).
  - Financial Impact: CapEx/OpEx summaries, 5-year projection, and annual stacked bars with legend and notes.
  - Contributors: grid of people cards with initials avatar, role, and activity stats.

### Policy Editor (`/libraries/[org]/[repo]/editor`)
- Left: folder tree (README, governance, policies/*, impact/*, metrics/*, drafts/*, attachments/*).
- Right: text editor (demo) with per-file state, commit message input, Save/Discard actions.
- Breadcrumbs include Editor as the last segment.

### Entity Profiles
- Country profile: overview stats, policies list, recent issues/proposals, cities list (links to city pages).
- City profile: overview (citizens, country link, policy count), policies list, recent issues/proposals.
- Issue/Proposal detail: title, status badges, policy link, city/country context, timeline/checks (proposal), with full breadcrumbs.

### Data & Demo Layer
- Static demo data in `src/lib/geo-demo.ts` for countries, cities, policies, issues, proposals.
- Helpers: `getPolicyContext(org, repo)`, `findIssueContext(id)`, `findProposalContext(id)` to derive breadcrumb/location context.

### Known Gaps / Next Milestones
- Replace demo data with GraphQL-backed queries; thread auth context.
- Real markdown rendering for README/policies; split-pane preview in editor.
- Edge metadata on Systemic Lens (labels, types, arrows); persist relationships.
- Search & filters (topics/tags) across Explore tabs; deep linking for sort/filter state.
- RBAC and RLS-aligned UI states (visibility, actions) after backend wiring.

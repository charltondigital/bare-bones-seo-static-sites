# Static Site Setup

**Purpose:** Let an AI agent establish lightweight URL-change reporting and safeguards without making the user configure GitHub Actions manually or slowing ordinary site updates.

## Agent setup

1. Inspect the existing site generator, build, deployment path, and GitHub workflows. Reuse what exists; don't install duplicate checks or dependencies.
2. Derive a **baseline inventory of publicly served HTML page paths** from a known-good production build or published sitemap corroborated against the build. Normalize trailing slashes, `index.html`, and route conventions. Record the baseline in version control; distinguish pages from images and other assets.
3. Add a **small deterministic validation script**, integrated with existing CI/build where practical, that compares proposed page URLs and the single redirect registry against the baseline. Have the agent create the workflow/configuration files automatically when needed.
4. Report meaningful changes in a pull request or workflow summary: added pages, missing/renamed pages, and added/changed/removed redirects. Keep normal, unchanged builds quiet.
5. Confirm the planned checks are wired into the deployment path when implementing the standard. A test of simulated changes is recommended **when the user is ready**, not a prerequisite for drafting these standards.
6. Explain clearly whether checks merely report, cause the build to fail, or are **enforced by GitHub/deployment protections**. Don't claim that CI prevents deployment if an agent can push directly or the host deploys despite failed checks.

## Approval and failure rules

- **Routine new pages and content edits:** Allow without extra approval; report new URLs only when useful.
- **Previously public URL removed or renamed:** An AI agent must ask for user approval before changing it and propose the appropriate 301 under [301 Redirects](301-redirects.md). A validator should flag the missing URL; use a failing check where the repository/deployment pipeline supports reliable enforcement.
- **Existing redirects deleted or rewritten:** Flag for review. Preserve them by default; do not assume they are obsolete because an old page is absent.
- **New 301:** An agent may propose and implement it as part of an explicitly user-approved URL change. Otherwise, prepare a reviewable change; avoid repeated approvals for details the user has already authorized.
- **Unclear or incomplete baseline:** Warn rather than automatically blocking the first deployment. Establish the baseline once from known-good output; don't automatically accept every new deployment as the baseline.
- **Validation failure:** Never silently discard a redirect, rewrite the URL inventory, or bypass a failing check to make CI green. Report the issue and offer a targeted fix. Avoid breaking an otherwise functioning live site just to introduce the safeguards.

## Lightweight checks

Check for duplicate sources, self-redirects, loops, redirect chains, missing destinations, and unexpected removal of historical redirects. Validate against built pages and the redirect registry instead of crawling the whole live site or invoking AI on each build. Run whenever changes could alter output URLs or redirects; avoid redundant full builds and unnecessary notifications.

If strong blocking is desired, an authorized agent can configure GitHub rulesets, required status checks, and a protected deployment branch where available. Explain any plan or permission limitations; never assume branch protection exists.

**Principle:** Detect and report meaningful URL risks, protect established URLs, and leave routine development alone. No separate dashboard, service, or human-managed CI configuration.

**Related:** [Cloudflare Static Sites](cloudflare-static-sites.md) for hosting and hostname setup; [301 Redirects](301-redirects.md) for page-level redirects.

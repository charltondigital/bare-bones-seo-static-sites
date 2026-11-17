# Static Site Setup

**Purpose:** Give AI-maintained static sites lightweight, automated **reporting** on URL and redirect changes without slowing routine development or blocking deployments.

## One-time agent setup

1. Discover the site's **actual hosting platform**, static-site generator, build output, source-control setup, and CI. Inspect and reuse existing build workflows. Choose the site's existing CI or build mechanism; avoid additional dependencies and duplicate CI work.
2. Establish a baseline of previously published HTML page URLs from known-good build output or a sitemap verified against the output. Normalize trailing slashes and `index.html`; do not guess paths from source filenames.
3. Create `seo/search-exclusions.json` if absent, with `{"defaults":{"index":true,"sitemap":true},"sections":{},"pages":{}}`. First inspect existing sitemap exclusions and `noindex` rules, carrying forward intentional exceptions. Wire **both** page rendering and the existing sitemap generator to consume this single file at build time. Preserve site structure and existing protections; follow [Indexation and Search Exclusions](indexation.md) for scope, precedence, and verification.
4. Set up the single-owner metadata architecture described in [Metadata and Schema](metadata-schema.md): create sparse `seo/metadata.json` if absent, migrate intentional existing SEO overrides without rewriting them, default title to H1, and ensure one generator per tag. Reuse existing layouts; no required meta descriptions or strategic optimization.
5. Add a fast, deterministic comparison of proposed output and the site's **actual authoritative redirect configuration** against that baseline. Use `_redirects` only where supported; for other hosts, adapt to native redirect configuration. Integrate with existing automation when practical; the agent handles setup, not the user.
6. Report observable differences (new, removed, or changed URLs; added, removed, or modified 301s; duplicate redirects, chains, loops, and missing targets). Disclose unsupported redirect rule types or provider-side rules that the local audit cannot inspect. Keep unchanged builds quiet.
7. **Reporting is advisory by default.** URL warnings must **not fail CI, stop a build, prevent a merge, or block deployment**. Do not add required status checks, repository protection rules, approval gates, or other blocking policies unless the user separately requests them.
8. Apply [Links and HTTP Errors](links-http-errors.md) where appropriate: reuse the built-page baseline for removed-URL reporting, generate an external-link CSV as a build artifact, and check supported redirect rules without a full-site spider. Avoid redundant builds. Leave production 404 analytics with the chosen host/CDN or existing logs unless the user asks for deeper logging.
9. After installation, **execute a representative site build and relevant scripts** where feasible. Verify generated HTML, sitemap, metadata, and reports; disclose skipped checks. A document or workflow file alone does not establish working integration.

## Agent behavior when changes are proposed

- **Routine edits and new pages:** Proceed normally without additional permission or reporting overhead.
- **Removing, renaming, or consolidating established pages:** Proactively show the old URLs and recommend relevant 301 destinations (or explain when 404/410 is more appropriate). Obtain the user's approval for the URL change; one grouped approval covers a batch. If the user has already authorized the specific change and disposition, do not ask again.
- **Adding a 301 for an approved URL change:** The agent may implement the associated mapping in the site's authoritative redirect configuration as part of the approved work.
- **Modifying or deleting an existing 301:** Preserve it unless the user authorizes the change; do not prune historical redirects simply because the source URL no longer has a page.
- **Unexpected changes detected by CI:** Report concise findings, with suggested next steps. Warnings do not stop deployment; agent instructions to request approval are a separate workflow, not a CI gate.
- **Baseline uncertain or incomplete:** Report uncertainty and establish a reliable baseline without freezing an existing working site or silently resetting history.

## Efficiency

Use a small script, build output, and the host-supported redirect configuration. No mandatory live-site crawl, AI call per build, separate database, dashboard, recurring notification, or user-operated CI setup. The agent should choose the simplest implementation appropriate to the site, and avoid needless reporting for harmless changes.

**Principle:** AI should move quickly. Detect and surface risks; never turn this standard into automated deployment bureaucracy.

**Related:** [301 Redirects](301-redirects.md) covers page-level redirects; [Indexation and Search Exclusions](indexation.md) covers shared sitemap and `noindex` controls; [Metadata and Schema](metadata-schema.md) covers single-owner SEO metadata; [Links and HTTP Errors](links-http-errors.md) covers link inventory, redirect validation, and 404 interpretation. Optional implementation guides: [GitHub](platforms/github.md) and [Cloudflare](platforms/cloudflare.md).

# Static Site Setup

**Purpose:** Give AI-maintained static sites lightweight, automated **reporting** on URL and redirect changes without slowing routine development or blocking deployments.

## One-time agent setup

1. Inspect and reuse the site's existing build and GitHub workflow. Avoid additional dependencies and redundant Actions.
2. Establish a baseline of previously published HTML page URLs from known-good build output or a sitemap verified against the output. Normalize trailing slashes and `index.html`; do not guess paths from source filenames.
3. Add a fast, deterministic comparison of the proposed output and existing `_redirects` registry against that baseline. Integrate with existing CI when practical; the agent handles setup, not the user.
4. Report meaningful differences (new, removed, or changed URLs; added, removed, or modified 301s; duplicate redirects, chains, loops, and missing targets). Keep unchanged builds quiet.
5. **Reporting is advisory by default.** URL warnings must **not fail CI, stop a build, prevent a merge, or block deployment**. Do not add required status checks, branch protections, approval gates, or blocking GitHub rulesets for this system unless the user separately requests them.
6. When actually implementing the checks in a site, verify they run as intended when convenient. Do not claim enforcement exists merely because a workflow was created.

## Agent behavior when changes are proposed

- **Routine edits and new pages:** Proceed normally without additional permission or reporting overhead.
- **Removing, renaming, or consolidating established pages:** Proactively show the old URLs and recommend relevant 301 destinations (or explain when 404/410 is more appropriate). Obtain the user's approval for the URL change; one grouped approval covers a batch. If the user has already authorized the specific change and disposition, do not ask again.
- **Adding a 301 for an approved URL change:** The agent may implement the associated mapping in GitHub as part of the approved work.
- **Modifying or deleting an existing 301:** Preserve it unless the user authorizes the change; do not prune historical redirects simply because the source URL no longer has a page.
- **Unexpected changes detected by CI:** Report concise findings, with suggested next steps. Warnings do not stop deployment; agent instructions to request approval are a separate workflow, not a CI gate.
- **Baseline uncertain or incomplete:** Report uncertainty and establish a reliable baseline without freezing an existing working site or silently resetting history.

## Efficiency

Use a small script, build output, and the redirect file. No live-site crawl, AI call per build, separate database, dashboard, recurring notification, or manual GitHub Action setup. The agent should choose the simplest implementation appropriate to the site, and avoid needless reporting for harmless changes.

**Principle:** AI should move quickly. Detect and surface risks; never turn this standard into automated deployment bureaucracy.

**Related:** [Cloudflare Static Sites](cloudflare-static-sites.md) covers domains and hosting; [301 Redirects](301-redirects.md) covers page-level redirects.

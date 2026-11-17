# Static Site Setup

**Purpose:** Give AI-maintained static sites lightweight, automatic URL-integrity checks from the start, with no manual GitHub Actions setup required of the user.

## One-time agent setup

When setting up a new site, the AI agent should:

1. Inspect the existing build and deployment workflow; reuse it rather than adding redundant tooling.
2. Generate a baseline inventory of published page URLs from the build output (not guessed from source filenames). Normalize URL paths consistently, including trailing-slash conventions.
3. Set up a fast deterministic check (and GitHub Actions workflow if needed) to compare the proposed build's URL inventory with the previously approved baseline and check the site's redirect registry.
4. Have the check summarize **new URLs, removed/changed URLs, and redirect additions/modifications/deletions** in the GitHub Actions job summary or pull request when possible.
5. Test the check with a benign addition and a simulated removal/redirect conflict. Verify it actually runs in the site's deployment workflow.
6. Explain any GitHub repository permissions or protection settings required to prevent a failed check from being bypassed. Where the agent has appropriate access it can propose and configure those protections; never claim the checks block deployments unless enforcement is verified.

The user should not need to create an Actions workflow by hand. For routine changes that preserve published URLs, the check should be quiet and require no extra manual review.

## Lightweight URL-integrity behavior

- **New URL:** Report as informational; no special approval required.
- **Removed or renamed URL:** Flag and fail the check unless the change was explicitly approved and an appropriate redirect plan exists. The agent must not change published URLs on its own.
- **Redirect change:** Show the exact old and new mapping. Detect duplicate sources, self-redirects, loops, chains, invalid targets, and unexpected deletion of existing mappings. The separate [301 Redirects](301-redirects.md) standard governs the file format and editing policy.
- **Destination validation:** Prefer checking against built pages and known redirect maps; do not crawl the entire public site on every build.
- **Report:** Show only meaningful differences, with concise actionable errors. Avoid a new dashboard, service, database, or recurring notification system.

## Efficiency and safety

Prefer a small script run as part of the existing build/CI process. Trigger checks when relevant files or the generated URL inventory change where practical, but don't accidentally skip checks on a deployment that can alter URLs. Keep a reliable baseline tied to a previously approved production version; do not automatically replace the baseline with an unreviewed build, which would hide removals.

**Important:** An AI-written policy, a passing GitHub Action, and enforced branch/deployment protection are different things. Agent setup is complete only when checks are demonstrated and any remaining enforcement gaps are disclosed.

**Scope:** General site setup and URL change reporting. Cloudflare hosting is covered by [Cloudflare Static Sites](cloudflare-static-sites.md); page-level redirects are covered by [301 Redirects](301-redirects.md).

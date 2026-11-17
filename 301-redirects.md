# 301 Redirects for Static Sites

**Purpose:** Keep permanent page redirects in GitHub, prevent AI agents from silently changing established URLs, and minimize unnecessary human work or deployment overhead.

**Scope:** Page-level redirects for GitHub-deployed static sites, including Cloudflare Workers Static Assets. Domain canonicalization (`www` and HTTPS) is covered by [Cloudflare Static Sites](cloudflare-static-sites.md).

## Default implementation

Use a single, declarative `_redirects` file in the site's tracked source, placed where the static-site build copies it into its deployed asset directory (often `public/_redirects`). Cloudflare Workers Static Assets supports this file natively for static-asset responses. Do not add custom redirect-handling Worker code just for ordinary 301s.

Example:

```text
/old-page/ /new-page/ 301
/previous-services/ /services/ 301
```

Do **not** duplicate these page-level redirects in Cloudflare dashboard rules, Astro routing, or multiple files. If a project uses Worker code that serves a request instead of static assets, check Cloudflare's limitations: `_redirects` may not apply to that response.

## Rules for AI agents

- **Protect existing published URLs.** Do not rename, move, remove, or change an existing page path without the user's explicit permission. This includes changes caused indirectly by slugs, content collections, routing configuration, or a rebuild.
- **Propose before changing.** For a needed URL change, show the exact old and new paths and the corresponding 301 redirect; explain the reason and ask for approval. Do not silently alter historical URLs.
- **Use one registry.** Read the existing `_redirects` file before editing it. Preserve unrelated redirects and their history.
- **Avoid unnecessary approvals.** Ordinary content changes that preserve URLs need no additional redirect discussion. A user may review and edit redirects directly without separately approving an agent's instructions.
- **Keep the agent useful.** Agents may draft redirect changes, validate them, and prepare a reviewable commit or pull request. Do not deploy potentially disruptive redirect changes without appropriate user authorization and repository controls.

## Lightweight validation

At build or pull-request time, check the following **only when the URL inventory or redirect file changes**, when practical:

1. Detect deleted or renamed previously published paths, and flag those without an approved plan.
2. Reject duplicate redirect sources, self-redirects, simple loops, and chains (point an old URL directly to its final destination).
3. Confirm every redirect destination is an intended live, canonical path, not another redirect or a missing page.
4. Ensure the `_redirects` file is included in the final build output and that existing entries were not silently removed.
5. After deployment, spot-check affected URLs return 301 with the expected `Location` header.

Prefer a fast, deterministic script over expensive crawling or AI review on every build. Don't require a person to manually inspect a full redirect inventory for each ordinary commit. For strict enforcement, use GitHub branch/ruleset protections with required checks and a human reviewer for protected URL or redirect changes; instructions alone are not technical enforcement.

## Performance and boundaries

Cloudflare parses `_redirects` rules into static-asset delivery, so a small or moderate redirect file does not require custom Worker application execution on every page request. Keep rules simple and use the hosting platform's documented matching behavior and limits. This file is for **page-level** redirects, not broad hostname migrations or complex conditional routing.

**Principle:** Keep established URLs stable; when a change is approved, implement the smallest verified 301 in one version-controlled location.

## Official reference

- [Cloudflare Workers Static Assets redirects](https://developers.cloudflare.com/workers/static-assets/redirects/)

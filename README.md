# Bare Bones SEO for Static Sites

A collection of practical standards for **SEO visibility and control on static AI-generated websites**.

## Available standards

- [Static Site Setup](site-setup.md) — have an AI agent install lightweight URL change detection, validation, and reporting during initial site setup.

- [Cloudflare Static Sites](cloudflare-static-sites.md) — deploy a new GitHub-based static website using Cloudflare Workers Static Assets, with one canonical HTTPS domain.
- [301 Redirects for Static Sites](301-redirects.md) — keep page redirects in GitHub with lightweight validation and URL-change safeguards.
- [Indexation and Crawling](indexation.md) — centralize sitemap and `noindex` controls in `seo/search-exclusions.json`, while keeping crawler rules separate.
- [Robots audit template](templates/robots-audit.yml) and [audit script](scripts/check-robots.mjs) — optional, non-blocking crawler access warnings for individual website repositories.

Each standard is a focused Markdown guide. No legacy migration procedures or general optimization advice are included in the Cloudflare guide.

# Bare Bones SEO for Static Sites

**Version 0.1 — initial standards and reusable templates**

A collection of practical standards for **SEO visibility and control on static AI-generated websites**.

**Bare Bones enforces the integrity of SEO controls, not the optimization of SEO content.** Settings should have one authoritative owner, survive rebuilds, and be inspectable without telling practitioners what keywords, descriptions, or schema they ought to use. Technical warnings are advisory by default.

## Available standards

- [Static Site Setup](site-setup.md) — have an AI agent install lightweight URL change detection, validation, and reporting during initial site setup.

- [Cloudflare Static Sites](cloudflare-static-sites.md) — deploy a new GitHub-based static website using Cloudflare Workers Static Assets, with one canonical HTTPS domain.
- [301 Redirects for Static Sites](301-redirects.md) — keep page redirects in GitHub with lightweight validation and URL-change safeguards.
- [Indexation and Search Exclusions](indexation.md) — centralize sitemap and `noindex` controls in `seo/search-exclusions.json`, while keeping crawler rules separate.
- [Metadata and Schema](metadata-schema.md) — default title to H1, preserve a single owner for each SEO field, and make descriptions optional.
- [Links and HTTP Errors](links-http-errors.md) — export external links as a build artifact, check simple redirect chains, and use Cloudflare data for optional live 404 analysis.
- [Robots audit template](templates/robots-audit.yml) and [audit script](scripts/check-robots.mjs) — optional, non-blocking crawler access warnings for individual website repositories.

Each standard is a focused Markdown guide. No legacy migration procedures or general optimization advice are included in the Cloudflare guide.

## Installation approach

This repository is a **standards and template library**, not an automatically installed plugin. An AI coding agent should read [Site Setup](site-setup.md), inspect the target site's existing build and workflows, copy or adapt only the needed scripts and Actions, and verify the result. Do not blindly copy scripts into every site. **Version 0.1 is the initial documented baseline, not a published GitHub release or validated cross-framework installer.**

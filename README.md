# Bare Bones SEO for Static Sites

**Version 0.1 — core standards and reusable utilities**

A minimal, **hosting- and source-control-neutral** approach to SEO visibility and control for AI-maintained static websites.

**Bare Bones enforces the integrity of SEO controls, not the optimization of SEO content.** One authoritative owner per setting; preserve explicit decisions; verify generated output; report technical issues without dictating keywords, metadata lengths, or SEO strategy. Advisory checks must not block ordinary builds or deployments by default.

## Core standards (work on any static host)

1. [Site Setup](site-setup.md) — discover the existing website, integrate the standards into its build, and verify actual output.
2. [Metadata and Schema](metadata-schema.md) — title defaults to H1; optional centralized overrides; one owner per metadata field.
3. [Indexation and Search Exclusions](indexation.md) — a single `seo/search-exclusions.json` controls sitemap inclusion and `noindex`.
4. [301 Redirects](301-redirects.md) — protect established URLs and use the selected host's supported redirect mechanism.
5. [Links and HTTP Errors](links-http-errors.md) — optional external-link inventory, redirect diagnostics, URL change reports, and host-log-based 404 investigation.

## Platform guides (use only when relevant)

- [GitHub](platforms/github.md) — repository installation, GitHub Actions, advisory checks, and downloadable workflow artifacts. Does **not** assume GitHub hosts the website.
- [Cloudflare](platforms/cloudflare.md) — Workers Static Assets, domains, DNS, redirects, dashboard operations, and available 404 analytics.

Additional hosting, source-control, or CI guides can be added without changing the core standards.

## Reusable implementation files

- `scripts/` — portable Node.js utilities to inventory external links, check simple `_redirects` rules, and flag possible crawler blocks. These scripts are examples to adapt, **not automatically installed**.
- `templates/github/` — example GitHub Actions workflows. They are GitHub-specific, Node-oriented templates, **not** universal build configurations.
- `tests/` — deterministic Node tests for the scripts, Markdown links, and JSON examples.

## Installation by an AI coding agent

1. Read [Site Setup](site-setup.md) and the relevant core standards.
2. Inspect the target site's actual generator, deployment host, version-control environment, and existing CI.
3. Read [GitHub](platforms/github.md), [Cloudflare](platforms/cloudflare.md), or both **only if the target site uses them**.
4. Adapt and install only the missing components. Preserve existing published URLs, metadata, redirect decisions, and site behavior.
5. Build the target site, verify its rendered metadata, sitemap, robots directives, and any installed audits; report what was and was not validated.

**Version 0.1** is a standards baseline, not a published cross-platform installer. Passing repository regression tests do **not** demonstrate complete installation on every framework or hosting provider.

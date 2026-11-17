# GitHub Implementation

**Purpose:** Apply the [Bare Bones core standards](../README.md) to repositories using GitHub, with optional GitHub Actions for repeatable, **advisory** verification. GitHub is a source-code and CI choice, **not** a required static hosting provider.

## Installation by an AI agent

1. Inspect the website's existing repository, build tooling, package manager, deployment pipeline, GitHub workflows, and host. Read [Site Setup](../standards/site-setup.md) and the other core standards before modifying anything.
2. Preserve existing published URLs, redirects, metadata, indexation and deployment configuration. Integrate the core settings into the website's actual build. Do **not** assume GitHub Actions can enforce SEO settings without those integrations.
3. Use existing workflows and build outputs where practical. Only add scripts and Actions that serve the site's needs; never add a second site build unnecessarily.
4. If adding workflows, commit them under `.github/workflows/` in the **target website repository**. Generate workflows tailored to the actual project; this playbook does not ship mandatory templates.
5. Execute the actual site build and relevant audits, confirm artifacts and generated output, and disclose any unverified integrations. Keep warning checks non-blocking by default.

## GitHub Actions design

An AI coding agent can create small, deterministic checks using the site's existing language and build tooling:

- **External links:** After building, extract outgoing HTTP(S) hyperlinks with referring page paths. Emit a CSV with `external_url,source_page` and upload it using `actions/upload-artifact` instead of repeatedly committing reports.
- **Redirect validation:** Inspect the authoritative redirect configuration for duplicate sources, chains, loops, and missing local targets. Check what the host actually supports; do not assume all hosts consume `_redirects`.
- **Robots warnings:** Read the built `robots.txt` and, when useful, the sitemap; warn about possible accidental blocks of search and AI-search crawlers. Never automatically rewrite crawler rules.
- **URL history:** Compare published-page URLs to the prior known-good baseline to detect unexpected removals or renames. Preserve past approved redirects.

Build once where practical; use `actions/checkout`, the necessary runtime and project build steps, then run lightweight checks. Use `GITHUB_STEP_SUMMARY` for short findings and `actions/upload-artifact` for generated inventories. Adjust events, branch names, package manager, and output directories to the site rather than copying generic templates.

On GitHub, workflow warnings should be visible in run logs or `GITHUB_STEP_SUMMARY`. Keep advisory checks from failing or stopping deployments. Do not create branch protections, required checks, approval gates, or recurring notifications by default.

## Repository and host boundaries

- Keep user-controlled SEO settings in the **target site's** repository: `seo/metadata.json` and `seo/search-exclusions.json`. Follow the [Metadata](../standards/metadata-schema.md) and [Indexation](../standards/indexation.md) standards to wire them into rendering and sitemap generation. A config file alone does not affect deployed HTML.
- Maintain redirect ownership using the host's supported source-controlled mechanism where possible. Not every static host interprets a `_redirects` file. See [301 Redirects](../standards/301-redirects.md).
- GitHub Actions can deploy to Cloudflare, Netlify, Vercel, a private server, or another host. Provider-specific deployment, DNS, CDN analytics, and hostname redirects belong to that provider's documentation. For Cloudflare see [Cloudflare](cloudflare.md).
- If the project uses GitLab CI, another CI service, or local builds, apply the **same core standards** with the equivalent build tasks and artifacts. Do not require GitHub for SEO compliance.

**Principle:** GitHub makes installation and reporting convenient; it does not define SEO policy.

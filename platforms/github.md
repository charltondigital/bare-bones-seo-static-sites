# GitHub Implementation

**Purpose:** Apply the [Bare Bones core standards](../README.md) to repositories using GitHub, with optional GitHub Actions for repeatable, **advisory** verification. GitHub is a source-code and CI choice, **not** a required static hosting provider.

## Installation by an AI agent

1. Inspect the website's existing repository, build tooling, package manager, deployment pipeline, GitHub workflows, and host. Read [Site Setup](../site-setup.md) and the other core standards before modifying anything.
2. Preserve existing published URLs, redirects, metadata, indexation and deployment configuration. Integrate the core settings into the website's actual build. Do **not** assume GitHub Actions can enforce SEO settings without those integrations.
3. Use existing workflows and build outputs where practical. Only add scripts and Actions that serve the site's needs; never add a second site build unnecessarily.
4. If adding workflows, commit them under `.github/workflows/` in the **target website repository**. The examples below require adapting paths and package/build commands; the files in this standards repository are **not installed automatically**.
5. Execute the actual site build and relevant audits, confirm artifacts and generated output, and disclose any unverified integrations. Keep warning checks non-blocking by default.

## Reusable scripts and Actions

- [External-link inventory](../scripts/external-links.mjs) generates a CSV from built HTML, with each external URL and its linking page. Upload the CSV using `actions/upload-artifact`; do not commit regenerated reports on every build.
- [Redirect checker](../scripts/check-redirects.mjs) checks **only** straightforward static `_redirects` rules for possible chains, loops, and other issues. **First confirm the host supports this format**; choose another checker when the site uses a different redirect mechanism.
- [Robots audit](../scripts/check-robots.mjs) reads the **generated** `robots.txt` (and optionally the sitemap), and issues advisory warnings about potentially blocked search and AI-search crawlers. Never alter crawler rules automatically.
- [Links and redirects workflow template](../templates/github/links-and-redirects.yml) and [robots workflow template](../templates/github/robots-audit.yml) are examples for **Node-based** site builds. Adapt to the site's language, dependency manager, output path, target hostname, and preexisting CI. These examples use GitHub-hosted workflow artifacts, not a persistent reporting database.

On GitHub, workflow warnings should be visible in run logs or `GITHUB_STEP_SUMMARY`. Keep advisory checks from failing or stopping deployments. Do not create branch protections, required checks, approval gates, or recurring notifications by default.

## Repository and host boundaries

- Keep user-controlled SEO settings in the **target site's** repository: `seo/metadata.json` and `seo/search-exclusions.json`. Follow the [Metadata](../metadata-schema.md) and [Indexation](../indexation.md) standards to wire them into rendering and sitemap generation. A config file alone does not affect deployed HTML.
- Maintain redirect ownership using the host's supported source-controlled mechanism where possible. Not every static host interprets a `_redirects` file. See [301 Redirects](../301-redirects.md).
- GitHub Actions can deploy to Cloudflare, Netlify, Vercel, a private server, or another host. Provider-specific deployment, DNS, CDN analytics, and hostname redirects belong to that provider's documentation. For Cloudflare see [Cloudflare](cloudflare.md).
- If the project uses GitLab CI, another CI service, or local builds, apply the **same core standards** with the equivalent build tasks and artifacts. Do not require GitHub for SEO compliance.

**Principle:** GitHub makes installation and reporting convenient; it does not define SEO policy.

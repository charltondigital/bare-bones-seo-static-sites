# Bare Bones SEO for Static Sites

**Version 0.1 — core standards and reference playbooks**

A compact, host-neutral set of standards for SEO visibility and control on AI-maintained static websites.

**Bare Bones enforces the integrity of SEO controls, not the optimization of SEO content.** One source of truth per setting, durable intentional decisions, generated-output verification, and advisory—not blocking—technical warnings. No mandatory keyword advice, metadata length scoring, or SEO optimization bureaucracy.

## Start here

An AI coding agent should first read [Site Setup](standards/site-setup.md), then the relevant standards. It should **implement the required outcomes using the target site's existing architecture and tooling**, without installing Node.js, GitHub Actions, Cloudflare, or any other platform merely to comply.

### Standards — authoritative, platform-independent

1. [Site Setup](standards/site-setup.md) — discover existing architecture, integrate controls into the build, and verify the result.
2. [Metadata and Schema](standards/metadata-schema.md) — H1-based title default, optional centralized overrides, single ownership.
3. [Indexation and Search Exclusions](standards/indexation.md) — centralized sitemap inclusion and `noindex` decisions.
4. [301 Redirects](standards/301-redirects.md) — protect public URLs and choose the site's supported redirect mechanism.
5. [Links and HTTP Errors](standards/links-http-errors.md) — external-link inventory, redirect and URL-change diagnostics, optional 404 analysis.

**The standards define outcomes, not languages, tools, services, or CI implementations.** One platform's mechanism is never a mandatory standard.

### Playbooks — proven platform procedures, optional

- [Cloudflare](playbooks/cloudflare.md) — Workers Static Assets, custom domains, `www`, HTTPS, preview hostname exposure, DNS, page redirects, and available 404 analytics.
- [GitHub](playbooks/github.md) — source-control integration, non-blocking GitHub Actions, run artifacts, and repository practices.

**Read the relevant playbooks even for other platforms when useful:** they reveal functional requirements and lessons learned. Then identify equivalent capabilities on the target system, adapt appropriately, and verify. **Never assume another platform supports identical files, commands, dashboard controls, or behavior.** Preserve details from platform experience without elevating them to universal requirements.

### Examples — non-authoritative reference implementations

- [Node.js scripts](examples/scripts/) — outgoing-link inventory, simple `_redirects` diagnostics, and `robots.txt` warnings.
- [GitHub Actions templates](examples/github-actions/) — sample CI workflows for Node-based static-site builds.
- [Tests](tests/) — repository checks for these examples and documentation.

Examples are optional. Another AI agent can create equivalent Python scripts, GitLab CI pipelines, framework build hooks, etc. The tests verify the examples, not universal compliance or a completed installation on a target website.

## Installation checklist for agents

1. Discover the target site's generator, build output, host, source control, and automation.
2. Follow all applicable **standards**; use platform **playbooks** as references where they reduce guesswork.
3. Preserve published URLs, metadata overrides, indexation and redirect settings.
4. Write the simplest site-native implementation that meets the standards. Install only useful examples, if any.
5. Test the actual built output, verify generated HTML/sitemap/redirect behavior and relevant reports, and disclose any limitations. Do not claim success based on a Markdown file or a configuration file alone.

**Version 0.1 is a standards baseline**, not a published cross-platform installer or proof that every hosting configuration has been validated.

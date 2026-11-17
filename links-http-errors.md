# Links and HTTP Errors

**Purpose:** Preserve meaningful URL controls and provide low-cost visibility without building a spider, requiring manual SEO audits, or treating every 404 as a problem.

## External-link inventory

After a static site build, extract distinct outgoing HTTP(S) hyperlinks from generated HTML along with each referring site's page path. Export a CSV with **`external_url`** and **`source_page`** columns, one row per destination/source combination. Do **not** automatically visit, score, or test these external URLs.

Use the reusable [external link inventory script](scripts/external-links.mjs), adapting the script if the target site has additional rendering formats. Example:

```sh
node scripts/external-links.mjs dist https://example.com seo/reports/external-links.csv
```

`seo/reports/external-links.csv` is a **generated output location**, not an authoritative SEO configuration file. Under GitHub Actions, upload it as a **run artifact**, not an automatically committed file. Add generated reports to `.gitignore` in the website repository if needed. The user may download the CSV, run it through a spider or link-checking tool, or ignore it. Never require the user to fix or inspect these links.

## Redirect integrity

Continue using the [301 Redirects standard](301-redirects.md): existing rules are durable, and removing or renaming established URLs requires user authorization. A small script can inspect the site’s page-level `_redirects` registry for duplicate sources, simple chains, loops, and missing local targets. The [redirect-check script](scripts/check-redirects.mjs) is a **starting point for straightforward static rules**, not a complete interpreter for all redirect syntax. If the site uses wildcard rules, framework redirects, or Cloudflare zone-level redirects, inspect those mechanisms separately; do not claim the registry covers them.

Run checks after builds when practical. Report warnings without failing builds, blocking deployment, or automatically rewriting established redirects. For chains, recommend a direct destination rather than silently changing historical rules.

Use the [GitHub Actions example](templates/links-and-redirects.yml) as an **installation template**, not a universal drop-in. The AI installer adapts its build command, actual static output directory, site URL, redirect file, and existing workflows and should avoid duplicate builds. Tests and deployment status checks remain non-blocking.

## Disappearing URLs

Use the [Static Site Setup standard](site-setup.md) to compare actual published page inventories across builds and report unexpectedly removed pages. A generated sitemap by itself may omit intentionally excluded pages, so use built HTML or a verified complete URL inventory as the baseline. A deleted URL isn't automatically a broken link or a reason to create a redirect. See [301 Redirects](301-redirects.md).

## Real 404 requests

A build cannot reveal which nonexistent URLs visitors or bots requested. For live 404 analysis, **reuse Cloudflare analytics or existing request logs if available**, on request. Do not install a custom Worker, database, or always-on logging pipeline by default.

Treat Cloudflare human/bot classifications as **signals, not proof of a real person**. Depending on the site's plan and available data, use bot scores, verified crawler status, request frequencies, and paths, while noting sampling and access limitations. Distinguish known bot probes (for example, `/wp-admin/`) from likely navigation mistakes, missing previously published pages, and real internal referrers. If the account provides only aggregate 404 counts, say that individual URLs or human-vs-bot classifications are unavailable; do not invent them.

Do not assume that every 404 needs repair: a removed page with no relevant replacement may correctly serve 404 or 410. External link auditing and complete live-site crawling belong to optional specialist spider tools, not Bare Bones's required automation.

## Agent policy

- Favor visibility and repeatability over scores and prescriptions.
- Produce reports as deterministic build artifacts, with no AI calls per build.
- Use existing site tooling where feasible and install only components that add value.
- **No blocking builds**, no repetitive approvals, no mandatory audits, no requirement to fix every warning.
- Never silently change a user's URL or redirect decision.

**Principle:** Inventory, detect, report, and leave decisions with the SEO practitioner.

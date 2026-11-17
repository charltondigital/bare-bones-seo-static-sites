# Links and HTTP Errors

**Purpose:** Preserve meaningful URL controls and provide low-cost visibility without building a spider, requiring manual SEO audits, or treating every 404 as a problem.

## External-link inventory

After a static site build, extract distinct outgoing HTTP(S) hyperlinks from generated HTML along with each referring site's page path. Export a CSV with **`external_url`** and **`source_page`** columns, one row per destination/source combination. Do **not** automatically visit, score, or test these external URLs.

Have the AI agent implement extraction with the site's existing build tools; avoid adding an unrelated runtime solely for this report. A conceptual command might be:

```sh
<site-specific-build-command> && <site-specific-inventory-command>
```

`seo/reports/external-links.csv` is a **generated output location**, not an authoritative SEO configuration file. Keep it as a **build or CI artifact**, not an automatically committed file. The [GitHub playbook](../playbooks/github.md) explains GitHub Actions artifacts. Add generated reports to `.gitignore` in the website repository if needed. The user may download the CSV, run it through a spider or link-checking tool, or ignore it. Never require the user to fix or inspect these links.

## Redirect integrity

Continue using the [301 Redirects standard](301-redirects.md): existing rules are durable, and removing or renaming established URLs requires user authorization. First discover the host's actual redirect mechanism. A small script can inspect supported rules for duplicate sources, simple chains, loops, and missing local targets. A site-specific checker must support the actual redirect format; a simple `_redirects` parser is insufficient for wildcards, host-level redirects, and provider-specific rules. For platforms using other formats or dashboard configuration, install an appropriate validator or explicitly report that registry validation is not available; do not silently install an ineffective `_redirects` file.

Run checks after builds when practical. Report warnings without failing builds, blocking deployment, or automatically rewriting established redirects. For chains, recommend a direct destination rather than silently changing historical rules.

The agent adapts existing build or CI checks to the project's dependency installation, build command, static output directory, site URL, and supported redirect format; avoid redundant builds. The [GitHub playbook](../playbooks/github.md) describes how an agent can create equivalent GitHub Actions. Checks remain advisory and non-blocking.

## Disappearing URLs

Use the [Static Site Setup standard](site-setup.md) to compare actual published page inventories across builds and report unexpectedly removed pages. A generated sitemap by itself may omit intentionally excluded pages, so use built HTML or a verified complete URL inventory as the baseline. A deleted URL isn't automatically a broken link or a reason to create a redirect. See [301 Redirects](301-redirects.md).

## Real 404 requests

A build cannot reveal which nonexistent URLs visitors or bots requested. For live 404 analysis, **reuse the selected host's analytics, CDN analytics, web-server logs, or existing request logs if available**, on request. Do not install a custom request interceptor, database, or always-on logging pipeline by default. Where the host does not expose request-level paths, report that limitation. Provider-specific guidance, if needed, belongs in the relevant [platform guide](../playbooks/cloudflare.md).

Treat any provider's human/bot classifications as **signals, not proof of a real person**. Depending on available data, use bot assessments, verified crawler status, request frequencies, and paths, while noting sampling and access limitations. Distinguish known bot probes (for example, `/wp-admin/`) from likely navigation mistakes, missing previously published pages, and real internal referrers. If the provider exposes only aggregate 404 counts, say that individual URLs or human-vs-bot classifications are unavailable; do not invent them.

Do not assume that every 404 needs repair: a removed page with no relevant replacement may correctly serve 404 or 410. External link auditing and complete live-site crawling belong to optional specialist spider tools, not Bare Bones's required automation.

## Agent policy

- Favor visibility and repeatability over scores and prescriptions.
- Produce reports as deterministic build artifacts, with no AI calls per build.
- Use existing site tooling where feasible and install only components that add value.
- **No blocking builds**, no repetitive approvals, no mandatory audits, no requirement to fix every warning.
- Never silently change a user's URL or redirect decision.

**Principle:** Inventory, detect, report, and leave decisions with the SEO practitioner.

# Cloudflare Static Sites

**Purpose:** Publish a static site from GitHub using Cloudflare Workers Static Assets or maintain an existing Cloudflare Pages deployment, with **one public production address: `https://customdomain.com`**.

This is a **Cloudflare-specific implementation playbook** regardless of static-site generator. Prefer Workers Static Assets for new sites; the separate Pages procedure below applies to existing Pages deployments without requiring migration. It does not cover general SEO. The core SEO standards do not require Cloudflare.

## Setup — Workers Static Assets

1. **Configure deployment.** In Cloudflare **Workers & Pages**, create a Worker with Static Assets. Configure the site's build command and output directory. For Astro, a typical setup uses `npm run build` and `dist/`; use a Workers static-assets configuration such as Wrangler `assets.directory = "./dist"`. Connect a supported Git-based deployment integration (e.g. GitHub via Workers Builds) or deploy through your existing CI. For GitHub-specific automation, see [GitHub](github.md).
2. **Assign the production domain.** In the Worker's **Settings → Domains & Routes**, add **Custom Domain** `customdomain.com` only. Confirm Cloudflare has provisioned the required DNS routing and HTTPS certificate.
3. **Disable the default public hostname.** Disable the Worker's `workers.dev` route in **Domains & Routes**. For projects using Wrangler configuration, set `workers_dev = false` and verify a subsequent deployment doesn't restore the route. **Preview/version URLs are separate**; review their accessibility independently.
4. **Add WWW DNS.** In **DNS → Records** for `customdomain.com`, make sure `www` is **proxied** (orange cloud). For redirect-only `www`, a proxied A record pointing to the reserved placeholder IP `192.0.2.1` is suitable. Do not attach `www` as another Worker custom domain merely to redirect it.
5. **Redirect WWW to root.** In **Rules → Redirect Rules**, use Cloudflare's **Redirect from WWW to root** template. Use **301**, preserve paths and query strings, and confirm the destination is `https://customdomain.com`. Check HTTP and HTTPS behavior; don't assume the template alone handles both schemes.
6. **Enforce HTTPS.** In **SSL/TLS → Edge Certificates**, turn on **Always Use HTTPS**.
7. **Test.** Confirm:
   - `https://customdomain.com` serves the site;
   - `http://customdomain.com` redirects to HTTPS;
   - `https://www.customdomain.com/example/?x=1` redirects to `https://customdomain.com/example/?x=1`;
   - `http://www.customdomain.com/` eventually reaches the canonical HTTPS hostname;
   - the default production `workers.dev` URL no longer serves a second public copy;
   - preview/version URLs aren't inadvertently exposing indexable duplicates.

**Principle:** One serving hostname, one WWW redirect rule, no duplicate redirect mechanisms. **Bulk Redirects aren't needed** for this new Workers setup. Preserve unrelated DNS records such as email MX/SPF/DKIM/DMARC.

## Setup — existing Cloudflare Pages projects

Use this procedure for an existing Pages project with a public `project.pages.dev` production hostname. Do not apply the Workers-only `workers_dev = false` setting to Pages or migrate a working project solely to canonicalize its hostname.

1. In **Workers & Pages → your Pages project → Custom domains**, attach the apex production domain `customdomain.com` and confirm DNS and TLS are active.
2. Add a proxied WWW DNS record (a redirect-only A record to `192.0.2.1` is suitable), configure the zone's **Redirect from WWW to root** rule with status 301 and path/query preservation, and enable **Always Use HTTPS**, as in the Workers procedure above.
3. At the **account level**, open **Bulk Redirects**. Reuse a shared list named `pages_dev_redirects` if one already exists; otherwise create it. Add one entry per project's production Pages hostname:

   | Setting | Value |
   | --- | --- |
   | Source URL | `project.pages.dev/` |
   | Target URL | `https://customdomain.com/` |
   | Status code | 301 |
   | Preserve query string | On |
   | Subpath matching | On |
   | Preserve path suffix | On |
   | Include subdomains | Off for production-only matching |

4. Ensure an enabled account-level Bulk Redirect **rule** actually references the list. Creating the list alone does not activate redirects. Reuse the existing rule rather than adding redundant rules or duplicate entries. Preserve entries for other projects. Do not put this hostname redirect in the site's page-level `_redirects` file.
5. Review branch/deployment preview hostnames separately. The production-only entry deliberately excludes subdomains such as `preview.project.pages.dev`; it does not protect those URLs. Restrict preview access where appropriate, and verify preview indexing controls independently.
6. After configuration propagates, test the production Pages hostname at the root and at a real nested page with a query string. Also test the apex, HTTP and WWW variants. Check status codes and Location headers where possible, not just the browser's final address. Confirm the path and query survive and the canonical destination does not loop. If a redirect fails, check that the rule is enabled, references the intended list, and that the entry's matching settings are correct before creating additional rules.

**Working example:** HourlyTechs (`hourlytechs.pages.dev/` → `https://hourlytechs.com/`), with a shared `pages_dev_redirects` list. Production Pages hostname redirection was reported working on November 25, 2026. Nested path/query and preview-host behavior require separate verification.

## Cloudflare-specific redirects and 404 visibility

These implementation details belong **only** to the Cloudflare guide; host-independent decisions and user-approval rules remain in [301 Redirects](../standards/301-redirects.md) and [Links and HTTP Errors](../standards/links-http-errors.md).

### Page-level redirects on Workers Static Assets

For a Worker configured to serve Static Assets, Cloudflare supports declarative rules in a deployed `_redirects` file. Where this is the authoritative page-redirect mechanism, store the file in source control (often `public/_redirects` for frameworks that copy `public` assets into the output directory) and verify it reaches deployed assets.

```text
/old-page/ /new-page/ 301
```

Check [Workers Static Assets redirect syntax and constraints](https://developers.cloudflare.com/workers/static-assets/redirects/) for support, matching order, limits, and interaction with Worker request handlers. If a custom Worker handles requests first, do not assume that `_redirects` applies to that response. Avoid duplicate page redirects in separate Cloudflare dashboard and source-file mechanisms. An agent can write a lightweight checker for simple static `_redirects` entries, but it must **not** claim to validate Cloudflare zone-level redirect rules.

### Live 404s and bot signals

For deployed Cloudflare sites, first inspect available **HTTP traffic / security analytics** or **existing Worker request logs**, subject to the account's plan, retention, sampling, and whether asset requests are represented. Do not presume that detailed URL-level 404 logs or bot scores exist for every site. Bot classification is probabilistic: distinguish likely users, verified search crawlers, and automated probes when evidence permits; never claim certainty.

**Do not add a Worker interceptor, external logging service, database, or request processing solely for 404 tracking by default.** If existing Cloudflare tools only show aggregate status counts, say so. For a user-requested investigation, correlate the available 404 paths against prior published URLs, internal links, and search-engine reports before recommending redirects. See [Links and HTTP Errors](../standards/links-http-errors.md) for platform-neutral interpretation.

## Direct Cloudflare dashboard links for agents

**Prefer direct, clickable dashboard links over menu-by-menu directions.** At the start of an assisted setup, ask the user for **one URL copied from the Cloudflare dashboard for the relevant account and domain**, if no valid dashboard context is available. Never ask for API keys or passwords just to build links.

- Identify the account segment and domain/zone segment from the supplied URL. **Do not assume an account ID is interchangeable with a zone ID or domain name.**
- Reuse those segments to construct related zone-level links when the route is known:
  - DNS Records: `https://dash.cloudflare.com/{account}/{zone}/dns/records`
  - SSL/TLS Edge Certificates: `https://dash.cloudflare.com/{account}/{zone}/ssl-tls/edge-certificates`
  - Redirect Rules: `https://dash.cloudflare.com/{account}/{zone}/rules/redirect-rules`
- Present actionable links at the step where they are needed. When routing to Workers project or account-level settings, use the specific verified route for that account/project; do not guess using zone paths.
- **Verify routes when practical.** If a dashboard link redirects unexpectedly, fails, or its path is uncertain, give the Cloudflare navigation path instead and ask the user for that page's URL.
- Only reuse identifiers from the user's supplied link for the **same account/domain**; don't infer that they apply to other accounts or domains.
- A dashboard link provides navigation context, **not authentication or permission to change settings**. Ask for approval before changes.

## Practical export and import guidance for AI agents

**Choose the simplest reliable workflow for the situation.** Consider whether an existing Cloudflare export would materially improve understanding, and whether an upload-ready file would be more convenient than making a few dashboard changes. Neither is mandatory.

- **Reviewing existing configuration:** Ask for an export when it would help identify conflicts, unknown records, or the full scope of changes. For a straightforward setting that can be verified directly, use the dashboard instead.
- **Making changes:** Offer a correctly formatted import file when Cloudflare supports it and it meaningfully saves time or reduces errors. For one or two simple settings, direct dashboard instructions may be easier.
- **User-operated changes:** Explain the changes and provide the instructions or file for the user to review and apply. The user does **not** need to give the agent separate approval before performing the actions themselves.
- **Agent-operated changes:** When the agent will directly change live infrastructure, seek the user's authorization before consequential or potentially disruptive actions.
- **Safety checks:** Never invent existing settings or overwrite unrelated DNS records. If an import replaces an entire list or zone, explain that clearly and inspect the complete intended result before suggesting it.
- **Verification:** After changes, use a live test or an export if helpful; don't automatically demand an export when a simpler verification works.

**Scope:** This provider guide covers domain-level hostname canonicalization (`www` and HTTPS), Cloudflare's page-level redirect implementation, default Workers and Pages hostname handling, and Cloudflare-specific 404 visibility. The host-independent redirect policy is in [301 Redirects for Static Sites](../standards/301-redirects.md).


## Applying these lessons on other platforms

This playbook is also a **functional checklist**, not a universal recipe. An AI agent working with a different host should extract the desired outcomes, inspect that provider's actual features, implement equivalent controls, and verify the deployed HTTP behavior. In particular:

| Cloudflare implementation | General outcome to achieve elsewhere |
| --- | --- |
| One Worker custom domain | One canonical production hostname |
| Always Use HTTPS | Enforce HTTPS for public pages |
| Proxied `www` plus a redirect rule | Redirect alternate hostnames to the canonical host, retaining paths and queries |
| Disable public `workers.dev` or redirect production `pages.dev` | Prevent duplicate indexable deployment or preview hostnames |
| Static Assets `_redirects` | Preserve page-level URL redirects using the target host's supported mechanism |
| Inspect Cloudflare HTTP/security analytics | Use existing host/CDN access logs and available bot signals when investigating 404s |

**Do not translate Cloudflare configuration commands literally.** Another provider may not offer the same domain, DNS, redirect, preview, or logging features. State limitations instead of claiming equivalent controls exist. Consult the [core standards](../README.md) for invariant requirements; this playbook remains a reference for host-specific setup.

## Official references

- [Cloudflare Pages redirects](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/)
- [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Workers.dev routing](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)
- [Redirect Rules](https://developers.cloudflare.com/rules/url-forwarding/)
- [Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)

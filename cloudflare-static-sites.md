# Cloudflare Static Sites

**Purpose:** Publish a new static site from GitHub using Cloudflare Workers Static Assets, with **one public production address: `https://customdomain.com`**.

This is a forward-looking setup standard for new sites, regardless of static-site generator. It does not cover legacy Cloudflare Pages migrations or general SEO.

## Setup

1. **Connect GitHub.** In Cloudflare **Workers & Pages**, create a Worker connected to your GitHub repository using **Workers Builds**. Configure the site's build command and static output directory. For Astro, the typical build is `npm run build` with output in `dist/`. Use a Workers static-assets deployment configuration (for example, Wrangler `assets.directory = "./dist"`), so deployments are repeatable from GitHub.
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

**Scope:** This guide covers domain-level hostname canonicalization (`www` and HTTPS). Page-level redirects are governed separately by [301 Redirects for Static Sites](301-redirects.md) and are managed in the site's GitHub repository.

## Official references

- [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Workers.dev routing](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)
- [Redirect Rules](https://developers.cloudflare.com/rules/url-forwarding/)
- [Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)

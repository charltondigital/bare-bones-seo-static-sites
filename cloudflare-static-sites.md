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

## Export, review, and import workflow for AI agents

**Prefer inspecting an existing configuration over guessing.** When Cloudflare supports exporting relevant settings, ask the user to provide the export (for example, DNS records or redirect entries). Review it for current settings, conflicts, duplicates, and dependencies before recommending a change. Never treat a partial export as a complete account audit.

**Prefer ready-to-import files where Cloudflare actually supports import.** For example, prepare a DNS zone-file or redirect CSV only if that feature's current import format and scope are verified. Do not assume all Rules, SSL/TLS options, or Workers settings can be imported.

**Mandatory human review before application:**
1. Show the proposed additions, removals, and modifications in plain language, including which settings will stay untouched.
2. Provide the complete draft file for the user's review; flag sensitive records, destructive changes, and any uncertainty.
3. Ask for explicit approval of the proposed changes **before** importing, uploading, or applying them. Creating a reviewable draft is not authorization to deploy it.
4. Once approved, provide the import-ready file and a direct dashboard link when possible, or perform the approved operation only if an authorized tool supports it.
5. After import, request a fresh export or check the live behavior to verify the result; report any discrepancies.

**Never fabricate or overwrite unknown existing settings.** Preserve email records and other unrelated DNS configuration. If the import method replaces an entire list or zone instead of merging records, clearly warn the user and require review of the complete resulting set. If no safe import/export route exists, use minimal manual instructions instead.

**Redirect restriction remains in force:** Agents can prepare proposed redirect entries for review, but must not autonomously apply production 301 changes. Cloudflare is the designated place for production redirects, unless the user explicitly approves an exception.

## URL and redirect protection policy for AI agents

**Existing public URLs are protected.** Agents must not change, delete, or move an existing page URL (including its slug, path, or permalink structure) without **explicit user approval**. This applies during redesigns, content edits, migrations, and navigation restructuring.

If a URL change is proposed, the agent must:

1. Show the **exact old and proposed new URLs** and explain the reason for the change.
2. Explain that existing links and search visibility may be affected.
3. Obtain explicit approval **before making the URL change**.
4. Advise the user to create and verify a **301 redirect in Cloudflare** from the old URL to the new URL, preserving relevant query strings. Do not change the URL until the redirect plan is confirmed.

**Redirect ownership:** Agents may inspect existing redirects and recommend changes, but must **not autonomously create, edit, or delete production redirect rules**, whether in Cloudflare, a `_redirects` file, or application code. Production redirect changes require explicit human authorization and review.

## Official references

- [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Workers.dev routing](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)
- [Redirect Rules](https://developers.cloudflare.com/rules/url-forwarding/)
- [Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)

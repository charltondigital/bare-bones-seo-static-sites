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

# Indexation and Crawling

**Purpose:** Give SEO practitioners fast, durable control over sitemap membership and `noindex`, without reading every page during routine AI-assisted work.

## One authoritative indexation file

During [Static Site Setup](site-setup.md), create `seo/indexation.json` and connect it to the site's existing sitemap generator **and** page rendering pipeline. The file is the authoritative control for intentional sitemap inclusion and page-level `noindex` exceptions.

```json
{
  "defaults": {
    "index": true,
    "sitemap": true
  },
  "sections": {
    "/counties/*": {
      "index": true,
      "sitemap": false
    }
  },
  "pages": {
    "/research/old-study/": {
      "index": false,
      "sitemap": false
    },
    "/privacy/": {
      "index": true,
      "sitemap": false
    }
  }
}
```

- **`index: false`** emits `noindex` in the rendered HTML (or an appropriate `X-Robots-Tag` for applicable non-HTML resources). **`index: true`** means no `noindex` restriction from this system; it does *not* guarantee search-engine indexing.
- **`sitemap: false`** omits a URL from the generated XML sitemap; it does not remove the page or prevent indexing.
- An exact page entry overrides its matching section rule; section rules override defaults. For overlapping section patterns, use the most specific match and deterministic tie handling; flag ambiguous conflicts.
- Exact paths cover individual pages. `/counties/*` covers descendants, **not** the section landing page `/counties/`; add that path separately when desired.
- Normalize URL paths consistently (including trailing slashes and `index.html`) before matching. Never match unrelated prefixes accidentally.
- Only exceptions need to be recorded. Ordinary pages inherit `index: true` and `sitemap: true` unless the project's baseline requires other intentional defaults.

## Build-time integration and preservation

The agent should adapt the **existing** site generator, not reorganize the website. On each build:

1. Read `seo/indexation.json` once in shared build code (or the framework's equivalent).
2. Resolve a page's effective rules when generating its HTML robots directives.
3. Filter sitemap URLs through the same rules **before** writing XML. No manual post-processing or duplicate sitemap lists.
4. Preserve `indexation.json` and these integrations during rebuilds, refactors, and framework updates.

**One-time onboarding matters:** Inspect existing `noindex` tags, response headers, route metadata, sitemap filters, and existing exclusions before switching to centralized control. Preserve intentional settings by migrating them to `indexation.json` or clearly reporting exceptions that cannot be integrated. Do not blindly override existing privacy, staging, or indexation protections. Later agents can read the compact JSON to understand intended exceptions; they need not reread every page on every task.

## Visibility, changes, and verification

When asked, show effective rules for specific URLs or a section, distinguish configured policy from rendered behavior, and update the smallest relevant JSON entries. Do not require the SEO practitioner to know the framework's file structure.

Use small deterministic, **advisory** build checks to compare the generated sitemap and relevant rendered `noindex` directives with the configuration. Report mismatches, including `noindex` URLs still listed in the sitemap, without failing builds or blocking deployments by default. A changed exclusion file is not enough: the generated output must honor it.

## Crawling and robots.txt

Keep `robots.txt` **separate** from `indexation.json` because crawl access is not the same as indexation. Agents should locate the generated or static `robots.txt`, summarize `Allow`/`Disallow` rules by crawler and section, and make narrow requested changes while preserving unrelated directives.

**Never assume `Disallow` produces `noindex`.** A blocked crawler may not see a page's `noindex`. `robots.txt` is not access control for private content.

## Decision guidance

- **Remove from sitemap:** Set `sitemap: false`; leave `index` unchanged unless requested.
- **Keep a live page out of search results:** Set `index: false` and ordinarily `sitemap: false`; verify the page remains crawlable long enough for search engines to see `noindex`.
- **Block crawling:** Review `robots.txt` and explain possible indexation tradeoffs.
- **Delete or rename a page:** Follow [301 Redirects](301-redirects.md); discuss relevant redirects versus 404/410 before changing published URLs.
- **Determine what Google actually indexed:** Use Search Console data. Site settings only describe intended behavior.

**Agent behavior:** Favor inspection, clear reporting, and rapid execution. Explain material sitewide indexation changes before applying; don't require repetitive approval for actions already authorized. Don't introduce a second SEO-control system or block routine deployments.

**Principle:** One small file controls sitemap and `noindex` exceptions; `robots.txt` remains separate. AI handles the implementation, SEO practitioners control the policy.

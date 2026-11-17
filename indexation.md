# Indexation and Sitemaps

**Purpose:** Give SEO practitioners durable visibility and control over sitemap inclusion without reorganizing a static website or slowing routine AI-assisted development.

## Sitemap exclusions

The site setup agent creates `seo/sitemap-exclusions.json` and integrates it with the **existing** sitemap generator. The generator must read the file and apply the exclusion rules before outputting sitemap URLs on every build. Don't replace a working generator merely to support exclusions.

Example:

```json
{
  "exclude": [
    "/counties/",
    "/counties/*",
    "/research/old-study/"
  ]
}
```

- Exact entries, such as `/research/old-study/`, exclude **one page**.
- A trailing `/*`, such as `/counties/*`, excludes descendants in that section; it must not unexpectedly match unrelated prefixes such as `/counties-old/`.
- Include the section's landing page separately (for example `/counties/`) if that page should also be excluded.
- Normalize trailing slashes and `index.html` consistently before matching. Avoid loose substring or ambiguous glob matching.
- Keep existing rules unless the user explicitly requests a change. Agents must read this file **before modifying, regenerating, or replacing sitemap-generation logic** and ensure the new generator still honors it.
- On a requested change, update the exclusion list and verify the **generated sitemap** reflects the rule. The list is a control input, not a separate manually maintained sitemap.

## Visibility and changes

An AI agent should locate the site's current sitemap(s), inspect how they are generated, and explain their contents in ordinary SEO terms. It should be able to show included and excluded URLs, add or remove individual exclusions, and apply section-wide exclusions without asking the user to know where the site stores its routes. Choose the smallest change using the site's existing architecture.

Use a fast advisory check to report if an excluded URL appears in sitemap output; do not block routine deployments by default. An exclusions file alone is not effective unless the generator is wired to consume it.

## Distinguish sitemap inclusion from Google indexation

**Sitemap omission is not `noindex`.** A page excluded from the XML sitemap can still be discovered and indexed.

- To keep a live page out of search results, use an appropriate page-level `noindex` directive, verified in rendered HTML or response headers.
- To restrict crawling, use `robots.txt` deliberately; do not block crawling of a page when search engines need to see its `noindex`.
- For a deleted page, decide whether a relevant 301 or a 404/410 is appropriate under [301 Redirects](301-redirects.md).
- Search Console data is needed to establish what Google has actually indexed. Site directives alone show intended behavior, not Google's live indexing status.

**Principle:** Preserve explicit SEO decisions through rebuilds, expose them clearly, and let agents handle implementation without adding unnecessary bureaucracy.

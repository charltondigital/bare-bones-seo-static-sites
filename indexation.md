# Indexation and Crawling

**Purpose:** Give SEO practitioners durable visibility and control over sitemap inclusion, indexing directives, and crawler access without reorganizing a static website or slowing routine AI-assisted development.

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

## Page and section indexation

When asked what can be indexed, inspect the existing built HTML and HTTP headers for robots directives (including `noindex`), not merely the source templates. Locate how page-level and section-level defaults or overrides are currently implemented; change the smallest relevant setting in that system rather than adding competing configuration files. Support individual pages and site sections.

An agent should be able to show which pages are indexable, which are marked `noindex`, and where those rules originate. Verify requested changes in the generated HTML or headers. Indexability is not a guarantee that Google has indexed the page.

## Crawling and robots.txt

Find and inspect the site's actual `robots.txt` and any framework or deployment rules generating it. Explain `Allow`, `Disallow`, user-agent-specific directives, and declared sitemap locations in plain language. For requested crawling changes, preserve unrelated rules, make the narrowest change, and inspect the generated `robots.txt`.

**Never use `Disallow` as a substitute for `noindex`.** A blocked crawler may be unable to read a page's `noindex` directive. Also, `robots.txt` is not access control or a way to protect private content.

## Agent workflow and safeguards

1. **Discover:** Locate sitemap generation, sitemap exclusions, `robots.txt`, and rendered robots directives within the site's existing architecture.
2. **Explain:** Show the requested page or section's sitemap, crawl, and indexation status. Distinguish site intent from actual Google indexing.
3. **Change:** Apply only the requested controls. Keep the sitemap exclusions file authoritative for sitemap membership; don't introduce a second indexation configuration unless genuinely necessary.
4. **Verify:** Inspect the generated output for affected URLs and summarize the results. Warn about mismatches such as `noindex` pages blocked from crawling, without blocking routine deployments by default.

Use judgment about clarification: ordinary page-level changes should be fast; for broad sitewide crawling or `noindex` changes, explain their impact before applying. Do not demand repetitive approvals for an already-authorized set of changes.

## Distinguish sitemap inclusion from Google indexation

**Sitemap omission is not `noindex`.** A page excluded from the XML sitemap can still be discovered and indexed.

- To keep a live page out of search results, use an appropriate page-level `noindex` directive, verified in rendered HTML or response headers.
- To restrict crawling, use `robots.txt` deliberately; do not block crawling of a page when search engines need to see its `noindex`.
- For a deleted page, decide whether a relevant 301 or a 404/410 is appropriate under [301 Redirects](301-redirects.md).
- Search Console data is needed to establish what Google has actually indexed. Site directives alone show intended behavior, not Google's live indexing status.

**Principle:** Preserve explicit SEO decisions through rebuilds, expose them clearly, and let agents handle implementation without adding unnecessary bureaucracy.

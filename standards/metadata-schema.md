# Metadata and Schema for Static Sites

**Purpose:** Make SEO metadata predictable, visible, and controllable without duplicating values or turning Bare Bones SEO into an optimization service.

**Governing principle: Bare Bones enforces the integrity of SEO controls, not the optimization of SEO content.** It is opinionated about where settings live and whether they work, but agnostic about keywords, wording, lengths, priorities, and which pages an SEO chooses to optimize.

## One owner for each value

| Value | Authoritative source | Build behavior |
| --- | --- | --- |
| H1 | Page content | Keep in the page; never manage in SEO settings |
| HTML `<title>` | SEO settings for an explicit override; otherwise the rendered page's H1 | Output exactly one title |
| Meta description | SEO settings, optional | Emit only if intentionally provided; no mandatory placeholder |
| Canonical URL | Generated from the production site URL and canonical page path | Output one canonical; no duplicate hand-maintained page canonical |
| JSON-LD schema | Shared templates drawing on the site's actual content/data; explicit schema-specific controls only when needed | Avoid copying page facts into a second manual data store |
| `noindex` and sitemap inclusion | [`seo/search-exclusions.json`](indexation.md) | Never maintain these in the metadata file or individual pages |

SEO title, description, canonical overrides if ever supported, and schema-specific controls must **not** also be independently authored in page files or frontmatter. Page content may supply the H1 and factual content used to generate metadata or schema; that is not a second SEO settings field.

## Minimal metadata settings

Use `seo/metadata.json` as the sole place for **intentional SEO metadata overrides**. Keep it sparse: do not create an entry for every page.

```json
{
  "pages": {
    "/resources/arizona-dui-penalties/": {
      "title": "Arizona DUI Penalties, Fines & License Consequences",
      "description": "Understand the penalties and consequences of an Arizona DUI conviction."
    }
  }
}
```

For pages without a title override, the final HTML `<title>` defaults to the page's H1. If no usable H1 exists, report that plainly and apply an existing safe site-title fallback if available; do not demand that the SEO write a title for every page.

Missing meta descriptions are **not an error**. Do not fabricate them automatically, score their length, or urge the user to write them sitewide. Do not enforce arbitrary title or description length thresholds.

## Schema without duplication

Generate appropriate schema through existing shared templates, using source page facts (for example, article heading, author, publication date, breadcrumbs). Avoid mirroring these facts into `metadata.json`.

If a schema property genuinely requires a separate SEO-specific setting, define one clear owner for that property and have the build consume it. Do not create a competing JSON-LD block or duplicate schema entities. Do not mandate any particular schema type as an SEO strategy.

## One-time integration by an AI agent

1. Inspect existing layouts, frontmatter, SEO components, schema generation, and built HTML **once** to find duplicate or conflicting sources.
2. Move existing intentional SEO title/description overrides to `seo/metadata.json` and remove the competing authoring fields. Preserve the user's wording; do not silently rewrite it.
3. Connect the site's existing layout/build to the chosen owners. Ensure title, description, canonical, and structured-data output have one clear generator each; do not reorganize site content unnecessarily.
4. Produce a lightweight **read-only SEO inventory** from build output (URL, H1, final title, description if present, canonical, schema types, `noindex`, sitemap membership). The inventory is generated, not a second manually maintained source of truth.
5. Use fast, deterministic **advisory** checks for genuine technical conflicts (for example, duplicate title tags, conflicting canonicals, malformed JSON-LD, or rendered output inconsistent with explicit settings). Do not fail builds or block deployments by default.

Routine AI work should consult the small settings files, not reread every page. Full-output inspection belongs to setup, relevant changes, or requested audits. Keep reporting short and actionable.

## Agent behavior

- Implement the SEO practitioner's requested settings faithfully, without unsolicited optimization prescriptions.
- Suggest content or SEO changes only when explicitly asked for advice; do not attribute strategic suggestions to Bare Bones requirements.
- Do not ask the user to write missing descriptions or deduplicate tags by hand. The agent should implement the architecture and handle technical migration.
- Avoid repetitive approval requests for routine implementation. Preserve existing intentional settings; explain consequential changes rather than silently rewriting them.
- Separate technical validity and single-source consistency from SEO opinion. A nonstandard-but-valid title is not an error.

**Related:** [Static Site Setup](site-setup.md), [Indexation and Search Exclusions](indexation.md), [301 Redirects](301-redirects.md).

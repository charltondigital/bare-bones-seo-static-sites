# 301 Redirects for Static Sites

**Purpose:** Maintain permanent page redirects in a single GitHub-managed registry without allowing AI agents to casually break established URLs.

**Scope:** Page-level redirects for static sites on Cloudflare Workers Static Assets. Domain-level HTTPS and `www` redirects belong to [Cloudflare Static Sites](cloudflare-static-sites.md).

## Implementation

Use **one** tracked `_redirects` file, copied by the site build to the deployed static-assets directory (often `public/_redirects`). For ordinary static assets, Cloudflare Workers supports this declarative format without custom request-handling code.

```text
/old-page/ /new-page/ 301
/old-services/ /services/ 301
```

Check the current platform's supported syntax, limits, matching order, and whether the Worker serves requests through static assets; custom Worker responses may bypass `_redirects`. Do not duplicate page redirects in the Cloudflare dashboard, Astro routing, and multiple redirect files.

## Rules for AI agents

- **Existing public URLs are protected.** Never change, remove, or rename an established public URL or permalink path without user approval, including indirect changes during content collection or routing refactors.
- **Show the change, not bureaucracy.** For a proposed rename, explain the reason and show the exact old URL, new URL, and proposed 301. Obtain approval for the consequential URL change. Once approved, the agent can prepare and apply the corresponding redirect within the approved scope without asking repeatedly.
- **Page deletion or consolidation triggers a URL disposition discussion.** Before removing any published page, the agent must proactively present its existing URL and recommend either a relevant 301 destination or an intentional 404/410 when no suitable replacement exists. Explain the choices and obtain approval before changing the live URL behavior. For multiple pages, show a single concise table of old URLs and recommendations, and request one combined decision. Never default every deleted URL to the homepage. If the user has already explicitly approved the destination and deletion, do not request duplicate approval.
- **Existing 301s are durable.** Read the complete registry before editing. Preserve historical redirects; do not remove or change them just because their source pages disappeared. Ask for approval before modifying or removing an existing mapping.
- **New redirects stay in one place.** Update `_redirects` and avoid redirect chains, loops, duplicates, invalid destinations, or speculative cleanups.
- **Routine page edits:** No extra approvals when URLs and redirects remain unchanged.
- **Minimal human work:** Prepare reviewable diffs or pull requests when review is appropriate, rather than requesting the user manually edit redirect files.

## Validation and change reporting

Use the lightweight one-time automation in [Static Site Setup](site-setup.md) to detect unapproved URL changes and differences in `_redirects`. Reuse existing GitHub builds; don't require the user to set up a separate action.

## Performance and boundaries

Static-asset `_redirects` rules do not require a custom Worker script on every normal page request. Keep rules simple and observe Cloudflare's documented behavior and limits. Check the deployed response for affected redirects when deploying changes.

**Principle:** Keep old URLs stable, maintain a single auditable redirect file, and only change established URLs with informed user approval.

## Official reference

- [Cloudflare Workers Static Assets redirects](https://developers.cloudflare.com/workers/static-assets/redirects/)

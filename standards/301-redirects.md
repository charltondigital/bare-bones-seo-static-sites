# 301 Redirects for Static Sites

**Purpose:** Preserve published page URLs and maintain one auditable source for page-level redirects on **any static host**.

## Host-independent policy

- **Established URLs are protected.** Do not remove, rename, or repurpose public URLs without user approval, including indirect changes in refactors or content generation.
- **Show consequential URL changes clearly.** For a proposed rename, identify the old URL, new URL, and proposed 301. One approval can cover a batch; do not demand repeated approvals after authorization.
- **Deletions require a disposition.** For each removed published page, propose a relevant 301 destination or explain why an intentional 404/410 is appropriate. Never redirect all removed pages to the homepage by default.
- **Keep historical redirects.** Never silently delete or change previously approved mappings, even when their source pages have been gone for years. Ask before changing them.
- **One authoritative redirect registry.** Prefer a redirect configuration stored in the site's source-controlled configuration and consumed by its deployment process. Use the deployment host's **actual supported format and features**; do not introduce a second competing registry.
- **Routine page edits** require no extra approvals when URLs and redirects remain unchanged.

## Implementation on the selected host

An AI agent must discover the host, framework, and existing redirect mechanism **before choosing a file format**. Some platforms consume a deployed `_redirects` file; others require a platform configuration file, deployment rules, server configuration, or application routing. A `_redirects` file has **no universal semantics** on static hosts and must not be installed as if it did.

Where the host supports a declarative `_redirects` registry, use it as the single source if appropriate:

```text
/old-page/ /new-page/ 301
/old-services/ /services/ 301
```

For other hosts, configure equivalent page-level redirects through their supported mechanism, keeping the authoritative source in version-controlled configuration where possible. Verify actual live HTTP redirect status and destination after deployment. If the host requires dashboard-only settings, report that limitation rather than writing an ineffective file.

**Domain-level hostname, HTTPS, and `www` redirects are infrastructure settings.** Configure them using the selected host's documented capabilities, separate from page-level URL changes. For provider-specific setup, see the optional [Cloudflare guide](../playbooks/cloudflare.md).

## Validation and change reporting

Use [Static Site Setup](site-setup.md) to detect changed or removed published URLs. Add a lightweight checker suitable for the chosen registry. A checker for simple `_redirects` entries cannot be assumed to validate wildcards, conditions, other host formats, or hostname-level redirects; report any unsupported coverage.

Warn about duplicate mappings, redirect chains, loops, and likely missing targets where observable. Incomplete coverage must be disclosed rather than portrayed as a clean audit. Validate domain-level or infrastructure redirects with targeted HTTP checks when relevant. Do not automatically rewrite previously approved redirects.

Reports are **advisory and non-blocking** by default. Reuse existing build workflows; do not add mandatory pull requests, protected branch checks, or approval gates unless the user requests them.

**Principle:** Protect established URLs, keep redirect ownership unambiguous, and adapt implementation to the host without changing SEO policy.

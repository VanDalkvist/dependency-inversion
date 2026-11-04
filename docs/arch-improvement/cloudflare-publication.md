# Cloudflare publication — 2026-11-04

- User-requested hostname: https://ioc.vanya-arc.dev/
- Main website link: https://vanya-arc.dev/, visible in desktop and mobile header.
- Worker: `ioc`, assets-only, custom domain, workers.dev disabled.
- Deployment version: `7fc60ae1-fd16-45de-a647-af9efaeb2aab`.
- Source implementation: `03f5053`.
- Config: cloudflare.config.ts; official Cloudflare Vite plugin and cf CLI 1.0.0-beta.27 (pinned).
- Production output: .cloudflare/output/v0/workers/default/assets; excluded from git.
- Existing fireplace Worker and root domain were not changed.
- Existing OAuth reused in child-process environment only; no credentials written to project or logs.

## Verification

28 tests pass, production build passes, current npm audit reports zero vulnerabilities.
HTTPS returns 200. Live entry asset paths and SHA-256 bytes match the verified production build. Cloudflare injects its zone-level JavaScript detection script into HTML, so full HTML byte equality is intentionally not claimed.
Chrome loaded the public app; the header link resolves to https://vanya-arc.dev/. A mobile viewport confirmed that it stays visible without page overflow; clicking it navigated to the main website.

Author verification only; no independent agent review. Local developer logs and browser evidence are in /tmp/di-cloudflare-evidence for this session.

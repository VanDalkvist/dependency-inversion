# Cloudflare publication — 2026-11-04

- User-requested hostname: https://ioc.vanya-arc.dev/
- Main website link: https://vanya-arc.dev/, visible in desktop and mobile header.
- Worker: `ioc`, assets-only, custom domain, workers.dev disabled.
- Deployment version: `5bfe9c85-964e-4625-ba68-9b1626d56d12`.
- Source implementation: `e64cfe4` (explicit lesson, chapter, scene and sandbox headings).
- Config: cloudflare.config.ts; official Cloudflare Vite plugin and cf CLI 1.0.0-beta.27 (pinned).
- Production output: .cloudflare/output/v0/workers/default/assets; excluded from git.
- Existing fireplace Worker and root domain were not changed.
- Existing OAuth reused in child-process environment only; no credentials written to project or logs.

## Verification

31 tests pass and the production build passes. Dependencies are unchanged from the previous zero-vulnerability audit.
HTTPS returns 200. Live entry asset paths and SHA-256 bytes match the verified production build. Cloudflare injects its zone-level JavaScript detection script into HTML, so full HTML byte equality is intentionally not claimed.
Chrome loaded the public app; the header link resolves to https://vanya-arc.dev/. A mobile viewport confirmed that it stays visible without page overflow; clicking it navigated to the main website.

The heading revision was also read back from the public site at 390px: main title «Инверсия зависимостей», scene 8 «DIP меняет зависимости кода, а не порядок вызовов», no page or heading overflow. Live JS/CSS bytes match the verified local production build.

Author verification only; no independent agent review. Publication evidence: /tmp/di-cloudflare-evidence. Heading revision evidence: /tmp/di-headings-evidence.

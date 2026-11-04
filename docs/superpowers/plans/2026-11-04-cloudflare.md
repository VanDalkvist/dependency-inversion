# Cloudflare publication — bounded slice

User approved public deployment to ioc.vanya-arc.dev and a header link to vanya-arc.dev.

- [ ] RED: app header contains external main-site link in desktop/mobile markup.
- [ ] Add persistent header link without changing the generic lesson contract; full suite and production build.
- [ ] Configure a new assets-only Cloudflare Worker for the requested hostname, following current official cf CLI/config documentation.
- [ ] Inspect existing zone/domain records before publication; do not overwrite another service.
- [ ] Deploy only production build assets, never workspace files or environment values.
- [ ] Verify HTTPS HTML, asset responses, and rendered header link in a real browser.
- [ ] Commit/push source, deploy configuration and registry submodule pointer. Record deployed revision.

Existing Workers deployment fireplace-deploy remains untouched. No paid plan or infrastructure purchase authorized. Existing OAuth is reused in process only; no credential is persisted or copied into the repo. Project player core and pipeline do not change; UI shell and deployment boundary only.

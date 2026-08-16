# via-widget-framework

Notes and a minimal working example for building and deploying **Yahoo
Konfabulator widgets** on end-of-life **Vizio VIA** (Vizio Internet Apps) smart
TVs — the MediaTek MT5369 / Linux 2.6.35 generation.

This is **platform reverse-engineering documentation**, not a media or streaming
app. It exists to preserve knowledge of a dead widget ecosystem: how the package
format is laid out, how the engine loads code, and how to get a hello-world
widget running on your own hardware. It ships **no stream sources, no content
catalogs, and no service-specific code** — a widget built from this can display
whatever *you* supply.

## Context

The VIA platform used Yahoo's Konfabulator engine (a.k.a. Yahoo Connected TV) to
run third-party "widgets" written in JavaScript. Yahoo discontinued the widget
gallery years ago, and the TVs are end-of-life, so there is no official SDK,
documentation, or distribution channel left. This repo captures the mechanics
recovered by reverse-engineering the engine on a device the author owns.

For the security analysis of the same platform — including *why* the deployment
mechanism below works the way it does — see the companion repository
**vizio-re**.

## Contents

| Path | What |
|------|------|
| [docs/widget-package-format.md](docs/widget-package-format.md) | Anatomy of a `.widget` package and the engine's directory layout |
| [docs/engine-apis.md](docs/engine-apis.md) | The JavaScript APIs the engine exposes (KONtx framework, native bridge) |
| [docs/deploying.md](docs/deploying.md) | How the engine discovers and loads widget code; how to iterate during development |
| [example-widget/](example-widget/) | A minimal, self-contained hello-world widget |

## Scope

- For **hardware you own**, for research and preservation.
- Nothing here fetches, bundles, or points at any streaming service or copyrighted
  catalog. Supplying content is the user's responsibility and outside this repo.

## License

MIT (see [LICENSE](LICENSE)) for code; docs under CC BY 4.0.

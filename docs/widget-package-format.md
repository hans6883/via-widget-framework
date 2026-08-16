# Widget package format and engine layout

A VIA widget is a Konfabulator "gadget": a directory (packaged as a `.widget`
archive for distribution) containing a manifest plus the JavaScript, markup, and
image resources the engine renders.

## Directory anatomy

A typical installed widget looks like:

```
<widget-id>/
  Contents/
    manifest.json        # widget metadata the engine reads first
    Main.js              # entry point referenced by the manifest
    Javascript/          # additional JS modules
    Images/              # PNG/JPEG assets
    Markup/              # KML/XML view definitions (engine-specific)
```

The engine reads the manifest, resolves the entry script, and evaluates it in a
shared JavaScript context. On this platform there is no per-widget isolation —
see the security notes in the companion `vizio-re` repo — so a widget is best
understood as "a script the TV runs," not "a sandboxed app."

## The engine's framework tree

The Konfabulator runtime ships a framework the widgets build on, laid out under
the engine's read-only application directory (conceptually):

```
yahoo_widget/
  Konfabulator                 # engine entry binary
  Framework/                   # KONtx JS framework (loader, message bus, views)
  Platform/                    # platform glue
  TV/Widgets/Installed/<id>/   # installed widgets
  data/                        # writable runtime state (profiles, caches)
```

Widgets interact with the framework's global objects (commonly under a `KONtx`
namespace) for views, navigation, timers, storage, and the native bridge.

## Development vs. installed form

- **Distribution form:** a `.widget` archive (zip) with the `Contents/` tree
  inside, signed for the engine's installer path.
- **Installed form:** the same tree unpacked under the engine's
  `TV/Widgets/Installed/<id>/` directory.

During development on your own device it is far more convenient to work with the
unpacked, installed form and reload, rather than repackaging and re-signing on
every change — see [deploying.md](deploying.md).

## What a manifest carries

The manifest names the widget, its entry script, its display metadata, and the
platform API categories it wants. A minimal manifest:

```json
{
  "id": "com.example.mywidget",
  "name": "My Widget",
  "version": "1.0.0",
  "description": "Short description shown in the widget gallery",
  "entry": "Main.js",
  "resolution": "960x540"
}
```

| Field | Required | Purpose |
|-------|----------|---------|
| `id` | Yes | Reverse-DNS identifier; used as the directory name under `Installed/` |
| `name` | Yes | Human-readable name |
| `version` | Yes | Semver string |
| `description` | No | Shown in the TV's widget gallery (when it existed) |
| `entry` | Yes | Filename of the JS entry point, relative to `Contents/` |
| `resolution` | No | Widget viewport; `960x540` is the standard for this platform |

On this engine, API-category access is governed by the engine configuration
rather than by the manifest alone; the security implications of that (notably
wildcard access to the TV-control categories via the `tvapi.*` namespace) are
documented in `vizio-re`, not here.

## The `.widget` archive format

For distribution, the `Contents/` directory is packaged as a zip file renamed
to `.widget`:

```
my-widget.widget          # actually a zip file
  └── Contents/
        ├── manifest.json
        ├── Main.js
        ├── Javascript/
        └── Images/
```

The engine's installer path expects a signed archive, but on this EOL platform
the signing requirements in the base configuration are effectively empty (the
`AllowLogin` check accepts any signer — see `vizio-re` findings #8). During
development, working with the unpacked installed form is simpler; see
[deploying.md](deploying.md).

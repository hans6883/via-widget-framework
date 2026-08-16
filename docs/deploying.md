# Deploying a widget during development

This describes how to iterate on a widget on **your own** VIA TV. It assumes you
already have shell access to the device (how that is obtained on this EOL
platform is a security topic covered in the companion `vizio-re` repo, not here).

## The two loading paths

1. **Installed widgets** live under the engine's
   `TV/Widgets/Installed/<id>/Contents/` tree and are loaded when the engine
   starts. Dropping an unpacked widget here and restarting the engine is the
   simplest way to run your own code.

2. **Script overlay.** The engine can be configured to check a writable overlay
   directory *before* its read-only framework scripts, letting an overlay file
   shadow a framework/platform script. This is powerful for development (you can
   patch framework behavior without repackaging) and is exactly why the platform
   is interesting from a security standpoint — a writable, unsigned path that the
   root engine loads at boot. Use it deliberately and keep notes on what you
   shadow so you can revert.

## Iterating

Because repackaging and re-signing a `.widget` on every edit is slow, the
practical loop on your own hardware is:

1. Keep the widget in unpacked `Contents/` form on the device.
2. Edit the JS/markup in place.
3. Restart the widget engine (or reboot) to reload.
4. Watch the engine's log output for script errors.

## Caching gotcha

The engine keeps a **compiled-bytecode cache** of widget/framework scripts
(files alongside the sources, e.g. `*.js.1.o`). A stale cache entry can win over
an edited source file, so if a change doesn't take effect, clear the corresponding
compiled artifacts before restarting the engine. (This cache is a compilation
cache, not a security sandbox — a common misreading covered in `vizio-re`.)

## Clean-up

Anything you place on the device's writable app partition **survives a factory
reset** on this platform. When you're done experimenting, remove widgets and any
overlay files you added rather than assuming a reset will clear them.

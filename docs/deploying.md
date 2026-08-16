# Deploying a widget during development

This describes how to iterate on a widget on **your own** VIA TV. It assumes you
already have shell access to the device (how that is obtained on this EOL
platform is a security topic covered in the companion `vizio-re` repo, not here).

## Device filesystem layout

The widget engine lives on the `/3rd` (read-only) and `/3rd_rw` (writable)
partitions. The key paths:

```
/3rd/yahoo_widget/                     # engine root (read-only)
  Konfabulator                         # engine binary
  Framework/                           # KONtx JS framework
  Platform/                            # platform glue scripts
  TV/Widgets/Installed/<id>/Contents/  # factory-installed widgets

/3rd_rw/yahoo_widget/                  # writable overlay (survives reset)
  TV/Widgets/Installed/<id>/Contents/  # user-installed widgets go here
  data/                                # runtime state, caches, profiles
```

## The two loading paths

1. **Installed widgets** live under the engine's
   `TV/Widgets/Installed/<id>/Contents/` tree. On the writable partition, the
   full path is:

   ```
   /3rd_rw/yahoo_widget/TV/Widgets/Installed/<your-widget-id>/Contents/
   ```

   Dropping an unpacked widget here and restarting the engine is the simplest
   way to run your own code.

2. **Script overlay.** The engine checks a writable overlay directory *before*
   its read-only framework scripts, letting an overlay file shadow a
   framework/platform script. The overlay tree mirrors the read-only tree
   structure under `/3rd_rw/yahoo_widget/`. This is powerful for development
   (you can patch framework behavior without repackaging) and is exactly why the
   platform is interesting from a security standpoint — a writable, unsigned
   path that the root engine loads at boot. Use it deliberately and keep notes
   on what you shadow so you can revert.

## Getting files onto the device

With shell access, the simplest method is USB:

1. Place your widget directory on a FAT32-formatted USB stick.
2. Insert it into the TV — it auto-mounts at `/tmp/mnt/usb/sda1`.
3. Copy the widget into the engine's installed-widget directory:

   ```sh
   cp -r /tmp/mnt/usb/sda1/my-widget \
     /3rd_rw/yahoo_widget/TV/Widgets/Installed/com.example.mywidget
   ```

4. Restart the widget engine or reboot the TV.

For iterating without pulling the USB every cycle, you can edit files directly
on `/3rd_rw` if you have a shell session.

## Iterating

Because repackaging and re-signing a `.widget` on every edit is slow, the
practical loop on your own hardware is:

1. Keep the widget in unpacked `Contents/` form on the device at
   `/3rd_rw/yahoo_widget/TV/Widgets/Installed/<id>/Contents/`.
2. Edit the JS/markup in place via your shell session.
3. Restart the widget engine (or reboot) to reload.
4. Watch the engine's log output for script errors.

## Caching gotcha

The engine keeps a **compiled-bytecode cache** of widget/framework scripts
(files alongside the sources, e.g. `*.js.1.o`). A stale cache entry can win over
an edited source file, so if a change doesn't take effect, clear the corresponding
compiled artifacts before restarting the engine:

```sh
find /3rd_rw/yahoo_widget/ -name "*.js.1.o" -exec rm {} \;
```

(This cache is a compilation cache, not a security sandbox — a common misreading
covered in `vizio-re`.)

## Clean-up

Anything you place on the device's writable app partition **survives a factory
reset** on this platform. When you're done experimenting, remove widgets and any
overlay files you added rather than assuming a reset will clear them.

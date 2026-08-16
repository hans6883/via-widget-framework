# Engine JavaScript APIs

The Konfabulator runtime exposes a set of global objects to widget JavaScript.
This is a practical, reverse-engineered summary — enough to write a working
widget — not an exhaustive reference (no official documentation survives).

## Framework layer (KONtx)

Widgets are built on the framework the engine ships (commonly namespaced
`KONtx`). The pieces you actually use:

- **Views / controllers** — objects that describe on-screen elements (text,
  images, lists) and respond to focus and remote-control key events.
- **Message bus** — a publish/subscribe mechanism the framework uses to route
  lifecycle and input events between components.
- **Timers** — scheduled callbacks (the platform relies on native function
  timers; animation and polling are driven this way).
- **Storage** — key/value persistence for widget state under the engine's
  writable `data/` tree.

## Platform / system objects

Beyond drawing, the engine exposes host capabilities. The ones most relevant to
any non-trivial widget:

- **HTTP client** — an `XMLHTTPRequest`-style object for network fetches. Use it
  to load *your own* data; this repo supplies none.
- **Filesystem** — read/write access to files (open, read, write, copy, move,
  remove, directory listing, zip/unzip, md5).
- **Native command bridge** — the engine can execute host shell commands from
  JavaScript. On this platform that runs with full privilege and no sandbox;
  treat it as powerful and dangerous, and see `vizio-re` for the security
  analysis. A well-behaved widget does not need it.

## Remote-control input

Widgets receive key events for the TV remote (directional pad, OK/back, color
keys, playback keys). The framework delivers these through its event/message
mechanism; a widget registers handlers on its focused view and updates its views
in response.

## A realistic widget shape

Most widgets follow the same skeleton:

1. On load, construct the root view(s) and register key handlers.
2. Optionally fetch data over HTTP from a source the user configured.
3. Render that data into list/text/image views.
4. Respond to remote-control navigation by moving focus and updating views.
5. Persist any state (last position, user settings) via storage.

The [example widget](../example-widget/) implements the smallest useful version
of this: it draws text, responds to a key press, and does nothing network- or
content-specific.

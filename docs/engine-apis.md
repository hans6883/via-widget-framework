# Engine JavaScript APIs

The Konfabulator runtime exposes a set of global objects to widget JavaScript.
This is a practical, reverse-engineered summary — enough to write a working
widget — not an exhaustive reference (no official documentation survives).

## Framework layer (KONtx)

Widgets are built on the framework the engine ships (commonly namespaced
`KONtx`). The pieces you actually use:

### Views / controllers

Objects that describe on-screen elements (text, images, lists) and respond to
focus and remote-control key events. The screen resolution for widgets is
960×540.

```js
var view = new KONtx.controller.View({
  x: 0, y: 0, width: 960, height: 540
});

var label = new KONtx.element.Text({
  x: 20, y: 100, width: 920, height: 40,
  halign: "center", size: 28, color: "#FFFFFF",
  text: "Hello from a custom widget"
});

view.appendChild(label);
```

### Message bus

A publish/subscribe mechanism the framework uses to route lifecycle and input
events between components.

```js
KONtx.messenger.subscribe("keydown", function (event) {
  if (event.key === "enter") { /* OK button pressed */ }
});
```

### Timers

Scheduled callbacks for animation and polling. The engine uses native function
timers:

```js
var interval = setInterval(function () {
  // poll for updated data, refresh UI
}, 30000);
```

### Storage

Key/value persistence for widget state, stored under the engine's writable
`data/` tree:

```js
KONtx.storage.set("lastChannel", channelId);
var saved = KONtx.storage.get("lastChannel");
```

## Platform / system objects

Beyond drawing, the engine exposes host capabilities. The ones most relevant to
any non-trivial widget:

### HTTP client

An `XMLHTTPRequest`-style object for network fetches. Use it to load *your own*
data; this repo supplies none.

```js
var req = new XMLHttpRequest();
req.open("GET", "http://example.com/data.json", true);
req.onreadystatechange = function () {
  if (req.readyState === 4 && req.status === 200) {
    var data = JSON.parse(req.responseText);
    // update views with data
  }
};
req.send();
```

Note: the platform only supports TLS 1.0 with an outdated CA bundle, so HTTPS
to modern endpoints will fail. See `vizio-re` docs/02 for the full TLS profile.

### Filesystem

Read/write access to files on the device. The API surface includes open, read,
write, copy, move, remove, directory listing, zip/unzip, and md5:

```js
var fs = KONtx.system.FileSystem;

// Read a file
var content = fs.readFile("/3rd_rw/some_config.txt");

// Write a file
fs.writeFile("/3rd_rw/widget_data/state.json", JSON.stringify(state));

// List a directory
var entries = fs.listDirectory("/3rd_rw/yahoo_widget/TV/Widgets/Installed/");
```

Writable paths are on `/3rd_rw`; the root filesystem is dm-verity protected
and read-only. Files written to `/3rd_rw` survive factory reset.

### Native command bridge

The engine can execute host shell commands from JavaScript via `RunCommand`.
On this platform that runs with full privilege (root) and no sandbox; treat it
as powerful and dangerous, and see `vizio-re` for the security analysis. A
well-behaved widget does not need it.

```js
// NOT recommended for production widgets — shown for completeness
var result = KONtx.system.RunCommand("uname -a");
```

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

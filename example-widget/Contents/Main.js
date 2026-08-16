/*
 * Hello VIA — minimal Konfabulator widget for Vizio VIA (MediaTek MT5369) TVs.
 *
 * Draws a line of text and toggles it when the OK/Enter remote key is pressed.
 * Deliberately does nothing network- or content-specific: it exists to show the
 * smallest working widget shape on this engine. Framework object names
 * (KONtx.*) are reverse-engineered from the engine; adjust to match the exact
 * framework build on your device.
 *
 * This is illustrative reference code, not a drop-in binary. See ../../docs/.
 */

/* global KONtx */

var HelloWidget = (function () {
  "use strict";

  var rootView = null;
  var label = null;
  var toggled = false;

  function build() {
    // A container view filling the 960x540 screen.
    rootView = new KONtx.controller.View({
      x: 0, y: 0, width: 960, height: 540
    });

    // A centered text element.
    label = new KONtx.element.Text({
      x: 0, y: 240, width: 960, height: 60,
      halign: "center", valign: "middle",
      size: 32, color: "#FFFFFF",
      text: "Hello, VIA. Press OK."
    });

    rootView.appendChild(label);
    return rootView;
  }

  // Remote-control key handler. Key identifiers vary by framework build;
  // "enter"/"select" is the OK button on most VIA remotes.
  function onKey(event) {
    if (event && (event.key === "enter" || event.key === "select")) {
      toggled = !toggled;
      label.text = toggled ? "You pressed OK." : "Hello, VIA. Press OK.";
      return true; // handled
    }
    return false; // let the framework handle other keys
  }

  function start() {
    var view = build();

    // Subscribe to the framework key event. The exact subscription API depends
    // on the framework build; both a direct handler and a message-bus
    // subscription are shown for reference.
    if (view.addEventListener) {
      view.addEventListener("keydown", onKey);
    } else if (KONtx.messenger && KONtx.messenger.subscribe) {
      KONtx.messenger.subscribe("keydown", onKey);
    }

    return view;
  }

  return { start: start };
}());

// Engines that expect a widget entry object/function can call HelloWidget.start().
if (typeof KONtx !== "undefined" && KONtx.registerWidget) {
  KONtx.registerWidget(HelloWidget);
}

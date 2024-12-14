---
title: "SysEx and the Web MIDI API"
date: 2024-12-14T03:25:23Z
description: How to send MIDI system exclusive messages from the Web MIDI API.
---

Yesterday I wrote [a blog post](https://handeyeco.github.io/tech-blog/volca-fm2-cart/) about how to send DX7 SysEx cartridges to the Korg Volca FM2. While I was writing it, I was thinking about how it was weird that SysEx Librarian only worked for OSX, MIDI-OX only worked for Windows, and there wasn't a web-based solution for sending SysEx. It piqued my curiosity, so I thought I'd give it a go with the [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API).

Introducing [SysEx Send](https://handeyeco.github.io/sysex-send/) ([Source](https://github.com/handeyeco/sysex-send))

For security reasons, Firefox has locked down the Web MIDI API so it's kind of difficult to use. As a Google hater it's with a heavy heart that I need to say this is a Chrome-focused solution.

Anyway, with all that out of the way, here's how sending SysEx works on the web.

## Get MIDI access

The Web MIDI API can be abused by malicious assholes (for instance for [fingerprinting](https://en.wikipedia.org/wiki/Device_fingerprint)), part of why Firefox has locked it down. Chrome also locks it down to some extent, so we need to get permission from the user first before accessing MIDI devices.

``` JSX
navigator
  // explicitly allow SysEx when requesting MIDI access
  .requestMIDIAccess({ sysex: true })
  .then((access) => {
    // here you have access to a map of MIDI outputs
    console.log(access.outputs)
  });
```

## Get a SysEx file

I used a [file input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file) that only allows files with `.syx` extensions:

``` JSX
function handleSelectSysex(e) {
  // Get access to the first Sysex file selected
  const sysexFile = e.target.files[0];
  console.log(sysexFile)
}

<input type="file"
  accept=".syx"
  // I'm using React, but you don't need to
  onChange={handleSelectSysex} />
```

## Send those bytes

There are several ways to read a file in the [File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API), but here's what I did:

``` JSX
// load the file into a buffer
const buffer = await sysexFile.arrayBuffer();
// convert that buffer into an array a 8-bit unsigned ints
const arr = new Uint8Array(buffer);
// use the MIDI output to send the array of bytes
output.send(arr);
```

## Conclusion

That's pretty much all there was to it, the rest of the code is building up the UI around it. Just took a couple of hours and I was loading DX7 carts to my Volca FM2 from the browser.

Again, the project is open-source so if you'd like to know more [check out the code here](https://github.com/handeyeco/sysex-send). Happy hacking!
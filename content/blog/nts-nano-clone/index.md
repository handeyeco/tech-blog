---
title: Note to Self - Nano Clone on High Sierra
date: 2020-05-27T01:25:23Z
description: Setting up an Arduino Nano clone on OSX High Sierra with PlatformIO.
---

I bought a couple of Arduino Nano clones and had some trouble getting them set up with my computer. Turns out Nano clones often use a replacement for the FT232 USB-to-serial chip called the CH340. These chips don't have drivers on OSX High Sierra by default and the drivers provided by the clone manufacturer didn't work for me.

I eventually had to download drivers and follow the instructions from this [Github](https://github.com/adrianmihalko/ch340g-ch34g-ch34x-mac-os-x-driver) repo. Super sketchy and I probably have a virus now, but at least my Nano clone works.

Switching from an Uno to a Nano I had to update my `platformio.ini` config:

``` ini
; before
[env:uno]
platform = atmelavr
board = uno
framework = arduino

; after
[env:nanoatmega328new]
platform = atmelavr
board = nanoatmega328new
framework = arduino
```

There were some people who said to use the old bootloader, but that didn't work for me. Anyway, wanted to save this for future me. Keep fighting the good fight future me!
---
title: Dirtywave M8 Basic MIDI Implementation
date: 2025-04-06T20:29:13Z
description: Looking at the OMX-27 to better understand the M8.
---

I recently picked up a v1 Dirtywave M8 in a trade. While browsing the web, I noticed that the [OMX-27](https://www.denki-oto.com/store/p59/omx27-kit.html) has some macros for controlling things on the M8. I couldn't find an official Dirtywave MIDI implementation chart, so I dug through the [OMX-27 code](https://github.com/okyeron/OMX-27) to get the basic idea. Thought I'd share.

## Implementation Chart

Commands are all sent as note on/off messages. The default channel is 10, but I believe that's configurable in `Project> MIDI > Settings > CC Map Chan` on the M8.

| MIDI Note | Function |
| -------- | ------- |
| 0 | Play button |
| 1 | Shift button |
| 2 | Edit button |
| 3 | Option button |
| 4 | Left button |
| 5 | Right button |
| 6 | Up button |
| 7 | Down button |
| 12 | Track 1 mute |
| 13 | Track 2 mute |
| 14 | Track 3 mute |
| 15 | Track 4 mute |
| 16 | Track 5 mute |
| 17 | Track 6 mute |
| 18 | Track 7 mute |
| 19 | Track 8 mute |
| 20 | Track 1 solo |
| 21 | Track 2 solo |
| 22 | Track 3 solo |
| 23 | Track 4 solo |
| 24 | Track 5 solo |
| 25 | Track 6 solo |
| 26 | Track 7 solo |
| 27 | Track 8 solo |

So for example, given these placeholder functions:

``` TS
type sendNoteOn = ({
  note: number,
  velocity: number,
  channel: number,
}): => void;

type sendNoteOff = ({
  note: number,
  velocity: number,
  channel: number,
}): => void;

// the OMX-27 code uses delays between MIDI messages
// probably just to keep the M8 from getting overloaded
// with messages
type delay = (ms: number) => Promise<void>;
```

We can control mutes / solos:

``` TS
// mute track 1
sendNoteOn({note: 12, velocity: 1, channel: 10});
await delay(10);

// solo track 2
sendNoteOn({note: 21, velocity: 1, channel: 10});
await delay(10);

// unsolo track 2
sendNoteOff({note: 21, velocity: 0, channel: 10});
await delay(10);
```

Or move around the menus:

``` TS
// press and hold shift
sendNoteOn({note: 1, velocity: 1, channel: 10});
await delay(10);

// press and release the left button 4 times
// to move through the menu tree
for (let i = 0; i < 5; i++) {
  sendNoteOn({note: 4, velocity: 1, channel: 10});
  await delay(10);
  sendNoteOff({note: 4, velocity: 0, channel: 10});
  await delay(10);
}

// release the shift button
sendNoteOff({note: 1, velocity: 0, channel: 10});
await delay(10);
```

## Launchpad

The M8 also supports interfacing with the Launchpad Pro and that includes being able to launch chains like Ableton's clip view. I imagine it similarly works by sending/receiving MIDI notes since that's typically how one programmatically controls Launchpads pads; for example from the [programming reference guide](https://fael-downloads-prod.focusrite.com/customer/prod/s3fs-public/downloads/LPP3_prog_ref_guide_200415.pdf):

> Lighting the lower left pad static red:
>
> Host => Launchpad Pro [MK3]:
>
> Hex: 90h 0Bh 05h
>
> Dec: 144 11 5
> 
> This is Note On, Channel 1, Note number 0Bh (11), with Velocity 05h (5). The Channel specifies the lighting mode (static), the Note number the pad to light (which is the lower left one in Programmer Mode), the Velocity the colour (which is Red, see Colour Palette).

So I'm guessing how it works is:

1. M8 sends a device indentification request
2. LP sends a response
3. M8 sends a bunch of messages to the LP indicating which pads should be lit and with what color using MIDI "note on" messages
4. When an LP pad is pressed, the LP sends its own "note on" message to the M8
5. M8 starts/stops the chain
6. M8 sends a new "note on" message to update the state of the LP pad

Unfortunately I don't have a Launchpad Pro to try this.

I'd love to reverse engineer the API to make a Norns script for this so that my Launchpad Minis would work with the M8, but until I can get more information on how the two devices are communicating I'm stuck.
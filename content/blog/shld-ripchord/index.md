---
title: From MIDI to Ripchord
date: 2025-01-09T20:29:13Z
description: Converting SHLD MIDI progressions to Ripchord presets.
---

**tl;dr**: if you typed "free ripchord presets" and landed here, here's a [bunch of free Ripchord presets](./shld-ripchord-progressions.zip) thanks to [SHLD](https://github.com/ldrolez/free-midi-chords).

---

[Ripchord](https://trackbout.com/) is a free, open-source VST for mapping single note presses into chords. It uses XML to store presets in this format:

```XML
<?xml version="1.0" encoding="UTF-8"?>
<ripchord>
  <preset>
    <!-- MIDI note to trigger the chord -->
    <input note="60">
      <!-- name of the chord and MIDI notes to play -->
      <chord name="C Major" notes="60;64;67"/>
    </input>
  </preset>
</ripchord>
```

While working on [Grandbot](https://github.com/handeyeco/Grandbot), I thought it would be cool if he could generate chord progressions. Rather than trying to program progressions into Grandbot directly though (which would be boring because I don't know a ton of music theory), I decided to leverage the Ripchord preset format to make [norns-ripchord](https://github.com/handeyeco/norns-ripchord).

Now Grandbot can make a sequence of notes and Norns can adapt those notes into chord progressions. With two Grandbots I can convert the chord progressions back into melodies!

So far, so good. The only problem is that there isn't a ton of Ripchord presets available online and I didn't want to use proprietary formats like Scaler or Cthulhu. [Musician Paradise](https://www.patreon.com/musicianparadise) has a bunch of great Ripchord presets and I also found [SHLD Free MIDI Chord Packs](https://github.com/ldrolez/free-midi-chords) - the only problem with the latter is that my code reads XML and not MIDI files.

So I wrote [shld-ripchord](https://github.com/handeyeco/shld-ripchord). Here's the basic idea of the script which is using [Mido](https://mido.readthedocs.io/en/stable/) for MIDI parsing:

```Python
# SHLD files are named like: Am - I IV V IV.mid
# so we grab the roman numeral name of each chord
name_regex = re.compile('.+ - (.+).mid')
name_match = name_regex.match(source_path)
chord_names = name_match.group(1).split()

# set some global variables
prog_dict = {}
chord_count = 0
chord_notes = []

# I wanted mappings to be on white keys
# starting with middle C
white_key_intervals = [2, 2, 1, 2, 2, 2, 1]
trig_note = 60

# load the MIDI file and iterate over the MIDI messages
midi_file = mido.MidiFile(source_path)
for msg in midi_file:
    # accumulate all sequential "note on" notes
    if msg.type == "note_on":
        chord_notes.append(msg.note)

    # when we hit a "note off" MIDI message
    # convert collected "note on" messages into a chord
    elif msg.type == "note_off" and len(chord_notes) > 0:
        # create a new mapping: trigger + name + chord
        prog_dict[trig_note] = {}
        prog_dict[trig_note]["notes"] = chord_notes
        prog_dict[trig_note]["name"] = chord_names[chord_count]

        # reset
        # increment trig_note in a way that makes all triggers
        # land on white keys
        trig_note += white_key_intervals[chord_count % len(white_key_intervals)]
        chord_count += 1
        chord_notes = []
```

Here's the code explained:

1. Go through each MIDI message in a `.mid` file using Mido
2. Collect all "note on" messages until we hit a "note off"
3. When we hit "note off", combine collected notes into a chord
4. Use the SHLD file name convention as a way to name chords
5. Increment the trigger note in a way that lands them on white keys

The reason I didn't want to be clever about the which trigger note to use:

1. Progressions reuse chords; `I IV V IV` uses the `IV` chord twice
2. The lowest note isn't always the root note
3. Placing chords on root notes doesn't show the chord progression

So I just throw them on the white keys and `norns-ripchord` can lock stray notes onto the nearest mapping.

Once I finished this project, **I realized I had actually done this before in JavaScript** which is kind of embarrassing. It was part of my unfinished attempt to autogenerate Ripchord presets based on sets of chords: [ripchord-presets](https://github.com/handeyeco/ripchord-presets). My life fluttering away one MIDI project at a time.

Anyway, here's a [bunch of free Ripchord chord progression presets](./shld-ripchord-progressions.zip) ala SHLD.

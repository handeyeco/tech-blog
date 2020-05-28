---
title: Concurrent Arduino
date: 2020-05-27T21:25:23Z
description: Long-running, non-blocking behavior in Arduino's single thread.
---

_For a more fleshed out example, you can see how Grandbot uses this behavior as of this [tag](https://github.com/handeyeco/Grandbot/tree/2020-05-27) for his [light](https://github.com/handeyeco/Grandbot/blob/2020-05-27/src/Light.cpp) and [voice](https://github.com/handeyeco/Grandbot/blob/2020-05-27/src/Voice.cpp)._

In an effort to create smooth RGB LED transitions in Arduino in a way that didn't completely block the main thread, I explored tweening using a repeatedly called update method in the class controlling my LED. Unfortunately part of my project, a buzzer playing a little melody, also blocked the main thread and broke my LED tweening. This was an existing bug that also blocked interaction with the project, so it was an opportunity to learn more about keeping the main thread free while improving the project.

In this post I'll talk about creating long-running yet non-blocking transitions for RGB LEDs and also cover a strategy for playing melodies with the Arduino `tone` function without blocking the main thread.

## RGB LED transition

A naive first try at an LED transition might look like this:

``` Arduino
int currR = 0;
int currG = 0;
int currB = 0;

void write(r, g, b) {
  // ...write to LED...
}

boolean transitionComplete() {
  return (
    currR == nextR &&
    currG == nextG &&
    currB == nextB
  );
}

int sign(x) {
  if (x > 0) return 1;
  if (x < 0) return -1;
  return 0;
}

// Gets called once
void update() {
  int nextR = 255;
  int nextG = 255;
  int nextB = 255;

  while (!transitionComplete()) {
    currR += sign(nextR - currR);
    currG += sign(nextG - currG);
    currB += sign(nextB - currB);

    write(currR, currG, currB);
  }
}
```

This should transition the LED correctly between two states, but unfortunately the `while` loop blocks the main thread preventing the Arduino from doing anything other than transitioning the LED.

The solution that worked for me was setting the next state in a separate method and creating a frequently called `update` method that tweens between two states. Tweening is a technique in animation that is used to transition between two states based off of an animation length and the current progress.

There's a lot more to keep track of and some _math_, but it's an effective way to transition the LED.

``` Arduino
int prevR = 0;
int prevG = 0;
int prevB = 0;
int nextR = 255;
int nextG = 255;
int nextB = 255;

// Find the difference between the two states
int deltaR = nextR - prevR;
int deltaG = nextG - prevG;
int deltaB = nextB - prevB;

// Animation should last 2 seconds and start now
int animationLength = 2000;
unsigned long animationStart = millis();

void write(r, g, b) {
  // ...write to LED...
}

// Gets called repeatedly in the main loop()
void update() {
  // Determine how long the animation has run
  unsigned long now = millis();
  int elapsed = now - animationStart;

  // Determine progress through the animation
  // capped at 1 (100%)
  float progress = (float) elapsed / animationLength;
  float capped = min(progress, 1);

  // Tween
  int r = prevR + (capped * deltaR);
  int g = prevG + (capped * deltaG);
  int b = prevB + (capped * deltaB);

  write(r, g, b);
}
```

Then we can create a swirling effect by adding a conditional to the `update` method.

``` Arduino
// Can be called repeatedly in the main loop()
void update() {
  unsigned long now = millis();
  int elapsed = now - animationStart;
  float progress = (float) elapsed / animationLength;
  float capped = min(progress, 1);

  int r = prevR + (capped * deltaR);
  int g = prevG + (capped * deltaG);
  int b = prevB + (capped * deltaB);

  write(r, g, b);

  if (process >= 1) {
    prevR = nextR;
    prevG = nextG;
    prevB = nextB;
    nextR = random(0, 256);
    nextG = random(0, 256);
    nextB = random(0, 256);
    deltaR = nextR - prevR;
    deltaG = nextG - prevG;
    deltaB = nextB - prevB;
    animationStart = now;
  }
}
```

This frees up the thread, but created two new problems:

1. I change the next color state with a user interaction (pressing a button) which creates a hard transition when starting a new animation during a currently running animation. It's not a huge problem, so I haven't dived into fixing this.
2. If something _else_ is blocking the main thread, two seconds can pass and the whole animation is skipped over. This was the case with my buzzer code as it played a little melody when a user interacted with the project. So I needed a way to play the melody in a non-blocking way!

## Non-blocking melody

This was a little more tricky and the melody will have a slightly less precise rhythm. The upside however is that a user can continue to interact with the project while a melody is being played; a bonus feature for fixing the LED transition problem.

Most examples for working with `tone` go something like this:

``` Arduino
int tonePin = 3;

// Gets called on user interaction
void play() {
  // play 2kHz for 2 seconds
  tone(tonePin, 2000);
  delay(2000);

  // play 4kHz for 1 second
  tone(tonePin, 4000);
  delay(1000);

  noTone(tonePin);
}
```

But of course this will block the thread for 3 seconds - a lifetime for a process to run.

My alternative solution requires a lot of code and definitely needs some refinement, but has been working for my basic needs:

``` Arduino
int tonePin = 3;

// -1 means we haven't started the melody
int currNoteIndex = -1;
// Timestamp when we started the last note
unsigned long noteStart = 0;
boolean playing = false;

int melodyLength = 2;
// Array of frequencies
int melody[2] = { 2000, 4000 };
// Array of times (beats)
int rhythm[2] = { 2000, 1000 };

// Gets called on user interaction
void play() {
  playing = true;
  currNoteIndex = -1;
}

// Gets called repeatedly in the main loop()
void update() {
  if (!playing) return;

  unsigned long now = millis();
 
  if (
    // If we're just starting the melody...
    currNoteIndex == -1
    // ... or we've been playing the current note too long...
    || now > noteStart + rhythm[currNoteIndex]
  ) {
    // ...bump the note index.
    currNoteIndex++;

    // If the next note exists, play it...
    if (currNoteIndex < melodyLength) {
      tone(tonePin, melody[currNoteIndex]);
      noteStart = now;
    }
    // ...otherwise stop playing.
    else {
      noTone(tonePin);
      playing = false;
    }
  }
}
```

So the secret here is that `tone` doesn't need the thread to run, people just tend to block the thread to keep track of how long we've been playing the tone. If we don't care too much about precision we can start the tone, do other things, and check in regularly to see if we need to stop or change the tone.

Obviously the code is chaotic and the way I'm managing the arrangement of notes/beats isn't ideal, but this could all probably be cleaned up. For my own project I made the note/beat arrays pretty big and just rewrote the values when the melody needed to change.

Unfortunately this created its own issue: since the button-press played a melody and the melody was blocking, the melody acted as a sort of debounce for the button. Now that the melody is non-blocking, the button-press is a little more jittery.

## Conclusion

So the basic idea is pretty straight-forward, we have a master loop and several "services" (as feature-specific classes) that each have their own loops that run and release the thread as quickly as possible. With this paradigm we can start "multitasking" on a single thread!

``` Arduino
void loop() {
  light.update();
  sound.update();

  // ...other things...
}
```
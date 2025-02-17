---
title: Creative Commons on Bandcamp
date: 2025-02-17T20:29:13Z
description: I created a tool to find Creative Commons music on Bandcamp.
---

**tl;dr**: I made a site to find Creative Commons music on Bandcamp called [cc-bc](https://handeyeco.github.io/cc-bc/) ([source](https://github.com/handeyeco/cc-bc)).

**SUPPORT THE ARTISTS**

**SUPPORT THE ARTISTS**

**SUPPORT THE ARTISTS**

---

We all benefit from open licensing and the shared pool of the public domain, whether we know it or not. From Émilie Gillet releasing her Mutable Instruments code (see my last post) to Linus Torvalds releasing Linux under the GNU General Public License (which the internet is essentially built on) to Jonas Salk choosing to not patent his polio vaccine (which is why many of us are able to walk without crutches), we've all been positively affected by people releasing their intellectual property into the world for everyone to use.

Contributing to this pool of knowledge and shared culture can be thankless though. That's why I started putting money aside each paycheck to support work that's open-source hardware (OSH), open-source software (OSS), and/or creative commons (CC) music.

Unfortunately my favorite place for buying independently released music - [Bandcamp](https://bandcamp.com/) - doesn't have a way to filter music by license (that I've found yet; please let me know if you've found a way). During my shopping sprees, I was spending hours digging through pages trying to find both (1) music I liked and (2) music with a CC license.

## Scraping Bandcamp

So I started to build a web scraper. At first it was pretty rough, but mostly worked. I sat on this project for a few months until I heard about [Bandcamp's LA fire relief fundraiser](https://bandcamp.com/lafirerelief) and thought it would be cool to make a site to help others find CC music as a way to support artists and the cause.

[The site is called cc-bc.](https://handeyeco.github.io/cc-bc)

It allows people to look for CC music by tag or by license. It's still a WIP, mainly because I'm still crawling and I need to figure out a way to send fragments of the data rather than sending >1MB of data when loading the page, but it's already helping me find music that I like. In fact you can see some of my favorites [here](https://handeyeco.github.io/cc-bc/#/list?faves=true).

## Reflecting on results

For the most part I'm happy with the project. I got to practice some of my back-end, SQL, and crawling skills while also exploring new music.

The main challenge right now (besides splitting the data into more manageable chunks) is trying to "steer" the crawler. I'm still dealing with the fallout from when the crawler went down rabbit holes around "furry" and "barber beats" music. Right now my solution to prevent hyperfocusing on specific genres is to cap each crawl at 50 CC results and restarting the crawler starting at one of my favorite albums (occassionally restarting on a random album from the DB to shake things up).

Another issue is that tags are picked by the artist and are often not representative of the work they're tagging. My co-worker was quick to point out that a random "folk" album he listened to would actually be better described as ["harsh noise wall"](https://en.wikipedia.org/wiki/Harsh_noise_wall).

Finally there's the question of legality for some of this "CC" music. It seems like many people mark their derivative work of copyrighted music (remixes, edits, etc.) as creative commons to naively skirt copyright law. Unfortunately I believe this is an incorrect use of CC and sets up futher derivative works for litigation, however unlikely that might be. But [IANAL](https://en.wikipedia.org/wiki/IANAL).

Bandcamp has mercifully yet to ban my IP but I have hit some snags on rate limiting, mostly due to bugs in my code. Hopefully they'll appreciate that I'm trying to send business their way because I love that Bandcamp exists.

## Semi-open

Despite my preaching the benefits of open-source software, the crawler will remain closed-source; crawling can be controversial and I'd be worried that less polite folks would crawl more aggressively/maliciously with my code.

However the site/data _are_ open-source and [you can find that on Github](https://github.com/handeyeco/cc-bc).

Happy hacking!

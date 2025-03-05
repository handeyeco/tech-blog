---
title: 11ty Off-By-One Date
date: 2025-03-05T03:25:23Z
description: Quick note about off-by-one dates in Eleventy (11ty).
---

For my new personal blog I've been playing around with 11ty. It's definitely not perfect, but it's a lot faster and more straight-forward than Gatsby (which is what I use for this blog).

My honeymoon period was cracked a little bit when I noticed the dates on my site were wrong due to a difference between local time and UTC. This is considered a common pitfall [in the docs](https://www.11ty.dev/docs/dates/#dates-off-by-one-day), but they don't offer a solution for Liquid in the docs or in the [original ticket](https://github.com/11ty/eleventy/issues/603).

Since this seemed like a common problem without a clear solution in a quick internet search, I thought I'd share what I did.

Originally what I was doing:

```Liquid
<div class="post-list__date">
  {{ post.data.date | date: "%Y-%m-%d" }}
</div>
```

The parser read "2025-03-07" as a UTC date and then converted it to a local date when formatting it in the template; so it rendered as "2025-03-06".

I ended up adding a custom filter:

```JS
// eleventy.config.js

function frontPad(input, char = "0", len = 2) {
    let str = String(input);
    while (str.length < len) {
      str = char + str;
    }
    return str;
}

export default function (eleventyConfig) {
  // ...my other config stuff...

  eleventyConfig.addFilter("dateString", function (date) {
    const year = date.getUTCFullYear();
    const month = frontPad(date.getUTCMonth() + 1);
    const day = frontPad(date.getUTCDate());

    return `${year}-${month}-${day}`;
  });
}
```

Then in the template:

```Liquid
<div class="post-list__date">
  {{ post.data.date | dateString }}
</div>
```

So now a "2025-03-07" date actually renders as "2025-03-07".

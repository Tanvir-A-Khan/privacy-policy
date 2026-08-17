# Privacy Policies

A privacy policy hub for app store submissions — one page per app, generated
from plain markdown, published as a static site with nothing else on it: no
cookies, no analytics, no third-party scripts, not even on this page.

## Structure

```
apps/
  tasbeeh-noor/
    meta.json      # name, package, tagline, badges shown on the index card
    policy.md       # the actual policy, in markdown
    icon.png        # optional, shown on the index card and the policy page
site/                # HTML/CSS templates — edit these to change the design
scripts/
  generate.js        # builds apps/ + site/ into docs/
  publish.sh          # builds, commits, pushes
  new-app.js          # scaffolds a new app's meta.json + policy.md
docs/                # generated output — this is what GitHub Pages serves
```

## Adding a new app

```bash
npm run new-app -- my-app-slug "My App Name"
```

This creates `apps/my-app-slug/` with a starter `meta.json` and a `policy.md`
written as a checklist, not a filled-in template. **Fill in what the app
actually does — don't copy another app's policy.md and assume it still
applies.** An app that syncs to a server or uses a third-party SDK needs a
policy that says so; copying Tasbeeh Noor's "collects nothing" onto it would
be a false statement in a document Play and the App Store both require to be
accurate.

Then:

```bash
npm run build     # regenerates docs/ — open docs/index.html to preview locally
npm run publish   # build, commit, and push
```

## Publishing (first time)

1. Create a new **public** GitHub repo — Pages requires public on a free
   plan, and a privacy policy is meant to be public anyway.
   → https://github.com/new
2. `git remote add origin git@github.com:<you>/privacy-policies.git`
3. `npm run publish`
4. One-time only: repo **Settings → Pages → Source: Deploy from a branch →
   Branch: `main`, Folder: `/docs`**

The site is then live at `https://<you>.github.io/privacy-policies/`, and
each app's policy at `https://<you>.github.io/privacy-policies/<slug>/` — a
stable URL to paste into Play Console → Store listing → Privacy policy, or
App Store Connect's equivalent field.

## Updating an existing policy

Edit `apps/<slug>/policy.md`, bump `lastUpdated` in its `meta.json`, then
`npm run publish`. The URL doesn't change, so nothing needs re-submitting on
the store side — the same link just now points at the updated text.

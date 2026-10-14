#!/usr/bin/env node
/**
 * Builds the static site from each app under apps/ into docs/, which is what
 * GitHub Pages serves directly — no CI, no build step on GitHub's side, just
 * committed HTML. Re-run after editing any policy.md, meta.json, or template.
 *
 *   node scripts/generate.js
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const ROOT = path.join(__dirname, '..');
const APPS_DIR = path.join(ROOT, 'apps');
const SITE_DIR = path.join(ROOT, 'site');
const OUT_DIR = path.join(ROOT, 'docs');

function readTemplate(name) {
  return fs.readFileSync(path.join(SITE_DIR, name), 'utf8');
}

/** `{{KEY}}` substitution — deliberately simple, there is no logic to template here. */
function fill(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');
}

function loadApps() {
  return fs
    .readdirSync(APPS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const dir = path.join(APPS_DIR, entry.name);
      const meta = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'));
      const markdown = fs.readFileSync(path.join(dir, 'policy.md'), 'utf8');
      return { slug: entry.name, dir, meta, markdown };
    })
    .sort((a, b) => a.meta.name.localeCompare(b.meta.name));
}

function build() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.copyFileSync(path.join(SITE_DIR, 'style.css'), path.join(OUT_DIR, 'style.css'));
  // Tells GitHub Pages not to run this through Jekyll, which would otherwise
  // ignore files starting with an underscore and can mangle plain HTML.
  fs.writeFileSync(path.join(OUT_DIR, '.nojekyll'), '');

  const apps = loadApps();
  if (apps.length === 0) {
    console.log('No apps found in apps/ — nothing to build.');
    return;
  }

  const pageTemplate = readTemplate('policy-page.html');
  const cardTemplate = readTemplate('app-card.html');

  const cards = apps.map((app) => {
    const appOutDir = path.join(OUT_DIR, app.slug);
    fs.mkdirSync(appOutDir, { recursive: true });

    const iconSrc = path.join(app.dir, 'icon.png');
    if (fs.existsSync(iconSrc)) {
      fs.copyFileSync(iconSrc, path.join(appOutDir, 'icon.png'));
    }

    const html = fill(pageTemplate, {
      APP_NAME: app.meta.name,
      LAST_UPDATED: app.meta.lastUpdated,
      BODY: marked.parse(app.markdown),
    });
    fs.writeFileSync(path.join(appOutDir, 'index.html'), html);
    console.log(`  built ${app.slug}/index.html  (${app.meta.name})`);

    const badges = (app.meta.badges ?? [])
      .map((label) => `<li>${label}</li>`)
      .join('\n      ');
    return fill(cardTemplate, {
      APP_ICON: fs.existsSync(iconSrc)
        ? `<img class="app-icon" src="./${app.slug}/icon.png" alt="" width="48" height="48" />`
        : '',
      SLUG: app.slug,
      NAME: app.meta.name,
      TAGLINE: app.meta.tagline ?? '',
      BADGES: badges,
    }).replace(/^[ \t]+$/gm, '');
  });

  const indexHtml = fill(readTemplate('index.html'), { APP_CARDS: cards.join('\n') });
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), indexHtml);
  console.log(`  built index.html  (${apps.length} app${apps.length === 1 ? '' : 's'})`);
}

build();

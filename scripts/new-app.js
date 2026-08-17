#!/usr/bin/env node
/**
 * Scaffolds a new app's privacy policy from a starter template.
 *
 *   npm run new-app -- my-app-slug "My App Name"
 *
 * The starter policy is deliberately a checklist, not a filled-in "collects
 * nothing" template — copying Tasbeeh Noor's policy onto an app that actually
 * does collect data would be a false statement, not a time-saver. Fill in
 * apps/<slug>/policy.md with what the app actually does before publishing.
 */

const fs = require('fs');
const path = require('path');

const [, , slug, ...nameParts] = process.argv;
const name = nameParts.join(' ');

if (!slug || !name) {
  console.error('Usage: npm run new-app -- <slug> "<App Name>"');
  console.error('Example: npm run new-app -- gpa-calculator "GPA Calculator"');
  process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error('Slug must be lowercase letters, numbers, and hyphens only (it becomes a URL path).');
  process.exit(1);
}

const dir = path.join(__dirname, '..', 'apps', slug);
if (fs.existsSync(dir)) {
  console.error(`apps/${slug} already exists.`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });

const today = new Date().toISOString().slice(0, 10);

fs.writeFileSync(
  path.join(dir, 'meta.json'),
  JSON.stringify(
    {
      name,
      slug,
      package: 'TODO: com.example.app',
      tagline: 'TODO: one line describing the app',
      lastUpdated: today,
      badges: ['TODO'],
    },
    null,
    2,
  ) + '\n',
);

fs.writeFileSync(
  path.join(dir, 'policy.md'),
  `TODO — replace this with what ${name} actually does. Check each item against
the real code before publishing; do not assume an answer because another app
of yours answered it a certain way.

## What the app does

- Does it require an account or sign-in?
- What data does it store, and is it kept only on the device or sent anywhere?
- Does it make any network requests? If so, to what, and why?
- Does it use any third-party SDKs (analytics, crash reporting, ads)?
- Can data be deleted, and how?

## Contact

You can reach the developer through this app's store listing.
`,
);

console.log(`Created apps/${slug}/`);
console.log(`  meta.json  — fill in package, tagline, badges`);
console.log(`  policy.md  — replace the checklist with verified facts`);
console.log(`Then: npm run build`);

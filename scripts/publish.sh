#!/usr/bin/env bash
# Builds the site and pushes it to GitHub. GitHub Pages serves docs/ directly
# off the main branch — no CI, nothing to configure beyond the one-time Pages
# setting mentioned below.
#
#   npm run publish
set -euo pipefail
cd "$(dirname "$0")/.."

echo "Building site..."
npm run build --silent

if ! git remote get-url origin >/dev/null 2>&1; then
  cat <<'EOF'

No git remote named "origin" is configured yet.

  1. Create a new PUBLIC repo on GitHub (Pages needs it public on a free
     plan): https://github.com/new
     Suggested name: privacy-policies

  2. Then run:
       git remote add origin git@github.com:<your-username>/privacy-policies.git

  3. Re-run: npm run publish
EOF
  exit 1
fi

git add -A
if git diff --cached --quiet; then
  echo "Nothing changed since the last publish."
  exit 0
fi

git commit -m "Publish: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push -u origin main

REMOTE_URL=$(git remote get-url origin)
cat <<EOF

Pushed.

If this is the first publish, enable GitHub Pages once (a one-time setting,
not something this script can flip on its own):
  Repo -> Settings -> Pages -> Source: "Deploy from a branch"
  Branch: main   Folder: /docs

Remote: $REMOTE_URL
EOF

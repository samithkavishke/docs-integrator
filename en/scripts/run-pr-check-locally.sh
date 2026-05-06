#!/usr/bin/env bash
# Mimics .github/workflows/pr_build_check.yaml end-to-end on your machine.
# Each section mirrors one step in the workflow.
set -u

EN_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$EN_DIR"

SUMMARY="$(mktemp -t pr-check-summary.XXXXXX.md)"
export GITHUB_STEP_SUMMARY="$SUMMARY"

step() { printf '\n\033[1;36m== %s ==\033[0m\n' "$*"; }

step "Install dependencies (npm ci)"
npm ci

step "Build Docusaurus site"
set -o pipefail
BASE_URL=/docs-integrator/ npm run build 2>&1 | tee build.log
build_status=$?
set +o pipefail
echo "build exit code: $build_status"

step "Report broken-link warnings"
{
  echo "## Broken links"
  echo ""
  if [ ! -f build.log ]; then
    echo "_Build log not found — skipping._"
  else
    matches=$(grep -niE "broken (link|markdown link|anchor)|docusaurus found broken" build.log || true)
    if [ -z "$matches" ]; then
      echo "No broken-link warnings reported by the build."
    else
      echo "The build reported the following warnings (build is configured with \`onBrokenLinks: 'warn'\`, so it does not fail):"
      echo ""
      echo '```'
      echo "$matches"
      echo '```'
    fi
  fi
} | tee -a "$GITHUB_STEP_SUMMARY"

step "Check for pages not linked from the sidebar"
node scripts/check-orphans.mjs

step "Aggregated step summary (this is what GitHub renders on the PR)"
echo "  → $GITHUB_STEP_SUMMARY"
echo "----------------------------------------------------------------"
cat "$GITHUB_STEP_SUMMARY"
echo "----------------------------------------------------------------"

exit "$build_status"

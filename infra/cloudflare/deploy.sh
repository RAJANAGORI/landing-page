#!/usr/bin/env bash
# Deploy security headers Worker for nightingale-security.com (apex only).
set -euo pipefail
cd "$(dirname "$0")"

if ! npx --yes wrangler whoami >/dev/null 2>&1; then
  echo "Not logged in to Cloudflare. Opening browser login..."
  npx --yes wrangler login
fi

echo "Deploying nightingale-agent-discovery Worker with apex routes..."
npx --yes wrangler deploy

echo
echo "Verify:"
echo "  curl -sI https://nightingale-security.com/ | grep -iE 'strict-transport|content-security|x-frame|x-content|referrer|permissions|access-control'"
echo "  https://securityheaders.com/?q=https%3A%2F%2Fnightingale-security.com%2F&followRedirects=on"

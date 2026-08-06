/**
 * Cloudflare Worker: Agent discovery headers, markdown negotiation, and security headers.
 *
 * Deploy: cd infra/cloudflare && npx wrangler login && npx wrangler deploy
 * Route: nightingale-security.com/* (apex marketing origin only; not dashboard.*)
 * Ops checklist: security-headers.txt (Transform Rules fallback + HSTS edge settings)
 *
 * SECURITY: GitHub Pages does not emit browser security headers. This worker
 * enforces CSP/HSTS/XCTO/XFO and related policies at the Cloudflare edge and
 * strips the origin's Access-Control-Allow-Origin: * on HTML.
 */

const LINK_HEADERS = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</index.md>; rel="alternate"; type="text/markdown"',
  '</auth.md>; rel="describedby"',
  '</.well-known/mcp/server-card.json>; rel="service-desc"',
  '<https://github.com/RAJANAGORI/Nightingale/wiki>; rel="service-doc"',
  '</.well-known/agent-skills/index.json>; rel="describedby"',
  '</.well-known/oauth-protected-resource>; rel="oauth-protected-resource"',
].join(', ');

const WELL_KNOWN_CONTENT_TYPES = {
  '/.well-known/api-catalog': 'application/linkset+json',
  '/.well-known/oauth-protected-resource': 'application/json',
  '/.well-known/oauth-authorization-server': 'application/json',
  '/.well-known/openid-configuration': 'application/json',
  '/.well-known/jwks.json': 'application/json',
  '/.well-known/mcp/server-card.json': 'application/json',
  '/.well-known/agent-skills/index.json': 'application/json',
  '/.well-known/security.txt': 'text/plain',
};

// SECURITY: CSP allows known marketing third-parties (GTM, Google Fonts, cdnjs Font Awesome)
// and blocks framing / unexpected script hosts — closes XSS impact and clickjacking.
const MARKETING_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
  "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com",
  "img-src 'self' data: https:",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com https://*.google-analytics.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

function wantsMarkdown(request) {
  const accept = request.headers.get('Accept') || '';
  return accept.includes('text/markdown');
}

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

function applySecurityHeaders(headers) {
  // SECURITY: Force HTTPS after first visit; includeSubDomains covers www and sibling hosts.
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Cross-Origin-Resource-Policy', 'same-site');
  headers.set('Content-Security-Policy', MARKETING_CSP);
  // SECURITY: Drop Pages/Fastly wildcard CORS on document responses — brochure site needs no ACAO.
  headers.delete('Access-Control-Allow-Origin');
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if ((path === '/' || path === '/index.html') && wantsMarkdown(request)) {
      const mdRequest = new Request(new URL('/index.md', url.origin), request);
      const mdResponse = await fetch(mdRequest);

      if (mdResponse.ok) {
        const body = await mdResponse.text();
        const headers = new Headers(mdResponse.headers);
        headers.set('Content-Type', 'text/markdown; charset=utf-8');
        headers.set('Vary', 'Accept');
        headers.set('x-markdown-tokens', String(estimateTokens(body)));
        headers.set('Link', LINK_HEADERS);
        applySecurityHeaders(headers);
        return new Response(body, { status: 200, headers });
      }
    }

    const response = await fetch(request);
    const headers = new Headers(response.headers);

    if (path === '/' || path === '/index.html') {
      headers.set('Link', LINK_HEADERS);
      headers.set('Vary', 'Accept');
    }

    const contentType = WELL_KNOWN_CONTENT_TYPES[path];
    if (contentType) {
      headers.set('Content-Type', contentType + '; charset=utf-8');
    }

    if (path.endsWith('.md')) {
      headers.set('Content-Type', 'text/markdown; charset=utf-8');
    }

    applySecurityHeaders(headers);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

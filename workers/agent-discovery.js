/**
 * Cloudflare Worker: Agent discovery headers and markdown content negotiation.
 *
 * Deploy as a route on nightingale-security.com (Dashboard → Workers → Routes).
 * Uses pass-through fetch to GitHub Pages origin, then injects headers.
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
};

function wantsMarkdown(request) {
  const accept = request.headers.get('Accept') || '';
  return accept.includes('text/markdown');
}

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Markdown content negotiation for homepage
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
        return new Response(body, { status: 200, headers });
      }
    }

    // Pass-through to origin (GitHub Pages)
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

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

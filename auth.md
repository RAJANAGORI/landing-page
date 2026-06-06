# Nightingale auth.md

Agent registration and authentication guide for the Nightingale pentesting platform.

## Audience

This document is for AI agents and automated clients that need to discover how to authenticate with Nightingale APIs and request hosted access.

## Resource

- **Resource identifier:** `https://nightingale-security.com/`
- **Protected API:** `https://dashboard.nightingale-security.com/`
- **OAuth Protected Resource Metadata:** https://nightingale-security.com/.well-known/oauth-protected-resource

## Authorization Server

- **Issuer:** `https://nightingale-security.com`
- **OAuth Authorization Server:** https://nightingale-security.com/.well-known/oauth-authorization-server
- **OpenID Configuration:** https://nightingale-security.com/.well-known/openid-configuration

## Registration

### Anonymous {#anonymous}

Agents and users without prior credentials can request hosted access by opening a GitHub issue:

```
POST (via GitHub Issues UI)
https://github.com/RAJANAGORI/Nightingale/issues/new?template=hosted_gui_access.yaml
```

**Credential type:** `github_issue_token` — a maintainer-issued access token delivered via the GitHub issue thread.

**Steps:**

1. Describe your use case and intended testing scope.
2. Wait for maintainer review and provisioning.
3. Use the credentials provided in the issue reply to access the dashboard.

### Verified email {#verified-email}

For verified identity, link a GitHub account with a verified email address. Maintainers confirm identity through the issue thread before issuing credentials.

**Assertion type:** `verified_email`
**Claim URI:** https://nightingale-security.com/auth.md#verified-email

## Supported Scopes

| Scope | Description |
|-------|-------------|
| `nightingale.read` | Read engagements, scans, and findings |
| `nightingale.console` | Access web console and VS Code workspace |
| `nightingale.scans` | Submit and manage security scans and playbooks |
| `openid` | OpenID Connect identity |
| `profile` | User profile information |
| `email` | Email address |

## Token Usage

Include bearer tokens in the `Authorization` header when calling protected APIs:

```
Authorization: Bearer <access_token>
```

## Related Discovery

- API Catalog: https://nightingale-security.com/.well-known/api-catalog
- MCP Server Card: https://nightingale-security.com/.well-known/mcp/server-card.json
- Agent Skills Index: https://nightingale-security.com/.well-known/agent-skills/index.json
- Documentation: https://github.com/RAJANAGORI/Nightingale/wiki

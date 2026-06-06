# Request Hosted Nightingale Access

## Description

Instructions for AI agents and users to request access to the hosted Nightingale web GUI at nightingale-security.com.

## Registration Method

1. Open a GitHub issue in the Nightingale repository using the Hosted Nightingale GUI access issue template.
2. A maintainer reviews the request and provisions an on-demand environment.
3. The maintainer replies on the issue with login credentials and next steps.

## Endpoints

- **Registration:** https://github.com/RAJANAGORI/Nightingale/issues/new?template=hosted_gui_access.yaml
- **Auth documentation:** https://nightingale-security.com/auth.md
- **Dashboard:** https://dashboard.nightingale-security.com/

## Identity Types

- **Anonymous:** Submit a GitHub issue with your use case. No prior account required.
- **Verified email:** Link your GitHub account; maintainers verify identity through the issue thread.

## OAuth Scopes

When authenticated via the Nightingale dashboard:

- `nightingale.read` — Read engagements, scans, and findings
- `nightingale.console` — Access web console and VS Code workspace
- `nightingale.scans` — Submit and manage security scans and playbooks

## Related Discovery

- OAuth Authorization Server: https://nightingale-security.com/.well-known/oauth-authorization-server
- OAuth Protected Resource: https://nightingale-security.com/.well-known/oauth-protected-resource
- OpenID Configuration: https://nightingale-security.com/.well-known/openid-configuration

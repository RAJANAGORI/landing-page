# Nightingale v2.0 — Live web gui pentesting tool on Docker

> Docker for Pentesters — A comprehensive penetration testing framework with web-based GUI and 200+ security tools.

**URL:** https://nightingale-security.com/
**Repository:** https://github.com/RAJANAGORI/Nightingale
**Dashboard:** https://dashboard.nightingale-security.com/

## Overview

Nightingale v2.0 is an OWASP incubator penetration testing framework built on Docker. It provides a modern web-based GUI with multi-terminal support, embedded VS Code, security scans, findings ingestion, playbooks, and 200+ pre-installed security tools.

A hosted web demo is available at nightingale-security.com by request via GitHub. Self-host with Docker anytime.

## Key Features

- **Web Application VAPT** — XSS, SQL injection, API testing frameworks
- **Network VAPT** — Port scanning, exploitation, network mapping
- **Mobile VAPT** — Android/iOS security analysis
- **OSINT** — Reconnaissance and information gathering
- **Digital Forensics** — Evidence collection and analysis
- **Nightingale Web Console** — Browser-based GUI with real-time file explorer
- **Embedded VS Code** — Full IDE workspace inside the container
- **Security Scans & Playbooks** — Automated multi-step scan workflows
- **AI-Assisted Analysis** — Scan explanation and terminal command suggestions
- **VPN Management** — Segmented test network connectivity
- **Team Administration** — User management, MFA, engagement-scoped workspaces

## Getting Started

### Try the Hosted Demo

1. Open a GitHub issue: https://github.com/RAJANAGORI/Nightingale/issues/new?template=hosted_gui_access.yaml
2. A maintainer provisions an on-demand environment
3. Access the dashboard at https://dashboard.nightingale-security.com/

### Self-Host with Docker

```bash
docker pull ghcr.io/rajanagori/nightingale:latest
docker run -d -p 8080:8080 ghcr.io/rajanagori/nightingale:latest
```

See the [GitHub repository](https://github.com/RAJANAGORI/Nightingale) for full installation instructions.

## FAQ

### What is Nightingale?

Nightingale v2.0 is a comprehensive penetration testing framework built on Docker that provides a modern web-based GUI with multi-terminal support and 200+ pre-installed security tools. It runs entirely in containers to ensure platform independence.

### Is the web GUI live?

Yes. A hosted Nightingale web GUI is available at nightingale-security.com by request. Open a GitHub issue using the Hosted Nightingale GUI access issue template.

### Do I need Docker experience?

No. Nightingale is designed to be user-friendly. Pull the container, run it, and access the web interface through your browser.

### What types of testing does Nightingale support?

Web application vulnerability assessment, network penetration testing, mobile security testing, OSINT, digital forensics, and red team operations with 200+ tools in 6 specialized categories.

### Is Nightingale free and open source?

Yes. Nightingale is completely free and open source as an OWASP Incubator Project, available on GitHub without licensing costs.

### Which operating systems are supported?

Any OS that supports Docker: Windows, macOS, and Linux.

## Resources

- [Documentation](https://github.com/RAJANAGORI/Nightingale/wiki)
- [GitHub Repository](https://github.com/RAJANAGORI/Nightingale)
- [Report Issues](https://github.com/RAJANAGORI/Nightingale/issues)
- [OWASP Project](https://www.owasp.org/index.php/Category:OWASP_Project)

## Agent Discovery

| Resource | URL |
|----------|-----|
| API Catalog | `/.well-known/api-catalog` |
| OAuth Authorization Server | `/.well-known/oauth-authorization-server` |
| OAuth Protected Resource | `/.well-known/oauth-protected-resource` |
| OpenID Configuration | `/.well-known/openid-configuration` |
| MCP Server Card | `/.well-known/mcp/server-card.json` |
| Agent Skills Index | `/.well-known/agent-skills/index.json` |
| Auth Guide | `/auth.md` |

## Author

Built by [Raja Nagori](https://rajanagori.in) for the security community.

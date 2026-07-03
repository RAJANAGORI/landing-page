// WebMCP — expose site tools to AI agents via the browser
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        if (!navigator.modelContext || typeof navigator.modelContext.registerTool !== 'function') {
            return;
        }

        var abortController = new AbortController();
        var signal = abortController.signal;

        var sections = [
            { id: 'hero', title: 'Hero / Overview' },
            { id: 'lifecycle', title: 'Security Testing Lifecycle' },
            { id: 'road-ahead', title: 'Advanced Capabilities' },
            { id: 'product', title: 'Product Showcase' },
            { id: 'tools', title: 'Security Tools' },
            { id: 'architecture', title: 'Architecture' },
            { id: 'getting-started', title: 'Getting Started' },
            { id: 'recognition', title: 'Recognition' },
            { id: 'faq', title: 'FAQ' }
        ];

        navigator.modelContext.registerTool({
            name: 'get_site_info',
            description: 'Get overview information about Nightingale v2.0 pentesting framework',
            inputSchema: {
                type: 'object',
                properties: {},
                additionalProperties: false
            },
            execute: function () {
                return {
                    name: 'Nightingale',
                    version: '2.0',
                    url: 'https://nightingale-security.com/',
                    description: 'OWASP Docker pentesting framework with web GUI, VS Code, scans, playbooks, and 200+ tools',
                    repository: 'https://github.com/RAJANAGORI/Nightingale',
                    documentation: 'https://github.com/RAJANAGORI/Nightingale/wiki',
                    dashboard: 'https://dashboard.nightingale-security.com/',
                    discovery: {
                        apiCatalog: '/.well-known/api-catalog',
                        auth: '/auth.md',
                        mcpServerCard: '/.well-known/mcp/server-card.json',
                        agentSkills: '/.well-known/agent-skills/index.json'
                    }
                };
            }
        }, { signal: signal });

        navigator.modelContext.registerTool({
            name: 'search_faq',
            description: 'Search Nightingale FAQ for answers about the product, hosted demo, Docker, and pentesting',
            inputSchema: {
                type: 'object',
                properties: {
                    query: {
                        type: 'string',
                        description: 'Search term to match against FAQ questions and answers'
                    }
                },
                required: ['query'],
                additionalProperties: false
            },
            execute: function (params) {
                var query = (params.query || '').toLowerCase();
                var results = [];
                document.querySelectorAll('.faq-item').forEach(function (item) {
                    var question = item.querySelector('.faq-question h3');
                    var answer = item.querySelector('.faq-answer [itemprop="text"]');
                    if (!question || !answer) return;
                    var qText = question.textContent.trim();
                    var aText = answer.textContent.trim();
                    if (!query || qText.toLowerCase().indexOf(query) !== -1 || aText.toLowerCase().indexOf(query) !== -1) {
                        results.push({ question: qText, answer: aText });
                    }
                });
                return { results: results, count: results.length };
            }
        }, { signal: signal });

        navigator.modelContext.registerTool({
            name: 'navigate_to_section',
            description: 'Navigate to a section of the Nightingale landing page',
            inputSchema: {
                type: 'object',
                properties: {
                    section: {
                        type: 'string',
                        description: 'Section ID to navigate to',
                        enum: ['hero', 'lifecycle', 'road-ahead', 'product', 'tools', 'architecture', 'getting-started', 'recognition', 'faq']
                    }
                },
                required: ['section'],
                additionalProperties: false
            },
            execute: function (params) {
                var el = document.getElementById(params.section);
                if (!el) {
                    return { success: false, error: 'Section not found: ' + params.section };
                }
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return { success: true, section: params.section };
            }
        }, { signal: signal });

        navigator.modelContext.registerTool({
            name: 'list_sections',
            description: 'List all navigable sections on the Nightingale landing page',
            inputSchema: {
                type: 'object',
                properties: {},
                additionalProperties: false
            },
            execute: function () {
                return { sections: sections };
            }
        }, { signal: signal });

        navigator.modelContext.registerTool({
            name: 'get_documentation_links',
            description: 'Get links to Nightingale documentation, repository, and support resources',
            inputSchema: {
                type: 'object',
                properties: {},
                additionalProperties: false
            },
            execute: function () {
                return {
                    wiki: 'https://github.com/RAJANAGORI/Nightingale/wiki',
                    repository: 'https://github.com/RAJANAGORI/Nightingale',
                    issues: 'https://github.com/RAJANAGORI/Nightingale/issues',
                    discussions: 'https://github.com/RAJANAGORI/Nightingale/discussions',
                    artifactHub: 'https://artifacthub.io/packages/search?repo=nightingale',
                    owasp: 'https://www.owasp.org/index.php/Category:OWASP_Project',
                    auth: 'https://nightingale-security.com/auth.md',
                    apiCatalog: 'https://nightingale-security.com/.well-known/api-catalog'
                };
            }
        }, { signal: signal });

        navigator.modelContext.registerTool({
            name: 'request_hosted_access',
            description: 'Get the URL and instructions to request hosted Nightingale GUI access',
            inputSchema: {
                type: 'object',
                properties: {},
                additionalProperties: false
            },
            execute: function () {
                return {
                    url: 'https://github.com/RAJANAGORI/Nightingale/issues/new?template=hosted_gui_access.yaml',
                    instructions: 'Open a GitHub issue using the Hosted Nightingale GUI access template. A maintainer provisions an on-demand environment and replies with credentials.',
                    dashboard: 'https://dashboard.nightingale-security.com/'
                };
            }
        }, { signal: signal });

        window.addEventListener('pagehide', function () {
            abortController.abort();
        });
    });
})();

# MISJustice Alliance

> Privacy-first legal advocacy and civil rights resource platform

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)
[![Notion](https://img.shields.io/badge/CMS-Notion-black)](https://notion.so)
[![Privacy](https://img.shields.io/badge/Privacy-First-green)](docs/privacy.md)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA-brightgreen)](docs/accessibility.md)

**Website**: [misjusticealliance.org](https://misjusticealliance.org)

## About

The **Anonymous Legal Assistance Group** (MISJustice Alliance) is a privacy-first legal advocacy platform providing resources, support, and advocacy for individuals facing:

- Civil rights violations
- Police misconduct and abuse of power
- Prosecutorial misconduct
- Legal malpractice
- Institutional corruption
- Whistleblower retaliation

## Mission

We exist to shine a public light on institutions whose conduct demonstrates clear patterns of systemic corruption and misconduct that victimizes innocent individuals. Our anonymous structure protects both volunteers and users while bringing institutional abuse into public accountability.

## Core Values

🔒 **Privacy & Anonymity First**
- End-to-end encryption for sensitive communications
- No PII logging or user tracking
- Anonymous intake system
- Zero-trust architecture

🛡️ **Security by Default**
- Cloudflare WAF and DDoS protection
- Strict Content Security Policy
- Regular security audits
- Privacy-preserving analytics only

♿ **Accessibility for All**
- WCAG 2.1 Level AA compliance
- Screen reader compatible
- Keyboard navigation support
- Mobile-first responsive design

📖 **Open Source & Transparent**
- Apache 2.0 licensed
- Public codebase
- Community contributions welcome
- Auditable and transparent

## Technical Architecture

```
┌─────────────┐
│    Users    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│   Cloudflare Edge Network       │
│  ┌──────────────────────────┐   │
│  │  CDN + WAF + DDoS        │   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │  Workers (Business Logic)│   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │  KV Storage (Cache)      │   │
│  └──────────────────────────┘   │
└────────────┬────────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Super.so (Site Builder)       │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Notion (Headless CMS)         │
└────────────────────────────────┘
```

### Technology Stack

- **Content Management**: Notion (headless CMS)
- **Site Builder**: Super.so
- **Infrastructure**: Cloudflare (DNS, CDN, Workers, KV)
- **Version Control**: GitHub
- **CI/CD**: GitHub Actions
- **Language**: JavaScript (ES6+)
- **Runtime**: Cloudflare Workers (V8 Isolates)

## Features

### For Users
- 🔐 **Anonymous Legal Intake**: Encrypted, no-login submission
- 📚 **Resource Directory**: State-specific legal resources
- 📖 **Civil Rights Education**: Comprehensive guides and FAQs
- 🤝 **Attorney Referrals**: Connections to qualified legal representation
- 💬 **Advocacy Support**: Resources for navigating oversight agencies

### For Developers
- ⚡ **Edge Computing**: Sub-50ms response times globally
- 🚀 **Auto-Generated SEO**: robots.txt, sitemap.xml via Workers
- 🤖 **AI-Optimized**: llms.txt for generative search engines
- 🧪 **Comprehensive Testing**: Unit, integration, accessibility tests
- 📊 **Privacy Analytics**: No tracking, aggregate metrics only

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Cloudflare account
- Notion workspace
- Super.so account

### Installation

```bash
# Clone the repository
git clone https://github.com/MISJustice-Sites/misjusticealliance.org.git
cd misjusticealliance.org

# Install dependencies
npm install

# Copy and configure wrangler.toml
cp wrangler.toml.example wrangler.toml
# Edit wrangler.toml with your Cloudflare account details

# Set up secrets
wrangler secret put NOTION_TOKEN
wrangler secret put ENCRYPTION_KEY
wrangler secret put WEBHOOK_SECRET
```

### Development

```bash
# Start local development server
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

### Deployment

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production (requires approval)
npm run deploy:production
```

## Project Structure

```
/
├── .ai/                        # AI assistant configuration
│   ├── README.md              # AI instructions
│   ├── project-context.md     # Project overview
│   └── tech-stack.md          # Technical documentation
├── .github/                    # GitHub configuration
│   ├── workflows/             # CI/CD pipelines
│   └── copilot-instructions.md
├── cloudflare/                # Cloudflare Workers
│   ├── workers/              # Individual Workers
│   │   ├── index.js         # Main Worker
│   │   ├── seo-automation.js
│   │   ├── geo-optimization.js
│   │   ├── security.js
│   │   └── analytics.js
│   └── tests/                # Worker tests
├── docs/                      # Documentation
│   ├── architecture.md
│   ├── deployment.md
│   ├── privacy.md
│   └── security.md
├── notion/                    # Notion configuration
│   ├── databases/            # Database schemas
│   └── templates/            # Page templates
├── public/                    # Static assets
├── scripts/                   # Automation scripts
├── tests/                     # Test suites
├── .cursorrules              # Cursor AI config
├── .clinerules               # Cline AI config
├── .clauderc                 # Claude AI config
├── .eslintrc.cjs             # ESLint config
├── .prettierrc               # Prettier config
├── .gitignore
├── LICENSE                    # Apache 2.0
├── package.json
├── README.md                  # This file
└── wrangler.toml.example     # Cloudflare config template
```

## Contributing

We welcome contributions from the community! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting pull requests.

### Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Testing Requirements

- All new features must include tests
- Maintain 80%+ code coverage
- Pass all accessibility tests (WCAG 2.1 AA)
- Pass security audits
- Follow ESLint and Prettier configurations

## Privacy & Security

This project takes privacy and security seriously:

- **No PII Logging**: We never log personally identifiable information
- **No Third-Party Tracking**: No Google Analytics, Facebook Pixel, or similar
- **End-to-End Encryption**: Sensitive data encrypted at rest and in transit
- **Anonymous by Default**: No user accounts or authentication required
- **Regular Audits**: Quarterly security and privacy audits

See our [Privacy Policy](docs/privacy.md) and [Security Documentation](docs/security.md) for details.

## Accessibility

We are committed to ensuring accessibility for all users:

- WCAG 2.1 Level AA compliant
- Screen reader tested (NVDA, JAWS, VoiceOver)
- Keyboard navigation throughout
- High contrast color schemes
- Responsive mobile design

See our [Accessibility Statement](docs/accessibility.md) for details.

## Performance

Performance targets:

| Metric | Target | Current |
|--------|--------|---------|
| Page Load Time | <3s | ~1.2s |
| First Contentful Paint | <1.8s | ~0.9s |
| Largest Contentful Paint | <2.5s | ~1.5s |
| Cumulative Layout Shift | <0.1 | ~0.05 |
| Worker Execution | <50ms | ~15ms |

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Disclaimer

**The Anonymous Legal Assistance Group is not a law firm.** Information provided on this website is for general educational purposes only and does not constitute legal advice. Anonymous intake does not create an attorney-client relationship. For legal advice specific to your situation, please consult with a licensed attorney in your jurisdiction.

## Contact

- **Anonymous Intake**: [misjusticealliance.org/intake](https://misjusticealliance.org/intake)
- **GitHub Issues**: [Report bugs or request features](https://github.com/MISJustice-Sites/misjusticealliance.org/issues)
- **General Inquiries**: Use the contact form on our website (no direct email to prevent harvesting)

## Acknowledgments

- Cloudflare for providing edge infrastructure
- Notion for headless CMS capabilities
- Super.so for site building platform
- The open-source community for tools and libraries
- Legal advocates and volunteers who make this work possible

## Support

If you find this project valuable, consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 📖 Improving documentation
- 🤝 Contributing code

---

**Built with privacy, security, and accessibility as core principles.**

*Empowering individuals to stand against institutional abuse of power.*

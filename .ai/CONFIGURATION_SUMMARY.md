# AI IDE Configuration Files - Summary

## Overview

This directory contains comprehensive AI IDE configuration files for the **misjusticealliance.org** project. These files ensure that AI coding assistants (Cursor, Cline, Claude, GitHub Copilot, etc.) understand the project's critical requirements around privacy, security, and accessibility.

## Files Created

### Root Configuration Files

#### `.cursorrules`
- **Purpose**: Cursor IDE configuration
- **Content**: Comprehensive project rules, technical architecture, development guidelines
- **Key Sections**:
  - Project overview and mission
  - Technical stack (Notion, Super.so, Cloudflare)
  - Privacy-first development principles
  - Security requirements
  - Accessibility standards (WCAG 2.1 AA)
  - Cloudflare Workers best practices
  - SEO/GEO optimization
  - Content guidelines

#### `.clinerules`
- **Purpose**: Cline AI configuration
- **Content**: Detailed technical implementation guidelines
- **Key Sections**:
  - Core principles (Privacy, Security, Accessibility, Open Source)
  - Cloudflare Workers architecture
  - Notion integration patterns
  - SEO/GEO strategy
  - Privacy & security implementation
  - Testing standards
  - Emergency response procedures

#### `.clauderc`
- **Purpose**: Claude AI configuration
- **Content**: Project context and development guidelines for Claude
- **Key Sections**:
  - Organization context and mission
  - Technical architecture overview
  - Development guidelines
  - Privacy-first principles
  - Security requirements
  - Accessibility standards
  - Cloudflare Workers development
  - Notion API integration
  - Testing & QA

### GitHub Configuration

#### `.github/copilot-instructions.md`
- **Purpose**: GitHub Copilot instructions
- **Content**: Code generation guidelines and best practices
- **Key Sections**:
  - Privacy & security requirements (HIGHEST PRIORITY)
  - Accessibility requirements
  - Technology stack quick reference
  - Code style standards
  - Common patterns and templates
  - Security headers
  - Privacy-preserving analytics
  - Notion integration
  - Testing patterns
  - Common mistakes to avoid

#### `.github/workflows/deploy.yml`
- **Purpose**: CI/CD pipeline
- **Content**: Automated testing and deployment workflow
- **Jobs**:
  - Lint & format check
  - Security audit
  - Unit tests
  - Accessibility tests
  - Build Workers
  - Deploy to staging
  - Deploy to production
  - Lighthouse performance tests

### AI Assistant Documentation

#### `.ai/README.md`
- **Purpose**: Main AI assistant instructions and quick reference
- **Content**:
  - Quick start guide
  - Critical principles (Privacy, Security, Accessibility)
  - Technology stack overview
  - Common tasks & patterns
  - Testing guidelines
  - Environment variables
  - Common mistakes
  - Getting help resources

#### `.ai/project-context.md`
- **Purpose**: Comprehensive project background and context
- **Content**:
  - Executive summary
  - Organization profile and mission
  - Areas of expertise
  - Website purpose and audiences
  - Critical success factors
  - Technical strategy
  - Content strategy
  - Legal & ethical considerations
  - Risk considerations
  - Future roadmap

#### `.ai/tech-stack.md`
- **Purpose**: Detailed technical architecture documentation
- **Content**:
  - Architecture diagram
  - Technology stack details
  - Frontend layer (Super.so, HTML/CSS/JS)
  - Content management (Notion)
  - Infrastructure (Cloudflare)
  - Cloudflare Workers development
  - KV storage patterns
  - Development tools
  - Security architecture
  - Performance optimization
  - Disaster recovery

### Development Configuration

#### `package.json`
- **Purpose**: Node.js project configuration
- **Content**:
  - Project metadata
  - Scripts for development, testing, deployment
  - Dependencies (Cloudflare Workers, Notion, testing tools)
  - Jest configuration
  - Lint-staged hooks

#### `wrangler.toml.example`
- **Purpose**: Cloudflare Workers configuration template
- **Content**:
  - Account and project settings
  - KV namespace bindings
  - Environment variables
  - Environment-specific configs (dev, staging, production)
  - Secrets documentation

#### `.eslintrc.cjs`
- **Purpose**: ESLint code quality configuration
- **Content**:
  - Error prevention rules
  - Best practices
  - Security rules
  - Code quality metrics
  - Async/await patterns
  - Workers-specific rules

#### `.prettierrc`
- **Purpose**: Code formatting configuration
- **Content**:
  - Consistent code style
  - File-specific overrides
  - Markdown and JSON formatting

#### `.gitignore`
- **Purpose**: Git ignore patterns
- **Content**:
  - Node modules
  - Environment variables
  - Build outputs
  - IDE files
  - Secrets

### Project Documentation

#### `README.md` (Project root)
- **Purpose**: Main project documentation
- **Content**:
  - Project overview
  - Mission and values
  - Technical architecture diagram
  - Features
  - Getting started guide
  - Project structure
  - Contributing guidelines
  - Privacy & security info
  - Accessibility statement
  - Performance targets
  - License and disclaimer

### Example Workers

#### `cloudflare/workers/index.js`
- **Purpose**: Main Worker entry point
- **Content**:
  - Request routing
  - Error handling
  - Security headers application
  - Integration with other Workers

#### `cloudflare/workers/seo-automation.js`
- **Purpose**: SEO automation Worker
- **Content**:
  - robots.txt generation
  - sitemap.xml generation from Notion
  - XML escaping utilities
  - Caching strategy

#### `cloudflare/workers/geo-optimization.js`
- **Purpose**: AI crawler optimization
- **Content**:
  - llms.txt generation
  - llms-full.txt generation
  - Comprehensive AI guidance
  - Entity relationships

#### `cloudflare/workers/security.js`
- **Purpose**: Security headers module
- **Content**:
  - Security headers configuration
  - CSP policy management
  - CORS headers (when needed)
  - HTTPS enforcement
  - Download security

## Key Principles Embedded in All Configurations

### 1. Privacy First
- **Never** log PII
- **Never** use third-party tracking
- **Always** encrypt sensitive data
- **Always** provide anonymous options
- **Always** minimize data collection

### 2. Security by Default
- **Always** validate inputs
- **Always** add security headers
- **Always** use HTTPS
- **Always** implement rate limiting
- **Never** expose sensitive information in errors

### 3. Accessibility Required
- **Always** meet WCAG 2.1 AA standards
- **Always** use semantic HTML
- **Always** provide ARIA labels
- **Always** support keyboard navigation
- **Always** ensure color contrast

### 4. Performance Matters
- **Always** cache appropriately
- **Always** minimize dependencies
- **Always** optimize for edge execution
- **Target**: <3s page load, <50ms Worker execution

## How AI Assistants Should Use These Files

### Initial Understanding
1. Read `.ai/README.md` for quick overview
2. Read `.ai/project-context.md` for background
3. Read `.ai/tech-stack.md` for technical details
4. Review IDE-specific config (`.cursorrules`, `.clinerules`, etc.)

### During Development
- **Before suggesting code**: Check privacy/security requirements
- **When generating UI**: Verify accessibility compliance
- **When working with data**: Ensure no PII logging
- **When adding dependencies**: Verify necessity and security
- **When writing Workers**: Follow Cloudflare best practices

### Code Review Checklist
- [ ] Privacy: No PII logging
- [ ] Security: Headers and validation present
- [ ] Accessibility: WCAG 2.1 AA compliant
- [ ] Performance: Optimized and cached
- [ ] Tests: Coverage and quality
- [ ] Documentation: Clear and complete

## Maintenance

### Updating Configurations
- Review quarterly for accuracy
- Update when technology stack changes
- Incorporate lessons learned
- Add new patterns as discovered

### Version Control
- All configs in Git
- Track changes with meaningful commits
- Review changes in PRs
- Document breaking changes

## Support

### Questions About Config
- Review relevant `.ai/*.md` file
- Check IDE-specific config
- Consult project documentation in `/docs`
- Open GitHub issue if unclear

### Improving Configs
- Suggest improvements via PR
- Document reasoning in PR description
- Ensure backward compatibility
- Update related files together

## Summary

These configuration files ensure that AI coding assistants:

1. **Understand the Mission**: Legal advocacy platform serving vulnerable individuals
2. **Respect Privacy**: Never compromise user anonymity or privacy
3. **Prioritize Security**: Security is non-negotiable
4. **Ensure Accessibility**: Everyone deserves access to justice resources
5. **Follow Best Practices**: Modern, efficient, well-tested code
6. **Maintain Quality**: Consistent style, comprehensive tests, clear documentation

By providing comprehensive context and clear guidelines, these files enable AI assistants to generate code that aligns with the project's critical values and technical requirements.

---

**Last Updated**: 2025-10-03
**Maintained By**: MISJustice Alliance Development Team
**License**: Apache 2.0

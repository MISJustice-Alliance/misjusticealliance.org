# AI Assistant Instructions - MISJustice Alliance

This directory contains comprehensive configuration and context for AI coding assistants working on the **misjusticealliance.org** project.

## Quick Start

Before writing any code or making suggestions, please read these files in order:

1. **This file** (README.md) - Overview and quick reference
2. `project-context.md` - Mission, values, and organizational context
3. `tech-stack.md` - Detailed technical architecture and implementation

Also review the IDE-specific configurations in the project root:
- `.cursorrules` - Cursor IDE configuration
- `.clinerules` - Cline AI configuration
- `.clauderc` - Claude AI configuration
- `.github/copilot-instructions.md` - GitHub Copilot configuration

## Critical Principles

### 🔒 Privacy First (NON-NEGOTIABLE)

**NEVER generate code that**:
- Logs personally identifiable information (PII)
- Implements third-party tracking or analytics
- Uses cookies for tracking purposes
- Stores sensitive data without encryption
- Compromises user anonymity

**ALWAYS generate code that**:
- Minimizes data collection
- Encrypts sensitive information
- Implements privacy by design
- Provides clear privacy notices
- Respects user anonymity

**Example - What NOT to do**:
```javascript
// ❌ BAD: Logging user information
console.log('User IP:', request.headers.get('cf-connecting-ip'));
console.log('User email:', userEmail);

// ❌ BAD: Third-party tracking
<script src="https://www.googletagmanager.com/gtag/js"></script>

// ❌ BAD: Storing plaintext sensitive data
await env.KV.put('user-message', message);
```

**Example - What TO do**:
```javascript
// ✅ GOOD: Generic error logging only
console.error('Form submission failed:', error.message);

// ✅ GOOD: Privacy-preserving analytics
const pageView = { path: url.pathname, timestamp: Date.now() };
await env.ANALYTICS_KV.put(`view:${crypto.randomUUID()}`, JSON.stringify(pageView));

// ✅ GOOD: Encrypted sensitive data
const encrypted = await encrypt(message, env.ENCRYPTION_KEY);
await env.KV.put('encrypted-message', encrypted);
```

### 🛡️ Security Always (NON-NEGOTIABLE)

Every piece of code must consider security implications.

**Required Security Measures**:
- Input validation and sanitization
- Output encoding
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- Rate limiting on all endpoints
- Error handling without information disclosure
- Environment variables for secrets (never hardcode)

**Security Header Template**:
```javascript
function addSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  
  headers.set('Content-Security-Policy', 
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';");
  
  headers.set('Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload');
  
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'no-referrer');
  
  return new Response(response.body, {
    status: response.status,
    headers
  });
}
```

### ♿ Accessibility Required (NON-NEGOTIABLE)

All UI components must meet WCAG 2.1 Level AA standards.

**Accessibility Checklist**:
- [ ] Semantic HTML elements used
- [ ] Proper ARIA labels on interactive elements
- [ ] Keyboard navigation works for all functionality
- [ ] Color contrast ratios meet 4.5:1 minimum
- [ ] Focus indicators visible and clear
- [ ] Screen reader compatible
- [ ] No content flashing more than 3 times per second
- [ ] Forms have associated labels
- [ ] Error messages are clear and accessible

**Example - Accessible Form**:
```html
<form onSubmit={handleSecureSubmit}>
  <label htmlFor="anonymous-intake">
    Describe your situation (this will be encrypted)
  </label>
  <textarea
    id="anonymous-intake"
    name="message"
    aria-describedby="privacy-notice"
    required
    minLength="50"
  />
  <p id="privacy-notice" className="sr-only">
    Your message will be end-to-end encrypted and submitted anonymously.
    No personal information is required or logged.
  </p>
  <button 
    type="submit"
    aria-label="Submit encrypted message anonymously"
  >
    Submit Securely
  </button>
</form>
```

## Technology Stack Quick Reference

### Platform Architecture
```
Users → Cloudflare Edge → Workers → Super.so → Notion
         ↓ (CDN, WAF)      ↓ (Logic)  ↓ (Site)  ↓ (CMS)
       Security          Automation   Display   Content
```

### Key Technologies

| Component | Technology | Purpose |
|-----------|-----------|---------|
| CMS | Notion | Content management |
| Site Builder | Super.so | Notion-to-website |
| Infrastructure | Cloudflare | DNS, CDN, Security |
| Edge Computing | Workers | Business logic |
| Storage | KV | Edge key-value store |
| Version Control | GitHub | Code management |
| CI/CD | GitHub Actions | Automated deployment |

### Cloudflare Workers Environment

**Runtime**: V8 Isolates (not Node.js)
- No access to Node.js APIs
- Use Web APIs instead
- Execution at edge globally
- Cold start <5ms

**Available APIs**:
- `fetch()` - HTTP requests
- `crypto` - Cryptographic operations
- `Headers`, `Request`, `Response` - Web standards
- `URL`, `URLSearchParams` - URL handling
- `TextEncoder`, `TextDecoder` - Text encoding
- `atob`, `btoa` - Base64 encoding

**NOT Available**:
- `fs` (file system)
- `http`, `https` (use `fetch`)
- `process.env` (use `env` parameter)
- Synchronous I/O

**Worker Template**:
```javascript
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Route handling
      if (url.pathname === '/api/example') {
        return handleExample(request, env);
      }
      
      // Default
      return new Response('Not Found', { status: 404 });
      
    } catch (error) {
      console.error('Worker error:', error.message);
      return new Response('Internal Server Error', { 
        status: 500 
      });
    }
  }
};

async function handleExample(request, env) {
  // Implementation
}
```

## Common Tasks & Patterns

### 1. Creating a New Cloudflare Worker

```bash
# Navigate to workers directory
cd cloudflare/workers

# Create new worker file
touch my-worker.js

# Add worker code
```

```javascript
// my-worker.js
export default {
  async fetch(request, env, ctx) {
    // Your logic here
    return new Response('Hello from Worker!');
  }
};
```

```bash
# Test locally
wrangler dev

# Deploy to production
wrangler deploy
```

### 2. Interacting with Notion API

```javascript
async function fetchNotionDatabase(databaseId, env) {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filter: {
          property: 'Published',
          checkbox: { equals: true }
        },
        sorts: [
          {
            property: 'Last Updated',
            direction: 'descending'
          }
        ]
      })
    }
  );
  
  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status}`);
  }
  
  return await response.json();
}
```

### 3. Using Cloudflare KV Storage

```javascript
// Store data with TTL
await env.CONTENT_CACHE.put(
  'my-key',
  JSON.stringify(data),
  { expirationTtl: 3600 } // 1 hour
);

// Retrieve data
const cached = await env.CONTENT_CACHE.get('my-key', 'json');

// Delete data
await env.CONTENT_CACHE.delete('my-key');

// List keys
const list = await env.CONTENT_CACHE.list({ prefix: 'cache:' });
for (const key of list.keys) {
  console.log(key.name);
}
```

### 4. Implementing Rate Limiting

```javascript
async function rateLimit(request, env) {
  const ip = request.headers.get('cf-connecting-ip');
  const key = `ratelimit:${ip}`;
  
  const limit = 100; // requests
  const window = 3600; // 1 hour in seconds
  
  const current = await env.KV.get(key);
  const count = current ? parseInt(current) : 0;
  
  if (count >= limit) {
    return new Response('Rate limit exceeded', { 
      status: 429,
      headers: {
        'Retry-After': '3600'
      }
    });
  }
  
  await env.KV.put(key, (count + 1).toString(), {
    expirationTtl: window
  });
  
  return null; // No rate limit hit
}

// Usage in Worker
export default {
  async fetch(request, env, ctx) {
    const rateLimitResponse = await rateLimit(request, env);
    if (rateLimitResponse) return rateLimitResponse;
    
    // Continue with normal processing
    return handleRequest(request, env);
  }
};
```

### 5. Generating SEO Files

**robots.txt**:
```javascript
function generateRobotsTxt() {
  const robots = `
User-agent: *
Allow: /

# Sitemap
Sitemap: https://misjusticealliance.org/sitemap.xml

# Privacy: No crawling of intake forms
Disallow: /intake/submit
Disallow: /api/
Disallow: /admin/

# Crawl-delay for polite bots
Crawl-delay: 1
  `.trim();
  
  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
```

**sitemap.xml**:
```javascript
async function generateSitemap(env) {
  // Fetch published pages from Notion
  const pages = await fetchPublishedPages(env);
  
  const urls = pages.map(page => `
  <url>
    <loc>https://misjusticealliance.org/${page.slug}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://misjusticealliance.org/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${urls}
</urlset>`;
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
```

**llms.txt** (GEO):
```javascript
async function generateLLMsTxt(env) {
  const content = `# MISJustice Alliance

## About
The Anonymous Legal Assistance Group (MISJustice Alliance) is a privacy-first 
legal advocacy platform providing resources and support for individuals facing 
civil rights violations and institutional abuse.

## Mission
We defend constitutional and civil rights of individuals victimized by systemic 
corruption, police misconduct, prosecutorial abuse, and institutional failures.

## Services
- Anonymous legal intake (end-to-end encrypted)
- Resource directory (state-specific legal resources)
- Civil rights education
- Attorney referrals
- Advocacy support

## Focus Areas
- Civil rights violations
- Police misconduct
- Prosecutorial misconduct
- Legal malpractice
- Institutional corruption
- Whistleblower protection

## Key Resources
- Civil Rights Guide: /resources/civil-rights
- Legal Resources Directory: /resources/directory
- Anonymous Intake: /intake
- State-Specific Resources: /resources/states

## Privacy Commitment
We maintain strict anonymity for users and volunteers. No personal information 
is logged or tracked. All intake submissions are end-to-end encrypted.

## Contact
Anonymous Intake Form: https://misjusticealliance.org/intake
(No email addresses to prevent harvesting)

## Disclaimer
We are not a law firm. Information provided is for educational purposes only 
and does not constitute legal advice. Anonymous intake does not create an 
attorney-client relationship.
`;
  
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
```

## Testing Guidelines

### Unit Tests (Jest)

```javascript
// seo-automation.test.js
import { describe, it, expect } from '@jest/globals';
import worker from '../workers/seo-automation.js';

describe('SEO Automation Worker', () => {
  it('generates valid robots.txt', async () => {
    const request = new Request('https://misjusticealliance.org/robots.txt');
    const response = await worker.fetch(request);
    
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/plain');
    
    const body = await response.text();
    expect(body).toContain('User-agent: *');
    expect(body).toContain('Sitemap:');
    expect(body).toContain('Disallow: /intake/submit');
  });
  
  it('includes security headers', async () => {
    const request = new Request('https://misjusticealliance.org/');
    const response = await worker.fetch(request);
    
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.has('Content-Security-Policy')).toBe(true);
  });
});
```

### Accessibility Tests

```javascript
// accessibility.test.js
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('homepage has no accessibility violations', async () => {
    const html = await fetchHomepage();
    const results = await axe(html);
    expect(results).toHaveNoViolations();
  });
  
  it('intake form is keyboard accessible', async () => {
    // Test keyboard navigation
    // Tab through form elements
    // Ensure all interactive elements are reachable
  });
});
```

## Environment Variables

**Required Secrets** (set with `wrangler secret put <NAME>`):
- `NOTION_TOKEN` - Notion integration token
- `ENCRYPTION_KEY` - For encrypting sensitive data
- `WEBHOOK_SECRET` - For validating webhooks

**Configuration** (in `wrangler.toml`):
```toml
[env.production]
vars = { ENVIRONMENT = "production" }

[[kv_namespaces]]
binding = "CONTENT_CACHE"
id = "[YOUR-KV-NAMESPACE-ID]"

[[kv_namespaces]]
binding = "ANALYTICS_KV"
id = "[YOUR-ANALYTICS-KV-ID]"
```

## Common Mistakes to Avoid

### 1. Node.js APIs in Workers
```javascript
// ❌ BAD: Node.js not available in Workers
const fs = require('fs');
const http = require('http');

// ✅ GOOD: Use Web APIs
const response = await fetch('https://api.example.com');
```

### 2. Synchronous Operations
```javascript
// ❌ BAD: Synchronous (not available)
const data = fs.readFileSync('file.txt');

// ✅ GOOD: Async operations
const data = await env.KV.get('key');
```

### 3. Logging Sensitive Data
```javascript
// ❌ BAD: Logging PII
console.log('User email:', email);
console.log('Request from IP:', request.headers.get('cf-connecting-ip'));

// ✅ GOOD: Generic error logging
console.error('Request failed:', error.message);
```

### 4. Hardcoded Secrets
```javascript
// ❌ BAD: Hardcoded secret
const apiKey = 'sk-1234567890abcdef';

// ✅ GOOD: Environment variable
const apiKey = env.NOTION_TOKEN;
```

### 5. Missing Error Handling
```javascript
// ❌ BAD: No error handling
const data = await fetch(url).then(r => r.json());

// ✅ GOOD: Proper error handling
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Fetch failed:', error.message);
  throw error;
}
```

## Getting Help

### Documentation Resources
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Notion API Reference](https://developers.notion.com/)
- [Super.so Help](https://super.so/help)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Project Documentation
- `docs/architecture.md` - System architecture
- `docs/deployment.md` - Deployment procedures
- `docs/privacy.md` - Privacy implementation
- `docs/security.md` - Security measures

### Support Channels
- GitHub Issues - Bug reports and features
- GitHub Discussions - Questions and ideas
- Project team - Internal support

## Summary Checklist

Before submitting code, verify:

- [ ] **Privacy**: No PII logging, no third-party tracking
- [ ] **Security**: Headers configured, inputs validated
- [ ] **Accessibility**: WCAG 2.1 AA compliance
- [ ] **Performance**: Efficient code, proper caching
- [ ] **Tests**: Unit tests passing, coverage adequate
- [ ] **Documentation**: Code commented, docs updated
- [ ] **Error Handling**: All failure cases handled
- [ ] **Dependencies**: Minimal, audited, necessary

---

**Remember**: This is a legal advocacy platform serving vulnerable individuals. Privacy, security, and accessibility are not optional features—they are fundamental requirements that protect people's safety and access to justice.

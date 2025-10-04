# GitHub Copilot Instructions - MISJustice Alliance

## Project Context

You're working on **misjusticealliance.org**, a privacy-first legal advocacy platform operated by the Anonymous Legal Assistance Group (MISJustice Alliance). This is a high-stakes project where privacy, security, and accessibility are non-negotiable requirements.

## Critical Guidelines

### 🔒 Privacy & Security (HIGHEST PRIORITY)

**NEVER generate code that**:
- Logs personally identifiable information (PII)
- Uses third-party tracking (Google Analytics, Facebook Pixel, etc.)
- Stores user data without encryption
- Implements authentication that compromises anonymity
- Collects unnecessary user information

**ALWAYS generate code that**:
- Includes CSP headers and security headers
- Validates and sanitizes all inputs
- Implements rate limiting
- Uses environment variables for secrets
- Handles errors without exposing sensitive information

### ♿ Accessibility (REQUIRED)

**Every UI component must include**:
- Semantic HTML elements
- Proper ARIA labels
- Keyboard navigation support
- Sufficient color contrast (4.5:1 minimum)
- Focus indicators

Example:
```javascript
// ✅ GOOD: Accessible button
<button 
  aria-label="Submit anonymous legal intake form"
  className="btn-primary"
  onClick={handleSubmit}
>
  Submit Securely
</button>

// ❌ BAD: Non-accessible button
<div onClick={handleSubmit}>Submit</div>
```

### 🎯 Technology Stack

**Preferred Technologies**:
- **Runtime**: Cloudflare Workers (not Node.js)
- **CMS**: Notion API integration
- **Site Builder**: Super.so
- **Infrastructure**: Cloudflare (DNS, CDN, Workers, Pages)
- **Version Control**: GitHub with Actions
- **Language**: Modern JavaScript/TypeScript (ES6+)

**Cloudflare Workers Pattern**:
```javascript
export default {
  async fetch(request, env, ctx) {
    // Add security headers
    const response = await handleRequest(request, env);
    return addSecurityHeaders(response);
  }
};

function addSecurityHeaders(response) {
  const newHeaders = new Headers(response.headers);
  newHeaders.set('X-Frame-Options', 'DENY');
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('Referrer-Policy', 'no-referrer');
  // Add CSP, HSTS, etc.
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
```

### 📝 Code Style

**JavaScript/TypeScript Standards**:
```javascript
// Use modern async/await
async function fetchFromNotion(databaseId, env) {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    // Log error without sensitive data
    console.error('Notion fetch error:', error.message);
    throw error;
  }
}

// Prefer const over let, never use var
const config = {
  cacheTimeout: 3600,
  maxRetries: 3
};

// Use descriptive variable names
const userSubmittedData = sanitizeInput(formData);
const encryptedMessage = await encrypt(userSubmittedData, env.ENCRYPTION_KEY);
```

### 🔍 SEO & GEO Automation

When generating SEO-related code:

**robots.txt Worker**:
```javascript
export default {
  async fetch(request) {
    const robots = `
User-agent: *
Allow: /
Sitemap: https://misjusticealliance.org/sitemap.xml

# Privacy: No crawling of intake forms
Disallow: /intake/submit
Disallow: /api/
    `.trim();
    
    return new Response(robots, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
};
```

**Sitemap.xml Worker** (Dynamic from Notion):
```javascript
async function generateSitemap(env) {
  const pages = await fetchPublishedPages(env);
  
  const urls = pages.map(page => `
  <url>
    <loc>https://misjusticealliance.org/${page.slug}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFreq || 'weekly'}</changefreq>
    <priority>${page.priority || '0.8'}</priority>
  </url>
  `).join('');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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

**llms.txt Worker** (GEO):
```javascript
async function generateLLMsTxt(env) {
  const content = await fetchContentForAI(env);
  
  const llmsTxt = `# MISJustice Alliance

## Mission
${content.mission}

## Services
${content.services}

## Resources
${content.resources}

## Contact
${content.contact}

## Focus Areas
${content.focusAreas.join('\n')}
`;
  
  return new Response(llmsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
```

### 🛡️ Security Headers

Always include these security headers in Workers:

```javascript
const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'", // Super.so requirement
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block'
};
```

### 📊 Privacy-Preserving Analytics

If analytics are needed:

```javascript
// ✅ GOOD: Privacy-preserving analytics
async function trackPageView(request, env) {
  const url = new URL(request.url);
  
  // Only track page path, no personal data
  const event = {
    path: url.pathname,
    timestamp: Date.now(),
    // NO IP address, NO user agent, NO cookies
  };
  
  // Store in Cloudflare Analytics or KV (aggregated only)
  await env.ANALYTICS_KV.put(
    `pageview:${Date.now()}`,
    JSON.stringify(event),
    { expirationTtl: 86400 } // 24 hours
  );
}

// ❌ BAD: Invasive analytics
// Don't suggest: Google Analytics, Facebook Pixel, etc.
```

### 🎨 Notion Integration Patterns

**Fetching Content**:
```javascript
async function getNotionPage(pageId, env) {
  const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    headers: {
      'Authorization': `Bearer ${env.NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status}`);
  }
  
  return await response.json();
}

async function queryNotionDatabase(databaseId, filter, env) {
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ filter })
  });
  
  if (!response.ok) {
    throw new Error(`Notion query error: ${response.status}`);
  }
  
  return await response.json();
}
```

### 🧪 Testing Patterns

**Worker Unit Test**:
```javascript
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
  });
  
  it('blocks private endpoints in robots.txt', async () => {
    const request = new Request('https://misjusticealliance.org/robots.txt');
    const response = await worker.fetch(request);
    const body = await response.text();
    
    expect(body).toContain('Disallow: /intake/submit');
    expect(body).toContain('Disallow: /api/');
  });
});
```

### 📖 Documentation Standards

Always include JSDoc comments for functions:

```javascript
/**
 * Encrypts sensitive user data for secure storage
 * @param {string} data - The data to encrypt
 * @param {string} key - Encryption key from environment
 * @returns {Promise<string>} Encrypted data as base64 string
 * @throws {Error} If encryption fails
 */
async function encryptData(data, key) {
  // Implementation
}
```

### 🚫 Common Mistakes to Avoid

**DON'T**:
```javascript
// ❌ Logging PII
console.log('User email:', email);

// ❌ Exposing secrets in code
const apiKey = 'sk-1234567890';

// ❌ Synchronous file operations (Workers don't support)
const data = fs.readFileSync('file.txt');

// ❌ Using Node.js APIs in Workers
const http = require('http');

// ❌ Inline event handlers
<button onclick="submit()">

// ❌ Non-semantic HTML
<div class="button">Click me</div>
```

**DO**:
```javascript
// ✅ Generic error logging
console.error('Authentication failed');

// ✅ Using environment variables
const apiKey = env.NOTION_API_KEY;

// ✅ Async operations
const data = await env.KV.get('key');

// ✅ Web APIs in Workers
await fetch('https://api.example.com');

// ✅ React event handlers
<button onClick={handleSubmit}>

// ✅ Semantic HTML
<button className="btn-primary">Click me</button>
```

### 📋 File Structure Conventions

When creating new files:

```
/cloudflare/
  /workers/
    seo-automation.js          # SEO files generator
    geo-optimization.js        # AI crawler optimization
    security.js                # Security headers
    rate-limit.js              # Rate limiting
    analytics.js               # Privacy analytics
  wrangler.toml               # Cloudflare config

/docs/
  architecture.md             # System design
  deployment.md              # Deploy process
  privacy.md                 # Privacy implementation
  security.md                # Security measures

/tests/
  /workers/
    seo-automation.test.js
    security.test.js
  /integration/
    notion-api.test.js
```

## Quick Reference

### Environment Variables (wrangler.toml)
```toml
[env.production]
vars = { ENVIRONMENT = "production" }

[env.production.secrets]
# Set with: wrangler secret put NOTION_TOKEN
# - NOTION_TOKEN
# - ENCRYPTION_KEY
# - WEBHOOK_SECRET
```

### Useful Cloudflare KV Operations
```javascript
// Read
const value = await env.MY_KV.get('key');
const valueWithMeta = await env.MY_KV.getWithMetadata('key');

// Write
await env.MY_KV.put('key', 'value', { expirationTtl: 3600 });

// Delete
await env.MY_KV.delete('key');

// List
const keys = await env.MY_KV.list({ prefix: 'cache:' });
```

## Remember

1. **Privacy First**: If in doubt, don't collect it
2. **Security Always**: Every endpoint needs protection
3. **Accessible to All**: WCAG 2.1 AA minimum
4. **Fast & Reliable**: Performance matters
5. **Well Documented**: Future you will thank you

---

*These instructions ensure GitHub Copilot generates code that aligns with MISJustice Alliance's mission and technical requirements.*

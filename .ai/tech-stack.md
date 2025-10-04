# MISJustice Alliance - Technical Stack Documentation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER LAYER                          │
│  (Browsers, Screen Readers, Mobile Devices, Tor Users)      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     CLOUDFLARE EDGE                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  CDN (Global Cache)                                   │  │
│  │  WAF (Web Application Firewall)                       │  │
│  │  DDoS Protection                                      │  │
│  │  SSL/TLS (Automatic HTTPS)                            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  CLOUDFLARE WORKERS (Edge Computing)                  │  │
│  │  ├─ SEO Automation (robots.txt, sitemap.xml)         │  │
│  │  ├─ GEO Optimization (llms.txt)                       │  │
│  │  ├─ Security Headers (CSP, HSTS, etc.)               │  │
│  │  ├─ Rate Limiting                                     │  │
│  │  ├─ Privacy Analytics                                 │  │
│  │  └─ Custom Business Logic                            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  KV STORAGE (Edge Key-Value Store)                    │  │
│  │  ├─ Content Cache                                     │  │
│  │  ├─ SEO Data                                          │  │
│  │  └─ Configuration                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      CONTENT LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  SUPER.SO (Notion-to-Website)                         │  │
│  │  ├─ Website Generation                                │  │
│  │  ├─ Custom Domain Mapping                             │  │
│  │  ├─ SEO Optimization                                  │  │
│  │  └─ Custom Styling                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  NOTION (Headless CMS)                                │  │
│  │  ├─ Content Databases                                 │  │
│  │  ├─ Resource Library                                  │  │
│  │  ├─ FAQ System                                        │  │
│  │  └─ Collaborative Editing                             │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   DEVELOPMENT LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  GITHUB                                               │  │
│  │  ├─ Version Control                                   │  │
│  │  ├─ CI/CD (GitHub Actions)                            │  │
│  │  ├─ Code Review                                       │  │
│  │  └─ Documentation                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack Details

### Frontend Layer

#### Super.so
- **Purpose**: Notion-to-website conversion
- **Version**: Latest stable
- **Features Used**:
  - Custom domain mapping (misjusticealliance.org)
  - SEO optimization
  - Social media previews
  - Custom CSS
  - Mobile responsiveness
- **Configuration**:
  ```yaml
  Domain: misjusticealliance.org
  Notion Workspace: [Connected]
  SEO: Enabled
  Analytics: Privacy-preserving only
  Custom CSS: Brand styling
  ```

#### HTML/CSS/JavaScript
- **Standards**: HTML5, CSS3, ES6+
- **Frameworks**: None (vanilla for performance)
- **Libraries**:
  - No jQuery (native DOM APIs)
  - No React/Vue on frontend (Super.so handles)
  - Minimal dependencies

#### Styling Approach
```css
/* Mobile-first responsive design */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }

/* Accessibility-focused */
:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* High contrast support */
@media (prefers-contrast: high) {
  /* Enhanced contrast styles */
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

### Content Management Layer

#### Notion (Headless CMS)
- **Version**: Latest API (2022-06-28)
- **API Base**: https://api.notion.com/v1
- **Authentication**: Bearer token (Integration)
- **Rate Limits**: 3 requests per second

**Database Structures**:

1. **Pages Database**
   ```json
   {
     "properties": {
       "Title": { "type": "title" },
       "Slug": { "type": "rich_text" },
       "Content": { "type": "rich_text" },
       "Published": { "type": "checkbox" },
       "SEO Title": { "type": "rich_text" },
       "SEO Description": { "type": "rich_text" },
       "Tags": { "type": "multi_select" },
       "Category": { "type": "select" },
       "Last Updated": { "type": "last_edited_time" }
     }
   }
   ```

2. **Resources Database**
   ```json
   {
     "properties": {
       "Name": { "type": "title" },
       "Type": { "type": "select" },
       "Description": { "type": "rich_text" },
       "URL": { "type": "url" },
       "State": { "type": "select" },
       "Verified": { "type": "checkbox" },
       "Last Verified": { "type": "date" }
     }
   }
   ```

3. **FAQ Database**
   ```json
   {
     "properties": {
       "Question": { "type": "title" },
       "Answer": { "type": "rich_text" },
       "Category": { "type": "select" },
       "Keywords": { "type": "multi_select" },
       "Order": { "type": "number" }
     }
   }
   ```

**API Integration**:
```javascript
// Notion API request pattern
async function queryDatabase(databaseId, filter, env) {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filter })
    }
  );
  
  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status}`);
  }
  
  return await response.json();
}
```

### Infrastructure Layer

#### Cloudflare
- **DNS**: Cloudflare managed DNS
- **CDN**: Global edge network (200+ locations)
- **SSL/TLS**: Universal SSL (automatic)
- **Security**: WAF, DDoS protection, Bot management
- **Performance**: Argo Smart Routing, Railgun

**Cloudflare Configuration**:
```yaml
DNS:
  Type: CNAME
  Name: misjusticealliance.org
  Target: [Super.so endpoint]
  Proxy: Enabled
  
SSL/TLS:
  Mode: Full (strict)
  HSTS: Enabled
  Min TLS Version: 1.2
  
Security:
  WAF: Enabled
  DDoS: Automatic
  Bot Fight Mode: Enabled
  Security Level: High
  
Performance:
  Caching Level: Standard
  Browser Cache TTL: 4 hours
  Auto Minify: JS, CSS, HTML
  Brotli Compression: Enabled
```

#### Cloudflare Workers
- **Runtime**: V8 Isolates (not Node.js)
- **Language**: JavaScript (ES6+) / TypeScript
- **Execution**: Edge (distributed globally)
- **Cold Start**: <5ms
- **Max CPU Time**: 50ms (can be extended)
- **Memory**: 128MB

**Worker Types & Purposes**:

1. **SEO Automation Worker** (`seo-automation.js`)
   ```javascript
   // Routes
   GET /robots.txt → Generate robots.txt
   GET /sitemap.xml → Generate sitemap.xml
   
   // Features
   - Dynamic robots.txt generation
   - Sitemap from Notion database
   - Automatic updates
   - CDN caching (1 hour)
   ```

2. **GEO Optimization Worker** (`geo-optimization.js`)
   ```javascript
   // Routes
   GET /llms.txt → AI crawler guidance
   GET /llms-full.txt → Comprehensive AI mapping
   
   // Features
   - Structure content for LLMs
   - Entity relationship mapping
   - Fact-based organization
   - Update with content changes
   ```

3. **Security Headers Worker** (`security.js`)
   ```javascript
   // Applied to all requests
   - Content-Security-Policy
   - Strict-Transport-Security
   - X-Frame-Options
   - X-Content-Type-Options
   - Referrer-Policy
   - Permissions-Policy
   ```

4. **Rate Limiting Worker** (`rate-limit.js`)
   ```javascript
   // Protection
   - Request rate limiting
   - IP-based throttling
   - Abuse prevention
   - Configurable limits
   ```

5. **Privacy Analytics Worker** (`analytics.js`)
   ```javascript
   // Privacy-preserving metrics
   - Page view counts (no PII)
   - Aggregate statistics only
   - No user tracking
   - No cookies
   ```

**Worker Development Setup**:
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create new Worker
wrangler init my-worker

# Test locally
wrangler dev

# Deploy to production
wrangler deploy
```

**wrangler.toml Configuration**:
```toml
name = "misjustice-alliance"
main = "src/index.js"
compatibility_date = "2024-01-01"

[env.production]
name = "misjustice-alliance-prod"
vars = { ENVIRONMENT = "production" }
route = { pattern = "misjusticealliance.org/*", zone_name = "misjusticealliance.org" }

[[kv_namespaces]]
binding = "CONTENT_CACHE"
id = "[KV Namespace ID]"

[env.production.secrets]
# Set with: wrangler secret put SECRET_NAME
# NOTION_TOKEN
# ENCRYPTION_KEY
```

#### Cloudflare KV (Key-Value Storage)
- **Type**: Eventually consistent, global edge storage
- **Latency**: <50ms reads (globally)
- **Capacity**: Unlimited keys, 25MB per value
- **TTL**: Configurable per key

**KV Usage Patterns**:
```javascript
// Cache Notion content
await env.CONTENT_CACHE.put(
  `page:${pageId}`,
  JSON.stringify(content),
  { expirationTtl: 3600 } // 1 hour
);

// Retrieve cached content
const cached = await env.CONTENT_CACHE.get(`page:${pageId}`, 'json');

// Delete cached content
await env.CONTENT_CACHE.delete(`page:${pageId}`);

// List keys with prefix
const list = await env.CONTENT_CACHE.list({ prefix: 'page:' });
```

### Development Layer

#### GitHub
- **Repository**: misjusticealliance.org
- **Branch Strategy**: Git Flow
  - `main` (production)
  - `develop` (staging)
  - `feature/*` (features)
  - `fix/*` (bug fixes)
  - `hotfix/*` (urgent production fixes)

**Repository Structure**:
```
/
├── .ai/                     # AI configuration
├── .github/                 # GitHub-specific
│   ├── workflows/          # CI/CD pipelines
│   ├── ISSUE_TEMPLATE/     # Issue templates
│   └── copilot-instructions.md
├── cloudflare/             # Cloudflare Workers
│   ├── workers/           # Individual Workers
│   │   ├── seo-automation.js
│   │   ├── geo-optimization.js
│   │   ├── security.js
│   │   ├── rate-limit.js
│   │   └── analytics.js
│   ├── tests/             # Worker tests
│   └── wrangler.toml      # Cloudflare config
├── docs/                   # Documentation
│   ├── architecture.md
│   ├── deployment.md
│   ├── privacy.md
│   └── security.md
├── notion/                 # Notion configs
│   ├── databases/         # Database schemas
│   └── templates/         # Page templates
├── scripts/               # Automation scripts
│   ├── deploy.sh
│   └── backup.sh
├── tests/                 # Test suites
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .cursorrules           # Cursor AI config
├── .clinerules            # Cline AI config
├── .clauderc              # Claude AI config
├── .eslintrc.js           # ESLint config
├── .prettierrc            # Prettier config
├── .gitignore
├── LICENSE
├── README.md
└── package.json
```

#### CI/CD Pipeline (GitHub Actions)

**.github/workflows/deploy.yml**:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run test:accessibility
      - run: npm run test:security

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy
```

### Development Tools

#### Package Management
```json
{
  "name": "misjusticealliance-org",
  "version": "1.0.0",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:accessibility": "jest --testMatch='**/*.a11y.test.js'",
    "test:security": "npm audit && snyk test",
    "lint": "eslint . && prettier --check .",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.0.0",
    "eslint": "^8.0.0",
    "jest": "^29.0.0",
    "prettier": "^3.0.0",
    "wrangler": "^3.0.0",
    "axe-core": "^4.0.0",
    "snyk": "^1.0.0"
  }
}
```

#### Code Quality Tools

**ESLint Configuration** (`.eslintrc.js`):
```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    worker: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'error',
    'prefer-const': 'error',
  },
};
```

**Prettier Configuration** (`.prettierrc`):
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### Monitoring & Observability

#### Cloudflare Analytics
- **Metrics**: Requests, bandwidth, cache performance
- **Privacy**: No PII collection
- **Retention**: 30 days standard
- **Access**: Cloudflare Dashboard

#### Custom Metrics (KV-based)
```javascript
// Privacy-preserving page view tracking
async function trackPageView(url, env) {
  const date = new Date().toISOString().split('T')[0];
  const key = `pageview:${date}:${url.pathname}`;
  
  const current = await env.ANALYTICS_KV.get(key) || '0';
  const count = parseInt(current) + 1;
  
  await env.ANALYTICS_KV.put(key, count.toString(), {
    expirationTtl: 2592000 // 30 days
  });
}
```

## Security Architecture

### Defense in Depth

**Layer 1: Cloudflare Edge**
- DDoS mitigation (automatic)
- Bot protection
- Rate limiting
- WAF rules

**Layer 2: Cloudflare Workers**
- Input validation
- Output encoding
- Security headers
- Request authentication

**Layer 3: Application**
- Data encryption
- Access controls
- Secure session management
- Privacy by design

### Security Headers

```javascript
const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  
  'Strict-Transport-Security': 
    'max-age=31536000; includeSubDomains; preload',
  
  'X-Frame-Options': 'DENY',
  
  'X-Content-Type-Options': 'nosniff',
  
  'Referrer-Policy': 'no-referrer',
  
  'Permissions-Policy': [
    'geolocation=()',
    'microphone=()',
    'camera=()',
    'payment=()'
  ].join(', ')
};
```

## Performance Optimization

### Caching Strategy

```
User → Cloudflare CDN (Cache) → Workers → Notion API
       ↓ (cache hit)
       Response
```

**Cache Levels**:
1. **Browser Cache**: 1 hour
2. **CDN Cache**: 4 hours
3. **KV Cache**: 1 hour (Notion content)
4. **Notion**: Source of truth

**Cache Invalidation**:
- Manual purge on content update
- Webhook-triggered invalidation
- TTL-based expiration

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load Time | <3s | Lighthouse |
| First Contentful Paint | <1.8s | Core Web Vitals |
| Largest Contentful Paint | <2.5s | Core Web Vitals |
| Cumulative Layout Shift | <0.1 | Core Web Vitals |
| First Input Delay | <100ms | Core Web Vitals |
| Worker Execution | <50ms | Cloudflare Analytics |

## Disaster Recovery

### Backup Strategy
- **Notion Content**: Weekly exports (JSON)
- **Worker Code**: GitHub (version controlled)
- **Configuration**: GitHub (wrangler.toml)
- **KV Data**: Daily snapshots

### Rollback Procedures
1. Identify issue
2. Revert to last known good version
3. Deploy via GitHub Actions
4. Verify functionality
5. Monitor for issues

### Incident Response
1. **Detection**: Monitoring alerts
2. **Assessment**: Impact analysis
3. **Containment**: Disable affected components
4. **Eradication**: Fix root cause
5. **Recovery**: Restore service
6. **Lessons Learned**: Post-mortem

---

*This technical stack documentation provides a comprehensive reference for developers and AI assistants working on the MISJustice Alliance platform.*

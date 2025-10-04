/**
 * SEO Automation Worker for MISJustice Alliance
 * 
 * Automatically generates:
 * - robots.txt
 * - sitemap.xml (from Notion database)
 * 
 * Privacy: No PII logged. Only public URLs are included.
 */

/**
 * Handle SEO-related requests
 * @param {Request} request 
 * @param {Object} env - Environment variables
 * @returns {Response}
 */
export async function handleSEO(request, env) {
  const url = new URL(request.url);
  
  if (url.pathname === '/robots.txt') {
    return generateRobotsTxt();
  }
  
  if (url.pathname === '/sitemap.xml') {
    return await generateSitemap(env);
  }
  
  return new Response('Not Found', { status: 404 });
}

/**
 * Generate robots.txt file
 * @returns {Response}
 */
function generateRobotsTxt() {
  const robots = `# robots.txt for MISJustice Alliance
# Privacy-first legal advocacy platform

User-agent: *
Allow: /

# Sitemap location
Sitemap: https://misjusticealliance.org/sitemap.xml

# Privacy: No crawling of intake forms or sensitive areas
Disallow: /intake/submit
Disallow: /api/
Disallow: /admin/

# Rate limiting: Be polite
Crawl-delay: 1

# AI Crawlers - see llms.txt for guidance
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Googlebot
Allow: /
User-agent: Bingbot
Allow: /

# Block aggressive scrapers
User-agent: AhrefsBot
Crawl-delay: 10
User-agent: SemrushBot
Crawl-delay: 10
`.trim();

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex',
    },
  });
}

/**
 * Generate sitemap.xml from Notion database
 * @param {Object} env - Environment variables
 * @returns {Promise<Response>}
 */
async function generateSitemap(env) {
  try {
    // Check cache first
    const cached = await env.CONTENT_CACHE?.get('sitemap.xml');
    if (cached) {
      return new Response(cached, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'X-Cache': 'HIT',
        },
      });
    }

    // Fetch published pages from Notion
    const pages = await fetchPublishedPages(env);
    
    // Generate sitemap XML
    const sitemap = buildSitemapXML(pages);
    
    // Cache for 1 hour
    await env.CONTENT_CACHE?.put('sitemap.xml', sitemap, {
      expirationTtl: 3600,
    });

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error.message);
    
    // Return minimal sitemap on error
    return new Response(buildMinimalSitemap(), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }
}

/**
 * Fetch published pages from Notion
 * @param {Object} env - Environment variables
 * @returns {Promise<Array>}
 */
async function fetchPublishedPages(env) {
  if (!env.NOTION_TOKEN || !env.NOTION_DATABASE_ID) {
    throw new Error('Notion credentials not configured');
  }

  const response = await fetch(
    `https://api.notion.com/v1/databases/${env.NOTION_DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: 'Published',
          checkbox: {
            equals: true,
          },
        },
        sorts: [
          {
            property: 'Last Updated',
            direction: 'descending',
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status}`);
  }

  const data = await response.json();
  
  // Extract relevant page data
  return data.results.map((page) => ({
    slug: page.properties.Slug?.rich_text[0]?.plain_text || '',
    lastModified: page.last_edited_time,
    priority: page.properties.Priority?.number || 0.8,
    changeFreq: page.properties['Change Frequency']?.select?.name || 'weekly',
  })).filter((page) => page.slug); // Only include pages with slugs
}

/**
 * Build sitemap XML from pages
 * @param {Array} pages 
 * @returns {string}
 */
function buildSitemapXML(pages) {
  const baseUrl = 'https://misjusticealliance.org';
  
  const urls = [
    // Homepage - always include
    {
      loc: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0,
    },
    // Dynamic pages from Notion
    ...pages.map((page) => ({
      loc: `${baseUrl}/${page.slug}`,
      lastmod: page.lastModified,
      changefreq: page.changeFreq,
      priority: page.priority,
    })),
  ];

  const urlElements = urls
    .map(
      (url) => `  <url>
    <loc>${escapeXML(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

/**
 * Build minimal sitemap (fallback)
 * @returns {string}
 */
function buildMinimalSitemap() {
  const baseUrl = 'https://misjusticealliance.org';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/resources</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
}

/**
 * Escape XML special characters
 * @param {string} str 
 * @returns {string}
 */
function escapeXML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

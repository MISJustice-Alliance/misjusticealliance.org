/**
 * Main Cloudflare Worker for MISJustice Alliance
 * 
 * This worker routes requests to appropriate handlers and applies
 * security headers to all responses.
 * 
 * Privacy Notice: This worker does NOT log any PII.
 * Security: All responses include strict security headers.
 */

import { handleSEO } from './seo-automation.js';
import { handleGEO } from './geo-optimization.js';
import { addSecurityHeaders } from './security.js';

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Route handling
      let response;
      
      // SEO Routes
      if (url.pathname === '/robots.txt' || url.pathname === '/sitemap.xml') {
        response = await handleSEO(request, env);
      }
      // GEO Routes (AI crawler optimization)
      else if (url.pathname === '/llms.txt' || url.pathname === '/llms-full.txt') {
        response = await handleGEO(request, env);
      }
      // Default - pass through to Super.so
      else {
        response = await fetch(request);
      }
      
      // Add security headers to all responses
      return addSecurityHeaders(response);
      
    } catch (error) {
      // Log error without any PII
      console.error('Worker error:', {
        path: new URL(request.url).pathname,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
      
      // Return generic error response
      return addSecurityHeaders(
        new Response('Internal Server Error', {
          status: 500,
          headers: {
            'Content-Type': 'text/plain',
          },
        })
      );
    }
  },
};

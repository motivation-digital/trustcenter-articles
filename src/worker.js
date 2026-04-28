// trustcenter-articles — Articles platform for trustcenter.pro
// LCE-10000115

import { renderArticleListing, renderArticlePage } from './render-articles.js';

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html;charset=UTF-8' },
  });
}

const ALL_QUERY = `SELECT id, slug, title, excerpt, category, reading_time, published_at
  FROM articles WHERE status = 'published' ORDER BY published_at DESC`;

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      if (url.pathname === '/health') {
        return Response.json({ status: 'ok', worker: 'trustcenter-articles' });
      }

      // Default landing → General category
      if (url.pathname === '/articles' || url.pathname === '/articles/') {
        return Response.redirect(url.origin + '/articles/category/general', 302);
      }

      // All articles (explicit route for the sidebar link)
      if (url.pathname === '/articles/all') {
        const { results } = await env.DB.prepare(ALL_QUERY).all();
        return html(renderArticleListing(results || [], ''));
      }

      // Category listing
      const catMatch = url.pathname.match(/^\/articles\/category\/([a-z0-9-]+)\/?$/);
      if (catMatch) {
        const { results } = await env.DB.prepare(ALL_QUERY).all();
        return html(renderArticleListing(results || [], catMatch[1]));
      }

      // Article page
      const slugMatch = url.pathname.match(/^\/articles\/([a-z0-9-]+)\/?$/);
      if (slugMatch) {
        const slug = slugMatch[1];
        const article = await env.DB.prepare(
          `SELECT * FROM articles WHERE slug = ? AND status = 'published'`
        ).bind(slug).first();
        if (!article) {
          return html(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Not found | Trust Center</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
</head><body style="background:#0A0A0A;color:#E5E5E5;font-family:sans-serif;padding:80px 40px;text-align:center">
<h1 style="color:#F59F0A;font-weight:300">Article not found</h1>
<p><a href="/articles" style="color:#F59F0A">&larr; Back to articles</a></p>
</body></html>`, 404);
        }
        const { results: related } = await env.DB.prepare(
          `SELECT id, slug, title, excerpt, category, reading_time, published_at
           FROM articles WHERE status = 'published' AND category = ? AND slug != ?
           ORDER BY RANDOM() LIMIT 3`
        ).bind(article.category, slug).all();
        return html(renderArticlePage(article, related || []));
      }

      return new Response('Not found', { status: 404 });
    } catch (err) {
      return Response.json({ error: err.message }, { status: 500 });
    }
  },
};
// trustcenter-articles — Article renderers
// Trust Center brand (dark #08090B + amber #F59F0A), horizontal category nav
// LCE-10000115

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(s) {
  if (!s) return '';
  try { return new Date(s).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }); }
  catch { return s; }
}

const CATEGORY_LABELS = {
  gdpr: 'GDPR', ccpa: 'CCPA', cookies: 'Cookies',
  'privacy-policy': 'Privacy Policy', dsar: 'DSARs', general: 'General',
  usa: 'USA', canada: 'Canada', australia: 'Australia',
  eu: 'EU', uk: 'UK', accessibility: 'Accessibility',
  setup: 'Setup Guides', policy: 'Policy Guides', ecommerce: 'eCommerce',
  checklist: 'Checklists', 'data-breach': 'Data Breach', industry: 'Industry',
  services: 'Our Services',
};

const CATEGORIES = [
  // General & guides
  'general', 'services', 'setup', 'policy', 'checklist',
  // Policy types
  'gdpr', 'ccpa', 'privacy-policy', 'dsar', 'cookies',
  'data-breach', 'accessibility', 'ecommerce', 'industry',
  // Regions
  'uk', 'eu', 'usa', 'canada', 'australia',
];

function injectHeadingIds(html) {
  return html.replace(/<h2>([^<]+)<\/h2>/g, (_, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h2 id="${id}">${text}</h2>`;
  });
}

function extractToc(html) {
  const items = [];
  const re = /<h2[^>]*id="([^"]+)"[^>]*>([^<]+)<\/h2>/g;
  let m;
  while ((m = re.exec(html)) !== null) items.push({ id: m[1], text: m[2] });
  return items;
}

function catBadge(cat) {
  return `<span class="cat-badge">${esc(CATEGORY_LABELS[cat] || cat)}</span>`;
}

function articleCard(a) {
  const rt = a.reading_time || 4;
  const date = formatDate(a.published_at);
  return `<a href="/articles/${esc(a.slug)}" class="article-card">
  <div class="card-cat">${esc(CATEGORY_LABELS[a.category] || a.category)}</div>
  <h3 class="card-title">${esc(a.title)}</h3>
  <p class="card-excerpt">${esc(a.excerpt)}</p>
  <div class="card-meta">${rt} min read${date ? ` &middot; ${date}` : ''}</div>
</a>`;
}

function navHtml() {
  return `<nav class="nav" id="nav">
  <div class="nav-inner">
    <a href="/" style="display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:14px;color:#F5F7F4;letter-spacing:-0.01em;text-decoration:none">
      <span style="width:18px;height:18px;border-radius:4px;background:#F59F0A;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0">
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#08090B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
      </span>
      <span>trustcenter<span style="color:#F59F0A">.pro</span></span>
    </a>
    <div class="nav-links">
      <a href="/pricing" class="nav-link">Pricing</a>
      <a href="/articles" class="nav-link active">Articles</a>
      <a href="https://motivation.digital/trust-center/" class="nav-link" target="_blank" rel="noopener">Live demo</a>
      <a href="https://trustcenter.pro" class="nav-btn">Join waitlist &rarr;</a>
    </div>
  </div>
</nav>`;
}

function siteFooter() {
  return `<footer class="site-footer">
  <span>&copy; ${new Date().getFullYear()} Trust Center &mdash; A Motivation Group product</span>
  <a href="/articles">Articles</a>
</footer>`;
}

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">`;

const BASE = `
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;padding:0;background:#08090B;color:#E5E5E5;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:#F59F0A;text-decoration:none}a:hover{text-decoration:underline}

/* ── Nav ────────────────────────────────────────────────────────────────── */
.nav{position:sticky;top:0;z-index:200;background:rgba(8,9,11,0.96);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,0.06)}
.nav-inner{max-width:1280px;margin:0 auto;padding:0 40px;height:64px;display:flex;justify-content:space-between;align-items:center;gap:32px}
.nav-links{display:flex;align-items:center;gap:32px;font-size:13px}
.nav-link{color:#9AA1A8;transition:color 0.15s;white-space:nowrap;text-decoration:none}
.nav-link:hover{color:#F5F7F4;text-decoration:none}
.nav-link.active{color:#F5F7F4}
.nav-btn{background:#F59F0A;color:#08090B;border:none;padding:9px 16px;border-radius:7px;font-weight:700;font-size:12.5px;font-family:'JetBrains Mono',ui-monospace,monospace;white-space:nowrap;cursor:pointer;text-decoration:none;display:inline-block;transition:background 0.15s}
.nav-btn:hover{background:#FBBF24;text-decoration:none;color:#08090B}
@media(max-width:768px){.nav-inner{padding:0 20px;height:56px}.nav-links .nav-link:not(:last-child){display:none}}

/* ── Category bar ───────────────────────────────────────────────────────── */
.cat-bar{border-bottom:1px solid rgba(255,255,255,0.06);background:#08090B;position:sticky;top:64px;z-index:100}
.cat-bar-inner{max-width:1200px;margin:0 auto;padding:0 40px;display:flex;align-items:center;gap:4px;overflow-x:auto;scrollbar-width:none}
.cat-bar-inner::-webkit-scrollbar{display:none}
.cat-pill{display:inline-block;padding:10px 14px;font-size:13px;color:#5A6068;white-space:nowrap;border-bottom:2px solid transparent;transition:color 0.15s,border-color 0.15s;cursor:pointer;text-decoration:none;margin-bottom:-1px}
.cat-pill:hover{color:#E5E5E5;text-decoration:none}
.cat-pill.active{color:#F59F0A;border-bottom-color:#F59F0A;font-weight:500}

/* ── Page header ────────────────────────────────────────────────────────── */
.page-header{max-width:1200px;margin:0 auto;padding:40px 40px 28px;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap}
.page-header-left h1{font-size:22px;font-weight:600;color:#F5F7F4;margin:0 0 4px;letter-spacing:-0.01em}
.page-header-left p{font-size:13px;color:#5A6068;margin:0}
.search-wrap{position:relative;flex-shrink:0}
.search-wrap input{width:240px;padding:9px 14px 9px 36px;background:#0F1114;border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-size:13px;font-family:inherit;color:#E5E5E5;outline:none;transition:border-color 0.15s}
.search-wrap input:focus{border-color:rgba(245,159,10,0.4);background:#13161A}
.search-wrap input::placeholder{color:#404040}
.search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#404040;pointer-events:none}

/* ── Article grid ───────────────────────────────────────────────────────── */
.grid-wrap{max-width:1200px;margin:0 auto;padding:0 40px 72px}
.articles-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
@media(max-width:1024px){.articles-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.articles-grid{grid-template-columns:1fr}.cat-bar-inner,.page-header,.grid-wrap{padding-left:20px;padding-right:20px}.search-wrap input{width:100%}.page-header{flex-direction:column;align-items:flex-start}.search-wrap{width:100%}}

/* ── Article cards ──────────────────────────────────────────────────────── */
.article-card{display:flex;flex-direction:column;background:#0F1114;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:20px;transition:border-color 0.15s,box-shadow 0.15s;text-decoration:none;color:inherit}
.article-card:hover{border-color:rgba(245,159,10,0.3);box-shadow:0 2px 16px rgba(245,159,10,0.06);text-decoration:none;color:inherit}
.card-cat{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#F59F0A;margin-bottom:10px;opacity:0.85}
.card-title{font-size:14px;font-weight:600;color:#F5F7F4;margin:0 0 8px;line-height:1.4}
.card-excerpt{font-size:13px;color:#737373;margin:0 0 16px;line-height:1.55;flex:1}
.card-meta{font-size:11px;color:#404040}
.cat-badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.5px;background:rgba(245,159,10,0.12);color:#F59F0A;border:1px solid rgba(245,159,10,0.2)}

/* ── Footer ─────────────────────────────────────────────────────────────── */
.site-footer{max-width:1200px;margin:0 auto;padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);font-size:12px;color:#404040;display:flex;justify-content:space-between;gap:10px}
.site-footer a{color:#525252}.site-footer a:hover{color:#A3A3A3;text-decoration:none}
.hidden{display:none!important}
`;

export function renderArticleListing(articles, activeCategory) {
  const active = activeCategory || '';
  const filtered = active ? articles.filter(a => a.category === active) : articles;
  const heading = active ? (CATEGORY_LABELS[active] || active) : 'All articles';
  const count = filtered.length;

  const catPills = [
    `<a href="/articles/all" class="cat-pill${!active ? ' active' : ''}">All articles</a>`,
    ...CATEGORIES.map(cat => {
      const href = `/articles/category/${cat}`;
      return `<a href="${href}" class="cat-pill${cat === active ? ' active' : ''}">${esc(CATEGORY_LABELS[cat] || cat)}</a>`;
    }),
  ].join('\n');

  const cardsHtml = count
    ? filtered.map(a => articleCard(a)).join('\n')
    : `<p style="color:#525252;grid-column:1/-1;padding:32px 0">No articles in this category yet.</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${active ? esc(CATEGORY_LABELS[active] || active) + ' — ' : ''}Knowledge Base | Trust Center</title>
<meta name="description" content="Plain-English guides to privacy law, cookie consent, and data protection for online businesses.">
<meta property="og:title" content="Knowledge Base | Trust Center">
<meta property="og:type" content="website">
${FONTS}
<style>${BASE}</style>
</head>
<body>
${navHtml()}
<div class="cat-bar">
  <div class="cat-bar-inner">${catPills}</div>
</div>
<div class="page-header">
  <div class="page-header-left">
    <h1>${esc(heading)}</h1>
    <p id="count">${count} article${count !== 1 ? 's' : ''}</p>
  </div>
  <div class="search-wrap">
    <svg class="search-icon" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
    <input type="search" id="search" placeholder="Search articles…" autocomplete="off" aria-label="Search articles">
  </div>
</div>
<div class="grid-wrap">
  <div class="articles-grid" id="grid">${cardsHtml}</div>
</div>
${siteFooter()}
<script>
(function () {
  var input = document.getElementById('search');
  var grid = document.getElementById('grid');
  var countEl = document.getElementById('count');
  if (!input || !grid) return;
  var cards = Array.from(grid.querySelectorAll('.article-card'));
  input.addEventListener('input', function () {
    var q = this.value.trim().toLowerCase();
    var v = 0;
    cards.forEach(function (c) {
      var show = !q || c.textContent.toLowerCase().includes(q);
      c.classList.toggle('hidden', !show);
      if (show) v++;
    });
    countEl.textContent = v + ' article' + (v !== 1 ? 's' : '');
  });
}());
</script>
</body>
</html>`;
}

export function renderArticlePage(article, relatedArticles) {
  const related = relatedArticles || [];
  const title = esc(article.title);
  const excerpt = esc(article.excerpt);
  const slug = esc(article.slug);
  const body = injectHeadingIds(article.body || '');
  const toc = extractToc(body);
  const published = formatDate(article.published_at);
  const rt = article.reading_time || 4;
  const cat = article.category;

  const tocHtml = toc.length >= 2 ? `<aside class="toc">
  <div class="toc-label">Contents</div>
  <ol class="toc-list">${toc.map(t => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol>
</aside>` : '';

  const relatedHtml = related.length ? `<section class="related">
  <h2 class="related-heading">Related articles</h2>
  <div class="related-grid">${related.map(a => articleCard(a)).join('\n')}</div>
</section>` : '';

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Article',
    headline: article.title, description: article.excerpt,
    datePublished: article.published_at, dateModified: article.updated_at || article.published_at,
    author: { '@type': 'Organization', name: 'Trust Center' },
    publisher: { '@type': 'Organization', name: 'Trust Center', url: 'https://trustcenter.pro' },
    url: `https://trustcenter.pro/articles/${article.slug}`,
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} | Trust Center</title>
<meta name="description" content="${excerpt}">
<link rel="canonical" href="https://trustcenter.pro/articles/${slug}">
<meta property="og:title" content="${title} | Trust Center">
<meta property="og:description" content="${excerpt}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://trustcenter.pro/articles/${slug}">
<script type="application/ld+json">${jsonLd}<\/script>
${FONTS}
<style>
${BASE}

/* ── Article layout ──────────────────────────────────────────────────────── */
.article-wrap{max-width:1200px;margin:0 auto;padding:0 40px 80px;display:grid;grid-template-columns:1fr 200px;gap:56px;align-items:start}
.article-header{max-width:1200px;margin:0 auto;padding:40px 40px 32px;border-bottom:1px solid rgba(255,255,255,0.06)}
.breadcrumb{font-size:12px;color:#404040;margin-bottom:14px;display:flex;align-items:center;gap:6px}
.breadcrumb a{color:#404040}.breadcrumb a:hover{color:#737373;text-decoration:none}
.article-header h1{font-size:clamp(20px,3vw,30px);font-weight:700;color:#F5F7F4;line-height:1.25;margin:12px 0 18px;letter-spacing:-0.02em}
.article-meta{font-size:12px;color:#525252;display:flex;align-items:center;gap:8px;flex-wrap:wrap}

/* ── Article body ────────────────────────────────────────────────────────── */
.article-body{min-width:0;padding-top:36px}
.article-body h2{font-size:18px;font-weight:600;color:#F5F7F4;margin:36px 0 12px;scroll-margin-top:24px;line-height:1.35;border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:8px}
.article-body h3{font-size:15px;font-weight:600;color:#F5F7F4;margin:24px 0 8px}
.article-body p{margin:0 0 16px;color:#C8C8C8;font-size:15px;line-height:1.75}
.article-body ul,.article-body ol{margin:0 0 18px;padding-left:22px;color:#C8C8C8;font-size:15px;line-height:1.75}
.article-body li{margin-bottom:5px}
.article-body strong{color:#F5F7F4;font-weight:600}
.article-body a{color:#F59F0A;font-weight:500}.article-body a:hover{color:#FBBF24}
.article-body blockquote{border-left:3px solid rgba(245,159,10,0.5);padding:12px 18px;margin:20px 0;background:#0F1114;border-radius:0 8px 8px 0;color:#A3A3A3;font-size:14px}
.article-body code{background:#0F1114;border:1px solid rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px;font-size:12px;font-family:'JetBrains Mono',monospace;color:#A3A3A3}
.article-body hr{border:none;border-top:1px solid rgba(255,255,255,0.06);margin:28px 0}

/* ── TOC ────────────────────────────────────────────────────────────────── */
.toc{position:sticky;top:80px;background:#0F1114;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:18px;margin-top:36px}
.toc-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#404040;margin-bottom:10px}
.toc-list{margin:0;padding:0;list-style:none}
.toc-list li{margin-bottom:7px}
.toc-list a{font-size:12px;color:#525252;line-height:1.4}
.toc-list a:hover{color:#F59F0A;text-decoration:none}

/* ── CTA ────────────────────────────────────────────────────────────────── */
.article-cta{max-width:1200px;margin:0 auto;padding:0 40px 48px}
.cta-inner{background:#0F1114;border:1px solid rgba(245,159,10,0.2);border-radius:10px;padding:32px 36px}
.cta-inner h2{font-size:18px;font-weight:600;color:#F5F7F4;margin:0 0 8px}
.cta-inner p{color:#737373;font-size:14px;margin:0 0 20px;line-height:1.6}
.cta-inner a{display:inline-block;background:#F59F0A;color:#08090B;font-weight:700;padding:10px 22px;border-radius:7px;font-size:13px;font-family:'JetBrains Mono',monospace}
.cta-inner a:hover{background:#FBBF24;text-decoration:none;color:#08090B}

/* ── Related ────────────────────────────────────────────────────────────── */
.related{max-width:1200px;margin:0 auto;padding:0 40px 72px;border-top:1px solid rgba(255,255,255,0.06)}
.related-heading{font-size:16px;font-weight:600;color:#F5F7F4;margin:32px 0 18px}
.related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
@media(max-width:800px){.article-wrap{grid-template-columns:1fr}.toc{display:none}}
@media(max-width:600px){.article-header,.article-wrap,.article-cta,.related{padding-left:20px;padding-right:20px}.related-grid{grid-template-columns:1fr}}
</style>
</head>
<body>
${navHtml()}
<div class="article-header">
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/articles">Articles</a>
    <span>&rsaquo;</span>
    <span>${esc(CATEGORY_LABELS[cat] || cat)}</span>
  </nav>
  ${catBadge(cat)}
  <h1>${title}</h1>
  <div class="article-meta">
    <span>${rt} min read</span>
    ${published ? `<span>&middot;</span><span>${published}</span>` : ''}
    <span>&middot;</span><span>By Trust Center</span>
  </div>
</div>
<div class="article-wrap">
  <main class="article-body">${body}</main>
  ${tocHtml}
</div>
<div class="article-cta">
  <div class="cta-inner">
    <h2>Ready to simplify your compliance?</h2>
    <p>Trust Center manages your privacy policies, cookie consent, and DSARs &mdash; one platform, all your brands, always up to date.</p>
    <a href="https://trustcenter.pro">Get early access &rarr;</a>
  </div>
</div>
${relatedHtml}
${siteFooter()}
</body>
</html>`;
}
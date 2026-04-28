// trustcenter-articles — Article renderers
// Trust Center brand (dark #0A0A0A + amber #F59F0A), Dashlane-inspired full-height sidebar layout
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

function topbar() {
  return `<header class="topbar">
  <a href="/" class="brand">
    <div class="brand-dot"></div>
    <span class="brand-name">Trust Center</span>
  </a>
  <nav class="topbar-nav">
    <a href="/articles" class="nav-link">Articles</a>
    <a href="/pricing" class="nav-link">Pricing</a>
    <a href="mailto:hello@trustcenter.pro" class="nav-cta">Get early access</a>
  </nav>
</header>`;
}

function sidebar(activeCategory, showSearch) {
  const allActive = (activeCategory || '') === '';
  const allLink = `<a href="/articles/all" class="sidebar-link${allActive ? ' active' : ''}">All articles</a>`;

  const catLinks = CATEGORIES.map(cat => {
    const href = `/articles/category/${cat}`;
    return `<a href="${href}" class="sidebar-link${cat === (activeCategory || '') ? ' active' : ''}">${esc(CATEGORY_LABELS[cat] || cat)}</a>`;
  }).join('\n');

  const searchHtml = showSearch ? `<div class="sidebar-search">
  <svg class="search-icon" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
  <input type="search" id="search" placeholder="Search…" autocomplete="off" aria-label="Search articles">
</div>` : '';

  return `<aside class="sidebar">
  <div class="sidebar-inner">
    <div class="sidebar-brand">
      <span class="sidebar-section-label">Knowledge Base</span>
    </div>
    <nav class="sidebar-nav" style="margin-bottom:12px">${allLink}</nav>
    ${searchHtml}
    <div class="sidebar-section-label" style="margin-top:20px">Categories</div>
    <nav class="sidebar-nav">${catLinks}</nav>
  </div>
</aside>`;
}

function siteFooter() {
  return `<footer class="site-footer">
  <span>&copy; ${new Date().getFullYear()} Trust Center &mdash; A Motivation Group product</span>
  <span><a href="/articles">Articles</a></span>
</footer>`;
}

const BASE = `
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;padding:0;background:#0A0A0A;color:#E5E5E5;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased;height:100%}
a{color:#F59F0A;text-decoration:none}a:hover{text-decoration:underline}

/* ── Topbar ───────────────────────────────────────────────────────────────── */
.topbar{height:52px;padding:0 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #1a1a1a;background:#0A0A0A;position:fixed;top:0;left:0;right:0;z-index:200}
.brand{display:flex;align-items:center;gap:8px;color:#E5E5E5;font-weight:600;font-size:14px;text-decoration:none}
.brand:hover{color:#F59F0A;text-decoration:none}
.brand-dot{width:18px;height:18px;border-radius:50%;background:#F59F0A;flex-shrink:0}
.topbar-nav{display:flex;align-items:center;gap:20px}
.nav-link{font-size:13px;color:#737373}
.nav-link:hover{color:#E5E5E5;text-decoration:none}
.nav-cta{font-size:12px;font-weight:500;background:rgba(245,159,10,0.12);border:1px solid rgba(245,159,10,0.3);color:#F59F0A;padding:6px 14px;border-radius:6px}
.nav-cta:hover{background:rgba(245,159,10,0.2);text-decoration:none;color:#F59F0A}

/* ── Page shell ────────────────────────────────────────────────────────────── */
.page-shell{display:flex;min-height:100vh;padding-top:52px}

/* ── Sidebar ────────────────────────────────────────────────────────────────── */
.sidebar{width:240px;flex-shrink:0;position:sticky;top:52px;height:calc(100vh - 52px);overflow-y:auto;border-right:1px solid #1a1a1a;background:#0d0d0d}
.sidebar-inner{padding:24px 16px 40px}
.sidebar-brand{margin-bottom:4px}
.sidebar-section-label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#404040;padding:0 8px;margin-bottom:6px}
.sidebar-search{position:relative;margin-bottom:4px}
.sidebar-search input{width:100%;padding:8px 10px 8px 32px;background:#111;border:1px solid #222;border-radius:6px;font-size:13px;font-family:inherit;color:#E5E5E5;outline:none;transition:border-color 0.15s}
.sidebar-search input:focus{border-color:rgba(245,159,10,0.4);background:#151515}
.sidebar-search input::placeholder{color:#404040}
.search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#404040;pointer-events:none}
.sidebar-nav{display:flex;flex-direction:column;gap:1px}
.sidebar-link{display:block;padding:7px 10px;border-radius:6px;font-size:13px;color:#737373;transition:background 0.1s,color 0.1s}
.sidebar-link:hover{background:#111;color:#E5E5E5;text-decoration:none}
.sidebar-link.active{background:rgba(245,159,10,0.1);color:#F59F0A;font-weight:500}

/* ── Main content ────────────────────────────────────────────────────────── */
.main-content{flex:1;min-width:0}
.content-header{padding:36px 40px 28px;border-bottom:1px solid #141414}
.content-header h1{font-size:22px;font-weight:600;color:#FAFAFA;margin:0 0 4px;letter-spacing:-0.01em}
.content-header p{color:#525252;font-size:14px;margin:0}
.content-body{padding:28px 40px 64px}
.articles-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
@media(max-width:1100px){.articles-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:860px){.sidebar{display:none}.articles-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.articles-grid{grid-template-columns:1fr}.content-header,.content-body{padding-left:20px;padding-right:20px}}

/* ── Article cards ───────────────────────────────────────────────────────── */
.article-card{display:flex;flex-direction:column;background:#111111;border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:20px;transition:border-color 0.15s,box-shadow 0.15s;text-decoration:none;color:inherit}
.article-card:hover{border-color:rgba(245,159,10,0.3);box-shadow:0 2px 16px rgba(245,159,10,0.06);text-decoration:none;color:inherit}
.card-cat{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#F59F0A;margin-bottom:10px;opacity:0.85}
.card-title{font-size:14px;font-weight:600;color:#FAFAFA;margin:0 0 8px;line-height:1.4}
.card-excerpt{font-size:13px;color:#737373;margin:0 0 16px;line-height:1.55;flex:1}
.card-meta{font-size:11px;color:#404040}
.cat-badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.5px;background:rgba(245,159,10,0.12);color:#F59F0A;border:1px solid rgba(245,159,10,0.2)}

/* ── Footer ─────────────────────────────────────────────────────────────── */
.site-footer{padding:24px 40px;border-top:1px solid #141414;font-size:12px;color:#404040;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}
.site-footer a{color:#525252}.site-footer a:hover{color:#A3A3A3;text-decoration:none}
.hidden{display:none!important}
`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`;

export function renderArticleListing(articles, activeCategory) {
  const active = activeCategory || '';
  const filtered = active ? articles.filter(a => a.category === active) : articles;
  const heading = active ? (CATEGORY_LABELS[active] || active) : 'All articles';
  const count = filtered.length;

  const cardsHtml = count
    ? filtered.map(a => articleCard(a)).join('\n')
    : `<p style="color:#525252;grid-column:1/-1;padding:32px 0">No articles in this category yet.</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Knowledge Base | Trust Center</title>
<meta name="description" content="Plain-English guides to privacy law, cookie consent, and data protection for online businesses.">
<meta property="og:title" content="Knowledge Base | Trust Center">
<meta property="og:description" content="Plain-English compliance guides for online businesses without a legal team.">
<meta property="og:type" content="website">
${FONTS}
<style>
${BASE}
</style>
</head>
<body>
${topbar()}
<div class="page-shell">
  ${sidebar(active, true)}
  <div class="main-content">
    <div class="content-header">
      <h1>${esc(heading)}</h1>
      <p id="count">${count} article${count !== 1 ? 's' : ''}</p>
    </div>
    <div class="content-body">
      <div class="articles-grid" id="grid">${cardsHtml}</div>
    </div>
    ${siteFooter()}
  </div>
</div>
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
.article-area{display:grid;grid-template-columns:1fr 200px;gap:48px;padding:36px 40px 72px;max-width:1000px}
.article-header{padding:36px 40px 28px;border-bottom:1px solid #141414;max-width:1000px}
.breadcrumb{font-size:12px;color:#404040;margin-bottom:14px}
.breadcrumb a{color:#404040}.breadcrumb a:hover{color:#737373;text-decoration:none}
.breadcrumb span{margin:0 5px;color:#2a2a2a}
.article-header h1{font-size:clamp(20px,3vw,30px);font-weight:700;color:#FAFAFA;line-height:1.25;margin:12px 0 16px;letter-spacing:-0.02em}
.article-meta{font-size:12px;color:#525252;display:flex;align-items:center;gap:8px;flex-wrap:wrap}

/* ── Article body ────────────────────────────────────────────────────────── */
.article-body{min-width:0}
.article-body h2{font-size:18px;font-weight:600;color:#FAFAFA;margin:36px 0 12px;scroll-margin-top:24px;line-height:1.35;border-bottom:1px solid #1a1a1a;padding-bottom:8px}
.article-body h3{font-size:15px;font-weight:600;color:#FAFAFA;margin:24px 0 8px}
.article-body p{margin:0 0 16px;color:#C8C8C8;font-size:15px;line-height:1.75}
.article-body ul,.article-body ol{margin:0 0 18px;padding-left:22px;color:#C8C8C8;font-size:15px;line-height:1.75}
.article-body li{margin-bottom:5px}
.article-body strong{color:#FAFAFA;font-weight:600}
.article-body a{color:#F59F0A;font-weight:500}
.article-body a:hover{color:#FBBF24}
.article-body blockquote{border-left:3px solid rgba(245,159,10,0.6);padding:12px 18px;margin:20px 0;background:#111;border-radius:0 8px 8px 0;color:#A3A3A3;font-size:14px}
.article-body code{background:#151515;border:1px solid #222;padding:2px 6px;border-radius:4px;font-size:12px;font-family:'SFMono-Regular',Consolas,monospace;color:#A3A3A3}
.article-body hr{border:none;border-top:1px solid #1a1a1a;margin:28px 0}

/* ── TOC ────────────────────────────────────────────────────────────────── */
.toc{position:sticky;top:72px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:16px 18px}
.toc-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#404040;margin-bottom:10px}
.toc-list{margin:0;padding:0;list-style:none}
.toc-list li{margin-bottom:7px}
.toc-list a{font-size:12px;color:#525252;line-height:1.4}
.toc-list a:hover{color:#F59F0A;text-decoration:none}

/* ── CTA ────────────────────────────────────────────────────────────────── */
.article-cta{background:linear-gradient(135deg,#111 0%,#13130e 100%);border:1px solid rgba(245,159,10,0.2);border-radius:10px;padding:32px 36px;margin:0 40px 48px;max-width:960px}
.article-cta h2{font-size:18px;font-weight:600;color:#FAFAFA;margin:0 0 8px}
.article-cta p{color:#737373;font-size:14px;margin:0 0 20px;line-height:1.6}
.article-cta a{display:inline-block;background:#F59F0A;color:#0A0A0A;font-weight:700;padding:10px 22px;border-radius:7px;font-size:13px}
.article-cta a:hover{background:#FBBF24;text-decoration:none;color:#0A0A0A}

/* ── Related ────────────────────────────────────────────────────────────── */
.related{padding:0 40px 72px;max-width:1000px}
.related-heading{font-size:16px;font-weight:600;color:#FAFAFA;margin:0 0 18px}
.related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
@media(max-width:800px){.article-area{grid-template-columns:1fr}.toc{display:none}}
@media(max-width:600px){.article-area,.article-header,.article-cta,.related{padding-left:20px;padding-right:20px}.related-grid{grid-template-columns:1fr}}
</style>
</head>
<body>
${topbar()}
<div class="page-shell">
  ${sidebar(cat, false)}
  <div class="main-content">
    <div class="article-header">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/articles">Articles</a>
        <span aria-hidden="true">&rsaquo;</span>
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
    <div class="article-area">
      <main class="article-body">${body}</main>
      ${tocHtml}
    </div>
    <div class="article-cta">
      <h2>Ready to simplify your compliance?</h2>
      <p>Trust Center manages your privacy policies, cookie consent, and DSARs &mdash; one platform, all your brands, always up to date.</p>
      <a href="mailto:hello@trustcenter.pro">Get early access &rarr;</a>
    </div>
    ${relatedHtml}
    ${siteFooter()}
  </div>
</div>
</body>
</html>`;
}
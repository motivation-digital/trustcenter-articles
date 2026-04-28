// trustcenter-articles — Article renderers (light theme, LCE-10000115)

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
  'gdpr', 'cookies', 'ccpa', 'privacy-policy', 'dsar',
  'usa', 'canada', 'australia', 'eu', 'uk', 'accessibility',
  'setup', 'policy', 'ecommerce', 'checklist', 'data-breach', 'industry',
  'services', 'general',
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

function catTag(cat) {
  return `<span class="cat-tag">${esc(CATEGORY_LABELS[cat] || cat)}</span>`;
}

function articleCard(a) {
  const rt = a.reading_time || 4;
  const date = formatDate(a.published_at);
  return `<a href="/articles/${esc(a.slug)}" class="article-card">
  <div class="card-category">${esc(CATEGORY_LABELS[a.category] || a.category)}</div>
  <h3 class="card-title">${esc(a.title)}</h3>
  <p class="card-excerpt">${esc(a.excerpt)}</p>
  <div class="card-meta">${rt} min read${date ? ` &middot; ${date}` : ''}</div>
</a>`;
}

function topbar(activePage) {
  return `<nav class="topbar">
  <a href="/" class="topbar-brand">
    <div class="topbar-dot"></div>
    <span>Trust Center</span>
  </a>
  <div class="topbar-links">
    <a href="/articles" class="topbar-link${activePage === 'articles' ? ' active' : ''}">Articles</a>
    <a href="/pricing" class="topbar-link">Pricing</a>
    <a href="mailto:hello@trustcenter.pro" class="topbar-cta">Get early access</a>
  </div>
</nav>`;
}

function siteFooter() {
  return `<footer class="site-footer">
  <div>&copy; ${new Date().getFullYear()} Trust Center &mdash; A Motivation Group product</div>
  <div><a href="/articles">Articles</a> &middot; <a href="mailto:hello@trustcenter.pro">Contact</a></div>
</footer>`;
}

const BASE_STYLES = `
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;padding:0;background:#fff;color:#374151;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased;min-height:100vh;display:flex;flex-direction:column}
main,section,div.page-body,div.article-layout{flex:1}
a{color:#F59F0A;text-decoration:none}a:hover{text-decoration:underline}
.topbar{height:56px;padding:0 32px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #E5E7EB;background:#fff;position:sticky;top:0;z-index:100}
.topbar-brand{display:flex;align-items:center;gap:8px;font-weight:600;font-size:15px;color:#111827;text-decoration:none}
.topbar-brand:hover{text-decoration:none;color:#F59F0A}
.topbar-dot{width:20px;height:20px;border-radius:50%;background:#F59F0A;flex-shrink:0}
.topbar-links{display:flex;align-items:center;gap:24px}
.topbar-link{font-size:14px;color:#6B7280}
.topbar-link:hover,.topbar-link.active{color:#111827;text-decoration:none}
.topbar-cta{font-size:13px;font-weight:600;background:#F59F0A;color:#fff;padding:7px 16px;border-radius:6px;display:inline-block}
.topbar-cta:hover{background:#D97706;text-decoration:none;color:#fff}
.cat-tag{display:inline-block;padding:2px 10px;border-radius:4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;background:#FEF3C7;color:#92400E}
.site-footer{padding:28px 32px;border-top:1px solid #E5E7EB;font-size:13px;color:#9CA3AF;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}
.site-footer a{color:#9CA3AF}.site-footer a:hover{color:#374151;text-decoration:none}
.hidden{display:none!important}
`;

export function renderArticleListing(articles, activeCategory) {
  const active = activeCategory || '';

  const catNav = ['', ...CATEGORIES].map(cat => {
    const label = cat ? (CATEGORY_LABELS[cat] || cat) : 'All articles';
    const href = cat ? `/articles/category/${cat}` : '/articles';
    return `<a href="${href}" class="cat-nav-item${cat === active ? ' active' : ''}">${esc(label)}</a>`;
  }).join('\n');

  const filtered = active ? articles.filter(a => a.category === active) : articles;
  const heading = active ? (CATEGORY_LABELS[active] || active) : 'All articles';
  const count = filtered.length;

  const cardsHtml = count
    ? filtered.map(a => articleCard(a)).join('\n')
    : `<p class="empty-state">No articles in this category yet.</p>`;

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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
${BASE_STYLES}
.page-hero{padding:40px 32px 28px;border-bottom:1px solid #E5E7EB}
.hero-inner{max-width:1100px;margin:0 auto}
.hero-inner h1{font-size:26px;font-weight:700;color:#111827;margin:0 0 6px;letter-spacing:-0.01em}
.hero-inner p{color:#6B7280;font-size:15px;margin:0 0 20px;max-width:520px}
.search-wrap{position:relative;max-width:400px}
.search-wrap input{width:100%;padding:9px 14px 9px 38px;border:1px solid #E5E7EB;border-radius:8px;font-size:14px;font-family:inherit;color:#111827;background:#F9FAFB;outline:none;transition:border-color 0.15s}
.search-wrap input:focus{border-color:#F59F0A;background:#fff;box-shadow:0 0 0 3px rgba(245,159,10,0.08)}
.search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#9CA3AF;pointer-events:none}
.page-body{max-width:1100px;margin:0 auto;padding:32px;display:grid;grid-template-columns:200px 1fr;gap:40px;align-items:start}
.cat-nav{background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:14px;position:sticky;top:72px}
.cat-nav-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;color:#9CA3AF;margin:0 0 8px;padding:0 8px}
.cat-nav-item{display:block;padding:7px 8px;border-radius:6px;font-size:13px;color:#374151;transition:background 0.1s}
.cat-nav-item:hover{background:#F3F4F6;color:#111827;text-decoration:none}
.cat-nav-item.active{background:#FEF3C7;color:#92400E;font-weight:500}
.articles-panel h2{font-size:18px;font-weight:600;color:#111827;margin:0 0 4px}
.articles-count{font-size:13px;color:#6B7280;margin:0 0 20px}
.articles-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.article-card{display:flex;flex-direction:column;border:1px solid #E5E7EB;border-radius:10px;padding:20px;transition:border-color 0.15s,box-shadow 0.15s;text-decoration:none;color:inherit;background:#fff}
.article-card:hover{border-color:#F59F0A;box-shadow:0 2px 12px rgba(245,159,10,0.08);text-decoration:none;color:inherit}
.card-category{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#F59F0A;margin-bottom:10px}
.card-title{font-size:15px;font-weight:600;color:#111827;margin:0 0 8px;line-height:1.4}
.card-excerpt{font-size:13px;color:#6B7280;margin:0 0 16px;line-height:1.55;flex:1}
.card-meta{font-size:12px;color:#9CA3AF}
.empty-state{color:#9CA3AF;font-size:15px;padding:32px 0;grid-column:1/-1}
@media(max-width:860px){.page-body{grid-template-columns:1fr}.cat-nav{position:static}}
@media(max-width:560px){.articles-grid{grid-template-columns:1fr}.page-body,.page-hero{padding-left:16px;padding-right:16px}}
</style>
</head>
<body>
${topbar('articles')}
<section class="page-hero">
  <div class="hero-inner">
    <h1>Knowledge Base</h1>
    <p>Plain-English guides to privacy, cookies, and data protection — written for online businesses.</p>
    <div class="search-wrap">
      <svg class="search-icon" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input type="search" id="search" placeholder="Search articles…" autocomplete="off" aria-label="Search articles">
    </div>
  </div>
</section>
<div class="page-body">
  <aside class="cat-nav" aria-label="Categories">
    <div class="cat-nav-label">Categories</div>
    ${catNav}
  </aside>
  <div class="articles-panel">
    <h2>${esc(heading)}</h2>
    <p class="articles-count" id="count">${count} article${count !== 1 ? 's' : ''}</p>
    <div class="articles-grid" id="grid">${cardsHtml}</div>
  </div>
</div>
${siteFooter()}
<script>
(function () {
  const input = document.getElementById('search');
  const grid = document.getElementById('grid');
  const countEl = document.getElementById('count');
  const cards = Array.from(grid.querySelectorAll('.article-card'));
  input.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    let v = 0;
    cards.forEach(function (c) {
      const show = !q || c.textContent.toLowerCase().includes(q);
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

  const tocHtml = toc.length >= 2 ? `<aside class="toc" aria-label="Contents">
  <div class="toc-label">Contents</div>
  <ol class="toc-list">${toc.map(t => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol>
</aside>` : '<div></div>';

  const relatedHtml = related.length ? `<section class="related">
  <h2>Related articles</h2>
  <div class="related-grid">${related.map(a => articleCard(a)).join('\n')}</div>
</section>` : '';

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
${BASE_STYLES}
.article-header{max-width:820px;margin:0 auto;padding:40px 32px 28px;border-bottom:1px solid #E5E7EB}
.breadcrumb{font-size:13px;color:#9CA3AF;margin-bottom:18px}
.breadcrumb a{color:#9CA3AF}.breadcrumb a:hover{color:#374151;text-decoration:none}
.breadcrumb span{margin:0 6px}
.article-header h1{font-size:clamp(22px,3.5vw,34px);font-weight:700;color:#111827;line-height:1.25;margin:12px 0 18px;letter-spacing:-0.01em}
.article-meta{font-size:13px;color:#9CA3AF;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.meta-sep{color:#D1D5DB}
.article-layout{max-width:1060px;margin:0 auto;padding:40px 32px 64px;display:grid;grid-template-columns:1fr 220px;gap:56px;align-items:start}
.article-body{min-width:0}
.article-body h2{font-size:20px;font-weight:600;color:#111827;margin:40px 0 14px;scroll-margin-top:24px;line-height:1.35;border-bottom:1px solid #F3F4F6;padding-bottom:8px}
.article-body h3{font-size:16px;font-weight:600;color:#111827;margin:28px 0 10px}
.article-body p{margin:0 0 18px;color:#374151;font-size:16px;line-height:1.75}
.article-body ul,.article-body ol{margin:0 0 20px;padding-left:24px;color:#374151;font-size:16px;line-height:1.75}
.article-body li{margin-bottom:6px}
.article-body strong{color:#111827;font-weight:600}
.article-body a{color:#F59F0A;font-weight:500}
.article-body a:hover{color:#D97706}
.article-body blockquote{border-left:3px solid #F59F0A;padding:14px 20px;margin:24px 0;background:#FFFBEB;border-radius:0 8px 8px 0;color:#374151;font-size:15px}
.article-body code{background:#F3F4F6;padding:2px 6px;border-radius:4px;font-size:13px;font-family:'SFMono-Regular',Consolas,monospace;color:#374151}
.article-body hr{border:none;border-top:1px solid #E5E7EB;margin:32px 0}
.toc{position:sticky;top:72px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:20px}
.toc-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;color:#9CA3AF;margin-bottom:12px}
.toc-list{margin:0;padding:0;list-style:none}
.toc-list li{margin-bottom:8px}
.toc-list a{font-size:13px;color:#6B7280;line-height:1.45}
.toc-list a:hover{color:#F59F0A;text-decoration:none}
.cta-block{max-width:820px;margin:0 auto;padding:0 32px 48px}
.cta-inner{background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:32px 36px}
.cta-inner h2{font-size:19px;font-weight:600;color:#111827;margin:0 0 8px}
.cta-inner p{color:#6B7280;font-size:15px;margin:0 0 20px;line-height:1.6}
.cta-inner a{display:inline-block;background:#F59F0A;color:#fff;font-weight:600;padding:10px 22px;border-radius:8px;font-size:14px}
.cta-inner a:hover{background:#D97706;text-decoration:none;color:#fff}
.related{max-width:1060px;margin:0 auto;padding:40px 32px 80px;border-top:1px solid #E5E7EB}
.related h2{font-size:18px;font-weight:600;color:#111827;margin:0 0 20px}
.related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.article-card{display:flex;flex-direction:column;border:1px solid #E5E7EB;border-radius:10px;padding:18px;transition:border-color 0.15s,box-shadow 0.15s;text-decoration:none;color:inherit;background:#fff}
.article-card:hover{border-color:#F59F0A;box-shadow:0 2px 10px rgba(245,159,10,0.08);text-decoration:none;color:inherit}
.card-category{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#F59F0A;margin-bottom:8px}
.card-title{font-size:14px;font-weight:600;color:#111827;margin:0 0 6px;line-height:1.4}
.card-excerpt{font-size:13px;color:#6B7280;margin:0 0 12px;line-height:1.5;flex:1}
.card-meta{font-size:12px;color:#9CA3AF}
@media(max-width:800px){.article-layout{grid-template-columns:1fr}.toc{display:none}}
@media(max-width:768px){.related-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.article-header,.article-layout,.cta-block,.related{padding-left:16px;padding-right:16px}.related-grid{grid-template-columns:1fr}}
</style>
</head>
<body>
${topbar()}
<header class="article-header">
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/articles">Articles</a>
    <span aria-hidden="true">&rsaquo;</span>
    <span>${esc(CATEGORY_LABELS[cat] || cat)}</span>
  </nav>
  ${catTag(cat)}
  <h1>${title}</h1>
  <div class="article-meta">
    <span>${rt} min read</span>
    ${published ? `<span class="meta-sep">&middot;</span><span>${published}</span>` : ''}
    <span class="meta-sep">&middot;</span><span>By Trust Center</span>
  </div>
</header>
<div class="article-layout">
  <main class="article-body">${body}</main>
  ${tocHtml}
</div>
<div class="cta-block">
  <div class="cta-inner">
    <h2>Ready to simplify your compliance?</h2>
    <p>Trust Center manages your privacy policies, cookie consent, and DSARs &mdash; one platform, all your brands, always up to date.</p>
    <a href="mailto:hello@trustcenter.pro">Get early access &rarr;</a>
  </div>
</div>
${relatedHtml}
${siteFooter()}
</body>
</html>`;
}
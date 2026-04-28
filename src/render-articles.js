// trustcenter-articles — Article renderers
// Trust Center brand (dark #08090B + amber #F59F0A)
// Layout: split header — logo above sidebar, nav above content
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
  'general', 'services', 'setup', 'policy', 'checklist',
  'gdpr', 'ccpa', 'privacy-policy', 'dsar', 'cookies',
  'data-breach', 'accessibility', 'ecommerce', 'industry',
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

// Split header: logo left (above sidebar), nav links right (above content)
function siteHeader() {
  return `<header class="site-header">
  <div class="header-logo">
    <a href="/" style="display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:14px;color:#F5F7F4;letter-spacing:-0.01em;text-decoration:none">
      <span style="width:18px;height:18px;border-radius:4px;background:#F59F0A;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0">
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#08090B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
      </span>
      <span>trustcenter<span style="color:#F59F0A">.pro</span></span>
    </a>
  </div>
  <nav class="header-nav">
    <a href="/pricing" class="nav-link">Pricing</a>
    <a href="/articles" class="nav-link active">Articles</a>
    <a href="https://motivation.digital/trust-center/" class="nav-link" target="_blank" rel="noopener">Live demo</a>
    <a href="https://trustcenter.pro" class="nav-btn">Join waitlist &rarr;</a>
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
    <nav class="sidebar-nav" style="margin-bottom:8px">${allLink}</nav>
    ${searchHtml}
    <div class="sidebar-section-label" style="margin-top:16px">Categories</div>
    <nav class="sidebar-nav">${catLinks}</nav>
  </div>
</aside>`;
}

function siteFooter() {
  return `<footer class="site-footer">
  <div class="footer-left">
    <a href="https://trustcenter.pro">Trustcenter.pro</a> a member of the Motivation Group Ltd. Reg No. 10105398.<br>
    Melville Building East, Royal William Yard, Plymouth, PL1 3RP, GB
  </div>
  <div class="footer-right">
    Group VAT Registration: GB 284 6168 72<br>
    Copyright &copy; 2008 &ndash; 2026 | Motivation Group Ltd. All Rights Reserved.
  </div>
</footer>`;
}

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">`;

const SIDEBAR_W = '220px';

const BASE = `
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;padding:0;background:#08090B;color:#E5E5E5;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:#F59F0A;text-decoration:none}a:hover{text-decoration:underline}

/* ── Split header ────────────────────────────────────────────────────────── */
.site-header{display:flex;position:sticky;top:0;z-index:200;height:56px;background:rgba(8,9,11,0.97);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,0.06)}
.header-logo{width:${SIDEBAR_W};flex-shrink:0;display:flex;align-items:center;padding:0 16px;border-right:1px solid rgba(255,255,255,0.06)}
.header-nav{flex:1;display:flex;align-items:center;justify-content:flex-end;padding:0 36px;gap:28px}
.nav-link{font-size:13px;color:#9AA1A8;transition:color 0.15s;white-space:nowrap;text-decoration:none}
.nav-link:hover{color:#F5F7F4;text-decoration:none}
.nav-link.active{color:#F5F7F4}
.nav-btn{background:#F59F0A;color:#08090B;padding:7px 14px;border-radius:6px;font-weight:700;font-size:12px;font-family:'JetBrains Mono',ui-monospace,monospace;white-space:nowrap;text-decoration:none;display:inline-block;transition:background 0.15s}
.nav-btn:hover{background:#FBBF24;text-decoration:none;color:#08090B}

/* ── Page shell ──────────────────────────────────────────────────────────── */
.page-shell{display:flex;min-height:calc(100vh - 56px)}

/* ── Sidebar ─────────────────────────────────────────────────────────────── */
.sidebar{width:${SIDEBAR_W};flex-shrink:0;position:sticky;top:56px;height:calc(100vh - 56px);overflow-y:auto;border-right:1px solid rgba(255,255,255,0.06);background:#08090B;scrollbar-width:none}
.sidebar::-webkit-scrollbar{display:none}
.sidebar-inner{padding:14px 12px 40px}
.sidebar-section-label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#343434;padding:0 8px;margin-bottom:4px}
.sidebar-search{position:relative;margin-bottom:4px}
.sidebar-search input{width:100%;padding:7px 10px 7px 30px;background:#0F1114;border:1px solid rgba(255,255,255,0.07);border-radius:6px;font-size:12px;font-family:inherit;color:#E5E5E5;outline:none;transition:border-color 0.15s}
.sidebar-search input:focus{border-color:rgba(245,159,10,0.4)}
.sidebar-search input::placeholder{color:#343434}
.search-icon{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:#343434;pointer-events:none}
.sidebar-nav{display:flex;flex-direction:column;gap:1px}
.sidebar-link{display:block;padding:6px 8px;border-radius:5px;font-size:13px;color:#5A6068;transition:background 0.1s,color 0.1s;text-decoration:none}
.sidebar-link:hover{background:#0F1114;color:#E5E5E5;text-decoration:none}
.sidebar-link.active{background:rgba(245,159,10,0.08);color:#F59F0A;font-weight:500}

/* ── Main content ────────────────────────────────────────────────────────── */
.main-content{flex:1;min-width:0;display:flex;flex-direction:column}
.content-header{padding:18px 32px 14px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.content-header h1{font-size:18px;font-weight:600;color:#F5F7F4;margin:0;letter-spacing:-0.01em}
.content-header-right{display:flex;align-items:center;gap:12px}
.count-label{font-size:12px;color:#404040;white-space:nowrap}
.search-wrap{position:relative}
.search-wrap input{padding:7px 12px 7px 32px;background:#0F1114;border:1px solid rgba(255,255,255,0.07);border-radius:6px;font-size:12px;font-family:inherit;color:#E5E5E5;outline:none;width:180px;transition:border-color 0.15s,width 0.2s}
.search-wrap input:focus{border-color:rgba(245,159,10,0.4);width:220px}
.search-wrap input::placeholder{color:#404040}
.search-icon-main{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#404040;pointer-events:none}
.content-body{padding:18px 32px 64px}
.articles-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
@media(max-width:1100px){.articles-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:860px){.sidebar,.header-logo{display:none}.header-nav{padding:0 20px}.content-header,.content-body{padding-left:20px;padding-right:20px}}
@media(max-width:560px){.articles-grid{grid-template-columns:1fr}}

/* ── Article cards ──────────────────────────────────────────────────────── */
.article-card{display:flex;flex-direction:column;background:#0F1114;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:18px;transition:border-color 0.15s,box-shadow 0.15s;text-decoration:none;color:inherit}
.article-card:hover{border-color:rgba(245,159,10,0.3);box-shadow:0 2px 16px rgba(245,159,10,0.05);text-decoration:none;color:inherit}
.card-cat{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#F59F0A;margin-bottom:10px;opacity:0.8}
.card-title{font-size:14px;font-weight:600;color:#F5F7F4;margin:0 0 8px;line-height:1.4}
.card-excerpt{font-size:13px;color:#737373;margin:0 0 14px;line-height:1.55;flex:1}
.card-meta{font-size:11px;color:#404040}
.cat-badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.5px;background:rgba(245,159,10,0.12);color:#F59F0A;border:1px solid rgba(245,159,10,0.2)}

/* ── Footer ─────────────────────────────────────────────────────────────── */
.site-footer{padding:16px 32px;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;color:#404040;display:flex;justify-content:space-between;align-items:flex-start;gap:16px;background:#08090B;margin-top:auto}
.site-footer a{color:#525252;text-decoration:none}.site-footer a:hover{color:#A3A3A3;text-decoration:none}
.footer-right{text-align:right}
.hidden{display:none!important}
`;

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
<title>${active ? esc(CATEGORY_LABELS[active] || active) + ' — ' : ''}Knowledge Base | Trust Center</title>
<meta name="description" content="Plain-English guides to privacy law, cookie consent, and data protection for online businesses.">
<meta property="og:title" content="Knowledge Base | Trust Center">
<meta property="og:type" content="website">
${FONTS}
<style>${BASE}</style>
</head>
<body>
${siteHeader()}
<div class="page-shell">
  ${sidebar(active, true)}
  <div class="main-content">
    <div class="content-header">
      <h1>${esc(heading)}</h1>
      <div class="content-header-right">
        <span class="count-label" id="count">${count} article${count !== 1 ? 's' : ''}</span>
        <div class="search-wrap">
          <svg class="search-icon-main" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="search" id="search" placeholder="Search…" autocomplete="off" aria-label="Search articles">
        </div>
      </div>
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
.article-header{padding:20px 36px 18px;border-bottom:1px solid rgba(255,255,255,0.06);max-width:860px}
.breadcrumb{font-size:12px;color:#404040;margin-bottom:12px;display:flex;align-items:center;gap:6px}
.breadcrumb a{color:#404040}.breadcrumb a:hover{color:#737373;text-decoration:none}
.article-header h1{font-size:clamp(20px,3vw,30px);font-weight:700;color:#F5F7F4;line-height:1.25;margin:10px 0 14px;letter-spacing:-0.02em}
.article-meta{font-size:12px;color:#525252;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.article-layout{display:grid;grid-template-columns:1fr 200px;gap:48px;padding:24px 36px 64px;max-width:860px}
.article-body{min-width:0}
.article-body h2{font-size:18px;font-weight:600;color:#F5F7F4;margin:32px 0 12px;scroll-margin-top:24px;line-height:1.35;border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:8px}
.article-body h3{font-size:15px;font-weight:600;color:#F5F7F4;margin:22px 0 8px}
.article-body p{margin:0 0 16px;color:#C8C8C8;font-size:15px;line-height:1.75}
.article-body ul,.article-body ol{margin:0 0 18px;padding-left:22px;color:#C8C8C8;font-size:15px;line-height:1.75}
.article-body li{margin-bottom:5px}
.article-body strong{color:#F5F7F4;font-weight:600}
.article-body a{color:#F59F0A;font-weight:500}.article-body a:hover{color:#FBBF24}
.article-body blockquote{border-left:3px solid rgba(245,159,10,0.5);padding:12px 18px;margin:20px 0;background:#0F1114;border-radius:0 8px 8px 0;color:#A3A3A3;font-size:14px}
.article-body code{background:#0F1114;border:1px solid rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px;font-size:12px;font-family:'JetBrains Mono',monospace;color:#A3A3A3}
.article-body hr{border:none;border-top:1px solid rgba(255,255,255,0.06);margin:28px 0}
.toc{position:sticky;top:72px;background:#0F1114;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:16px}
.toc-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#404040;margin-bottom:10px}
.toc-list{margin:0;padding:0;list-style:none}
.toc-list li{margin-bottom:7px}
.toc-list a{font-size:12px;color:#525252;line-height:1.4}
.toc-list a:hover{color:#F59F0A;text-decoration:none}
.article-cta{padding:0 36px 36px;max-width:860px}
.cta-inner{background:#0F1114;border:1px solid rgba(245,159,10,0.2);border-radius:10px;padding:26px 30px}
.cta-inner h2{font-size:17px;font-weight:600;color:#F5F7F4;margin:0 0 6px}
.cta-inner p{color:#737373;font-size:14px;margin:0 0 18px;line-height:1.6}
.cta-inner a{display:inline-block;background:#F59F0A;color:#08090B;font-weight:700;padding:9px 20px;border-radius:7px;font-size:13px;font-family:'JetBrains Mono',monospace}
.cta-inner a:hover{background:#FBBF24;text-decoration:none;color:#08090B}
.related{padding:0 36px 64px;border-top:1px solid rgba(255,255,255,0.06);max-width:860px}
.related-heading{font-size:15px;font-weight:600;color:#F5F7F4;margin:22px 0 14px}
.related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
@media(max-width:800px){.article-layout{grid-template-columns:1fr}.toc{display:none}}
@media(max-width:600px){.article-header,.article-layout,.article-cta,.related{padding-left:20px;padding-right:20px}.related-grid{grid-template-columns:1fr}}
</style>
</head>
<body>
${siteHeader()}
<div class="page-shell">
  ${sidebar(cat, false)}
  <div class="main-content">
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
    <div class="article-layout">
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
  </div>
</div>
</body>
</html>`;
}
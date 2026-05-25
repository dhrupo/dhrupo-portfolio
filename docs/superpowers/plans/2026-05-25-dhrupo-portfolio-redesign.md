# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 2021 Bootstrap portfolio with a single-page terminal/CLI-aesthetic site that accurately reflects current work (Fluent Forms 700K+, Fluent Player) and recent AI dev-tooling (mincut-context, codex-map, codex-claude-bridge, codex-review, workmem, growth-insights, local-chat, notifix, fluent-noc, fluentform-calculation-captcha).

**Architecture:** Vanilla HTML + CSS + tiny JS, no build step. Single `index.html`, one CSS file, four small `<script defer>` JS files (theme, app, palette, ticker). Day + dark mode via CSS custom properties with no FOUC. Deployed to Netlify on push to `main` (already wired). Spec source of truth: `docs/superpowers/specs/2026-05-25-dhrupo-portfolio-redesign-design.md`.

**Tech Stack:** HTML5, CSS3 (custom properties, `prefers-color-scheme`, `prefers-reduced-motion`), vanilla ES2020 JS, JetBrains Mono via Google Fonts.

---

## File Structure (target end-state)

```
dhrupo-portfolio/
├── index.html                         ← REWRITE (single page)
├── style.css                          ← REWRITE (both themes)
├── js/
│   ├── theme.js                       ← CREATE (FOUC-free, inline-loaded)
│   ├── app.js                         ← CREATE (typing, smooth scroll, copy-toast, status, cheatsheet)
│   ├── palette.js                     ← CREATE (⌘/Ctrl+K command palette)
│   └── ticker.js                      ← CREATE (live footer)
├── assets/
│   ├── favicon.svg                    ← CREATE (terminal "$_" mark)
│   └── og-cover.svg                   ← CREATE (1200×630 OG image as SVG)
├── docs/superpowers/specs/            ← already exists (committed)
├── docs/superpowers/plans/            ← already exists (this file)
├── README.md                          ← REWRITE (short, links to live)
└── .gitignore                         ← already exists

REMOVE:
- js/particles.js
- js/app.js (old)
- images/person1.png
- images/ (empty dir afterwards)
```

Each JS file has one responsibility; they share no globals (each is an IIFE-scoped module reading/writing only `window` events and `data-*` attributes).

---

## Test approach

This is a vanilla static site. There is no test runner — tests are explicit manual verification steps inside each task. Every task ends with running `python3 -m http.server 8000` (or directly opening `file://`) and verifying acceptance criteria in the browser. Each task also commits when green.

---

## Task 0: Snapshot the current state and clean slate

**Files:**
- Read: `index.html`, `style.css`, `js/app.js`, `js/particles.js`, `images/person1.png`
- Delete: `js/particles.js`, `js/app.js`, `images/person1.png`, `images/` (if empty)

- [ ] **Step 1: Verify git is clean before deleting**

```bash
cd /Volumes/Projects/dhrupo-portfolio
git status
```

Expected: working tree clean (the two design-spec commits already landed, nothing else pending).

- [ ] **Step 2: Delete the old asset files**

```bash
rm js/particles.js js/app.js
rm images/person1.png
rmdir images
```

- [ ] **Step 3: Verify deletions**

```bash
ls -la
```

Expected: no `images/` directory; `js/` exists but is empty.

- [ ] **Step 4: Commit the deletions**

```bash
git add -A
git commit -m "chore: remove particles.js, old app.js, and person1.png

Cleaning the slate before the redesign. These belong to the
2021 Bootstrap version that is about to be replaced.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 1: HTML skeleton (no styling yet, semantic only)

Build the structural HTML with every section, every nav item, every interactive element placeholder, plus the inline theme-init `<script>` in `<head>` to prove no-FOUC works before any CSS exists. JS files will be empty stubs.

**Files:**
- Rewrite: `index.html`
- Create: `js/theme.js`, `js/app.js`, `js/palette.js`, `js/ticker.js` (empty stubs)
- Create: `assets/favicon.svg`

- [ ] **Step 1: Create empty JS stub files**

```bash
mkdir -p js assets
cat > js/theme.js << 'EOF'
// theme toggle — implemented in Task 2
EOF
cat > js/app.js << 'EOF'
// typing, smooth scroll, copy-toast, status, cheatsheet — implemented in Task 4
EOF
cat > js/palette.js << 'EOF'
// ⌘/Ctrl+K command palette — implemented in Task 5
EOF
cat > js/ticker.js << 'EOF'
// live footer (uptime, time, last commit) — implemented in Task 6
EOF
```

- [ ] **Step 2: Create the favicon SVG**

Write `assets/favicon.svg` with this exact content:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0d1117"/><text x="16" y="22" font-family="JetBrains Mono,monospace" font-size="18" font-weight="700" fill="#56d364" text-anchor="middle">$_</text></svg>
```

- [ ] **Step 3: Write the full `index.html`**

Write `index.html` with this exact content:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Niluthpal Purkayastha (dhrupo) — Senior Software Engineer</title>
  <meta name="description" content="Senior Software Engineer at WPManageNinja. I build WordPress products used on 700K+ sites (Fluent Forms, Fluent Player) and small AI dev-tooling on the side.">
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="canonical" href="https://dhrupo.netlify.app/">

  <!-- Open Graph -->
  <meta property="og:title" content="Niluthpal Purkayastha (dhrupo) — Senior Software Engineer">
  <meta property="og:description" content="WordPress products for 700K+ sites · AI dev-tooling on the side.">
  <meta property="og:url" content="https://dhrupo.netlify.app/">
  <meta property="og:type" content="profile">
  <meta property="og:image" content="https://dhrupo.netlify.app/assets/og-cover.svg">
  <meta name="twitter:card" content="summary_large_image">

  <!-- JSON-LD Person -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Niluthpal Purkayastha",
    "alternateName": "dhrupo",
    "jobTitle": "Senior Software Engineer",
    "worksFor": { "@type": "Organization", "name": "WPManageNinja" },
    "url": "https://dhrupo.netlify.app/",
    "sameAs": [
      "https://github.com/dhrupo",
      "https://linkedin.com/in/niluthpal-purkayastha",
      "https://profiles.wordpress.org/dhrupo/"
    ]
  }
  </script>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap">

  <!-- Inline theme init — must run before paint to avoid FOUC -->
  <script>
    (function(){
      var saved = null;
      try { saved = localStorage.getItem('theme'); } catch(e) {}
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      var theme = saved || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>

  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!--
        ___   _                          
       /   \ | |__   _ __  _   _  _ __  ___
      | / \ || '_ \ | '__|| | | || '_ \/ _ \
      | \_/ || | | || |   | |_| || |_) |  __/
       \___/ |_| |_||_|    \__,_|| .__/ \___|
                                 |_|
       hi — if you're poking around the source, hello.
       this site is hand-written HTML, no framework, no build.
       say hi: dhrupo@gmail.com
  -->

  <a class="skip-link" href="#main">Skip to content</a>

  <div class="progress" aria-hidden="true"></div>

  <header class="nav" role="banner">
    <div class="nav-inner">
      <a class="brand" href="#home"><span class="brand-prompt">$</span> dhrupo<span class="status-dot" data-status="available" aria-label="Status: available"></span></a>
      <nav class="nav-links" aria-label="Primary">
        <a href="#about">about</a>
        <a href="#work">work</a>
        <a href="#oss">oss</a>
        <a href="#notes">notes</a>
        <a href="#contact">contact</a>
      </nav>
      <button class="theme-toggle" type="button" aria-label="Toggle color theme" aria-pressed="false" data-theme-toggle>
        <span class="theme-icon" aria-hidden="true">☾</span>
      </button>
    </div>
  </header>

  <main id="main">

    <section id="home" class="hero" aria-labelledby="hero-cmd">
      <p class="cmd" id="hero-cmd"><span class="prompt">~</span> <span class="verb">whoami</span></p>
      <h1 class="hero-name" data-typewriter="Niluthpal Purkayastha">Niluthpal Purkayastha</h1>
      <p class="hero-meta">// aka <span class="hl">dhrupo</span> · Senior Software Engineer @ <a href="https://github.com/WPManageNinja">WPManageNinja</a></p>
      <p class="hero-meta">// Sylhet, Bangladesh · on GitHub since 2018</p>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="https://drive.google.com/file/d/1DuU2WIFN70kHioRdTSU-pgvZQTAWbRR-/view?usp=sharing" target="_blank" rel="noopener">resume.pdf</a>
        <a class="btn" href="https://github.com/dhrupo" target="_blank" rel="noopener">github</a>
        <a class="btn" href="https://linkedin.com/in/niluthpal-purkayastha" target="_blank" rel="noopener">linkedin</a>
        <button class="btn" type="button" data-copy="dhrupo@gmail.com">email</button>
      </div>
    </section>

    <section id="about" class="section" aria-labelledby="about-cmd">
      <h2 class="cmd" id="about-cmd"><span class="prompt">~</span> <span class="verb">cat</span> about.md</h2>
      <div class="prose">
        <p>I build WordPress products people actually use — currently <strong>Fluent Forms</strong> (700K+ active sites) and <strong>Fluent Player</strong>, where I work across PHP, Vue 3, React, Gutenberg, and REST APIs.</p>
        <p>Outside of plugin work, I build small <strong>AI dev-tooling</strong> — context selectors, MCP bridges, CLI helpers — most of it open source on npm. The goal is the same in both worlds: ship the smallest thing that does the job well.</p>
      </div>

      <h3 class="cmd sub-cmd"><span class="prompt">~</span> <span class="verb">ls</span> ./experience/</h3>
      <ol class="timeline" role="list">
        <li><span class="when">2022 — Now</span><span class="what">Senior Software Engineer · WPManageNinja</span></li>
        <li><span class="when">2018 — 2022</span><span class="what">Web Developer · freelance &amp; product work</span></li>
      </ol>

      <h3 class="cmd sub-cmd"><span class="prompt">~</span> <span class="verb">cat</span> skills.json</h3>
      <dl class="skills">
        <div class="skill-group"><dt>languages</dt><dd>PHP · JavaScript · TypeScript · HTML · CSS · SQL</dd></div>
        <div class="skill-group"><dt>frontend</dt><dd>Vue 3 · React · Gutenberg blocks · Element Plus · Tailwind · Vite</dd></div>
        <div class="skill-group"><dt>backend</dt><dd>WordPress · Laravel · Node.js · MySQL · REST APIs</dd></div>
        <div class="skill-group"><dt>ai / tooling</dt><dd>MCP servers · Codex / Claude Code · npm publishing · GitHub Actions · PHPUnit · Playwright · PHPStan</dd></div>
      </dl>
    </section>

    <section id="work" class="section" aria-labelledby="work-cmd">
      <h2 class="cmd" id="work-cmd"><span class="prompt">~</span> <span class="verb">ls</span> ./work/</h2>
      <div class="work-grid">
        <a class="work-card" href="https://wordpress.org/plugins/fluentform/" target="_blank" rel="noopener">
          <span class="work-badge">flagship · 700K+ installs</span>
          <h3>Fluent Forms</h3>
          <p>Form builder for WordPress. Conversational forms, payments, integrations, signature, PDF, WPML.</p>
          <p class="stack">PHP · Vue 3 · Element Plus · MySQL</p>
        </a>
        <a class="work-card" href="https://fluentplayer.com" target="_blank" rel="noopener">
          <span class="work-badge">product</span>
          <h3>Fluent Player</h3>
          <p>Video player for WordPress. BunnyCDN / Mux integrations, subtitles, analytics, email-gate, timed content.</p>
          <p class="stack">PHP · Vue 3 · Gutenberg blocks</p>
        </a>
      </div>
    </section>

    <section id="oss" class="section" aria-labelledby="oss-cmd">
      <h2 class="cmd" id="oss-cmd"><span class="prompt">~</span> <span class="verb">ls</span> ./oss/</h2>
      <div class="oss-grid">
        <a class="oss-card" href="https://github.com/dhrupo/mincut-context" target="_blank" rel="noopener"><h4>mincut-context <span class="pkg">npm</span></h4><p>Token-minimal context selection for AI coding agents. Symbol graph + PageRank + min-cut.</p><p class="stack">TypeScript</p></a>
        <a class="oss-card" href="https://github.com/dhrupo/codex-map" target="_blank" rel="noopener"><h4>codex-map <span class="pkg">npm</span></h4><p>Visual dashboard for inspecting and mapping your Codex CLI setup.</p><p class="stack">JavaScript</p></a>
        <a class="oss-card" href="https://github.com/dhrupo/codex-claude-bridge" target="_blank" rel="noopener"><h4>@dhrupo/codex-claude-bridge <span class="pkg">npm</span></h4><p>Use Claude Code from inside Codex. MCP server + helper CLI.</p><p class="stack">JavaScript</p></a>
        <a class="oss-card" href="https://github.com/dhrupo/codex-review" target="_blank" rel="noopener"><h4>codex-review</h4><p>Local pre-PR reviewer for WPManageNinja plugin repos.</p><p class="stack">JavaScript</p></a>
        <a class="oss-card" href="https://github.com/dhrupo/workmem" target="_blank" rel="noopener"><h4>workmem</h4><p>Recheck-backed working memory for AI coding workflows.</p><p class="stack">JavaScript</p></a>
        <a class="oss-card" href="https://github.com/dhrupo/notifix" target="_blank" rel="noopener"><h4>notifix</h4><p>WordPress plugin: realtime social proof via an adapter-based event pipeline.</p><p class="stack">PHP</p></a>
        <a class="oss-card" href="https://github.com/dhrupo/growth-insights" target="_blank" rel="noopener"><h4>growth-insights</h4><p>Laravel + Vue dashboard turning GitHub activity into growth signals with Gemini coaching.</p><p class="stack">PHP · Vue 3</p></a>
        <a class="oss-card" href="https://github.com/dhrupo/local-chat" target="_blank" rel="noopener"><h4>local-chat</h4><p>Laravel 12 + Vue 3 + WebRTC LAN chat with voice/video.</p><p class="stack">PHP · Vue 3</p></a>
        <a class="oss-card" href="https://github.com/dhrupo/fluent-noc" target="_blank" rel="noopener"><h4>fluent-noc</h4><p>WordPress NOC manager — PDF, QR codes, email notifications.</p><p class="stack">PHP</p></a>
        <a class="oss-card" href="https://github.com/dhrupo/fluentform-calculation-captcha" target="_blank" rel="noopener"><h4>fluentform-calculation-captcha</h4><p>Math-based spam protection for Fluent Forms. No external API.</p><p class="stack">PHP</p></a>
      </div>
    </section>

    <section id="notes" class="section" aria-labelledby="notes-cmd">
      <h2 class="cmd" id="notes-cmd"><span class="prompt">~</span> <span class="verb">ls</span> ./notes/</h2>
      <p class="muted">// coming soon — short essays on plugin engineering &amp; AI dev tooling</p>
    </section>

    <section id="contact" class="section" aria-labelledby="contact-cmd">
      <h2 class="cmd" id="contact-cmd"><span class="prompt">~</span> <span class="verb">cat</span> contact.txt</h2>
      <ul class="contact-list">
        <li><span class="key">email</span> <button type="button" class="link-like" data-copy="dhrupo@gmail.com">dhrupo@gmail.com</button></li>
        <li><span class="key">github</span> <a href="https://github.com/dhrupo" target="_blank" rel="noopener">github.com/dhrupo</a></li>
        <li><span class="key">linkedin</span> <a href="https://linkedin.com/in/niluthpal-purkayastha" target="_blank" rel="noopener">linkedin.com/in/niluthpal-purkayastha</a></li>
        <li><span class="key">wp.org</span> <a href="https://profiles.wordpress.org/dhrupo/" target="_blank" rel="noopener">profiles.wordpress.org/dhrupo</a></li>
        <li><span class="key">location</span> Sylhet, Bangladesh</li>
      </ul>
    </section>

  </main>

  <footer class="ticker" role="contentinfo" aria-label="Site status">
    <span class="ticker-prompt">$</span>
    <span class="ticker-line" data-ticker>uptime — loading…</span>
  </footer>

  <div class="toast" id="toast" role="status" aria-live="polite" aria-atomic="true"></div>

  <dialog class="palette" id="palette" aria-label="Command palette">
    <div class="palette-inner">
      <div class="palette-prompt"><span>&gt;</span><input type="text" id="palette-input" placeholder="type a command…" autocomplete="off" spellcheck="false" aria-label="Command"></div>
      <ul class="palette-list" id="palette-list" role="listbox" aria-label="Commands"></ul>
      <p class="palette-hint">↑↓ navigate · ↵ run · esc close</p>
    </div>
  </dialog>

  <dialog class="cheatsheet" id="cheatsheet" aria-label="Keyboard shortcuts">
    <div class="cheatsheet-inner">
      <h3>keyboard shortcuts</h3>
      <dl>
        <dt><kbd>⌘</kbd>/<kbd>Ctrl</kbd>+<kbd>K</kbd></dt><dd>open command palette</dd>
        <dt><kbd>T</kbd></dt><dd>toggle theme</dd>
        <dt><kbd>?</kbd></dt><dd>show this cheatsheet</dd>
        <dt><kbd>Esc</kbd></dt><dd>close any overlay</dd>
        <dt><kbd>G</kbd> then <kbd>H</kbd></dt><dd>go home</dd>
      </dl>
      <button type="button" data-close>close</button>
    </div>
  </dialog>

  <script src="js/theme.js" defer></script>
  <script src="js/app.js" defer></script>
  <script src="js/palette.js" defer></script>
  <script src="js/ticker.js" defer></script>
</body>
</html>
```

- [ ] **Step 4: Verify HTML loads with no console errors**

```bash
cd /Volumes/Projects/dhrupo-portfolio
python3 -m http.server 8000 &
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/
kill %1
```

Expected: `200`. (At this point the page renders as unstyled HTML — that's correct.)

- [ ] **Step 5: Commit**

```bash
git add index.html js/ assets/
git commit -m "feat: semantic HTML skeleton with no-FOUC theme init

All sections, nav, palette dialog, cheatsheet dialog, toast,
ticker, and the inline theme-bootstrap script. No styling yet
and JS files are empty stubs.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Theme toggle behavior (`js/theme.js`)

Light/dark toggle with `localStorage` persistence, `data-theme` attribute on `<html>`, accessible button.

**Files:**
- Modify: `js/theme.js`

- [ ] **Step 1: Write `js/theme.js`**

Replace the entire contents with:

```javascript
(function(){
  var root = document.documentElement;
  var btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;
  var icon = btn.querySelector('.theme-icon');

  function syncBtn(theme){
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    if (icon) icon.textContent = theme === 'dark' ? '☼' : '☾';
  }

  syncBtn(root.getAttribute('data-theme') || 'dark');

  function setTheme(theme){
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch(e) {}
    syncBtn(theme);
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  btn.addEventListener('click', function(){
    var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Expose for palette + keyboard shortcut
  window.__theme = { set: setTheme, get: function(){ return root.getAttribute('data-theme'); } };

  // Keyboard shortcut: "T"
  document.addEventListener('keydown', function(e){
    if (e.key === 't' && !e.metaKey && !e.ctrlKey && !e.altKey &&
        document.activeElement.tagName !== 'INPUT' &&
        document.activeElement.tagName !== 'TEXTAREA') {
      setTheme(window.__theme.get() === 'dark' ? 'light' : 'dark');
    }
  });
})();
```

- [ ] **Step 2: Verify in the browser**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000/
```

Manually verify:
1. `<html>` has `data-theme="dark"` or `"light"` in DevTools
2. Click the ☾/☼ button → attribute flips, icon swaps, `aria-pressed` flips
3. Reload → theme persists
4. `localStorage.removeItem('theme')` then reload in a system-dark macOS → defaults to dark; on a system-light macOS → defaults to light
5. Press `T` (no input focused) → toggles theme

Stop the server: `kill %1`

- [ ] **Step 3: Commit**

```bash
git add js/theme.js
git commit -m "feat(theme): toggle with localStorage persistence and T shortcut

Updates data-theme on <html>, syncs button aria-pressed and icon,
emits 'themechange' event for other modules, and binds the T key
shortcut (ignored when an input is focused).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Full CSS — both themes, layout, motion (`style.css`)

Rewrite from scratch with custom properties for both themes, the whole layout system, motion that respects `prefers-reduced-motion`, and styling for every element added in Task 1.

**Files:**
- Rewrite: `style.css`

- [ ] **Step 1: Replace `style.css` entirely**

Write `style.css` with this content:

```css
/* ──────────────────────────────────────────────────────────────
   dhrupo-portfolio · style.css
   Terminal aesthetic · day + dark themes · GitHub palette tokens
   ────────────────────────────────────────────────────────────── */

*, *::before, *::after { box-sizing: border-box; }

:root[data-theme="dark"] {
  --bg: #0d1117;
  --bg-elev: #161b22;
  --border: #30363d;
  --fg: #c9d1d9;
  --fg-muted: #8b949e;
  --fg-strong: #f0f6fc;
  --prompt: #56d364;
  --cmd: #79c0ff;
  --accent: #ff7b72;
  --shadow: 0 4px 24px rgba(0,0,0,.4);
}

:root[data-theme="light"] {
  --bg: #ffffff;
  --bg-elev: #f6f8fa;
  --border: #d0d7de;
  --fg: #1f2328;
  --fg-muted: #656d76;
  --fg-strong: #1f2328;
  --prompt: #1a7f37;
  --cmd: #0969da;
  --accent: #cf222e;
  --shadow: 0 4px 24px rgba(31,35,40,.1);
}

html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 14px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  transition: background-color .2s ease, color .2s ease;
}

a { color: var(--cmd); text-decoration: none; }
a:hover { text-decoration: underline; }
a:focus-visible, button:focus-visible, [data-copy]:focus-visible {
  outline: 2px solid var(--cmd);
  outline-offset: 2px;
  border-radius: 3px;
}

.skip-link {
  position: absolute; left: -9999px; top: 0;
  background: var(--bg-elev); color: var(--fg-strong);
  padding: 8px 12px; border: 1px solid var(--border); border-radius: 4px;
  z-index: 9999;
}
.skip-link:focus { left: 16px; top: 16px; }

/* ── Scroll progress bar ─────────────────────────────────────── */
.progress {
  position: fixed; top: 0; left: 0; right: 0;
  height: 2px; background: var(--prompt);
  transform-origin: 0 50%; transform: scaleX(0);
  z-index: 100;
}

/* ── Nav ─────────────────────────────────────────────────────── */
.nav {
  position: sticky; top: 0; z-index: 50;
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  max-width: 760px; margin: 0 auto;
  padding: 14px 24px;
  display: flex; align-items: center; gap: 16px;
}
.brand {
  color: var(--fg-strong); font-weight: 700; font-size: 15px;
  display: inline-flex; align-items: center; gap: 6px;
}
.brand:hover { text-decoration: none; color: var(--prompt); }
.brand-prompt { color: var(--prompt); }
.status-dot {
  display: inline-block; width: 8px; height: 8px; border-radius: 50%;
  background: var(--prompt); box-shadow: 0 0 8px var(--prompt);
  margin-left: 6px;
  animation: pulse 2s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) { .status-dot { animation: none; } }
@keyframes pulse { 50% { opacity: 0.5; } }

.nav-links {
  margin-left: auto;
  display: flex; gap: 18px;
}
.nav-links a {
  color: var(--fg-muted); font-size: 13px; padding: 4px 0;
}
.nav-links a:hover { color: var(--prompt); text-decoration: none; }

.theme-toggle {
  background: transparent; border: 1px solid var(--border); color: var(--fg);
  padding: 6px 10px; border-radius: 4px;
  cursor: pointer; font-family: inherit; font-size: 14px;
  transition: border-color .2s ease, color .2s ease;
}
.theme-toggle:hover { border-color: var(--prompt); color: var(--prompt); }

/* ── Main / sections ─────────────────────────────────────────── */
main { max-width: 760px; margin: 0 auto; padding: 0 24px; }

.section { padding: 56px 0; border-bottom: 1px dashed var(--border); }
.section:last-of-type { border-bottom: none; }

.cmd {
  font-size: 15px; color: var(--fg-muted);
  margin: 0 0 16px;
}
.sub-cmd { margin-top: 32px; }
.prompt { color: var(--prompt); margin-right: 6px; }
.verb { color: var(--cmd); margin-right: 4px; }
.hl { color: var(--accent); }

/* Blinking trailing cursor on h2.cmd headings */
h2.cmd::after,
h3.cmd::after {
  content: "▋"; color: var(--prompt); margin-left: 6px;
  animation: blink 2s steps(2,start) infinite;
  font-weight: 400;
}
@media (prefers-reduced-motion: reduce) {
  h2.cmd::after, h3.cmd::after { animation: none; opacity: .5; }
}
@keyframes blink { 50% { opacity: 0; } }

/* ── Hero ────────────────────────────────────────────────────── */
.hero {
  padding: 80px 0 56px;
  border-bottom: 1px dashed var(--border);
}
.hero-name {
  font-size: 32px; font-weight: 700; color: var(--fg-strong);
  margin: 8px 0 16px; line-height: 1.2;
  letter-spacing: -.5px;
}
.hero-name::after {
  content: "▋"; color: var(--prompt); margin-left: 6px;
  animation: blink 1.1s steps(2,start) infinite;
}
@media (prefers-reduced-motion: reduce) { .hero-name::after { animation: none; opacity: .5; } }
.hero-meta { margin: 0 0 6px; color: var(--fg-muted); font-size: 13px; }
.hero-meta a { color: var(--cmd); }
.hero-ctas {
  display: flex; flex-wrap: wrap; gap: 10px;
  margin-top: 24px;
}
.btn {
  display: inline-block; padding: 8px 14px;
  border: 1px solid var(--border); border-radius: 4px;
  background: transparent; color: var(--fg);
  font-family: inherit; font-size: 13px; cursor: pointer;
  transition: border-color .2s ease, color .2s ease, transform .15s ease;
}
.btn:hover { border-color: var(--prompt); color: var(--prompt); transform: translateY(-1px); text-decoration: none; }
.btn-primary {
  border-color: var(--prompt); color: var(--prompt);
}
.btn-primary:hover { background: var(--prompt); color: var(--bg); }

/* ── Prose ───────────────────────────────────────────────────── */
.prose p { margin: 12px 0; color: var(--fg); max-width: 64ch; }
.prose strong { color: var(--fg-strong); font-weight: 700; }

/* ── Timeline ────────────────────────────────────────────────── */
.timeline { list-style: none; padding: 0; margin: 16px 0 0; }
.timeline li {
  display: grid; grid-template-columns: 160px 1fr;
  gap: 12px; padding: 10px 0; border-left: 2px solid var(--border);
  padding-left: 16px; margin-left: 8px;
}
.timeline .when { color: var(--fg-muted); font-size: 12px; }
.timeline .what { color: var(--fg-strong); }

/* ── Skills ──────────────────────────────────────────────────── */
.skills { margin: 16px 0 0; padding: 0; }
.skill-group { display: grid; grid-template-columns: 140px 1fr; gap: 12px; padding: 8px 0; }
.skill-group dt { color: var(--prompt); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
.skill-group dd { margin: 0; color: var(--fg); }

/* ── Work cards ──────────────────────────────────────────────── */
.work-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  margin-top: 8px;
}
.work-card {
  display: block; padding: 20px;
  background: var(--bg-elev); border: 1px solid var(--border); border-radius: 6px;
  color: var(--fg);
  transition: transform .15s ease, border-color .2s ease;
}
.work-card:hover { transform: translateY(-2px); border-color: var(--prompt); text-decoration: none; }
.work-badge {
  display: inline-block; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;
  color: var(--prompt); background: color-mix(in srgb, var(--prompt) 14%, transparent);
  padding: 3px 8px; border-radius: 3px; margin-bottom: 12px;
}
.work-card h3 { margin: 0 0 8px; color: var(--fg-strong); font-size: 17px; }
.work-card p { margin: 6px 0; color: var(--fg-muted); font-size: 13px; }
.work-card .stack { color: var(--cmd); font-size: 12px; margin-top: 12px; }

/* ── OSS cards ───────────────────────────────────────────────── */
.oss-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  margin-top: 8px;
}
.oss-card {
  display: block; padding: 14px 16px;
  background: var(--bg-elev); border: 1px solid var(--border); border-radius: 6px;
  color: var(--fg);
  transition: transform .15s ease, border-color .2s ease;
}
.oss-card:hover { transform: translateY(-2px); border-color: var(--prompt); text-decoration: none; }
.oss-card h4 { margin: 0 0 6px; color: var(--fg-strong); font-size: 14px; }
.oss-card .pkg {
  font-size: 9px; text-transform: uppercase; letter-spacing: 1px;
  background: var(--accent); color: var(--bg); padding: 2px 6px; border-radius: 3px;
  vertical-align: middle; font-weight: 700;
}
.oss-card p { margin: 4px 0; color: var(--fg-muted); font-size: 12px; }
.oss-card .stack { color: var(--cmd); font-size: 11px; margin-top: 8px; }

/* ── Contact list ───────────────────────────────────────────── */
.contact-list { list-style: none; padding: 0; margin: 16px 0 0; }
.contact-list li { display: grid; grid-template-columns: 100px 1fr; gap: 12px; padding: 6px 0; }
.contact-list .key { color: var(--prompt); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
.link-like {
  background: none; border: none; padding: 0; cursor: pointer;
  color: var(--cmd); font-family: inherit; font-size: 14px; text-align: left;
}
.link-like:hover { text-decoration: underline; }

.muted { color: var(--fg-muted); }

/* ── Footer ticker ──────────────────────────────────────────── */
.ticker {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: var(--bg-elev); border-top: 1px solid var(--border);
  padding: 8px 24px; font-size: 11px; color: var(--fg-muted);
  display: flex; gap: 8px; align-items: center;
  z-index: 40;
}
.ticker-prompt { color: var(--prompt); }
main { padding-bottom: 56px; }

/* ── Toast ──────────────────────────────────────────────────── */
.toast {
  position: fixed; bottom: 56px; left: 50%; transform: translateX(-50%) translateY(20px);
  background: var(--bg-elev); border: 1px solid var(--prompt); color: var(--prompt);
  padding: 8px 14px; border-radius: 4px; font-size: 12px;
  opacity: 0; pointer-events: none;
  transition: opacity .2s ease, transform .2s ease;
  z-index: 200;
}
.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ── Command palette dialog ─────────────────────────────────── */
.palette {
  border: none; padding: 0; background: transparent;
  width: min(560px, 92vw); max-width: none;
  margin: 12vh auto auto;
}
.palette::backdrop { background: rgba(0,0,0,.5); backdrop-filter: blur(2px); }
.palette-inner {
  background: var(--bg-elev); border: 1px solid var(--border); border-radius: 8px;
  box-shadow: var(--shadow); overflow: hidden;
}
.palette-prompt {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px; border-bottom: 1px solid var(--border);
}
.palette-prompt span { color: var(--prompt); font-weight: 700; }
.palette-prompt input {
  flex: 1; background: transparent; border: none; outline: none;
  color: var(--fg-strong); font-family: inherit; font-size: 14px;
}
.palette-list {
  list-style: none; padding: 6px 0; margin: 0; max-height: 320px; overflow-y: auto;
}
.palette-list li {
  padding: 8px 16px; cursor: pointer; display: flex; gap: 14px;
  font-size: 13px;
}
.palette-list li[aria-selected="true"] { background: color-mix(in srgb, var(--prompt) 14%, transparent); color: var(--prompt); }
.palette-list .pl-cat { color: var(--cmd); min-width: 80px; }
.palette-list .pl-name { color: var(--fg-strong); }
.palette-hint {
  margin: 0; padding: 8px 16px; border-top: 1px solid var(--border);
  font-size: 11px; color: var(--fg-muted);
}

/* ── Cheatsheet dialog ──────────────────────────────────────── */
.cheatsheet { border: none; padding: 0; background: transparent; width: min(420px, 92vw); }
.cheatsheet::backdrop { background: rgba(0,0,0,.5); backdrop-filter: blur(2px); }
.cheatsheet-inner {
  background: var(--bg-elev); border: 1px solid var(--border); border-radius: 8px;
  box-shadow: var(--shadow); padding: 20px;
}
.cheatsheet-inner h3 { margin: 0 0 14px; color: var(--fg-strong); font-size: 14px; }
.cheatsheet-inner dl { display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; margin: 0; }
.cheatsheet-inner dt { color: var(--fg-muted); }
.cheatsheet-inner dd { margin: 0; color: var(--fg-strong); }
.cheatsheet-inner kbd {
  background: var(--bg); border: 1px solid var(--border); border-radius: 3px;
  padding: 1px 6px; font-family: inherit; font-size: 11px;
}
.cheatsheet-inner button {
  margin-top: 16px; background: transparent; border: 1px solid var(--border);
  color: var(--fg); padding: 6px 12px; border-radius: 4px; cursor: pointer; font-family: inherit;
}
.cheatsheet-inner button:hover { border-color: var(--prompt); color: var(--prompt); }

/* ── Responsive ─────────────────────────────────────────────── */
@media (max-width: 640px) {
  .nav-links { display: none; }
  .work-grid, .oss-grid { grid-template-columns: 1fr; }
  .hero-name { font-size: 24px; }
  .timeline li { grid-template-columns: 1fr; gap: 4px; }
  .timeline .when { font-size: 11px; }
  .skill-group, .contact-list li { grid-template-columns: 1fr; gap: 4px; }
}
@media (max-width: 480px) {
  .ticker { display: none; }
  main { padding-bottom: 24px; }
}
```

- [ ] **Step 2: Reload the page and visually verify**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000/
```

Manually verify:
1. Dark theme renders by default (or matches system)
2. Toggle ☾/☼ → both themes look right, no jarring contrast
3. Nav is sticky at top, scroll progress bar reaches the right edge by the time you hit footer (note: scaleX won't animate yet — Task 4 wires the scroll listener)
4. Each section heading shows a blinking `▋` cursor
5. Hero name shows a blinking cursor at the end
6. Work cards and OSS cards lift on hover
7. Resize to 375px width → nav links hide, grids collapse to single column, ticker visible (hidden below 480px)
8. Focus rings visible when tabbing through (both themes)

Stop server: `kill %1`

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat(css): full terminal aesthetic with dark + light themes

GitHub-style palette tokens via CSS custom properties, sticky nav,
section dashed-rule rhythm, blinking cursors on headings, card
hover lift, palette/cheatsheet dialog styling, responsive
breakpoints at 640/480px.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Behavior — typing, scroll, copy, status, cheatsheet (`js/app.js`)

Wire up the hero typing animation, scroll progress bar, copy-to-clipboard with toast, `?` cheatsheet, `G+H` go-home shortcut.

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: Replace `js/app.js`**

```javascript
(function(){
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero typewriter
  function runTypewriter(){
    var el = document.querySelector('[data-typewriter]');
    if (!el) return;
    var target = el.getAttribute('data-typewriter');
    if (reduceMotion) { el.textContent = target; return; }
    el.textContent = '';
    var i = 0;
    function tick(){
      el.textContent = target.slice(0, ++i);
      if (i < target.length) setTimeout(tick, 32);
    }
    tick();
  }
  runTypewriter();

  // Scroll progress bar
  var progress = document.querySelector('.progress');
  function updateProgress(){
    if (!progress) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var ratio = max > 0 ? h.scrollTop / max : 0;
    progress.style.transform = 'scaleX(' + ratio + ')';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // Copy-to-clipboard with toast
  var toast = document.getElementById('toast');
  var toastTimer = null;
  function showToast(msg){
    if (!toast) return;
    toast.textContent = '// ' + msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toast.classList.remove('show'); }, 1800);
  }
  function copy(text){
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function(){ showToast('copied ' + text + ' ✓'); });
    } else {
      var t = document.createElement('textarea');
      t.value = text; t.setAttribute('readonly','');
      t.style.position = 'absolute'; t.style.left = '-9999px';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); showToast('copied ' + text + ' ✓'); }
      finally { document.body.removeChild(t); }
    }
  }
  document.addEventListener('click', function(e){
    var el = e.target.closest('[data-copy]');
    if (!el) return;
    e.preventDefault();
    copy(el.getAttribute('data-copy'));
  });

  // Expose for palette
  window.__site = { copy: copy, toast: showToast };

  // Cheatsheet dialog
  var cheat = document.getElementById('cheatsheet');
  function openCheat(){ if (cheat && !cheat.open) cheat.showModal(); }
  function closeCheat(){ if (cheat && cheat.open) cheat.close(); }
  if (cheat) {
    cheat.addEventListener('click', function(e){
      if (e.target === cheat) closeCheat();
      if (e.target.matches('[data-close]')) closeCheat();
    });
  }

  // Keyboard: ?, G+H, Esc
  var lastKey = '';
  var lastKeyAt = 0;
  document.addEventListener('keydown', function(e){
    var inField = ['INPUT','TEXTAREA'].indexOf(document.activeElement.tagName) !== -1;
    if (inField) return;

    if (e.key === '?') { e.preventDefault(); openCheat(); return; }
    if (e.key === 'Escape') { closeCheat(); return; }

    if (e.key === 'g') { lastKey = 'g'; lastKeyAt = Date.now(); return; }
    if (e.key === 'h' && lastKey === 'g' && (Date.now() - lastKeyAt) < 1000) {
      lastKey = '';
      e.preventDefault();
      var home = document.getElementById('home');
      if (home) home.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  });
})();
```

- [ ] **Step 2: Verify in the browser**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000/
```

Manually verify:
1. Hero name types in over ~1s, then blinks cursor
2. Scroll down → top progress bar fills proportionally
3. Click the `email` button in hero → toast `// copied dhrupo@gmail.com ✓` appears, paste verifies
4. Click `dhrupo@gmail.com` in contact list → same toast
5. Press `?` → cheatsheet dialog opens; Esc closes
6. Press `G` then `H` within 1s → smooth scroll back to top
7. Enable Reduce Motion in macOS → typing animation skipped, scroll is instant

Stop server: `kill %1`

- [ ] **Step 3: Commit**

```bash
git add js/app.js
git commit -m "feat(app): typewriter, scroll progress, clipboard, cheatsheet, G+H

Hero name typed in (respects reduced motion), scaleX progress bar
driven by scroll, click-to-copy with toast on any [data-copy]
element, ? opens cheatsheet dialog, G then H scrolls home.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Command palette (`js/palette.js`)

⌘/Ctrl+K opens a fuzzy-matched command palette with nav, theme, copy, open, and a `sudo` easter egg. All DOM creation uses safe DOM methods (`createElement` + `textContent`), no `innerHTML`, to keep XSS surface area at zero — even though commands are hardcoded.

**Files:**
- Modify: `js/palette.js`

- [ ] **Step 1: Replace `js/palette.js`**

```javascript
(function(){
  var dialog = document.getElementById('palette');
  var input = document.getElementById('palette-input');
  var list = document.getElementById('palette-list');
  if (!dialog || !input || !list) return;

  var COMMANDS = [
    { cat: 'nav',   name: 'about',     run: function(){ goto('#about'); } },
    { cat: 'nav',   name: 'work',      run: function(){ goto('#work'); } },
    { cat: 'nav',   name: 'oss',       run: function(){ goto('#oss'); } },
    { cat: 'nav',   name: 'notes',     run: function(){ goto('#notes'); } },
    { cat: 'nav',   name: 'contact',   run: function(){ goto('#contact'); } },
    { cat: 'theme', name: 'dark',      run: function(){ if (window.__theme) window.__theme.set('dark'); } },
    { cat: 'theme', name: 'light',     run: function(){ if (window.__theme) window.__theme.set('light'); } },
    { cat: 'theme', name: 'toggle',    run: function(){ if (!window.__theme) return; var t = window.__theme.get(); window.__theme.set(t === 'dark' ? 'light' : 'dark'); } },
    { cat: 'copy',  name: 'email',     run: function(){ if (window.__site) window.__site.copy('dhrupo@gmail.com'); } },
    { cat: 'copy',  name: 'github url',   run: function(){ if (window.__site) window.__site.copy('https://github.com/dhrupo'); } },
    { cat: 'copy',  name: 'linkedin url', run: function(){ if (window.__site) window.__site.copy('https://linkedin.com/in/niluthpal-purkayastha'); } },
    { cat: 'open',  name: 'github',    run: function(){ openUrl('https://github.com/dhrupo'); } },
    { cat: 'open',  name: 'linkedin',  run: function(){ openUrl('https://linkedin.com/in/niluthpal-purkayastha'); } },
    { cat: 'open',  name: 'wordpress', run: function(){ openUrl('https://profiles.wordpress.org/dhrupo/'); } },
    { cat: 'open',  name: 'resume',    run: function(){ openUrl('https://drive.google.com/file/d/1DuU2WIFN70kHioRdTSU-pgvZQTAWbRR-/view?usp=sharing'); } },
    { cat: 'sudo',  name: 'rm -rf ./boring-portfolio', run: runSudo, hidden: true }
  ];

  var recent = [];
  var selected = 0;
  var filtered = [];

  function goto(hash){
    closePalette();
    var el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
  function openUrl(url){
    closePalette();
    window.open(url, '_blank', 'noopener');
  }
  function runSudo(){
    closePalette();
    if (!window.__site) return;
    var msgs = ['removing ./boring-portfolio…', 'kidding 😄 the new one is right here.'];
    var i = 0;
    function step(){
      window.__site.toast(msgs[i++]);
      if (i < msgs.length) setTimeout(step, 1200);
    }
    step();
  }

  function score(query, text){
    query = query.toLowerCase();
    text = text.toLowerCase();
    if (!query) return 1;
    var qi = 0, total = 0, run = 0;
    for (var i = 0; i < text.length && qi < query.length; i++) {
      if (text[i] === query[qi]) { qi++; run++; total += 1 + run; }
      else { run = 0; }
    }
    return qi === query.length ? total : 0;
  }

  function filterCommands(q){
    var showHidden = q.toLowerCase().indexOf('sudo') === 0;
    var scored = COMMANDS
      .filter(function(c){ return showHidden ? true : !c.hidden; })
      .map(function(c){
        var key = c.cat + ' ' + c.name;
        var s = score(q, key);
        var recentBonus = recent.indexOf(key) > -1 ? 100 - recent.indexOf(key) : 0;
        return { c: c, s: s + recentBonus };
      })
      .filter(function(x){ return x.s > 0; })
      .sort(function(a,b){ return b.s - a.s; });
    return scored.map(function(x){ return x.c; });
  }

  // Safe DOM rendering — no innerHTML, all text values use textContent.
  function render(){
    while (list.firstChild) list.removeChild(list.firstChild);
    filtered.forEach(function(c, i){
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', i === selected ? 'true' : 'false');
      li.dataset.idx = String(i);

      var cat = document.createElement('span');
      cat.className = 'pl-cat';
      cat.textContent = c.cat;

      var name = document.createElement('span');
      name.className = 'pl-name';
      name.textContent = c.name;

      li.appendChild(cat);
      li.appendChild(name);

      li.addEventListener('click', function(){ runIdx(i); });
      list.appendChild(li);
    });
  }

  function runIdx(i){
    var c = filtered[i];
    if (!c) return;
    var key = c.cat + ' ' + c.name;
    recent = [key].concat(recent.filter(function(k){ return k !== key; })).slice(0, 5);
    c.run();
  }

  function openPalette(){
    if (dialog.open) return;
    input.value = '';
    filtered = filterCommands('');
    selected = 0;
    render();
    dialog.showModal();
    setTimeout(function(){ input.focus(); }, 10);
  }
  function closePalette(){ if (dialog.open) dialog.close(); }

  input.addEventListener('input', function(){
    filtered = filterCommands(input.value);
    selected = 0;
    render();
  });
  input.addEventListener('keydown', function(e){
    if (e.key === 'ArrowDown') { e.preventDefault(); selected = Math.min(selected + 1, filtered.length - 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selected = Math.max(selected - 1, 0); render(); }
    else if (e.key === 'Enter') { e.preventDefault(); runIdx(selected); }
  });
  dialog.addEventListener('click', function(e){ if (e.target === dialog) closePalette(); });

  document.addEventListener('keydown', function(e){
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (dialog.open) closePalette(); else openPalette();
    }
  });
})();
```

- [ ] **Step 2: Verify in the browser**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000/
```

Manually verify:
1. ⌘K (or Ctrl+K) opens the palette; ⌘K again closes
2. Empty palette shows all visible commands; type `wor` → filters to `nav work`; Enter scrolls to work section
3. Type `dark` → highlights `theme dark`; Enter switches to dark theme
4. Type `email` → highlights `copy email`; Enter copies to clipboard with toast
5. Type `sudo` → reveals the sudo command; Enter shows the easter-egg toasts
6. Run a command, reopen palette → most-recent command appears first
7. Backdrop click closes
8. Esc closes (via native `<dialog>`)
9. Focus is trapped inside the dialog (Tab cycles within)

Stop server: `kill %1`

- [ ] **Step 3: Commit**

```bash
git add js/palette.js
git commit -m "feat(palette): ⌘/Ctrl+K command palette with sudo easter egg

Fuzzy match on commands across nav / theme / copy / open
categories, recently-used surface first (in-memory, 5-deep),
arrow + enter navigation, native <dialog> for focus trap and Esc.
Uses createElement + textContent only — no innerHTML.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Live ticker (`js/ticker.js`)

Footer ticker shows uptime, last commit info from GitHub events API, and local time.

**Files:**
- Modify: `js/ticker.js`

- [ ] **Step 1: Replace `js/ticker.js`**

```javascript
(function(){
  var el = document.querySelector('[data-ticker]');
  if (!el) return;

  var CACHE_KEY = 'last_commit_v1';
  var CACHE_TTL_MS = 60 * 60 * 1000;

  function readCache(){
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (Date.now() - parsed.at > CACHE_TTL_MS) return null;
      return parsed;
    } catch(e) { return null; }
  }
  function writeCache(data){
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: data })); } catch(e) {}
  }

  function relativeTime(iso){
    var diffMs = Date.now() - new Date(iso).getTime();
    var mins = Math.round(diffMs / 60000);
    if (mins < 60) return mins + 'm ago';
    var hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    var days = Math.round(hrs / 24);
    if (days < 30) return days + 'd ago';
    return Math.round(days / 30) + 'mo ago';
  }

  function localTime(){
    var d = new Date();
    var hh = String(d.getHours()).padStart(2, '0');
    var mm = String(d.getMinutes()).padStart(2, '0');
    var offsetMin = -d.getTimezoneOffset();
    var sign = offsetMin >= 0 ? '+' : '-';
    var offH = Math.abs(Math.floor(offsetMin / 60));
    return hh + ':' + mm + ' UTC' + sign + offH;
  }

  function render(commit){
    var base = 'uptime — 7 years coding';
    var commitPart = commit ? ' · last commit ' + relativeTime(commit.at) + ' (' + commit.repo + ')' : '';
    var time = ' · ' + localTime();
    el.textContent = base + commitPart + time;
  }

  function fetchLastCommit(){
    var cached = readCache();
    if (cached) { render(cached.data); scheduleClockTick(cached.data); return; }
    fetch('https://api.github.com/users/dhrupo/events/public?per_page=30')
      .then(function(r){ return r.ok ? r.json() : []; })
      .then(function(events){
        var push = events.find(function(e){ return e.type === 'PushEvent'; });
        if (!push) { render(null); scheduleClockTick(null); return; }
        var data = { at: push.created_at, repo: push.repo.name };
        writeCache(data);
        render(data);
        scheduleClockTick(data);
      })
      .catch(function(){ render(null); scheduleClockTick(null); });
  }

  function scheduleClockTick(commit){
    setInterval(function(){ render(commit); }, 60 * 1000);
  }

  fetchLastCommit();
})();
```

- [ ] **Step 2: Verify in the browser**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000/
```

Manually verify:
1. Within ~1s, footer shows something like `$ uptime — 7 years coding · last commit 2h ago (dhrupo/mincut-context) · 14:32 UTC+6`
2. Reload → renders from cache instantly (no network blink)
3. Run `localStorage.removeItem('last_commit_v1')` in console, reload → fetches fresh
4. Resize to <480px → ticker hidden
5. No console errors

Stop server: `kill %1`

- [ ] **Step 3: Commit**

```bash
git add js/ticker.js
git commit -m "feat(ticker): live footer with uptime, last commit, local time

Fetches GitHub public events, picks newest PushEvent, caches for
1hr in localStorage, falls back gracefully on network error.
Local time ticks each minute. Hidden under 480px.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: OG cover SVG and README

Generate a static SVG OG cover and rewrite the README to point at the live site.

**Files:**
- Create: `assets/og-cover.svg`
- Rewrite: `README.md`

- [ ] **Step 1: Write `assets/og-cover.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0d1117"/>
  <g font-family="JetBrains Mono, ui-monospace, monospace" font-size="28" fill="#c9d1d9">
    <text x="80" y="120"><tspan fill="#56d364">~</tspan> <tspan fill="#79c0ff">whoami</tspan></text>
    <text x="80" y="200" font-size="72" font-weight="700" fill="#f0f6fc">Niluthpal Purkayastha</text>
    <text x="80" y="260" fill="#8b949e">// aka <tspan fill="#ff7b72">dhrupo</tspan> · Senior Software Engineer @ WPManageNinja</text>
    <text x="80" y="300" fill="#8b949e">// Sylhet, Bangladesh · on GitHub since 2018</text>
    <text x="80" y="420"><tspan fill="#56d364">~</tspan> <tspan fill="#79c0ff">ls</tspan> ./recent/</text>
    <text x="80" y="470" fill="#c9d1d9">  Fluent Forms <tspan fill="#8b949e">// 700K+ installs</tspan></text>
    <text x="80" y="510" fill="#c9d1d9">  Fluent Player <tspan fill="#8b949e">// video for WordPress</tspan></text>
    <text x="80" y="550" fill="#c9d1d9">  mincut-context <tspan fill="#8b949e">// context for AI agents</tspan></text>
  </g>
  <rect x="80" y="585" width="14" height="20" fill="#56d364"/>
</svg>
```

- [ ] **Step 2: Write `README.md`**

```markdown
# dhrupo-portfolio

Single-page personal site for **Niluthpal Purkayastha** (`dhrupo`) — Senior Software Engineer at WPManageNinja.

**Live:** https://dhrupo.netlify.app

## Stack

Vanilla HTML + CSS + four small JS files. No framework, no build step. Hand-written.

## Local

Open `index.html` directly, or run a tiny server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Pushing to `master` triggers a Netlify auto-deploy.

## License

MIT
```

- [ ] **Step 3: Commit**

```bash
git add assets/og-cover.svg README.md
git commit -m "chore: add OG cover SVG and rewrite README

Static SVG for og:image (no PNG export needed; valid og format).
README points at live site and explains the trivial run flow.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: End-to-end manual acceptance

Walk the full test plan from the spec, fix anything broken, commit any fixes.

**Files:** none unless fixes are needed

- [ ] **Step 1: Run the server**

```bash
cd /Volumes/Projects/dhrupo-portfolio
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000/
```

- [ ] **Step 2: Walk every spec acceptance item**

Verify each item from the spec's "Test plan" section. Tick each one off as it passes:

1. Page opens, both Chrome and Safari render correctly
2. Scroll through every section in dark theme — no overflow, no broken layout
3. Toggle to light → re-walk every section
4. Reload after toggling → theme persists, no FOUC
5. `localStorage.removeItem('theme')` + reload → matches `prefers-color-scheme`
6. Tab through everything → every focusable element has a visible outline in both themes
7. `⌘K` → palette opens, type `wor` → Enter scrolls to work
8. `⌘K` → type `dark` → Enter switches to dark
9. `⌘K` → type `email` → Enter copies to clipboard
10. `⌘K` → type `sudo` → easter egg toasts
11. `?` → cheatsheet opens; Esc closes
12. Click email button in hero → copy toast, paste verifies
13. Click `dhrupo@gmail.com` in contact list → copy toast
14. Ticker shows real "last commit" within 5s of load
15. Enable Reduce Motion → no typing, no smooth scroll, no blink
16. Resize to 375px → nav links hide, grids collapse, hero shrinks
17. Resize to 460px → ticker hides
18. No console errors in DevTools across any of the above

- [ ] **Step 3: Fix anything that failed**

If any item fails, edit the responsible file (path was listed in earlier tasks), re-verify, and commit a focused `fix(...)` commit per fix. If everything passes, skip to step 4.

- [ ] **Step 4: Run Lighthouse**

In Chrome DevTools → Lighthouse → Mobile + Desktop, incognito → "Analyze page load".

Expected: 100 / 100 / 100 / 100 across Performance / Accessibility / Best Practices / SEO.

If any score is <100, address the audit's specific findings and commit `perf(...)` / `a11y(...)` / `seo(...)` fixes as needed.

- [ ] **Step 5: Validate HTML**

Paste the source from `view-source:http://localhost:8000/` into https://validator.w3.org/nu/ → expect "no errors". Address any genuine errors (warnings about trailing slashes etc. are fine).

- [ ] **Step 6: Stop the server**

```bash
kill %1
```

- [ ] **Step 7: Commit any acceptance fixes**

Already committed per fix in Step 3. No commit here if nothing failed.

---

## Task 9: Preview locally and prompt user for push approval

Per the user's explicit instruction (`after i confirm then push it in git. lets see it in the local`), do not push until they say so.

- [ ] **Step 1: Print the diff summary for the user**

```bash
cd /Volumes/Projects/dhrupo-portfolio
git log --oneline origin/master..HEAD
git diff --stat origin/master..HEAD
```

- [ ] **Step 2: Tell the user**

Send a chat message like:

> Local preview is ready. Open file://`/Volumes/Projects/dhrupo-portfolio/index.html` (or `python3 -m http.server 8000` then http://localhost:8000) and click around — theme toggle, ⌘K palette, copy email, scroll through, resize to mobile.
>
> Diff summary above. When you say "ship it" I'll push to `origin master` and Netlify will auto-deploy.

- [ ] **Step 3: Wait for explicit "push" confirmation**

Do not run `git push` until the user replies with explicit approval. No assumptions.

- [ ] **Step 4: Push only after approval**

```bash
git push origin master
```

Verify with:

```bash
git log --oneline -3
gh run list --repo dhrupo/dhrupo-portfolio --limit 1 || true
```

Tell the user the live URL and the expected Netlify deploy window.

---

## Self-Review

**Spec coverage** — every spec requirement mapped to a task:

| Spec requirement | Task |
|---|---|
| Identity + role + location copy | Task 1 |
| Direction C terminal/dark+light | Task 1 inline theme + Task 3 CSS |
| Palette tokens (GitHub-style) | Task 3 |
| Layout: 760px, 24px gutter, 80/48px rhythm | Task 3 |
| IA: hero/about/exp/skills/work/oss/notes/contact | Task 1 |
| Hero typed-in | Task 4 |
| Theme toggle, no-FOUC, localStorage | Task 1 inline + Task 2 |
| Scroll progress bar | Task 4 + Task 3 |
| ⌘/Ctrl+K palette + sudo easter egg | Task 5 |
| `?` cheatsheet | Task 1 (dialog) + Task 4 (open/close) |
| Copy-to-clipboard + toast | Task 1 + Task 4 |
| Live ticker | Task 6 |
| Cursor blink on headings | Task 3 |
| Status pill in nav | Task 1 + Task 3 |
| View-source easter egg | Task 1 |
| Skip-link, focus rings, ARIA | Task 1 + Task 3 |
| Reduced motion | Task 3 + Task 4 |
| Responsive 640 / 480 | Task 3 |
| Lighthouse 100/100/100/100 | Task 8 |
| SEO / OG / JSON-LD | Task 1 + Task 7 |
| File structure + removals | Task 0 |
| Test plan walk | Task 8 |
| Push-only-on-approval | Task 9 |

No gaps.

**Placeholder scan** — no "TBD", "TODO", "similar to Task N", or "implement later" markers. Every code step contains complete code.

**Type / name consistency** — confirmed:
- `data-theme` set in inline init (Task 1), read by `window.__theme.get()` (Task 2), consumed by palette (Task 5)
- `data-typewriter` on `.hero-name` (Task 1), read by Task 4
- `[data-copy]` on hero email button + contact list buttons (Task 1), handled by Task 4
- `window.__site.copy` / `window.__site.toast` exposed by Task 4, consumed by Task 5
- `[data-theme-toggle]` matches between Task 1 HTML and Task 2 JS
- `#palette`, `#palette-input`, `#palette-list` match between Task 1 HTML and Task 5 JS
- `#cheatsheet`, `[data-close]` match between Task 1 and Task 4
- `.progress` class on the progress div (Task 1), styled in Task 3, animated in Task 4
- `[data-ticker]` on the ticker line (Task 1), populated by Task 6
- `LAST_COMMIT` cache key is internal to Task 6 only

All references resolve.

**Branch name note** — the existing repo uses `master`, not `main` (per `git log` output). All commands in Task 9 use `origin master`.

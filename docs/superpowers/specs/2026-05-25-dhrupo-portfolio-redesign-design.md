# Portfolio Redesign — Design Spec

- **Date:** 2026-05-25
- **Owner:** Niluthpal Purkayastha (dhrupo)
- **Repo:** https://github.com/dhrupo/dhrupo-portfolio
- **Live URL:** https://dhrupo.netlify.app/
- **Status:** design approved, ready for implementation plan

## Goal

Replace the 2021 Bootstrap portfolio with a modern single-page site that:

1. Acts as a **career signal** for recruiters and hiring managers
2. Builds **personal brand** authority for the engineer / OSS audience
3. Accurately reflects **current work** (Fluent Forms 700K+ installs, Fluent Player) and **recent AI dev-tooling** (mincut-context, codex-map, codex-claude-bridge, codex-review, workmem, growth-insights, local-chat, notifix, fluent-noc, fluentform-calculation-captcha)

Out of scope:

- Multi-page routes (no /blog yet — placeholder section only)
- Headless CMS, framework, build pipeline
- Translations / i18n
- Server-side anything

## Identity

- Primary display name: **Niluthpal Purkayastha**
- Handle / nickname: **dhrupo** (parenthetical)
- Role: **Senior Software Engineer @ WPManageNinja**
- Location: Sylhet, Bangladesh
- Tenure at WPMN: **2022 — Now**
- On GitHub since: Dec 2018 (~7 years)

## Visual direction

Direction **C — Terminal / dev-tool**, with **day + dark mode toggle**.

- One typeface: **JetBrains Mono**, weights 400 / 500 / 700, sizes hero 32, headings 18, body 14, caption 12, line-height 1.6 body / 1.2 hero
- Palette tokens (CSS custom properties, GitHub-style):

  | Token | Dark (default) | Light |
  |---|---|---|
  | `--bg` | `#0d1117` | `#ffffff` |
  | `--bg-elev` | `#161b22` | `#f6f8fa` |
  | `--border` | `#30363d` | `#d0d7de` |
  | `--fg` | `#c9d1d9` | `#1f2328` |
  | `--fg-muted` | `#8b949e` | `#656d76` |
  | `--fg-strong` | `#f0f6fc` | `#1f2328` |
  | `--prompt` | `#56d364` | `#1a7f37` |
  | `--cmd` | `#79c0ff` | `#0969da` |
  | `--accent` | `#ff7b72` | `#cf222e` |

- Layout: single column, 760px max content width, 24px gutter on mobile, 80/48px section rhythm
- Cards: 1px solid `--border`, 6px radius, hover lifts `translateY(-2px)`
- Motion: typing hero on load, theme crossfade 200ms, cursor blink 2s. Honors `prefers-reduced-motion`.
- No particles, no parallax, no scroll-jacking, no images in critical path

## Information architecture (single page, anchor nav)

Page sections render in this top-to-bottom order. Nav exposes a subset (5 anchors) to stay uncluttered; `experience` and `skills` live under the `about` anchor visually but are not separate nav items.

```
nav (sticky):  dhrupo · about · work · oss · notes · contact · ☼/☾
─────────────────────────────────────────────────────────────────
hero:          ~ whoami            (typed in, blinking cursor)
about:         ~ cat about.md      (2 short paragraphs)
experience:    ~ ls ./experience/  (vertical timeline — under #about)
skills:        ~ cat skills.json   (4 grouped categories — under #about)
work:          ~ ls ./work/        (Fluent Forms + Fluent Player, 2 large cards)
oss:           ~ ls ./oss/         (10 npm + plugin cards in grid)
notes:         ~ ls ./notes/       (coming soon placeholder)
contact:       ~ cat contact.txt   (email, socials, resume)
footer:        live ticker (uptime · last commit · local time)
```

## Copy (authoritative)

### Hero (typed in)

```
~ whoami
Niluthpal Purkayastha
// aka dhrupo · Senior Software Engineer @ WPManageNinja
// Sylhet, Bangladesh · on GitHub since 2018
```

### About

> I build WordPress products people actually use — currently **Fluent Forms** (700K+ active sites) and **Fluent Player**, where I work across PHP, Vue 3, React, Gutenberg, and REST APIs.
>
> Outside of plugin work, I build small **AI dev-tooling** — context selectors, MCP bridges, CLI helpers — most of it open source on npm. The goal is the same in both worlds: ship the smallest thing that does the job well.

### Experience timeline

- **2022 — Now** · Senior Software Engineer · WPManageNinja
- **2018 — 2022** · Web developer (open to expand if the user supplies prior roles)

### Skills

- **Languages** — PHP · JavaScript · TypeScript · HTML · CSS · SQL
- **Frontend** — Vue 3 · React · Gutenberg blocks · Element Plus · Tailwind · Vite
- **Backend** — WordPress · Laravel · Node.js · MySQL · REST APIs
- **AI / tooling** — MCP servers · Codex / Claude Code · npm publishing · GitHub Actions · PHPUnit · Playwright · PHPStan

### Featured work

1. **Fluent Forms** — Form builder for WordPress. 700K+ active installs. PHP + Vue 3 + Element Plus. Conversational, payments, integrations, signature, PDF, WPML.
2. **Fluent Player** — Video player for WordPress. PHP + Vue 3 + Gutenberg blocks. BunnyCDN / Mux integrations, subtitles, analytics, email-gate, timed content.

### OSS / npm (cards, grid)

| Project | One-liner | Stack | Link |
|---|---|---|---|
| `mincut-context` | Token-minimal context selection for AI coding agents (symbol graph + PageRank + min-cut) | TypeScript / npm | github + npm |
| `codex-map` | Visual dashboard for inspecting and mapping your Codex CLI setup | JavaScript / npm | github + npm |
| `@dhrupo/codex-claude-bridge` | Use Claude Code from inside Codex (MCP server) | JavaScript / npm | github + npm |
| `codex-review` | Local pre-PR reviewer for WPManageNinja plugin repos | JavaScript | github |
| `workmem` | Recheck-backed working memory for AI coding workflows | JavaScript | github |
| `notifix` | WordPress plugin: realtime social proof, adapter-based event pipeline | PHP | github |
| `growth-insights` | Laravel + Vue dashboard: GitHub-activity-to-growth-signals with Gemini coaching | PHP / Vue | github |
| `local-chat` | Laravel 12 + Vue 3 + WebRTC LAN chat with voice/video | PHP / Vue | github |
| `fluent-noc` | WordPress NOC manager: PDF, QR codes, email notifications | PHP | github |
| `fluentform-calculation-captcha` | Math-based spam protection for Fluent Forms (no external API) | PHP | github |

### Notes

> `// coming soon — short essays on plugin engineering & AI dev tooling`

### Contact

- Email: dhrupo@gmail.com (click-to-copy)
- GitHub: github.com/dhrupo
- LinkedIn: linkedin.com/in/niluthpal-purkayastha
- WordPress.org: profiles.wordpress.org/dhrupo
- Resume: PDF link (Google Drive link from old site is acceptable until a fresh PDF is provided)

## Interactive details

### Theme toggle

- ☼ / ☾ icon top-right of nav, `<button aria-label="Toggle theme" aria-pressed="…">`
- Inline `<head>` script (≈10 lines) reads `localStorage.theme` → `prefers-color-scheme` → applies `data-theme="dark|light"` to `<html>` **before paint** (no FOUC)
- CSS uses `[data-theme="dark"]` / `[data-theme="light"]` selectors on `:root`

### Hero typing animation

- Plain JS, ~30ms/char, blinking cursor afterwards
- `prefers-reduced-motion: reduce` → skip animation, render final state immediately

### Scroll progress bar

- 2px high at top of viewport, `--prompt` green
- CSS `scroll-timeline` with JS fallback for Safari

### `⌘/Ctrl + K` command palette

Overlay modal styled as terminal prompt:

```
>  _
   nav        about · work · oss · contact
   theme      dark · light · system
   copy       email · github · linkedin
   open       github · linkedin · wordpress.org · resume
   sudo       (try it)
```

- Fuzzy match on label, `↑↓` to navigate, `Enter` to run, `Esc` to close
- Recently-used commands surface first (in-memory only)
- `sudo` easter egg: animates `rm -rf ./boring-portfolio` then "restores" with a smile

### `?` keyboard cheatsheet

- Modal showing all shortcuts (Ctrl+K palette, G+H home, J/K scroll, T theme, ? help, Esc close)

### Copy-to-clipboard

- Click `dhrupo@gmail.com`, phone, or any social handle → copies + 2s toast `// copied to clipboard ✓` in `--prompt` green
- Uses `navigator.clipboard.writeText` with fallback to `document.execCommand('copy')`

### Live footer ticker

- Fixed bottom, collapsible
- Format: `$ uptime — 7 years coding · last commit Nh ago (<repo>) · HH:MM UTC+6`
- "last commit" fetched from `https://api.github.com/users/dhrupo/events/public` on load, picks the most recent `PushEvent`, shows relative time + repo name, cached 1hr in `localStorage`
- "local time" updates every minute, no jitter
- No build SHA shown (no build step); the deployed Netlify commit is identifiable via the GitHub repo

### Cursor blink on headings

- Each `~ command` section heading gets a trailing `▋` that blinks at 0.5Hz

### Status pill in nav

- Small `--prompt` green dot + text (`// available` / `// heads-down`)
- Manually edited in HTML — no auto-state

### View-source easter eggs

- ASCII art block at the top of `index.html` (terminal prompt motif, not a self-portrait)
- HTML comment near the top with a short friendly note for anyone reading source (final wording drafted during implementation, kept under 6 lines)

## Accessibility

- All nav links are `<a href="#anchor">` — works with JS disabled
- Skip-link to `#main` for screen readers
- Theme toggle and palette toggle are `<button>` with proper labels
- Project cards are full `<a>` blocks — entire card clickable
- Focus rings visible on both themes (not removed via CSS reset)
- Contrast: both palettes pass WCAG AA on body text (GitHub tokens are pre-verified)
- Modal command palette traps focus, closes on Esc, restores focus on close
- All animations respect `prefers-reduced-motion`

## Responsive

- Mobile-first, single column always
- Nav collapses to hamburger under 640px (full-screen overlay menu)
- Hero scales 32 → 24px under 600px
- OSS grid: 2-col → 1-col under 640px
- Live footer hidden under 480px

## Performance

- No framework, no Bootstrap, no jQuery, no particles.js, no build step
- Single CSS file plus four small JS files loaded with `<script defer>` (~3-4KB minified total combined)
- JetBrains Mono via `<link rel="preconnect">` + `font-display: swap`
- No images in critical path
- Lighthouse target: 100 / 100 / 100 / 100

## SEO / meta

- `<title>`: `Niluthpal Purkayastha (dhrupo) — Senior Software Engineer`
- `<meta name="description">`: matches hero copy (~150 chars)
- Open Graph + Twitter card with auto-generated 1200×630 terminal screenshot at `assets/og-cover.png`
- JSON-LD `Person` schema with `name`, `alternateName`, `jobTitle`, `worksFor`, `sameAs` (GitHub, LinkedIn, WordPress.org)
- `<link rel="canonical">` to live URL

## File structure (post-redesign)

```
dhrupo-portfolio/
├── index.html              ← single page, ~400 lines
├── style.css               ← all styles, ~600 lines, both themes
├── js/
│   ├── theme.js            ← inline-loaded in <head>, no FOUC
│   ├── app.js              ← typing, smooth scroll, copy-toast
│   ├── palette.js          ← Ctrl+K command palette
│   └── ticker.js           ← live footer (uptime, time, last commit)
├── assets/
│   ├── favicon.svg         ← terminal prompt "$_" mark
│   ├── og-cover.png        ← 1200×630 terminal screenshot
│   └── resume.pdf          ← (Google Drive link acceptable until fresh PDF supplied)
├── docs/superpowers/specs/ ← this file lives here
├── README.md               ← short, links to live site
└── .gitignore              ← excludes .superpowers/, .DS_Store, node_modules/, *.log
```

## Files to remove from current repo

- `images/person1.png`
- `js/particles.js`
- Old `style.css`
- Old `index.html` (full rewrite)
- All Bootstrap, tiny-slider, bootstrap-icons CDN links
- Lorem ipsum testimonials section
- The 6 student-era project cards (Buy Cycle, City Rider, Clean BD, Hungry Monster, Photo X Web, Hard Rock App)

## Test plan (manual — vanilla static site, no test runner)

1. Open `index.html` directly in Chrome and Safari locally (`file://` URL — pure static)
2. Visual: scroll through all sections in both themes — no overflow, no broken layout
3. Theme: toggle, refresh — verify no FOUC, persists across reload, follows system preference on first visit
4. Keyboard: tab through every interactive element, focus rings visible in both themes
5. `Ctrl+K`: open, fuzzy-search, run nav / theme / copy / open commands, try `sudo`
6. `?`: opens cheatsheet, lists all shortcuts, closes on Esc
7. Copy: click email and each handle → toast appears, paste verifies clipboard contents
8. Ticker: footer shows real "last commit" within 1 hr of opening, local time updates each minute
9. Reduced motion: enable in macOS Accessibility → typing animation skipped, no cursor blink
10. Mobile: Chrome DevTools 375px → nav collapses, layout single-column, hero scales, OSS grid 1-col
11. Lighthouse: run in DevTools incognito → confirm 100/100/100/100
12. W3C HTML validator: clean
13. No console errors or warnings on load in Chrome / Safari / Firefox

## Deploy flow

Per the user's explicit instruction: **preview locally first, then push only after explicit confirmation per push**.

1. Implement on `main` branch in `/Volumes/Projects/dhrupo-portfolio/`
2. User opens `index.html` locally to preview
3. User says "ship it" → I show the diff summary + commit message
4. User explicitly approves → I `git push origin main`
5. Netlify auto-deploys (already wired)

### Explicit "will-not-do" list

- No new GitHub branches without ask
- No force pushes, no rebases
- No commits to `main` until local preview approved
- No `--no-verify` or hook bypass
- No deletion of `.git/info/exclude` or existing git config
- No publishing of `.superpowers/` brainstorm files (excluded via `.gitignore`)

## Open questions (do not block design, resolve during implementation)

- Resume PDF: keep existing Google Drive link or supply a fresh `assets/resume.pdf`? (Default: keep link.)
- Pre-2022 work history: any prior employer to list, or just keep `2018 — 2022 · Web developer`? (Default: keep generic.)
- Secondary site `niluthpalpurkayastha.netlify.app`: keep alive, redirect, or ignore? (Default: ignore — out of scope.)
- Resume URL on hero CTA: keep existing Google Drive link or wait for fresh PDF? (Default: keep existing.)

## Acceptance criteria

The redesign is complete when:

1. All sections render correctly in both themes in Chrome, Safari, Firefox latest
2. All 13 test-plan items pass
3. Lighthouse hits 100/100/100/100 in incognito on the local file
4. The 6 old student projects, Lorem ipsum testimonials, particles.js, Bootstrap CDN, person1.png are all removed
5. User previews locally and explicitly approves the push

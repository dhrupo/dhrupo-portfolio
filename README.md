# dhrupo-portfolio

Single-page personal site for **Niluthpal Purkayastha** (`dhrupo`) — Senior Software Engineer at [WPManageNinja](https://wpmanageninja.com/).

**Live:** https://dhrupo.netlify.app

## Stack

Vanilla HTML + CSS + a handful of small JS files. No framework, no build step.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Rebuild the CV PDF

After editing `cv.html`, regenerate `assets/cv.pdf` (single-page A4):

```bash
./scripts/build-cv-pdf.sh
```

Requires Google Chrome (macOS path baked in; override with `CHROME=/path/to/chrome`). Script fails non-zero if the result is not exactly one page.

## Deploy

Pushing to `master` triggers a Netlify auto-deploy.

## License

MIT

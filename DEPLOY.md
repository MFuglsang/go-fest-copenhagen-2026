# Deployment til GitHub Pages

## Setup

1. **Klon repo og installer dependencies:**
   ```bash
   npm install
   ```

2. **Opret `.env` fil baseret på `.env.example`:**
   ```bash
   cp .env.example .env
   ```

3. **Hent din API key fra Datafordeler:**
   - Gå til https://datafordeler.dk
   - Opret en bruger eller log ind
   - Generer en API nøgle
   - Indsæt nøglen i `.env`: `VITE_DATAFORDELER_API_KEY=your-key`

## Deploy til GitHub Pages

### Option A: Automatisk deploy med GitHub Actions (anbefalet)

1. **Opret GitHub Secret:**
   - Gå til Settings → Secrets and variables → Actions
   - Opret ny secret: `DATAFORDELER_API_KEY` = din API nøgle

2. **Opret `.github/workflows/deploy.yml`:**
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
         
         - name: Install dependencies
           run: npm install
         
         - name: Build
           run: npm run build
           env:
             VITE_DATAFORDELER_API_KEY: ${{ secrets.DATAFORDELER_API_KEY }}
             VITE_BASE_URL: /${{ github.event.repository.name }}/
         
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. **Push til GitHub:**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push origin main
   ```

### Option B: Manuel deploy (one-time)

1. **Build lokalt:**
   ```bash
   VITE_DATAFORDELER_API_KEY=your-key npm run build
   ```

2. **Deploy dist folder:**
   ```bash
   npm install -g gh-pages
   gh-pages -d dist
   ```

## Sikkerhed

- `.env` filen er i `.gitignore` og bliver IKKE committed til GitHub
- Datafordeler API key kan være offentlig (bruges fra browser)
- GitHub Secrets bruges kun til automated deploys og vises IKKE i logs
- API requestene kommer fra brugerens browser, ikke fra server

## Repository Settings

I GitHub Settings:
1. Gå til Pages
2. Sæt "Build and deployment" source til "Deploy from a branch"
3. Vælg branch: `gh-pages` (oprettes automatisk af deploy workflow)

## Testing lokalt

```bash
npm run build
npm run preview
```

Åbn http://localhost:4173 i browser.

# AviLab website

Static site for **AviLab**, an independent software studio. No build step, no framework, no backend. Designed to be served as-is from GitHub Pages.

This repository is only the website. It is not inside the SUPKA, Car Wallet, or Sea Battle app projects.

## Local preview

From this folder:

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

## GitHub Pages

1. Push this repo to GitHub (suggested name: `avilab`).
2. Settings → Pages → Deploy from a branch → `main` / `/ (root)`.
3. If the site is a **project** site, it will live at:

   `https://YOUR-USERNAME.github.io/avilab/`

   Relative paths are already used, so that layout works.
4. Then replace every `https://avi-ca.github.io/avilab/` placeholder in:

   - `index.html`, `privacy.html`, `terms.html` (canonical + Open Graph URLs)
   - `robots.txt`
   - `sitemap.xml`

   If you later add a custom domain, put the host in a `CNAME` file (see `CNAME.example`) and use `https://your-domain/` as the canonical URL.

`.nojekyll` is included so GitHub Pages does not run Jekyll.

## What to replace before this feels finished

### 1. App Store URL for SUPKA

Car Wallet already uses the real listing:

`https://apps.apple.com/app/car-wallet/id6781877158`

SUPKA is marked **Available on the App Store**, but there was no public numeric ID in the SUPKA project, and the App Store search did not return the app. The homepage badge is therefore **not a link**.

In `index.html`, find `id="SUPKA_STORE"` and wrap the badge:

```html
<a class="store-badge" id="SUPKA_STORE" href="https://apps.apple.com/app/idYOUR_NUMERIC_ID">
  <img src="./assets/badges/app-store.svg" width="156" height="52" alt="Download SUPKA on the App Store">
</a>
```

Do not invent an ID.

### 2. App icons

Real icons were copied in as a starting point. Replace anytime the store icon changes:

| File | Product |
| --- | --- |
| `assets/apps/supka/icon.png` | SUPKA (512×512 or 1024×1024 PNG) |
| `assets/apps/car-wallet/icon.png` | Car Wallet |
| `assets/apps/sea-battle/icon.jpg` | Sea Battle (PNG is fine; update the `src` in `index.html`) |

### 3. Product artwork / screenshots

| File | Now | Replace with |
| --- | --- | --- |
| `assets/apps/supka/artwork.svg` | Device illustration | Real Watch + iPhone screenshots or a marketing composition |
| `assets/apps/sea-battle/artwork.svg` | Grid illustration | Game screenshot or key art when you are ready to show it |
| `assets/apps/car-wallet/screenshot-1.jpg` | Current App Store marketing screenshot | A tighter crop or a newer shot |
| `assets/apps/car-wallet/screenshot-2.jpg` | Extra store screenshot, unused on the page | Optional second frame |

Keep files small. Prefer compressed WebP/JPG for photos and PNG/SVG for icons.

### 4. Brand / SEO images

| File | Use |
| --- | --- |
| `assets/brand/favicon.svg` | Tab icon |
| `assets/brand/mark.svg` | Wordmark mark |
| `assets/brand/apple-touch-icon.png` | iOS home-screen icon (180×180) |
| `assets/brand/og.jpg` | Open Graph / Twitter image |
| `assets/brand/og.svg` | Editable source for the OG layout |

### 5. Legal pages

`privacy.html` and `terms.html` match the site visually. Highlighted blocks are **placeholders**. Fill in:

- legal name of the publisher
- hosting / log retention
- per-app data practices (do not copy Car Wallet’s nutrition labels onto SUPKA or Sea Battle)
- third-party processors
- EULA choice (Apple standard vs custom)
- warranty / consumer-law language for the places you actually sell

Do not publish those pages as “finished legal documents” until the placeholders are gone. The support email already used on the site is `avi.apps.labs@gmail.com`.

### 6. Sea Battle status

The site labels Sea Battle **In development** and does not offer an App Store button. When it is actually for sale, change the chip, add the store URL, and only then describe shipping privacy practices.

## Product facts used on the site

Pulled from the live Car Wallet listing, not invented:

- **Category:** Utilities
- **Platforms:** iPhone and iPad
- **Status:** Available on the App Store
- **Copy:** fuel, maintenance, expenses, documents, ownership history

SUPKA uses your brief (Apple Watch / iPhone training companion). Sea Battle uses your brief (game, local multiplayer, in development).

## Files

```
index.html          Home
privacy.html        Privacy Policy
terms.html          Terms of Use
404.html            GitHub Pages not-found page
styles.css
script.js           Header state + reduced-motion-aware reveal
site.webmanifest
robots.txt
sitemap.xml
assets/
```

## Suggestions (optional)

- Attach the SUPKA store ID as soon as App Store Connect shows it; that is the one incomplete public link.
- When Sea Battle ships, promote it to the featured row if you want the game to lead, and keep Car Wallet as the utility beside it.
- A custom domain (for example `avilab.app`) will read more like a studio and less like a project page.
- Official [Apple App Store badge assets](https://developer.apple.com/app-store/marketing/guidelines/) can replace `assets/badges/app-store.svg` if you want pixel-perfect marketing art.
- Product pages (`supka.html`, `car-wallet.html`) can wait. The homepage is enough until you have screenshots and store URLs for every app.

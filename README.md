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

The live site is a **project** site:

**English (default):** https://avi-ca.github.io/avilab/  
**Ukrainian:** https://avi-ca.github.io/avilab/uk/

`https://avi-ca.github.io/` (no `/avilab/`) will 404 until you create a user site repo named `AVI-CA.github.io`.

`https://avi-ca.github.io/` (no `/avilab/`) will 404 until you create a user site repo named `AVI-CA.github.io`.

Pages deploys from `main` / `/ (root)`. After a push it usually takes 30–90 seconds.

If you later add a custom domain, put the host in a `CNAME` file (see `CNAME.example`) and update the canonical URLs in `index.html`, `privacy.html`, `terms.html`, `robots.txt`, and `sitemap.xml`.

`.nojekyll` is included so GitHub Pages does not run Jekyll.

## Product status on the homepage

The featured list is the studio story, in order:

| Product | Visitor label | Internal status | App Store badge |
| --- | --- | --- | --- |
| **Car Wallet** | Available | Shipped | Yes — live URL |
| **Sea Battle** | Coming soon to the App Store | App Review | No — listing may not be public yet |
| **SUPKA** | In development | Building | No |

When Apple approves Sea Battle, change the App Review chip to Available and add the store URL in `index.html` (`#sea-battle`). Do not add a badge until the public listing exists.

## What to replace

### 1. Sea Battle App Store URL (after approval)

Car Wallet already uses the real listing:

`https://apps.apple.com/app/car-wallet/id6781877158`

Sea Battle should get the same treatment only after the listing is live. Keep SUPKA as in development until you are ready to submit it.

### 2. App icons

Real icons were copied in as a starting point. Replace anytime the store icon changes:

| File | Product |
| --- | --- |
| `assets/apps/supka/icon.png` | SUPKA (512×512 or 1024×1024 PNG) |
| `assets/apps/car-wallet/icon.png` | Car Wallet |
| `assets/apps/sea-battle/icon.jpg` | Sea Battle (PNG is fine; update the `src` in `index.html`) |

### 3. Product artwork / screenshots

Screenshots must be **portrait iPhone screen captures**, not cropped marketing frames. The site shows them inside an iPhone bezel with `object-fit: contain`.

| File | Now |
| --- | --- |
| `assets/apps/car-wallet/screen-1.jpg` | Dashboard from iCloud `ScreenS CAR WALLET` (iPhone 17 Pro Max, 1320×2868) |
| `assets/apps/car-wallet/screen-3.jpg` | Vehicles / documents from the same folder |
| `assets/apps/sea-battle/screen-menu.jpg` | `docs/store/screenshots/iphone-69-menu.png` |
| `assets/apps/sea-battle/screen-battle.jpg` | `docs/store/screenshots/iphone-69-battle.png` |
| `assets/apps/supka/screen-1.jpg` | **Add this** — see size below |
| `assets/apps/supka/screen-2.jpg` | **Add this** — second angle |

### SUPKA screenshot size

Use the same size you would upload to App Store Connect for **iPhone 6.9"**:

**1320 × 2868 px, portrait, PNG or JPEG**

Also accepted by Apple for 6.9": 1290 × 2796 or 1260 × 2736. For this website, **1320 × 2868** matches Sea Battle and will drop straight into the iPhone frame.

Export **full-screen UI** (status bar included is fine). Do not add extra headlines around the phone.

Then replace the SUPKA placeholder in `index.html` and `uk/index.html`:

```html
<img src="./assets/apps/supka/screen-1.jpg" width="660" height="1434" alt="SUPKA on iPhone">
```

A second frame can use `screen-2.jpg`. Watch screenshots are optional later.

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

## Product facts used on the site

Pulled from the live Car Wallet listing, not invented:

- **Category:** Utilities
- **Platforms:** iPhone and iPad
- **Status:** Available on the App Store
- **Copy:** fuel, maintenance, expenses, documents, ownership history

Sea Battle is a game for iPhone and iPad, currently in App Review. SUPKA is a fitness companion for Apple Watch and iPhone, currently in development.

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

- When Sea Battle is approved, swap App Review → Available and add the public App Store URL. That is a two-line change in `index.html`.
- Real Sea Battle screenshots will carry the featured row better than the current grid illustration.
- A custom domain (for example `avilab.app`) will read more like a studio and less like a project page.
- Official [Apple App Store badge assets](https://developer.apple.com/app-store/marketing/guidelines/) can replace `assets/badges/app-store.svg` if you want pixel-perfect marketing art.

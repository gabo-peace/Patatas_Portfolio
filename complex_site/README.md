# NZV Studio — Portfolio Complex README
## (Dark / Maximalist / Poster edition)

## Quick link index
- [File structure](#file-structure)
- [Hero image](#hero-image)
- [Logos & brand assets](#logos--brand-assets)
- [Work items](#work-items)
- [Personal projects](#personal-projects)
- [About photo](#about-photo)
- [Shop items](#shop-items)
- [Colours & typography](#customising-colours--typography)
- [Contact form](#connecting-the-contact-form)
- [Launching locally](#launching-locally)
- [Deployment checklist](#deployment-checklist)

---

## File structure

```
Patatas_Portfolio_Complex/
├── index.html                 ← single-page site
├── css/
│   └── styles.css             ← all styles
├── js/
│   └── main.js                ← all interactions
├── assets/
│   ├── logos/                 ← brand logo files
│   └── images/
│       ├── hero.jpg           ← hero centre image (see below)
│       ├── work/              ← client project cover images
│       ├── personal/          ← personal project cover images
│       ├── about/             ← your portrait photo
│       └── shop/              ← product images
└── README.md
```

---

## Hero image

| File | `assets/images/hero.jpg` |
|------|--------------------------|
| Dimensions | **960 × 1200 px** · portrait orientation |
| Aspect ratio | 4 / 5 (the frame crops automatically) |
| Format | JPG or WebP |
| File size | Target **< 500 KB** |
| Style | Your best / most iconic brand work — a mockup, flat-lay or styled shot that reads strongly at medium size. It floats in the centre of the dark hero. |

If the file is missing the frame shows a placeholder reminder.

---

## Logos & brand assets

| File | Purpose | Required? |
|------|---------|-----------|
| `assets/logos/logo-light.svg` | Nav logo (shown on dark background) | **Yes** |
| `assets/logos/favicon.svg` | Browser tab icon | Recommended |

### Logo specs
- **Format:** SVG preferred (scales perfectly, small file size)
- **Colour:** White or light cream — the nav background is dark
- **Height:** Sized automatically to 32 px tall in the nav
- **File size:** Keep SVG under 20 KB

> The CSS applies `filter: invert(1) brightness(2)` to the img tag as a fallback, so a dark SVG logo will also appear white. Remove that filter rule in `css/styles.css` if your SVG already uses light colours.

---

## Work items

Work cover images → **`assets/images/work/`**

### Naming convention

Each project uses one cover image:

```
project-01-cover.jpg    ← Studio Verdure (large card)
project-02-cover.jpg    ← Arca Coffee
project-03-cover.jpg    ← Mast Type Specimen
project-04-cover.jpg    ← Solstice (wide card)
project-05-cover.jpg    ← Mira Interiors
project-06-cover.jpg    ← Fenix Records
```

Numbers match the order `<article>` blocks appear in `index.html`.

### Image specs by card size

| Card type | HTML class | Dimensions | Aspect ratio | Max file size |
|-----------|------------|------------|--------------|---------------|
| Normal | `work-card` | 1600 × 1600 px | 1:1 | 400 KB |
| Large | `work-card--large` | 1600 × 1200 px | 4:3 | 500 KB |
| Wide | `work-card--wide` | 2400 × 1000 px | ~21:9 | 600 KB |

All images should be set to **sRGB**, **72 dpi**, saved for web.

### Card size layout
The work grid is 12 columns. Assign sizes by adding classes to `<article>`:

| Class | Columns | Best for |
|-------|---------|---------|
| *(default)* | 4 | Logo close-ups, colour swatches |
| `work-card--large` | 8 | Featured branding spreads |
| `work-card--wide` | 12 | Full-system brand rollouts |

### Categories for the filter

| `data-category` | Filter label |
|-----------------|-------------|
| `branding` | Branding |
| `logo` | Logo |
| `typography` | Type |
| `palette` | Colour |

### Adding a new project card

1. Duplicate any `<article class="work-card …">` in `index.html`
2. Set `data-category` to one of the values above
3. Set `data-category` the card size class if needed
4. Update `src`, `alt`, title tags and year
5. Drop the cover image in `assets/images/work/`

---

## Personal projects

Personal covers → **`assets/images/personal/`**

### Naming convention

```
personal-01-cover.jpg   ← 36 Days of Type
personal-02-cover.jpg   ← Imaginary Brands
personal-03-cover.jpg   ← Colour Archive
```

### Image specs

| Property | Value |
|----------|-------|
| Format | JPG or WebP |
| Dimensions | **2400 × 1600 px** minimum |
| Aspect ratio | 3:2 (fixed, crops automatically) |
| File size | Target **< 600 KB** |
| Style | Wide editorial shot — spreads, process, installation. These appear large. |

### Adding a personal item

Copy an `<article class="personal-item …">` block and update the number, title, description and image path.

---

## About photo

**`assets/images/about/portrait.jpg`**

| Property | Value |
|----------|-------|
| Format | JPG or WebP |
| Dimensions | **1200 × 1500 px** (portrait) |
| Aspect ratio | 4:5 on desktop, 3:2 on tablet (auto-cropped) |
| File size | Target **< 500 KB** |
| Style | You on a neutral or brand-coloured background. The section has a dark page bg so high-contrast or confident colours work well. |

If the file is missing the column shows a small text placeholder.

---

## Shop items

Product images → **`assets/images/shop/`**

### Naming convention

```
product-01.jpg    ← Brand Identity Starter Kit
product-02.jpg    ← Moodboard Kit
product-03.jpg    ← Colour Harmony Print
product-04.jpg    ← Type Hierarchy Sheet
```

### Image specs

| Property | Value |
|----------|-------|
| Format | JPG or WebP |
| Dimensions | **1200 × 1200 px** |
| Aspect ratio | 1:1 (square, fixed) |
| File size | Target **< 300 KB** |
| Style | Clean mockup on dark or neutral background. The section bg is dark. |

### Linking to your store

Replace `href="#"` on each `.shop-card__link` with your product URL:

```html
<a href="https://yourstore.gumroad.com/l/product-id" …>
```

---

## Customising colours & typography

All design tokens are in the `:root { }` at the top of `css/styles.css`:

```css
:root {
  --clr-black:     #0B0A08;   /* page background                    */
  --clr-dark:      #141310;   /* alternate dark section background  */
  --clr-ink:       #F0EAE0;   /* primary text (warm cream)          */
  --clr-ink-muted: #8A8070;   /* secondary text                     */
  --clr-accent:    #E8622A;   /* brand accent ← change this         */
  --clr-accent-alt:#A03A10;   /* darker accent, used on hover       */
  --clr-border:    #2A2820;   /* dark-bg borders                    */
}
```

Change `--clr-accent` to your brand colour. Every button, chip, hover state, marquee strip, and animated element will update automatically.

### Fonts

| Variable | Font | Use |
|----------|------|-----|
| `--font-display` | **Bebas Neue** | All section headings, hero labels, nav logo |
| `--font-serif` | **DM Serif Display** | Italic accents inside headings |
| `--font-sans` | **Inter** | Body text, form labels, small UI |

To swap fonts update the Google Fonts `<link>` in `index.html` and the variable values in `css/styles.css`.

---

## Connecting the contact form

### Option A — Formspree (free, no backend — recommended)

1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form — copy the form ID (e.g. `xpzgkqbb`)
3. Open `js/main.js` and replace `'YOUR_FORM_ID'`:

```js
const FORMSPREE_ID = 'xpzgkqbb'; // ← paste your ID here
```

### Option B — mailto fallback

Uncomment the mailto block (~line 140 in `js/main.js`) and comment out the fetch block. No backend required.

---

## Launching locally

No build step. Open `index.html` directly, or use a small local server:

```bash
# Python 3
python -m http.server 3000

# Node (npx)
npx serve .
```

Visit `http://localhost:3000`.

---

## Deployment checklist

- [ ] Add `assets/logos/logo-light.svg` (white/light version)
- [ ] Add `assets/logos/favicon.svg`
- [ ] Add `assets/images/hero.jpg` (960 × 1200 px)
- [ ] Add all work covers (`project-01-cover.jpg` to `project-06-cover.jpg`)
- [ ] Add all personal covers (`personal-01-cover.jpg` to `personal-03-cover.jpg`)
- [ ] Add `assets/images/about/portrait.jpg`
- [ ] Add all shop images (`product-01.jpg` to `product-04.jpg`)
- [ ] Update `--clr-accent` in `css/styles.css` to your brand colour
- [ ] Update placeholder text in `index.html` (hero bio, about copy, city, prices)
- [ ] Replace shop `href="#"` links with real product URLs
- [ ] Set Formspree ID in `js/main.js` (or enable mailto fallback)
- [ ] Fill in real client testimonials (About section)
- [ ] Optimise all images: [Squoosh](https://squoosh.app) or [TinyPNG](https://tinypng.com)
- [ ] Test on mobile

---

*Questions? hi@nzvstudio.com*

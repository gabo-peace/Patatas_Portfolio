# NZV Studio — Portfolio README

## Quick link index
- [File structure](#file-structure)
- [Logos & brand assets](#logos--brand-assets)
- [Work items](#work-items)
- [Personal projects](#personal-projects)
- [About photo](#about-photo)
- [Shop items](#shop-items)
- [Colours & typography](#customising-colours--typography)
- [Contact form](#connecting-the-contact-form)
- [Launching locally](#launching-locally)

---

## File structure

```
Patatas_Portfolio/
├── index.html                 ← single-page site
├── css/
│   └── styles.css             ← all styles (edit to change colours/fonts)
├── js/
│   └── main.js                ← interactions (cursor, filter, form)
├── assets/
│   ├── logos/                 ← brand logo files (see below)
│   └── images/
│       ├── work/              ← client project covers
│       ├── personal/          ← personal project covers
│       ├── about/             ← your portrait
│       └── shop/              ← product images
└── README.md
```

---

## Logos & brand assets

| File | What it does | Required? |
|------|-------------|-----------|
| `assets/logos/logo.svg` | Main logo shown in the nav bar | **Yes** |
| `assets/logos/favicon.svg` | Browser tab icon | Recommended |
| `assets/logos/logo-dark.svg` | Optional dark version (not wired up by default) | Optional |

### Logo specs
- **Format:** SVG (preferred) or PNG with transparent background
- **Dimensions:** Unconstrained — the nav scales it to 36 px tall automatically
- **File size:** Keep SVG under 20 KB; PNG under 100 KB
- **Colour:** Your normal brand colour. The dark/frosted nav background is `rgba(247,246,242,0.92)` so a dark logo works well.

### Favicon
- SVG favicon is the most future-proof option
- Alternatively use a 32×32 px `.ico` file and update the `<link rel="icon">` tag in `index.html` accordingly

---

## Work items

Work item images live in: **`assets/images/work/`**

### Naming convention
Each project needs **one cover image** (used in the grid):

```
project-01-cover.jpg
project-02-cover.jpg
project-03-cover.jpg
…
```

Numbers must match the order the `<article>` blocks appear in `index.html`.

### Image specs

| Property | Value |
|----------|-------|
| Format | **JPG** (photos/mockups) · **PNG** (flat graphics) · **WebP** (smaller file size, modern browsers) |
| Dimensions | **1600 × 1200 px** minimum (displayed at 4:3 aspect ratio) |
| Resolution | 72 dpi (screen only) |
| Colour space | sRGB |
| File size | Target **< 400 KB** per image (use Squoosh, TinyPNG, or ImageOptim) |
| Subject | Mockups, brand boards, colour swatches, logo sheets, type specimens — any flat-lay or styled shot of your work |

### Adding a new work card

1. Copy an existing `<article class="project-card …">` block in `index.html`
2. Set `data-category` to one of: `branding` · `logo` · `typography` · `palette`
3. Update `src`, `alt`, `project-card__title`, tags and year
4. Drop the cover image in `assets/images/work/`

### Categories (filter tabs)

| `data-category` value | Shown in filter as |
|-----------------------|--------------------|
| `branding` | Branding |
| `logo` | Logo |
| `typography` | Typography |
| `palette` | Colour |

To add a **new category**, update both the filter button in the HTML *and* your card's `data-category`.

---

## Personal projects

Personal project images live in: **`assets/images/personal/`**

### Naming convention

```
personal-01-cover.jpg
personal-02-cover.jpg
personal-03-cover.jpg
```

### Image specs

| Property | Value |
|----------|-------|
| Format | JPG · PNG · WebP |
| Dimensions | **2400 × 1600 px** minimum (displayed at 3:2 aspect ratio) |
| Resolution | 72 dpi |
| File size | Target **< 600 KB** per image |
| Subject | Process shots, spreads, editorial flats — something that reads clearly at large scale, since these images appear wider than work grid images |

### Adding a new personal item

Copy an `<article class="editorial-item …">` block in `index.html` and update the sequential number, title, description, and image path.

---

## About photo

File location: **`assets/images/about/portrait.jpg`**

| Property | Value |
|----------|-------|
| Format | JPG or WebP |
| Dimensions | **1200 × 1500 px** (portrait orientation — displayed at 4:5 aspect ratio) |
| Resolution | 72 dpi |
| File size | Target **< 500 KB** |
| Style | Neutral or on-brand background; professional or editorial feel |

If the file is missing the section shows a placeholder reminder automatically.

---

## Shop items

Shop product images live in: **`assets/images/shop/`**

### Naming convention

```
product-01.jpg
product-02.jpg
product-03.jpg
product-04.jpg
```

### Image specs

| Property | Value |
|----------|-------|
| Format | JPG · PNG · WebP |
| Dimensions | **1200 × 1200 px** (displayed square at 1:1 aspect ratio) |
| Resolution | 72 dpi |
| File size | Target **< 300 KB** per image |
| Style | Clean product flat-lay or mockup on a neutral background; badge (`Digital` / `Print`) is overlaid automatically |

### Adding a shop item

1. Copy a `<article class="shop-card …">` block in `index.html`
2. Replace `href="#"` with your Gumroad / Etsy / Shopify product URL
3. Set `shop-card__badge` text to `Digital` or `Print`
4. Update price, title, description and image path

---

## Customising colours & typography

All colour and font variables are at the top of `css/styles.css` in the `:root { }` block:

```css
:root {
  --clr-bg:          #F7F6F2;   /* page background */
  --clr-bg-alt:      #EFEDE7;   /* alternate section background */
  --clr-ink:         #111110;   /* primary text */
  --clr-ink-muted:   #6B6B60;   /* secondary text */
  --clr-accent:      #C9A96E;   /* brand accent colour ← change this */
  --clr-accent-dark: #A07840;   /* darker shade of accent */
  --clr-border:      #DDDBD4;   /* subtle borders */
}
```

Change `--clr-accent` and `--clr-accent-dark` to match your brand colour. Every button, hover state, tag highlight, and animated element will update automatically.

### Fonts

Loaded from Google Fonts (no install needed):
- **DM Serif Display** — headings and the hero title (`--font-serif`)
- **Inter** — body and UI text (`--font-sans`)

To swap fonts, replace the `<link>` tag in `index.html` and update the `--font-serif` / `--font-sans` variables in CSS.

---

## Connecting the contact form

The form works in two modes:

### Option A — Formspree (free, no backend needed — recommended)

1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form and copy your form ID (looks like `xpzgkqbb`)
3. Open `js/main.js` and replace `'YOUR_FORM_ID'` on this line:

```js
const FORMSPREE_ID = 'YOUR_FORM_ID'; // ← paste your ID here
```

Submissions appear in your Formspree dashboard and are forwarded to your email.

### Option B — mailto fallback

Uncomment the `mailto` block near line 115 in `js/main.js` and comment out the fetch block. Opens the visitor's email client pre-filled with their message.

---

## Launching locally

No build step needed. Open `index.html` directly in a browser, **or** use a simple local server to avoid CORS issues with images:

```bash
# Python 3
python -m http.server 3000

# Node (npx)
npx serve .
```

Then visit `http://localhost:3000`.

---

## Deployment checklist

- [ ] Replace `assets/logos/logo.svg` with your real logo
- [ ] Add `assets/logos/favicon.svg`
- [ ] Add all work cover images (`project-01-cover.jpg` … )
- [ ] Add all personal project covers (`personal-01-cover.jpg` … )
- [ ] Add `assets/images/about/portrait.jpg`
- [ ] Add all shop product images (`product-01.jpg` … )
- [ ] Update placeholder text in `index.html` (hero tagline, about bio, city)
- [ ] Update social links in `index.html` and `css/styles.css` (they use real NZV Studio URLs already)
- [ ] Set Formspree ID in `js/main.js` or switch to mailto fallback
- [ ] Update copyright year in footer if needed
- [ ] Optimise all images with [Squoosh](https://squoosh.app) or [TinyPNG](https://tinypng.com)
- [ ] Test on mobile (Chrome DevTools → Responsive mode)

---

*Questions? hi@nzvstudio.com*

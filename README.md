# BAKI Fine Jewellery — Website

Front-end for **BAKI**, contemporary fine jewellery inspired by the arched windows of Beirut's traditional houses.
It is a static site built with plain HTML, CSS and JavaScript. There is no framework and no build step.

## Run it locally

Any static file server works. From this folder:

```bash
npx serve .
```

or

```bash
python -m http.server 8000
```

Then open `http://localhost:3000` for `npx serve`, or `http://localhost:8000` for Python.
Opening `index.html` directly from disk also works, but the video and fonts load more reliably through a server.

## Structure

```
baki-site/
├── index.html          Home: hero film, arched windows, sketch-to-jewel scene, pieces, founder story
├── shop.html           Collection grid with category filters and sorting
├── product.html        Product page (product.html?id=<product-id>)
├── contact.html        Contact details, enquiry form, FAQ
└── assets/
    ├── css/style.css   Design system and all styles
    ├── js/app.js       Product data, layout, bag, search and motion system
    ├── images/         Product, lifestyle and brand imagery
    └── media/          Hero film
```

The header, footer, bag drawer and search overlay are rendered by `app.js`, so every page shares them.

## Editing products

All products are in the `PRODUCTS` array at the top of `assets/js/app.js`:

| Field      | Purpose |
|------------|---------|
| `id`       | URL slug, used in `product.html?id=…` |
| `name`, `cat`, `price`, `desc` | Shown on cards and product pages. `cat` must be one of `CATS` |
| `img` / `thumb` | Large studio image and smaller card image |
| `alt`      | Optional second image shown on hover. Set `altCover: true` if it's a full-bleed photo |
| `z` / `az` | Optical zoom, so small pieces such as rings read at the same size as large ones |
| `sketch`   | Optional design sketch, shown in the gallery and in "The story behind the piece" |
| `sizes`, `stones`, `tag` | Options, specs and an optional badge ("New", "Signature") |

## Design system

Tokens are defined at the top of `style.css`.

- **Colour:** about 60% ivory `#f6f1e9`, 30% navy `#0d1522`, 10% gold `#b08d4a`. Gold is used only for lines and small details.
- **Type:** Bodoni Moda for display text and Manrope for body text. There are five sizes only: `--t-display`, `--t-title`, `--t-sub`, `--t-body`, `--t-label`.
- **Motif:** the Beirut arch, in four forms:
  - `.arch-frame`: an arched image window
  - `.arch-line`: a drawn outline
  - `.icon-arch`: a small bullet icon
  - `.bg-arches`: a faded background pattern
- **Motion:** one easing curve (`--ease`) and three durations (`--d1` to `--d3`). All motion is disabled when the visitor has reduced motion turned on.

### Motion attributes

| Attribute | Effect |
|-----------|--------|
| `data-r` | Fade and rise when the element scrolls into view |
| `data-r="words"` | Words rise one by one out of a mask |
| `data-r="arch"` | The image opens upward through an arch |
| `data-r="img"` | Rectangular image wipe |
| `data-r="draw"` | SVG outline draws itself. Paths need `pathLength="1"` |
| `data-r="line"` | Hairline grows from the left |
| `data-stagger="120"` | Children reveal one after another, 120 ms apart |
| `data-speed=".05"` | Parallax drift speed |

Other motion: a loading screen on the home page, fade transitions between pages, a header that hides on scroll, rolling button labels, the pinned sketch-to-jewel scene, and a custom arch-and-diamond pointer on desktop.

## Before going live

- [ ] Replace the placeholder contact details in `contact.html`: `hello@bakijewellery.com`, `+961 00 000 000`
- [ ] Connect the contact and newsletter forms to a backend. See the `TODO` in `contact.html`
- [ ] Connect the bag and checkout to Shopify, either through the Storefront API or by porting into a Shopify theme
- [ ] Confirm product details: metals, stones and sizes
- [ ] Add the logo as an SVG so it stays sharp at every size
- [ ] Compress the hero film. At 8.9 MB it is the heaviest asset
- [ ] Add on-model and macro photography as it becomes available

---

© BAKI Fine Jewellery — Beirut, Lebanon

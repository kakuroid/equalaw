# Equalaw Brand Guidelines — Identity System v2.0

> Revised June 2026. This edition realigns the identity around one governing
> decision: the icon and the wordmark share a single **stroke DNA** (1:11.3
> stroke-to-height ratio). Everything downstream — spacing, lockups, colour,
> type — is built on that unified module.
>
> The living, visual version of this document ships on the site at
> **`/brand-guidelines`** (`brand-guidelines.html`). This Markdown file is the
> engineering quick-reference; the design system itself lives in
> **`/assets/ui-components.css`** (`:root` tokens).

---

## 1. Logo System

Two parts, one idea. The **icon** is a typographic construction — two identical
letterforms mirrored across a central axis, hanging in perfect balance (a
scale-pan / column / the letter **A** of equ**a**l · l**a**w). The **wordmark**
is its monoline voice in full. Strictly sharp, mitred joins throughout.

### 1.1 Icon Mark
- **Assets**: `equalaw-icon-{navy,gold,white,black}.svg`, `equalaw-icon.svg` (currentColor), `equalaw-logo-v2.svg` (navy, legacy filename)
- **Usage**: favicons, app icons, avatars, compact/square formats
- **Stroke ratio**: 1 : 11.3 (canonical)
- **Minimum size**: 24 px (digital floor), 8 mm (print)
- **Clear space**: 3u on every side (u = one stroke width)

### 1.2 Wordmark
- **Assets**: `equalaw-wordmark-{navy,gold,white,black}.svg`, `equalaw-wordmark-v2.svg` (navy, legacy filename)
- **Usage**: headers, splash, lockups
- **Stroke ratio**: 1 : 11.9 (conformed to match the icon family)
- **Minimum width**: 120 px for legible text
- **Case**: Uppercase, evenly tracked

### 1.3 Lockups (keyed to wordmark cap-height H)
- **Vertical**: icon 2.0 × H, centred above wordmark, gap 0.45 × icon height
- **Horizontal**: icon 1.45 × H, optically centred, gap 0.55 × H

---

## 2. Colour System

A deep legal **navy** anchors the system; an antique **gold** carries the
identity; a soft **periwinkle** opens it up for screens and data. Grounded by
true black and a warm **paper** neutral.

### 2.1 Core Brand
| Token | Hex | Role |
|-------|-----|------|
| Equalaw Navy | `#1C2A3F` | **Primary.** App chrome, surfaces, headers, the anchoring dark. Carries body text on light. |
| Equalaw Gold | `#B79C76` | **Identity accent.** Wordmark in feature contexts, active states, key highlights. **Used sparingly.** |
| Periwinkle | `#A4C1F9` | **Support accent.** Links, tints, data, lighter emphasis against navy. |
| Black | `#000000` | Deck & splash backgrounds. |
| Paper | `#F3F1EA` | Warm off-white ground for light layouts. |

### 2.2 Navy tint scale (surfaces & data)
`900 #1C2A3F` · `800 #16243A` · `700 #33425A` · `500 #5D6B80` · `300 #9AA4B4` · `200 #C8CDD6` · `100 #E7E9EE`

### 2.3 Accessible pairings (WCAG 2.1)
| Foreground | Background | Ratio | Rating |
|-----------|-----------|-------|--------|
| White | Navy | 14.46 : 1 | AAA |
| Periwinkle | Navy | 7.97 : 1 | AAA |
| Gold | Black | 8.03 : 1 | AAA |
| Gold | Navy | 5.53 : 1 | AA |
| Navy | Paper | 12.79 : 1 | AAA |
| Gold | Paper | 2.31 : 1 | **FAIL** |

**Rule:** Gold never carries body text and never sits on periwinkle. Keep gold
on navy, black, or paper (decorative only on paper).

### 2.4 Semantic colours (warm-shifted to sit with the palette)
Success `#2F8F5B` · Warning `#B8841F` · Error `#C0392B` · Info `#5878B8`

---

## 3. Typography

The marks are geometric monolines, so the type system stays clean and structural.

| Family | Role | Loaded weights |
|--------|------|----------------|
| **Archivo** | Display, headings & UI (institutional presence) | 400–800 |
| **Hanken Grotesk** | Body & long-form reading (default `sans`) | 400–700 |
| **Spline Sans Mono** | Labels, eyebrows, technical/spec voice | 400–500 |

### Type scale
- **Display** — Archivo 800, ~56 / -2%
- **Heading** — Archivo 700, ~32 / -2%
- **Subhead** — Archivo 600, ~20
- **Body** — Hanken 400, 16 / 1.6
- **Label** — Spline Mono 12 / .16em, uppercase

In code: Tailwind `font-sans` = Hanken, `font-display` = Archivo, `font-mono` =
Spline. In `ui-components.css`, `h1–h4` and `button/.btn` default to Archivo.

---

## 4. Spacing & Radius
- **Spacing**: XS 4 · SM 8 · MD 16 · LG 24 · XL 32 (px)
- **Radius**: sm 4 · md 8 · lg 12 · full 999 (px); app icons use a 23% corner radius

---

## 5. Application
- **Favicon**: `equalaw-logo-v2.svg` (navy) + `favicon-32.png` fallback
- **Apple touch icon**: `apple-touch-icon.png` — gold mark on a navy tile (180×180)
- **PWA**: `site.webmanifest`, theme-color `#1C2A3F`, `icon-512.png` (any/maskable)
- **Social/OG**: `assets/og-image.png` — gold wordmark on black
- **App headers (light)**: navy icon + navy wordmark
- **Dark headers / splash**: gold (or white) icon + wordmark

---

## 6. Misuse — never
Stretch/condense · rotate/tilt · low-contrast placement · shadows/glows/gradients/outlines · off-palette fills · re-deriving stroke or height (breaks 1:11.3). When in doubt, reach for an approved asset in `/assets` rather than redrawing.

---

## 7. Asset Locations
```
/assets/
├── equalaw-icon-{navy,gold,white,black}.svg   # mark, recoloured variants
├── equalaw-icon.svg                            # mark, currentColor
├── equalaw-wordmark-{navy,gold,white,black}.svg
├── equalaw-logo-v2.svg / equalaw-wordmark-v2.svg  # navy, legacy filenames (in use)
├── favicon-{16,32,48,180}.png · icon-512.png   # navy mark / navy-tile rasters
├── og-image.png                                # 1200×630 social share
└── ui-components.css                           # design-system tokens & components
/apple-touch-icon.png                           # 180×180, gold mark on navy
/site.webmanifest                               # PWA manifest
/brand-guidelines.html                          # living visual guidelines (/brand-guidelines)
```

---

## 8. Version History
| Date | Version | Changes |
|------|---------|---------|
| 2026-06-22 | v2.0 | Stroke-unified identity (1:11.3). New Navy/Gold/Periwinkle palette; Archivo/Hanken/Spline type system; conformed icon + wordmark; full asset, favicon, PWA & OG set; design system retokenised. |
| 2026-06-06 | v1.x | Scales mark + monoline wordmark, blue (#007BFF) palette, Outfit type (deprecated). |

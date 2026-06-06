# Equalaw Brand Guidelines

## Overview
These guidelines ensure consistent visual presentation of the Equalaw brand across all platforms, websites, and materials worldwide.

---

## 1. Logo System

### 1.1 Primary Logo Mark
- **Asset**: `equalaw-logo.svg`
- **Usage**: Primary icon mark for favicons, app icons, social media profile pictures
- **Stroke Width**: 2.5px (consistent across all variations)
- **Color**: Black (#000000) or White (#FFFFFF) depending on background
- **Minimum Size**: 24px × 24px for favicon, 32px × 32px for UI elements
- **Clear Space**: Minimum 8px padding around logo

### 1.2 Wordmark
- **Asset**: `equalaw-wordmark.svg`
- **Usage**: Primary text + mark combination for headers, hero sections
- **Stroke Width**: 2.5px (consistent across all variations)
- **Color**: Black (#000000) on light backgrounds, White (#FFFFFF) on dark backgrounds
- **Minimum Size**: 120px width for readable text

### 1.3 Logo Variations
- **Horizontal**: Logo mark + wordmark side-by-side (preferred for headers)
- **Stacked**: Logo mark above wordmark (preferred for limited width areas)
- **Mark Only**: Logo mark standalone (favicons, social icons)

---

## 2. Color System

### 2.1 Brand Colors
- **Primary Blue**: #007BFF
  - Used for: CTAs, links, active states
  - Accessibility: WCAG AA on white
  
- **Primary Dark Blue**: #0061CC
  - Used for: Hover states, pressed states
  - Accessibility: WCAG AAA on white

- **Light Blue**: #389FFF
  - Used for: Secondary actions, backgrounds
  - Accessibility: WCAG AA on white

### 2.2 Semantic Colors
- **Success Green**: #10B981
- **Warning Orange**: #F59E0B
- **Error Red**: #EF4444
- **Info Blue**: #3B82F6

### 2.3 Neutral Colors
- **Black**: #000000
- **White**: #FFFFFF
- **Gray Scale**: #F8FAFC → #0F172A (light to dark)

---

## 3. Typography

### 3.1 Font Family
- **Primary**: Outfit (sans-serif)
- **Fallback**: system-ui, -apple-system, sans-serif

### 3.2 Font Weights & Sizes
- **H1**: 3.75rem, 800 weight
- **H2**: 2rem, 700 weight
- **H3**: 1.5rem, 600 weight
- **H4**: 1.25rem, 600 weight
- **Body**: 1rem, 400 weight
- **Small**: 0.875rem, 500 weight
- **Caption**: 0.75rem, 600 weight, uppercase

---

## 4. Icon Design

### 4.1 Icon Specifications
- **Stroke Width**: 2.5px (consistent with logo)
- **Size Grid**: 24px, 32px, 48px, 64px
- **Corner Radius**: 2px for icon corners
- **Clear Space**: Minimum 2px inside icon boundary

### 4.2 Icon Usage
- Always use consistent stroke width
- Maintain clear space around icon marks
- Use semantic colors for status icons
- Ensure 44px × 44px touch target minimum

---

## 5. Spacing & Layout

### 5.1 Spacing Scale
- **XS**: 4px (small gaps, internal padding)
- **SM**: 8px (component padding)
- **MD**: 16px (section padding)
- **LG**: 24px (major section spacing)
- **XL**: 32px (full-width margins)

### 5.2 Border Radius
- **Small**: 4px (inputs, small elements)
- **Medium**: 8px (cards, buttons)
- **Large**: 12px (containers, modals)
- **Full**: 999px (pills, badges)

---

## 6. Implementation Across Platforms

### 6.1 Website (HTML/CSS)
- **Favicon**: 32×32px SVG, equalaw-logo mark only
- **Header Logo**: Logo mark (34px) + wordmark (24px height) in header
- **Social Links**: Logo mark (36px) in dark/light variants
- **PDF/Documents**: Logo mark with wordmark side-by-side

### 6.2 SVG Optimization
- All SVGs must use consistent 2.5px stroke width
- No fill-based geometry (use strokes only where applicable)
- Optimize using SVGO with preset settings
- Include viewBox but NOT hardcoded width/height

### 6.3 Responsive Behavior
- **Mobile (< 640px)**: Logo mark only, compact spacing
- **Tablet (640px - 1024px)**: Logo mark + wordmark, normal spacing
- **Desktop (> 1024px)**: Full logo combination, generous spacing

### 6.4 Dark Mode Support
- Logo Mark: White (#FFFFFF) on dark (>= #1E293B)
- Wordmark: White (#FFFFFF) on dark, Black (#000000) on light
- Use CSS custom properties for theme switching

---

## 7. Do's & Don'ts

### Do's ✓
- Use the logo mark for favicons
- Maintain consistent stroke width of 2.5px
- Use approved colors only
- Maintain minimum clear space
- Scale logo proportionally
- Use SVG format for all logos
- Test on multiple backgrounds

### Don'ts ✗
- Don't distort or stretch the logo
- Don't change stroke width
- Don't add effects (shadows, glows) without approval
- Don't use raster images instead of SVG
- Don't place on clashing backgrounds without contrast
- Don't shrink below 24px × 24px
- Don't rotate or flip the logo

---

## 8. Asset Locations

### 8.1 Current Assets
```
/assets/
├── equalaw-logo.svg          # Logo mark (24×24 optimal, viewBox="0 0 24 24")
├── equalaw-wordmark.svg      # Logo mark + text (viewBox proportional)
└── ui-components.css         # Design system styles
```

### 8.2 File Specifications
- **Format**: SVG with viewBox attribute
- **Stroke**: 2.5px (absolute, not percentage-based)
- **Colors**: Black (#000000) as default, white-compatible
- **Metadata**: Include c2pa manifest for authenticity

---

## 9. Usage Examples

### 9.1 Favicon
```html
<link rel="icon" href="/assets/equalaw-logo.svg" type="image/svg+xml">
```

### 9.2 Header Logo
```html
<img src="/assets/equalaw-logo.svg" alt="" width="34" height="34" 
     class="logo-mark" aria-hidden="true">
<img src="/assets/equalaw-wordmark.svg" alt="Equalaw" 
     class="logo-wordmark" style="height: 24px; width: auto;">
```

### 9.3 Brand Logo Container
```html
<div class="brand-logo">
  <img src="/assets/equalaw-logo.svg" alt="" width="36" height="36" 
       aria-hidden="true">
</div>
```

---

## 10. Version History

| Date | Changes | Status |
|------|---------|--------|
| 2026-06-06 | Initial brand guidelines v1.0 | Active |

---

## 11. Contact & Approvals

For brand guideline questions or asset requests:
- **Design System Owner**: Design Team
- **Brand Manager**: Equalaw Leadership
- **Last Updated**: 2026-06-06

---

**Important**: All usage of the Equalaw brand mark and wordmark must comply with these guidelines. Violations may require remediation.

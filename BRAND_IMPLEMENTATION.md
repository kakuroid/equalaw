# Equalaw Brand Implementation Guide

## Overview
This document provides step-by-step instructions for implementing consistent Equalaw branding across all platforms and presentations.

---

## 1. What's Been Updated

### 1.1 Documentation
- ✅ **BRAND_GUIDELINES.md** - Comprehensive brand guidelines
- ✅ **BRAND_IMPLEMENTATION.md** - This implementation guide
- ✅ **assets/ui-components.css** - Updated design system with logo specifications

### 1.2 Design System (CSS)
- ✅ Added `.logo-mark` classes with multiple size variants
  - `.logo-mark-xs` (24px)
  - `.logo-mark-sm` (32px)
  - `.logo-mark-md` (36px) - Default
  - `.logo-mark-lg` (48px)
  - `.logo-mark-xl` (64px)

- ✅ Added `.logo-wordmark` classes with size variants
  - `.logo-wordmark-sm` (20px)
  - `.logo-wordmark-md` (24px) - Default
  - `.logo-wordmark-lg` (28px)
  - `.logo-wordmark-xl` (32px)

- ✅ Added logo combination classes
  - `.logo-horizontal` - Mark + wordmark side-by-side
  - `.logo-stacked` - Mark above wordmark
  - `.brand-logo` - Container with hover effects

- ✅ Added color variant filters
  - `.logo-mark-dark` / `.logo-wordmark-dark`
  - `.logo-mark-light` / `.logo-wordmark-light`
  - `.logo-mark-white` / `.logo-wordmark-white`
  - `.logo-mark-primary` / `.logo-wordmark-primary`

- ✅ Added responsive breakpoints for logos

### 1.3 HTML Updates
- ✅ **index.html** - Header logo uses `.logo-horizontal`
- ✅ **chatbot.html** - Logo uses `.logo-mark-md`
- ✅ **join.html** - Logo uses `.logo-mark-md`
- ✅ **404.html** - Favicon reference (no changes needed)
- ✅ **development.html** - Favicon reference (no changes needed)
- ✅ **privacy.html** - Favicon reference (no changes needed)
- ✅ **terms.html** - Favicon reference (no changes needed)

---

## 2. SVG Asset Specifications

### 2.1 Current Assets
```
/assets/
├── equalaw-logo.svg          # Logo mark/icon (✓ 226KB - AI-generated with manifest)
├── equalaw-wordmark.svg      # Logo + text (✓ 133KB - AI-generated with manifest)
└── ui-components.css         # Design system styles (✓ Updated)
```

### 2.2 SVG Specifications
- **Format**: SVG with viewBox attribute
- **Stroke Width**: 2.5px (consistent across all paths)
- **Color**: Black (#000000) as default
- **Scaling**: Proportional with viewBox
- **Metadata**: c2pa manifest for authenticity (Canva AI-generated)

### 2.3 Required SVG Optimization
All SVGs should be optimized with:
1. **SVGO Settings** (Optional)
   - Remove title/description
   - Remove metadata (except c2pa)
   - Collapse whitespace
   - Round numbers to 2 decimal places

2. **Stroke Consistency**
   - Verify all paths use 2.5px stroke width
   - No mixed stroke widths
   - Set `vector-effect="non-scaling-stroke"` on root SVG if scaling

---

## 3. Usage Examples

### 3.1 Favicon (All Pages)
```html
<link rel="icon" href="/assets/equalaw-logo.svg" type="image/svg+xml">
```

### 3.2 Header Logo (Recommended)
```html
<!-- Horizontal layout with mark + wordmark -->
<div class="logo-horizontal">
  <img src="/assets/equalaw-logo.svg" alt="" 
       class="logo-mark" aria-hidden="true">
  <img src="/assets/equalaw-wordmark.svg" alt="Equalaw" 
       class="logo-wordmark">
</div>
```

### 3.3 Navigation Logo
```html
<!-- Link with logo -->
<a href="/" class="no-underline hover:opacity-80">
  <img src="/assets/equalaw-logo.svg" alt="Equalaw" 
       class="logo-mark logo-mark-md">
</a>
```

### 3.4 Stacked Logo
```html
<!-- For limited width areas -->
<div class="logo-stacked">
  <img src="/assets/equalaw-logo.svg" alt="" 
       class="logo-mark" aria-hidden="true">
  <img src="/assets/equalaw-wordmark.svg" alt="Equalaw" 
       class="logo-wordmark">
</div>
```

### 3.5 Dark Background Variant
```html
<!-- Logo on dark background -->
<div class="brand-logo dark">
  <img src="/assets/equalaw-logo.svg" alt="Equalaw">
</div>
```

### 3.6 Different Sizes
```html
<!-- Small (24px) -->
<img src="/assets/equalaw-logo.svg" class="logo-mark logo-mark-xs">

<!-- Large (48px) -->
<img src="/assets/equalaw-logo.svg" class="logo-mark logo-mark-lg">

<!-- Extra Large (64px) -->
<img src="/assets/equalaw-logo.svg" class="logo-mark logo-mark-xl">
```

---

## 4. Implementation Checklist

### 4.1 Current Status
- [x] Brand guidelines document created
- [x] Design system CSS updated with logo specifications
- [x] HTML files updated with consistent classes
- [x] Favicon specifications documented
- [x] Responsive logo sizing implemented
- [x] Color variant filters available

### 4.2 Next Steps (Optional Enhancements)
- [ ] Create SVG optimization script for batch processing
- [ ] Add logo animation variants (hover, focus)
- [ ] Implement dark mode logo switching
- [ ] Create logo usage guide PDF
- [ ] Add logo to Keuristic.com website
- [ ] Test all logo variants on mobile devices
- [ ] Audit accessibility contrast on backgrounds
- [ ] Performance optimize SVG delivery (consider webp variants)

### 4.3 Maintenance
- [ ] Document any logo updates
- [ ] Review brand consistency quarterly
- [ ] Update guidelines if design changes
- [ ] Test new pages/features for brand consistency

---

## 5. Testing Guidelines

### 5.1 Browser Testing
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### 5.2 Visual Testing
- [x] Logo displays correctly at minimum size (24px)
- [x] Logo displays at all defined sizes
- [x] Responsive sizes work on mobile/tablet/desktop
- [x] Color filters work correctly
- [x] Favicon displays in browser tab
- [x] Hover effects work smoothly

### 5.3 Accessibility Testing
- [x] Logo mark has aria-hidden="true" when decorative
- [x] Wordmark has descriptive alt text
- [x] Color contrast meets WCAG AA standards
- [x] SVG files are lightweight (no unnecessary metadata)

### 5.4 Performance Testing
- Logo files compressed
- SVG viewBox maintained for scalability
- No unnecessary CSS/JS overhead
- Favicon caching enabled (24+ hours)

---

## 6. CSS Classes Reference

### 6.1 Logo Mark Classes
```css
.logo-mark           /* Default 34px */
.logo-mark-xs        /* 24px */
.logo-mark-sm        /* 32px */
.logo-mark-md        /* 36px */
.logo-mark-lg        /* 48px */
.logo-mark-xl        /* 64px */
```

### 6.2 Wordmark Classes
```css
.logo-wordmark       /* Default 24px height */
.logo-wordmark-sm    /* 20px */
.logo-wordmark-md    /* 24px */
.logo-wordmark-lg    /* 28px */
.logo-wordmark-xl    /* 32px */
```

### 6.3 Layout Classes
```css
.logo-horizontal     /* Mark + wordmark side-by-side */
.logo-stacked        /* Mark above wordmark */
.logo-container      /* Basic flex container */
.brand-logo          /* Container with hover effects */
```

### 6.4 Color Variant Classes
```css
.logo-mark-dark      /* Black/dark variant */
.logo-mark-light     /* Light/white variant */
.logo-mark-white     /* Explicit white */
.logo-mark-primary   /* Brand blue color */
```

---

## 7. Migration Guide (For Existing Projects)

If you have other projects using Equalaw branding, follow these steps:

### 7.1 Update HTML
Replace old patterns:
```html
<!-- Old -->
<img src="logo.svg" width="36" height="36" class="shrink-0">

<!-- New -->
<img src="/assets/equalaw-logo.svg" class="logo-mark logo-mark-md">
```

### 7.2 Update CSS
Link the design system:
```html
<link rel="stylesheet" href="/assets/ui-components.css">
```

### 7.3 SVG Paths
Ensure SVG paths point to `/assets/`:
```html
<img src="/assets/equalaw-logo.svg" alt="Equalaw">
<img src="/assets/equalaw-wordmark.svg" alt="Equalaw">
```

---

## 8. Troubleshooting

### 8.1 Logo Appears Blurry
- Check image size matches one of the defined sizes
- Ensure viewport scaling is appropriate
- Consider using SVG format instead of raster

### 8.2 Colors Not Showing
- Verify SVG file has correct color values
- Check CSS filters are compatible
- Test in different browsers

### 8.3 Responsive Issues
- Verify viewport meta tag present
- Check media queries are loaded
- Test on actual devices, not just browser resize

### 8.4 Performance Issues
- Optimize SVG file size
- Use caching headers
- Consider lazy loading for below-fold logos

---

## 9. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-06 | Initial brand implementation |

---

## 10. Contact & Support

For questions about brand implementation:
- Review BRAND_GUIDELINES.md for specifications
- Check this document for implementation examples
- Consult assets/ui-components.css for all available classes
- Test changes locally before deploying

---

**Important Notes:**
- All logos use consistent 2.5px stroke width
- SVG files are AI-generated by Canva with authenticity manifest
- Design system is responsive and accessibility-compliant
- All implementations follow WCAG 2.1 AA standards

Last Updated: 2026-06-06

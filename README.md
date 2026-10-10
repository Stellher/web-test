# Sparkle · Minimal Liquid Glass

An intentionally minimal responsive homepage for Sparkle 在线下载与导航.

**Published:** https://stellher.github.io/web-test/

### Features

- One distinctive Liquid Glass search control, paired with a static blue-lilac backdrop
- Four compact categories, each opening real curated resource links
- Keyboard search: Ctrl/⌘ + K; Esc to close; accessible buttons and result links
- **No framework, build step, external stylesheet, analytics or remote font**
- No decorative continuous animations or whole-page blur layers

### Performance strategy

The core page (`index.html`, ~17 KB source) works on all devices with CSS-only glass. The full **liquidGL** WebGPU/WebGL refraction library is hosted locally in `assets/liquidGL.js` and lazily initialized **only** when all the following hold:

- fine pointer and viewport width ≥900px
- system has ≥4 CPU threads and at least 4 GB device memory (if unsupported, defaults to 4 GB)
- prefers-reduced-motion is not enabled
- browser gets an idle callback, after first paint

The rendering resolution is constrained to 0.65; one lens, no tilt and no specular animation. Mobile gets a static optical glass fallback; the vendor script is **not loaded on mobile**. Fallback remains functional even if the optional WebGL feature fails.

### Files

- `index.html` — complete markup, scoped CSS and small search script
- `assets/sparkle.svg` — logo
- `assets/liquidGL.js` — upstream MIT-licensed GPU glass engine (desktop only)
- `assets/liquidGL-LICENSE.txt` — upstream full license
- `CREDITS.md` — acknowledgements
- `.github/workflows/deploy-pages.yml` — GitHub Pages automatic deployment

### Local preview

```bash
python3 -m http.server 8080
```
Open http://localhost:8080

This is a design prototype only. The sample resource links are real official sites, but **not a live listing from Sparkle's production database**. Links to https://stobox.dpdns.org/ open the original website; no production files or APIs are changed.

### Design references

- [NaughtyDuk liquidGL](https://github.com/naughtyduk/liquidGL) — MIT license
- [Anthropic Frontend Design Skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

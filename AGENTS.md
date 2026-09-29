# Architecture decisions
- Keep the distributable Bondz UI, theme, utilities, and assets within `src/design-system/`, because attached projects copy this subtree as a self-contained library.
- Keep the preview site in `src/routes/` and its adapters under `src/components/` and `src/lib/`, because these are preview-only and should not be published as library code.
- Use `bondz-theme` and `bondz-sound` for preferences, because the supplied UX flow specifies these keys.
- Keep all page scrolling inside the three-zone shell's canvas, because body scrolling breaks the pinned header and footer.
- Keep marketing pages in `src/routes/` and the design-system showcase at `/system`, because the library preview remains permanent while the flagship landing page owns `/`.
- Keep only the library's runtime dependencies in production `dependencies`; preview routing and build tools belong in `devDependencies` because attached consumers receive the library, not the preview app.
- Keep the booking curtain and marketing navigation in preview-only adapters, because library navigation must stay reusable while the site shares one transition behavior.

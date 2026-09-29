# Architecture decisions
- Keep the distributable Bondz UI, theme, utilities, and assets within `src/design-system/`, because attached projects copy this subtree as a self-contained library.
- Keep the preview site in `src/routes/` and its adapters under `src/components/` and `src/lib/`, because these are preview-only and should not be published as library code.
- Use `bondz-theme` and `bondz-sound` for preferences, because the supplied UX flow specifies these keys.
- Keep all page scrolling inside the three-zone shell's canvas, because body scrolling breaks the pinned header and footer.

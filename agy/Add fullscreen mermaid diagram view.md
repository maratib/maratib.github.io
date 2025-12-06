# Implementation Plan - Add Full-Screen Mermaid Diagrams

The goal is to allow users to view Mermaid diagrams in full-screen mode by clicking on them.

## User Review Required

> [!NOTE]
> This implementation injects a global script via [astro.config.mjs](../astro.config.mjs) and adds global CSS.

## Proposed Changes

### Configuration

#### [MODIFY] [astro.config.mjs](../astro.config.mjs)

- Add `head` configuration to `starlight` integration to inject `public/scripts/mermaid-fullscreen.js`.

### Scripts

#### [NEW] [public/scripts/mermaid-fullscreen.js](../public/scripts/mermaid-fullscreen.js)

- Create a script that:
  - Finds all `.mermaid` elements.
  - Adds a click event listener to them.
  - Opens a modal with the cloned SVG when clicked.
  - Handles closing the modal (click outside or close button).
  - Adds a "zoom" icon or visual cue on hover.

### Styles

#### [MODIFY] [src/assets/css/styles.scss](../src/assets/css/styles.scss)

- Add CSS for:
  - `.mermaid` hover state (cursor pointer).
  - The full-screen modal (`.mermaid-modal`).
  - Close button and backdrop.

## Verification Plan

### Manual Verification

1.  Run `npm run dev`.
2.  Navigate to a page with a Mermaid diagram (e.g., [src/content/docs/guides/java/springcloud/gateway.md](../src/content/docs/guides/java/springcloud/gateway.md) seems to have one or I can create a test one).
3.  Hover over the diagram -> should show pointer cursor.
4.  Click the diagram -> should open in full screen modal.
5.  Click outside or close button -> should close modal.

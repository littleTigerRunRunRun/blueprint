# Design System Specification: Acid-Industrial Flowcharting

## 1. Overview & Creative North Star
**The Creative North Star: "Cyber-Vandal Precision"**

This design system rejects the "SaaS-standard" safety of rounded corners and muted pastels. Instead, it embraces the aggressive, high-energy aesthetics of 90s underground rave posters and futuristic industrial interfaces. We are building a flowchart editor that feels less like a corporate tool and more like a high-end hacking terminal or a motion graphics suite.

The system breaks the "template" look through **intentional architectural brutality**: 0px border radii, high-contrast neon collisions, and a canvas that feels infinite and electric. We prioritize "Digital Rawness"—where metallic gradients meet toxic neons against a void-black background.

## 2. Colors & Surface Architecture
The palette is built on extreme contrast. We use "Toxic Green" (`primary`), "Electric Purple" (`secondary`), and "Hot Pink" (`tertiary`) to pierce through the `surface-dim` background.

### The "No-Line" Rule
Traditional 1px borders are strictly prohibited for layout sectioning. In this system, boundaries are defined by **chromatic shifts** and **tonal layering**.
- Use `surface-container-low` for the main sidebar against the `surface` background.
- For the canvas, use a `surface-container-lowest` (#000000) to create a sense of infinite depth.

### Surface Hierarchy & Nesting
Depth is achieved by "stacking" container tiers. To create a panel within a panel, move up the tier:
*   **Level 0 (Canvas):** `surface-container-lowest`
*   **Level 1 (Panels):** `surface-container-low`
*   **Level 2 (Active Nodes/Modals):** `surface-container-high`

### The "Glass & Gradient" Rule
To elevate the "Acid" aesthetic, use **Metallic Gradients** for primary interactions. 
- **CTA/Active Node Gradient:** Linear (135deg) from `primary` (#eaffb8) to `primary_container` (#befc00).
- **Floating Modals:** Use `surface_variant` at 60% opacity with a `24px` backdrop-blur. This "Frosted Chrome" effect prevents the UI from feeling flat and clinical.

### Signature Textures
- **The Grid:** The flowchart canvas must utilize a repeating 24px grid pattern using `outline_variant` at 15% opacity.
- **Micro-Glow:** All neon elements (`primary`, `secondary`, `tertiary`) should have a subtle 0 0 8px glow of their own color to simulate a cathode-ray tube (CRT) emission.

## 3. Typography
The typography is a collision between the utilitarian and the futuristic.

*   **Display & Headlines (Space Grotesk):** Use this for the "Editor State" and "Project Titles." Its wide tracking and geometric glyphs provide the "Futuristic Grotesque" feel. In `display-lg`, reduce letter-spacing to `-0.05em` to create a dense, aggressive block of text.
*   **Body & Titles (Manrope):** Chosen for its high legibility in complex flowcharts. Use `body-sm` for node metadata and `title-md` for node headers.
*   **Labels (Space Grotesk):** All technical data, coordinates (X, Y), and zoom levels must use `label-sm` in all-caps to reinforce the terminal aesthetic.

## 4. Elevation & Depth
In this system, elevation is "Optical" rather than "Physical."

*   **The Layering Principle:** A "floating" node in the flowchart doesn't get a shadow; it gets a `primary` glow or a background shift to `surface_bright`.
*   **Ambient Shadows:** If a modal requires separation from the canvas, use a diffused glow: `box-shadow: 0 20px 40px rgba(190, 252, 0, 0.08)`. Use the `primary` token color for the shadow tint, never black.
*   **The "Ghost Border" Fallback:** For nodes within the canvas, if a border is required for clarity, use `outline_variant` at 20% opacity. Avoid 100% opacity borders to keep the "Acid" energy flowing across elements.

## 5. Components

### Flowchart Nodes (Cards)
- **Geometry:** Strict 0px radius.
- **Separation:** No dividers. Use `surface-container-highest` for the header and `surface-container-low` for the body.
- **Selection State:** A 2px solid `primary` border with a 4px outer glow.

### Buttons
- **Primary:** `primary` background, `on_primary` text. No curves. Hover state should invert the colors.
- **Secondary:** `secondary_container` background with `on_secondary_container` text.
- **Tertiary:** Transparent background, `tertiary` text, with a `tertiary` 1px Ghost Border (20% opacity).

### Logic Chips
- Used for "If/Then" logic or "Tags." Use `secondary_fixed_dim` for the background and `on_secondary` for text. Sharp edges only.

### Input Fields
- **Idle:** Underline only (2px) using `outline_variant`.
- **Active:** Background shifts to `surface_container_high` with a `primary` underline.
- **Typography:** Use `label-md` for labels, positioned above the input in all-caps.

### Connectors (The "Acid Lines")
- Flowchart lines should be 2px thick. 
- Use `primary` for active paths and `outline_variant` for inactive paths. 
- Use "Liquid" step-curves rather than straight diagonal lines to lean into the experimental vibe.

## 6. Do’s and Don’ts

### Do
- **Do** use extreme color combinations (Toxic Green vs. Electric Purple).
- **Do** allow elements to overlap intentionally (e.g., a floating toolbar slightly overlapping the canvas grid).
- **Do** use all-caps for labels and technical data.
- **Do** utilize `0px` border-radius for every single element in the UI.

### Don't
- **Don’t** use rounded corners (`0px` is the rule).
- **Don’t** use soft grey shadows. If it needs a shadow, it needs a colored glow.
- **Don’t** use standard "Close" icons. Use custom, sharp "X" marks or futuristic glyphs.
- **Don’t** use dividers or hair-lines to separate list items; use vertical rhythm and spacing (16px, 24px, 32px) to define groups.
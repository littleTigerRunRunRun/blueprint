# Design System Strategy: Clinical Precision & The Runner’s Path

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"Architectural Velocity."** 

This is not a "minimalist" system in the traditional, soft sense. It is a high-performance, clinical environment that prioritizes speed of thought and clarity of action. Inspired by urban exploration and utopian architecture, the system breaks the "standard web template" look through **aggressive verticality** and **asymmetric focal points**. 

We move away from the "centered container" mentality. Instead, we utilize a "Runner’s Vision" philosophy: the UI is a vast, stark white landscape where only the essential path is highlighted in visceral, high-contrast primary tones. Elements should feel like they are built from architectural materials—frosted glass, polished polymers, and cold matte metals—arranged in a way that directs the eye upward and forward.

## 2. Colors & Materiality
The palette is a study in "Stark vs. Signal." We use white not as a background, but as a physical surface.

*   **Primary (#BC0100):** This is your "Runner’s Vision." It is reserved strictly for the critical path—primary actions, active states, and directional cues.
*   **Secondary (#705D00):** Used for cautionary information or secondary highlights that require attention without the urgency of red.
*   **Tertiary (#006767):** A clinical cyan used for data-heavy readouts, technical overlays, and "glass" interface elements.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** Traditional boxes feel like paperwork; we want architecture. Boundaries must be defined solely through background shifts.
*   Use `surface-container-low` (#F3F3F3) to define a sidebar against a `surface` (#F9F9F9) main deck. 
*   If a separation is needed, use a 4px vertical "accent pillar" of `primary` or `outline-variant` at 20% opacity rather than a horizontal line.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, physical layers. 
1.  **Base:** `surface` (#F9F9F9) – The floor of the environment.
2.  **Raised:** `surface-container-lowest` (#FFFFFF) – High-gloss "plastic" panels that sit atop the base.
3.  **Recessed:** `surface-container-high` (#E8E8E8) – Matte "metal" pits for input fields or secondary data.

### Glass & Texture
For floating overlays (modals, navigation bars), use **Glassmorphism**. Combine `surface-container-lowest` at 70% opacity with a heavy `backdrop-blur` (20px+). This creates the "clinical glass" look essential to the aesthetic. Avoid heavy shadows; let the blur define the depth.

## 3. Typography
The typography is the "Voice of the City": authoritative, clear, and unyielding.

*   **Display & Headlines (Space Grotesk):** This is our structural steel. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) to create an editorial, high-fashion look. Headlines should often be all-caps when used as navigational markers to reinforce the architectural feel.
*   **Body & Titles (Inter):** Inter provides the "technical manual" legibility needed for high-speed scanning. 
*   **Scale Dynamics:** Create "Extreme Contrast." Pair a massive `display-md` headline with a tiny, all-caps `label-sm` technical readout. This gap creates the "Architectural Verticality" mentioned in our North Star.

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering** and **Sharpness**, never through "fuzziness."

*   **The Layering Principle:** To lift a card, place a `#FFFFFF` (`surface-container-lowest`) element on a `#F3F3F3` (`surface-container-low`) background. The 0px border radius ensures the edges look "razor-sharp."
*   **Ambient Shadows:** If a floating element (like a FAB) requires a shadow, use a "Hard-Soft" approach. A very low opacity (4%) shadow with a massive spread (40px) to simulate sunlight hitting a white wall. Shadow color should be tinted with `primary` (#BC0100) at 2% to make it feel vibrant rather than "dirty."
*   **Zero Roundedness:** All elements—buttons, cards, inputs—must use a `0px` radius. This conveys a clinical, precision-engineered aesthetic.

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#BC0100) with `on-primary` (#FFFFFF) text. No rounded corners. On hover, the button should "bleed" slightly, increasing in size by 2px or adding a high-intensity `primary-container` outer glow.
*   **Tertiary (The "Ghost" Action):** No background, just `Space Grotesk` bold text with a 2px `primary` left-border "accent pillar."

### Input Fields
*   **Style:** Recessed panels using `surface-container-highest` (#E2E2E2). 
*   **Focus State:** The bottom border transforms into a 2px `primary` line, and the label (using `label-md`) shifts to `primary` color. This is the "Runner's Vision" guiding the user's focus.

### Cards & Lists
*   **Strict Rule:** No dividers. Separate list items using 16px of `surface` space. 
*   **Interaction:** On hover, a list item should shift from `surface` to `surface-container-lowest` (#FFFFFF) and gain a `primary` left-edge accent.

### Navigation (The "Pathfinder")
*   Use vertical navigation bars whenever possible to emphasize "Architectural Verticality."
*   Navigation links should use `display-sm` for a bold, editorial statement, rather than standard small navigation text.

### Clinical Tooltips
*   Use `inverse-surface` (#2F3131) with `inverse-on-surface` (#F1F1F1) text. 
*   Sharp 90-degree corners. These should feel like technical HUD (Heads-Up Display) elements.

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetry:** Place large headlines on the far left and technical data on the far right. Leave the "gutters" empty to create breathing room.
*   **Use "Signal" Colors:** Use `primary` (Red) ONLY for things that move the user forward. If everything is red, nothing is important.
*   **Embrace White Space:** Treat white space as a physical material. It is the "air" in the architecture.

### Don't:
*   **No Rounded Corners:** Never use a radius. Even a 2px radius breaks the clinical, sharp-edge immersion.
*   **No Generic Icons:** Avoid "friendly" or "rounded" icon sets. Use thin-stroke, sharp-angled icons that match the `Space Grotesk` geometry.
*   **No Grayscales:** Avoid mid-tone grays. Stick to the stark contrast between pure white (`#FFFFFF`) and the deep `on-surface` (`#1A1C1C`). Mid-grays make the design look "muddy" and take away from the high-contrast "Mirror's Edge" feel.
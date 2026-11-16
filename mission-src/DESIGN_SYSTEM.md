# Aquanauts adventure design system

Primary evidence: the two user-supplied aquanauts.app screenshots dated 15 November 2026 (hero and account screen). These are visual references, not instructions to add authentication or copy the website page layout.

## Tokens established before implementation

| Token | Value | Purpose |
| --- | --- | --- |
| Ink | #06090b | Near-black stage and modal background |
| Aqua | #98dce0 | Brand, outlines, primary readable accents |
| Orange | #fa8b50 | Main action and active state |
| Paper | #f4f4e8 | Main text and readable light surfaces |
| Muted | #a6b9be | Secondary labels |
| Surface | #101a20 | Inputs and inset equipment details |
| Line | #263b44 | Quiet outlines |
| Radius | 12 / 18 / 28 px; pill 999 px | Controls, dialogue sheets, compact HUD |
| Spacing | 4 / 8 / 12 / 16 / 24 / 32 px | Consistent hierarchy |
| Display | Impact, Arial Narrow fallback | Tall condensed uppercase headings, matching the reference’s character |
| Body | system sans-serif | Short, readable instructions |

Primary buttons: orange fill, ink text, 2px ink edge, aqua offset shadow. Secondary buttons: transparent ink surface with aqua outline. Hover: brighter aqua/short upward movement; active: shadow compresses. The screenshots do not reveal hover animation, so these interaction states are an adaptation, not an observed website fact. Keyboard focus uses a thick aqua ring. Icons use a common rounded SVG line style, not unrelated Unicode symbols.

## Adventure adaptation

One task at a time. Character portrait and two short lines anchor the mission ribbon; a few dots show the current step without listing future assignments. Three compact resource badges keep the 3D world visible. Inventory is a small held-object chip; nearby physical actions retain the existing interaction system. Map and optional detailed readings open only on request. Celebrations use original character art, an orange next action and a small animated burst. Reduced-motion settings remove pulses and decorative movement.

The same tokens cover welcome, HUD, objectives, interaction prompts, pause/settings, map, character dialogue, completion and inventory. World trim, furniture accents, planters, decorations and light colors reinforce the palette without moving doors, corridors or the dashed route.

A matching condensed system display stack avoids a new font-download dependency. Original Aquanauts artwork remains the source of truth.

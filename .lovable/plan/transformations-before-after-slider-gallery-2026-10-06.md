# Transformations: before/after slider gallery

## What we're building
A new "TRANSFORMATIONS" section on the homepage, placed between the Additional Services block and the About Us section. It shows 4 before/after image pairs, each in a single box with an interactive comparison slider:

- Drag the handle left/right to reveal before vs after.
- Dragging right reveals the "after" photo; dragging left returns to the "before" photo.
- Initial state (untouched): the "before" image fills the box.
- Labels "Before" / "After" on each side of the divider.

Pairs:
1. Abarth (wheel arch / bodywork)
2. Mercedes (headlight)
3. Seats (interior upholstery)
4. Wheels (alloy wheel)

## How it works
- Upload the 8 provided photos to Lovable's CDN assets (keeps the codebase light); reference them via asset pointers.
- New `BeforeAfterSlider` component in `src/components/BeforeAfterSlider.tsx`:
  - Both images stacked; the "after" image is clipped to the slider percentage.
  - Divider line + circular handle with left/right arrows.
  - Mouse, touch and keyboard (arrow keys) support via pointer events; accessible slider role.
  - Container uses a fixed aspect ratio derived from the photo pair so all 4 boxes align in a responsive 2-column grid (single column on mobile).
- New "Transformations" section in `src/pages/Index.tsx`, styled like the existing sections (same heading pattern, dark card frames, green accents). No changes to any other section.

## Verification
- Build check, then Playwright: drag the slider on desktop and confirm the after image reveals, and check mobile layout.

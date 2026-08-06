## Goal
Create a downloadable preview image showing how the website would look with a new top announcement bar that reads: **“NEW CUSTOMER OFFER, GET 20% OFF YOUR FIRST FULL DETAIL.”** No website source files will be changed.

## Deliverable
A single PNG image (`new-customer-offer-mockup.png`) saved to `/mnt/documents/` for review and download.

## Mockup Content
- The bar is placed at the very top of the page, above the existing fixed header.
- It uses the site’s primary green (`bg-primary`) with near-black text (`text-primary-foreground`) to match the “Book Now” button and green accent style.
- Text is centered, uppercase, bold, with the site’s usual tracking.
- The existing header is shown directly below the bar, and the hero section starts after it so the layout looks natural.
- The rest of the page remains unchanged.

## Approach
1. Load the live website preview at desktop width using Playwright.
2. Inject a temporary top bar into the rendered page only for the screenshot (no code changes).
3. Adjust the fixed header’s top offset and the hero’s top padding so the bar does not overlap the hero content.
4. Capture a full-page screenshot of the result.
5. Save the final image to `/mnt/documents/new-customer-offer-mockup.png`.

## Out of Scope
- No edits to `src/pages/Index.tsx`, `src/styles.css`, or any other website file.
- No changes to the live preview or published site.
- No extra assets beyond the single mockup image.

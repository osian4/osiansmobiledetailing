# Promotional Flyer (Osian's Mobile Detailing)

## Goal
Create a downloadable promotional flyer image styled like the reference poster, but branded for Osian's Mobile Detailing. No website files change.

## Deliverable
A single high-resolution PNG saved to `/mnt/documents/osians-detailing-flyer.png`, sized for A4-style print/social sharing.

## Design
- Colour scheme: black background with the site's neon green accents and white/silver text (replacing the reference's red).
- Top-left tag: "PROFESSIONAL MOBILE DETAILING".
- Centre: the business logo (`src/assets/logo.png`) as the hero badge.
- Top-right: "WE COME TO YOU!" with "HOME • WORK • ANYWHERE".
- Left headline: "CLEANER. SHINIER. PROTECTED." with the sub-line "Detailing that brings out the best in your car."
- Services list (from the website):
  - Premium Valet — from £79.99 (new customer)
  - Signature Detail — £179.99
  - Maintenance Valet — £79.99
  - Multi stage safe wash process
  - Ceramic paint sealant protection
  - Interior deep clean & sanitisation
- Feature strip across the bottom: Premium Results, We Come To You, Ceramic Protection, Quality Products, Attention To Detail.
- Footer: "BOOK YOUR DETAIL TODAY!" with 07482 424580, plus Instagram / TikTok / Facebook handles and "Based in Telford, UK".
- A detailed car photo used as the central visual, matching the site's hero styling.

## Approach
1. Generate a clean car image for the flyer centrepiece.
2. Compose the flyer with Python/Pillow using the real logo, exact prices, and contact details so all text is crisp and accurate.
3. Save the final PNG to `/mnt/documents/` for download.

## Out of Scope
- No edits to `src/pages/Index.tsx`, `src/styles.css`, `index.html`, or any other project file.
- The reference image is not embedded anywhere.

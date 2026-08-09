# Replace Location Card with Instagram Message Card

## Goal
In the "Get in touch" section, remove the "Location / Telford, UK" card and replace it with a "Message" card that links to the business Instagram account, using the same Instagram icon and link as the header.

## Current State
The contact section currently shows three cards side by side:
- Location (Telford, UK)
- Phone (07482 424580)
- Email (osiansmobiledetailing@gmail.com)

The header already contains a pressable Instagram icon linking to `https://www.instagram.com/osiansmobiledetailing`.

## Plan
1. Update `src/pages/Index.tsx`:
   - Remove the Location card (MapPin icon, "Location", "Telford, UK").
   - Add a new first card in its place with:
     - The Instagram icon from `lucide-react` (already imported).
     - Title "Message".
     - A pressable link to `https://www.instagram.com/osiansmobiledetailing` using the same styling as the header Instagram icon.
   - Keep the grid as three columns on desktop (`sm:grid-cols-3`) and the existing card styling.

## Verification
- Run the build to ensure the file compiles.
- Verify the Instagram link opens the correct account in a new tab.
- Confirm the card remains visible and properly aligned alongside Phone and Email on both mobile and desktop.

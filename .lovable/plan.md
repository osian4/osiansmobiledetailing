**Generate downloadable business card images for Osian's Mobile Detailing**

Two separate, print-ready PNG images sized to a standard 85×55mm business card with a 3mm bleed (so 91×61mm total), at 300 DPI = ~1075×720 px.

**Front side** (`/mnt/documents/osians-business-card-front.png`)
- Dark background matching the website (#0a0a0a) with subtle neon green accents
- Osian's logo (top-left or centered)
- Business name: "OSIAN'S MOBILE DETAILING" in the site's display font style
- Tagline: "Premium Mobile Car Detailing — Telford, UK"
- Contact details:
  - Phone: 07482 424580
  - Email: osiansmobiledetailing@gmail.com
  - Location: Telford, UK
  - Website: osiansmobiledetailing.com
- QR code (reusing the existing branded QR linking to https://www.osiansmobiledetailing.com/) placed cleanly on the right side
- Social handles (Instagram / TikTok / Facebook: @osiansmobiledetailing)

**Back side** (`/mnt/documents/osians-business-card-back.png`)
- Same dark + neon green branding for consistency
- Heading: "OUR SERVICES"
- Brief service list with prices:
  - Interior Detail — from £149.99
  - Signature Detail — from £199.99 (highlighted as most popular)
  - Exterior Detail — from £79.99
- Short add-ons line: "Add-ons: Clay treatment · Shampoo extraction · Engine bay"
- Closing line: "Scan the QR on the front to book"

**Technical details**
- Built with Python (Pillow) at 300 DPI for print quality
- Safe text margin of ~5mm from the trim edge to avoid cutoff
- Logo sourced from `src/assets/logo.png`
- QR code reused from previously generated artwork
- Each side delivered as its own downloadable PNG artifact

No website code changes — these are standalone print assets.
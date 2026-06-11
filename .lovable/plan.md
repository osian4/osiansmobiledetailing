## Plan: Two-sided business card images

I'll generate **two separate PNG images** (front + back) for Osian's Mobile Detailing — dark & premium style matching the website's black background and green primary accent. **No website code will be changed.**

### Front card
- Dark background with subtle green glow accent
- Osian's Mobile Detailing logo (using `src/assets/logo.png`)
- Business name: "OSIAN'S MOBILE DETAILING" (green "MOBILE" accent to match the nav)
- Owner name: **Patrik-Valentin Osian**
- Location badge: "Based in Telford, UK" with pin icon

### Back card
- Same dark premium background
- Phone: 07482 424580
- Email: osiansmobiledetailing@gmail.com
- Socials: @osiansmobiledetailing (Instagram · TikTok · Facebook)
- Small tagline accent: "Detail that shines."

### Technical details
- Standard business card ratio (3.5:2), output at ~1750×1000 px
- Use `imagegen--generate_image` with **premium** quality (text legibility is critical for a business card)
- Reference the existing logo so the brand feel carries through
- Save to `/mnt/documents/` as `business-card-front.png` and `business-card-back.png`
- Visually QA both images after generation; regenerate if text is garbled or layout is broken
- Deliver via `<presentation-artifact>` tags so you can download them

No files in the project will be touched.
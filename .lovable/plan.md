## Goal

Generate **6 different hero background images** in the brand's black/green/white style, so you can pick your favourite and I'll swap it into the site.

## The 6 options

All featuring a black luxury car, split between two moods you picked:

**Wet & soapy close-ups (3):**
1. Macro shot of thick white foam dripping down glossy black paintwork, green rim-lighting on the edges
2. Water beading on a freshly ceramic-sealed black bonnet, sharp green light reflection
3. Pressure-washer spray catching the light against a black panel, green neon glow behind

**Studio glamour shots (3):**
4. Full black luxury saloon in a dark studio, sweeping green LED strip lighting along its body
5. Three-quarter front view of a black sports car, single green spotlight overhead, polished concrete floor
6. Rear of a black luxury car with tail-lights glowing, green ambient haze in the background

Each will be 1920×1080, cinematic, professional automotive photography style — consistent with your current site's look.

## Process

1. Generate all 6 images into a scratch folder (`/mnt/documents/hero-options/`) so they don't touch the live site
2. Show them all to you in chat
3. You tell me which number you want
4. I replace `src/assets/hero-car.jpg` with your pick

## Technical notes

- No code changes happen in this step — only image generation
- The hero `<img>` in `src/routes/index.tsx` already points at `src/assets/hero-car.jpg`, so the swap is a single file replacement once you've chosen
- Unused options stay in `/mnt/documents/` (not bundled into the app)

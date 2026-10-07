# Booking Form Page Plan

## What we're building
A separate booking page at `/book`, styled in the same green/black/white theme, with a form that emails the completed booking to osiansmobiledetailing@gmail.com. The main page stays visually unchanged — the existing "Book Now" / "Book …" buttons will simply link to the new page.

## Page layout
- Header with logo and a "Back to Home" link
- Page title: "Book Your Detail" with a short intro line
- The form, then a footer matching the main site

## Form fields

**Customer & Location (all required)**
- Full Name
- Email Address (must be a valid email format)
- Phone Number (valid UK format)
- Location / Postcode in the Telford area

**Vehicle Details (all required)**
- UK Registration Plate (e.g. AB21 XYZ)
- Vehicle Make, Model & Year
- Vehicle Size Category: Hatchback/Coupe, Saloon/Estate, or SUV/4x4/Van

**Service & Condition**
- Service selection (required, exactly one): Premium Valet, Signature Detail, or Maintenance Valet
- Add-ons (optional): Paint Decontamination, Deep Interior Extraction, Engine Bay Refresh
- Condition flags (optional): pet hair, heavy mud, child seats
- Photo upload (optional, up to 2 images of problem areas)

**Logistics & Agreement (all required)**
- Preferred date and time slot
- Checkbox: outdoor water tap & power outlet available on-site
- Checkbox: 50% non-refundable deposit acknowledged
- Additional notes (optional)

**Marketing**
- "How did you hear about us?" (required): Instagram, TikTok, Facebook, Flyer/Business Card, Word of Mouth, Google

## How it functions
- The submit button stays blocked until every required field and checkbox is complete. Incomplete fields show clear red error messages, and the form jumps to the first problem.
- On successful submit, the customer sees a confirmation screen thanking them and reminding them about the deposit and water/power requirements.
- Every submission is sent as a neatly formatted email to osiansmobiledetailing@gmail.com, including any uploaded photos.

## Technical details
- New route `/book` added to the Vite + React app; existing anchor buttons updated to point to it.
- Sending the email requires enabling Lovable Cloud (the built-in backend) with a small server-side function that validates the submission and delivers the email. No external accounts needed.
- Note: app emails can only be sent once a sender domain you own is set up and verified (e.g. bookings@yourdomain.com). Until then, submissions can be stored and viewed, but email delivery waits on domain setup.

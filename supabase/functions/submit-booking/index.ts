import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const OWNER_EMAIL = "osiansmobiledetailing@gmail.com";
const FROM_EMAIL = "Osian's Mobile Detailing <bookings@osiansmobiledetailing.com>";
const BUCKET = "booking-photos";

const BookingSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().regex(/^(\+44\s?|0)\d[\d\s]{8,12}$/, "Invalid UK phone number"),
  postcode: z.string().trim().min(5).max(200).regex(/[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}/, "Please include a valid UK postcode"),
  regPlate: z.string().trim().regex(/^[A-Za-z]{2}\d{2}\s?[A-Za-z]{3}$/, "Invalid UK registration"),
  vehicleMake: z.string().trim().min(1).max(50),
  vehicleModel: z.string().trim().min(1).max(50),
  vehicleYear: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1),
  vehicleSize: z.enum(["Hatchback / Coupe", "Saloon / Estate", "SUV / 4x4 / Van"]),
  service: z.enum(["Premium Valet", "Signature Detail", "Maintenance Valet"]),
  addOns: z.array(z.enum(["Paint Decontamination", "Deep Interior Extraction", "Engine Bay Refresh"])).max(3),
  conditionFlags: z.array(z.enum(["Pet hair", "Heavy mud", "Child seats"])).max(3),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.enum(["Morning (8am–12pm)", "Afternoon (12pm–4pm)"]),
  utilitiesConfirmed: z.literal(true),
  depositAcknowledged: z.literal(true),
  hearAbout: z.enum(["Instagram", "TikTok", "Facebook", "Flyer / Business Card", "Word of Mouth", "Google"]),
  notes: z.string().trim().max(1000).optional().default(""),
});

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function buildEmailHtml(booking: z.infer<typeof BookingSchema>, photoLinks: string[]): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 12px;font-weight:600;color:#16a34a;vertical-align:top;white-space:nowrap;">${label}</td>
      <td style="padding:8px 12px;color:#111;">${esc(value)}</td>
    </tr>`;

  const photos = photoLinks.length
    ? photoLinks
        .map((url, i) => `<a href="${url}" style="color:#16a34a;">Photo ${i + 1}</a>`)
        .join(" &nbsp;·&nbsp; ")
    : "None uploaded";

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
    <div style="background:#16a34a;padding:20px 24px;">
      <h1 style="margin:0;color:#ffffff;font-size:20px;">New Booking Request</h1>
      <p style="margin:4px 0 0;color:#dcfce7;font-size:13px;">Osian's Mobile Detailing</p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${row("Name", booking.name)}
      ${row("Email", booking.email)}
      ${row("Phone", booking.phone)}
      ${row("Location", booking.postcode)}
      ${row("Registration", booking.regPlate.toUpperCase())}
      ${row("Vehicle", `${booking.vehicleMake} ${booking.vehicleModel} (${booking.vehicleYear})`)}
      ${row("Vehicle size", booking.vehicleSize)}
      ${row("Service", booking.service)}
      ${row("Add-ons", booking.addOns.length ? booking.addOns.join(", ") : "None")}
      ${row("Condition", booking.conditionFlags.length ? booking.conditionFlags.join(", ") : "None noted")}
      ${row("Preferred date", booking.preferredDate)}
      ${row("Time slot", booking.timeSlot)}
      ${row("Water & power", "Confirmed on-site")}
      ${row("Deposit", "50% non-refundable deposit acknowledged")}
      ${row("Heard via", booking.hearAbout)}
      ${row("Notes", booking.notes || "None")}
    </table>
    <div style="padding:12px;border-top:1px solid #e5e7eb;font-size:14px;">
      <strong style="color:#16a34a;">Photos:</strong> ${photos}
      <p style="color:#6b7280;font-size:12px;margin:8px 0 0;">Photo links expire after 7 days. Reply directly to this email to respond to the customer.</p>
    </div>
  </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();

    const parseJsonArray = (key: string): string[] => {
      const raw = formData.get(key);
      if (typeof raw !== "string" || !raw) return [];
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    const candidate = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      postcode: formData.get("postcode"),
      regPlate: formData.get("regPlate"),
      vehicleMake: formData.get("vehicleMake"),
      vehicleModel: formData.get("vehicleModel"),
      vehicleYear: formData.get("vehicleYear"),
      vehicleSize: formData.get("vehicleSize"),
      service: formData.get("service"),
      addOns: parseJsonArray("addOns"),
      conditionFlags: parseJsonArray("conditionFlags"),
      preferredDate: formData.get("preferredDate"),
      timeSlot: formData.get("timeSlot"),
      utilitiesConfirmed: formData.get("utilitiesConfirmed") === "true",
      depositAcknowledged: formData.get("depositAcknowledged") === "true",
      hearAbout: formData.get("hearAbout"),
      notes: formData.get("notes") ?? "",
    };

    const parsed = BookingSchema.safeParse(candidate);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid booking details", fields: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const booking = parsed.data;

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Upload up to 2 photos and create 7-day signed links
    const photoLinks: string[] = [];
    const photos = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0).slice(0, 2);
    const bookingId = crypto.randomUUID();
    for (let i = 0; i < photos.length; i++) {
      const file = photos[i];
      if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) continue;
      const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
      const path = `${bookingId}/photo-${i + 1}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type });
      if (uploadError) {
        console.error("Photo upload failed:", uploadError.message);
        continue;
      }
      const { data: signed } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(path, 60 * 60 * 24 * 7);
      if (signed?.signedUrl) photoLinks.push(signed.signedUrl);
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [OWNER_EMAIL],
        reply_to: booking.email,
        subject: `New Booking: ${booking.service} — ${booking.name} (${booking.preferredDate})`,
        html: buildEmailHtml(booking, photoLinks),
      }),
    });

    if (!emailResponse.ok) {
      const errorBody = await emailResponse.text();
      console.error(`Resend request failed [${emailResponse.status}]: ${errorBody}`);
      return new Response(
        JSON.stringify({ error: "Failed to send booking email", status: emailResponse.status, details: errorBody }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("submit-booking error:", err);
    return new Response(JSON.stringify({ error: "Unexpected error processing booking" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

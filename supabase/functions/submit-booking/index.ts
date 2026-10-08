import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const OWNER_EMAIL = "osiansmobiledetailing@gmail.com";
const BUCKET = "booking-photos";

const BookingSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().regex(/^(\+44\s?|0)\d[\d\s]{8,12}$/, "Invalid UK phone number"),
  postcode: z.string().trim().regex(/^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/, "Invalid postcode"),
  regPlate: z.string().trim().regex(/^[A-Za-z]{2}\d{2}\s?[A-Za-z]{3}$/, "Invalid UK registration"),
  vehicleMake: z.string().trim().min(1).max(50),
  vehicleModel: z.string().trim().min(1).max(50),
  vehicleYear: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1),
  vehicleSize: z.enum(["Hatchback / Coupe", "Saloon / Estate", "SUV / 4x4 / Van"]),
  service: z.enum(["Premium Valet", "Signature Detail", "Maintenance Valet"]),
  addOns: z.array(z.enum(["Paint Decontamination", "Deep Interior Extraction", "Engine Bay Refresh"])).max(3),
  conditionFlags: z.array(z.enum(["Pet hair", "Heavy mud", "Child seats"])).max(3),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.enum(["Morning (8am–12pm)", "Afternoon (12pm–4pm)", "Evening (4pm–7pm)"]),
  utilitiesConfirmed: z.literal(true),
  depositAcknowledged: z.literal(true),
  hearAbout: z.enum(["Instagram", "TikTok", "Facebook", "Flyer / Business Card", "Word of Mouth", "Google"]),
  notes: z.string().trim().max(1000).optional().default(""),
});

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

    const { data, error } = await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "booking-request",
        recipientEmail: OWNER_EMAIL,
        idempotencyKey: `booking-${bookingId}`,
        templateData: {
          ...booking,
          addOns: booking.addOns.length ? booking.addOns.join(", ") : "None",
          conditionFlags: booking.conditionFlags.length ? booking.conditionFlags.join(", ") : "None noted",
          notes: booking.notes || "None",
          photoLinks,
        },
      },
    });

    if (error) {
      console.error("Email send failed:", error.message);
      return new Response(JSON.stringify({ error: "Failed to send booking email" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (data?.error) {
      console.error("Email send rejected:", data.error);
      return new Response(JSON.stringify({ error: "Failed to send booking email" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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

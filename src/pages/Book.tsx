import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, CheckCircle2, Loader2, Upload, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";

const SERVICES = [
  { name: "Premium Valet", price: "From £79.99" },
  { name: "Signature Detail", price: "From £179.99" },
  { name: "Maintenance Valet", price: "From £79.99" },
] as const;
const VEHICLE_SIZES = [
  { name: "Hatchback / Coupe", example: "e.g. Fiesta, A-Class" },
  { name: "Saloon / Estate", example: "e.g. 3 Series, Passat" },
  { name: "SUV / 4x4 / Van", example: "e.g. Range Rover, Q7" },
] as const;
const ADD_ONS = [
  { name: "Paint Decontamination", price: "From £49.99" },
  { name: "Deep Interior Extraction", price: "From £39.99" },
  { name: "Engine Bay Refresh", price: "From £29.99" },
] as const;
const CONDITION_FLAGS = ["Pet hair", "Heavy mud", "Child seats"] as const;
const HEAR_ABOUT = ["Instagram", "TikTok", "Facebook", "Flyer / Business Card", "Word of Mouth", "Google"] as const;
const TIME_SLOTS = ["Morning (9am–12pm)", "Afternoon (12pm–4pm)"] as const;

interface FormState {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  regPlate: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleSize: string;
  service: string;
  addOns: string[];
  conditionFlags: string[];
  preferredDate: string;
  timeSlot: string;
  utilitiesConfirmed: boolean;
  depositAcknowledged: boolean;
  hearAbout: string;
  notes: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  postcode: "",
  regPlate: "",
  vehicleMake: "",
  vehicleModel: "",
  vehicleYear: "",
  vehicleSize: "",
  service: "",
  addOns: [],
  conditionFlags: [],
  preferredDate: "",
  timeSlot: "",
  utilitiesConfirmed: false,
  depositAcknowledged: false,
  hearAbout: "",
  notes: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(\+44\s?|0)\d[\d\s]{8,12}$/;
const REG_RE = /^[A-Za-z]{2}\d{2}\s?[A-Za-z]{3}$/;
const POSTCODE_RE = /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/;

function validate(form: FormState): Partial<Record<string, string>> {
  const errors: Partial<Record<string, string>> = {};
  if (!form.name.trim()) errors.name = "Please enter your full name";
  if (!EMAIL_RE.test(form.email.trim())) errors.email = "Please enter a valid email address";
  if (!PHONE_RE.test(form.phone.trim())) errors.phone = "Please enter a valid UK phone number";
  if (!POSTCODE_RE.test(form.postcode.trim())) errors.postcode = "Please enter a valid postcode";
  if (!REG_RE.test(form.regPlate.trim())) errors.regPlate = "Please enter a valid UK registration (e.g. AB21 XYZ)";
  if (!form.vehicleMake.trim()) errors.vehicleMake = "Please enter the vehicle make";
  if (!form.vehicleModel.trim()) errors.vehicleModel = "Please enter the vehicle model";
  const year = Number(form.vehicleYear);
  if (!form.vehicleYear.trim() || !Number.isInteger(year) || year < 1950 || year > new Date().getFullYear() + 1)
    errors.vehicleYear = "Please enter a valid year";
  if (!form.vehicleSize) errors.vehicleSize = "Please select your vehicle size";
  if (!form.service) errors.service = "Please select a service";
  if (!form.preferredDate) errors.preferredDate = "Please choose a preferred date";
  if (!form.timeSlot) errors.timeSlot = "Please choose a time slot";
  if (!form.utilitiesConfirmed) errors.utilitiesConfirmed = "Please confirm water tap and power outlet availability";
  if (!form.depositAcknowledged) errors.depositAcknowledged = "Please acknowledge the deposit policy";
  if (!form.hearAbout) errors.hearAbout = "Please select an option";
  return errors;
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground";
const errorClass = "mt-1 text-xs text-destructive";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

export default function Book() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleList = (key: "addOns" | "conditionFlags", value: string) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const next = [...photos, ...Array.from(files)].filter((f) => f.type.startsWith("image/")).slice(0, 2);
    setPhotos(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setSubmitting(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, Array.isArray(v) ? JSON.stringify(v) : String(v)));
      photos.forEach((p) => body.append("photos", p));
      const { data, error } = await supabase.functions.invoke("submit-booking", { body });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? `Something went wrong sending your booking (${err.message}). Please try again or message us on Instagram.`
          : "Something went wrong sending your booking. Please try again or message us on Instagram.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Osian's Mobile Detailing" className="h-11 w-11 rounded-full" />
            <span className="hidden font-display text-xl tracking-wider sm:block">
              OSIAN'S <span className="text-primary">MOBILE</span> DETAILING
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        {submitted ? (
          <div className="rounded-2xl border border-primary/40 bg-card p-10 text-center shadow-[var(--shadow-glow)]">
            <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
            <h1 className="mt-6 font-display text-4xl tracking-tight md:text-5xl">Booking request sent!</h1>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Thank you, {form.name.split(" ")[0] || "there"} — we've received your booking request for the{" "}
              <span className="text-primary">{form.service}</span> and will be in touch shortly to confirm your
              appointment.
            </p>
            <div className="mx-auto mt-8 max-w-md space-y-3 rounded-xl border border-border bg-background/50 p-6 text-left text-sm text-muted-foreground">
              <p className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />A 50% non-refundable deposit is
                required to secure your slot once confirmed.
              </p>
              <p className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                Please make sure an outdoor water tap and power outlet are accessible on the day.
              </p>
              <p className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                Please remove all personal belongings from the vehicle before your appointment.
              </p>
            </div>
            <Link
              to="/"
              className="mt-8 inline-block rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-10 text-center" ref={formTopRef}>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Book online</p>
              <h1 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">Book Your Detail</h1>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Fill in the form below for a free quote and we'll get back to you to confirm your appointment. All
                fields marked with an asterisk are required.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-10">
              {/* CUSTOMER & LOCATION */}
              <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h2 className="font-display text-2xl tracking-wide">Your Details</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field label="Full Name *" error={errors.name}>
                    <input
                      className={inputClass}
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="e.g. John Smith"
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="Email Address *" error={errors.email}>
                    <input
                      type="email"
                      className={inputClass}
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </Field>
                  <Field label="Phone Number *" error={errors.phone}>
                    <input
                      type="tel"
                      className={inputClass}
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="e.g. 07482 424580"
                      autoComplete="tel"
                    />
                  </Field>
                  <Field label="Location *" error={errors.postcode}>
                    <input
                      className={inputClass}
                      value={form.postcode}
                      onChange={(e) => set("postcode", e.target.value)}
                      placeholder="e.g. 12 High Street, TF1 2AB"
                      autoComplete="street-address"
                    />
                  </Field>
                </div>
              </section>

              {/* VEHICLE */}
              <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h2 className="font-display text-2xl tracking-wide">Vehicle Details</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field label="UK Registration Plate *" error={errors.regPlate}>
                    <input
                      className={`${inputClass} uppercase`}
                      value={form.regPlate}
                      onChange={(e) => set("regPlate", e.target.value.toUpperCase())}
                      placeholder="e.g. AB21 XYZ"
                    />
                  </Field>
                  <Field label="Vehicle Make *" error={errors.vehicleMake}>
                    <input
                      className={inputClass}
                      value={form.vehicleMake}
                      onChange={(e) => set("vehicleMake", e.target.value)}
                      placeholder="e.g. Ford, BMW, Mercedes"
                    />
                  </Field>
                  <Field label="Vehicle Model *" error={errors.vehicleModel}>
                    <input
                      className={inputClass}
                      value={form.vehicleModel}
                      onChange={(e) => set("vehicleModel", e.target.value)}
                      placeholder="e.g. Focus, 3 Series, A-Class"
                    />
                  </Field>
                  <Field label="Vehicle Year *" error={errors.vehicleYear}>
                    <input
                      type="number"
                      className={inputClass}
                      value={form.vehicleYear}
                      onChange={(e) => set("vehicleYear", e.target.value)}
                      placeholder="e.g. 2021"
                      min={1950}
                      max={new Date().getFullYear() + 1}
                    />
                  </Field>
                </div>
                <div className="mt-5">
                  <span className={labelClass}>Vehicle Size *</span>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {VEHICLE_SIZES.map((size) => (
                      <button
                        type="button"
                        key={size.name}
                        onClick={() => set("vehicleSize", size.name)}
                        className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                          form.vehicleSize === size.name
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <span className="block">{size.name}</span>
                        <span className="mt-0.5 block text-xs font-normal opacity-80">{size.example}</span>
                      </button>
                    ))}
                  </div>
                  {errors.vehicleSize && <p className={errorClass}>{errors.vehicleSize}</p>}
                </div>
              </section>

              {/* SERVICE */}
              <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h2 className="font-display text-2xl tracking-wide">Service & Condition</h2>
                <div className="mt-6">
                  <span className={labelClass}>Select a Service *</span>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {SERVICES.map((s) => (
                      <button
                        type="button"
                        key={s.name}
                        onClick={() => set("service", s.name)}
                        className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                          form.service === s.name
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <span className="block">{s.name}</span>
                        <span className="mt-0.5 block text-xs font-medium text-muted-foreground">{s.price}</span>
                      </button>
                    ))}
                  </div>
                  {errors.service && <p className={errorClass}>{errors.service}</p>}
                </div>

                <div className="mt-6">
                  <span className={labelClass}>Add-on Services (optional)</span>
                  <div className="flex flex-wrap gap-2">
                    {ADD_ONS.map((a) => (
                      <button
                        type="button"
                        key={a.name}
                        onClick={() => toggleList("addOns", a.name)}
                        className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                          form.addOns.includes(a.name)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {a.name}{" "}
                        <span className="opacity-80">({a.price})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <span className={labelClass}>Vehicle Condition (optional)</span>
                  <div className="flex flex-wrap gap-2">
                    {CONDITION_FLAGS.map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => toggleList("conditionFlags", c)}
                        className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                          form.conditionFlags.includes(c)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <span className={labelClass}>Photos of Problem Areas (optional, up to 2)</span>
                  <div className="flex flex-wrap items-center gap-3">
                    {photos.map((p, i) => (
                      <div key={i} className="relative">
                        <img
                          src={URL.createObjectURL(p)}
                          alt={`Upload ${i + 1}`}
                          className="h-20 w-20 rounded-lg border border-border object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                          aria-label="Remove photo"
                          className="absolute -right-2 -top-2 rounded-full border border-border bg-background p-1 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {photos.length < 2 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition hover:border-primary hover:text-primary"
                      >
                        <Upload className="h-5 w-5" />
                        <span className="text-[10px]">Add photo</span>
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        addPhotos(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* LOGISTICS */}
              <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h2 className="font-display text-2xl tracking-wide">Appointment & Agreement</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field label="Preferred Date *" error={errors.preferredDate}>
                    <input
                      type="date"
                      className={inputClass}
                      value={form.preferredDate}
                      min={today}
                      onChange={(e) => set("preferredDate", e.target.value)}
                    />
                  </Field>
                  <Field label="Preferred Time Slot *" error={errors.timeSlot}>
                    <select
                      className={inputClass}
                      value={form.timeSlot}
                      onChange={(e) => set("timeSlot", e.target.value)}
                    >
                      <option value="">Select a time slot</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="mt-6 space-y-4">
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background/50 p-4 text-sm">
                    <input
                      type="checkbox"
                      checked={form.utilitiesConfirmed}
                      onChange={(e) => set("utilitiesConfirmed", e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[oklch(0.72_0.22_142)]"
                    />
                    <span>
                      I confirm an <strong>outdoor water tap and power outlet</strong> are available at the
                      appointment location. *
                    </span>
                  </label>
                  {errors.utilitiesConfirmed && <p className={errorClass}>{errors.utilitiesConfirmed}</p>}

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background/50 p-4 text-sm">
                    <input
                      type="checkbox"
                      checked={form.depositAcknowledged}
                      onChange={(e) => set("depositAcknowledged", e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[oklch(0.72_0.22_142)]"
                    />
                    <span>
                      I understand a <strong>50% non-refundable deposit</strong> is required to secure my booking,
                      deductible from the final balance. *
                    </span>
                  </label>
                  {errors.depositAcknowledged && <p className={errorClass}>{errors.depositAcknowledged}</p>}
                </div>

                <div className="mt-6">
                  <Field label="Additional Notes (optional)">
                    <textarea
                      className={`${inputClass} min-h-24 resize-y`}
                      value={form.notes}
                      onChange={(e) => set("notes", e.target.value)}
                      placeholder="Driveway access, specific stains or areas of focus, etc."
                      maxLength={1000}
                    />
                  </Field>
                </div>
              </section>

              {/* MARKETING */}
              <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h2 className="font-display text-2xl tracking-wide">One Last Thing</h2>
                <div className="mt-6">
                  <Field label="How did you hear about us? *" error={errors.hearAbout}>
                    <select
                      className={inputClass}
                      value={form.hearAbout}
                      onChange={(e) => set("hearAbout", e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {HEAR_ABOUT.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </section>

              {submitError && (
                <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Sending your booking…" : "Submit Booking Request"}
              </button>
            </form>
          </>
        )}
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6">
          <img src={logo} alt="Osian's Mobile Detailing" className="h-12 w-12 rounded-full" />
          <p>© {new Date().getFullYear()} Osian's Mobile Detailing · Telford, UK</p>
        </div>
      </footer>
    </div>
  );
}

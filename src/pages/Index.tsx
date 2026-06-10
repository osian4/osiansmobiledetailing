import { Check, MapPin, Mail, Phone, Sparkles, Instagram } from "lucide-react";
import logo from "@/assets/logo.png";
import heroCar from "@/assets/hero-car.jpg";

const services = [
  {
    title: "Interior Detail",
    price: "£129.99",
    description:
      "Thorough interior detailing. Your car's interior will be refreshed in looks and smell for a comfortable drive.",
    sections: [
      {
        heading: "Interior (detailed cleaning)",
        items: [
          "Vacuum of all surfaces",
          "Seat upholstery cleaning with light stain removal",
          "Wipe down of all interior surfaces",
          "All cracks + crevices",
          "Floor mats cleaned",
          "Windows and mirrors cleaned to a streak-free finish",
          "Door jambs cleaned",
          "Boot cleaned",
        ],
      },
    ],
  },
  {
    title: "Full Detail",
    price: "£179.99",
    description:
      "The complete interior and exterior detail — designed to clean every inch of your car.",
    featured: true,
    sections: [
      {
        heading: "Interior",
        items: [
          "Vacuum of all surfaces",
          "Seat upholstery cleaning with light stain removal",
          "Wipe down of all surfaces",
          "All cracks + crevices",
          "Floor mats cleaned",
          "Windows and mirrors cleaned to a streak-free finish",
          "Door jambs cleaned",
          "Boot cleaned",
        ],
      },
      {
        heading: "Exterior",
        items: [
          "Professional hand wash + foam bath",
          "Wheels + rims deep cleaned",
          "Exterior windows cleaned",
          "Ceramic sealant applied",
        ],
      },
      {
        heading: "Protection",
        items: [
          "1–2 month ceramic paint sealant",
          "Premium ceramic tyre shine",
        ],
      },
    ],
  },
  {
    title: "Exterior Detail",
    price: "£79.99",
    description:
      "A meticulous exterior clean finished with a premium ceramic sealant to protect your paintwork and deliver a long-lasting, glossy shine.",
    sections: [
      {
        heading: "Exterior (wash, prep & protection)",
        items: [
          "Professional hand wash + foam bath",
          "Exterior windows cleaned",
          "Tyres and wheels deep cleaned",
          "Ceramic paint sealant applied",
        ],
      },
      {
        heading: "Protection",
        items: [
          "1–2 month ceramic paint sealant",
          "Premium ceramic tyre shine",
        ],
      },
    ],
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-3">
          <a href="#top" className="flex items-center gap-3 justify-self-start">
            <img src={logo} alt="Osian's Mobile Detailing" className="h-11 w-11 rounded-full" />
            <span className="hidden font-display text-xl tracking-wider sm:block">
              OSIAN'S <span className="text-primary">MOBILE</span> DETAILING
            </span>
          </a>
          <nav className="hidden justify-self-center gap-8 text-sm font-medium md:flex">
            <a href="#services" className="hover:text-primary transition-colors">Services</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-2 justify-self-end sm:gap-3">
            <a
              href="https://www.instagram.com/osiansmobiledetailing"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-border p-2 text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.tiktok.com/@osiansmobiledetailing"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="rounded-full border border-border p-2 text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.79a8.16 8.16 0 0 0 4.77 1.52V6.87a4.85 4.85 0 0 1-1.84-.18z"/>
              </svg>
            </a>
            <a
              href="#contact"
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Book Now
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-20">
        <img
          src={heroCar}
          alt="Detailed black luxury car with green accent lighting"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
        <div className="relative mx-auto w-full max-w-7xl px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary">
              <MapPin className="h-3.5 w-3.5" /> Based in Telford, UK
            </div>
            <h1 className="mt-6 font-display text-6xl leading-none tracking-tight sm:text-7xl md:text-8xl">
              Detail that <span className="text-primary">shines</span>.
              <br />
              Service that <span className="text-primary">delivers</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Premium mobile car detailing brought directly to your driveway.
              Interior, exterior and full-service packages with ceramic protection.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#services"
                className="rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:scale-105"
              >
                View Services
              </a>
              <a
                href="#contact"
                className="rounded-full border border-border bg-card/50 px-7 py-3 font-semibold backdrop-blur transition hover:border-primary hover:text-primary"
              >
                Get a Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Our packages</p>
          <h2 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">Choose your detail</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Three core packages crafted to keep your vehicle in showroom condition. All services come to you in Telford and the surrounding area.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:items-stretch">
          {services.map((s) => (
            <article
              key={s.title}
              className={`relative flex flex-col rounded-2xl border bg-card p-8 shadow-[var(--shadow-card)] transition hover:-translate-y-1 ${
                s.featured
                  ? "border-primary/60 lg:scale-105 lg:shadow-[var(--shadow-glow)]"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {s.featured && (
                <div className="absolute -top-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
                  <Sparkles className="h-3.5 w-3.5" /> Most Popular
                </div>
              )}
              <h3 className="font-display text-3xl tracking-wide">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{s.description}</p>

              <div className="my-6 flex items-baseline gap-2 border-y border-border py-5">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">From</span>
                <span className="font-display text-5xl text-primary">{s.price}</span>
              </div>

              <div className="flex-1 space-y-5">
                {s.sections.map((sec) => (
                  <div key={sec.heading}>
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
                      {sec.heading}
                    </h4>
                    <ul className="space-y-2">
                      {sec.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm">
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                className={`mt-8 block rounded-full px-6 py-3 text-center font-semibold transition ${
                  s.featured
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border hover:border-primary hover:text-primary"
                }`}
              >
                Book {s.title}
              </a>
            </article>
          ))}
        </div>

        {/* Add-ons */}
        <div className="mt-16 rounded-2xl border border-border bg-card p-8">
          <h3 className="font-display text-2xl tracking-wide">Additional Services</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              "Clay Towel Treatment (paint decontamination)",
              "Carpet and Seat Shampoo and Extraction",
              "Engine Bay Cleaning",
            ].map((a) => (
              <div key={a} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 p-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="border-y border-border bg-card/30 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
          <img src={logo} alt="Osian's logo" className="mx-auto w-64 rounded-full lg:w-80" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">About us</p>
            <h2 className="mt-3 font-display text-5xl tracking-tight">Passion in every panel</h2>
            <p className="mt-5 text-muted-foreground">
              Osian's Mobile Detailing is a passion-driven service based in Telford, UK.
              We bring professional-grade tools, premium products and meticulous attention
              to detail straight to your driveway — so you don't have to lift a finger.
            </p>
            <p className="mt-4 text-muted-foreground">
              Every vehicle is treated like our own. From a quick refresh to a full
              concours-level transformation, the result is always the same: a finish you'll
              be proud of.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mx-auto max-w-5xl px-6 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Get in touch</p>
        <h2 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">Ready to book?</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Send a message or give us a call — we'll get your car gleaming in no time.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6">
            <MapPin className="mx-auto h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-xl">Location</h3>
            <p className="mt-1 text-sm text-muted-foreground">Telford, UK</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <Phone className="mx-auto h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-xl">Phone</h3>
            <a
              href="tel:+447482424580"
              className="mt-1 block text-sm text-muted-foreground transition hover:text-primary"
            >
              07482 424580
            </a>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <Mail className="mx-auto h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-xl">Email</h3>
            <a
              href="mailto:osiansmobiledetailing@gmail.com"
              className="mt-1 block break-all text-sm text-muted-foreground transition hover:text-primary"
            >
              osiansmobiledetailing@gmail.com
            </a>
          </div>
        </div>

        {/* BOOKING INFORMATION */}
        <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-left">
          <h3 className="text-center font-display text-2xl tracking-wide">Booking Information</h3>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Please review the following before booking your detail.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Final Pricing",
                body: "All listed prices are starting rates. The final quote is confirmed on-site following a brief inspection of the vehicle's size, condition and level of soiling.",
              },
              {
                title: "Pet Hair Removal",
                body: "Removal of pet hair requires additional time and specialist tools, and is charged as an add-on to the standard service.",
              },
              {
                title: "Personal Belongings",
                body: "For liability and security reasons, please remove all personal items from your vehicle prior to your appointment.",
              },
              {
                title: "On-Site Utilities",
                body: "As a mobile service, we use the customer's water and electricity supply. An accessible outdoor water tap and external power outlet are required at the appointment location.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="flex gap-3 rounded-xl border border-border/60 bg-background/50 p-5"
              >
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <h4 className="font-display text-lg tracking-wide">{item.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6">
          <img src={logo} alt="Osian's Mobile Detailing" className="h-12 w-12 rounded-full" />
          <p>© {new Date().getFullYear()} Osian's Mobile Detailing · Telford, UK</p>
        </div>
      </footer>
    </div>
  );
}

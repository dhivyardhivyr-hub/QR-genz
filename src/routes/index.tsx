import { createFileRoute } from "@tanstack/react-router";
import { QrGenerator } from "@/components/QrGenerator";
import { Zap, ShieldCheck, Infinity as InfinityIcon, Palette, Wifi, Link2, MessageCircle, Contact } from "lucide-react";

const TITLE = "Free QR Code Generator – No Sign-up, No Expiry | QR GenZ";
const DESC = "Create free QR codes for links, Wi-Fi, WhatsApp, email, SMS and contacts. Custom colors and styles, PNG & SVG download. No sign-up, never expires.";

const FAQ = [
  { q: "Is QR GenZ really free?", a: "Yes. QR GenZ is a 100% free QR code generator. You can create and download unlimited QR codes without signing up or paying." },
  { q: "Do the QR codes expire?", a: "No. QR GenZ creates static QR codes, so the content is stored inside the code itself. They work forever and never expire." },
  { q: "How do I make a free QR code?", a: "Choose a type like Website or Wi-Fi, enter your details, pick a style and color, then download your QR code as PNG or SVG." },
  { q: "Can I make a Wi-Fi QR code?", a: "Yes. Enter your network name, password and security type. Guests can scan it to join your Wi-Fi without typing the password." },
  { q: "Can I use QR GenZ codes for business and print?", a: "Yes. Downloads are high resolution (1024px PNG) and SVG vector files, ideal for menus, posters, packaging and business cards, including commercial use." },
  { q: "Is my data safe?", a: "Your QR codes are generated right in your browser. We don't store the links or text you enter." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "free qr code generator, qr code generator, free qr, qr code maker, wifi qr code, whatsapp qr code, custom qr code, qr code no sign up" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          {
            "@context": "https://schema.org", "@type": "WebApplication", name: "QR GenZ",
            description: DESC, applicationCategory: "UtilitiesApplication", operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            featureList: ["Free QR code generator", "Wi-Fi QR codes", "WhatsApp QR codes", "vCard QR codes", "PNG and SVG download", "No sign-up", "No expiry"],
          },
          {
            "@context": "https://schema.org", "@type": "FAQPage",
            mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
          {
            "@context": "https://schema.org", "@type": "HowTo", name: "How to create a free QR code",
            step: ["Pick a QR type", "Enter your content", "Choose a style and color", "Download PNG or SVG"].map((t, i) => ({ "@type": "HowToStep", position: i + 1, name: t, text: t })),
          },
        ]),
      },
    ],
  }),
  component: Index,
});

const PERKS = [
  { icon: Zap, t: "Instant", d: "Live preview as you type." },
  { icon: InfinityIcon, t: "Never expires", d: "Static codes work forever." },
  { icon: ShieldCheck, t: "Private", d: "Made in your browser." },
  { icon: Palette, t: "Your style", d: "Colors, dots and eyes." },
];

const USES = [
  { icon: Link2, t: "Free URL QR code", d: "Send people to your site, portfolio, store or link-in-bio." },
  { icon: Wifi, t: "Free Wi-Fi QR code", d: "Guests scan and connect. No password typing." },
  { icon: MessageCircle, t: "Free WhatsApp QR code", d: "Open a chat with a pre-filled message in one scan." },
  { icon: Contact, t: "Free vCard QR code", d: "Share your contact card so people save you instantly." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <a href="/" className="font-display text-xl font-bold">QR <span className="text-gradient">GenZ</span></a>
        <nav className="flex gap-5 text-sm text-muted-foreground">
          <a href="#create" className="hover:text-foreground">Create</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
      </header>

      <main>
        <section className="bg-gradient-hero">
          <div className="mx-auto max-w-6xl px-5 pb-10 pt-10 text-center md:pt-16">
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">100% free · No sign-up · No expiry</span>
            <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
              Free QR Code Generator <span className="text-gradient">with style.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground md:text-lg">
              Make a free QR code for any link, Wi-Fi, WhatsApp or contact in seconds. Customize it. Download it. Done.
            </p>
          </div>
          <div id="create" className="mx-auto max-w-6xl scroll-mt-6 px-5 pb-16">
            <QrGenerator />
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 py-14 md:grid-cols-4">
          {PERKS.map(({ icon: I, t, d }) => (
            <div key={t} className="rounded-2xl border p-5">
              <I className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </section>

        <section className="bg-secondary">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="text-3xl font-bold md:text-4xl">What is a free QR code?</h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              A free QR code is a scannable square that stores a link, text, Wi-Fi login or contact details. With QR GenZ you create
              static QR codes at no cost: the information lives inside the code, so it works on every phone camera and never expires.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {USES.map(({ icon: I, t, d }) => (
                <article key={t} className="flex gap-4 rounded-2xl bg-card p-6">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground"><I className="h-5 w-5" /></div>
                  <div><h3 className="font-semibold">{t}</h3><p className="mt-1 text-sm text-muted-foreground">{d}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-3xl font-bold md:text-4xl">How to make a free QR code</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {["Pick a QR type", "Enter your content", "Choose style & color", "Download PNG or SVG"].map((s, i) => (
              <li key={s} className="rounded-2xl border p-5">
                <span className="font-display text-3xl font-bold text-gradient">0{i + 1}</span>
                <p className="mt-2 font-medium">{s}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="faq" className="mx-auto max-w-3xl scroll-mt-6 px-5 pb-20">
          <h2 className="text-3xl font-bold md:text-4xl">Free QR code FAQ</h2>
          <div className="mt-8 divide-y rounded-2xl border">
            {FAQ.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="cursor-pointer list-none font-semibold">{f.q}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-5 py-8 text-sm text-muted-foreground md:flex-row">
          <span><strong className="text-foreground">QR GenZ</strong> — the free QR code generator.</span>
          <span>© 2026 QR GenZ</span>
        </div>
      </footer>
    </div>
  );
}

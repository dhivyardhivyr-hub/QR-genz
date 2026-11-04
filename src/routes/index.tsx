import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QrGenerator } from "@/components/QrGenerator";
import { Zap, ShieldCheck, Infinity as InfinityIcon, Palette, Wifi, Link2, MessageCircle, Contact } from "lucide-react";

const TITLE = "Free Custom QR Code Generator with Logo – QR GenZ";
const DESC = "Create free custom QR codes for URLs, Wi-Fi and business cards. Add your logo, choose colors and styles, then download high-resolution PNG or SVG. No sign-up.";
const KEYWORDS = "free qr code generator, free qr code creator, qr code maker free, make qr code free, url to qr code, website to qr code, wifi qr code generator, wi-fi qr code, business card qr code, vcard qr code, custom qr code generator, qr code maker with logo, qr code with logo, color qr code creator, stylish qr code generator, qr code design app, qr code maker app, qr code generator no sign up, static qr code generator, qr code png download, qr code svg download";

const FAQ = [
  { q: "Is QR GenZ really free?", a: "Yes. QR GenZ is a 100% free QR code generator. You can create and download unlimited QR codes without signing up or paying." },
  { q: "Do the QR codes expire?", a: "No. QR GenZ creates static QR codes, so the content is stored inside the code itself. They work forever and never expire." },
  { q: "How do I make a free QR code?", a: "Choose a type like Website or Wi-Fi, enter your details, pick a style and color, then download your QR code as PNG or SVG." },
  { q: "Can I make a Wi-Fi QR code?", a: "Yes. Enter your network name, password and security type. Guests can scan it to join your Wi-Fi without typing the password." },
  { q: "Can I use QR GenZ codes for business and print?", a: "Yes. Downloads are high resolution (1024px PNG) and SVG vector files, ideal for menus, posters, packaging and business cards, including commercial use." },
  { q: "Can I add my logo to a QR code?", a: "Yes. Upload an image to place your logo in the center of your QR code. Use a clear logo and test the downloaded code before printing." },
  { q: "Can I customize QR code colors and styles?", a: "Yes. Choose from color themes and QR patterns, add a poster frame and caption, and download your design as PNG or SVG." },
  { q: "Does QR GenZ create dynamic QR codes?", a: "QR GenZ currently creates static QR codes. The destination or information is encoded in the QR code itself, so it does not support changing the destination after printing." },
  { q: "Can I create a QR code for a business card?", a: "Yes. Choose the contact or vCard option and enter your name, phone number, email, company and website to create a shareable digital business card QR code." },
  { q: "Can I scan QR codes with QR GenZ?", a: "QR GenZ is a QR code creator and download tool. It does not currently include a built-in QR code scanner." },
  { q: "Is my data safe?", a: "QR content is generated in your browser. We do not store the links or text you enter into the QR generator. Files you choose to upload are sent to the file-upload service to create a shareable file link." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: KEYWORDS },
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
            featureList: ["Free static QR code generator", "URL to QR code", "Wi-Fi QR codes", "WhatsApp QR codes", "Business card and vCard QR codes", "Custom QR code colors and patterns", "Upload a center logo", "High-resolution PNG and SVG download", "No sign-up", "No expiry"],
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
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("qrgenz-intro-seen") === "1") return;
    setShowIntro(true);
    const timer = window.setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem("qrgenz-intro-seen", "1");
    }, 2600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      {showIntro && (
        <div className="qrgenz-intro" role="status" aria-label="Welcome to QR GenZ">
          <div className="qrgenz-intro-orbit" />
          <div className="qrgenz-intro-content">
            <img src="/qr-genz-logo.svg" alt="QR GenZ logo" className="qrgenz-intro-logo" />
            <div className="qrgenz-intro-name">QR <span>GENZ</span></div>
            <p className="qrgenz-intro-tagline">SCAN · SHARE · CONNECT</p>
            <div className="qrgenz-intro-progress"><span /></div>
          </div>
        </div>
      )}
      <style>{`
        .qrgenz-intro {
          position: fixed; inset: 0; z-index: 10000; display: grid; place-items: center;
          overflow: hidden; background: radial-gradient(circle at 50% 45%, #17104b 0%, #08051d 42%, #020208 100%);
          animation: qrg-intro-out 0.55s ease 2.05s forwards;
        }
        .qrgenz-intro::before {
          content: ""; position: absolute; width: min(82vw, 520px); aspect-ratio: 1;
          border-radius: 50%; border: 2px solid transparent;
          background: linear-gradient(#08051d,#08051d) padding-box, linear-gradient(120deg,#c51cff,#5b43ff,#10dfff) border-box;
          box-shadow: 0 0 45px #682bff55, inset 0 0 45px #3420a633;
          animation: qrg-ring-in 1s cubic-bezier(.2,.8,.2,1) both;
        }
        .qrgenz-intro-orbit {
          position: absolute; width: min(92vw, 590px); aspect-ratio: 1; border-radius: 50%;
          border: 1px solid #6e4cff55; transform: rotate(-24deg) scale(.82);
          animation: qrg-orbit 2.2s ease-in-out infinite;
        }
        .qrgenz-intro-content { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
        .qrgenz-intro-logo { width: clamp(150px, 35vw, 230px); height: auto; filter: drop-shadow(0 0 24px #6d3dff88); animation: qrg-logo-in .8s cubic-bezier(.16,1,.3,1) both; }
        .qrgenz-intro-name { margin-top: 14px; color: white; font: 900 clamp(34px, 8vw, 54px)/1 Arial,sans-serif; letter-spacing: -2px; animation: qrg-text-in .7s .25s both; }
        .qrgenz-intro-name span { background: linear-gradient(90deg,#c31cff,#16d8ff); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .qrgenz-intro-tagline { margin-top: 13px; color: #e9e7ff; font: 700 10px/1 Arial,sans-serif; letter-spacing: .34em; animation: qrg-text-in .7s .4s both; }
        .qrgenz-intro-progress { width: 112px; height: 3px; margin-top: 28px; overflow: hidden; border-radius: 9px; background: #ffffff20; }
        .qrgenz-intro-progress span { display: block; width: 100%; height: 100%; transform: scaleX(0); transform-origin: left; background: linear-gradient(90deg,#c31cff,#16d8ff); animation: qrg-progress 2.2s linear forwards; }
        @keyframes qrg-logo-in { from { opacity: 0; transform: translateY(24px) scale(.72) rotate(-8deg); } to { opacity: 1; transform: translateY(0) scale(1) rotate(0); } }
        @keyframes qrg-text-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes qrg-ring-in { from { opacity: 0; transform: scale(.72) rotate(-35deg); } to { opacity: 1; transform: scale(1) rotate(0); } }
        @keyframes qrg-orbit { 0%,100% { transform: rotate(-24deg) scale(.82); } 50% { transform: rotate(24deg) scale(.9); } }
        @keyframes qrg-progress { to { transform: scaleX(1); } }
        @keyframes qrg-intro-out { to { opacity: 0; visibility: hidden; pointer-events: none; } }
        @media (prefers-reduced-motion: reduce) { .qrgenz-intro, .qrgenz-intro * { animation-duration: .01ms !important; animation-iteration-count: 1 !important; } }
      `}</style>
      <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <a href="/" className="font-display text-xl font-bold">QR <span className="text-brand">GenZ</span></a>
        <nav className="flex gap-5 text-sm text-muted-foreground">
          <a href="#create" className="hover:text-foreground">Create</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
      </header>

      <main>
        <section className="bg-hero">
          <div className="mx-auto max-w-6xl px-5 pb-10 pt-10 text-center md:pt-16">
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">100% free · No sign-up · No expiry</span>
            <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
              Free QR Code Generator <span className="text-brand">with style.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground md:text-lg">
              Turn a URL, Wi-Fi network, WhatsApp chat or contact into a free QR code. Add your logo, customize colors and patterns, then download a high-resolution PNG or SVG.
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
            <h2 className="text-3xl font-bold md:text-4xl">Free custom QR code maker for URLs, Wi-Fi and business cards</h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              QR GenZ is a free QR code creator for websites, Wi-Fi access and digital business cards. Create a URL to QR code in seconds, add a center logo, choose a color theme and pattern, and export the result as PNG or SVG. QR GenZ creates static QR codes: the information is stored in the code itself, so the code does not expire, but its destination cannot be edited after creation.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {USES.map(({ icon: I, t, d }) => (
                <article key={t} className="flex gap-4 rounded-2xl bg-card p-6">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand text-primary-foreground"><I className="h-5 w-5" /></div>
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
                <span className="font-display text-3xl font-bold text-brand">0{i + 1}</span>
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
    </>
  );
}

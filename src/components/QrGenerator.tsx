import { useEffect, useMemo, useRef, useState } from "react";
import type QRCodeStyling from "qr-code-styling";
import type { Options } from "qr-code-styling";
import { Download, Copy, Check, Share2, Upload, Loader2, ImagePlus, X } from "lucide-react";
import { QR_TYPES, buildPayload, type QrType, type Fields } from "@/lib/qr-payload";

const FIELDS: Record<QrType, { key: keyof Fields; label: string; placeholder?: string; area?: boolean }[]> = {
  url: [{ key: "url", label: "Any link — website, Instagram, YouTube, store, Google Form…", placeholder: "instagram.com/yourname" }],
  file: [],
  text: [{ key: "text", label: "Your text", placeholder: "Type anything…", area: true }],
  wifi: [
    { key: "ssid", label: "Network name", placeholder: "MyWiFi" },
    { key: "password", label: "Password" },
    { key: "enc", label: "Security (WPA / WEP / nopass)", placeholder: "WPA" },
  ],
  email: [
    { key: "email", label: "Email", placeholder: "hi@example.com" },
    { key: "subject", label: "Subject" },
    { key: "body", label: "Message", area: true },
  ],
  phone: [{ key: "phone", label: "Phone number", placeholder: "+91 98765 43210" }],
  sms: [
    { key: "phone", label: "Phone number" },
    { key: "message", label: "Message", area: true },
  ],
  whatsapp: [
    { key: "phone", label: "WhatsApp number (with country code)", placeholder: "+91 98765 43210" },
    { key: "message", label: "Pre-filled message", area: true },
  ],
  vcard: [
    { key: "name", label: "Full name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "org", label: "Company" },
    { key: "url", label: "Website" },
  ],
  location: [{ key: "place", label: "Address or place", placeholder: "India Gate, New Delhi" }],
};

type Theme = { id: string; label: string; c1: string; c2: string; eye: string; bg1: string; bg2: string };
const THEMES: Theme[] = [
  { id: "violet", label: "Violet", c1: "#7057FF", c2: "#B05CFF", eye: "#4B2FE0", bg1: "#7057FF", bg2: "#C084FC" },
  { id: "sunset", label: "Sunset", c1: "#FF5F6D", c2: "#FFA94D", eye: "#E2364A", bg1: "#FF5F6D", bg2: "#FFC371" },
  { id: "ocean", label: "Ocean", c1: "#0EA5E9", c2: "#2DD4BF", eye: "#0369A1", bg1: "#0EA5E9", bg2: "#5EEAD4" },
  { id: "forest", label: "Forest", c1: "#16A36A", c2: "#84CC16", eye: "#0F6B47", bg1: "#16A36A", bg2: "#A3E635" },
  { id: "insta", label: "Insta", c1: "#833AB4", c2: "#FD1D1D", eye: "#C13584", bg1: "#833AB4", bg2: "#FCB045" },
  { id: "mono", label: "Mono", c1: "#17152A", c2: "#3F3B5C", eye: "#17152A", bg1: "#17152A", bg2: "#4B4870" },
];

const STYLES = [
  { id: "rounded", label: "Rounded", dots: "rounded", eye: "extra-rounded", eyeDot: "dot" },
  { id: "dots", label: "Bubbles", dots: "dots", eye: "dot", eyeDot: "dot" },
  { id: "classy", label: "Classy", dots: "classy-rounded", eye: "extra-rounded", eyeDot: "square" },
  { id: "square", label: "Classic", dots: "square", eye: "square", eyeDot: "square" },
] as const;

const FRAMES = [
  { id: "poster", label: "Poster card" },
  { id: "plain", label: "QR only" },
] as const;

export function QrGenerator() {
  const [type, setType] = useState<QrType>("url");
  const [fields, setFields] = useState<Fields>({ url: "" });
  const [theme, setTheme] = useState<Theme>(THEMES[0]!);
  const [style, setStyle] = useState<(typeof STYLES)[number]>(STYLES[0]);
  const [frame, setFrame] = useState<(typeof FRAMES)[number]["id"]>("poster");
  const [caption, setCaption] = useState("SCAN ME");
  const [logo, setLogo] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const [upload, setUpload] = useState<{ name: string; size: number; preview?: string | undefined; state: "busy" | "done" | "error"; msg?: string | undefined } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const qr = useRef<QRCodeStyling | null>(null);
  const data = useMemo(() => buildPayload(type, fields), [type, fields]);

  const options = useMemo<Options>(
    () => ({
      width: 260, height: 260, type: "svg", margin: 6,
      data: data || "https://qrgenz.app",
      ...(logo ? { image: logo } : {}),
      imageOptions: { margin: 4, imageSize: 0.32, hideBackgroundDots: true, crossOrigin: "anonymous" },
      qrOptions: { errorCorrectionLevel: logo ? "H" : "Q" },
      dotsOptions: { type: style.dots, gradient: { type: "linear", rotation: Math.PI / 4, colorStops: [{ offset: 0, color: theme.c1 }, { offset: 1, color: theme.c2 }] } },
      cornersSquareOptions: { color: theme.eye, type: style.eye },
      cornersDotOptions: { color: theme.eye, type: style.eyeDot },
      backgroundOptions: { color: "#FFFFFF" },
    }),
    [data, theme, style, logo],
  );

  useEffect(() => {
    let alive = true;
    import("qr-code-styling").then(({ default: QR }) => {
      if (!alive || !ref.current) return;
      if (!qr.current) {
        qr.current = new QR(options);
        ref.current.innerHTML = "";
        qr.current.append(ref.current);
      } else qr.current.update(options);
    });
    return () => { alive = false; };
  }, [options]);

  /** Render the final image (poster card or plain QR) as a PNG blob. */
  const renderPng = async (): Promise<Blob> => {
    const { default: QR } = await import("qr-code-styling");
    const size = 1024;
    const raw = (await new QR({ ...options, type: "canvas", width: size, height: size, margin: 24 }).getRawData("png")) as Blob;
    if (frame === "plain") return raw;
    const img = await createImageBitmap(raw);
    const W = 1200, H = 1500;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d")!;
    const grad = g.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, theme.bg1); grad.addColorStop(1, theme.bg2);
    g.fillStyle = grad; g.fillRect(0, 0, W, H);
    g.globalAlpha = 0.12; g.fillStyle = "#FFFFFF";
    g.beginPath(); g.arc(W - 80, 120, 260, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(60, H - 60, 220, 0, Math.PI * 2); g.fill();
    g.globalAlpha = 1;
    const card = { x: 100, y: 140, w: 1000, h: 1000 };
    g.fillStyle = "#FFFFFF";
    g.beginPath(); g.roundRect(card.x, card.y, card.w, card.h, 64); g.fill();
    g.drawImage(img, card.x + 40, card.y + 40, card.w - 80, card.h - 80);
    g.fillStyle = "#FFFFFF"; g.textAlign = "center";
    g.font = "700 96px 'Space Grotesk', sans-serif";
    g.fillText(caption.slice(0, 22) || "SCAN ME", W / 2, 1290);
    g.globalAlpha = 0.85; g.font = "500 36px 'DM Sans', sans-serif";
    g.fillText("Made free with QR GenZ", W / 2, 1390);
    return await new Promise((r) => c.toBlob((b) => r(b!), "image/png"));
  };

  const downloadPng = async () => {
    const blob = await renderPng();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `qr-genz-${type}.png`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  const downloadSvg = async () => {
    const { default: QR } = await import("qr-code-styling");
    new QR({ ...options, width: 1024, height: 1024, margin: 24 }).download({ name: `qr-genz-${type}`, extension: "svg" });
  };

  const shareText = type === "url" || type === "file" || type === "whatsapp" || type === "location" ? `Scan my QR or open: ${data}` : "Scan my QR code — made free with QR GenZ";

  const shareImage = async () => {
    const blob = await renderPng();
    const file = new File([blob], "qr-genz.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: "My QR code", text: shareText }).catch(() => {});
    } else {
      await downloadPng();
    }
  };

  const onLogo = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setLogo(r.result as string);
    r.readAsDataURL(f);
  };

  const onUpload = async (f?: File) => {
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) return setUpload({ name: f.name, size: f.size, state: "error", msg: "Max size is 10MB" });
    const preview = f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined;
    setUpload({ name: f.name, size: f.size, preview, state: "busy" });
    const body = new FormData();
    body.append("file", f);
    const res = await fetch("/api/public/upload", { method: "POST", body }).catch(() => null);
    const json = res ? await res.json().catch(() => ({})) : {};
    if (!res?.ok || !json.url) return setUpload({ name: f.name, size: f.size, preview, state: "error", msg: json.error || "Upload failed" });
    setUpload({ name: f.name, size: f.size, preview, state: "done" });
    setFields({ url: json.url });
  };

  const enc = encodeURIComponent(shareText);
  const SOCIAL = [
    { label: "WhatsApp", href: `https://wa.me/?text=${enc}` },
    { label: "Telegram", href: `https://t.me/share/url?url=${encodeURIComponent(data)}&text=${enc}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data)}` },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${enc}` },
  ];

  const isLink = /^https?:\/\//.test(data);

  return (
    <div className="grid gap-6 rounded-3xl border bg-card p-4 shadow-elegant md:grid-cols-[1.2fr_1fr] md:p-8">
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="QR type">
          {QR_TYPES.map((t) => (
            <button
              key={t.id} role="tab" aria-selected={type === t.id}
              onClick={() => { setType(t.id); setFields({}); setUpload(null); }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${type === t.id ? "bg-brand text-primary-foreground" : "bg-secondary text-foreground hover:bg-accent"}`}
            >{t.label}</button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {type === "file" && (
            <div>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition hover:border-primary hover:bg-accent">
                <Upload className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Upload an image, PDF, audio or video</span>
                <span className="text-xs text-muted-foreground">PNG, JPG, WebP, GIF, PDF, MP3, MP4 · up to 10MB</span>
                <input type="file" className="sr-only" accept="image/png,image/jpeg,image/webp,image/gif,application/pdf,audio/mpeg,video/mp4" onChange={(e) => onUpload(e.target.files?.[0])} />
              </label>
              {upload && (
                <div className="mt-3 flex items-center gap-3 rounded-xl bg-secondary p-3">
                  {upload.preview ? <img src={upload.preview} alt="" className="h-12 w-12 rounded-lg object-cover" /> : <div className="grid h-12 w-12 place-items-center rounded-lg bg-accent text-xs font-bold text-accent-foreground">FILE</div>}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{upload.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(upload.size / 1024 / 1024).toFixed(2)} MB · {upload.state === "busy" ? "Uploading…" : upload.state === "done" ? "Ready — your QR opens this file" : upload.msg}
                    </p>
                  </div>
                  {upload.state === "busy" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                  {upload.state === "done" && <Check className="h-4 w-4 text-success" />}
                </div>
              )}
            </div>
          )}
          {FIELDS[type].map((f) => {
            const common = {
              id: f.key, value: fields[f.key] ?? "", placeholder: f.placeholder,
              onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFields((p) => ({ ...p, [f.key]: e.target.value })),
              className: "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring",
            };
            return (
              <label key={f.key} className="block">
                <span className="mb-1.5 block text-sm font-medium">{f.label}</span>
                {f.area ? <textarea rows={3} {...common} /> : <input {...common} />}
              </label>
            );
          })}
        </div>

        <div className="mt-6">
          <span className="mb-2 block text-sm font-medium">Color theme</span>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button key={t.id} onClick={() => setTheme(t)} aria-label={t.label}
                className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-sm ${theme.id === t.id ? "border-primary bg-accent text-accent-foreground" : "hover:bg-secondary"}`}>
                <span className="h-5 w-5 rounded-full" style={{ background: `linear-gradient(135deg, ${t.c1}, ${t.c2})` }} />{t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <span className="mb-2 block text-sm font-medium">Pattern</span>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button key={s.id} onClick={() => setStyle(s)}
                className={`rounded-xl border px-3 py-2 text-sm ${style.id === s.id ? "border-primary bg-accent text-accent-foreground" : "hover:bg-secondary"}`}>{s.label}</button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <span className="mb-2 block text-sm font-medium">Frame</span>
            <div className="flex gap-2">
              {FRAMES.map((f) => (
                <button key={f.id} onClick={() => setFrame(f.id)}
                  className={`rounded-xl border px-3 py-2 text-sm ${frame === f.id ? "border-primary bg-accent text-accent-foreground" : "hover:bg-secondary"}`}>{f.label}</button>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-2 block text-sm font-medium">Center logo</span>
            {logo ? (
              <div className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="h-9 w-9 rounded-lg border object-contain" />
                <button onClick={() => setLogo(undefined)} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><X className="h-4 w-4" />Remove</button>
              </div>
            ) : (
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-secondary">
                <ImagePlus className="h-4 w-4" />Add logo
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => onLogo(e.target.files?.[0])} />
              </label>
            )}
          </div>
        </div>

        {frame === "poster" && (
          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-medium">Poster text</span>
            <input value={caption} maxLength={22} onChange={(e) => setCaption(e.target.value)}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </label>
        )}
      </div>

      <div className="flex min-w-0 flex-col items-center justify-center rounded-2xl bg-secondary p-5">
        <div
          className={frame === "poster" ? "flex flex-col items-center rounded-3xl p-5 pb-4" : ""}
          style={frame === "poster" ? { background: `linear-gradient(135deg, ${theme.bg1}, ${theme.bg2})` } : undefined}
        >
          <div ref={ref} className="rounded-2xl bg-background p-3" aria-label="QR code preview" />
          {frame === "poster" && (
            <p className="mt-3 font-display text-2xl font-bold tracking-wide text-primary-foreground">{caption || "SCAN ME"}</p>
          )}
        </div>
        <p className="mt-3 min-h-5 w-full truncate text-center text-xs text-muted-foreground">{data || "Add your link or content to create your QR"}</p>

        <div className="mt-3 grid w-full grid-cols-2 gap-2">
          <button disabled={!data} onClick={shareImage} className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"><Share2 className="h-4 w-4" />Share QR image</button>
          <button disabled={!data} onClick={downloadPng} className="inline-flex items-center justify-center gap-2 rounded-xl border bg-background px-4 py-3 text-sm font-semibold disabled:opacity-50"><Download className="h-4 w-4" />PNG</button>
          <button disabled={!data} onClick={downloadSvg} className="inline-flex items-center justify-center gap-2 rounded-xl border bg-background px-4 py-3 text-sm font-semibold disabled:opacity-50"><Download className="h-4 w-4" />SVG</button>
        </div>

        <div className="mt-3 flex w-full flex-wrap justify-center gap-2">
          {SOCIAL.filter((s) => isLink || s.label === "WhatsApp" || s.label === "X").map((s) => (
            <a key={s.label} href={data ? s.href : undefined} target="_blank" rel="noopener noreferrer"
              aria-disabled={!data}
              className={`rounded-full border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent ${data ? "" : "pointer-events-none opacity-50"}`}>{s.label}</a>
          ))}
          <button disabled={!data} onClick={() => { navigator.clipboard.writeText(data); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-50">
            {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}{copied ? "Copied" : "Copy link"}
          </button>
        </div>
      </div>
    </div>
  );
}

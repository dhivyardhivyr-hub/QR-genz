import { useEffect, useMemo, useRef, useState } from "react";
import type QRCodeStyling from "qr-code-styling";
import { Download, Copy, Check } from "lucide-react";
import { QR_TYPES, buildPayload, type QrType, type Fields } from "@/lib/qr-payload";

const FIELDS: Record<QrType, { key: string; label: string; placeholder?: string; area?: boolean }[]> = {
  url: [{ key: "url", label: "Website URL", placeholder: "yourwebsite.com" }],
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
};

const STYLES = [
  { id: "rounded", label: "Rounded", dots: "rounded", eye: "extra-rounded" },
  { id: "dots", label: "Dots", dots: "dots", eye: "dot" },
  { id: "classy", label: "Classy", dots: "classy-rounded", eye: "extra-rounded" },
  { id: "square", label: "Classic", dots: "square", eye: "square" },
] as const;

const COLORS = ["#7057FF", "#17152A", "#E1306C", "#16A36A", "#FF7A00", "#0EA5E9"];

export function QrGenerator() {
  const [type, setType] = useState<QrType>("url");
  const [fields, setFields] = useState<Fields>({ url: "qrgenz.app" });
  const [color, setColor] = useState(COLORS[0]);
  const [style, setStyle] = useState<(typeof STYLES)[number]>(STYLES[0]);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const qr = useRef<QRCodeStyling | null>(null);
  const data = useMemo(() => buildPayload(type, fields), [type, fields]);

  const options = useMemo(
    () => ({
      width: 280, height: 280, type: "svg" as const, margin: 8,
      data: data || " ",
      qrOptions: { errorCorrectionLevel: "Q" as const },
      dotsOptions: { color, type: style.dots },
      cornersSquareOptions: { color, type: style.eye },
      cornersDotOptions: { color },
      backgroundOptions: { color: "#FFFFFF" },
    }),
    [data, color, style],
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

  const download = async (ext: "png" | "svg") => {
    const { default: QR } = await import("qr-code-styling");
    const big = new QR({ ...options, width: 1024, height: 1024, margin: 32 });
    big.download({ name: `qr-genz-${type}`, extension: ext });
  };

  return (
    <div className="grid gap-6 rounded-3xl border bg-card p-4 shadow-elegant md:grid-cols-[1.2fr_1fr] md:p-8">
      <div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="QR type">
          {QR_TYPES.map((t) => (
            <button
              key={t.id} role="tab" aria-selected={type === t.id}
              onClick={() => { setType(t.id); setFields({}); }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${type === t.id ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-accent"}`}
            >{t.label}</button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
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
          <span className="mb-2 block text-sm font-medium">Style</span>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button key={s.id} onClick={() => setStyle(s)}
                className={`rounded-xl border px-3 py-2 text-sm ${style.id === s.id ? "border-primary bg-accent text-accent-foreground" : "hover:bg-secondary"}`}>{s.label}</button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <span className="mb-2 block text-sm font-medium">Color</span>
          <div className="flex items-center gap-2">
            {COLORS.map((c) => (
              <button key={c} aria-label={`Color ${c}`} onClick={() => setColor(c)}
                style={{ background: c }}
                className={`h-8 w-8 rounded-full ring-offset-2 ${color === c ? "ring-2 ring-ring" : ""}`} />
            ))}
            <input type="color" aria-label="Custom color" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl bg-secondary p-6">
        <div ref={ref} className="rounded-2xl bg-background p-3" aria-label="QR code preview" />
        <p className="mt-3 min-h-5 max-w-full truncate text-xs text-muted-foreground">{data || "Fill in the details to create your QR"}</p>
        <div className="mt-4 grid w-full grid-cols-2 gap-2">
          <button disabled={!data} onClick={() => download("png")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"><Download className="h-4 w-4" />PNG</button>
          <button disabled={!data} onClick={() => download("svg")} className="inline-flex items-center justify-center gap-2 rounded-xl border bg-background px-4 py-3 text-sm font-semibold disabled:opacity-50"><Download className="h-4 w-4" />SVG</button>
        </div>
        <button disabled={!data} onClick={() => { navigator.clipboard.writeText(data); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}{copied ? "Copied" : "Copy content"}
        </button>
      </div>
    </div>
  );
}

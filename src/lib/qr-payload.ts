export type QrType = "url" | "text" | "wifi" | "email" | "phone" | "sms" | "whatsapp" | "vcard";

export const QR_TYPES: { id: QrType; label: string }[] = [
  { id: "url", label: "Website" },
  { id: "text", label: "Text" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "sms", label: "SMS" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "vcard", label: "Contact" },
];

export type Fields = Record<string, string>;

const esc = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");

export function buildPayload(type: QrType, f: Fields): string {
  switch (type) {
    case "url": {
      const u = (f.url ?? "").trim();
      if (!u) return "";
      return /^[a-z]+:\/\//i.test(u) ? u : `https://${u}`;
    }
    case "text":
      return f.text ?? "";
    case "wifi":
      if (!f.ssid) return "";
      return `WIFI:T:${f.enc || "WPA"};S:${esc(f.ssid)};P:${esc(f.password ?? "")};;`;
    case "email":
      if (!f.email) return "";
      return `mailto:${f.email}?subject=${encodeURIComponent(f.subject ?? "")}&body=${encodeURIComponent(f.body ?? "")}`;
    case "phone":
      return f.phone ? `tel:${f.phone.replace(/\s/g, "")}` : "";
    case "sms":
      return f.phone ? `SMSTO:${f.phone.replace(/\s/g, "")}:${f.message ?? ""}` : "";
    case "whatsapp": {
      const n = (f.phone ?? "").replace(/\D/g, "");
      return n ? `https://wa.me/${n}?text=${encodeURIComponent(f.message ?? "")}` : "";
    }
    case "vcard":
      if (!f.name) return "";
      return [
        "BEGIN:VCARD", "VERSION:3.0", `FN:${f.name}`,
        f.phone && `TEL:${f.phone}`, f.email && `EMAIL:${f.email}`,
        f.org && `ORG:${f.org}`, f.url && `URL:${f.url}`, "END:VCARD",
      ].filter(Boolean).join("\n");
  }
}

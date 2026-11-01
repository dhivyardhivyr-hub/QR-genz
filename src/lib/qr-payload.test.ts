import { describe, it, expect } from "vitest";
import { buildPayload } from "./qr-payload";

describe("buildPayload", () => {
  it("adds https to bare URLs", () => {
    expect(buildPayload("url", { url: "qrgenz.com" })).toBe("https://qrgenz.com");
  });
  it("builds Wi-Fi strings", () => {
    expect(buildPayload("wifi", { ssid: "Home", password: "p;w", enc: "WPA" })).toBe("WIFI:T:WPA;S:Home;P:p\\;w;;");
  });
  it("builds WhatsApp links with digits only", () => {
    expect(buildPayload("whatsapp", { phone: "+91 98765 43210" })).toBe("https://wa.me/919876543210?text=");
  });
});

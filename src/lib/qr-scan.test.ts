import { describe, expect, it } from "vitest";
import { matchesQrPayload } from "./qr-scan";

describe("QR export scan gate", () => {
  it("accepts only the exact entered payload", () => {
    expect(matchesQrPayload("https://example.com/video.mp4", "https://example.com/video.mp4")).toBe(true);
    expect(matchesQrPayload("https://example.com/other", "https://example.com/video.mp4")).toBe(false);
  });
  it("rejects unreadable codes and empty content", () => {
    expect(matchesQrPayload(undefined, "https://example.com")).toBe(false);
    expect(matchesQrPayload("", "")).toBe(false);
  });
});
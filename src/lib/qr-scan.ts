import jsQR from "jsqr";

export function matchesQrPayload(decoded: string | undefined, expected: string): boolean {
  return Boolean(expected && decoded === expected);
}

export async function scanQrImage(blob: Blob, expected: string): Promise<string> {
  const image = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = image.width; canvas.height = image.height;
  const context = canvas.getContext("2d");
  if (!context) { image.close(); throw new Error("Scanner is unavailable in this browser."); }
  context.drawImage(image, 0, 0); image.close();
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const result = jsQR(pixels.data, pixels.width, pixels.height, { inversionAttempts: "attemptBoth" });
  if (!matchesQrPayload(result?.data, expected)) throw new Error("Scan failed. Try Classic pattern, Mono colors, or remove the logo.");
  return expected;
}
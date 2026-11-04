import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const generateQrArt = createServerFn({ method: "POST" })
  .inputValidator(z.object({ style: z.string().trim().min(3).max(600) }))
  .handler(async ({ data }) => {
    const { generateImage, GatewayError } = await import("@lovable.dev/ai-gateway");
    try {
      const result = await generateImage({
        model: "openai/gpt-image-2.5-sunburst",
        prompt: `Create a beautiful square artwork for a QR poster. Visual style: ${data.style}. Keep the central square 60% of the image calm and pale; concentrate recognizable illustrated details around the outer edges. No text, letters, logos, barcodes or QR codes.`,
        size: "1024x1024", quality: "medium", n: 1, output_format: "png",
      });
      const image = result.data?.[0];
      if (image?.b64_json) return { image: `data:image/png;base64,${image.b64_json}`, error: "" };
      if (image?.url) {
        const response = await fetch(image.url);
        if (!response.ok) throw new Error("Image download failed");
        const bytes = new Uint8Array(await response.arrayBuffer());
        let binary = "";
        for (const byte of bytes) binary += String.fromCharCode(byte);
        return { image: `data:image/png;base64,${btoa(binary)}`, error: "" };
      }
      return { image: "", error: "The model did not return an image. Your QR is unchanged." };
    } catch (error: unknown) {
      if (error instanceof GatewayError) {
        console.error("QR art generation", { code: error.code, ids: error.ids });
        return { image: "", error: error.httpStatus === 402 ? "AI credits are unavailable. The app owner needs to add credits." : "AI image creation could not finish. Your style is saved; try again when available." };
      }
      console.error("QR art image failure", error);
      return { image: "", error: "Could not create the artwork. Your QR is unchanged." };
    }
  });
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Download, Share2, Sparkles, ScanLine, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateQrArt } from "@/lib/qr-art.functions";
import { scanQrImage } from "@/lib/qr-scan";

export function QrArtStudio({ data, renderQr }: { data: string; renderQr: () => Promise<Blob> }) {
  const generate = useServerFn(generateQrArt);
  const [style, setStyle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ blob: Blob; url: string; payload: string } | null>(null);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);
  const valid = result?.payload === data;

  const create = async () => {
    setBusy(true); setError(""); setResult(null);
    try {
      const qrBlob = await renderQr();
      const response = await generate({ data: { style } });
      if (!response.image) throw new Error(response.error);
      const artwork = await createImageBitmap(await (await fetch(response.image)).blob());
      const qr = await createImageBitmap(qrBlob);
      const canvas = document.createElement("canvas"); canvas.width = 1024; canvas.height = 1024;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Image creation is unavailable in this browser.");
      context.drawImage(artwork, 0, 0, 1024, 1024);
      context.drawImage(qr, 192, 192, 640, 640);
      artwork.close(); qr.close();
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("Could not save artwork")), "image/png"));
      await scanQrImage(blob, data);
      setResult({ blob, url: URL.createObjectURL(blob), payload: data });
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Could not generate artwork."); }
    finally { setBusy(false); }
  };
  const download = () => {
    if (!result || !valid) return;
    const a = document.createElement("a"); a.href = result.url; a.download = "qr-genz-ai.png"; a.click();
  };
  const share = async () => {
    if (!result || !valid) return;
    const file = new File([result.blob], "qr-genz-ai.png", { type: "image/png" });
    try {
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: "QR GenZ" });
      else download();
    } catch (e: unknown) { if (!(e instanceof DOMException && e.name === "AbortError")) setError("Sharing failed. Download the image instead."); }
  };
  return <section className="mt-8 border-t pt-6">
    <h2 className="flex items-center gap-2 text-xl font-bold"><Sparkles className="text-primary" />AI QR Studio</h2>
    <label className="mt-4 block text-sm font-medium">Visual style<textarea aria-label="Visual style" value={style} maxLength={600} onChange={e => setStyle(e.target.value)} placeholder="Neon flowers, futuristic city, watercolor ocean…" className="mt-2 w-full rounded-lg border bg-background p-3" rows={3} /></label>
    <Button className="mt-3" disabled={!data || style.trim().length < 3 || busy} onClick={create}>{busy ? <Loader2 className="animate-spin" /> : <Sparkles />}{busy ? "Creating and testing…" : "Generate AI QR"}</Button>
    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
    {result && valid && <div className="mt-5">
      <img src={result.url} alt="AI-styled QR code" className="mx-auto aspect-square w-full max-w-sm rounded-lg" />
      <p role="status" className="mt-3 flex items-center justify-center gap-2 text-sm text-success"><ScanLine />Scan passed — content matches</p>
      <div className="mt-3 flex justify-center gap-3"><Button onClick={download}><Download />Download AI PNG</Button><Button variant="outline" onClick={share}><Share2 />Share AI QR</Button></div>
    </div>}
  </section>;
}
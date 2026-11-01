import { createFileRoute } from "@tanstack/react-router";

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf", "audio/mpeg", "video/mp4"];
const MAX = 10 * 1024 * 1024;

export const Route = createFileRoute("/api/public/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const form = await request.formData().catch(() => null);
        const file = form?.get("file");
        if (!(file instanceof File)) return Response.json({ error: "No file" }, { status: 400 });
        if (!ALLOWED.includes(file.type)) return Response.json({ error: "Unsupported file type" }, { status: 400 });
        if (file.size > MAX) return Response.json({ error: "File is larger than 10MB" }, { status: 400 });

        const ext = (file.name.split(".").pop() || "bin").replace(/[^a-z0-9]/gi, "").slice(0, 5).toLowerCase();
        const id = `${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}.${ext}`;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.storage.from("qr-files").upload(id, file, { contentType: file.type });
        if (error) return Response.json({ error: "Upload failed" }, { status: 500 });

        return Response.json({ url: `${new URL(request.url).origin}/f/${id}` });
      },
    },
  },
});

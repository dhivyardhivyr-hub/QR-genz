import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/f/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        if (!/^[a-f0-9]{16}\.[a-z0-9]{1,5}$/.test(params.id)) return new Response("Not found", { status: 404 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("qr-files").download(params.id);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(data, {
          headers: {
            "Content-Type": data.type || "application/octet-stream",
            "Cache-Control": "public, max-age=31536000, immutable",
            "Content-Disposition": "inline",
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    },
  },
});

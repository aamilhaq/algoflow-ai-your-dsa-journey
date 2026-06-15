// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// When building on Vercel (VERCEL=1 is injected by Vercel's build env), target the
// nitro "vercel" preset so the build emits Vercel's Build Output API (.vercel/output),
// which Vercel auto-detects. In the Lovable sandbox / Lovable hosting, leave the preset
// unset so the default Cloudflare target keeps working.
const isVercel = process.env.VERCEL === "1" || !!process.env.VERCEL;

export default defineConfig({
  ...(isVercel ? { nitro: { preset: "vercel" } } : {}),
  vite: {
    optimizeDeps: {
      include: ["@radix-ui/react-avatar", "react-markdown", "remark-gfm"],
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // OG images read bundled fonts from disk; make sure they ship with any server bundle.
  outputFileTracingIncludes: {
    "/**/*": ["./src/assets/fonts/*.woff"],
  },
  async headers() {
    return [
      {
        // The service worker must always be revalidated so updates roll out immediately.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
    ];
  },
};

export default nextConfig;

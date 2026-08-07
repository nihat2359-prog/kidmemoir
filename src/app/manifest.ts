import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#faf9f7",
    description:
      "Çocukların hayat hikâyesini güvenle saklayan dijital anı arşivi.",
    display: "standalone",
    icons: [
      {
        purpose: "any",
        sizes: "any",
        src: "/kidmemoir.svg",
        type: "image/svg+xml",
      },
      {
        purpose: "maskable",
        sizes: "any",
        src: "/kidmemoir.svg",
        type: "image/svg+xml",
      },
    ],
    name: "KidMemoir",
    short_name: "KidMemoir",
    scope: "/",
    start_url: "/en",
    theme_color: "#101622",
  };
}

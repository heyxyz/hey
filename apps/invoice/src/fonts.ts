import localFont from "next/font/local";

export const heyFont = localFont({
  display: "swap",
  fallback: ["sans-serif"],
  preload: true,
  src: [
    {
      path: "../public/fonts/SofiaProSoftReg.woff2",
      style: "normal",
      weight: "400"
    },
    {
      path: "../public/fonts/SofiaProSoftMed.woff2",
      style: "medium",
      weight: "600"
    },
    {
      path: "../public/fonts/SofiaProSoftBold.woff2",
      style: "bold",
      weight: "700"
    }
  ],
  style: "normal"
});

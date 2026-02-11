import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Newsreader } from "next/font/google";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: "Photo Math Solver | Solve Math From Any Photo",
  description:
    "Upload a math photo and get OCR-powered, AI-guided, step-by-step solutions with Wolfram|Alpha-backed compute support.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Photo Math Solver | Solve Math From Any Photo",
    description:
      "Upload a math photo and get OCR-powered, AI-guided, step-by-step solutions with Wolfram|Alpha-backed compute support.",
    images: [
      {
        url: "/images/background-img.jpg",
        width: 1200,
        height: 630,
        alt: "Photo Math Solver preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo Math Solver | Solve Math From Any Photo",
    description:
      "Upload a math photo and get OCR-powered, AI-guided, step-by-step solutions with Wolfram|Alpha-backed compute support.",
    images: ["/images/background-img.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} ${newsreader.variable}`}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}

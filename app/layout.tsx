import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VA BPJS Banda Aceh",
  description: "Virtual Assistant BPJS Kesehatan",
  icons: {
    icon: "/logo.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="/js/live2dcubismcore.js"
          strategy="beforeInteractive"
          async={false}
        />
        <Script
          id="cubism-check"
          strategy="beforeInteractive"
        >
          {`
            window.addEventListener('load', function() {
              if (typeof live2dcubismcore === 'undefined') {
                console.error("Live2D Cubism Core library not found. This may cause Live2D models to not work properly.");
              }
            });
          `}
        </Script>

      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

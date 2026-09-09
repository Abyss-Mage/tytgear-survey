import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TYTGEAR Pre-Launch Market Research Survey",
  description:
    "A research study on student desk setups, aesthetic preferences, and lifestyle gear in India.",
  icons: {
    icon: "/images/brand/logo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#4F766F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas antialiased">{children}</body>
    </html>
  );
}

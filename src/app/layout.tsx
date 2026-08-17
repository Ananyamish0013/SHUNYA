import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZERO DAY APOCALYPSE — Mission Protocols",
  description:
    "Post-apocalyptic competition interface. Access classified mission protocols and active tactical operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;600;700;800;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0D0C0B] text-[#E8E2D5] font-mono antialiased selection:bg-[#FFC928] selection:text-[#0D0C0B]">
        {children}
      </body>
    </html>
  );
}

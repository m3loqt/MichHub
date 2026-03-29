import type { Metadata } from "next";
import { Anton, DM_Sans } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "MichHub — Cinema-Grade VFX, CGI & Motion Design",
  description:
    "Cinema-grade VFX, CGI, and motion design that positions your brand as the standard your entire industry measures itself against.",
  icons: {
    icon: [{ url: "/favicon.png?v=3", type: "image/png" }],
    shortcut: "/favicon.png?v=3",
    apple: "/favicon.png?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${dmSans.variable} scroll-smooth antialiased`}
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

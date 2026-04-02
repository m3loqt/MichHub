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

const BASE_URL = "https://michhub.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "MichHub Studios — Cinema-Grade VFX, CGI & Motion Design",
    template: "%s | MichHub Studios",
  },
  description:
    "Cinema-grade VFX, CGI, and motion design that positions your brand as the standard your entire industry measures itself against.",
  keywords: [
    "VFX studio",
    "CGI production",
    "motion design",
    "visual effects",
    "brand video production",
    "cinema grade production",
    "enterprise motion design",
    "3D animation studio",
    "MichHub Studios",
    "Philippines VFX studio",
  ],
  authors: [{ name: "MichHub Studios", url: BASE_URL }],
  creator: "MichHub Studios",
  publisher: "MichHub Studios",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "MichHub Studios",
    title: "MichHub Studios — Cinema-Grade VFX, CGI & Motion Design",
    description:
      "Cinema-grade VFX, CGI, and motion design that positions your brand as the standard your entire industry measures itself against.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MichHub Studios — Cinema-Grade VFX, CGI & Motion Design",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MichHub Studios — Cinema-Grade VFX, CGI & Motion Design",
    description:
      "Cinema-grade VFX, CGI, and motion design that positions your brand as the standard your entire industry measures itself against.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/favicon.png?v=3", type: "image/png" }],
    shortcut: "/favicon.png?v=3",
    apple: "/favicon.png?v=3",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "MichHub Studios",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/favicon.png`,
      },
      description:
        "Cinema-grade VFX, CGI, and motion design studio specializing in enterprise brand production.",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-555-123-4567",
        email: "admin@michhub.com",
        contactType: "customer service",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "MichHub Studios",
      publisher: { "@id": `${BASE_URL}/#organization` },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${BASE_URL}/#service`,
      name: "MichHub Studios",
      url: BASE_URL,
      description:
        "Cinema-grade VFX, CGI, and motion design for enterprise brands.",
      provider: { "@id": `${BASE_URL}/#organization` },
      serviceType: [
        "Visual Effects",
        "3D CGI",
        "Motion Design",
        "Brand Video Production",
      ],
    },
  ],
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
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Zero-JS preloader — covers the page from the first byte of HTML,
            before any JS bundle loads. PageLoader removes it via DOM API
            once the animated loader takes over. */}
        <div
          id="preloader"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background: "#0A0A0A",
            pointerEvents: "none",
          }}
        />
        {children}
      </body>
    </html>
  );
}

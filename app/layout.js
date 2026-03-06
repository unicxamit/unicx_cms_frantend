import { Inter } from "next/font/google";
import AppProviders from "../providers/AppProviders";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "UniCX",
    template: "%s | UniCX",
  },
  description: "UniCX marketing site and CMS platform scaffold.",
  applicationName: "UniCX",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "UniCX",
    title: "UniCX",
    description: "UniCX marketing site and CMS platform scaffold.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UniCX",
    description: "UniCX marketing site and CMS platform scaffold.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-bg text-fg antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

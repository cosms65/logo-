import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "@/components/layout/site-nav";

export const metadata: Metadata = {
  title: "Eclipse of the Final Realm",
  description: "Official framework for the Eclipse of the Final Realm novel universe."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="cosmic-shell">
        <SiteNav />
        {children}
      </body>
    </html>
  );
}

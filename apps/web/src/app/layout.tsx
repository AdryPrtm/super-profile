import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/index.css";
import Providers from "@/components/providers";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getProfileContent } from "@/features/profile-content/data/profile-content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getProfileContent();
  return { title: metadata.homeTitle, description: metadata.homeDescription };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="grid min-h-svh grid-cols-[minmax(0,1fr)] grid-rows-[auto_1fr]">
            <SiteHeader />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

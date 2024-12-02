import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/public/globals.css";
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar/index";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = localFont({
  src: "../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CraftInk",
  description: "Create your own tattoo designs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Toaster />
      </body>
      </html>
    </ClerkProvider>  
  );
}

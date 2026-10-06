import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SlotUp — Book your haircut, skip the wait",
  description:
    "Find a barber near you and book your slot in seconds. No more waiting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-warm min-h-screen text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}

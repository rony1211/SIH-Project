import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BhumiSetu — National Land Acquisition System",
  description:
    "Real-Time National Land Acquisition & Management System for End-to-End Digital Monitoring and Decision Support. Ministry of Rural Development, Government of India.",
  keywords:
    "land acquisition, BhumiSetu, RFCTLARR, India, R&R, rehabilitation, resettlement, geospatial",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full bg-background text-foreground transition-colors duration-300">
        <LocaleProvider>
          <ThemeProvider>
            <Navbar />
            <Sidebar />
            <main className="pt-16 lg:pl-64 min-h-screen">
              {children}
            </main>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}

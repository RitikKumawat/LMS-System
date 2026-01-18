import type { Metadata } from "next";
import { Inter } from "next/font/google";
import DefaultLayout from "@/layouts/default-layout/DefaultLayout";
import SmoothScroll from "@/components/home-page/SmoothScroll";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus LMS - Future of Education",
  description: "Premium AI-powered Learning Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <SmoothScroll /> */}
        <DefaultLayout>{children}</DefaultLayout>
      </body>
    </html>
  );
}

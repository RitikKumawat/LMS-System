import HybridLayout from "@/layouts/hybrid-layout/HybridLayout";
import React from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <HybridLayout>{children}</HybridLayout>;
}

import PublicLayout from "@/layouts/public-layout/PublicLayout";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <PublicLayout>{children}</PublicLayout>;
}

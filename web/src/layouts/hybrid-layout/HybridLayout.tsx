"use client";

import { Box, Center, Loader } from "@mantine/core";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { GetProfileDataDocument } from "@/generated/graphql";
import { ROUTES } from "@/enum/routes.enum";
import { COLORS } from "@/assets/colors/colors";
import DashboardLayout from "../dashboard-layout/DashboardLayout";
import Navbar from "@/components/navbar/Navbar";

const HybridLayout = ({ children }: { children: ReactNode }) => {

    const { data, loading } = useQuery(GetProfileDataDocument, {
        fetchPolicy: "network-only",
        context: { public: true },
    });

    if (loading) {
        return (
            <Center h={"100vh"} style={{ backgroundColor: COLORS.background.primary }}>
                <Loader color="blue" size={"md"} />
            </Center>
        );
    }

    if (data?.getProfileData && !loading) {
        return (
            <DashboardLayout>{children}</DashboardLayout>
        );
    }

    return <>
        <Navbar />
        <Box pt={80} style={{ minHeight: "100vh", backgroundColor: COLORS.background.primary }}>
            {children}
        </Box>
    </>
};

export default HybridLayout;

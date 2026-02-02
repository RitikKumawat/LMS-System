"use client";

import Navbar from "@/components/navbar/Navbar";
import { ROUTES } from "@/enum/routes.enum";
import { GetProfileDataDocument } from "@/generated/graphql";
import { useQuery } from "@apollo/client/react";
import { Center, Loader } from "@mantine/core";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const PublicLayout = ({ children }: { children: ReactNode }) => {
    console.log("PUBLIC LAYOUT RENDER.....");
    const { data, loading, error } = useQuery(GetProfileDataDocument);
    const router = useRouter();

    useEffect(() => {
        if (data?.getProfileData && !loading) {
            router.push(ROUTES.DASHBOARD);
        }
    }, [data, loading, router]);

    if (loading) {
        return <Center h={"100vh"}>
            <Loader color="blue" size={"md"} />
        </Center>
    }

    if (data?.getProfileData) {
        return null;
    }

    return <>
        <Navbar />
        {children}</>;
};

export default PublicLayout;

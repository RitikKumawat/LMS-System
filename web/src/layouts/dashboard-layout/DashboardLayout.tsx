"use client";

import { ROUTES } from "@/enum/routes.enum";
import { GetProfileDataDocument } from "@/generated/graphql";
import { useQuery } from "@apollo/client/react";
import { Center, Loader } from "@mantine/core";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { data, loading,error } = useQuery(GetProfileDataDocument);
    const router = useRouter();
   if(loading){
    return <Center h={"100vh"}>
        <Loader color="blue" size={"md"} />
    </Center>
   }
   if(data?.getProfileData && !loading){
    return children;
   }
   if(error){
    router.push(ROUTES.DASHBOARD);
   }
  
};

export default DashboardLayout;

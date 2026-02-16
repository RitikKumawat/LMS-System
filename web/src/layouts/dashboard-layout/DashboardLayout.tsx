"use client";

import { useDisclosure } from "@mantine/hooks";
import { AppShell, Center, Loader } from "@mantine/core";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { GetProfileDataDocument } from "@/generated/graphql";
import { ROUTES } from "@/enum/routes.enum";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { COLORS } from "@/assets/colors/colors";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();
  const { data, loading, error } = useQuery(GetProfileDataDocument, {
    fetchPolicy: "cache-first",
  });
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!data?.getProfileData || error)) {
      router.replace(ROUTES.LOGIN);
    }
  }, [loading, data, error, router]);

  // Always show loader while deciding
  if (loading || !data?.getProfileData) {
    return (
      <Center h="100vh" style={{ backgroundColor: COLORS.background.primary }}>
        <Loader color="blue" size="md" />
      </Center>
    );
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
      styles={{
        main: {
          backgroundColor: COLORS.background.primary,
          color: COLORS.text.primary,
        },
      }}
    >
      <AppShell.Header style={{ borderBottom: `1px solid ${COLORS.border.glass}` }}>
        <DashboardHeader opened={opened} toggle={toggle} />
      </AppShell.Header>

      <AppShell.Navbar
        style={{
          borderRight: `1px solid ${COLORS.border.glass}`,
          backgroundColor: COLORS.background.secondary,
        }}
      >
        <DashboardNavbar />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default DashboardLayout;
import { useMutation, useQuery } from "@apollo/client/react";
import {
  AppShell,
  Burger,
  Button,
  Flex,
  Group,
  NavLink,
  Stack,
  Text,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  Admin_Roles,
  AdminLogoutDocument,
  GetAdminDataDocument,
} from "../../generated/graphql";
import { navbarLinks } from "../../data/navbar-links.data";
import { Link, useLocation } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { LogOut } from "lucide-react";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();
  const { pathname } = useLocation();
  const { data, refetch } = useQuery(GetAdminDataDocument);

  const filteredLinks = navbarLinks.filter(
    (link) => link.allowedRole.includes(data?.getAdminData.role as Admin_Roles)
  );

  const [adminLogout, { loading }] = useMutation(AdminLogoutDocument, {
    onCompleted: async () => {
      notifications.show({
        message: "Logout Successful",
        title: "Success",
        color: "green",
      });
      await refetch();
    },
    onError: (error) => {
      notifications.show({
        message: error.message,
        title: "Error",
        color: "red",
      });
    },
  });

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      {/* HEADER */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text fw={600} size="lg">
              {data?.getAdminData.role === Admin_Roles.Admin
                ? "Admin Dashboard"
                : "Instructor Panel"}
            </Text>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Flex direction="column" justify="space-between" h="100%">
          <Stack gap={6}>
            {filteredLinks.map((link) => {
              const isActive = pathname.includes(link.href);
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.href}
                  component={Link}
                  to={link.href}
                  leftSection={<Icon size={18} />}
                  active={isActive}
                  label={
                    <Text fw={isActive ? 600 : 500} size="sm">
                      {link.name}
                    </Text>
                  }
                  styles={{
                    root: {
                      padding: "8px 12px",
                      borderRadius: 10,
                      transition: "all 0.15s ease",
                      background: isActive
                        ? "var(--mantine-color-blue-light)"
                        : "transparent",
                      color: isActive
                        ? "var(--mantine-color-blue-9)"
                        : "var(--mantine-color-text)",
                      ":hover": {
                        background:
                          "var(--mantine-color-default-hover) !important",
                      },
                    },
                  }}
                />
              );
            })}
          </Stack>
          <Box>
            <Button
              fullWidth
              variant="light"
              color="red"
              radius="md"
              loading={loading}
              leftSection={<LogOut size={18} />}
              styles={{
                root: {
                  fontWeight: 600,
                  borderRadius: 10,
                },
              }}
              onClick={() => adminLogout()}
            >
              Logout
            </Button>
          </Box>
        </Flex>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default CommonLayout;

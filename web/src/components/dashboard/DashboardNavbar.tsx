"use client";

import { Stack, UnstyledButton, Text, Group, ThemeIcon, Button } from "@mantine/core";
import { LayoutDashboard, BookOpen, Settings, LogOut, FileUser } from "lucide-react";
import React from "react";
import { COLORS } from "@/assets/colors/colors";
import { ROUTES } from "@/enum/routes.enum";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { GetProfileDataDocument, UserLogoutDocument } from "@/generated/graphql";
import { notifications } from "@mantine/notifications";

interface NavbarLinkProps {
    icon: any;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

const NavbarLink = ({ icon: Icon, label, active, onClick }: NavbarLinkProps) => {
    return (
        <UnstyledButton
            onClick={onClick}
            style={{
                display: "block",
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                color: active ? COLORS.text.primary : COLORS.text.secondary,
                backgroundColor: active ? COLORS.background.glassHover : "transparent",
                transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = active ? COLORS.background.glassHover : COLORS.background.glass;
                e.currentTarget.style.color = COLORS.text.primary;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = active ? COLORS.background.glassHover : "transparent";
                e.currentTarget.style.color = active ? COLORS.text.primary : COLORS.text.secondary;
            }}

        >
            <Group gap="xs">
                <ThemeIcon variant="light" color={active ? "blue" : "gray"} size="sm" style={{ background: "transparent" }}>
                    <Icon size={20} />
                </ThemeIcon>
                <Text size="sm" fw={500}>{label}</Text>
            </Group>
        </UnstyledButton>
    );
};

export const DashboardNavbar = () => {
    const router = useRouter();
    const [logout] = useMutation(UserLogoutDocument, {
        onCompleted: () => {
            notifications.show({
                color: "green",
                title: "Logout",
                message: "You have been logged out successfully",
            });
        },
        onError: (error) => {
            notifications.show({
                color: "red",
                title: "Logout",
                message: error.message,
            })
        },
        refetchQueries: [GetProfileDataDocument]
    })
    const links = [
        { icon: LayoutDashboard, label: "Dashboard", route: ROUTES.DASHBOARD },
        { icon: BookOpen, label: "Explore", route: "/courses" },
        { icon: FileUser, label: "My Courses", route: "/my-courses" }
        // Add more routes as they become available
    ];

    const handleLogout = async () => {
        await logout();

    };

    return (
        <Stack justify="space-between" h="100%" p="md" style={{ backgroundColor: COLORS.background.secondary, borderRight: `1px solid ${COLORS.border.glass}` }}>
            <Stack gap="xs">
                {links.map((link) => (
                    <NavbarLink
                        key={link.label}
                        {...link}
                        onClick={() => router.push(link.route)}
                        active={false} // Logic to determine active state can be added
                    />
                ))}
            </Stack>

            <Stack gap="xs" style={{ borderTop: `1px solid ${COLORS.border.glass}`, paddingTop: "1rem" }}>
                <NavbarLink icon={Settings} label="Settings" onClick={() => { }} />
                <NavbarLink icon={LogOut} label="Logout" onClick={handleLogout} />
            </Stack>
        </Stack>
    );
};

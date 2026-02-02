"use client";

import { Burger, Group, Text } from "@mantine/core";
import { Sparkles } from "lucide-react";
import React from "react";
import { COLORS } from "@/assets/colors/colors";

interface DashboardHeaderProps {
    opened: boolean;
    toggle: () => void;
}

export const DashboardHeader = ({ opened, toggle }: DashboardHeaderProps) => {
    return (
        <Group h="100%" px="md" style={{ backgroundColor: COLORS.background.secondary, borderBottom: `1px solid ${COLORS.border.glass}` }}>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" color={COLORS.text.primary} />
            <Group>
                <Sparkles size={24} color={COLORS.accent.blue} />
                <Text
                    fw={700}
                    size="xl"
                    style={{
                        color: COLORS.text.primary,
                    }}
                >
                    Nexus
                </Text>
            </Group>
        </Group>
    );
};

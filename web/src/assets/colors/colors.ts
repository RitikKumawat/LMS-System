// colors.ts

export const COLORS = {
  background: {
    primary: "#0A0F1F",
    secondary: "#111827",
    glass: "rgba(255, 255, 255, 0.05)",
    glassHover: "rgba(255, 255, 255, 0.1)",
  },

  primary: {
    main: "#3B82F6",
    light: "#60A5FA",
  },

  text: {
    primary: "#F9FAFB",
    secondary: "#9CA3AF",
    muted: "#6B7280",
  },

  accent: {
    main: "#8B5CF6",
    blue: "#3B82F6",
    cyan: "#06B6D4",
    violet: "#8B5CF6",
    pink: "#EC4899",
  },

  border: {
    glass: "rgba(255, 255, 255, 0.08)",
  },

  shadow: {
    sm: "0 4px 24px rgba(0, 0, 0, 0.4)",
    lg: "0 20px 60px rgba(0, 0, 0, 0.5)",
    glow: "0 0 40px rgba(59, 130, 246, 0.3)",
  },
} as const;

export type Colors = typeof COLORS;

"use client";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ApolloProvider } from "@apollo/client/react";
import { Roboto } from "next/font/google";
import { apolloClient } from "@/client/apolloClient";
import Navbar from "@/components/navbar/Navbar";

const roboto = Roboto({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const theme = {
  fontFamily: `${roboto.style.fontFamily}, sans-serif`,
};
const DefaultLayout = ({ children }: { children: ReactNode }) => {
  console.log("DEFAULT LAYOUT RENDER.....");
  return (
    <ApolloProvider client={apolloClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <Notifications position="top-center" />
        {children}
      </MantineProvider>
    </ApolloProvider>
  );
};

export default DefaultLayout;

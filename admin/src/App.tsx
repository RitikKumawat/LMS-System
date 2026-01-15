import { ApolloProvider } from "@apollo/client/react";
import "./App.css";
import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';
import "@mantine/tiptap/styles.css";
import { MantineProvider } from "@mantine/core";
import { apolloClient } from "./client/apolloClient";
import { RouterProvider } from "react-router-dom";
import { appRoutes } from "./routes/appRoutes";
import {Notifications} from "@mantine/notifications"
import {ModalsProvider} from "@mantine/modals"
function App() {
  return (
    <MantineProvider>
      <ApolloProvider client={apolloClient}>
        <ModalsProvider>
        <Notifications position="top-right"/>
        <RouterProvider router={appRoutes} />
        </ModalsProvider>
      </ApolloProvider>
    </MantineProvider>
  );
}

export default App;

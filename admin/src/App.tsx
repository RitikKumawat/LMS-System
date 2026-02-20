import { ApolloProvider } from "@apollo/client/react";
import "./App.css";
import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';
import "@mantine/tiptap/styles.css";
import { MantineProvider } from "@mantine/core";
import { apolloClient } from "./client/apolloClient";
import { RouterProvider } from "react-router-dom";
import { appRoutes } from "./routes/appRoutes";
function App() {
  return (
    <MantineProvider>
      <ApolloProvider client={apolloClient}>
        <ApolloProvider client={apolloClient}>
          <RouterProvider router={appRoutes} />
        </ApolloProvider>
      </ApolloProvider>
    </MantineProvider>
  );
}

export default App;

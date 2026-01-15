import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
} from "@apollo/client/errors";
import createUploadLink from "apollo-upload-client/UploadHttpLink.mjs";

const url = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:4000";

export const errorLink = new ErrorLink(({ error }) => {
  if (typeof window === "undefined") {
    return;
  }

  const isOnLoginPage = window.location.pathname === "/login";

  if (CombinedGraphQLErrors.is(error)) {
    const unauthorized = error.errors.some(
      (graphQLError) =>
        graphQLError?.extensions?.code === "UNAUTHENTICATED" ||
        graphQLError?.extensions?.code === "FORBIDDEN" ||
        graphQLError.message?.toLowerCase().includes("unauthorized")
    );

    if (unauthorized && !isOnLoginPage) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    error.errors.forEach(({ message, locations, path }) => {
      console.warn(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${Array.isArray(path) ? path.join(".") : path}`
      );
    });
  } else if (CombinedProtocolErrors.is(error)) {
    error.errors.forEach(({ message, extensions }) =>
      console.warn(
        `[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(
          extensions
        )}`
      )
    );
  } else {
    console.error(`[Network error]: ${error}`);
  }
});

const authLink = new SetContextLink((prevContext) => ({
  headers: {
    ...prevContext.headers,
    "x-panel-role": btoa("admin"),
  },
}));

const uploadLink = new createUploadLink({
  uri: `${url}/graphql`,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    "apollo-require-preflight": "true",
  },
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([errorLink, authLink, uploadLink]),
  defaultOptions: {
    watchQuery: { errorPolicy: "all" },
    query: { errorPolicy: "all" },
    mutate: { errorPolicy: "all" },
  },
});

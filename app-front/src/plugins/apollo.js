import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
} from "@apollo/client/core";
import { onError } from "@apollo/client/link/error";
import { useErrorsStore } from "@/stores/useErrors";
import { setContext } from "@apollo/client/link/context";
import { httpOptions, log, logT, api } from '@/utils';


// HTTP connection to the API
const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: `${api()}/graphql`,
    credentials: "include",
});

const errorHandler = onError(({ graphQLErrors }) => {
    if (graphQLErrors)
        useErrorsStore().$state = {
            message: graphQLErrors[0].message,
            category: graphQLErrors[0].extensions.category,
            fields: graphQLErrors[0].extensions.validation ?? { input: {} },
        };
});

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            authorization: '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', //localStorage.getItem("token"),
        },
    };
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
const apolloClient = new ApolloClient({
    link: authLink.concat(errorHandler.concat(httpLink)),
    cache,
});

export default apolloClient;

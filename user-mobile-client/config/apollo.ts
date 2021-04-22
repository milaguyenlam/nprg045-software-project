import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getToken } from '../services/secure_storage';

const httpLink = createHttpLink({
    uri: 'http://sprice.cz/graphql/',
  });
  
  const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = await getToken();
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });
  
  export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              activeProducts: {
                keyArgs: [],
                merge(existing, incoming, { args }) {
                  if (args && args.offset === 0) {
                    return incoming;
                  }
                  return [...existing, ...incoming];
                },
              },
              shoppingListItems: {
                keyArgs: [],
                merge(existing, incoming) {
                  return incoming;
                }
              }
            },
          },
        },
      }),

  });
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, from} from '@apollo/client';
import { setContext } from 'apollo-link-context'
import { concat } from 'apollo-link'
import { onError } from 'apollo-link-error';
import { isMobile } from "react-device-detect";

import { destorySession } from './util/Session';

// Importing styles
import './index.css'

// Importing components
import App from './App'

const link = from([
  new HttpLink({uri: 'http://localhost:5000/insvire-curious-app12/us-central1/graphql'})
])

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.log('error: ',err);
        switch (err.extensions.code) {
          case "UNAUTHENTICATED":
            // error code is set to UNAUTHENTICATED
            if (err.message.includes('Firebase ID token has expired')) {
              destorySession();
              
              window.location.href = '/';
            }
          default:
            console.log(err.extensions)
        }
      }
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
      // if you would also like to retry automatically on
      // network errors, we recommend that you use
      // apollo-link-retry
    }
  }
);

const authLink = setContext(() => {
  const token = localStorage.token

  return {
    headers: {
      Authorization : token ? `Bearer ${token}` : ''
    }
  }
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(errorLink, concat(authLink, link))
});

window.isMobile = isMobile;

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)

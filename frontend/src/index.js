import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, concat } from '@apollo/client/core';
import { onError } from 'apollo-link-error';
import { isMobile } from "react-device-detect";

import { destorySession } from './util/Session';

// Importing styles
import './index.css'

// Importing components
import App from './App'

 // const httpUrl = 'http://localhost:5000/insvire-curious-app/asia-southeast2/graphql';
 const httpUrl = 'https://asia-southeast2-insvire-curious-app.cloudfunctions.net/graphql';

const httpLink = ApolloLink.from([
  new ApolloLink((operation, forward) => {
    const token = localStorage.token
    if (token) {
      operation.setContext({
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
    }
    return forward(operation)
  }),
  new HttpLink({ uri: httpUrl })
  //new HttpLink({uri: process.env.REACT_APP_GRAPHQL_ENDPOINT})
])



const errorLink = onError(
  ({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
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

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(errorLink, httpLink),
  defaultOptions: { query: { fetchPolicy: 'no-cache' } }
});

window.isMobile = isMobile;

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)

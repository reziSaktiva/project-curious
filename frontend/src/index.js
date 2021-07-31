import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, concat, split } from '@apollo/client/core';
import { onError } from 'apollo-link-error';
import { isMobile } from "react-device-detect";

import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

import { destorySession } from './util/Session';

// Importing styles
import './index.css'

// Importing components
import App from './App'

// const link = from([
//   new HttpLink({uri: 'https://us-central1-insvire-curious-app.cloudfunctions.net/graphql'})
// ])
 const httpUrl = 'http://localhost:5000/insvire-curious-app/us-central1/graphql';
const wsUrl = 'ws://localhost:5000/graphql';

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

const wsLink = new WebSocketLink({
  uri: wsUrl,
  options: {
    connectionParams: () => ({
      accessToken: localStorage.token
    }),
    reconnect: true,
    lazy: true
  }
})

function isSubscription(operation) {
  const definition = getMainDefinition(operation.query);
  return definition.kind === 'OperationDefinition'
    && definition.operation === 'subscription'
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(errorLink, split(isSubscription, wsLink, httpLink,)),
  defaultOptions: { query: { fetchPolicy: 'no-cache' } }
});

window.isMobile = isMobile;

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)

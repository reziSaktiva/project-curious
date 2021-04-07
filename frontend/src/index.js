import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, from} from '@apollo/client';
import { setContext } from 'apollo-link-context'

// Importing styles
import './index.css'

// Importing components
import App from './App'

const link = from([
  new HttpLink({uri: 'http://localhost:5000/insvire-curious-app12/us-central1/graphql'})
])

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
  link: authLink.concat(link)
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)

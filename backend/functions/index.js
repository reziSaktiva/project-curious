const functions = require('firebase-functions');
const app = require('express')();
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/index')

const server = new ApolloServer( {
    typeDefs, 
    resolvers,
    context: ({ req }) => ({ req }) // Will take request body' and forward it to the context
} )
server.applyMiddleware({ app, path:'/', cors: false })

exports.graphql = functions.https.onRequest(app)

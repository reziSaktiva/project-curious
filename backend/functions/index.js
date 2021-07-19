const functions = require('firebase-functions');
const app = require('express')();
const http = require('http')
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/index')

// Global Config
require('dotenv').config()

const context = ({ req, connection }) => {
    if (req){
        return { req }
    } 
    if (connection){
        return { connection }
    }
}

const server = new ApolloServer( {
    typeDefs, 
    resolvers,
    context // Will take request body' and forward it to the context
} )
server.applyMiddleware({ app, path:'/', cors: false })

const httpServer = http.createServer(app)

server.installSubscriptionHandlers(httpServer)
httpServer.listen(5000, console.log(`Server start on port 5000`))

exports.graphql = functions.https.onRequest(app)

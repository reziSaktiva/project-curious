const functions = require('firebase-functions');
const app = require('express')();
const http = require('http')
const { ApolloServer } = require('apollo-server-express');
const { computeSignedArea, LatLng } = require('spherical-geometry-js');

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/index');
const { db } = require('./utility/admin');
const PORT = 5000

// Global Config
require('dotenv').config()

const context = ({ req, connection }) => {
    if (req) {
        return { req }
    }
    if (connection) {
        return { connection }
    }
    
    functions.https.onCall((data, context) => {
        // context.app will be undefined if the request doesn't include a valid
        // App Check token.
        if (context.app == undefined) {
            throw new functions.https.HttpsError(
                'failed-precondition',
                'The function must be called from an App Check verified app.')
        }

        // Your function logic follows.
    });
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context // Will take request body' and forward it to the context
})
server.applyMiddleware({ app, path: '/', cors: true })

// const httpServer = http.createServer(app)

// server.installSubscriptionHandlers(httpServer)
// httpServer.listen(PORT, console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`))

exports.graphql = functions.region('asia-southeast2').https.onRequest(app)
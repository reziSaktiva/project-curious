const functions = require('firebase-functions');
const app = require('express')();
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/index');
// const { admin } = require('./utility/admin');

// Global Config
require('dotenv').config()

const context = async ({ req, connection }) => {
    if (req) {
        return { req }
    }
    if (connection) {
        return { connection }
    }

    // const appCheckToken = req.header('X-Firebase-AppCheck');
    // if (!appCheckToken) {
    //     res.status(401);
    //     return next('Unauthorized');
    // }

    // try {
    //     const appCheckClaims = await admin.appCheck().verifyToken(appCheckToken);

    //     // If verifyToken() succeeds, continue with the next middleware
    //     // function in the stack.
    //     return next();
    // } catch (err) {
    //     res.status(401);
    //     return next('Unauthorized');
    // }
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
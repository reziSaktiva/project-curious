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
server.applyMiddleware({ app, path:'/', cors: true })

const httpServer = http.createServer(app)

server.installSubscriptionHandlers(httpServer)
httpServer.listen(PORT, console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`))

exports.graphql = functions.https.onRequest(app)

exports.explorPlace = functions.firestore.document('posts/{id}')
    .onCreate(async (snapShot) => {
        const getPosts = await db.collection('posts').get()
        const posts = getPosts.docs.forEach(doc => doc.data())

        const location = posts.map(post => new LatLng(parseFloat(post.lat), parseFloat(post.lng)))

        console.log(location, 'onExplorePlace');
    })

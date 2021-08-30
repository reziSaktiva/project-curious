const admin = require('firebase-admin')
admin.initializeApp();

const db = admin.firestore()
const auth = admin.auth()
db.settings({ ignoreUndefinedProperties: true })

const { PubSub, withFilter } = require('graphql-subscriptions')
const pubSub = new PubSub;

const geofire = require('geofire-common')

const API_KEY = "AIzaSyB56bd6HDIwps9MyM4vza4M6hhpd5o4Sg4"

const NOTIFICATION_ADDED = "NOTIFICATION_ADDED"

module.exports = { db, admin, auth, NOTIFICATION_ADDED, pubSub, withFilter, API_KEY, geofire }
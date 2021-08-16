const admin = require('firebase-admin')
admin.initializeApp();

const db = admin.firestore()
const auth = admin.auth()
db.settings({ ignoreUndefinedProperties: true })

const { PubSub, withFilter } = require('graphql-subscriptions')
const pubSub = new PubSub;

const API_KEY = "AIzaSyCbj90YrmUp3iI_L4DRpzKpwKGCFlAs6DA"

const NOTIFICATION_ADDED = "NOTIFICATION_ADDED"

module.exports = { db, admin, auth, NOTIFICATION_ADDED, pubSub, withFilter, API_KEY }
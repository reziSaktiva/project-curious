const admin = require('firebase-admin')
admin.initializeApp();

const db = admin.firestore()
const auth = admin.auth()
db.settings({ ignoreUndefinedProperties: true })

module.exports = { db, admin, auth }
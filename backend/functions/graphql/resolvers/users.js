const { UserInputError } = require('apollo-server-express')
const encrypt = require('bcrypt')

const { db } = require('../../utility/admin')
const firebase = require('firebase')
const config = require('../../utility/config')
const fbAuthContext = require('../../utility/fbAuthContext')

const { validateRegisterInput, validateLoginInput } = require('../../utility/validators')

firebase.initializeApp(config)

module.exports = {
    Query: {
        async getUserData(_, args, context) {
            const { username } = await fbAuthContext(context)

            let dataUser = {
                user: null,
                liked: [],
                notifications: []
            }

            try {
                if (username) {
                    await db.doc(`/users/${username}`).get()
                        .then(doc => {
                            dataUser.user = {
                                email: doc.data().email,
                                id: doc.data().id,
                                username: doc.data().username,
                                mobileNumber: doc.data().mobileNumber,
                                createdAt: doc.data().createdAt,
                                gender: doc.data().gender,
                                birthday: doc.data().birthday,
                                profilePicture: doc.data().profilePicture
                            }

                            return db.collection(`/users/${username}/liked`).get()
                        })
                        .then(data => {
                            data.docs.forEach(doc => {
                                dataUser.liked.push(doc.data())
                            })
                            return db.collection(`/users/${username}/notifications`).get()
                        })
                        .then(data => {
                            data.docs.forEach(doc => {
                                dataUser.notifications.push(doc.data())
                            })
                        })

                }

                return dataUser
            }
            catch (err) {
                console.log(err);
                throw new Error(err)
            }

        }
    },
    Mutation: {
        async login(_, { username, password }) {
            const { valid, errors } = validateLoginInput(username, password)
            if (!valid) throw new UserInputError("Errors", { errors })

            let userList = db
                .collection(`users`)
                .where('email', '==', username)
                .limit(1)

            let nama;

            try {
                let list;
                await db.doc(`/users/${username}`).get()
                    .then(doc => {
                        if (!doc.exists) {
                            return userList.get()
                                .then(data => {
                                    data.forEach(doc => {
                                        return nama = doc.data().username
                                    })
                                    return db.doc(`/users/${nama}`).get()
                                        .then(doc => {
                                            if (!doc.exists) {
                                                throw new UserInputError('username/email tidak ditemukan', {
                                                    errors: { username: "username/email tidak ditemukan" }
                                                })
                                            } else {
                                                list = doc.data()
                                            }

                                        })
                                })

                        } else {
                            list = doc.data()
                        }
                    })

                const { email } = list

                const token = await firebase.auth().signInWithEmailAndPassword(email, password)
                    .then(data => data.user.getIdToken())
                    .then(idToken => idToken)

                return token
            }
            catch (err) {
                if (err.code === "auth/wrong-password") {
                    throw new UserInputError("password anda salah!")
                }
                if (err.code === 'auth/invalid-email') {
                    throw new UserInputError("pengguna tidak ditemukan")
                }
                throw new Error(err)
            }
        },
        async checkUserWithFacebook(_, args, content, info) {
            const { username } = args;

            try {
                let user;
                await db.doc(`users/${username}`).get()
                    .then(doc => {
                        if (doc.exists) {
                            user = true
                        } else {
                            user = false
                        }
                    })

                return user
            }
            catch (err) {
                console.log(err);
            }
        },
        async loginWithFacebook(_, { username, token }, content, info) {
            let userData;

            try {
                await db.doc(`/users/${username}`).get()
                    .then(doc => {
                        userData = {
                            email: doc.data().email,
                            id: doc.data().id,
                            username: doc.data().username,
                            mobileNumber: doc.data().mobileNumber,
                            createdAt: doc.data().createdAt,
                            gender: doc.data().gender,
                            birthday: doc.data().birthday,
                            profilePicture: doc.data().profilePicture
                        }
                    })

                return token
            }
            catch (err) {
                console.error(err)
            }
        },
        async registerUserWithFacebook(_, args, content, info) {
            const { facebookData: { username, email, imageUrl, token, mobileNumber, gender, birthday, id } } = args

            let newUser = {
                username,
                id,
                email,
                mobileNumber,
                gender,
                birthday,
                createdAt: new Date().toISOString(),
                profilePicture: imageUrl
            }

            try {
                await db.doc(`/users/${username}`).set(newUser)

                return {
                    ...newUser,
                    token
                }
            }
            catch (err) {
                console.log(err);
            }
        },
        async registerUser(_, args, content, info) {
            const { registerInput: { mobileNumber, email, password, gender, birthday, username } } = args;

            //TODO: cek apakah datausers sudah pernah daftar ke fire store
            // TODO: simpan data yang user input ke firestore
            //TODO: daftarkan user dengan data yang diinput ke firestore Auth

            //TODO: cek apakan user menginput data dengan benar -> BUat validator function

            const { valid, errors } = validateRegisterInput(email, password, username)

            if (!valid) throw new UserInputError("Errors", { errors })

            let newUser = {
                username,
                email,
                mobileNumber,
                gender,
                birthday,
                createdAt: new Date().toISOString(),
                profilePicture: "https://firebasestorage.googleapis.com/v0/b/insvire-curious-app12.appspot.com/o/Profile%20Default.png?alt=media&token=64b822ce-e1c7-4f6b-9dfd-f02a830fe942",
            }

            const hash = await encrypt.hash(password, 12)

            try {
                await db.doc(`users/${username}`).get()
                    .then(doc => {
                        if (doc.exists) {
                            throw new UserInputError("username telah tersedia")
                        }
                        else return firebase.auth().createUserWithEmailAndPassword(email, password)
                    })
                    .then(data => {
                        newUser.id = data.user.uid
                        return data.user.getIdToken()
                    })
                    .then(idToken => {
                        newUser.token = idToken

                        const saveUserData = {
                            id: newUser.id,
                            username,
                            email,
                            mobileNumber,
                            gender,
                            birthday,
                            createdAt: new Date().toISOString(),
                            profilePicture: newUser.profilePicture,
                            _private: []
                        }
                        saveUserData._private.push({
                            hash,
                            lastUpdate: new Date().toISOString()
                        })

                        return db.doc(`/users/${username}`).set(saveUserData)
                    })

                return newUser
            }
            catch (err) {
                if (err.code === "auth/email-already-in-use") {
                    throw new UserInputError("Email sudah pernah digunakan")
                }
                if (err.code === 'auth/invalid-email') {
                    throw new UserInputError("Format email tidak benar")
                }

                console.log(err)
                throw new Error(err)
            }
        }
    }
}
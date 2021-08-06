const { UserInputError, withFilter } = require('apollo-server-express');
const { Client } = require("@googlemaps/google-maps-services-js");
const { get } = require('lodash');
const encrypt = require('bcrypt');
const axios = require('axios');

const { db, auth, NOTIFICATION_ADDED, pubSub } = require('../../utility/admin')
const firebase = require('firebase')
const config = require('../../utility/config')
const fbAuthContext = require('../../utility/fbAuthContext')

const { validateRegisterInput, validateLoginInput } = require('../../utility/validators')

firebase.initializeApp(config)

module.exports = {
    Subscription: {
        notificationAdded: {
            subscribe: withFilter(() => pubSub.asyncIterator(NOTIFICATION_ADDED), (payload, variables, _context) => {
                console.log(variables);
                return payload.notificationAdded.owner === variables.username
            })
            // subscribe : (_, __, context) => {
            //     return pubSub.asyncIterator(NOTIFICATION_ADDED)
            // }
            // subscribe: async (_, __, context) => {
            //     const { username } = await fbAuthContext(context)
            //     console.log(username);
            //     try {
            //         const data = await withFilter(() => pubSub.asyncIterator(NOTIFICATION_ADDED), (payload, _variables) => {
            //             return payload.notificationAdded.owner === username
            //         })
            //         console.log(data());
            //         return data()
            //     }
            //     catch (err) {
            //         console.log(err);
            //     }
            // }
        }
    },
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
                                profilePicture: doc.data().profilePicture,
                                newUsername: doc.data().newUsername
                            }

                            return db.collection(`/users/${username}/liked`).get()
                        })
                        .then(data => {
                            data.docs.forEach(doc => {
                                dataUser.liked.push(doc.data())
                            })
                            return db.collection(`/users/${username}/notifications`).orderBy('createdAt', 'desc').get()
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

        },
        async mutedPosts(_, args, context) {
            const { username } = await fbAuthContext(context)
            const muteData = db.collection(`users/${username}/muted`)

            try {
                if (!username) {
                    throw UserInputError("you must login first")
                }
                const getMuteData = await muteData.get();
                const postId = getMuteData.docs.map(doc => doc.data().postId) || [];

                const data = await db.collection('posts').where('id', 'in', postId).get()
                const docs = data.docs.map(doc => doc.data())

                return docs.map(async data => {
                    const { repost: repostId } = data;
                    let repost = {}

                    if (repostId) {
                        const repostData = await db.doc(`/${repostId.room ? `room/${repostId.room}/posts` : 'posts'}/${repostId.repost}`).get()
                        repost = repostData.data() || {}
                    }

                    // Likes
                    const likesData = await db.collection(`/posts/${data.id}/likes`).get()
                    const likes = likesData.docs.map(doc => doc.data())

                    // Comments
                    const commentsData = await db.collection(`/posts/${data.id}/comments`).get()
                    const comments = commentsData.docs.map(doc => doc.data())

                    // Muted
                    const mutedData = await db.collection(`/posts/${data.id}/muted`).get();
                    const muted = mutedData.docs.map(doc => doc.data());

                    return { ...data, likes, comments, muted, repost }
                });

            } catch (err) {
                console.log(err)
                throw new Error(err)
            }
        },
        async getSubscribePosts(_, args, context) {
            const { username } = await fbAuthContext(context)

            try {
                if (!username) {
                    throw UserInputError("you must login first")
                }
                const getPosts = await db.collection("posts").get()

                const docs = getPosts.docs.map(doc => doc.data())

                const result = docs.map(async data => {
                    const getSubscribes = await db.collection(`/posts/${data.id}/subscribes`).where('owner', '==', username).get()

                    const { repost: repostId } = data;
                    let repost = {}

                    if (repostId) {
                        const repostData = await db.doc(`/${repostId.room ? `room/${repostId.room}/posts` : 'posts'}/${repostId.repost}`).get()
                        repost = repostData.data() || {}
                    }

                    // Likes
                    const likesData = await db.collection(`/posts/${data.id}/likes`).get()
                    const likes = likesData.docs.map(doc => doc.data())

                    // Comments
                    const commentsData = await db.collection(`/posts/${data.id}/comments`).get()
                    const comments = commentsData.docs.map(doc => doc.data())

                    // Muted
                    const mutedData = await db.collection(`/posts/${data.id}/muted`).get();
                    const muted = mutedData.docs.map(doc => doc.data());

                    const subscribeData = await db.collection(`/posts/${data.id}/subscribes`).get();
                    const subscribe = subscribeData.docs.map(doc => doc.data());

                    if (!getSubscribes.empty) return { ...data, likes, comments, muted, repost, subscribe }
                })

                return Promise.all(result).then(values => {
                    return values.filter(item => item && item)
                })

                // return Promise.all(result).then(values => {
                //     return values.filter(item => item && item)
                // })
            }
            catch (err) {
                throw new Error(err)
            }
        },
        async getVisited(_, args, ctx) {
            const googleMapsClient = new Client({ axiosInstance: axios })
            const { username } = await fbAuthContext(ctx);

            const userVisit = await db.collection(`/users/${username}/visited`).get();
            const visited = (await userVisit).docs.map(doc => doc.data());

            const promises = visited.map(async ({ lat, lng }) => {
                const request = await googleMapsClient
                    .reverseGeocode({
                        params: {
                            latlng: `${lat}, ${lng}`,
                            language: 'en',
                            result_type: 'street_address|administrative_area_level_4',
                            location_type: 'APPROXIMATE',
                            key: 'AIzaSyCbj90YrmUp3iI_L4DRpzKpwKGCFlAs6DA'
                        },
                        timeout: 1000 // milliseconds
                    }, axios)
                    .then(r => {
                        const { address_components } = r.data.results[0];
                        const addressComponents = address_components;

                        const geoResult = {}

                        addressComponents.map(({ types, long_name }) => {
                            const point = types[0];

                            geoResult[point] = long_name;
                        });

                        return { ...geoResult, location: { lat, lng } };
                    })
                    .catch(e => {
                        console.log(e);
                        return e
                    });

                return request;
            });

            const response = await Promise.all(promises);

            const filterLocation = response.filter((value, idx) => {
                const { administrative_area_level_3: currentArea } = value;
                const prevArea = get(response[idx - 1], 'administrative_area_level_3') || '';

                if (currentArea != prevArea) {
                    return value
                }
            })

            return filterLocation;
        }
    },
    Mutation: {
        async deleteAccount(_, { id }, context) {
            const { username } = await fbAuthContext(context)

            try {
                if (!username) {
                    throw new UserInputError("UnAuthorization")
                } else {
                    const getNotification = await db.collection(`/users/${username}/notifications`).get()
                    const notification = getNotification.docs.map(doc => doc.data())

                    notification.map(doc => {
                        if (doc) {
                            db.doc(`/users/${username}/notifications/${doc.id}`).delete()
                        }
                    })

                    const getLiked = await db.collection(`/users/${username}/liked`).get()
                    const liked = getLiked.docs.map(doc => doc.data())

                    liked.map(doc => {
                        if (doc) {
                            db.doc(`/users/${username}/liked/${doc.id}`).delete()
                        }
                    })

                    const getMuted = await db.collection(`/users/${username}/muted`).get()
                    const muted = getMuted.docs.map(doc => doc.data())

                    muted.map(doc => {
                        if (doc) {
                            db.doc(`/users/${username}/muted/${doc.id}`).delete()
                        }
                    })

                    const getVisited = await db.collection(`/users/${username}/visited`).get()
                    const visited = getVisited.docs.map(doc => doc)

                    visited.map(doc => {
                        if (doc) {
                            db.doc(`/users/${username}/visited/${doc.id}`).delete()
                        }
                    })

                    const getAllPosts = await db.collection(`/posts`).get()
                    const allPosts = getAllPosts.docs.map(doc => doc.data())

                    allPosts.map(async doc => {
                        if (doc) {
                            const id = doc.id

                            const getComments = await db.collection(`/posts/${doc.id}/comments`).where('owner', '==', username).get()
                            const comments = getComments.docs.map(doc => doc.data())

                            comments.map(doc => {
                                if (doc) {
                                    db.doc(`/posts/${id}/comments/${doc.id}`).delete()
                                }
                            })

                            const getLikes = await db.collection(`/posts/${doc.id}/likes`).where('owner', '==', username).get()
                            const likes = getLikes.docs.map(doc => doc.data())

                            likes.map(doc => {
                                if (doc) {
                                    db.doc(`/posts/${id}/likes/${doc.id}`).delete()
                                }
                            })

                            const getRandomizedData = await db.collection(`/posts/${doc.id}/randomizedData`).where('owner', '==', username).get()
                            const randomizedData = getRandomizedData.docs.map(doc => doc.data())

                            randomizedData.map(doc => {
                                if (doc) {
                                    db.doc(`/posts/${id}/randomizedData/${doc.id}`).delete()
                                }
                            })

                            const getSubscribes = await db.collection(`/posts/${doc.id}/subscribes`).where('owner', '==', username).get()
                            const subscribes = getSubscribes.docs.map(doc => doc.data())

                            subscribes.map(doc => {
                                if (doc) {
                                    db.doc(`/posts/${id}/subscribes/${doc.id}`).delete()
                                }
                            })
                        }
                    })

                    const getUserPosts = await db.collection(`/posts`).where('owner', '==', username).get()
                    const allUserPosts = getUserPosts.docs.map(doc => doc.data())

                    allUserPosts.map(async doc => {
                        const id = doc.id

                        const getComments = await db.collection(`/posts/${id}/comments`).get()
                        const comments = getComments.docs.map(doc => doc.data())

                        comments.map(doc => {
                            if (doc) {
                                db.doc(`/posts/${id}/comments/${doc.id}`).delete()
                            }
                        })

                        const getLikes = await db.collection(`/posts/${id}/likes`).get()
                        const likes = getLikes.docs.map(doc => doc.data())

                        likes.map(doc => {
                            if (doc) {
                                db.doc(`/posts/${id}/likes/${doc.id}`).delete()
                            }
                        })

                        const getRandomizedData = await db.collection(`/posts/${id}/randomizedData`).get()
                        const randomizedData = getRandomizedData.docs.map(doc => doc.data())

                        randomizedData.map(doc => {
                            if (doc) {
                                db.doc(`/posts/${id}/randomizedData/${doc.id}`).delete()
                            }
                        })

                        const getSubscribes = await db.collection(`/posts/${id}/subscribes`).get()
                        const subscribes = getSubscribes.docs.map(doc => doc.data())

                        subscribes.map(doc => {
                            if (doc) {
                                db.doc(`/posts/${id}/subscribes/${doc.id}`).delete()
                            }
                        })

                        db.doc(`/posts/${id}`).delete()
                    })

                    const getAllRoomPosts = await db.collection(`room`).get()

                    getAllRoomPosts.docs.map(async doc => {
                        const getPostRoom = await db.collection(`/room/${doc.id}/posts`).get()
                        const postRoom = getPostRoom.docs.map(doc => doc.data())

                        postRoom.map(async doc => {
                            if (doc) {
                                const id = doc.id
                                const room = doc.room

                                const getComments = await db.collection(`/room/${room}/posts/${id}/comments`).where('owner', '==', username).get()
                                const comments = getComments.docs.map(doc => doc.data())

                                comments.map(doc => {
                                    if (doc) {
                                        db.doc(`/room/${room}/posts/${id}/comments/${doc.id}`).delete()
                                    }
                                })

                                const getLikes = await db.collection(`/room/${room}/posts/${id}/likes`).where('owner', '==', username).get()
                                const likes = getLikes.docs.map(doc => doc.data())

                                likes.map(doc => {
                                    if (doc) {
                                        db.doc(`/room/${room}/posts/${id}/likes/${doc.id}`).delete()
                                    }
                                })

                                const getRandomizedData = await db.collection(`/room/${room}/posts/${id}/randomizedData`).where('owner', '==', username).get()
                                const randomizedData = getRandomizedData.docs.map(doc => doc.data())

                                randomizedData.map(doc => {
                                    if (doc) {
                                        db.doc(`/room/${room}/posts/${id}/randomizedData/${doc.id}`).delete()
                                    }
                                })

                                const getSubscribes = await db.collection(`/room/${room}/posts/${id}/subscribes`).where('owner', '==', username).get()
                                const subscribes = getSubscribes.docs.map(doc => doc.data())

                                subscribes.map(doc => {
                                    if (doc) {
                                        db.doc(`/room/${room}/posts/${id}/subscribes/${doc.id}`).delete()
                                    }
                                })
                            }
                        })

                        const getUserPostRoom = await db.collection(`/room/${doc.id}/posts`).get()
                        const userPostRoom = getUserPostRoom.docs.map(doc => doc.data())

                        userPostRoom.map(async doc => {
                            if (doc) {
                                const id = doc.id
                                const room = doc.room

                                const getComments = await db.collection(`/room/${room}/posts/${id}/comments`).get()
                                const comments = getComments.docs.map(doc => doc.data())

                                comments.map(doc => {
                                    if (doc) {
                                        db.doc(`/room/${room}/posts/${id}/comments/${doc.id}`).delete()
                                    }
                                })

                                const getLikes = await db.collection(`/room/${room}/posts/${id}/likes`).get()
                                const likes = getLikes.docs.map(doc => doc.data())

                                likes.map(doc => {
                                    if (doc) {
                                        db.doc(`/room/${room}/posts/${id}/likes/${doc.id}`).delete()
                                    }
                                })

                                const getRandomizedData = await db.collection(`/room/${room}/posts/${id}/randomizedData`).get()
                                const randomizedData = getRandomizedData.docs.map(doc => doc.data())

                                randomizedData.map(doc => {
                                    if (doc) {
                                        db.doc(`/room/${room}/posts/${id}/randomizedData/${doc.id}`).delete()
                                    }
                                })

                                const getSubscribes = await db.collection(`/room/${room}/posts/${id}/subscribes`).get()
                                const subscribes = getSubscribes.docs.map(doc => doc.data())

                                subscribes.map(doc => {
                                    if (doc) {
                                        db.doc(`/room/${room}/posts/${id}/subscribes/${doc.id}`).delete()
                                    }
                                })

                                db.doc(`/room/${room}/posts/${id}`).delete()
                            }
                        })
                    })

                    auth.deleteUser(id).then(() => {
                        console.log("success");
                        db.doc(`/users/${username}`).delete()
                    })
                }

                return 'account deleted'

            } catch (err) {
                console.log(err);
            }
        },
        async clearAllNotif(_, args, context) {
            const { username } = await fbAuthContext(context)

            if (!username) {
                throw new UserInputError("UnAuthorization")
            } else {
                const getNotification = await db.collection(`/users/${username}/notifications`).get()
                const notification = getNotification.docs.map(doc => doc.data())

                try {
                    notification.map(doc => {
                        db.doc(`/users/${username}/notifications/${doc.id}`).delete()
                    })

                    return 'Notification Clear'
                }
                catch (err) {
                    console.log(err);
                    throw new Error(err);
                }
            }
        },
        async readAllNotification(_, args, context) {
            const { username } = await fbAuthContext(context)

            try {
                const batch = db.batch()

                if (!username) {
                    throw UserInputError("unauthorization")
                } else {
                    const getNotifications = await db.collection(`/users/${username}/notifications`).get()
                    const notifications = getNotifications.docs.map(doc => doc.data())

                    notifications.forEach(notif => {
                        const notification = db.doc(`/users/${username}/notifications/${notif.id}/`)
                        batch.update(notification, { read: true })
                    })

                    return batch.commit()
                        .then(() => notifications)
                }
            }
            catch (err) {
                throw new Error(err)
            }
        },
        async readNotification(_, { id }, context) {
            const { username } = await fbAuthContext(context)

            try {
                const batch = db.batch()
                let data;
                if (!username) {
                    throw UserInputError("you can't read this notification")
                } else {
                    const notification = db.doc(`/users/${username}/notifications/${id}`)
                    batch.update(notification, { read: true })

                    await batch.commit()
                        .then(() => {
                            return notification.get()
                        })
                        .then(doc => {
                            data = doc.data()
                        })
                }
                return data
            }
            catch (err) {
                throw new Error(err)
            }
        },
        async login(_, { username, password }) {
            const { valid, errors } = validateLoginInput(username, password)
            if (!valid) throw new UserInputError("Errors", { errors })

            const findUserWithEmail = await db
                .collection(`users`)
                .where('email', '==', username)
                .limit(1).get()

            const findUserWithUsername = await db
                .collection(`users`)
                .where('username', '==', username)
                .limit(1).get()

            const findUserWithNewusername = await db
                .collection(`users`)
                .where('newUsername', '==', username)
                .limit(1).get()

            let data;

            try {
                if (!findUserWithEmail.empty) {

                    data = findUserWithEmail.docs[0].data()

                } else if (!findUserWithUsername.empty) {

                    if (findUserWithUsername.docs[0].data().newUsername) {
                        throw new UserInputError('username/email tidak ditemukan', {
                            errors: { username: "username/email tidak ditemukan" }
                        })
                    } else {
                        data = findUserWithUsername.docs[0].data()
                    }

                } else if (!findUserWithNewusername.empty) {
                    data = findUserWithNewusername.docs[0].data()

                }  else {
                    throw new UserInputError('username/email tidak ditemukan', {
                        errors: { username: "username/email tidak ditemukan" }
                    })
                }

                const { email } = data

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
        async checkUserWithGoogle(_, args, content) {
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

                return token
            }
            catch (err) {
                console.log(err);
            }
        },
        async registerUserWithGoogle(_, args, content, info) {
            const { googleData: { username, email, imageUrl, token, mobileNumber, gender, birthday, id } } = args

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

                return token
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

                return newUser.token
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
        },
        async changeProfileUser(_, { profile }, context) {
            const { url, phoneNumber, gender, birthday, newUsername } = profile
            const { username: oldName } = await fbAuthContext(context)

            const userData = await (await db.doc(`users/${oldName}`).get()).data()
            try {
                await db.doc(`users/${oldName}`).get()
                    .then(doc => {
                        const newUserData = newUsername ? {
                            profilePicture: url ? url : userData.profilePicture,
                            mobileNumber: phoneNumber ? phoneNumber : userData.mobileNumber,
                            gender: gender ? gender : userData.gender,
                            birthday: birthday ? birthday : userData.birthday,
                            newUsername
                        } : {
                            profilePicture: url ? url : userData.profilePicture,
                            mobileNumber: phoneNumber ? phoneNumber : userData.mobileNumber,
                            gender: gender ? gender : userData.gender,
                            birthday: birthday ? birthday : userData.birthday
                        }

                        doc.ref.update(newUserData)
                    })

                return await (await db.doc(`users/${oldName}`).get()).data()
            } catch (error) {
                console.log(error);
            }
        }
    }
}
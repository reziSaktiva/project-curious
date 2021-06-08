const { UserInputError } = require('apollo-server-express');
const { Client } = require("@googlemaps/google-maps-services-js");
const { get } = require('lodash');
const encrypt = require('bcrypt');
const axios = require('axios');

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
        async getVisited (_, args, ctx) {
            const googleMapsClient = new Client({ axiosInstance: axios })
            const { username } = await fbAuthContext(ctx);

            const userVisit = await db.collection(`/users/${username}/visited`).get();
            const visited = (await userVisit).docs.map(doc => doc.data());
            
            const promises = visited.map(async ({ lat, lng}) => {
                const request = await googleMapsClient
                    .reverseGeocode({
                        params: {
                            latlng: `${lat}, ${lng}`,
                            language: 'en',
                            result_type: 'street_address|administrative_area_level_4',
                            location_type: 'APPROXIMATE',
                            key: 'AIzaSyBM6YuNkF6yev9s3XpkG4846oFRlvf2O1k'
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

                        return {...geoResult, location: { lat, lng }};
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
        async deleteAccount(_, { id }, context){
            const { username } = await fbAuthContext(context)

            if (!username) {
                throw new UserInputError("UnAuthorization")
              } else {
                const getNotification = await db.collection(`/users/${username}/notifications`).get()
                const notification = getNotification.docs.map(doc => doc.data())

                const getLiked = await db.collection(`/users/${username}/liked`).get()
                const liked = getLiked.docs.map(doc => doc.data())

                const getVisited = await db.collection(`/users/${username}/visited`).get()
                const visited = getVisited.docs.map(doc => doc.data())

                const getAllPost = await db.collection(`/posts`).where('owner', "==", username).get()
                const allPost = getAllPost.docs.map(doc => doc.data())

                const getAllRoomPost = await db.collection(`/room`).get()
                const roomPost = getAllRoomPost.docs.map( async doc => {
                    const getPostRoom = await db.collection(`/room/${doc.id}/posts`).get()
                    const postRoom = getPostRoom.docs.map(doc => doc.data())

                    return postRoom
                })
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

            try{
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

                return {
                    ...newUser,
                    token
                }
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
        async changePPUser(_, {url}, context) {
            const { username } = await fbAuthContext(context)
            console.log(url);

            try {
                await db.doc(`users/${username}`).get()
                .then(doc => {
                    doc.ref.update({profilePicture: url})
                }) 

                return "beres"
            } catch (error) {
                console.log(error);
            }
        }
    }
}
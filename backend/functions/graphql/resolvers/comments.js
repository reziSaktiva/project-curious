const { db, NOTIFICATION_ADDED, pubSub } = require('../../utility/admin')
const { UserInputError } = require('apollo-server-express');

const fbAuthContext = require('../../utility/fbAuthContext')
const randomGenerator = require('../../utility/randomGenerator')

module.exports = {
    Mutation: {
        async createComment(_, { id, text, reply, photo, room }, context) {
            const { username } = await fbAuthContext(context)
            const { name, displayImage, colorCode } = await randomGenerator(username, id, room)

            const postDocument = db.doc(`/${room ? `room/${room}/posts` : 'posts'}/${id}`)
            const commentCollection = db.collection(`/${room ? `room/${room}/posts` : 'posts'}/${id}/comments`)
            const subscribeCollection = db.collection(`/${room ? `room/${room}/posts` : 'posts'}/${id}/subscribes`)

            if (text.trim() === '') {
                throw new UserInputError('kamu tidak bisa membuat comment tanpa text', { error: { text: 'kamu tidak bisa membuat comment tanpa text' } })
            }
            try {
                const newComment = {
                    owner: username,
                    createdAt: new Date().toISOString(),
                    text,
                    reply,
                    photo

                }

                let postOwner;

                await postDocument.get()
                    .then(doc => {
                        if (!doc.exists) {
                            throw new UserInputError('Postingan tidak ditemukan/sudah dihapus')
                        } else {
                            doc.ref.update({ commentCount: doc.data().commentCount + 1 })
                            postOwner = doc.data().owner

                            return commentCollection.add(newComment)
                        }
                    })
                    .then(doc => {
                        newComment.id = doc.id
                        newComment.displayName = name
                        newComment.displayImage = displayImage
                        newComment.colorCode = colorCode

                        doc.update({ id: doc.id, displayName: name, displayImage: displayImage, colorCode })

                        if (postOwner !== username) {
                            // FIX ME (done)
                            const notifData = {
                                owner: postOwner,
                                recipient: postOwner,
                                sender: username,
                                read: false,
                                postId: id,
                                type: 'COMMENT',
                                createdAt: new Date().toISOString(),
                                displayName: name,
                                displayImage,
                                colorCode
                            }
                            return db.collection(`/users/${postOwner}/notifications`).add(notifData)
                                .then(data => {
                                    data.update({ id: data.id })
                                    pubSub.publish(NOTIFICATION_ADDED, {notificationAdded: {...notifData, id: data.id}})

                                    return subscribeCollection.get()
                                        .then(data => {
                                            if (!data.empty) {
                                                return data.docs.forEach(doc => {
                                                    if (doc.data().owner !== username) {
                                                        // FIX ME
                                                        const notifSubscribe = {
                                                            owner: doc.data().owner,
                                                            recipient: postOwner,
                                                            sender: username,
                                                            read: false,
                                                            postId: id,
                                                            type: 'COMMENT',
                                                            createdAt: new Date().toISOString(),
                                                            displayName: name,
                                                            displayImage,
                                                            colorCode
                                                        }
                                                        return db.collection(`/users/${doc.data().owner}/notifications`).add(notifSubscribe)
                                                            .then(data => {
                                                                data.update({ id: data.id })
                                                                pubSub.publish(NOTIFICATION_ADDED, {notificationAdded: {...notifSubscribe, id: data.id}})
                                                                if(newComment.reply.owner && newComment.reply.owner !== username) {
                                                                    const notifReply = {
                                                                        owner: newComment.reply.owner,
                                                                        recipient: newComment.reply.owner,
                                                                        sender: username,
                                                                        read: false,
                                                                        postId: id,
                                                                        type: 'REPLY_COMMENT',
                                                                        createdAt: new Date().toISOString(),
                                                                        displayName: name,
                                                                        displayImage,
                                                                        colorCode
                                                                    }
                                                                    return db.collection(`/users/${newComment.reply.owner}/notifications`).add(notifReply)
                                                                        .then(data => {
                                                                            data.update({ id: data.id })
                                                                            pubSub.publish(NOTIFICATION_ADDED, {notificationAdded: {...notifReply, id: data.id}})
                                                                        })

                                                                }
                                                            })
                                                    }
                                                })
                                            }
                                        })
                                })
                        }
                    })
                return newComment
            }
            catch (err) {
                console.log(err);
                throw new Error(err)
            }
        },
        async deleteComment(_, { postId, commentId, room }, context) {
            const { username } = await fbAuthContext(context)
            const postDocument = db.doc(`/${room ? `room/${room}/posts` : 'posts'}/${postId}`)

            const commentCollection = db.collection(room ? `/room/${room}/posts` : 'posts').doc(postId).collection('comments').doc(commentId)
            const subscribeCollection = db.collection(`/${room ? `room/${room}/posts` : 'posts'}/${postId}/subscribes`)

            try {
                let postOwner;
                let comment;

                await postDocument.get()
                    .then(doc => {
                        if (!doc.exists) {
                            throw new UserInputError("postingan tidak di temukan/sudah di hapus")
                        } else {
                            comment = doc.data()
                            postOwner = doc.data().owner;

                            return commentCollection.get()
                                .then(doc => {
                                    if (!doc.exists) {
                                        throw new UserInputError('Comment tidak tersedia')
                                    } else {
                                        if (username !== doc.data().owner) {
                                            throw new UserInputError('Anda tidak boleh menghapus comment ini')
                                        } else {
                                            return postDocument.get()
                                        }
                                    }
                                })
                                .then(doc => {
                                    return doc.ref.update({ commentCount: doc.data().commentCount - 1 })
                                })
                                .then(() => {
                                    commentCollection.delete()

                                    return subscribeCollection.get()
                                        .then(data => {
                                            if (!data.empty) {
                                                return data.docs.forEach(doc => {
                                                    return db.collection(`/users/${doc.data().owner}/notifications`)
                                                        .where('postId', "==", postId)
                                                        .where('owner', '==', doc.data().owner)
                                                        .get()
                                                        .then(data => {
                                                            return data.docs.forEach(doc => {
                                                                db.doc(`/users/${doc.data().owner}/notifications/${doc.data().id}`).delete()

                                                                if (postOwner !== username) {
                                                                    return db.collection(`/users/${postOwner}/notifications`)
                                                                        .where('type', '==', "COMMENT")
                                                                        .where('sender', '==', username).get()
                                                                        .then(data => {
                                                                            db.doc(`/users/${postOwner}/notifications/${data.docs[0].id}`).delete()
                                                                        })
                                                                }

                                                            })
                                                        })
                                                })
                                            } else {
                                                if (postOwner !== username) {
                                                    return db.collection(`/users/${postOwner}/notifications`)
                                                        .where('type', '==', "COMMENT")
                                                        .where('sender', '==', username).get()
                                                        .then(data => {
                                                            db.doc(`/users/${postOwner}/notifications/${data.docs[0].id}`).delete()
                                                        })
                                                }
                                            }
                                        })
                                })
                        }
                    })

                return comment
            }
            catch (err) {
                console.log(err);
                throw new Error(err)
            }
        }
    }
}
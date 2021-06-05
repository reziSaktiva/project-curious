const { db } = require('../../utility/admin')
const { UserInputError } = require('apollo-server-express');

const fbAuthContext = require('../../utility/fbAuthContext')
const randomGenerator = require('../../utility/randomGenerator')

module.exports = {
    Mutation: {
        async createComment(_, { id, text, replay }, context) {
            const { username } = await fbAuthContext(context)
            const { name, displayImage, colorCode } = await randomGenerator(username, id)

            const postDocument = db.doc(`/posts/${id}`)
            const commentCollection = db.collection(`/posts/${id}/comments`)
            const subscribeCollection = db.collection(`/posts/${id}/subscribes`)

            if (text.trim() === '') {
                throw new UserInputError('kamu tidak bisa membuat comment tanpa text', { error: { text: 'kamu tidak bisa membuat comment tanpa text' } })
            }
            try {
                const newComment = {
                    owner: username,
                    createdAt: new Date().toISOString(),
                    text,
                    replay
                    
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
                            return db.collection(`/users/${postOwner}/notifications`).add({
                                recipient: postOwner,
                                sender: username,
                                read: false,
                                postId: id,
                                type: 'COMMENT',
                                createdAt: new Date().toISOString(),
                                displayName: name,
                                displayImage,
                                colorCode
                            })
                                .then(data => {
                                    data.update({ id: data.id })

                                    return subscribeCollection.get()
                                        .then(data => {
                                            if (!data.empty) {
                                                return data.docs.forEach(doc => {
                                                    if (doc.data().owner !== username) {
                                                        return db.collection(`/users/${doc.data().owner}/notifications`).add({
                                                            recipient: postOwner,
                                                            sender: username,
                                                            read: false,
                                                            postId: id,
                                                            type: 'COMMENT',
                                                            createdAt: new Date().toISOString(),
                                                            owner: doc.data().owner,
                                                            displayName: name,
                                                            displayImage,
                                                            colorCode
                                                        })
                                                            .then(data => {
                                                                data.update({ id: data.id })
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
        async deleteComment(_, { postId, commentId }, context) {
            const { username } = await fbAuthContext(context)
            const postDocument = db.doc(`/posts/${postId}`)

            const commentCollection = db.collection("posts").doc(postId).collection('comments').doc(commentId)
            const subscribeCollection = db.collection(`/posts/${postId
            }/subscribes`)


            try {
                let postOwner;

                await postDocument.get()
                    .then(doc => {
                        if (!doc.exists) {
                            throw new UserInputError("postingan tidak di temukan/sudah di hapus")
                        } else {
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

                return 'Comment sudah di hapus'
            }
            catch (err) {
                console.log(err);
                throw new Error(err)
            }
        }
    }
}
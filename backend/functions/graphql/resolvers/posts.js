const { db } = require('../../utility/admin');
const { computeDistanceBetween, LatLng } = require('spherical-geometry-js');
const { AuthenticationError, UserInputError } = require('apollo-server-express');

const fbAuthContext = require("../../utility/fbAuthContext");
const randomGenerator = require("../../utility/randomGenerator");

module.exports = {
  Query: {
    async getPosts() {
      const posts = [];

      try {
        await db
          .collection("posts")
          .orderBy("createdAt", "desc")
          .limit(8)
          .get()
          .then((data) => {
            return data.docs.forEach((doc) => {
              const likes = () => {
                return db
                  .collection(`/posts/${doc.data().id}/likes`)
                  .get()
                  .then((data) => {
                    const likes = [];
                    data.forEach((doc) => {
                      likes.push(doc.data());
                    });
                    return likes;
                  });
              };

              const comments = () => {
                return db
                  .collection(`/posts/${doc.data().id}/comments`)
                  .get()
                  .then((data) => {
                    const comments = [];
                    data.forEach((doc) => {
                      comments.push(doc.data());
                    });
                    return comments;
                  });
              };

              posts.push({
                id: doc.data().id,
                text: doc.data().text,
                createdAt: doc.data().createdAt,
                owner: doc.data().owner,
                likeCount: doc.data().likeCount,
                commentCount: doc.data().commentCount,
                location: doc.data().location,
                likes: likes(),
                comments: comments(),
              });
            });
          });

        return posts;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    async getPost(_, { id }, context) {
      const { username } = await fbAuthContext(context)

      const postDocument = db.doc(`/posts/${id}`)
      const commentCollection = db.collection(`/posts/${id}/comments`)
      const likeCollection = db.collection(`/posts/${id}/likes`)
      if (username) {
        try {
          let post;

          await postDocument.get()
            .then(doc => {
              if (!doc.exists) {
                throw new UserInputError('Postingan tidak ditemukan')
              } else {
                post = doc.data()
                post.comments = []
                post.likes = []

                return commentCollection.orderBy('createdAt', 'asc').get()
              }
            })
            .then(docs => {
              docs.forEach(doc => {
                post.comments.push(doc.data())
              })
              return likeCollection.get()
            })
            .then(data => {
              data.forEach(doc => {
                post.likes.push(doc.data())
              })
            })
          return post
        }
        catch (err) {
          console.log(err)
          throw new Error(err)
        }
      }
    },
    async getPostBasedOnNearestLoc(_, { lat, lng }) {
      if (!lat || !lng) {
        throw new UserInputError('Lat and Lng is Required')
      }

      const data = await db.collection('posts').orderBy('createdAt', 'desc').get()
      const docs = data.docs.map((doc) => doc.data())

      if (docs.length) {
        const nearby = []

        docs.forEach(data => {
          const { lat: lattitude, lng: longtitude } = data.location;
          try {
            const currentLatLng = new LatLng(parseFloat(lat), parseFloat(lng));
            const contentLocation = new LatLng(parseFloat(lattitude), parseFloat(longtitude));

            const distance = computeDistanceBetween(currentLatLng, contentLocation)

            if ((distance / 1000) <= 40) { // should be show in range 40 km
              nearby.push(data)
            }
          } catch (e) {
            console.log('error : ', e)
          }

        });

        return nearby;
      }

      return [];
    },
  },

  Mutation: {
    async getPost(_, { id }, context) {
      const { username } = await fbAuthContext(context);

      const postDocument = db.doc(`/posts/${id}`);
      const commentCollection = db.collection(`/posts/${id}/comments`);
      const likeCollection = db.collection(`/posts/${id}/likes`);

      if (username) {
        try {
          let post;

          await postDocument
            .get()
            .then((doc) => {
              if (!doc.exists) {
                throw new UserInputError("post tidak di temukan");
              } else {
                post = doc.data();
                post.comments = [];
                post.likes = [];
                return commentCollection.orderBy("createdAt", "asc").get();
              }
            })
            .then((data) => {
              data.forEach((doc) => {
                post.comments.push(doc.data());
                console.log(doc.data());
              });
              return likeCollection.get();
            })
            .then((data) => {
              data.forEach((doc) => {
                post.likes.push(doc.data());
              });
            });
          return post;
        } catch (err) {
          console.log(err);
          throw new Error(err);
        }
      }
    },
    async nextPosts(_, { id }, context) {
      try {
        const lastPosts = db.doc(`/posts/${id}`);

        const posts = [];

        await lastPosts.get().then((doc) => {
          return db
            .collection("posts")
            .orderBy("createdAt", "desc")
            .startAfter(doc)
            .limit(3)
            .get()
            .then((data) => {
              return data.docs.forEach((doc) => {
                const likes = () => {
                  return db
                    .collection(`/posts/${doc.data().id}/likes`)
                    .get()
                    .then((data) => {
                      const likes = [];
                      data.forEach((doc) => {
                        likes.push(doc.data());
                      });
                      return likes;
                    });
                };

                const comments = () => {
                  return db
                    .collection(`/posts/${doc.data().id}/comments`)
                    .get()
                    .then((data) => {
                      const comments = [];
                      data.forEach((doc) => {
                        comments.push(doc.data());
                      });
                      return comments;
                    });
                };

                posts.push({
                  id: doc.data().id,
                  text: doc.data().text,
                  createdAt: doc.data().createdAt,
                  owner: doc.data().owner,
                  likeCount: doc.data().likeCount,
                  commentCount: doc.data().commentCount,
                  location: doc.data().location,
                  likes: likes(),
                  comments: comments(),
                });
              });
            });
        });

        return posts;
      } catch (err) {
        console.log(err);
      }
    },
    async createPost(_, { text, location }, context) {
      const { username } = await fbAuthContext(context);
      if (username) {
        try {
          const newPost = {
            owner: username,
            text,
            createdAt: new Date().toISOString(),
            likeCount: 0,
            commentCount: 0,
            location,
          };

          await db
            .collection("/posts")
            .add(newPost)
            .then((doc) => {
              newPost.id = doc.id;
              doc.update({ id: doc.id });
            });

          return {
            ...newPost,
            likes: [],
            comments: []
          };
        } catch (err) {
          throw new Error(err);
        }
      }
    },
    async deletePost(_, { id }, context) {
      const { username } = await fbAuthContext(context);
      const document = db.doc(`/posts/${id}`);
      const commentsCollection = db.collection(`/posts/${id}/comments`);
      const likesCollection = db.collection(`/posts/${id}/likes`);
      const randomizedCollection = db.collection(`/posts/${id}/randomizedData`);
      const subcribeCollection = db.collection(`/posts/${id}/subscribes`);

      try {
        await document.get().then((doc) => {
          if (!doc.exists) {
            throw new Error("Postingan tidak di temukan");
          }
          if (doc.data().owner !== username) {
            throw new AuthenticationError("Unauthorized");
          } else {
            return commentsCollection
              .get()
              .then((data) => {
                data.forEach((doc) => {
                  db.doc(`/posts/${id}/comments/${doc.data().id}`).delete();
                });
                return likesCollection.get();
              })
              .then((data) => {
                data.forEach((doc) => {
                  db.doc(`/posts/${id}/likes/${doc.data().id}`).delete();
                });
                return randomizedCollection.get();
              })
              .then((data) => {
                data.forEach((doc) => {
                  db.doc(
                    `/posts/${id}/randomizedData/${doc.data().id}`
                  ).delete();
                });
                return db
                  .collection(`/users/${username}/notifications`)
                  .where("postId", "==", id)
                  .get();
              })
              .then((data) => {
                data.forEach((doc) => {
                  db.doc(
                    `/users/${username}/notifications/${doc.data().id}/`
                  ).delete();
                });
                return subcribeCollection.get();
              })
              .then((data) => {
                document.delete();
                return data.docs.forEach((doc) => {
                  const docOwner = doc.data().owner;
                  db.doc(`/posts/${id}/subscribes/${doc.data().id}/`).delete();
                  return db
                    .collection(`/users/${doc.data().owner}/notifications`)
                    .where("postId", "==", id)
                    .get()
                    .then((data) => {
                      data.forEach((doc) => {
                        db.doc(
                          `/users/${docOwner}/notifications/${doc.data().id}/`
                        ).delete();
                      });
                    });
                });
              });
          }
        });
        return "postingan sudah di hapus";
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    async likePost(_, { id }, context) {
      const { username } = await fbAuthContext(context);
      const { name, displayImage, colorCode } = await randomGenerator(
        username,
        id
      );

      const postDocument = db.doc(`/posts/${id}`);
      const likeCollection = db.collection(`/posts/${id}/likes`);
      const subscribeCollection = db.collection(`/posts/${id}/subscribes`);

      try {
        const { isLiked, likeId } = await likeCollection
          .where("owner", "==", username)
          .limit(1)
          .get()
          .then((data) => {
            const isLiked = data.empty;
            let likeId = "";

            if (!data.empty) {
              likeId = data.docs[0].id;
            }
            return {
              isLiked,
              likeId,
            };
          });
        let post;
        let likeData;

        await postDocument.get().then((doc) => {
          if (doc.data()) {
            post = doc.data();

            if (!isLiked) {
              // Unlike
              post.likeCount--;
              doc.ref.update({ likeCount: doc.data().likeCount - 1 });

              likeData = {
                owner: username,
                createdAt: new Date().toISOString(),
                id: likeId,
                postId: post.id,
                displayName: name,
                displayImage,
                colorCode,
                isLike: false,
              };

              db.doc(`/posts/${id}/likes/${likeId}`).delete();
              db.doc(`/users/${username}/liked/${likeId}`).delete();

              return subscribeCollection.get().then((data) => {
                if (!data.empty) {
                  return data.docs.forEach((doc) => {
                    return db
                      .collection(`/users/${doc.data().owner}/notifications`)
                      .where("postId", "==", id)
                      .where("owner", "==", doc.data().owner)
                      .get()
                      .then((data) => {
                        return data.docs.forEach((doc) => {
                          db.doc(
                            `/users/${doc.data().owner}/notifications/${doc.data().id
                            }`
                          ).delete();

                          if (post.owner !== username) {
                            return db
                              .collection(`/users/${post.owner}/notifications`)
                              .where("type", "==", "LIKE")
                              .where("sender", "==", username)
                              .get()
                              .then((data) => {
                                db.doc(
                                  `/users/${post.owner}/notifications/${data.docs[0].id}`
                                ).delete();
                              });
                          }
                        });
                      });
                  });
                } else {
                  if (post.owner !== username) {
                    return db
                      .collection(`/users/${post.owner}/notifications`)
                      .where("type", "==", "LIKE")
                      .where("sender", "==", username)
                      .get()
                      .then((data) => {
                        db.doc(
                          `/users/${post.owner}/notifications/${data.docs[0].id}`
                        ).delete();
                      });
                  }
                }
              });
            } else {
              // Like
              post.likeCount++;
              doc.ref.update({ likeCount: doc.data().likeCount + 1 });
              return likeCollection
                .add({
                  owner: username,
                  createdAt: new Date().toISOString(),
                  displayName: name,
                  displayImage,
                  colorCode,
                })
                .then((data) => {
                  data.update({ id: data.id });
                  likeData = {
                    owner: username,
                    createdAt: new Date().toISOString(),
                    id: data.id,
                    postId: post.id,
                    displayName: name,
                    displayImage,
                    colorCode,
                    isLike: true,
                  };

                  db.doc(`/users/${username}/liked/${data.id}`).set(likeData);

                  if (post.owner !== username) {
                    db.collection(`/users/${post.owner}/notifications`)
                      .add({
                        recipient: post.owner,
                        sender: username,
                        read: false,
                        postId: id,
                        type: "LIKE",
                        createdAt: new Date().toISOString(),
                        displayName: name,
                        displayImage,
                        colorCode,
                      })
                      .then((data) => {
                        data.update({ id: data.id });
                      });
                  }

                  return subscribeCollection.get().then((data) => {
                    if (!data.empty) {
                      return data.docs.forEach((doc) => {
                        if (doc.data().owner !== username) {
                          return db
                            .collection(
                              `/users/${doc.data().owner}/notifications`
                            )
                            .add({
                              recipient: post.owner,
                              sender: username,
                              read: false,
                              postId: id,
                              type: "LIKE",
                              createdAt: new Date().toISOString(),
                              owner: doc.data().owner,
                              displayName: name,
                              displayImage,
                              colorCode,
                            })
                            .then((data) => {
                              data.update({ id: data.id });
                            });
                        }
                      });
                    }
                  });
                });
            }
          } else {
            throw new UserInputError("Postingan tidak di temukan");
          }
        });

        return likeData;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    }, async mutePost(_, { postId }, context) {
      const { username } = await fbAuthContext(context)
      const postDocument = db.doc(`/posts/${postId}`)
      const muteDocument = db.collection(`/posts/${postId}/muted`)

      try {
        const { isMuted, muteId } = await muteDocument.where("owner", "==", username).limit(1).get()
          .then(data => {
            const isMuted = data.empty
            let muteId = '';

            if (!data.empty) {
              muteId = data.docs[0].id
            }

            return {
              isMuted,
              muteId
            }
          })

        let mute = {
          owner: username,
          createdAt: new Date().toISOString(),
          postId
        }

        await postDocument.get()
          .then(doc => {
            if (!doc.exists) {
              throw new UserInputError('Postingan tidak di temukan')
            } else {
              if (!isMuted) {
                db.doc(`/posts/${postId}/muted/${muteId}`).delete()
                mute = {
                  ...mute,
                  mute: false,
                  id: muteId
                }
              } else {
                return muteDocument.add({ owner: username, createdAt: new Date().toISOString(), postId })
                  .then(data => {
                    data.update({ id: data.id })
                    console.log(data.id);
                    mute = {
                      ...mute,
                      mute: true,
                      id: data.id
                    }
                  })
              } 
            }
          })
          
        return mute

      } catch (err) {
        throw new Error(err)
      }


    },
    async subscribePost(_, { postId }, context) {
      const { username } = await fbAuthContext(context);
      const { name, displayImage, colorCode } = await randomGenerator(
        username,
        postId
      );

      const subscribeCollection = db.collection(`/posts/${postId}/subscribes`);

      let postOwner;
      let subscribe;

      try {
        const { isSubscribed, subId } = await subscribeCollection
          .where("owner", "==", username)
          .limit(1)
          .get()
          .then((data) => {
            const isSubscribed = data.empty;
            let subId = "";

            if (!data.empty) {
              subId = data.docs[0].id;
            }
            return {
              isSubscribed,
              subId,
            };
          });

        await db
          .collection("posts")
          .where("id", "==", postId)
          .get()
          .then((data) => {
            if (data.empty) {
              throw new UserInputError("post tidak di temukan");
            } else {
              subscribe = {
                owner: username,
                createdAt: new Date().toISOString(),
                displayName: name,
                displayImage,
                colorCode,
                postId,
              };

              if (isSubscribed) {
                postOwner = data.docs[0].data().owner;

                return db
                  .collection(`/posts/${postId}/subscribes`)
                  .add(subscribe)
                  .then((data) => {
                    data.update({ id: data.id });

                    if (postOwner !== username) {
                      db.collection(`/users/${postOwner}/notifications`)
                        .add({
                          recipient: postOwner,
                          sender: username,
                          read: false,
                          postId: postId,
                          type: "SUBSCRIBE",
                          createdAt: new Date().toISOString(),
                          displayName: name,
                          displayImage,
                          colorCode,
                        })
                        .then((data) => {
                          data.update({ id: data.id });
                        });
                    }
                  });
              } else {
                db.doc(`/posts/${postId}/subscribes/${subId}/`).delete();
              }
            }
          });

        return subscribe;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
  },
};

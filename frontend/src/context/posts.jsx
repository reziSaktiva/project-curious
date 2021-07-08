import React, { createContext, useMemo, useReducer } from "react";
import { cloneDeep } from "lodash";

const reducer = (state, action) => {
  switch (action.type) {
    case "LOADING_DATA":
      return {
        ...state,
        loading: true,
      };
    case "SET_POSTS":
      let lastIdPosts = action.payload[action.payload.length - 1].id;

      return {
        ...state,
        loading: false,
        posts: action.payload,
        lastIdPosts,
      };

      case "SET_NAV":

      return {
        ...state,
        active: action.payload,
      };
    case "SET_Insvire E-Sport":
      // let lastIdPosts = action.payload[action.payload.length - 1].id;

      return {
        ...state,
        loading: false,
        room_1: action.payload,
        // lastIdPosts,
      };
    case "SET_BMW Club Bandung":
      // let lastIdPosts = action.payload[action.payload.length - 1].id;

      return {
        ...state,
        loading: false,
        room_2: action.payload,
        // lastIdPosts,
      };
    case "SET_POST":
      return {
        ...state,
        loading: false,
        post: action.payload,
      };
    case "SET_MUTED_POST":
      return {
        ...state,
        loading: false,
        mutedPost: action.payload,
      };
    case "SET_LIKED_POSTS":
      return {
        ...state,
        loading: false,
        likedPosts: action.payload,
      };
    case "SET_SUBSCRIBE_POSTS":
      return {
        ...state,
        loading: false,
        subscribePosts: action.payload,
      };
    case "MORE_POSTS":
      return {
        ...state,
        loading: false,
        posts: [...state.posts, ...action.payload],
        isMorePost: action.payload.length === 3,
        lastIdPosts: state.posts[state.posts.length - 1].id,
      };
    case "CREATE_POST_ROOM_1":
      const before = cloneDeep(state.posts) || [];
      const after = [action.payload, ...before];

      return {
        ...state,
        loading: false,
        room_1: after,
      };
    case "CREATE_POST_ROOM_2":
      const first = cloneDeep(state.posts) || [];
      const second = [action.payload, ...first];

      return {
        ...state,
        loading: false,
        room_2: second,
      };
    case "CREATE_POST":
      const oldPosts = cloneDeep(state.posts) || [];
      const posts = [action.payload, ...oldPosts];

      return {
        ...state,
        loading: false,
        posts,
      };
    case "DELETE_POST":
      const deleteId = action.payload;

      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== deleteId),
      };
    case "DELETE_POST_ROOM_1":
      const id = action.payload;

      return {
        ...state,
        room_1: state.room_1.filter((post) => post.id !== id),
      };
    case "DELETE_POST_ROOM_2":
      const idDelete = action.payload;

      return {
        ...state,
        room_2: state.room_2.filter((post) => post.id !== idDelete),
      };
    case "SET_COMMENT":
      const { payload } = action;
      const hasReply = payload.reply && payload.reply.id;

      if (hasReply) {
        const match = state.post.comments.findIndex(
          (itm) => itm.id == payload.reply.id
        );

        if (!match) {
          if (state.post.comments.length > 1) {
            const recursive = (list) => {
              return list.map((itm) => {
                if (itm.id === payload.reply.id) {
  
                  return { ...itm, replyList: itm.replyList.concat(payload) };
  
                } else {
                  if (!itm.replyList) return itm;
  
                  return recursive(itm.replyList);
                }
              });
            };
  
            const newComments = recursive(state.post.comments);
  
            return {
              ...state,
              post: {
                ...state.post,
                comments: newComments,
                commentsCount: state.post.comments + 1,
              },
            };
          }

          if (state.post.comments.length === 1) {
            const newComments = state.post.comments;
            newComments[0].replyList = [action.payload];

            return {
              ...state,
              post: {
                ...state.post,
                comments: newComments,
                commentsCount: state.post.comments + 1,
              },
            }
          }
        }
      }

      return {
        ...state,
        post: {
          ...state.post,
          comments: [...state.post.comments, action.payload],
          commentsCount: state.post.comments + 1,
        },
      };
    case "DELETE_COMMENT":
      if (action.payload.reply && action.payload.reply.id) {
        const find = state.post.comments.findIndex(
          (itm) => itm.id == action.payload.reply.id
        );

        if (!find) {
          const recursive = (list) => {
            return list.map((itm) => {
              return { ...itm, replyList: itm.replyList.filter(list => list !== action.payload.id) };
            });
          };

          const newComments = recursive(state.post.comments);

          return {
            ...state,
            post: {
              ...state.post,
              comments: newComments,
              commentsCount: state.post.comments + 1,
            },
          };
        }
      }
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(
            (comment) => comment.id !== action.payload
          ),
        },
      };
    case "LIKE_POST":
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === action.payload.postId) {
            const updatedPost = {
              ...post,
              likes: [...post.likes, action.payload.data],
              likeCount: post.likeCount + 1,
            };

            return updatedPost;
          }

          return post;
        }),
      };
    case "LIKE_SUBSCRIBE":
      return {
        ...state,
        subscribePosts: state.subscribePosts.map((post) => {
          if (post.id === action.payload.postId) {
            const updatedPost = {
              ...post,
              likes: [...post.likes, action.payload.data],
              likeCount: post.likeCount + 1,
            };

            return updatedPost;
          }

          return post;
        }),
      };
    case "LIKE_MUTED":
      return {
        ...state,
        mutedPost: state.mutedPost.map((post) => {
          if (post.id === action.payload.postId) {
            const updatedPost = {
              ...post,
              likes: [...post.likes, action.payload.data],
              likeCount: post.likeCount + 1,
            };

            return updatedPost;
          }

          return post;
        }),
      };
    case "LIKE_LIKED":
      return {
        ...state,
        likedPosts: state.likedPosts.map((post) => {
          if (post.id === action.payload.postId) {
            const updatedPost = {
              ...post,
              likes: [...post.likes, action.payload.data],
              likeCount: post.likeCount + 1,
            };

            return updatedPost;
          }

          return post;
        }),
      };
    case "LIKE_DETAIL":
      return {
        ...state,
        post: state.post && {
          ...state.post,
          likes: state.post.likes && [...state.post.likes, action.payload.data],
          likeCount: state.post.likeCount + 1,
        },
      };
    case "UNLIKE_POST":
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === action.payload.postId) {
            const updatedPosts = {
              ...post,
              likes: post.likes.filter(
                (like) => like.owner !== action.payload.data.owner
              ),
              likeCount: post.likeCount - 1,
            };
            return updatedPosts;
          }

          return post;
        }),
      };
    case "UNLIKE_SUBSCRIBE":
      return {
        ...state,
        subscribePosts: state.subscribePosts.map((post) => {
          if (post.id === action.payload.postId) {
            const updatedPosts = {
              ...post,
              likes: post.likes.filter(
                (like) => like.owner !== action.payload.data.owner
              ),
              likeCount: post.likeCount - 1,
            };
            return updatedPosts;
          }

          return post;
        }),
      };
    case "UNLIKE_MUTED":
      return {
        ...state,
        mutedPost: state.mutedPost.map((post) => {
          if (post.id === action.payload.postId) {
            const updatedPosts = {
              ...post,
              likes: post.likes.filter(
                (like) => like.owner !== action.payload.data.owner
              ),
              likeCount: post.likeCount - 1,
            };
            return updatedPosts;
          }

          return post;
        }),
      };
    case "UNLIKE_LIKED":
      return {
        ...state,
        likedPosts: state.likedPosts.map((post) => {
          if (post.id === action.payload.postId) {
            const updatedPosts = {
              ...post,
              likes: post.likes.filter(
                (like) => like.owner !== action.payload.data.owner
              ),
              likeCount: post.likeCount - 1,
            };
            return updatedPosts;
          }

          return post;
        }),
      };
    case "UNLIKE_DETAIL":
      return {
        ...state,
        post: state.post && {
          ...state.post,
          likes: state.post.likes.filter(
            (like) => like.owner !== action.payload.data.owner
          ),
          likeCount: state.post.likeCount - 1,
        },
      };
    case "LIKE_POST_ROOM_1":
      return {
        ...state,
        room_1: state.room_1.map((post) => {
          if (post.id === action.payload.postId) {
            const updatedPost = {
              ...post,
              likes: [...post.likes, action.payload.data],
              likeCount: post.likeCount + 1,
            };

            return updatedPost;
          }

          return post;
        }),
      };
    case "LIKE_POST_ROOM_2":
      return {
        ...state,
        room_2: state.room_2.map((post) => {
          if (post.id === action.payload.postId) {
            const updatedPost = {
              ...post,
              likes: [...post.likes, action.payload.data],
              likeCount: post.likeCount + 1,
            };

            return updatedPost;
          }

          return post;
        }),
      };
    case "UNLIKE_POST_ROOM_1":
      return {
        ...state,
        room_1: state.room_1.map((post) => {
          if (post.id === action.payload.postId) {
            const updatedPosts = {
              ...post,
              likes: post.likes.filter(
                (like) => like.owner !== action.payload.data.owner
              ),
              likeCount: post.likeCount - 1,
            };
            return updatedPosts;
          }

          return post;
        }),
      };
    case "UNLIKE_POST_ROOM_2":
      return {
        ...state,
        room_2: state.room_2.map((post) => {
          if (post.id === action.payload.postId) {
            const updatedPosts = {
              ...post,
              likes: post.likes.filter(
                (like) => like.owner !== action.payload.data.owner
              ),
              likeCount: post.likeCount - 1,
            };
            return updatedPosts;
          }

          return post;
        }),
      };
    case "SUBCRIBE_POST":
      const { subscribeData, post } = action.payload;

      const subscribePosts = [...state.subscribePosts, post];
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === subscribeData.postId) {
            const update = {
              ...post,
              subscribe: [...post.subscribe, subscribeData],
            };
            return update;
          }

          return post;
        }),
        subscribePosts,
      };
    case "UNSUBCRIBE_POST":
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === action.payload.subscribeData.postId) {
            const update = {
              ...post,
              subscribe: post.subscribe.filter(
                (data) => data.owner !== action.payload.subscribeData.owner
              ),
            };
            return update;
          }

          return post;
        }),
        subscribePosts: state.subscribePosts.filter(
          (post) => post.id !== action.payload.subscribeData.postId
        ),
      };
    case "MUTE_POST":
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === action.payload.postId) {
            const updatePosts = {
              ...post,
              muted: [...post.muted, action.payload],
            };
            return updatePosts;
          }

          return post;
        }),
      };
    case "UNMUTE_POST":
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === action.payload.postId) {
            const updatedPosts = {
              ...post,
              muted: post.muted.filter(
                (mute) => mute.owner !== action.payload.owner
              ),
            };
            return updatedPosts;
          }

          return post;
        }),
      };
    case "MUTE_POST_ROOM_1":
      return {
        ...state,
        room_1: state.room_1.map((post) => {
          if (post.id === action.payload.postId) {
            const updatePosts = {
              ...post,
              muted: [...post.muted, action.payload],
            };
            return updatePosts;
          }

          return post;
        }),
      };
    case "UNMUTE_POST_ROOM_1":
      return {
        ...state,
        room_1: state.room_1.map((post) => {
          if (post.id === action.payload.postId) {
            const updatedPosts = {
              ...post,
              muted: post.muted.filter(
                (mute) => mute.owner !== action.payload.owner
              ),
            };
            return updatedPosts;
          }

          return post;
        }),
      };
    case "MUTE_POST_POST_ROOM_2":
      return {
        ...state,
        room_2: state.room_2.map((post) => {
          if (post.id === action.payload.postId) {
            const updatePosts = {
              ...post,
              muted: [...post.muted, action.payload],
            };
            return updatePosts;
          }

          return post;
        }),
      };
    case "UNMUTE_POST_POST_ROOM_2":
      return {
        ...state,
        room_2: state.room_2.map((post) => {
          if (post.id === action.payload.postId) {
            const updatedPosts = {
              ...post,
              muted: post.muted.filter(
                (mute) => mute.owner !== action.payload.owner
              ),
            };
            return updatedPosts;
          }

          return post;
        }),
      };
    case "OPEN_POST_CARD":
      const { repost, isOpenNewPost } = action.payload;
      return {
        ...state,
        isOpenNewPost,
        repost,
      };
    default:
      throw new Error("Don't understand action");
  }
};

export const PostContext = createContext({
  posts: [],
  room_1: [],
  room_2: [],
  mutedPost: [],
  likedPosts: [],
  subscribePosts: [],
  post: null,
  newPosts: null,
  loading: false,
  lastIdPosts: null,
  isMorePost: true,
  isOpenNewPost: false,
  repost: false,
  active: "latest",
  setRoom: () => {},
  setLikedPosts: () => {},
  setComment: () => {},
  setPost: () => {},
  setNav: () => {},
  setSubscribePosts: () => {},
  setMutedPost: () => {},
  subscribePost: () => {},
  loadingData: () => {},
  setPosts: (posts) => {},
  morePosts: () => {},
  createPost: () => {},
  deletePost: () => {},
  like: () => {},
  mutePost: () => {},
  commentDelete: () => {},
});

const initialState = {
  posts: [],
  room_1: [],
  room_2: [],
  active: "latest",
  likedPosts: [],
  post: null,
  mutedPost: [],
  isMorePost: true,
  newPosts: null,
  loading: null,
  lastIdPosts: null,
  subscribePosts: [],
};

export const PostProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    posts,
    active,
    post,
    loading,
    lastIdPosts,
    isMorePost,
    isOpenNewPost,
    repost,
    mutedPost,
    subscribePosts,
    likedPosts,
    room_1,
    room_2,
  } = state;

  const loadingData = () => {
    dispatch({ type: "LOADING_DATA" });
  };

  const createPost = (post) => {
    if (post.room) {
      const room = post.room === "Insvire E-Sport" ? "ROOM_1" : "ROOM_2";

      dispatch({
        type: `CREATE_POST_${room}`,
        payload: post,
      });
    } else {
      dispatch({
        type: "CREATE_POST",
        payload: post,
      });
    }
  };

  const setPost = (post) => {
    dispatch({
      type: "SET_POST",
      payload: post,
    });
  };

  const setComment = (data) => {
    dispatch({
      type: "SET_COMMENT",
      payload: data,
    });
  };

  const commentDelete = (data) => {
    dispatch({
      type: "DELETE_COMMENT",
      payload: data,
    });
  };

  const setLikedPosts = (posts) => {
    if (posts.length > 0) {
      dispatch({
        type: "SET_LIKED_POSTS",
        payload: posts,
      });
    }
  };

  const setMutedPost = (posts) => {
    if (posts.length > 0) {
      dispatch({
        type: "SET_MUTED_POST",
        payload: posts,
      });
    }
  };

  const setSubscribePosts = (posts) => {
    if (posts.length > 0) {
      dispatch({
        type: "SET_SUBSCRIBE_POSTS",
        payload: posts,
      });
    }
  };

  const subscribePost = (data, post) => {
    const subscribeData = {
      owner: data.owner,
      createdAt: data.createdAt,
      displayName: data.displayName,
      displayImage: data.displayImage,
      colorCode: data.colorCode,
      postId: data.postId,
    };

    if (data.isSubscribe) {
      dispatch({
        type: "SUBCRIBE_POST",
        payload: {
          subscribeData,
          post,
        },
      });
    } else if (!data.isSubscribe) {
      dispatch({
        type: "UNSUBCRIBE_POST",
        payload: {
          subscribeData,
          post,
        },
      });
    }
  };

  const deletePost = (id, room) => {
    let locationRoom;

    if (room === "Insvire E-Sport") {
      locationRoom = "ROOM_1";
    } else if (room === "BMW Club Bandung") {
      locationRoom = "ROOM_2";
    }

    dispatch({
      type: !room ? "DELETE_POST" : `DELETE_POST_${locationRoom}`,
      payload: id,
    });
  };

  const setRoom = (posts) => {
    if (posts.length) {
      if (posts[0].room === "Insvire E-Sport") {
        dispatch({
          type: `SET_${posts[0].room}`,
          payload: posts,
        });
      } else if (posts[0].room === "BMW Club Bandung") {
        dispatch({
          type: `SET_${posts[0].room}`,
          payload: posts,
        });
      }
    }
  };

  const setPosts = (posts) => {
    if (posts.length > 0) {
      dispatch({
        type: "SET_POSTS",
        payload: posts,
      });
    }
  };

  const setNav = (active) => {
    dispatch({
      type: "SET_NAV",
      payload: active
    })
  }

  const mutePost = (data, room) => {
    const muteData = {
      owner: data.owner,
      id: data.id,
      createAt: data.createdAt,
      postId: data.postId,
    };

    let locationRoom;

    if (room === "Insvire E-Sport") {
      locationRoom = "ROOM_1";
    } else if (room === "BMW Club Bandung") {
      locationRoom = "ROOM_2";
    }

    if (data.mute) {
      dispatch({
        type: room ? `MUTE_POST_${locationRoom}` : "MUTE_POST",
        payload: muteData,
      });
    } else if (!data.mute) {
      dispatch({
        type: room ? `UNMUTE_POST_${locationRoom}` : "UNMUTE_POST",
        payload: muteData,
      });
    }
  };

  const morePosts = (posts) => {
    setTimeout(() => {
      dispatch({
        type: "MORE_POSTS",
        payload: posts,
      });
    }, 2000);
  };

  const toggleOpenNewPost = (repost = false, room = false) => {
    dispatch({
      type: "OPEN_POST_CARD",
      payload: {
        isOpenNewPost: !isOpenNewPost,
        repost: repost && {
          repost,
          room,
        },
      },
    });
  };

  const like = (likeData, postId, room, type) => {
    const data = {
      id: likeData.id,
      owner: likeData.owner,
      createdAt: likeData.createdAt,
      displayName: likeData.displayName,
      displayImage: likeData.displayImage,
      colorCode: likeData.colorCode,
    };

    let locationRoom;
    let name;

    if (room === "Insvire E-Sport") {
      locationRoom = "ROOM_1";
    } else if (room === "BMW Club Bandung") {
      locationRoom = "ROOM_2";
    }

    if (type == "subscribe_posts") {
      name = "LIKE_SUBSCRIBE";
    } else if (type == "muted_posts") {
      name = "LIKE_MUTED";
    } else if (type == "liked_posts") {
      name = "LIKE_LIKED";
    } else if (type == "nearby") {
      name = "LIKE_POST";
    } else if (type == "detail_post") {
      name = "LIKE_DETAIL";
    }

    if (likeData.isLike) {
      dispatch({
        type: room ? `LIKE_POST_${locationRoom}` : name,
        payload: {
          data,
          postId,
        },
      });

      return;
    } else if (!likeData.isLike) {
      dispatch({
        type: room ? `UNLIKE_POST_${locationRoom}` : `UN${name}`,
        payload: {
          data,
          postId,
        },
      });
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        post,
        room_1,
        room_2,
        active,
        setPosts,
        setNav,
        setPost,
        setComment,
        loadingData,
        morePosts,
        createPost,
        like,
        deletePost,
        mutePost,
        toggleOpenNewPost,
        setMutedPost,
        setLikedPosts,
        subscribePost,
        setSubscribePosts,
        setRoom,
        commentDelete,
        likedPosts,
        subscribePosts,
        mutedPost,
        loading,
        lastIdPosts,
        isMorePost,
        isOpenNewPost,
        repost,
      }}
      {...props}
    />
  );
};

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
    case "SET_POST":
      return {
        ...state,
        loading: false,
        post: action.payload
      }
    case "SET_MUTED_POST":
      return {
        ...state,
        loading: false,
        mutedPost: action.payload,
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
    case "UNLIKE_POST":
      const data = action.payload.data;
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === action.payload.postId) {
            const updatedPosts = {
              ...post,
              likes: post.likes.filter((like) => like.owner !== data.owner),
              likeCount: post.likeCount - 1,
            };
            return updatedPosts;
          }

          return post;
        }),
      };
    case 'SUBCRIBE_POST':
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post.id === action.payload.postId) {
            const updatePosts = {
              ...post,
              subscribe: [...post.subscribe, action.payload]
            }
            return updatePosts
          }

          return post
        })
      }
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
  post: null,
  newPosts: null,
  loading: false,
  lastIdPosts: null,
  isMorePost: true,
  isOpenNewPost: false,
  repost: false,
  mutedPost: [],
  subscribePosts: [],
  setPost: () => {},
  setSubscribePosts: () => { },
  setMutedPost: () => { },
  subscribePost: () => { },
  loadingData: () => { },
  setPosts: (posts) => { },
  morePosts: () => { },
  createPost: () => { },
  deletePost: () => { },
  like: () => { },
  mutePost: () => { },
});

const initialState = {
  posts: [],
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

  const { posts, post, loading, lastIdPosts, isMorePost, isOpenNewPost, repost, mutedPost, subscribePosts } =
    state;

  const loadingData = () => {
    dispatch({ type: "LOADING_DATA" });
  };

  const createPost = (post) => {
    dispatch({
      type: "CREATE_POST",
      payload: post,
    });
  };

  const setPost = (post) => {
    dispatch({
      type: 'SET_POST',
      payload: post
    })
  }

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
  }

  const subscribePost = (data) => {
    const subscribeData = {
      owner: data.owner,
      createAt: data.createdAt,
      postId: data.postId,
    };

    if (data.isSubscribe) {
      dispatch({
        type: "SUBCRIBE_POST",
        payload: subscribeData
      })
    } else if (!data.isSubscribe) {
      dispatch({
        type: "UNSUBCRIBE_POST",
        payload: subscribeData
      })
    }

  }

  const deletePost = (id) => {
    dispatch({
      type: "DELETE_POST",
      payload: id,
    });
  };

  const setPosts = (posts) => {
    if (posts.length > 0) {
      dispatch({
        type: "SET_POSTS",
        payload: posts,
      });
    }
  };

  const mutePost = (data) => {
    const muteData = {
      owner: data.owner,
      id: data.id,
      createAt: data.createdAt,
      postId: data.postId,
    };

    if (data.mute) {
      dispatch({
        type: "MUTE_POST",
        payload: muteData,
      });
    } else if (!data.mute) {
      dispatch({
        type: "UNMUTE_POST",
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

  const toggleOpenNewPost = (repost = false) => {
    dispatch({
      type: "OPEN_POST_CARD",
      payload: {
        isOpenNewPost: !isOpenNewPost,
        repost,
      },
    });
  };

  const like = (likeData, postId) => {
    const data = {
      id: likeData.id,
      owner: likeData.owner,
      createdAt: likeData.createdAt,
      displayName: likeData.displayName,
      displayImage: likeData.displayImage,
      colorCode: likeData.colorCode,
    };

    if (likeData.isLike) {
      dispatch({
        type: "LIKE_POST",
        payload: {
          data,
          postId,
        },
      });
    } else if (!likeData.isLike) {
      dispatch({
        type: "UNLIKE_POST",
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
        setPosts,
        setPost,
        loadingData,
        morePosts,
        createPost,
        like,
        deletePost,
        mutePost,
        toggleOpenNewPost,
        setMutedPost,
        subscribePost,
        setSubscribePosts,
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

import React, { createContext, useMemo, useReducer } from "react";
import { cloneDeep } from 'lodash';

const reducer = (state, action) => {
  switch (action.type) {
    case "LOADING_DATA":
      return {
        ...state,
        loading: true,
      };
    case "SET_POSTS":
      let id = action.payload[action.payload.length - 1].id;

      return {
        ...state,
        loading: false,
        posts: action.payload,
        lastId: id,
      };
    case "MORE_POSTS":
      return {
        ...state,
        loading: false,
        posts: [...state.posts, ...action.payload],
        more: action.payload.length === 3,
        lastId: state.posts[state.posts.length - 1].id,
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
    case "MUTE_POST":
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === action.payload.postId) {
            const updatedPosts = {
              ...post,
              muted: [...post.muted, action.payload],
            };
            return updatedPosts;
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
              muted: post.muted.filter((mute) => mute.owner !== action.payload.owner),
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
        repost
      }
    default:
      throw new Error("Don't understand action");
  }
};

export const PostContext = createContext({
  posts: [],
  newPosts: null,
  loading: false,
  lastId: null,
  more: true,
  isOpenNewPost: false,
  repost: false,
  loadingData: () => {},
  setPosts: (posts) => {},
  morePosts: () => {},
  createPost: () => {},
  deletePost: () => {},
  like: () => {},
  mutePost: () => {},
});

const initialState = {
  posts: [],
  more: true,
  newPosts: null,
  loading: null,
  lastId: null,
};

export const PostProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { posts, loading, lastId, more, isOpenNewPost, repost } = state;

  const loadingData = () => {
    dispatch({ type: "LOADING_DATA" });
  };

  const createPost = (post) => {
    dispatch({
      type: "CREATE_POST",
      payload: post,
    });
  };

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
        repost
      }
    })
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
        setPosts,
        loadingData,
        morePosts,
        createPost,
        like,
        deletePost,
        mutePost,
        toggleOpenNewPost,
        loading,
        lastId,
        more,
        isOpenNewPost,
        repost
      }}
      {...props}
    />
  );
};

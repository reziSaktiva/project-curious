import React, { createContext, useReducer } from "react";

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
      return {
        ...state,
        loading: false,
        posts: [action.payload, ...state.posts],
      };
    case "LIKE_POST":
      let likePosts = state.posts.map((post) => {
        if (post.id === action.payload.postId) {
          const updatedPost = {
            ...post,
            likes: [...post.likes, action.payload.data],
            likeCount: post.likeCount + 1,
          };

          return updatedPost;
        }

        return post;
      });
      console.log(likePosts);
      return {
        ...state,
        posts: likePosts
      };
      case "UNLIKE_POST":
      const data = action.payload.data;
      let unlikePosts = state.posts.map((post) => {
        if (post.id === action.payload.postId) {
          const updatedPosts = {
            ...post,
            likes: post.likes.filter((like) => like.owner !== data.owner),
            likeCount: post.likeCount - 1,
          };
          console.log(updatedPosts);
          return updatedPosts;
        }
        return post;
      });
      console.log(unlikePosts);
      return {
        ...state,
        posts: [...unlikePosts]
      };
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
  loadingData: () => {},
  setPosts: (posts) => {},
  morePosts: () => {},
  createPost: () => {},
  like: () => {},
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

  const { posts, loading, lastId, more } = state;

  const loadingData = () => {
    dispatch({ type: "LOADING_DATA" });
  };

  const createPost = (post) => {
    dispatch({
      type: "CREATE_POST",
      payload: post,
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

  const morePosts = (posts) => {
    setTimeout(() => {
      dispatch({
        type: "MORE_POSTS",
        payload: posts,
      });
    }, 2000);
  };

  const like = (likeData, postId) => {
    console.log(postId);
    const data = {
      id: likeData.id,
      owner: likeData.owner,
      createdAt: likeData.createdAt,
      displayName: likeData.displayName,
      displayImage: likeData.displayImage,
      colorCode: likeData.colorCode,
    };

    if (likeData.isLike) {
      console.log('like');
      dispatch({
        type: "LIKE_POST",
        payload: {
          data,
          postId,
        },
      });
    } else if (!likeData.isLike) {
      console.log('unlike');
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
        loading,
        lastId,
        more,
      }}
      {...props}
    />
  );
};

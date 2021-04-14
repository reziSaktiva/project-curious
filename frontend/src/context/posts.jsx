import React, { createContext, useReducer } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOADING_DATA':
      return {
        ...state,
        loading: true
      }
    case 'SET_POSTS':
      let id = action.payload[action.payload.length - 1].id

      return {
        ...state,
        loading: false,
        posts: action.payload,
        lastId: id
      };
    case 'MORE_POSTS':
      return {
        ...state,
        loading: false,
        posts: [...state.posts, ...action.payload],
        more: action.payload.length === 3,
        lastId: state.posts[state.posts.length - 1].id
      };
    case 'CREATE_POST':
      return {
        ...state,
        loading: false,
        posts: [action.payload, ...state.posts] 
      }
    default:
      throw new Error("Don't understand action");
  }
}

export const PostContext = createContext({
  posts: null,
  newPosts: null,
  loading: false,
  lastId: null,
  more: true,
  loadingData: () => { },
  setPosts: (posts) => { },
  morePosts: () => {},
  createPost: () => {},
  like: () => {}
})

const initialState = {
  posts: null,
  more: true,
  newPosts: null,
  loading: null,
  lastId: null
}

export const PostProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const { posts, loading, lastId, more } = state

  const loadingData = () => {
    dispatch({ type: 'LOADING_DATA' })
  }

  const createPost = (post) => {
    dispatch({
      type: 'CREATE_POST',
      payload: post
    })
  }

  const setPosts = (posts) => {
    dispatch({
      type: 'SET_POSTS',
      payload: posts
    })
  }

  const morePosts = (posts) => {
    setTimeout(() => {
      dispatch({
        type: 'MORE_POSTS',
        payload: posts
      })
    }, 2000)
  }

  const like = (id) => {
    dispatch({
      type: 'LIKE_POST',
      payload: id
    })
  }

  return (
    <PostContext.Provider value={{ posts, setPosts, loadingData, morePosts, createPost, like, loading, lastId, more }}
      {...props}
    />
  )
}
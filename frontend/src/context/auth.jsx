// Modules
import React, { useReducer, createContext, useEffect, useMemo } from 'react'
import { useLazyQuery } from '@apollo/client'
import { get } from 'lodash'

// Helper
import { Session } from '../util/Session';
import { auth } from '../util/Firebase'

// Graphql
import { GET_USER_DATA } from '../GraphQL/Queries'

// Constant
import {
    GET_LOCATION,
    SET_NOTIFICATIONS,
    SET_USER_DATA,
    REGISTER_WITH_fACEBOOK,
    LOGOUT,

    LS_LOCATION,
    LS_TOKEN
} from './constant'

const initialState = {
  user: '',
  location: '',
  liked: [],
  notifications: [],
  facebookData: null,
}

const {
    location, user
} = Session({ onLogout: () => {}})

// Reinit Users
initialState.user = user;
initialState.location = location;

export const AuthContext = createContext()

function authReducer(state, action) {
    switch (action.type) {
        case GET_LOCATION:
          return {
              ...state,
              user: {
                  ...state.user,
                  location: action.payload
              }
          }
        case SET_NOTIFICATIONS:
          return {
            ...state,
            notification: action.payload
          }
        case "SET_LIKED_DATA":
          return {
            ...state,
            liked: action.payload,
          }
        case SET_USER_DATA:
            return {
                ...state,
                user: action.payload
            }
        case REGISTER_WITH_fACEBOOK:
            return {
                ...state,
                facebookData: action.payload
            }
        case LOGOUT:
            return {
                ...state,
                user: null
            }
        default:
            return state
    }
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      break;
  }
}

export function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, initialState);
    
    // Check Sessions
    const { token } = Session({ onLogout: logout});
    
    // Mutations
    const [
        loadDataUser,
        { refetch, called, loading, data, error }
    ] = useLazyQuery(GET_USER_DATA);

    useEffect(() => {
        if (token) {
            // do load data user with token from localstorage
            if (!called) {
                return loadDataUser();
            }
    
            return refetch();
        } else {
            // do check session for user login with provider
            auth.onAuthStateChanged((user) => {
                if(user) {
                    if (!called) return loadDataUser();
            
                    return refetch();
                }
    
                return logout();
            })
        }
    }, [token])

    useEffect(() => {
        const hasErrors = error && error.length

        if (hasErrors) logout()

    }, [error]);

    useEffect(() => {
        if (!loading && data && !error) {
            const user = get(data, 'getUserData.user', {});
            const notifications = get(data, 'getUserData.notifications', []);
            const likes = get(data, 'getUserData.liked', []);

            dispatch({
                type: SET_USER_DATA,
                payload: user
            });

            dispatch({
              type: "SET_LIKED_DATA",
              payload: likes,
            });

            dispatch({
                type: SET_NOTIFICATIONS,
                payload: notifications
            })
        }
    }, [loading, data]);

    function getGeoLocation(position) {
        const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }

        localStorage.setItem(LS_LOCATION, JSON.stringify(location))

        dispatch({
            type: GET_LOCATION,
            payload: location
        })
    }

    function login(userData) {
        navigator.geolocation.getCurrentPosition(getGeoLocation, showError)

        localStorage.setItem(LS_TOKEN, userData)

        dispatch({
            type: SET_USER_DATA,
            payload: userData
        })
    }

    function loadFacebookData(facebookData) {
        dispatch({
            type: REGISTER_WITH_fACEBOOK,
            payload: facebookData
        })
    }

    function logout() {
        dispatch({ type: LOGOUT })
    }

    const authProps = useMemo(() => ({
        user: state.user,
        facebookData: state.facebookData,
        login, logout, loadFacebookData // functions context
    }), [state])

    return (
        <AuthContext.Provider value={authProps} {...props} />
    )
}

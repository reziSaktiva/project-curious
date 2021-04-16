import React, { useReducer, createContext, useEffect } from 'react'
import jwtDecode from 'jwt-decode'
import { get } from 'lodash'

import { useLazyQuery } from '@apollo/client'

import { GET_USER_DATA } from '../GraphQL/Queries'

const initialState = {
    user: null,
    facebookData: null,
    notification: []
}

if (localStorage.token) {
    const decodedToken = jwtDecode(localStorage.getItem('token'))

    console.log(decodedToken);

    if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("location")
    } else {
        initialState.user = decodedToken
        initialState.user.location = JSON.parse(localStorage.getItem("location"))
    }
}

export const AuthContext = createContext({
    user: null,
    facebookData: null,
    login: (userData) => { },
    loadFacebookData: (facebookData) => { },
    logout: () => { }
})

function authReducer(state, action) {
    switch (action.type) {
        case 'GET_LOCATION':
            return {
                ...state,
                user: {
                    ...state.user,
                    location: action.payload
                }
            }
        case 'SET_NOTIFICATIONS':
            return {
                ...state,
                notification: action.payload
            }
        case 'SET_USER_DATA':
            return {
                ...state,
                user: action.payload
            }
        case 'REGISTER_WITH_fACEBOOK':
            return {
                ...state,
                facebookData: action.payload
            }
        case 'LOGOUT':
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
    const [
        loadDataUser,
        { refetch, called, loading, data, error }
    ] = useLazyQuery(GET_USER_DATA);

    useEffect(() => {
        if (!called) {
            return loadDataUser();
        }

        return refetch();
    }, [])

    useEffect(() => {
        const hasErrors = error && error.length

        if (hasErrors) {
            console.log('should do redirect to login page')
        }
    }, [error]);

    useEffect(() => {
        if (!loading && data && !error) {
            const user = get(data, 'getUserData.user');
            const notifications = get(data, 'getUserData.notifications');

            dispatch({
                type: 'SET_USER_DATA',
                payload: user
            });

            dispatch({
                type: 'SET_NOTIFICATIONS',
                payload: notifications
            })
        }
    }, [loading, data]);

    function getGeoLocation(position) {
        const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }

        localStorage.setItem('location', JSON.stringify(location))

        dispatch({
            type: 'GET_LOCATION',
            payload: location
        })
    }

    function login(userData) {
        navigator.geolocation.getCurrentPosition(getGeoLocation, showError)

        localStorage.setItem('token', userData.token)

        dispatch({
            type: 'SET_USER_DATA',
            payload: userData
        })
    }

    function loadFacebookData(facebookData) {
        dispatch({
            type: 'REGISTER_WITH_fACEBOOK',
            payload: facebookData
        })
    }

    function logout() {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("location")
        dispatch({ type: "LOGOUT" })
    }

    return (
        <AuthContext.Provider
            value={{ user: state.user, facebookData: state.facebookData, login, logout, loadFacebookData }}
            {...props}
        />
    )
}
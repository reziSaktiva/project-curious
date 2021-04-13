import React, { createContext, useEffect, useReducer } from 'react'

import jwtDecode from 'jwt-decode'

const initialState = {
    user: null,
    facebookData: null
}

if (localStorage.token) {
    /*
        - 2nd solution is to call the login query again on this function so the query will return all the data needed
        flow: reload -> query login with token -> return data -> update context with current result

        - the caveats for 1st solution is even with stale token hacker (if they got access to browser storage/cookies) then can steal sensitive information so be carefull on what u put inside the token.

        NOTE: as far as i know the backend should use firebase-admin instead of firebase since the purpose of firebase lib is for client
        there is a few method that doesnt exist on each lib.
    */
    
    const decodedToken = jwtDecode(localStorage.getItem('token'))
    // 2nd solution (better) -> flow -> getMyProfile -> updateContext
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
    useEffect(() => {
        // Above code to check the token / login
    }, [
        // Dependencies for determine whether should rerender or not
    ]);

    const [state, dispatch] = useReducer(authReducer, initialState);
    
    // example use state for updating context
    // const [user, updateUser] = useState('');

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

            // value={{user: user, updateUser: updateUser}}
            value={{ user: state.user, facebookData: state.facebookData, login, logout, loadFacebookData }}
            {...props}
        />
    )
}
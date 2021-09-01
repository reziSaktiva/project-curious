// Modules
import React, { useReducer, createContext, useEffect, useMemo } from "react";
import Geocode from 'react-geocode'
import { useLazyQuery } from "@apollo/client";
import { get } from "lodash";

// Helper
import { Session } from "../util/Session";
import { auth } from "../util/Firebase";

// Graphql
import { GET_USER_DATA } from "../GraphQL/Queries";

// Constant
import {
  GET_LOCATION,
  SET_NOTIFICATIONS,
  SET_USER_DATA,
  REGISTER_WITH_fACEBOOK,
  REGISTER_WITH_GOOGLE,
  LOGOUT,
  LS_LOCATION,
  LS_TOKEN,
  NOTIFICATION_READ,
  NOTIFICATIONS_READ,
  SET_PROFILE_PICTURE,
  SET_ROOM,
  NOTIFICATION_ADDED,
  LOGIN_LOADER
} from "./constant";

const initialState = {
  user: "",
  location: "",
  liked: [],
  notifications: [],
  locationEP: null,
  room: null,
  facebookData: null,
  googleData: null,
  pathname: '',
  loginLoader: false
};

const { location, user } = Session({ onLogout: () => { } });

// Reinit Users
initialState.user = user;
initialState.location = location ? location : '';

export const AuthContext = createContext();

function authReducer(state, action) {
  switch (action.type) {
    case GET_LOCATION:
      return {
        ...state,
        user: {
          ...state.user,
          location: action.payload,
        },
      };
    case "SET_EP_LOCATION":
      return {
        ...state,
        locationEP: action.payload
      }
    case SET_PROFILE_PICTURE:
      return {
        ...state,
        user: {
          ...state.user,
          profilePicture: action.payload
        }
      }
    case SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };
    case LOGIN_LOADER:
      return {
        ...state,
        loginLoader: action.payload,
      }
    case "SET_LIKED_DATA":
      return {
        ...state,
        liked: action.payload,
      };
      case "SET_LOCATION_ALLOW":
      return {
        ...state,
        locationAllow: action.payload,
      };
    case "CLEAR_ALL_NOTIFICATIONS":
      return {
        ...state,
        notifications: []
      }
    case SET_USER_DATA:
      return {
        ...state,
        user: action.payload,
      };
    case REGISTER_WITH_fACEBOOK:
      return {
        ...state,
        facebookData: action.payload,
      };
    case REGISTER_WITH_GOOGLE:
      return {
        ...state,
        googleData: action.payload,
      };
    case SET_ROOM:
      return {
        ...state,
        room: action.payload === "Nearby" ? null : action.payload
      }
    case LOGOUT:
      return {
        ...state,
        user: null,
      };
    case NOTIFICATION_ADDED:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      }
    case NOTIFICATIONS_READ:
      return {
        ...state,
        notifications: action.payload
      }
    case NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map((notif) => {
          if (notif.id === action.payload.id) {
            const updatedPosts = {
              ...notif,
              read: true,
            };
            return updatedPosts;
          }

          return notif;
        })
      }
    case "SET_PATHNAME":
      return {
        ...state,
        pathname: action.payload
      }
    default:
      return state;
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
  const { token } = Session({ onLogout: logout });

  const { user, facebookData, googleData, liked, notifications, room, pathname, loginLoader, locationEP, locationAllow } = state

  // Mutations
  const [
    loadDataUser,
    { refetch, called, loading, data, error },
  ] = useLazyQuery(GET_USER_DATA);

  useEffect(() => {
    if (token) {
      if (!called) {
        return loadDataUser();
      }

      return refetch();
    } else {
      // do check session for user login with provider
      auth.onAuthStateChanged((user) => {
        if (user) {
          if (!called) return loadDataUser();

          return refetch();
        }

        return logout();
      });
    }
  }, [token]);

  useEffect(() => {
    const hasErrors = error && error.length;

    if (hasErrors) logout();
  }, [error]);

  useEffect(() => {
    if (!loading && data && !error) {
      const user = get(data, "getUserData.user", {});
      const notifications = get(data, "getUserData.notifications", []);
      const likes = get(data, "getUserData.liked", []);

      dispatch({
        type: SET_USER_DATA,
        payload: user,
      });

      dispatch({
        type: "SET_LIKED_DATA",
        payload: likes,
      });
      

      dispatch({
        type: SET_NOTIFICATIONS,
        payload: notifications,
      });
    }
  }, [loading, data]);

  function setLocationEP(location) {
    dispatch({
      type: "SET_EP_LOCATION",
      payload: location
    })
  }

  function clearNotifications() {
    dispatch({
      type: "CLEAR_ALL_NOTIFICATIONS"
    })
  }

  async function getGeoLocation(position) {
    const data = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    const location = await Geocode.fromLatLng(data.lat, data.lng).then(
      (response) => {
        const address = response.results[0].address_components[1].short_name;
        return address
      },
      (error) => {
        console.error(error);
      }
    );

    localStorage.setItem(LS_LOCATION, JSON.stringify({
      ...data,
      location
    }));
    setLocationAllow(true)

    dispatch({
      type: GET_LOCATION,
      payload: {
        ...data,
        location
      },
    });
  }

  function setRoom(room) {
    dispatch({
      type: SET_ROOM,
      payload: room
    })
  }
  function setLocationAllow(location){
   dispatch({
    type: "SET_LOCATION_ALLOW",
    payload: location,
    })
  };

  function setLoginLoader(loginLoader) {
    dispatch({
      type: LOGIN_LOADER,
      payload: loginLoader
    })
  }

  function changeProfile(data) {
    // dispatch({
    //   type: SET_PROFILE_PICTURE,
    //   payload: url
    // })
    console.log(data);
  }

  function login(token) {
    navigator.geolocation.getCurrentPosition(getGeoLocation, showError);

    localStorage.setItem(LS_TOKEN, token);
  }

  function loadFacebookData(facebookData) {
    dispatch({
      type: REGISTER_WITH_fACEBOOK,
      payload: facebookData,
    });
  }

  function loadGoogleData(googleData) {
    dispatch({
      type: REGISTER_WITH_GOOGLE,
      payload: googleData,
    });
  }

  function notificationRead(data) {
    dispatch({
      type: NOTIFICATION_READ,
      payload: data
    })
  }

  function readAllNotificatons(data) {
    dispatch({
      type: NOTIFICATIONS_READ,
      payload: data
    })
  }

  function notificationAdded(notification) {
    dispatch({
      type: NOTIFICATION_ADDED,
      payload: notification
    })
  }

  function logout() {
    dispatch({ type: LOGOUT });
  }

  function setPathname(pathname) {
    dispatch({
      type: "SET_PATHNAME",
      payload: pathname
    })
  }

  const authProps = useMemo(
    () => ({
      user,
      facebookData,
      googleData,
      liked,
      notifications,
      room,
      pathname,
      loginLoader,
      locationEP,
      locationAllow,
      setLocationEP,
      setLoginLoader,
      setRoom,
      setLocationAllow,
      notificationAdded,
      setPathname,
      clearNotifications,
      changeProfile,
      notificationRead,
      readAllNotificatons,
      login,
      logout,
      loadFacebookData, // functions context
      loadGoogleData
    }),
    [state]
  );

  return <AuthContext.Provider value={authProps} {...props} />;
}

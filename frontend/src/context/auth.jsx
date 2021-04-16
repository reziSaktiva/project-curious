import React, { useReducer, createContext, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { useLazyQuery } from "@apollo/client";
import { GET_USER_DATA } from "../GraphQL/Queries";

const initialState = {
  user: null,
  liked: null,
  notifications: null,
  facebookData: null,
};

export const AuthContext = createContext({
  user: null,
  liked: null,
  notifications: null,
  facebookData: null,
  login: (token) => {},
  loadFacebookData: (facebookData) => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case "GET_LOCATION":
      return {
        ...state,
        location: action.payload,
      };
    case "SET_USER_DATA":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_LIKED_DATA":
      return {
        ...state,
        liked: action.payload,
      };
    case "SET_NOTIFICATIONS_DATA":
      return {
        ...state,
        notifications: action.payload,
      };
    case "REGISTER_WITH_fACEBOOK":
      return {
        ...state,
        facebookData: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
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
  const [userData, { called, loading, data }] = useLazyQuery(GET_USER_DATA);

  useEffect(() => {
    if (data && !loading) {
      dispatch({
        type: "SET_USER_DATA",
        payload: data.getUserData.user,
      });
      dispatch({
        type: "SET_LIKED_DATA",
        payload: data.getUserData.liked,
      });
      dispatch({
        type: "SET_NOTIFICATIONS_DATA",
        payload: data.getUserData.notifications,
      });
    }
  }, [data, loading]);

  useEffect(() => {
    if (localStorage.token) {
      const decodedToken = jwtDecode(localStorage.getItem("token"));

      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("location");
      } else {
        userData();
      }
    }
  }, []);

  function login(token) {
    navigator.geolocation.getCurrentPosition(getGeoLocation, showError);

    localStorage.setItem("token", token);
    userData();
  }

  function loadFacebookData(facebookData) {
    dispatch({
      type: "REGISTER_WITH_fACEBOOK",
      payload: facebookData,
    });
  }

  function getGeoLocation(position) {
    const location = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    localStorage.setItem("location", JSON.stringify(location));
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("location");
    dispatch({ type: "LOGOUT" });
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        facebookData: state.facebookData,
        login,
        logout,
        loadFacebookData,
      }}
      {...props}
    />
  );
}

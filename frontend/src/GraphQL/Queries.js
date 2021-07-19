import { gql } from "@apollo/client";
import { postDetailFragment, userDataFragment } from './Fragment'

export const GET_POSTS = gql`
  query getPostNearby($lat: Float, $lng: Float, $range: Float) {
    getPosts(lat: $lat, lng: $lng, range: $range) {
      ...PostDetail
    }
  }
  ${postDetailFragment}
`;

export const GET_ROOM_POSTS = gql`
  query getPosts($room: String!) {
    getRoomPosts(room:$room){
      ...PostDetail
    }
  }
  ${postDetailFragment}
`;

export const GET_POPULAR_POSTS = gql`
  query getPosts($lat: Float, $lng: Float $range: Float) {
    getPopularPosts(lat: $lat, lng: $lng range: $range) {
      ...PostDetail
    }
  }
  ${postDetailFragment}
`;

export const GET_MUTED_POSTS = gql`
query {
  mutedPosts {
      ...PostDetail
    }
  }
  ${postDetailFragment}
`;

export const GET_SUBSCRIBED_POSTS = gql`
query {
  getSubscribePosts {
      ...PostDetail
    }
  }
  ${postDetailFragment}
`;

export const GET_PROFILE_POSTS = gql`
  query {
    getProfilePosts {
      ...PostDetail
    }
  }
  ${postDetailFragment}
`;

export const GET_PROFILE_LIKED_POSTS = gql`
query{
  getProfileLikedPost {
      ...PostDetail
    }
  }
  ${postDetailFragment}
`;

export const GET_POST = gql`
query getPost($id: ID! $room: String){
  getPost(id: $id, room: $room) {
      ...PostDetail
    }
  }
  ${postDetailFragment}
`;

export const GET_POSTS_BASED_ON_NEAREST_LOC = gql`
  query GetNearby($lat: String, $lng: String) {
    getPostBasedOnNearestLoc(lat: $lat, lng:$lng) {
      ...PostDetail
    }
  }
  ${postDetailFragment}
`;

export const GET_USER_DATA = gql`
  query {
    getUserData {
      ...UserData
    }
  }
  ${userDataFragment}
`;

export const GET_VISITED = gql`
  query GetVisited {
    getVisited {
      administrative_area_level_1
      administrative_area_level_2
      administrative_area_level_3
      administrative_area_level_4
      country
      location {
        lat
        lng
      }
    }
  }
`;

import { useContext, useEffect } from "react";
import { get } from "lodash";
import { useQuery } from "@apollo/client";
import PostCard from "../components/PostCard";
import InfiniteScroll from "../components/InfiniteScroll";

import { GET_POSTS_BASED_ON_NEAREST_LOC } from "../GraphQL/Queries";
import { AuthContext } from "../context/auth";

const NearbyPost = (props) => {
  const { user } = useContext(AuthContext)
  const lat = JSON.parse(localStorage.location).lat;
  const lng = JSON.parse(localStorage.location).lng;

  const { data, loading: loadingPosts } = useQuery(
    GET_POSTS_BASED_ON_NEAREST_LOC,
    {
      variables: { lat: lat.toString(), lng: lng.toString() },
    }
  );

  const posts = get(data, "getPostBasedOnNearestLoc") || [];

  if (loadingPosts) return <div>loading...</div>;

  return (
    <div>
      <InfiniteScroll isLoading={loadingPosts}>
        {!posts
          ? null
          : posts.map((post, key) => {
              return user &&
                post.muted.find((mute) => mute.owner === user.username) ? (
                <div key={`posts${post.id} ${key}`}></div>
              ) : (
                <div key={`posts${post.id} ${key}`}>
                  <PostCard post={post} loading={loadingPosts} />
                </div>
              );
            })}
      </InfiniteScroll>
    </div>
  );
};

export default NearbyPost;

import React from 'react'
import InfiniteScroll from "../../components/InfiniteScroll";
import PostCard from "../../components/PostCard/index";

export default function LikedPosts({likedPosts, loading}) {
    return (
        <div>
            <InfiniteScroll profile={"likedPosts"}>{
                likedPosts.map((post, key) => {
                    return (
                        post && (
                            <div key={`posts${post.id} ${key}`}>
                                <PostCard post={post} type='liked_posts' loading={loading} />
                            </div>
                        )
                    );
                })
            }</InfiniteScroll>
        </div>
    )
}

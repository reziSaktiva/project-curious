import React, { useContext, useEffect, useRef } from 'react'
import { useQuery } from '@apollo/client'
import PostCard from '../../components/PostCard'
import SkeletonLoading from '../../components/SkeletonLoading'
import { MORE_FOR_YOU } from '../../GraphQL/Queries'
import InfiniteScroll from '../../components/InfiniteScroll'
import { PostContext } from '../../context/posts'

export default function MoreForYou() {
    const _isMounted = useRef(false);

    const { data, loading: loadingPosts } = useQuery(MORE_FOR_YOU)
    const { posts, setPosts, loadingData, setNav } = useContext(PostContext)

    useEffect(() => {
        setNav('moreForYou')
    }, [])

    useEffect(() => {
        if (!_isMounted.current && data) { // check if doesn't fetch data
            if (!data) {
                loadingData();

                return;
            }

            setPosts(data.moreForYou)

            // set did mount react
            _isMounted.current = true;

            return;
        }
    }, [data, _isMounted])

    return (
        <>
            <div className="popular-section__header">
                <h3>More For You</h3>
                <span>The most popular posts around the world</span>
            </div>
            <br />
            <InfiniteScroll isLoading={loadingPosts}>
            {
                loadingPosts ? <SkeletonLoading /> : posts ? posts.map((post, key) => {
                     return(
                        <div key={`more for you posts${key}`} style={key === 0 ? { marginTop: 16, marginLeft:-15 }: { marginTop: 0,marginLeft:-15 }} >
                            <PostCard post={post} type="nearby" loading={loadingPosts} />
                        </div>
                    )
                }) : <p>postingan tidak di temukan</p>
            }
            </InfiniteScroll>
        </>
    )
}

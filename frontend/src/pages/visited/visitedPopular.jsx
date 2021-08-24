import React, { useContext, useEffect, useRef } from 'react'

import { useLazyQuery } from '@apollo/client'
import { GET_POPULAR_POSTS } from '../../GraphQL/Queries'
import { PostContext } from '../../context/posts'

import InfiniteScroll from '../../components/InfiniteScroll'
import PostCard from '../../components/PostCard/index'
import { AuthContext } from '../../context/auth'

import SkeletonLoading from '../../components/SkeletonLoading'

//gambar
import Radius from '../../assets/no_post.png'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'


export default function VisitedPopular({ postsLocation }) {
    const history = useHistory().location.pathname
    

    const _isMounted = useRef(false);

    const { posts, setPosts, loadingData, loading } = useContext(PostContext)
    const { user, setPathname } = useContext(AuthContext)

    useEffect(() => {
        if (postsLocation) {
            setPathname(history)
        }
    }, [postsLocation])

    

    const [getPosts, { data, loading: loadingPosts }] = useLazyQuery(GET_POPULAR_POSTS, {
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        getPosts({ variables: { ...postsLocation, range: 5 } });
    }, []);

    useEffect(() => {
        if (!_isMounted.current && data) { // check if doesn't fetch data
            if (!data) {
                loadingData();

                return;
            }
            setPosts(data.getPopularPosts)

            // set did mount react
            _isMounted.current = true;

            return;
        }
    }, [data, _isMounted])

    return (
        <div style={{ height: "100%" }}>
            {user ? (<InfiniteScroll isLoading={loadingPosts} visitedLocation={postsLocation}>
                {!_isMounted.current && <SkeletonLoading />}
                {(_isMounted.current && !loading && !posts.length) ? (
                    <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', flexDirection: "column" }}>
                        <img src={Radius} style={{ width: 300 }} />
                        <h4 style={{ textAlign: 'center' }}>There is no Nearby post around you</h4>
                        <h4 style={{ textAlign: 'center' }}>be the first to post in your area!</h4>
                        <h4 style={{ textAlign: 'center' }}>or change your location to see other post around</h4>
                    </div>
                )
                    : posts.map((post, key) => {
                        const { muted, id } = post;
                        const isMuted = user && muted && muted.find((mute) => mute.owner === user.username)
                        return (
                            <div key={`posts${id} ${key}`} style={key === 0 ? { marginTop: 16 } : { marginTop: 0 }} >
                                {!isMuted && <PostCard post={post} type="nearby" loading={loading} />}
                            </div>
                        )
                    })}
            </InfiniteScroll>) : null}
        </div>
    )
}
import React, { useContext, useEffect, useRef } from 'react'

import { useLazyQuery, useQuery } from '@apollo/client'
import { GET_POSTS } from '../GraphQL/Queries'
import { PostContext } from '../context/posts'

import InfiniteScroll from '../components/InfiniteScroll'
import PostCard from '../components/PostCard'
import { AuthContext } from '../context/auth'
import NavBar from '../components/NavBar'

import { getSession, getRangeSearch } from '../util/Session';


function Home() {
    const _isMounted = useRef(false);
    const { posts, setPosts, loadingData, loading } = useContext(PostContext)
    const { user } = useContext(AuthContext)

    const { location } = getSession();
    const range = getRangeSearch();

    const [ getPosts, { data, loading: loadingPosts }] = useLazyQuery(GET_POSTS, {
        fetchPolicy: "network-only"
      });
    
    useEffect(() => {
        if (Object.keys(location).length) {
            const loc = JSON.parse(location);

            getPosts({ variables: { ...loc, range: range ? parseFloat(range) : undefined } });
        }
    }, [location]);

    useEffect(() => {
        if (!_isMounted.current && data) { // check if doesn't fetch data
            if (!data) {
                loadingData();

                return;
            }

            setPosts(data.getPosts)
            
            // set did mount react
            _isMounted.current = true;

            return;
        }
    }, [data, _isMounted])

    return (
        <div>
            <NavBar />
            {user ? (<InfiniteScroll isLoading={loadingPosts}>
                {!posts.length ? (<p>tidak ada postingan di sekitar anda</p>)
                    : posts.map((post, key) => {
                        const { muted, id } = post;
                        const isMuted = user && muted && muted.find((mute) => mute.owner === user.username)
                        
                        return (
                            <div key={`posts${id} ${key}`}>
                                {!isMuted && <PostCard post={post} loading={loading} />}
                            </div>
                        )
                    })}
            </InfiniteScroll>) : null}
        </div>
    );
}

export default Home



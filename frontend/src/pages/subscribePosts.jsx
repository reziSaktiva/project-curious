import React, { useContext, useEffect, useRef } from 'react'

import { useQuery } from '@apollo/client'
import { GET_SUBSCRIBED_POSTS } from '../GraphQL/Queries'
import { PostContext } from '../context/posts'

import PostCard from '../components/PostCard/index'
import { AuthContext } from '../context/auth'
import NavBar from '../components/NavBar'
import SkeletonLoading from '../components/SkeletonLoading'
import Radius from '../assets/Radius.jpg'

function SubscribePosts() {
    const { data } = useQuery(GET_SUBSCRIBED_POSTS, {
        fetchPolicy: "network-only"
      });

    const _isMounted = useRef(false);
    const { subscribePosts, setSubscribePosts, loadingData, loading } = useContext(PostContext)
    const { user } = useContext(AuthContext)

    useEffect(() => {
        if (!_isMounted.current && data) { // check if doesn't fetch data
            if (!data) {
                loadingData();

                return;
            }

            setSubscribePosts(data.getSubscribePosts)
            
            // set did mount react
            _isMounted.current = true;

            return;
        }
    }, [data, _isMounted])

    return (
        <div>
            <NavBar />
            {user ? (<div>
                {!subscribePosts || subscribePosts.length ? (
                <div className="centeringButton">
                <img src={Radius} style={{ width: 300}} />
                <h4 style={{textAlign: 'center'}}>Subcribe to a Post that goes fire</h4>
                <h4 style={{textAlign: 'center'}}>So you will get an Update on Notification</h4>
                <h4 style={{textAlign: 'center'}}>and never miss what's happening</h4>
            </div>
                )
                    : subscribePosts.map((post, key) => post === null ? (<SkeletonLoading />) : (
                        <div key={`posts${post.id} ${key}`}>
                            {console.log("true")}
                        <PostCard post={post} loading={loading} />
                    </div>
                ))}
            </div>) : <SkeletonLoading />}
        </div>
    );
}

export default SubscribePosts
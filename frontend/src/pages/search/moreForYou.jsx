import { useQuery } from '@apollo/client'
import React from 'react'
import PostCard from '../../components/PostCard'
import SkeletonLoading from '../../components/SkeletonLoading'
import { MORE_FOR_YOU } from '../../GraphQL/Queries'

export default function MoreForYou() {
    const { data, loading } = useQuery(MORE_FOR_YOU)

    return (
        <>
            <div className="popular-section__header">
                <h3>More For You</h3>
                <span>The most popular posts around the world</span>
            </div>
            <br />
            {
                loading ? <SkeletonLoading /> : data ? data.moreForYou.map((post, key) => {
                     return(
                        <div key={`more for you posts${key}`} style={key == 0 ? { marginTop: 16 }: { marginTop: 0 }} >
                            <PostCard post={post} type="moreForYou" loading={loading} />
                        </div>
                    )
                }) : <p>postingan tidak di temukan</p>
            }
        </>
    )
}

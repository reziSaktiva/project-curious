import React, { useContext } from 'react'
import { Button, Col } from 'antd';
import { useQuery } from '@apollo/client';
import { EXPLORE_PLACE } from '../../GraphQL/Queries';
// import SkeletonLoading from '../../components/SkeletonLoading';
import MoreForYou from './moreForYou';
import SearchSkeleton from './SearchSkleleton';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { AuthContext } from '../../context/auth';
import { PostContext } from '../../context/posts';

export default function ExplorePlace() {
    const { setLocationEP } = useContext(AuthContext)
    const { setNav, active } = useContext(PostContext)
    const { data, loading } = useQuery(EXPLORE_PLACE)
 
    return loading ? <SearchSkeleton /> : (
        <>
            <div className="explore-place" >
                <span className="title">Explore Place</span>
                <div className="list-place" style={{overflowX: 'scroll'}}>
                    {data &&
                        data.explorePlace.map(data => {
                            return (<Col lg={8} xs={9}>
                                <div onClick={() => {
                                    setLocationEP(data.location)
                                    if(!active || active === "moreForYou"){
                                        setNav("latest")
                                    }
                                }}>
                                    <Link to={`/explore/${data.administrative_area_level_3}`} >
                                        <img className="item-place__image" src={data.photo_reference} />
                                        <span className="item-place__title">{data.administrative_area_level_3}</span>
                                    </Link>
                                </div>
                            </Col>)
                        })
                    }
                </div>
            </div>

            <div className="popular-section">
                <MoreForYou />
            </div>
        </>
    )
}

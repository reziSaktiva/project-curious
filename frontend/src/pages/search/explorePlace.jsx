import React from 'react'
import { Col } from 'antd';
import { useQuery } from '@apollo/client';
import { EXPLORE_PLACE } from '../../GraphQL/Queries';
import SkeletonLoading from '../../components/SkeletonLoading';

import MoreForYou from './moreForYou';


export default function ExplorePlace() {
    const { data, loading, errors } = useQuery(EXPLORE_PLACE)
    console.log(data);


    
    return loading ? <SkeletonLoading /> : (
        <>
            <div className="explore-place">
                <span className="title">Explore Place</span>
                <div className="explore-place__btn-more">More</div>
                <div className="list-place">
                    {data &&    
                       data.explorePlace.map(data => {
                        return (<Col lg={8} xs={9}>
                                        <img className="item-place__image" src="https://i.pinimg.com/originals/40/fa/a6/40faa6ee309d8a420f54f6420fd28955.jpg" />
                                        <span className="item-place__title">{data.administrative_area_level_3}</span>
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

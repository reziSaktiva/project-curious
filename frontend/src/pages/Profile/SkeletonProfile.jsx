import { Skeleton } from 'antd';
import React from 'react';
import SkeletonLoading from '../../components/SkeletonLoading';
import './style.css'
export default function SkeletonProfile() {
    return (
        <div className="profile__skeleton" style={{marginTop: 16}}>
        <Skeleton.Avatar active   size={80} style={{marginBottom: 16}} />
        <Skeleton.Input active style={{ width: 300, height: 20, marginBottom: 16 }}/>
        <Skeleton.Input active style={{ width: 300, height: 20, marginBottom: 16 }}/>

        <div className="grid__skeleton" style={{marginBottom: 16}}>
        <Skeleton.Input active className="centering-skeleton" style={{ width: 80, height: 20 }}/>
        <Skeleton.Input active className="centering-skeleton" style={{ width: 80, height: 20 }}/>
        <Skeleton.Input active className="centering-skeleton" style={{ width: 80, height: 20 }}/>
        </div>

        <div className="grid__skeleton" style={{marginBottom: 16, }}>
        <p className="centering-skeleton" >Post</p>
        <p className="centering-skeleton">Repost</p>
        <p className="centering-skeleton">Likes</p>
        </div>

        <Skeleton.Input active  style={{ width: 200, height: 20, marginBottom: 26 }}/>

        <div className="grid__skeleton" style={{marginBottom: 16}}>
        <Skeleton.Input active className="centering-skeleton" style={{ width: 50, height: 20 }}/>
        <Skeleton.Input active className="centering-skeleton" style={{ width: 50, height: 20 }}/>
        <Skeleton.Input active className="centering-skeleton" style={{ width: 50, height: 20 }}/>
        </div>

        <Skeleton avatar active paragraph={{ rows: 2 }} />
        <Skeleton avatar active paragraph={{ rows: 2 }} />
        <Skeleton avatar active paragraph={{ rows: 2 }} />
        </div>
    )
}
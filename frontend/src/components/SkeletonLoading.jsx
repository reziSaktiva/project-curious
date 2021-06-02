import { Space, Skeleton } from 'antd'
import React from 'react'

export default function SkeletonLoading() {

  return(
    <div style={{ width: window.isMobile ? '200px' : '500px', margin: 20}}>
    <Skeleton active  avatar paragraph={{ rows: 2 }} />
    <Skeleton active  avatar paragraph={{ rows: 2 }} />
    <Skeleton active  avatar paragraph={{ rows: 2 }} />
    <Skeleton active  avatar paragraph={{ rows: 2 }} />
    <Skeleton active  avatar paragraph={{ rows: 2 }} />
    <Skeleton active  avatar paragraph={{ rows: 2 }} />
    <Skeleton active  avatar paragraph={{ rows: 2 }} />
    <Skeleton active  avatar paragraph={{ rows: 2 }} />
    </div>
  )


}
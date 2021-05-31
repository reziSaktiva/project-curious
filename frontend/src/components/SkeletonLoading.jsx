import { Space, Skeleton } from 'antd'
import React from 'react'

export default function SkeletonLoading() {

  return(
    <div style={{ width: window.isMobile ? '200px' : '500px'}}>
    <Skeleton avatar paragraph={{ rows: 2 }} />
    <Skeleton avatar paragraph={{ rows: 2 }} />
    <Skeleton avatar paragraph={{ rows: 2 }} />
    <Skeleton avatar paragraph={{ rows: 2 }} />
    </div>
  )


}
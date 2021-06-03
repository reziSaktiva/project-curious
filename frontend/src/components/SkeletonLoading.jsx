import { Skeleton } from 'antd'
import React from 'react'

export default function SkeletonLoading() {

  return(
    <div style={{ margin: 20}}>
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
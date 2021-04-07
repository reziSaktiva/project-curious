import React from 'react'
import { AuthProvider } from './auth'
import { PostProvider } from './posts'

export default function Context(props) {
    return (
        <div>
            <AuthProvider>
                <PostProvider {...props} />
            </AuthProvider>
        </div>
    )
}

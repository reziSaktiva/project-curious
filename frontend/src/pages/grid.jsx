import React, { useContext } from 'react'
import { AuthContext } from '../context/auth'
import Sidebar from '../components/Sidebar'
import Notification from '../components/Notification'
import AddPosts from '../components/AddPost'

export default function Grid({ children }) {
    const { user } = useContext(AuthContext)

    if (user) {
        return (
            <div className="ui internally celled grid container" >
                <div className="row">
                    <div className="four wide column">
                        <Sidebar />
                    </div>
                    <div className="eight wide column">
                        {children}
                    </div>
                    <div className="four wide column">
                        <Notification />
                        <AddPosts />
                    </div>
                </div>
            </div>
        )
    } else return <div>{children}</div>
}

import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import Notification from '../components/Notification'
import AddPosts from '../components/AddPost'
import { AuthContext } from '../context/auth'

export default function Grid({ children }) {
    const { user } = useContext(AuthContext)

    if (user) {
        return (
            <div className="ui internally celled grid container" >
                <div className="row">
                    <div className="four wide column">
                        {user && <Sidebar />}
                    </div>
                    <div className="eight wide column">
                        {children}
                    </div>
                    <div className="four wide column">
                        {user && <Notification />}
                        {user && <AddPosts />}
                    </div>
                </div>
            </div>
        )
    } else return <div>{children}</div>
}

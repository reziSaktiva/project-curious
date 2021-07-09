import React from 'react'
import { Route, Redirect } from 'react-router-dom'

function UserRoute({ component: Component, ...rest }) {
    const user = localStorage.token

    return (
        <Route
            {...rest}
            render={props =>
                !user ? <Redirect to='/' /> : <Component {...props} />
            }
        />
    )
}

export default UserRoute;
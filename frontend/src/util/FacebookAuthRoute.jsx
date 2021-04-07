import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { AuthContext } from '../context/auth'

function FacebookAuthRoute({ component: Component, ...rest }) {
    const { facebookData } = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={props =>
                !facebookData ? <Redirect to='/' /> : <Component {...props} />
            }
        />
    )
}

export default FacebookAuthRoute;
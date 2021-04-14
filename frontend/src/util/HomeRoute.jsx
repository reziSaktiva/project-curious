import React, { useContext } from 'react'
import { Route } from 'react-router-dom'
import home from '../pages/home';

import { AuthContext } from '../context/auth'

function HomeRoute({ component: Component, ...rest }) {
    const { user } = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={props =>
                user ? <Route exact path="/" component={home} /> : <Component {...props} />
            }
        />
    )
}

export default HomeRoute;
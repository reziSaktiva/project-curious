import React from 'react'
import { Route } from 'react-router-dom'
import nearby from '../pages/Home/nearby';

function HomeRoute({ component: Component, ...rest }) {
    const user = localStorage.token

    return (
        <Route
            {...rest}
            render={props =>
                user ? <Route exact path="/" component={nearby} /> : <Component {...props} />
            }
        />
    )
}

export default HomeRoute;
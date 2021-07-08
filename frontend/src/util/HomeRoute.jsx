import React from 'react'
import { Route } from 'react-router-dom'
import home from '../pages/home';

function HomeRoute({ component: Component, ...rest }) {
    const user = localStorage.token

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
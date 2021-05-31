import React from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import 'antd/dist/antd.css'
import 'semantic-ui-css/semantic.min.css'
import './App.css';

import Context from './context/Context'
import AuthRoute from './util/AuthRoute'
import UserRoute from './util/UserRoute'
import HomeRoute from './util/HomeRoute'
import FacebookAuthRoute from './util/FacebookAuthRoute'
import GoogleAuthRoute from './util/GoogleAuthRoute'

// Importing Pages & Components
import login from './pages/login';
import register from './pages/register';
import map from './pages/map/index'

import RegisterFacebook from './pages/registerFacebook';
import RegisterGoogle from './pages/registerGoogle';
import LandingPage from './pages/landingPage';
import Grid from './pages/grid';
import SinglePost from './pages/detailPost';
import Nearby from './pages/nearby';
import MutedPosts from './pages/mutedPosts'
import SubscribePosts from './pages/subscribePosts'
import Profile from './pages/Profile'
import Visited from './pages/Visited'
import Popular from './pages/popular';
import resetPassword from './pages/reset-password';

function App() {
  return (
    <Context>
      <Router>
        <Grid>
          <Switch>
            <HomeRoute exact path="/" component={LandingPage} />
            <AuthRoute exact path="/login" component={login} />
            <AuthRoute exact path="/resetPassword" component={resetPassword} />
            <AuthRoute exact path="/register" component={register} />
            <UserRoute exact path="/post/:id" component={SinglePost} />
            <UserRoute exact path="/nearby" component={Nearby} />
            <UserRoute exact path="/popular" component={Popular} />
            <UserRoute exact path="/mutedPost" component={MutedPosts} />
            <UserRoute exact path="/subscribePosts" component={SubscribePosts} />
            <UserRoute exact path="/profile" component={Profile} />
            <UserRoute exact path="/visited" component={Visited} />
            <FacebookAuthRoute exact path="/register/facebook" component={RegisterFacebook} />
            <GoogleAuthRoute exact path="/register/google" component={RegisterGoogle} />
            <UserRoute exact path="/map" component={map} />
          </Switch>
        </Grid>
      </Router>
    </Context>
  );
}

export default App;

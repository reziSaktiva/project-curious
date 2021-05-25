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
import map from './pages/map'

import RegisterFacebook from './pages/registerFacebook';
import RegisterGoogle from './pages/registerGoogle';
import LandingPage from './pages/landingPage';
import Grid from './pages/grid';
import SinglePost from './pages/detailPost';
import Nearby from './pages/nearby';
import MutedPost from './pages/mutedPosts'
import Profile from './pages/Profile'
import Visited from './pages/Visited'
import resetPassword from './pages/resetPassword';

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
            <UserRoute exact path="/mutedPost" component={MutedPost} />
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

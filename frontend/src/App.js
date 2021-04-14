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

// Importing Pages & Components
import login from './pages/login';
import register from './pages/register';
import map from './pages/map'

import RegisterFacebook from './pages/registerFacebook';
import LandingPage from './pages/landingPage';
import Grid from './pages/grid';

function App() {
  return (
    <Context>
      <Router>
        <Grid>
          <Switch>
            <HomeRoute exact path="/" component={LandingPage} />
            <AuthRoute exact path="/login" component={login} />
            <AuthRoute exact path="/register" component={register} />
            <FacebookAuthRoute exact path="/register/facebook" component={RegisterFacebook} />
            <UserRoute exact path="/map" component={map} />
          </Switch>
        </Grid>
      </Router>
    </Context>
  );
}

export default App;

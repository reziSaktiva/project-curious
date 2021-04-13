import 'antd/dist/antd.css'
import 'semantic-ui-css/semantic.min.css'
import './App.css';

import { BrowserRouter as Router, Switch } from 'react-router-dom';

import AuthRoute from './util/AuthRoute'
import Context from './context/Context'
import FacebookAuthRoute from './util/FacebookAuthRoute'
import Grid from './pages/grid';
import HomeRoute from './util/HomeRoute'
import LandingPage from './pages/landingPage';
import React from 'react'
import RegisterFacebook from './pages/registerFacebook';
import UserRoute from './util/UserRoute'
// Importing Pages & Components
import login from './pages/login';
import map from './pages/map'
import register from './pages/register';

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

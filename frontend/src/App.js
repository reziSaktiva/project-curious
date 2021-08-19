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
import login from './pages/login/index';
import register from './pages/register';
import map from './pages/map/index'

import RegisterFacebook from './pages/registerFacebook';
import RegisterGoogle from './pages/GoogleRegs/registerGoogle';
import LandingPage from './pages/landing-page';
import Grid from './pages/grid/grid';
import SinglePost from './pages/detailPost/detailPost';
import Nearby from './pages/nearby';
import MutedPosts from './pages/mutedPosts'
import SubscribePosts from './pages/subscribePosts'
import Profile from './pages/Profile/Profile'
import Visited from './pages/visited/index'
import Popular from './pages/popular';
import resetPassword from './pages/reset-password';
import confirmPassword from './pages/confirm-password';
import Room from './pages/room'
import Chat from './components/chat';
import settings from './pages/Settings';

import Search from './pages/search/index';
import EditProfile from './pages/Profile/editProfile';
import TOU from './pages/legal/TeromOfUse';
import CG from './pages/legal/CommunityGuidelines';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';


function App() {
  return (
    <Context>
      <Router>
        <Grid>
          <Switch>
            <HomeRoute exact path="/" component={LandingPage} />
            <FacebookAuthRoute exact path="/register/facebook" component={RegisterFacebook} />
            <GoogleAuthRoute exact path="/register/google" component={RegisterGoogle} />
            <AuthRoute exact path="/login" component={login} />
            <AuthRoute exact path="/resetPassword" component={resetPassword} />
            <AuthRoute exact path="/confirm-reset" component={confirmPassword} />
            <AuthRoute exact path="/register" component={register} />
            <UserRoute exact path="/:room/:id" component={SinglePost} />
            <UserRoute exact path="/nearby" component={Nearby} />
            <UserRoute exact path="/popular" component={Popular} />
            <UserRoute exact path="/Insvire E-Sport" component={Room} />
            <UserRoute exact path="/BMW Club Bandung" component={Room} />
            <UserRoute exact path="/mutedPost" component={MutedPosts} />
            <UserRoute exact path="/subscribePosts" component={SubscribePosts} />
            <UserRoute exact path="/editProfile" component={EditProfile} />
            <UserRoute exact path="/profile/user/:id" component={Profile} />
            <UserRoute exact path="/visited" component={Visited} />
            <UserRoute exact path="/search" component={Search} />
            <UserRoute exact path="/chat" component={Chat} />
            <UserRoute exact path="/settings" component={settings} />
            <UserRoute exact path="/TermOfUse" component={TOU} />
            <UserRoute exact path="/CommunityGuidelines" component={CG} />
            <UserRoute exact path="/PrivacyPolicy" component={PrivacyPolicy} />
            <UserRoute exact path="/maps" component={map} />
          </Switch>
        </Grid>
      </Router>
    </Context>
  );
}

export default App;

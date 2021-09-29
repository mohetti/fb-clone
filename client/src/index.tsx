import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import './index.css';
import Landing from './Login/Landing';
import Signup from './Login/Signup';
import Login from './Login/Login';
import Feed from './Main/Feed';
import Friends from './Main/Friends';
import Profile from './Main/Profile';
import Settings from './SideComponents/Settings';
import OtherUsers from './Main/OtherUsers';

import AuthenticatedRoute from './RouteHandler/AuthenticatedRoutes';
import UnAuthenticatedRoute from './RouteHandler/UnAuthenticatedRoutes';

import { useEffect, useState } from 'react';
import { CSRFContext } from './Authentication/csrfContext';
import { LoginContext } from './Authentication/loginContext';
import { UserContext } from './Authentication/userContext';

import './Login/authSites.css';

type LoginType = undefined | boolean;

const Routing = () => {
  const [token, setToken] = useState('');
  const [loginStatus, setLoginStatus] = useState<LoginType>(undefined);
  const [userInfo, setUserInfo] = useState(undefined);
  const value = { userInfo, setUserInfo };
  const fetchLoginStatus = async () => {
    const fetchData = await fetch('http://localhost:3000/auth/checkauth', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await fetchData.json();
    setUserInfo(response.userInfo);
    return response.status === 401
      ? setLoginStatus(false)
      : setLoginStatus(true);
  };

  async function getToken() {
    let test = await fetch('http://localhost:3000/token', {
      headers: {
        method: 'GET',
        Accept: 'application/json',
        'Content-Type': 'apllication/json',
      },
      credentials: 'include',
      mode: 'cors',
    });
    const parsed = await test.json();
    setToken(parsed.csrfToken);
  }

  useEffect(() => {
    fetchLoginStatus();
    getToken();
  }, []);

  return (
    <Router>
      <Switch>
        <CSRFContext.Provider value={token}>
          <LoginContext.Provider value={loginStatus}>
            <UserContext.Provider value={value}>
              <UnAuthenticatedRoute exact path='/'>
                <Landing fetchLoginStatus={fetchLoginStatus} />
              </UnAuthenticatedRoute>
              <UnAuthenticatedRoute exact path='/signup'>
                <Signup />
              </UnAuthenticatedRoute>
              <UnAuthenticatedRoute exact path='/login'>
                <Login fetchLoginStatus={fetchLoginStatus} />
              </UnAuthenticatedRoute>
              <AuthenticatedRoute exact path='/feed'>
                <Feed fetchLoginStatus={fetchLoginStatus} />
              </AuthenticatedRoute>
              <AuthenticatedRoute exact path='/friends'>
                <Friends fetchLoginStatus={fetchLoginStatus} />
              </AuthenticatedRoute>
              <AuthenticatedRoute exact path='/profile'>
                <Profile fetchLoginStatus={fetchLoginStatus} />
              </AuthenticatedRoute>
              <AuthenticatedRoute exact path='/profile/:id'>
                <OtherUsers fetchLoginStatus={fetchLoginStatus} />
              </AuthenticatedRoute>
              <AuthenticatedRoute exact path='/settings'>
                <Settings fetchLoginStatus={fetchLoginStatus} />
              </AuthenticatedRoute>
            </UserContext.Provider>
          </LoginContext.Provider>
        </CSRFContext.Provider>
      </Switch>
    </Router>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>,
  document.getElementById('root')
);

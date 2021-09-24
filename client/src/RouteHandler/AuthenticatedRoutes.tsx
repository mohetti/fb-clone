import { Route, Redirect, useLocation } from 'react-router-dom';
import { AuthProps } from './interfaces';
import { useContext } from 'react';
import { LoginContext } from '../Authentication/loginContext';

function AuthenticatedRoute({ children, ...rest }: AuthProps) {
  const { pathname, search } = useLocation();
  const isLoggedIn = useContext(LoginContext);
  return (
    <div>
      {isLoggedIn === undefined ? (
        <div></div>
      ) : (
        <Route {...rest}>
          {isLoggedIn ? (
            children
          ) : (
            <Redirect to={`/login?redirect=${pathname}${search}`} />
          )}
        </Route>
      )}
    </div>
  );
}

export default AuthenticatedRoute;

import { Route, Redirect } from 'react-router-dom';
import { AuthProps } from './interfaces';

import { useContext } from 'react';
import { LoginContext } from '../Authentication/loginContext';

function UnAuthenticatedRoute({ children, ...rest }: AuthProps) {
  const isLoggedIn = useContext(LoginContext);

  return (
    <div>
      {isLoggedIn === undefined ? (
        <div></div>
      ) : (
        <Route {...rest}>
          {!isLoggedIn ? children : <Redirect to={`/feed`} />}
        </Route>
      )}
    </div>
  );
}

export default UnAuthenticatedRoute;

import { loginUser } from '../Authentication/loginUser';
import { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { CSRFContext } from '../Authentication/csrfContext';

interface History {
  location: {
    state: {
      data: string;
    };
  };
}

function Login(props: any) {
  const [redirectMessage, setRedirectMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const redirectedFromSignup: History = useHistory();
  const redirectToSignup = useHistory();

  const csrf: string = useContext(CSRFContext);

  useEffect(() => {
    const signupMsg = redirectedFromSignup.location.state;
    if (signupMsg) return setRedirectMessage(signupMsg.data);
  }, [redirectedFromSignup.location.state]);

  const initLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;
    const values = { email: email, password: password, csrf: csrf };
    const loginAttempt = await loginUser(values);

    if (loginAttempt.status === 401) {
      return setErrorMessage(loginAttempt.message);
    }
    if (loginAttempt.status === 200) {
      return props.fetchLoginStatus();
    }
  };

  const goToSignup = () => {
    return redirectToSignup.push('/signup');
  };

  return (
    <div>
      <div className='login-container'>
        <h1>Login to Friends Base</h1>
        <form action='submit' onSubmit={initLogin}>
          <input
            type='text'
            placeholder='E-Mail address'
            name='email'
            required
          />
          <input
            type='password'
            placeholder='Password'
            name='password'
            required
          />
          <button type='submit' name='submit'>
            Log in
          </button>
        </form>
        <div>
          <p>No Account?</p>
          <button onClick={goToSignup}>Create new Account</button>
        </div>
      </div>
      <a href='http://localhost:5000/auth/login/facebook'>Facebook</a>
      {errorMessage && <div>{errorMessage}</div>}
      {redirectMessage && <div>{redirectMessage}</div>}
    </div>
  );
}

export default Login;

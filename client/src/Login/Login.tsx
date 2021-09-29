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
      <h1>Login to Friends Base</h1>
      <div className='welcome-container'>
        <div className='form-container'>
          <form action='submit' onSubmit={initLogin}>
            <div>
              <input
                type='text'
                placeholder='E-Mail address'
                name='email'
                required
              />
            </div>
            <div>
              <input
                type='password'
                placeholder='Password'
                name='password'
                required
              />
            </div>
            <div className='btn-container'>
              <button className='btn-dark' type='submit' name='submit'>
                Log in
              </button>
            </div>
          </form>
        </div>
        <div>
          <p>No Account?</p>
          <div className='signup-container'>
            <button className='btn-light' onClick={goToSignup}>
              Create new Account
            </button>
          </div>
        </div>
        <a href='http://localhost:5000/auth/login/facebook'>Facebook</a>
      </div>

      {errorMessage && <div className='error'>{errorMessage}</div>}
      {redirectMessage && <div className='success'>{redirectMessage}</div>}
    </div>
  );
}

export default Login;

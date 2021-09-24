import { loginUser } from '../Authentication/loginUser';
import { useState, useContext } from 'react';
import { CSRFContext } from '../Authentication/csrfContext';
import { useHistory } from 'react-router-dom';

function Landing(props: any) {
  const [errorMessage, setErrorMessage] = useState('');
  const csrf: string = useContext(CSRFContext);
  const history = useHistory();

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
    return history.push('/signup');
  };

  return (
    <div>
      <div className='welcome-container'>
        <h1>Friends Base</h1>
        <p>
          Stay connected with your friends on Friends Base. Share photos, videos
          and much more.
        </p>
      </div>
      <div className='auth-options'>
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
          <p>or</p>
          <button onClick={goToSignup}>Create new Account</button>
          <a href='http://localhost:5000/auth/login/facebook'>Facebook</a>
        </div>
      </div>
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
}

export default Landing;

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
      <h1>Friends Base</h1>
      <div className='welcome-container'>
        <div className='welcome-text'>
          <p>
            Stay connected with your friends on Friends Base. Share photos,
            videos and much more.
          </p>
        </div>
      </div>
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
            <button className='btn-dark vwWidth1' type='submit' name='submit'>
              Log in
            </button>
          </div>
        </form>
        <p>or</p>
        <div className='signup-container'>
          <button className='btn-light vwWidth2' onClick={goToSignup}>
            Create new Account
          </button>
          <a href='http://localhost:5000/auth/login/facebook'>
            Login via Facebook
          </a>
        </div>
        {errorMessage && <div className='error'>{errorMessage}</div>}
      </div>
    </div>
  );
}

export default Landing;

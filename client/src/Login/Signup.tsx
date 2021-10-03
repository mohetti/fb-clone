import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { CSRFContext } from '../Authentication/csrfContext';

function Signup() {
  const [errorMsg, setErrorMsg] = useState('');
  const history = useHistory();
  const csrf = useContext(CSRFContext);

  const signupUser = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      firstname: { value: string };
      surname: { value: string };
      email: { value: string };
      password: { value: string };
      confirmPassword: { value: string };
    };
    const data = {
      firstName: target.firstname.value,
      surName: target.surname.value,
      email: target.email.value,
      password: target.password.value,
      confirmPassword: target.confirmPassword.value,
    };

    const signup = await fetch(
      'https://mohetti.github.io/fb-clone/auth/signup',
      {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'xsrf-token': csrf,
        },
        body: JSON.stringify(data),
      }
    );

    const response = await signup.json();
    if (response.status === 401) {
      return setErrorMsg(response.msg);
    }

    if (response.status === 304) {
      return history.push('/login', { data: response.msg });
    }
  };

  const goToLogin = () => {
    return history.push('/login', { data: 'Please Login' });
  };

  return (
    <div>
      <h1>Signup to Friends Base</h1>
      <div className='welcome-container'>
        <div className='form-container'>
          <form action='submit' onSubmit={signupUser}>
            <label className='input-w' htmlFor='firstname'>
              <span className='label'>First name: </span>
              <input
                className='input'
                type='string'
                name='firstname'
                placeholder='Name'
                required
              />
            </label>
            <label className='input-w' htmlFor='surname'>
              <span className='label'>First name: </span>
              <input
                className='input'
                type='string'
                name='surname'
                placeholder='Surname'
                required
              />
            </label>
            <label className='input-w' htmlFor='email'>
              <span className='label'>E-Mail: </span>
              <input
                className='input'
                type='text'
                placeholder='E-Mail address'
                name='email'
                required
              />
            </label>
            <label className='input-w' htmlFor='password'>
              <span className='label'>Password: </span>
              <input
                className='input'
                type='password'
                placeholder='Password'
                name='password'
                required
              />
            </label>
            <label className='input-w' htmlFor='confirmPassword'>
              <span className='label'>Confirm Password: </span>
              <input
                className='input'
                type='password'
                placeholder='Confirm password'
                name='confirmPassword'
                required
              />
            </label>
            <div className='btn-container'>
              <button className='btn-dark' type='submit' name='submit'>
                Sign up
              </button>
            </div>
          </form>
        </div>
        <div>
          <p>Already have an Account?</p>
          <div className='btn-container'>
            <button className='btn-light' onClick={goToLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
      {errorMsg && <div>{errorMsg}</div>}
    </div>
  );
}

export default Signup;

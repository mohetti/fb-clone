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

    const signup = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'xsrf-token': csrf,
      },
      body: JSON.stringify(data),
    });

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
      <div className='login-container'>
        <h1>Signup to Friends Base</h1>
        <form action='submit' onSubmit={signupUser}>
          <label htmlFor='firstname'>First name: </label>
          <input type='string' name='firstname' placeholder='Name' required />
          <label htmlFor='surname'>First name: </label>
          <input type='string' name='surname' placeholder='Surname' required />
          <label htmlFor='email'>E-Mail: </label>
          <input
            type='text'
            placeholder='E-Mail address'
            name='email'
            required
          />
          <label htmlFor='password'>Password: </label>
          <input
            type='password'
            placeholder='Password'
            name='password'
            required
          />
          <label htmlFor='confirmPassword'>Confirm Password: </label>
          <input
            type='password'
            placeholder='Confirm password'
            name='confirmPassword'
            required
          />
          <button type='submit' name='submit'>
            Sign up
          </button>
        </form>
        <div>
          <p>Already have an Account</p>
          <button onClick={goToLogin}>Login</button>
        </div>
      </div>
      {errorMsg && <div>{errorMsg}</div>}
    </div>
  );
}

export default Signup;

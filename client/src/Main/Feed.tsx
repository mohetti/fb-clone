import Navbar from '../SideComponents/Navbar';
import Logout from '../SideComponents/Logout';
import Messages from './Messages';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../Authentication/userContext';
import { CSRFContext } from '../Authentication/csrfContext';

function Feed(props: any) {
  const [rerender, setRerender] = useState(true);
  const user = useContext(UserContext);
  const [selectedFile, setSelectedFile] = useState<any>();
  const csrf = useContext(CSRFContext);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [bio, setBio] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (rerender) {
      setRerender(false);
    }
  }, [rerender]);

  const callRerender = () => {
    setRerender(true);
  };

  const uploadImage = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('profileImage', selectedFile);
    const fetchData = await fetch('https://smc-mh.herokuapp.com/user/upload', {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'multipart/formdata',
        'xsrf-token': csrf,
      },
      credentials: 'include',
    });
    const response = await fetchData.json();
    setUserInfo(response.docs);
  };
  const onFileChange = (e: React.SyntheticEvent) => {
    const target = e.target as typeof e.target & {
      files: any;
    };
    setSelectedFile(target.files[0]);
  };
  const addBio = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await fetch('https://smc-mh.herokuapp.com/user/bio', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'xsrf-token': csrf,
      },
      body: JSON.stringify({ bio: bio }),
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 2000);
    setBio('');
  };

  const bioText = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setBio(target.value);
  };

  const proceed = async () => {
    const fetchData = await fetch(
      'https://smc-mh.herokuapp.com/user/firstlogin',
      {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'xsrf-token': csrf,
        },
      }
    );
    const response = await fetchData.json();
    setUserInfo(response.docs);
    setRerender(true);
  };
  return (
    <div>
      {user.userInfo && user.userInfo.firstLogin ? (
        <div>
          <h2>Welcome to Friends Base!</h2>
          <div className='centering'>
            <p>
              If you'd like, upload an image and write a short bio about
              yourself.
            </p>
            <p>
              if you don't have time, you can do this at any time under
              Settings.
            </p>
            <p>Have fun!</p>
          </div>
          <form className='centering mg1' onSubmit={uploadImage}>
            <input name='image' type='file' onChange={onFileChange} />
            <input
              className='btn-light mg1'
              type='submit'
              value='Uploade Picture'
            />
          </form>
          <form className='centering' onSubmit={addBio}>
            <textarea
              className='textarea'
              name='bio'
              onChange={bioText}
              value={bio}
            />
            <input className='btn-light mg1' type='submit' value='Add Bio' />
          </form>
          {success && (
            <div className='centering'>
              <div className='success'>Bio successfully updated</div>
            </div>
          )}
          <div className='centering'>
            <button className='btn-dark' onClick={proceed}>
              Proceed
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className='mg3'>Feed</h2>
          <Navbar />
          <Messages rerender={rerender} callRerender={callRerender} />
          <Logout fetchLoginStatus={props.fetchLoginStatus} />
        </div>
      )}
    </div>
  );
}

export default Feed;

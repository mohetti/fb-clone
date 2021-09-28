import Navbar from '../SideComponents/Navbar';
import Logout from '../SideComponents/Logout';
import Messages from './Messages';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../Authentication/userContext';
import { CSRFContext } from '../Authentication/csrfContext';
/*
type ResponseSchema = {
  _id: string;
  message: string;
  time: string;
  comments: [string];
  likes: [string];
  user: {
    firstName: string;
    surName: string;
    _id: string;
  };
};
*/

function Feed(props: any) {
  const [rerender, setRerender] = useState(true);
  const user = useContext(UserContext);
  const [selectedFile, setSelectedFile] = useState<any>();
  const csrf = useContext(CSRFContext);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [bio, setBio] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    console.log(user);
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
    const fetchData = await fetch('http://localhost:3000/user/upload', {
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
    await fetch('http://localhost:3000/user/bio', {
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
    const fetchData = await fetch('http://localhost:3000/user/firstlogin', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'xsrf-token': csrf,
      },
    });
    const response = await fetchData.json();
    setUserInfo(response.docs);
    setRerender(true);
  };
  return (
    <div>
      {user.userInfo && user.userInfo.firstLogin ? (
        <div>
          <h1>Welcome to Friends Base!</h1>
          <p>
            If you'd like, upload an image and write a short bio about yourself.
          </p>
          <p>
            if you don't have time, you can do this at any time under Settings.
          </p>
          <p>Have fun!</p>
          <form onSubmit={uploadImage}>
            <input name='image' type='file' onChange={onFileChange} />
            <input type='submit' />
          </form>
          <form onSubmit={addBio}>
            <input name='bio' type='text' onChange={bioText} value={bio} />
            <input type='submit' value='Add Bio' />
          </form>
          {success && <div>Bio successfully updated</div>}
          <button onClick={proceed}>Proceed</button>
        </div>
      ) : (
        <div>
          <Navbar />
          <Messages rerender={rerender} callRerender={callRerender} />
          <Logout fetchLoginStatus={props.fetchLoginStatus} />
        </div>
      )}
    </div>
  );
}

export default Feed;

import React, { useContext, useState } from 'react';
import Navbar from '../SideComponents/Navbar';
import Logout from '../SideComponents/Logout';

import { CSRFContext } from '../Authentication/csrfContext';
import { UserContext } from '../Authentication/userContext';

function Settings(props: any) {
  const [selectedFile, setSelectedFile] = useState<any>();
  const [bio, setBio] = useState('');
  const [success, setSuccess] = useState(false);
  const csrf = useContext(CSRFContext);

  const { userInfo, setUserInfo } = useContext(UserContext);

  const deleteProfile = async () => {
    await fetch('http://localhost:3000/user/delete', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'xsrf-token': csrf,
      },
    });
    await fetch('http://localhost:3000/auth/logout', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    props.fetchLoginStatus();
  };
  const confirmDeletion = () => {
    const confirm = window.confirm('Are you sure?');
    if (confirm) {
      return deleteProfile();
    }
    return;
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
  return (
    <div>
      <Navbar />
      <div>Settings</div>
      <button onClick={confirmDeletion}>Delete Profile</button>
      <form onSubmit={uploadImage}>
        <input name='image' type='file' onChange={onFileChange} />
        <input type='submit' />
      </form>
      <form onSubmit={addBio}>
        <input name='bio' type='text' onChange={bioText} value={bio} />
        <input type='submit' value='Add Bio' />
      </form>
      {success && <div>Bio successfully updated</div>}
      <Logout fetchLoginStatus={props.fetchLoginStatus} />
    </div>
  );
}

export default Settings;

import React, { useContext, useState } from 'react';
import Navbar from '../SideComponents/Navbar';
import Logout from '../SideComponents/Logout';

import { CSRFContext } from '../Authentication/csrfContext';

function Settings(props: any) {
  const [selectedFile, setSelectedFile] = useState<any>();
  const csrf = useContext(CSRFContext);

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
    const response = fetchData.json();
    console.log(response);
  };
  const onFileChange = (e: React.SyntheticEvent) => {
    const target = e.target as typeof e.target & {
      files: any;
    };
    setSelectedFile(target.files[0]);
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
      <Logout fetchLoginStatus={props.fetchLoginStatus} />
    </div>
  );
}

export default Settings;

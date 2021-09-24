import React, { useContext } from 'react';
import Navbar from '../SideComponents/Navbar';
import Logout from '../SideComponents/Logout';
import { CSRFContext } from '../Authentication/csrfContext';

function Settings(props: any) {
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

  const uploadImage = () => {
    console.log('Test');
  };
  return (
    <div>
      <Navbar />
      <div>Settings</div>
      <button onClick={confirmDeletion}>Delete Profile</button>
      <button onClick={uploadImage}>Upload Image</button>
      <Logout fetchLoginStatus={props.fetchLoginStatus} />
    </div>
  );
}

export default Settings;

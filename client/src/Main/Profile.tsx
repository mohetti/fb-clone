import React from 'react';
import Navbar from '../SideComponents/Navbar';
import Logout from '../SideComponents/Logout';

function Profile(props: any) {
  return (
    <div>
      <Navbar />
      <div>Profile</div>
      <Logout fetchLoginStatus={props.fetchLoginStatus} />
    </div>
  );
}

export default Profile;

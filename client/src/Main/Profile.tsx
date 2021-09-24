import React, { useContext } from 'react';
import Navbar from '../SideComponents/Navbar';
import Logout from '../SideComponents/Logout';
import { UserContext } from '../Authentication/userContext';

function Profile(props: any) {
  const user = useContext(UserContext);

  return (
    <div>
      <Navbar />
      <div>Profile</div>
      {user.userInfo && (
        <img
          src={'http://localhost:3000/' + user.userInfo!.img}
          alt='hello'
        ></img>
      )}
      <Logout fetchLoginStatus={props.fetchLoginStatus} />
    </div>
  );
}

export default Profile;

import React, { useEffect, useContext } from 'react';
import Navbar from '../SideComponents/Navbar';
import Logout from '../SideComponents/Logout';
import { UserContext } from '../Authentication/userContext';

function Profile(props: any) {
  const user = useContext(UserContext);
  useEffect(() => {
    console.log(user);
  }, []);
  return (
    <div>
      <Navbar />
      <div>Profile</div>
      {user && (
        <img src={'http://localhost:3000/' + user!.img} alt='hello'></img>
      )}
      <Logout fetchLoginStatus={props.fetchLoginStatus} />
    </div>
  );
}

export default Profile;

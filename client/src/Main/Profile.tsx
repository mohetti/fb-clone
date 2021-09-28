import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../SideComponents/Navbar';
import Logout from '../SideComponents/Logout';
import { UserContext } from '../Authentication/userContext';
import Messages from './Messages';

function Profile(props: any) {
  const user = useContext(UserContext);

  const [rerender, setRerender] = useState(true);
  useEffect(() => {
    props.fetchLoginStatus();
    if (rerender) {
      setRerender(false);
    }
    return props.fetchLoginStatus();
  }, [rerender]);

  const callRerender = () => {
    setRerender(true);
  };

  return (
    <div>
      <Navbar />
      <div>Profile</div>
      {user.userInfo && (
        <div>
          <div>
            {user.userInfo.firstName} {user.userInfo.surName}
          </div>
          <div>{user.userInfo.bio}</div>
          <img
            style={{ height: '200px', width: '200px' }}
            src={'http://localhost:3000/' + user.userInfo!.img}
            alt='hello'
          ></img>
        </div>
      )}
      <Messages rerender={rerender} callRerender={callRerender} />
      <Logout fetchLoginStatus={props.fetchLoginStatus} />
    </div>
  );
}

export default Profile;

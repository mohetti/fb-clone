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
      <h2 className='mg3'>Profile</h2>
      <Navbar />
      {user.userInfo && (
        <div>
          <div className='mg5'>
            <img
              className='profile-img'
              src={'https://smc-mh.herokuapp.com/' + user.userInfo!.img}
              alt='hello'
            ></img>
            <span className='mgl'>
              {user.userInfo.firstName} {user.userInfo.surName}
            </span>
          </div>
          <div className='bio'>{user.userInfo.bio}</div>
        </div>
      )}
      <Messages rerender={rerender} callRerender={callRerender} />
      <Logout fetchLoginStatus={props.fetchLoginStatus} />
    </div>
  );
}

export default Profile;

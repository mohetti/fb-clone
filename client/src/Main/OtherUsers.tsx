import React from 'react';
import { useParams } from 'react-router-dom';

function OtherUsers(props: any) {
  const profile: { id: string } = useParams();

  // if id === logged in user redirect to /profile
  return <div className='App'>User {profile.id}</div>;
}

export default OtherUsers;

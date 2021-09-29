function Logout(props: any) {
  const logout = async () => {
    await fetch('http://localhost:3000/auth/logout', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return props.fetchLoginStatus();
  };
  return (
    <div className='logout'>
      <button className='btn-dark' onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Logout;

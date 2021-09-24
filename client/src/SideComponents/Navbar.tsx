import { Link } from 'react-router-dom';
function Navbar() {
  return (
    <div className='nav'>
      <Link to='/profile'>Profile</Link>
      <Link to='/feed'>Feed</Link>
      <Link to='/friends'>Friends</Link>
      <Link to='/settings'>Settings</Link>
    </div>
  );
}

export default Navbar;

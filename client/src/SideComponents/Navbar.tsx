import { Link } from 'react-router-dom';
import React, { useState } from 'react';
function Navbar() {
  const [visibility, setVisibility] = useState(false);
  const toggleVisibility = () => {
    setVisibility(!visibility);
  };
  return (
    <div>
      <div className='mobile-menu'>
        <button onClick={toggleVisibility} className='btn-small'>
          Menu
        </button>
        {visibility && (
          <div>
            <Link to='/profile'>Profile</Link>
            <Link to='/feed'>Feed</Link>
            <Link to='/friends'>Friends</Link>
            <Link to='/settings'>Settings</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;

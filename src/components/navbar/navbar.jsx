import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth/authContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };
  return (
    <header className='bg-[#C0FFB3] h-auto w-full flex '>
        {/* Logo */}
        <div className='bg-none p-[20px] m-r-[20px] h-auto justify-start'>
            <Link to="/">
            <img src="/logo.svg" alt="Readian Logo" className='w-[100px]'/></Link>
        </div>

        {/* Searchbar */}
        <div className='flex grow items-center justify-start'>
            <input type="text" placeholder='Search' name='search' className='h-4 bg-white border-1 border-solid rounded-[10px] p-5'/>
        </div>

        {/* navlinks */}
        {isAuthenticated && user ? (
          <div className='flex justify-center items-center gap-[30px] p-[20px]'>
            <Link to="/">Home</Link>

            {/* role based link */}
            {user.role === 'author' && (
              <Link to="/authordash">Author Dashboard</Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admindash">Admin Dashboard</Link>
            )}

            <Link to="/browse">Browse</Link>
            <Link to="/instruction">Help</Link>
            <Link to="/subscribe">Subscribe</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Log Out</button>
          </div>
          
        ) : (
          <div className='flex justify-center items-center gap-[30px] p-[20px]'>
            <Link to="/">Home</Link>
            <Link to="/browse">Browse</Link>
            <Link to="/instruction">Help</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/signin">Log In</Link>
          </div>
          
        )}
        
    </header>
  )
}

export default Navbar;

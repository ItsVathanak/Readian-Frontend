import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth/authContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/signin');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className='bg-[#C0FFB3] h-auto w-full'>
      <div className='flex items-center justify-between px-4 py-3 lg:px-6'>
        {/* Logo */}
        <div className='flex-shrink-0'>
          <Link to="/" onClick={closeMobileMenu}>
            <img src="/logo.svg" alt="Readian Logo" className='w-[80px] lg:w-[100px]'/>
          </Link>
        </div>

        {/* Searchbar - Hidden on mobile, visible on md+ */}
        <div className='hidden md:flex grow items-center justify-start mx-4 max-w-md'>
          <input
            type="text"
            placeholder='Search'
            name='search'
            className='w-full h-10 bg-white border border-gray-300 rounded-[10px] px-4 py-2'
          />
        </div>

        {/* Desktop Navigation - Hidden on mobile, visible on lg+ */}
        {isAuthenticated && user ? (
          <nav className='hidden lg:flex items-center gap-4 xl:gap-6'>
            <Link to="/" className='hover:font-semibold transition-all'>Home</Link>

            {/* role based link */}
            {user.role === 'author' && (
              <Link to="/authordash" className='hover:font-semibold transition-all'>Dashboard</Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admindash" className='hover:font-semibold transition-all'>Admin</Link>
            )}

            <Link to="/browse" className='hover:font-semibold transition-all'>Browse</Link>
            <Link to="/instruction" className='hover:font-semibold transition-all'>Help</Link>

            {/* Subscription Status Badge */}
            <Link to="/subscribe" className='hover:font-semibold transition-all flex items-center gap-2'>
              Subscribe
              {user.plan && user.plan !== 'free' && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  user.plan === 'premium'
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
                    : 'bg-blue-500 text-white'
                }`}>
                  {user.plan === 'premium' ? '👑 PREMIUM' : 'BASIC'}
                </span>
              )}
            </Link>

            <Link to="/profile" className='hover:font-semibold transition-all'>Profile</Link>
            <button
              onClick={handleLogout}
              className='bg-[#1A5632] text-white px-4 py-2 rounded-lg hover:bg-[#FFD7DF] hover:text-[#1A5632] transition-all'
            >
              Log Out
            </button>
          </nav>
        ) : (
          <nav className='hidden lg:flex items-center gap-4 xl:gap-6'>
            <Link to="/" className='hover:font-semibold transition-all'>Home</Link>
            <Link to="/browse" className='hover:font-semibold transition-all'>Browse</Link>
            <Link to="/instruction" className='hover:font-semibold transition-all'>Help</Link>
            <Link
              to="/signup"
              className='hover:font-semibold transition-all'
            >
              Sign Up
            </Link>
            <Link to="/signin" className='hover:font-semibold transition-all'>Sign In</Link>
          </nav>
        )}

        {/* Mobile Menu Button - Visible on lg and below */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className='lg:hidden flex flex-col gap-1 p-2 z-50'
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-black transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-black transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-black transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu - Dropdown */}
      {mobileMenuOpen && (
        <div className='lg:hidden bg-[#C0FFB3] border-t border-black/10'>
          {/* Mobile Search */}
          <div className='px-4 py-3 md:hidden'>
            <input
              type="text"
              placeholder='Search'
              name='search'
              className='w-full h-10 bg-white border border-gray-300 rounded-[10px] px-4 py-2'
            />
          </div>

          {isAuthenticated && user ? (
            <nav className='flex flex-col py-2'>
              <Link to="/" onClick={closeMobileMenu} className='px-6 py-3 hover:bg-white/20 transition-all'>Home</Link>

              {user.role?.toLowerCase() === 'author' && (
                <Link to="/authordash" onClick={closeMobileMenu} className='px-6 py-3 hover:bg-white/20 transition-all'>Dashboard</Link>
              )}
              {user.role?.toLowerCase() === 'admin' && (
                <Link to="/admindash" onClick={closeMobileMenu} className='px-6 py-3 hover:bg-white/20 transition-all'>Admin</Link>
              )}

              <Link to="/browse" onClick={closeMobileMenu} className='px-6 py-3 hover:bg-white/20 transition-all'>Browse</Link>
              <Link to="/instruction" onClick={closeMobileMenu} className='px-6 py-3 hover:bg-white/20 transition-all'>Help</Link>
              <Link to="/subscribe" onClick={closeMobileMenu} className='px-6 py-3 hover:bg-white/20 transition-all'>Subscribe</Link>
              <Link to="/profile" onClick={closeMobileMenu} className='px-6 py-3 hover:bg-white/20 transition-all'>Profile</Link>
              <button
                onClick={handleLogout}
                className='mx-6 my-2 bg-[#1A5632] text-white px-4 py-2 rounded-lg hover:bg-[#FFD7DF] hover:text-[#1A5632] transition-all'
              >
                Log Out
              </button>
            </nav>
          ) : (
            <nav className='flex flex-col py-2'>
              <Link to="/" onClick={closeMobileMenu} className='px-6 py-3 hover:bg-white/20 transition-all'>Home</Link>
              <Link to="/browse" onClick={closeMobileMenu} className='px-6 py-3 hover:bg-white/20 transition-all'>Browse</Link>
              <Link to="/instruction" onClick={closeMobileMenu} className='px-6 py-3 hover:bg-white/20 transition-all'>Help</Link>
              <Link to="/signup" onClick={closeMobileMenu} className='px-6 py-3 hover:bg-white/20 transition-all'>Sign Up</Link>
              <Link to="/signin" onClick={closeMobileMenu} className='px-6 py-3 hover:bg-white/20 transition-all'>Sign In</Link>
            </nav>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar;

import React from 'react'
import { NavLink } from 'react-router-dom'

const AuthDashSidebar = ({currentUser}) => {

  //Nav link styles
  const activeLinkStyle = "flex flex-wrap text-[24px] font-semibold w-full h-[50px] place-content-center bg-white "
  const unactiveLinkStyle = "flex flex-wrap text-[24px] font-semibold w-full h-[50px] place-content-center bg-none hover:bg-white/50"

  return (
    <aside className='bg-[#C0FFB3] w-[320px] min-h-screen shrink-0 flex flex-col items-center py-8 sticky top-0 h-screen overflow-y-auto'>
        {/* pfp and username */}
        <div className='flex flex-col gap-2 items-center'>
          {currentUser.profileImage ? (
            <div className='w-[120px] h-[120px] rounded-full border-2 border-solid border-black overflow-hidden'>
              <img src={currentUser.profileImage} alt="User Profile" className='h-full object-cover'/>
            </div>
          ) : (
            <div className='w-[120px] h-[120px] rounded-full bg-gray-500 border-2 border-solid border-black' />
          )}

          <h1 className='geist text-[20px] font-semibold'>Welcome, {currentUser.username || "User"}</h1>
          <p className='text-[18px] font-semibold'>{(currentUser.role).toUpperCase()}</p>
          
        </div>

        {/* nav */}
        <nav className='mt-[50px] flex flex-col gap-4 w-full'>
          <h3 className="text-[28px] text-center font-semibold text-[#1A5632] uppercase mt-4">My Content</h3>

          <NavLink to="works" className={({ isActive }) => isActive ? activeLinkStyle : unactiveLinkStyle}>
            My Works
          </NavLink>
          <NavLink to="drafts" className={({ isActive }) => isActive ? activeLinkStyle : unactiveLinkStyle}>
            My Drafts
          </NavLink>
          <NavLink to="liked" className={({ isActive }) => isActive ? activeLinkStyle : unactiveLinkStyle}>
            My Liked
          </NavLink>
          <NavLink to="analytics" className={({ isActive }) => isActive ? activeLinkStyle : unactiveLinkStyle}>
            Analytics
          </NavLink>

        </nav>
    </aside>
  )
}

export default AuthDashSidebar

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, BookOpen, FileText, Heart, BarChart3, Library, Users } from 'lucide-react';

function AdminSidebar({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);

  // Define styles for NavLink
  const baseLinkStyle = "flex items-center gap-3 text-[20px] md:text-[22px] lg:text-[24px] font-semibold w-full h-[50px] px-4 transition-colors";
  const activeLinkStyle = `${baseLinkStyle} bg-white text-black`;
  const inactiveLinkStyle = `${baseLinkStyle} text-black hover:bg-white/50`; 

  // Helper function for NavLink
  const getLinkClass = ({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle;

  const myContentLinks = [
    { to: 'works', label: 'My Works', icon: BookOpen },
    { to: 'drafts', label: 'My Drafts', icon: FileText },
    { to: 'liked', label: 'My Liked', icon: Heart },
    { to: 'analytics', label: 'Analytics', icon: BarChart3 },

  ];

  const adminLinks = [
    { to: 'overview', label: 'Overview', icon: BarChart3 },
    { to: 'allworks', label: 'All Works', icon: Library },
    { to: 'allusers', label: 'All Users', icon: Users },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-20 left-4 z-50 bg-[#C0FFB3] p-3 rounded-full shadow-lg hover:bg-[#A0DF93] transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky
        top-0 left-0
        h-screen
        bg-[#C0FFB3]
        transition-all duration-300 ease-in-out
        z-40
        flex flex-col items-center
        py-8
        overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        w-[280px] md:w-[300px] lg:w-[320px]
        flex-shrink-0
      `}>

        {/* Profile Section */}
        <div className="flex flex-col gap-2 items-center px-2">
          {currentUser?.profileImage || currentUser?.avatar ? (
            <div className="w-[100px] h-[100px] md:w-[110px] md:h-[110px] lg:w-[120px] lg:h-[120px] rounded-full border-2 border-solid border-black overflow-hidden">
              <img src={currentUser.profileImage || currentUser.avatar} alt="User Profile" className='w-full h-full object-cover' />
            </div>
          ) : (
            <div className='w-[100px] h-[100px] md:w-[110px] md:h-[110px] lg:w-[120px] lg:h-[120px] rounded-full bg-gray-500 border-2 border-solid border-black' />
          )}

          <h2 className="geist text-[18px] md:text-[19px] lg:text-[20px] font-semibold text-center">
            Welcome, {currentUser?.name || "User"}
          </h2>
          <span className="text-[16px] md:text-[17px] lg:text-[18px] font-semibold text-[#1A5632]">
            ADMIN
          </span>
        </div>

        {/* Navigation */}
        <nav className="mt-[30px] md:mt-[40px] lg:mt-[50px] flex flex-col gap-4 w-full px-2">

          {/* My Content Section */}
          <h3 className="text-[24px] md:text-[26px] lg:text-[28px] text-center font-semibold text-[#1A5632] uppercase mt-4">
            My Content
          </h3>
          {myContentLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={getLinkClass}
              onClick={() => setIsOpen(false)}
            >
              <link.icon size={24} className="flex-shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          ))}

          {/* Admin Section */}
          <h3 className="text-[24px] md:text-[26px] lg:text-[28px] text-center font-semibold text-[#1A5632] uppercase mt-6">
            Admin Options
          </h3>
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={getLinkClass}
              onClick={() => setIsOpen(false)}
            >
              <link.icon size={24} className="flex-shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default AdminSidebar;
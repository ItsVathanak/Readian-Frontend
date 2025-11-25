import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { User, Edit, CreditCard, Download } from 'lucide-react';

function SettingsSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { to: '/profile', label: 'My Account', icon: User },
    { to: '/become-author', label: 'Become Author', icon: Edit },
    { to: '/subscription/manage', label: 'Manage Subscription', icon: CreditCard },
    { to: '/downloads', label: 'Downloads History', icon: Download },
  ];

  const baseLinkStyle = "flex items-center gap-3 text-[20px] md:text-[22px] lg:text-[24px] font-semibold w-full h-[50px] px-4 transition-colors";
  const activeLinkStyle = `${baseLinkStyle} bg-white text-black`;
  const inactiveLinkStyle = `${baseLinkStyle} text-black hover:bg-white/50`;

  const getLinkClass = ({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle;

  return (
    <>
      {/* Mobile Settings Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='lg:hidden fixed bottom-6 left-6 z-50 bg-[#1A5632] text-white p-4 rounded-full shadow-lg hover:bg-[#FFD7DF] hover:text-[#1A5632] transition-all'
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className='lg:hidden fixed inset-0 bg-black/50 z-40'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        onClick={(e) => e.stopPropagation()}
        className={`
          fixed lg:sticky
          top-0 lg:top-0
          left-0 lg:left-0
          h-screen lg:h-screen
          w-[280px] md:w-[300px] lg:w-[320px]
          bg-[#C0FFB3]
          flex flex-col items-center
          py-8 lg:py-[50px]
          z-50 lg:z-20
          transition-transform duration-300
          overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex-shrink-0
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className='lg:hidden self-end text-2xl font-bold mb-2 px-4'
        >
          ×
        </button>

        <h1 className="geist text-[28px] md:text-[32px] lg:text-[36px] font-semibold text-center px-2 mb-4">
          Settings
        </h1>

        <nav className="flex flex-col gap-4 w-full px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={getLinkClass}
              onClick={() => setIsOpen(false)}
            >
              <item.icon size={24} className="flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default SettingsSidebar;


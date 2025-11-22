import React from 'react';
import { Outlet } from 'react-router-dom';
import AuthDashSidebar from '../components/authordash/AuthDashSidebar';
import { useAuth } from '../services/auth/authContext';

function AuthorDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex justify-between bg-[#FFFDEE]">
      <AuthDashSidebar currentUser={user} />

      {/* Main Content */}
      <main className="p-6 w-full flex-1">
        <Outlet context={{ user }} />
      </main>
    </div>
  )
}

export default AuthorDashboardPage;
import React from 'react';
import { Outlet } from 'react-router-dom';
import AuthDashSidebar from '../components/authordash/AuthDashSidebar';
import { useAuth } from '../services/auth/authContext';

function AuthorDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#FFFDEE]">
      <AuthDashSidebar currentUser={user} />

      {/* Main Content */}
      <main className="p-6 lg:p-8 xl:p-10 w-full flex-1 overflow-x-hidden">
        <Outlet context={{ user }} />
      </main>
    </div>
  )
}

export default AuthorDashboardPage;
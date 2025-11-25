import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useAuth } from '../services/auth/authContext';

function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#FFFDEE]" >
      <AdminSidebar currentUser={user} />

      <main className="p-6 lg:p-8 xl:p-10 w-full flex-1 overflow-x-hidden">
        <Outlet context={{ user }} />
      </main>

    </div>
  );
}

export default AdminDashboardPage;
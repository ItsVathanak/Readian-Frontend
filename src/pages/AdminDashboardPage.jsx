import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useAuth } from '../services/auth/authContext';

function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex justify-between" >
      <AdminSidebar currentUser={user} />

      <main className="p-6 w-full flex-1">
        <Outlet context={{ user }} />
      </main>

    </div>
  );
}

export default AdminDashboardPage;
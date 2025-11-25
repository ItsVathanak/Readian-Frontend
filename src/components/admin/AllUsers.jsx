import React, { useState, useEffect, useMemo } from 'react';
import RemoveUserPopup from './RemoveUserPopup';
import UserRemovalCompletePopup from './UserRemovalCompletePopup';
import EditUserModal from './EditUserModal';
import { Edit, Trash2, User, Mail, Calendar } from 'lucide-react';
import { adminApi } from '../../services/api';
import { handleApiError, showSuccessToast } from '../../services/utils/errorHandler';

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usernameFilter, setUsernameFilter] = useState('');
  const [idFilter, setIdFilter] = useState('');
  const [userToRemove, setUserToRemove] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [reason, setReason] = useState('');
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const displayUsers = useMemo(() => {
    return users
      .filter(user =>
        (user.name || "").toLowerCase().includes(usernameFilter.toLowerCase())
      )
      .filter(user =>
        (user.id || "").toString().toLowerCase().includes(idFilter.toLowerCase())
      );
  }, [users, usernameFilter, idFilter]);

  // --- Handler Functions ---
  const handleRemoveClick = (user) => {
    setUserToRemove(user);
  };

  const handleCancelRemove = () => {
    setUserToRemove(null);
    setReason('');
  };

  const handleConfirmRemove = async () => {
    if (!reason) {
      alert("Please provide a reason for removal.");
      return;
    }

    try {
      await adminApi.deleteUser(userToRemove.id, { reason });
      showSuccessToast('User removed successfully');
      setShowComplete(true);
      await fetchUsers(); // Refresh the user list
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleFinalConfirm = () => {
    setShowComplete(false);
    setUserToRemove(null);
    setReason('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl">Loading users...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="geist text-5xl font-bold mb-8 text-[#00A819]">All Users</h1>

      {/* Filter Section */}
      <div className="flex gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Filter by username..."
          value={usernameFilter}
          onChange={(e) => setUsernameFilter(e.target.value)}
          className="p-2 border rounded-lg w-1/2"
        />
        <input 
          type="text" 
          placeholder="Filter by user ID..."
          value={idFilter}
          onChange={(e) => setIdFilter(e.target.value)}
          className="p-2 border rounded-lg w-1/2"
        />
      </div>

      {/* User Table - Responsive with horizontal scroll */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-2 border-green-700 overflow-x-auto">
        <table className="w-full text-left table-auto min-w-[800px]">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="p-2 text-sm">User ID</th>
              <th className="p-2 text-sm">Username</th>
              <th className="p-2 text-sm">Email</th>
              <th className="p-2 text-sm">Join Date</th>
              <th className="p-2 text-sm">Subscription</th>
              <th className="p-2 text-sm">Plan</th>
              <th className="p-2 text-sm">Works</th>
              <th className="p-2 text-center text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-2 text-xs sm:text-sm">{user.id?.toString().slice(0, 8)}...</td>
                <td className="p-2 text-sm font-medium">{user.name}</td>
                <td className="p-2 text-xs sm:text-sm">{user.email}</td>
                <td className="p-2 text-xs sm:text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2">
                  {user.subscriptionStatus === 'active' ? (
                    <span className="text-xs sm:text-sm font-semibold text-green-600 capitalize">Active</span>
                  ) : (
                    <span className="text-xs sm:text-sm text-gray-500">Inactive</span>
                  )}
                </td>
                <td className="p-2">
                  {user.subscriptionPlan ? (
                    <span className="text-xs sm:text-sm font-semibold text-blue-600 capitalize">
                      {user.subscriptionPlan}
                    </span>
                  ) : (
                    <span className="text-xs sm:text-sm text-gray-400">Free</span>
                  )}
                </td>
                <td className="p-2 text-sm font-semibold">{user.publishedBooksCount || 0}</td>
                <td className="p-2 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setUserToEdit(user)}
                      className="bg-blue-500 text-white text-sm py-1 px-3 rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveClick(user)}
                      className="bg-red-500 text-white text-sm py-1 px-3 rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayUsers.length === 0 && (
          <p className="text-center p-4">No users match your criteria.</p>
        )}
      </div>

      {/* --- Popups --- */}
      {userToRemove && !showComplete && (
        <RemoveUserPopup
          user={userToRemove}
          reason={reason}
          setReason={setReason}
          onConfirm={handleConfirmRemove}
          onAbort={handleCancelRemove}
        />
      )}

      {userToRemove && showComplete && (
        <UserRemovalCompletePopup
          user={userToRemove}
          reason={reason}
          onConfirm={handleFinalConfirm}
        />
      )}

      {userToEdit && (
        <EditUserModal
          user={userToEdit}
          onClose={() => setUserToEdit(null)}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
}

export default AllUsers;
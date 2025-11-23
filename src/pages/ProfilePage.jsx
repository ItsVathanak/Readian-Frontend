import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/profile/EditProfileModal';
import { useAuth } from '../services/auth/authContext';
import { userApi } from '../services/api';
import { handleApiError, showSuccessToast } from '../services/utils/errorHandler';

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleUpdateProfile = async (updatedData) => {
    try {
      setLoading(true);
      const response = await userApi.updateProfile(updatedData);
      updateUser(response.data);
      showSuccessToast('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-svh">
      {/* Sidebar - Responsive */}
      <aside className="w-full lg:w-[280px] xl:w-[320px] bg-[#C0FFB3] flex flex-col py-8 lg:py-[50px] gap-6 lg:gap-[30px] min-h-fit lg:min-h-svh">
        <h1 className="geist text-[28px] sm:text-[32px] lg:text-[36px] font-semibold text-center">Settings</h1>
        <div className="bg-white p-3 sm:p-4 w-full">
          <p className="text-[20px] sm:text-[24px] font-bold text-center">My Account</p>
        </div>
      </aside>

      {/* Main Content (My Account details) */}
      <main className="flex-1 w-full p-6 sm:p-8 md:p-10 lg:p-[50px] bg-white overflow-x-hidden">
        <h1 className="geist text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">My Account</h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 lg:gap-12">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center self-start">
            <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-2">
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500 text-xs text-center">No Photo</span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Joined: {formatDate(user.createdAt)}</p>
          </div>

          {/* User Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-2 text-sm sm:text-base lg:text-lg w-full sm:w-auto">
            <p className="font-semibold">Name:</p>
            <p>{user.name}</p>

            <p className="font-semibold">Email:</p>
            <p>{user.email}</p>

            <p className="font-semibold">Age:</p>
            <p>{user.age || 'Not set'}</p>

            <p className="font-semibold">Role:</p>
            <p className="capitalize">{user.role}</p>

            <p className="font-semibold">Subscription Status:</p>
            <p className="capitalize">{user.subscriptionStatus || 'inactive'}</p>

            {user.subscriptionStatus === 'active' && (
              <>
                <p className='font-semibold'>Subscription Expires:</p>
                <p>{formatDate(user.subscriptionEndDate)}</p>
              </>
            )}
            
            <p className="font-semibold col-span-2">Bio:</p>
            <div
              className="col-span-2 w-full p-2 border rounded bg-gray-50 min-h-[6rem] whitespace-pre-line"
            >
              {user.bio || 'No bio provided.'}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-gray-200 rounded-[15px] font-semibold hover:bg-gray-300 disabled:opacity-50 transition-all"
          >
            Edit Profile
          </button>
          <button 
            onClick={handleLogout}
            disabled={loading}
            className="px-6 py-2 bg-[#FFD7DF] text-[#FF0000] rounded-[15px] font-semibold hover:bg-[#FF0000] hover:text-white disabled:opacity-50"
          >
            Logout
          </button>
        </div>
      </main>

      {/* The Edit Profile Modal */}
      {isEditing && (
        <EditProfileModal
          currentUser={user}
          onClose={() => setIsEditing(false)}
          onSave={handleUpdateProfile}
          loading={loading}
        />
      )}
    </div>
  );
}

export default ProfilePage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/profile/EditProfileModal';
import SettingsSidebar from '../components/common/SettingsSidebar';
import { useAuth } from '../services/auth/authContext';
import { userApi } from '../services/api';
import { handleApiError, showSuccessToast } from '../services/utils/errorHandler';

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleUpdateProfile = async (updatedData, profileImage) => {
    try {
      setLoading(true);

      // Update profile data if any fields are provided
      if (Object.keys(updatedData).length > 0) {
        const response = await userApi.updateProfile(updatedData);
        updateUser(response.data);
      }

      // Update profile image if provided
      if (profileImage) {
        const imageResponse = await userApi.updateAvatar(profileImage);
        updateUser(imageResponse.data);
      }

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

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    const fileType = file.type.toLowerCase();
    if (!allowedTypes.includes(fileType)) {
      handleApiError({ message: 'Please upload a valid image file (JPEG, PNG, HEIC or WebP)' });
      return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      handleApiError({ message: 'Image size must be less than 5MB' });
      return;
    }

    try {
      setUploadingImage(true);

      // Pass the file directly - the API will handle FormData creation
      const response = await userApi.updateAvatar(file);

      // Update the user context with new avatar URL
      if (response.data && response.data.avatar) {
        updateUser({ ...user, avatar: response.data.avatar, profileImage: response.data.avatar });
      }

      showSuccessToast('Profile image updated successfully!');
    } catch (error) {
      handleApiError(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSidebarNavigation = (path) => {
    navigate(path);
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
    <div className="flex min-h-screen bg-[#FFFDEE]">
      {/* Reusable Settings Sidebar */}
      <SettingsSidebar />

      {/* Main Content (My Account details) */}
      <main className="flex-1 w-full p-6 sm:p-8 md:p-10 lg:p-[50px] overflow-x-hidden">
        <h1 className="geist text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-[#1A5632]">My Account</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-[20px] shadow-lg p-6 sm:p-8 lg:p-10 mb-6">
          <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-8 lg:gap-12">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4 border-4 border-[#C0FFB3]">
                {user.profileImage || user.avatar ? (
                  <img
                    src={user.profileImage || user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs mt-1">No Photo</span>
                  </div>
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
                  </div>
                )}
              </div>

              <label
                htmlFor="profile-image-upload"
                className={`px-4 py-2 text-sm sm:text-base bg-[#C0FFB3] text-[#1A5632] rounded-[10px] font-bold hover:bg-[#A0DF93] cursor-pointer transition-all mb-2 ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploadingImage ? 'Uploading...' : 'Change Photo'}
              </label>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                Joined: {formatDate(user.createdAt)}
              </p>
            </div>

            {/* User Details */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base lg:text-lg">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-600">Name</p>
                  <p className="text-lg font-medium">{user.name}</p>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-gray-600">Email</p>
                  <p className="text-lg font-medium break-all">{user.email}</p>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-gray-600">Age</p>
                  <p className="text-lg font-medium">{user.age || 'Not set'}</p>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-gray-600">Role</p>
                  <p className="text-lg font-medium capitalize">{user.role}</p>
                </div>

                <div className="col-span-1 sm:col-span-2 space-y-1">
                  <p className="font-semibold text-gray-600">Bio</p>
                  <div className="p-4 border-2 border-gray-200 rounded-[10px] bg-gray-50 min-h-[6rem] whitespace-pre-line">
                    {user.bio || 'No bio provided.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t-2 border-gray-200">
            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="px-6 py-3 text-base bg-[#C0FFB3] text-[#1A5632] rounded-[15px] font-bold hover:bg-[#A0DF93] disabled:opacity-50 transition-all"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-6 py-3 bg-[#FFD7DF] text-[#FF0000] rounded-[15px] font-bold hover:bg-[#FF0000] hover:text-white disabled:opacity-50 transition-all"
            >
              Logout
            </button>
          </div>
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
import React, { useState, useEffect } from 'react';

function EditProfileModal({ currentUser, onClose, onSave }) {
  // --- Form State (initialized with current user data) ---
  const [name, setName] = useState(currentUser.name || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [age, setAge] = useState(currentUser.age || '');
  const [profileImage, setProfileImage] = useState(null); // File object for upload

  // For password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file); // Store the file object for upload
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation for password change
    if (newPassword && newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    if (newPassword && !currentPassword) {
      alert("Please enter your current password to change it.");
      return;
    }

    // Prepare data according to backend API format
    const updatedData = {};

    // Only include fields that have values
    if (name.trim()) updatedData.name = name.trim();
    if (bio.trim()) updatedData.bio = bio.trim();
    if (age && !isNaN(age)) updatedData.age = parseInt(age);

    // Send password change separately if provided
    const passwordData = currentPassword && newPassword ? { currentPassword, newPassword } : null;

    onSave(updatedData, profileImage, passwordData); // Send data, image, and password separately
  };

  return (
    // Overlay for the modal
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 w-full">
      <div className="bg-white px-8 py-4 rounded-lg shadow-xl w-[600px] relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Edit My Account</h2>
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-600 text-2xl hover:text-gray-800"
        >
          &times;
        </button>

        <form onSubmit={handleSubmit} >
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-2">
              {profileImage ? (
                <img src={URL.createObjectURL(profileImage)} alt="Profile" className="w-full h-full object-cover" />
              ) : currentUser.profileImage ? (
                <img src={currentUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500 text-xs text-center">Upload Photo</span>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="hidden" 
              id="profile-pic-upload"
            />
            <label 
              htmlFor="profile-pic-upload" 
              className="cursor-pointer bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Upload Photo
            </label>
            <p className="text-sm text-gray-600 mt-2">Joined: {new Date(currentUser.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter your name" />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age:</label>
              <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter your age"
                min="1"
                max="150" />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio:</label>
              <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm h-24 resize-none"
                placeholder="Tell us about yourself..." />
            </div>

            {/* Password Change Section */}
            <div className="mt-6 pt-6 border-t border-gray-300">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Change Password (Optional)</h3>

              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password:</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xl"
                  >
                    {showPassword ? '👁️' : '🔒'}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 text-center">
            <button type="submit" className="px-8 py-3 bg-[#1A5632] text-[#FFD7DF] rounded-[15px] font-bold hover:bg-[#FFD7DF] hover:text-[#1A5632] transition-all duration-300">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
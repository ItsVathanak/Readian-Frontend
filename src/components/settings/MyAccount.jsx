import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePic from "../../assets/book-cover.svg";
import { useAuth } from "../../services/auth/authContext";
import { userApi } from "../../services/api";
import { handleApiError, showSuccessToast } from "../../services/utils/errorHandler";

const MyAccount = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    age: user?.age || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setProfile({
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await userApi.updateProfile(profile);
      updateUser(profile);
      showSuccessToast("Profile updated successfully!");
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-white p-10 font-[Inter] text-black">

      {/* NORMAL VIEW */}
      {!isEditing && (
        <div className="w-[900px] bg-white border border-black rounded-xl p-10 shadow-sm">
          <h1 className="text-4xl font-semibold text-center mb-10 text-black">My Account</h1>

            <div className="flex items-center gap-8 mb-10">
            {/* Profile Picture */}
            <div className="w-28 h-28 rounded-full border border-black overflow-hidden">
              <img
                src={user?.profileImage || ProfilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-black font-outfit">Joined: {formatDate(user?.createdAt)}</p>
          </div>

          <div className="space-y-6 text-xl">
            <div className="flex">
              <label className="w-48 font-semibold text-black">Name:</label>
              <p>{user?.name}</p>
            </div>

            <div className="flex">
              <label className="w-48 font-semibold text-black">Email:</label>
              <p>{user?.email}</p>
            </div>

            <div className="flex">
              <label className="w-48 font-semibold text-black">Age:</label>
              <p>{user?.age || 'Not set'}</p>
            </div>

            <div className="flex">
              <label className="w-48 font-semibold text-black">Role:</label>
              <p className="capitalize">{user?.role}</p>
            </div>

            <div className="flex">
              <label className="w-48 font-semibold text-black">Subscription:</label>
              <p className="capitalize">{user?.subscriptionStatus || 'inactive'}</p>
            </div>

            <div className="flex items-start">
              <label className="w-48 font-semibold text-black">Bio:</label>
              <div className="bg-white w-[400px] min-h-[80px] p-3 border border-black rounded-lg">
                {user?.bio || 'No bio provided.'}
              </div>
            </div>
          </div>

          <div className="flex gap-6 mt-12 text-black">
            <button
              onClick={handleEdit}
              className="px-6 py-3 border border-black rounded-lg bg-white text-xl hover:bg-gray-100"
            >
              Edit
            </button>

            <button
              onClick={handleLogout}
              className="px-6 py-3 rounded-lg bg-red-100 text-red-600 text-xl hover:bg-red-200"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* EDIT VIEW */}
      {isEditing && (
        <div className="w-[900px] bg-white border border-black rounded-xl p-10 shadow-sm">
          <h1 className="text-4xl font-semibold text-center mb-10">My Account</h1>

          <div className="flex flex-col items-center mb-12">
            {/* Profile Picture */}
            <div className="w-28 h-28 rounded-full border border-black overflow-hidden">
              <img
                src={ProfilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <button className="mt-4 px-4 py-2 border border-black rounded-lg text-base hover:bg-gray-100">
              Change Picture
            </button>
          </div>

          <div className="space-y-6 text-xl">
            <div className="flex items-center">
              <label className="w-48 font-semibold text-black">Name:</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-black rounded-lg"
              />
            </div>

            <div className="flex items-center">
              <label className="w-48 font-semibold text-black">Email:</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-black rounded-lg"
              />
            </div>

            <div className="flex items-center">
              <label className="w-48 font-semibold text-black">Age:</label>
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
                min="13"
                max="150"
                className="flex-1 px-3 py-2 border border-black rounded-lg"
              />
            </div>

            <div className="flex items-start">
              <label className="w-48 font-semibold text-black">Bio:</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-black rounded-lg min-h-[120px]"
              />
            </div>
          </div>

          <div className="flex gap-6 mt-12 text-black">
            <button
              onClick={handleSave}
              className="px-6 py-3 border border-black rounded-lg bg-green-100 text-xl hover:bg-green-200"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 border border-black rounded-lg bg-white text-xl hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/authContext';
import { handleApiError, showErrorToast } from '../services/utils/errorHandler';

function SignUpPage() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('reader');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      showErrorToast("Passwords do not match!");
      return;
    }

    // Password validation
    if (password.length < 8) {
      showErrorToast("Password must be at least 8 characters long");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      showErrorToast("Password must include at least one uppercase letter");
      return;
    }
    if (!/[0-9]/.test(password)) {
      showErrorToast("Password must include at least one number");
      return;
    }

    const age = calculateAge(dob);
    if (age < 13) {
      showErrorToast("You must be at least 13 years old to register");
      return;
    }

    try {
      setLoading(true);
      await register({
        name,
        email,
        password,
        age,
        role,
      });

      // Navigate to email verification page with email in state
      navigate('/verify-email', { state: { email } });
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Page background gradient
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#C0FFB3] to-[#FFFDEE]">
      
      {/* Form card with opposite gradient */}
      <form 
        onSubmit={handleSubmit}
        className="bg-gradient-to-b from-[#FFFDEE] to-[#C0FFB3] border border-black rounded-lg shadow-xl p-8 max-w-md w-full"
      >
        <h1 className="geist text-4xl font-bold text-center mb-8">Sign Up</h1>
        
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-semibold">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white"
              required
            />
          </div>
          
          {/* Date of Birth */}
          <div>
            <label className="block mb-1 font-semibold">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white"
              required
              max={new Date().toISOString().split('T')[0]}
            />
            {dob && (
              <p className="text-sm mt-1 text-gray-600">
                Age: {calculateAge(dob)} years
              </p>
            )}
          </div>
          
          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white"
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block mb-1 font-semibold">I want to register as:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white"
              required
            >
              <option value="reader">Reader</option>
              <option value="author">Author</option>
            </select>
          </div>
          
          {/* Password */}
          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white"
              required
              minLength={6}
            />
            <p className="text-xs text-gray-600 mt-1">Minimum 8 characters, must include one uppercase and one number</p>
          </div>
          
          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-semibold">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white"
              required
            />
          </div>
        </div>

        {/* Confirm Button */}
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-[#1A5632] text-[#FFD7DF] border-2 border-[#1A5632] py-3 rounded-lg font-bold mt-8 hover:bg-[#FFD7DF] hover:text-[#1A5632] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Confirm'}
        </button>

        {/* Link to Sign In */}
        <p className="text-sm text-center mt-6">
          Already have an account? 
          <Link to="/signin" className="font-semibold text-blue-600 hover:underline ml-1">
            Sign In here.
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignUpPage;
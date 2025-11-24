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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('READER');
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
          
          {/* Password */}
          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-12 border rounded-lg bg-white"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1">Minimum 8 characters, must include one uppercase and one number</p>
          </div>
          
          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-semibold">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 pr-12 border rounded-lg bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
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
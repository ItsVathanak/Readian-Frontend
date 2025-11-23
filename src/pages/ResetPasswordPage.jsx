import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authApi from '../services/api/authApi';
import { handleApiError, showSuccessToast } from '../services/utils/errorHandler';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(token ? 'reset' : 'verify');

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (verificationCode.length !== 6) {
      handleApiError({ message: 'Please enter a valid 6-digit code' });
      return;
    }

    try {
      setLoading(true);
      await authApi.verifyResetCode({ code: verificationCode });
      showSuccessToast('Code verified! Please enter your new password.');
      setStep('reset');
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      handleApiError({ message: 'Password must be at least 8 characters long' });
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      handleApiError({ message: 'Password must include at least one uppercase letter' });
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      handleApiError({ message: 'Password must include at least one number' });
      return;
    }

    if (newPassword !== confirmPassword) {
      handleApiError({ message: 'Passwords do not match' });
      return;
    }

    try {
      setLoading(true);
      await authApi.resetPassword({
        code: verificationCode,
        newPassword
      });
      showSuccessToast('Password reset successfully! Please login with your new password.');
      setTimeout(() => navigate('/signin'), 2000);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C0FFB3] via-white to-[#FFFDEE] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Reset Password
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          {step === 'verify'
            ? 'Enter the 6-digit code sent to your email'
            : 'Enter your new password'
          }
        </p>

        {step === 'verify' ? (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-center text-2xl tracking-widest"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Check your email for the verification code
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="w-full text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Back to Forgot Password
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 8 characters, must include one uppercase and one number
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;


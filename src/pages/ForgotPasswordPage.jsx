import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../services/api/authApi';
import { handleApiError, showSuccessToast, showErrorToast } from '../services/utils/errorHandler';

function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  // Resend timer countdown
  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleCodeChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`reset-code-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`reset-code-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      document.getElementById('reset-code-5')?.focus();
    }
  };

  // Step 1: Request reset code
  const handleRequestReset = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await authApi.forgotPassword(email);
      showSuccessToast('Reset code sent to your email!');
      setStep(2);
      setResendTimer(60);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify reset code
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    const resetCode = code.join('');
    if (resetCode.length !== 6) {
      showErrorToast('Please enter the complete 6-digit code');
      return;
    }

    try {
      setLoading(true);
      await authApi.verifyResetCode(email, resetCode);
      showSuccessToast('Code verified! Enter your new password.');
      setStep(3);
    } catch (error) {
      handleApiError(error);
      setCode(['', '', '', '', '', '']);
      document.getElementById('reset-code-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showErrorToast('Passwords do not match!');
      return;
    }

    if (newPassword.length < 6) {
      showErrorToast('Password must be at least 6 characters long');
      return;
    }

    const resetCode = code.join('');

    try {
      setLoading(true);
      await authApi.resetPassword(email, resetCode, newPassword);
      showSuccessToast('Password reset successful! You can now sign in.');
      navigate('/signin', { state: { email } });
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    try {
      setResendLoading(true);
      await authApi.forgotPassword(email);
      showSuccessToast('New reset code sent!');
      setResendTimer(60);
      setCode(['', '', '', '', '', '']);
      document.getElementById('reset-code-0')?.focus();
    } catch (error) {
      handleApiError(error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#C0FFB3] to-[#FFFDEE]">
      <div className="bg-gradient-to-b from-[#FFFDEE] to-[#C0FFB3] border border-black rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="geist text-4xl font-bold text-center mb-4">Reset Password</h1>

        {/* Step 1: Request Reset Code */}
        {step === 1 && (
          <form onSubmit={handleRequestReset}>
            <p className="text-center text-gray-600 mb-6">
              Enter your email address and we'll send you a reset code.
            </p>

            <div className="mb-6">
              <label className="block mb-2 font-semibold">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A5632] text-[#FFD7DF] border-2 border-[#1A5632] py-3 rounded-lg font-bold hover:bg-[#FFD7DF] hover:text-[#1A5632] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        )}

        {/* Step 2: Verify Code */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <p className="text-center text-gray-600 mb-6">
              Enter the 6-digit code sent to <strong>{email}</strong>
            </p>

            <div className="mb-6">
              <label className="block mb-2 font-semibold text-center">Reset Code</label>
              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`reset-code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg bg-white focus:border-[#1A5632] focus:ring-2 focus:ring-[#1A5632] focus:outline-none transition-all"
                    required
                  />
                ))}
              </div>
            </div>

            <div className="text-center mb-6">
              {resendTimer > 0 ? (
                <p className="text-sm text-gray-600">
                  Resend code in {resendTimer} seconds
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendLoading}
                  className="text-sm text-[#1A5632] font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? 'Sending...' : "Didn't receive the code? Resend"}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A5632] text-[#FFD7DF] border-2 border-[#1A5632] py-3 rounded-lg font-bold hover:bg-[#FFD7DF] hover:text-[#1A5632] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <p className="text-center text-gray-600 mb-6">
              Enter your new password
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block mb-2 font-semibold">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-600 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block mb-2 font-semibold">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A5632] text-[#FFD7DF] border-2 border-[#1A5632] py-3 rounded-lg font-bold hover:bg-[#FFD7DF] hover:text-[#1A5632] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Back to Sign In */}
        <p className="text-sm text-center mt-6">
          <Link to="/signin" className="font-semibold text-blue-600 hover:underline">
            ← Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;


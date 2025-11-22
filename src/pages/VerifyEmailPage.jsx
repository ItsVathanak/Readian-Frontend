import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authApi from '../services/api/authApi';
import { handleApiError, showSuccessToast, showErrorToast } from '../services/utils/errorHandler';

function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state or allow manual entry
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleCodeChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Check if pasted data is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      // Focus last input
      document.getElementById('code-5')?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      showErrorToast('Please enter your email address');
      return;
    }

    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      showErrorToast('Please enter the complete 6-digit code');
      return;
    }

    try {
      setLoading(true);
      await authApi.verifyEmail(email, verificationCode);
      showSuccessToast('Email verified successfully! You can now sign in.');
      navigate('/signin', { state: { email } });
    } catch (error) {
      handleApiError(error);
      // Clear the code on error
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      showErrorToast('Please enter your email address');
      return;
    }

    if (resendTimer > 0) {
      return;
    }

    try {
      setResendLoading(true);
      await authApi.resendVerificationCode(email);
      showSuccessToast('Verification code sent! Check your email.');
      setResendTimer(60); // 60 seconds cooldown
      setCode(['', '', '', '', '', '']); // Clear code inputs
      document.getElementById('code-0')?.focus();
    } catch (error) {
      handleApiError(error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#C0FFB3] to-[#FFFDEE]">
      <form
        onSubmit={handleVerify}
        className="bg-gradient-to-b from-[#FFFDEE] to-[#C0FFB3] border border-black rounded-lg shadow-xl p-8 max-w-md w-full"
      >
        <h1 className="geist text-4xl font-bold text-center mb-4">Verify Email</h1>
        <p className="text-center text-gray-600 mb-8">
          We've sent a 6-digit verification code to your email address. Please enter it below.
        </p>

        <div className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block mb-2 font-semibold">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white"
              placeholder="your.email@example.com"
              required
              disabled={location.state?.email} // Disable if email came from navigation
            />
          </div>

          {/* Verification Code Inputs */}
          <div>
            <label className="block mb-2 font-semibold text-center">Verification Code</label>
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
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

          {/* Resend Code */}
          <div className="text-center">
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
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1A5632] text-[#FFD7DF] border-2 border-[#1A5632] py-3 rounded-lg font-bold mt-8 hover:bg-[#FFD7DF] hover:text-[#1A5632] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        {/* Back to Sign In */}
        <p className="text-sm text-center mt-6">
          <Link to="/signin" className="font-semibold text-blue-600 hover:underline">
            ← Back to Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default VerifyEmailPage;


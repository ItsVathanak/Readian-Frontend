import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pen, BookOpen, TrendingUp, Award, Users, Sparkles } from 'lucide-react';
import SettingsSidebar from '../components/common/SettingsSidebar';
import { userApi } from '../services/api';
import { handleApiError, showSuccessToast } from '../services/utils/errorHandler';
import { useAuth } from '../services/auth/authContext';

const BecomeAuthorPage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // Check if already an author
  if (user?.role === 'AUTHOR' || user?.role === 'ADMIN') {
    return (
      <div className="flex min-h-screen bg-[#FFFDEE]">
        <SettingsSidebar />
        <div className="flex-1 bg-gradient-to-b from-[#C0FFB3] via-white to-[#FFFDEE] py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <Award className="w-20 h-20 mx-auto text-green-600 mb-6" />
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                You're Already an Author! 🎉
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Start creating amazing stories for your readers.
              </p>
              <button
                onClick={() => navigate('/authordash')}
                className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
              >
                Go to Author Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleBecomeAuthor = async () => {
    try {
      setLoading(true);
      await userApi.becomeAuthor();

      // Update user context
      updateUser({ role: 'AUTHOR' });

      showSuccessToast('Welcome to the author community! 🎉');

      // Redirect to author dashboard
      setTimeout(() => {
        navigate('/authordash');
      }, 1500);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <Pen className="w-8 h-8" />,
      title: 'Publish Your Stories',
      description: 'Share your creative work with thousands of readers around the world.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Create & Manage',
      description: 'Easy-to-use tools to write, edit, and organize your books and chapters.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Track Your Growth',
      description: 'Analytics dashboard showing views, likes, downloads, and reader engagement.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Build Your Audience',
      description: 'Connect with readers who love your genre and writing style.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Verified Author Badge',
      description: 'Get recognized as a verified author across the platform.',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Premium Features',
      description: 'Offer premium content and track your earnings.',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#FFFDEE]">
      <SettingsSidebar />
      <div className="flex-1 bg-gradient-to-b from-[#C0FFB3] via-white to-[#FFFDEE] py-12 px-4 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Join Our Creator Community
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your passion for storytelling into a rewarding journey.
            Share your stories with readers who can't wait to discover them.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBecomeAuthor}
              disabled={loading || !user}
              className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              {loading ? 'Processing...' : user ? 'Become an Author (Free!)' : 'Sign In to Start'}
            </button>
            <button
              onClick={() => navigate('/browse')}
              className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg"
            >
              Continue Reading
            </button>
          </div>

          {!user && (
            <p className="text-sm text-gray-500 mt-4">
              Need an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-green-600 hover:text-green-700 underline"
              >
                Sign up here
              </button>
            </p>
          )}
        </div>

        {/* Benefits Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            What You Get as an Author
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Click "Become an Author"', desc: 'Instant upgrade, no approval needed' },
              { step: '2', title: 'Create Your First Book', desc: 'Use our easy-to-use editor' },
              { step: '3', title: 'Publish & Share', desc: 'Make your work available to readers' },
              { step: '4', title: 'Grow Your Audience', desc: 'Track stats and engage with readers' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            {[
              {
                q: 'Is it free to become an author?',
                a: 'Yes! Becoming an author is completely free. Just click the button and start creating.'
              },
              {
                q: 'Do I need approval?',
                a: 'No approval needed! Instant upgrade with one click. Start publishing immediately.'
              },
              {
                q: 'Can I earn money?',
                a: 'Yes! You can offer premium content and readers can support you through subscriptions.'
              },
              {
                q: 'What if I change my mind?',
                a: 'You can always unpublish your books or stop being an author anytime you want.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Start Your Author Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of authors sharing their stories on Readian.
          </p>
          <button
            onClick={handleBecomeAuthor}
            disabled={loading || !user}
            className="px-12 py-5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            {loading ? 'Processing...' : user ? 'Become an Author Now' : 'Sign In to Get Started'}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeAuthorPage;


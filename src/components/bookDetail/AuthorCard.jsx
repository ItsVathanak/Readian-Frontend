import React from 'react';
import { User, BookOpen, Award } from 'lucide-react';

const AuthorCard = ({ author, bookCount = 0 }) => {
  // Handle both populated author object and just ID
  const authorData = {
    _id: author?._id || author,
    name: author?.name || 'Unknown Author',
    avatar: author?.avatar || null,
    bio: author?.bio || null,
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl">
      <h3 className="text-xl font-bold text-gray-800 mb-4">About the Author</h3>

      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          {authorData.avatar ? (
            <img
              src={authorData.avatar}
              alt={authorData.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-green-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
          )}
        </div>

        {/* Author Info */}
        <div className="flex-1">
          <h4 className="text-2xl font-bold text-gray-800 mb-2">
            {authorData.name}
          </h4>

          {authorData.bio && (
            <p className="text-gray-600 mb-4 leading-relaxed">
              {authorData.bio}
            </p>
          )}

          {!authorData.bio && (
            <p className="text-gray-500 italic mb-4">
              No bio available
            </p>
          )}

          {/* Author Stats */}
          <div className="flex items-center gap-6 text-sm">
            {bookCount > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span>
                  {bookCount} {bookCount === 1 ? 'Book' : 'Books'}
                </span>
              </div>
            )}

            {author?.role === 'AUTHOR' && (
              <div className="flex items-center gap-2 text-green-600">
                <Award className="w-4 h-4" />
                <span className="font-semibold">Verified Author</span>
              </div>
            )}
          </div>

          {/* View Profile Link (future feature) */}
          {/*
          <Link
            to={`/author/${authorData._id}`}
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-semibold text-sm"
          >
            View Author Profile →
          </Link>
          */}
        </div>
      </div>
    </div>
  );
};

export default AuthorCard;


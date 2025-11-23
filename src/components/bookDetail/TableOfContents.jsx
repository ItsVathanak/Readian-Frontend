import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const TableOfContents = ({ bookId, chapters = [], isPremium = false, canAccess = true }) => {
  if (!chapters || chapters.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Table of Contents</h3>
        <p className="text-gray-500 text-center py-8">No chapters available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Table of Contents</h3>

      <div className="space-y-3">
        {chapters.map((chapter, index) => {
          const chapterNumber = chapter.chapterNumber || index + 1;
          const isLocked = isPremium && !canAccess;

          return (
            <Link
              key={chapter._id || index}
              to={`/book/${bookId}/chapter/${chapterNumber}`}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                isLocked
                  ? 'bg-gray-100 cursor-not-allowed opacity-60'
                  : 'bg-gray-50 hover:bg-green-50 hover:shadow-md'
              }`}
              onClick={(e) => isLocked && e.preventDefault()}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm">
                  {chapterNumber}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate">
                    {chapter.title || `Chapter ${chapterNumber}`}
                  </h4>
                  {chapter.readingTime && (
                    <p className="text-xs text-gray-500">
                      {chapter.readingTime}
                    </p>
                  )}
                </div>
              </div>

              {isLocked && (
                <Lock className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
              )}
            </Link>
          );
        })}
      </div>

      {isPremium && !canAccess && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-semibold mb-2">
            🔒 Premium Content
          </p>
          <p className="text-xs text-yellow-700 mb-3">
            Subscribe to unlock all chapters of this book
          </p>
          <Link
            to="/subscribe"
            className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-700 transition-colors"
          >
            Subscribe Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default TableOfContents;


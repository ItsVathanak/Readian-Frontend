import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Menu, X, BookOpen } from 'lucide-react';

const ChapterNavigation = ({
  bookId,
  currentChapter,
  allChapters = [],
  prevChapter,
  nextChapter
}) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get current chapter number from the currentChapter object
  const currentChapterNumber = currentChapter?.chapterNumber || 1;
  const hasPrevious = !!prevChapter;
  const hasNext = !!nextChapter;

  const handleChapterClick = (chapterNumber) => {
    navigate(`/book/${bookId}/chapter/${chapterNumber}`);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Back to Book */}
            <Link
              to={`/book/${bookId}`}
              className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Book</span>
            </Link>

            {/* Center: Chapter Info */}
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-800">
                Chapter {currentChapterNumber}
              </span>
            </div>

            {/* Right: Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {isSidebarOpen ? (
                <>
                  <X className="w-5 h-5" />
                  <span className="hidden sm:inline">Close</span>
                </>
              ) : (
                <>
                  <Menu className="w-5 h-5" />
                  <span className="hidden sm:inline">Chapters</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom: Prev/Next Navigation */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => hasPrevious && navigate(`/book/${bookId}/chapter/${currentChapterNumber - 1}`)}
              disabled={!hasPrevious}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                hasPrevious
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Previous</span>
            </button>

            <span className="text-sm text-gray-500">
              {currentChapterNumber} of {allChapters.length}
            </span>

            <button
              onClick={() => hasNext && navigate(`/book/${bookId}/chapter/${currentChapterNumber + 1}`)}
              disabled={!hasNext}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                hasNext
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span className="text-sm">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Chapters List */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b z-10">
            <h3 className="text-xl font-bold text-gray-800">All Chapters</h3>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chapters List */}
          <div className="space-y-2">
            {allChapters.map((chapter, index) => {
              const chapterNum = chapter.chapterNumber || index + 1;
              const isActive = chapterNum === currentChapterNumber;

              return (
                <button
                  key={chapter._id || index}
                  onClick={() => handleChapterClick(chapterNum)}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    isActive
                      ? 'bg-green-100 border-2 border-green-600'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isActive
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {chapterNum}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">
                        {chapter.title || `Chapter ${chapterNum}`}
                      </h4>
                      {chapter.readingTime && (
                        <p className="text-xs text-gray-500 mt-1">
                          {chapter.readingTime} min read
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Empty State */}
          {allChapters.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No chapters available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChapterNavigation;


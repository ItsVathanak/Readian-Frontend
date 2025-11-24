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
      <div className="sticky top-0 z-[100] bg-white border-b border-gray-200 shadow-sm">
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

            {/* Right: Chapters Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Menu className="w-5 h-5" />
                <span className="hidden sm:inline">Chapters</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isSidebarOpen ? 'rotate-90' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isSidebarOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-[90]"
                    onClick={() => setIsSidebarOpen(false)}
                  />

                  {/* Dropdown Content */}
                  <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-lg shadow-2xl border border-gray-200 z-[100] max-h-[70vh] overflow-hidden flex flex-col">
                    {/* Dropdown Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                      <h3 className="text-lg font-bold text-gray-800">All Chapters</h3>
                      <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Chapters List - Scrollable */}
                    <div className="overflow-y-auto flex-1">
                      <div className="p-3 space-y-1">
                        {allChapters.length > 0 ? (
                          allChapters.map((chapter, index) => {
                            const chapterNum = chapter.chapterNumber || index + 1;
                            const isActive = chapterNum === currentChapterNumber;

                            return (
                              <button
                                key={chapter._id || index}
                                onClick={() => handleChapterClick(chapterNum)}
                                className={`w-full text-left p-3 rounded-lg transition-all ${
                                  isActive
                                    ? 'bg-green-100 border-2 border-green-600'
                                    : 'hover:bg-gray-100 border-2 border-transparent'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                      isActive
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}
                                  >
                                    {chapterNum}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-800 text-sm truncate">
                                      {chapter.title || `Chapter ${chapterNum}`}
                                    </h4>
                                    {chapter.readingTime && (
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        {chapter.readingTime} min read
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No chapters available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
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
    </>
  );
};

export default ChapterNavigation;


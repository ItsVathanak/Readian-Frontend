import React from 'react';
import { Eye, Heart, Download, Star, BookOpen } from 'lucide-react';

const BookStats = ({ book }) => {
  const stats = [
    {
      icon: <Eye className="w-5 h-5" />,
      label: 'Views',
      value: book.viewCount || 0,
      color: 'text-blue-500'
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: 'Likes',
      value: book.likes || book.likedBy?.length || 0,
      color: 'text-red-500'
    },
    {
      icon: <Download className="w-5 h-5" />,
      label: 'Downloads',
      value: book.downloadCount || 0,
      color: 'text-green-500'
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: 'Rating',
      value: book.averageRating ? `${book.averageRating.toFixed(1)}/5` : 'N/A',
      subValue: book.totalRatings ? `(${book.totalRatings} ratings)` : '',
      color: 'text-yellow-500'
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: 'Chapters',
      value: book.totalChapters || book.chapters?.length || 0,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Book Statistics</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className={`${stat.color} mb-2`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            {stat.subValue && (
              <p className="text-xs text-gray-500 mt-1">{stat.subValue}</p>
            )}
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookStats;


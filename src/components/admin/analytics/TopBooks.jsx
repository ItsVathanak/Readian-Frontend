import React, { useState } from "react";

const TopBooks = ({ books = [] }) => {
  const [sortKey, setSortKey] = useState('views');
  const [sortOrder, setSortOrder] = useState('desc');

  // Sort books based on current sort key and order
  const sortedBooks = [...books].sort((a, b) => {
    const aVal = a[sortKey] || 0;
    const bVal = b[sortKey] || 0;
    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
  });

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-6">Top Books by Views</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-green-200">
            <tr>
              <th className="border px-4 py-2 text-left">#</th>
              <th className="border px-4 py-2 text-left">Title</th>
              <th className="border px-4 py-2 text-left">Author</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Chapters</th>
              <th
                className="border px-4 py-2 text-left cursor-pointer hover:bg-green-300"
                onClick={() => handleSort('views')}
              >
                Views {sortKey === 'views' && (sortOrder === 'desc' ? '↓' : '↑')}
              </th>
              <th
                className="border px-4 py-2 text-left cursor-pointer hover:bg-green-300"
                onClick={() => handleSort('likes')}
              >
                Likes {sortKey === 'likes' && (sortOrder === 'desc' ? '↓' : '↑')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedBooks.length > 0 ? (
              sortedBooks.map((book, index) => (
                <tr key={book.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{book.title}</td>
                  <td className="border px-4 py-2">{book.author || 'Unknown'}</td>
                  <td className="border px-4 py-2">{book.status || 'N/A'}</td>
                  <td className="border px-4 py-2">{book.chapters || 0}</td>
                  <td className="border px-4 py-2">{book.views || 0}</td>
                  <td className="border px-4 py-2">{book.likes || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="border px-4 py-8 text-center text-gray-500">
                  No books data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopBooks;


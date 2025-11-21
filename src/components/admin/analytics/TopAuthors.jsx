import React, { useState } from "react";

const TopAuthors = ({ authors = [] }) => {
  const [sortOrder, setSortOrder] = useState('desc');

  // Sort authors based on current sort order
  const sortedAuthors = [...authors].sort((a, b) => {
    const aVal = a.totalViews || 0;
    const bVal = b.totalViews || 0;
    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
  });

  const toggleSort = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-6">Top Authors</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-green-200">
            <tr>
              <th className="border px-4 py-2 text-left">#</th>
              <th className="border px-4 py-2 text-left">Author Name</th>
              <th className="border px-4 py-2 text-left">Total Books</th>
              <th
                className="border px-4 py-2 text-left cursor-pointer hover:bg-green-300"
                onClick={toggleSort}
              >
                Total Views {sortOrder === 'desc' ? '↓' : '↑'}
              </th>
              <th className="border px-4 py-2 text-left">Followers</th>
            </tr>
          </thead>
          <tbody>
            {sortedAuthors.length > 0 ? (
              sortedAuthors.map((author, index) => (
                <tr key={author.id || index} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{author.name}</td>
                  <td className="border px-4 py-2">{author.totalBooks || 0}</td>
                  <td className="border px-4 py-2">{author.totalViews || 0}</td>
                  <td className="border px-4 py-2">{author.followers || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border px-4 py-8 text-center text-gray-500">
                  No authors data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopAuthors;


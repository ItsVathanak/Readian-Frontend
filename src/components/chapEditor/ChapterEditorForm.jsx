import React from 'react';

const ChapterEditorForm = ({ title, setTitle, content, setContent, onSave, saving }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-6 text-[#1A5632]'>Chapter Content</h2>

      {/* Title */}
      <div className='mb-6'>
        <label className='block font-semibold mb-2 text-gray-700'>
          Chapter Title *
        </label>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Enter chapter title'
          className='w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1A5632] focus:outline-none text-lg'
          required
        />
      </div>

      {/* Content */}
      <div className='mb-6'>
        <label className='block font-semibold mb-2 text-gray-700'>
          Chapter Content *
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Write your chapter content here...'
          className='w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1A5632] focus:outline-none text-lg resize-none'
          rows={20}
          required
        />
        <p className='text-sm text-gray-500 mt-2'>
          Character count: {content.length}
        </p>
      </div>

      {/* Save Button */}
      <button
        type='submit'
        disabled={saving}
        className='w-full bg-[#1A5632] text-white p-3 rounded-lg font-bold text-lg hover:bg-[#00A819] transition-all disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {saving ? 'Saving...' : 'Save Chapter'}
      </button>
    </form>
  );
};

export default ChapterEditorForm;


import React, { useState, useEffect } from 'react';

const BookEditForm = ({
  title, setTitle,
  description, setDescription,
  status, setStatus,
  bookStatus, setBookStatus,
  tags, setTags,
  genre, setGenre,
  premiumStatus, setPremiumStatus,
  contentType, setContentType,
  coverImageUrl,
  onImageUpload,
  uploadingImage,
  onSave,
  saving
}) => {
  const [tagInput, setTagInput] = useState('');
  const [genreInput, setGenreInput] = useState('');

  useEffect(() => {
    if (premiumStatus === undefined) {
      setPremiumStatus(false);
    }
  }, [premiumStatus, setPremiumStatus]);

  const handleAddTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setTagInput('');
  };

  const handleDeleteTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddGenre = () => {
    const newGenre = genreInput.trim();
    if (newGenre && !genre.includes(newGenre)) {
      setGenre([...genre, newGenre]);
    }
    setGenreInput('');
  };

  const handleDeleteGenre = (genreToRemove) => {
    setGenre(genre.filter(g => g !== genreToRemove));
  };

  const handleKeyPress = (e, handler) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handler();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-[50px] w-full max-w-[910px] px-4 lg:px-0">
      {/* Cover Image - Same pattern as profile image */}
      <div className="w-full lg:w-[220px]">
        <div className="relative w-full h-[330px] bg-gray-300 rounded-[15px] flex items-center justify-center overflow-hidden mb-[20px]">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt="Book Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <svg className="w-16 h-16 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-center">No Cover Image</span>
            </div>
          )}
          {uploadingImage && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          onChange={onImageUpload}
          disabled={uploadingImage}
          className="hidden"
          id="cover-upload"
        />
        <label
          htmlFor="cover-upload"
          className={`w-full p-2 bg-black text-[#FFD7DF] rounded-[10px] cursor-pointer block text-center hover:bg-gray-800 transition-all ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploadingImage ? 'Uploading...' : 'Upload Cover'}
        </label>
        <p className="text-xs text-gray-500 mt-2 text-center">
          JPEG, PNG, WebP or HEIC (Max 5MB)
        </p>
      </div>

      {/* Story Details Form */}
      <form
        className="w-full lg:w-[640px] bg-[#C0FFB3] p-4 sm:p-6 rounded-[20px] border-b-2 border-r-2 border-black"
        onSubmit={onSave}
      >
        <h2 className="geist text-xl sm:text-2xl font-bold mb-4">Story Details</h2>

        {/* Title */}
        <label className="geist block font-semibold mb-1">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-[10px] mb-4 bg-white"
          required
        />

        {/* Description */}
        <label className="geist block font-semibold mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-[10px] mb-4 h-32 bg-white"
        />

        {/* Tags */}
        <label className="geist block font-semibold mb-1">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleAddTag)}
            className="w-full p-2 border rounded-[10px] bg-white"
            placeholder="Add a tag and press Enter"
          />
          <button type="button" onClick={handleAddTag} className="bg-gray-700 text-[#FFD7DF] px-4 rounded-[10px]">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span key={tag} className="bg-white px-2 py-1 rounded-full text-sm border-2 border-white hover:border-black">
              {tag}
              <button type="button" onClick={() => handleDeleteTag(tag)} className="ml-1 font-bold">X</button>
            </span>
          ))}
        </div>

        {/* Genre */}
        <label className="geist block font-semibold mb-1">Genre</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleAddGenre)}
            className="w-full p-2 border rounded-[10px] bg-white"
            placeholder="Add a genre and press Enter"
          />
          <button type="button" onClick={handleAddGenre} className="bg-gray-700 text-[#FFD7DF] px-4 rounded-[10px]">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {genre.map((g) => (
            <span key={g} className="bg-white px-2 py-1 rounded-full text-sm border-2 border-white hover:border-black">
              {g}
              <button type="button" onClick={() => handleDeleteGenre(g)} className="ml-1 font-bold">X</button>
            </span>
          ))}
        </div>

        {/* Book Status */}
        <label className="block font-semibold mb-1">Book Status</label>
        <div className="mb-4">
          <label className="mr-4">
            <input type="radio" value="ongoing" checked={bookStatus === 'ongoing'} onChange={(e) => setBookStatus(e.target.value)} className="mr-1" />
            Ongoing
          </label>
          <label className="mr-4">
            <input type="radio" value="finished" checked={bookStatus === 'finished'} onChange={(e) => setBookStatus(e.target.value)} className="mr-1" />
            Finished
          </label>
          <label className="mr-4">
            <input type="radio" value="hiatus" checked={bookStatus === 'hiatus'} onChange={(e) => setBookStatus(e.target.value)} className="mr-1" />
            Hiatus
          </label>
        </div>

        {/* Content Type (Age Restriction) */}
        <label className="block font-semibold mb-1">Content Type</label>
        <div className="mb-4">
          <label className="mr-4">
            <input
              type="radio"
              value="kids"
              checked={contentType === 'kids'}
              onChange={(e) => setContentType(e.target.value)}
              className="mr-1"
            />
            Kids Friendly
          </label>
          <label>
            <input
              type="radio"
              value="adult"
              checked={contentType === 'adult'}
              onChange={(e) => setContentType(e.target.value)}
              className="mr-1"
            />
            Adult (18+)
          </label>
        </div>

        {/* Premium Status */}
        <label className="block font-semibold mb-1 mt-4">Premium Status</label>
        <div className="mb-4">
          <label className="mr-4">
            <input
              type="radio"
              value={false}
              checked={premiumStatus === false}
              onChange={() => setPremiumStatus(false)}
              className="mr-1"
            />
            Free
          </label>
          <label>
            <input
              type="radio"
              value={true}
              checked={premiumStatus === true}
              onChange={() => setPremiumStatus(true)}
              className="mr-1"
            />
            Premium
          </label>
        </div>

        {/* Publication Status (for manual control) */}
        <label className="block font-semibold mb-1 mt-4">Publication Status</label>
        <div className="mb-4">
          <label className="mr-4">
            <input
              type="radio"
              value="draft"
              checked={status === 'draft'}
              onChange={(e) => setStatus(e.target.value)}
              className="mr-1"
            />
            Draft
          </label>
          <label>
            <input
              type="radio"
              value="published"
              checked={status === 'published'}
              onChange={(e) => setStatus(e.target.value)}
              className="mr-1"
            />
            Published
          </label>
        </div>

        <button
          type="submit"
          disabled={saving || uploadingImage}
          className="w-full bg-[#1A5632] text-[#FFD7DF] p-3 rounded-lg font-bold hover:bg-[#FFD7DF] hover:text-[#1A5632] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Book'}
        </button>
      </form>
    </div>
  );
};

export default BookEditForm;

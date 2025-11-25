import React from 'react'
import { useState } from 'react';

const BookEditForm = ({title, setTitle, description, setDescription, status, setStatus, tags, setTags, genre, setGenre, premiumStatus, setPremiumStatus, coverImage, setCoverImage, existingCoverUrl, onSave}) => {

    const [tagInput, setTagInput] = useState('');
    const [genreInput, setGenreInput] = useState('');
    const [coverPreview, setCoverPreview] = useState(existingCoverUrl || null);
    const [uploadingCover, setUploadingCover] = useState(false);

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

    const handleCoverUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
        if (!allowedTypes.includes(file.type.toLowerCase())) {
            alert('Please upload a valid image file (JPEG, PNG, HEIC or WebP)');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('Image size must be less than 5MB');
            return;
        }

        setCoverImage(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-[50px] w-full max-w-[910px] px-4 lg:px-0">

        {/* Cover Image */}
        <div className="w-full lg:w-[220px]">
            <div className="w-full h-[330px] bg-gray-300 rounded-[15px] flex items-center justify-center text-black mb-[20px] overflow-hidden">
                {coverPreview ? (
                    <img
                        src={coverPreview}
                        alt="Book Cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-gray-600">No Cover Image</span>
                )}
            </div>
            <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic"
                onChange={handleCoverUpload}
                disabled={uploadingCover}
                className="hidden"
                id="cover-upload"
            />
            <label
                htmlFor="cover-upload"
                className={`w-full p-2 bg-black text-[#FFD7DF] rounded-[10px] cursor-pointer block text-center hover:bg-gray-800 transition-all ${uploadingCover ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {uploadingCover ? 'Uploading...' : 'Upload Image'}
            </label>
        </div>

        {/* Story Details Form */}
        <form 
            className="w-full lg:w-[640px] bg-[#C0FFB3] p-4 sm:p-6 rounded-[20px] border-b-2 border-r-2 border-black"
            onSubmit={onSave}
        >
            <h2 className="geist text-xl sm:text-2xl font-bold mb-4">Story Details</h2>

            {/* Title */}
            <label className="geist block font-semibold mb-1">Title</label>
            <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-[10px] mb-4 bg-white"
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
                    className="w-full p-2 border rounded-[10px] bg-white"
                    placeholder="Add a tag"
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
                    className="w-full p-2 border rounded-[10px] bg-white"
                    placeholder="Add a genre"
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

            {/* Status */}
            <label className="block font-semibold mb-1">Status</label>
            <div className="mb-4">
                <label className="mr-4">
                <input type="radio" value="ongoing" checked={status === 'ongoing'} onChange={(e) => setStatus(e.target.value)} className="mr-1" />
                    Ongoing
                </label>
                <label className="mr-4">
                <input type="radio" value="finished" checked={status === 'finished'} onChange={(e) => setStatus(e.target.value)} className="mr-1" />
                    Finished
                </label>
            </div>

{/* Premium Toggle */}
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

        
            <button type="submit" className="w-full bg-[#1A5632] text-[#FFD7DF] p-3 rounded-lg font-bold hover:bg-[#FFD7DF] hover:text-[#1A5632] transition-all duration-300">
                Save
            </button>
        </form>
        </div>
    )
}

export default BookEditForm

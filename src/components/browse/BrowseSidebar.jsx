import React, { useState } from 'react'

const BrowseSidebar = ({title,setTitle,author,setAuthor,status,setStatus,tags,setTags,genre,setGenre,minLikes,setMinLikes}) => {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='lg:hidden fixed bottom-6 right-6 z-50 bg-[#1A5632] text-white p-4 rounded-full shadow-lg hover:bg-[#FFD7DF] hover:text-[#1A5632] transition-all'
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      </button>

      {/* Overlay for mobile - only visible behind sidebar */}
      {isOpen && (
        <div
          className='lg:hidden fixed inset-0 bg-black/50 z-40'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        onClick={(e) => e.stopPropagation()}
        className={`
        fixed lg:sticky
        top-0 lg:top-24
        left-0 lg:left-0
        h-screen lg:h-fit
        w-[280px] sm:w-[320px] lg:w-[280px] xl:w-[320px]
        bg-[#C0FFB3]
        lg:rounded-r-[50px] rounded-r-[20px]
        flex flex-col items-center gap-4
        p-6 sm:p-[30px] lg:py-[50px]
        my-0 lg:my-10
        z-50 lg:z-20
        transition-transform duration-300
        overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex-shrink-0
      `}>
        {/* Close button for mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className='lg:hidden self-end text-2xl font-bold mb-2'
        >
          ×
        </button>

        <h1 className='geist text-[20px] sm:text-[24px] font-bold text-center'>
            Browse stories
        </h1>
        <h2 className='geist text-[18px] sm:text-[20px]'>
            Filter
        </h2>

        {/* Title */}
        <div>
            <label>Title:</label><br />
            <input 
                type="text"
                placeholder='Search Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='bg-white rounded-[10px] p-2'
            />
        </div>

        {/* Author filter */}
        <div className='w-full'>
            <label>Author:</label><br />
            <input 
                type="text"
                placeholder='Filter by author'
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className='bg-white rounded-[10px] p-2 w-full'
            />
        </div>

        {/* Status filter */}
        <div className='flex flex-col gap-1 self-start'>
            <label>Status:</label>

            <label className='cursor-pointer flex items-center gap-2'>
                <div className='size-[15px]'>
                    <input 
                    type="radio" 
                    value="All" 
                    checked={status === 'All'} 
                    onChange={(e) => setStatus(e.target.value)} 
                    className='opacity-0 peer absolute'
                    />
                    <svg className=" size-full pointer-events-none" fill="none"  viewBox="0 0 15 15">
                        <circle cx="7.5" cy="7.5" fill={status === "All" ? "black" : "white"} r="6.5" stroke="black" strokeWidth="2" />
                    </svg>
                </div>
                <p>All</p>
            </label>

            <label className='cursor-pointer flex items-center gap-2'>
                <div className='size-[15px]'>
                    <input 
                    type="radio" 
                    value="finished"
                    checked={status === 'finished'}
                    onChange={(e) => setStatus(e.target.value)}
                    className='opacity-0 peer absolute'
                    />
                    <svg className=" size-full pointer-events-none" fill="none" viewBox="0 0 15 15">
                        <circle cx="7.5" cy="7.5" fill={status === "finished" ? "black" : "white"} r="6.5" stroke="black" strokeWidth="2" />
                    </svg>
                </div>
                <p>Finished</p>
            </label>

            <label className='cursor-pointer flex items-center gap-2'>
                <div className='size-[15px]'>
                    <input 
                    type="radio" 
                    value="ongoing"
                    checked={status === 'ongoing'}
                    onChange={(e) => setStatus(e.target.value)}
                    className='opacity-0 peer absolute'
                    /> 
                    <svg className=" size-full pointer-events-none" fill="none" viewBox="0 0 15 15">
                        <circle cx="7.5" cy="7.5" fill={status === "ongoing" ? "black" : "white"} r="6.5" stroke="black" strokeWidth="2" />
                    </svg>
                </div>
                <p>Ongoing</p>
            </label>

            <label className='cursor-pointer flex items-center gap-2'>
                <div className='size-[15px]'>
                    <input
                    type="radio"
                    value="hiatus"
                    checked={status === 'hiatus'}
                    onChange={(e) => setStatus(e.target.value)}
                    className='opacity-0 peer absolute'
                    />
                    <svg className=" size-full pointer-events-none" fill="none" viewBox="0 0 15 15">
                        <circle cx="7.5" cy="7.5" fill={status === "hiatus" ? "black" : "white"} r="6.5" stroke="black" strokeWidth="2" />
                    </svg>
                </div>
                <p>Hiatus</p>
            </label>

            {/* <div>
                <svg className="block size-full pointer-events-none" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                    <circle cx="7.5" cy="7.5" fill={status === "All" ? "black" : "white"} r="6.5" stroke="black" strokeWidth="2" />
                </svg>
                <input type="radio" value="All" checked={status === 'All'} onChange={(e) => setStatus(e.target.value)} /> All
            </div>
            <div>
                <input type="radio" value="Completed" checked={status === 'Completed'} onChange={(e) => setStatus(e.target.value)} /> Completed
            </div>
            <div>
                <input type="radio" value="Ongoing" checked={status === 'Ongoing'} onChange={(e) => setStatus(e.target.value)} /> Ongoing
            </div> */}
        </div>

        {/* Genre Filter - Available to all users */}
        <div className='w-full relative'>
            <label>Genre:</label>
            <input
              type="text"
              placeholder='e.g., Fantasy, Sci-Fi'
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className='bg-white rounded-[10px] p-2 w-full'
            />
        </div>

        {/* Tags Filter - Available to all users */}
        <div className='w-full relative'>
            <label>Tags:</label>
            <input
              type="text"
              placeholder='fantasy,sci-fi,romance'
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className='bg-white rounded-[10px] p-2 w-full'
            />
            <small className='text-gray-500 text-xs'>Separate tags with a comma</small>
        </div>

        {/* Likes */}
        <div>
            <label>
                Likes more than: {minLikes}{minLikes>=1000 ? "+":""}
            </label>

            <input 
            type="range"
            min={0}
            max={1000}
            step={50}
            value={minLikes}
            onChange={(e) => setMinLikes(e.target.value)}
            className='w-full appearance-none h-[2px] bg-black/40 rounded slider-thumb'
            />
        </div>

    </aside>
    </>
  )
}

export default BrowseSidebar

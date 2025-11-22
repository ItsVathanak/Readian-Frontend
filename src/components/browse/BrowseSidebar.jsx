import React from 'react'

const BrowseSidebar = ({title,setTitle,author,setAuthor,status,setStatus,tags,setTags,minLikes,setMinLikes}) => {
  return (
    <aside className='sticky top-24 shrink-0 bg-[#C0FFB3] rounded-r-[50px] w-[320px] h-fit flex flex-col items-center gap-4 p-[30px] py-[50px] my-10 z-20'>
        <h1 className='geist text-[24px] font-bold text-center'>
            Browse stories
        </h1>
        <h2 className='geist text-[20px]'>
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
        <div>
            <label>Author:</label><br />
            <input 
                type="text"
                placeholder='Filter by author'
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className='bg-white rounded-[10px] p-2'
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

        {/* Tags */}
        <div>
            <label>Tags:</label>
            <input 
            type="text" 
            placeholder='fantasy,sci-fi,romance'
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className='bg-white rounded-[10px] p-2'
            />
            <small className='text-gray-500'>Separate tags with a comma.</small>
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
  )
}

export default BrowseSidebar

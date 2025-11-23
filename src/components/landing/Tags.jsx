import React from 'react'
import { Link } from 'react-router-dom'

const Tags = () => {
    const tagsList = [
        {id:0,name:"Romance"},
        {id:1,name:"Mystery"},
        {id:2,name:"Horror"},
        {id:3,name:"Thriller"},
        {id:4,name:"Sci-fi"},
        {id:5,name:"Supernatural"},
        {id:6,name:"Fantasy"},
        {id:7,name:"Poetry"}
    ]

  return (
    <div className='min-h-[400px] py-12 bg-gradient-to-b from-[#FFFDEE] to-[#C0FFB3] flex flex-col items-center justify-center gap-8 px-4'>
        {/* text */}
        <h1 className='geist text-3xl sm:text-4xl md:text-[48px] text-center font-bold'>
          Browse through various tags
        </h1>

        {/* tags */}
        <div className='flex flex-wrap justify-center gap-4 sm:gap-6 max-w-7xl'>
            {tagsList.map((tag) => (
                //link to browse page with set tag
                <Link
                  to={`/browse?tag=${tag.name.toLowerCase()}`}
                  key={tag.id}
                  className='w-[140px] sm:w-[200px] md:w-[260px] h-[50px] sm:h-[60px] rounded-[10px] bg-[#1A5632] flex items-center justify-center hover:scale-110 transition-all duration-300'
                >
                    <h1 className='geist text-lg sm:text-xl md:text-[28px] font-semibold text-[#FFD7DF] text-center'>
                        {tag.name}
                    </h1>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default Tags

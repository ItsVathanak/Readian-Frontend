import React from 'react'
import SingleChapter from './SingleChapter'

const BookChapters = ({chapterList,bookId}) => {
  return (
    <div className='relative w-full max-w-[1200px] mx-4 md:mx-auto rounded-br-[50px] md:rounded-br-[100px] bg-[#FFD7DF]'>
        {/* corner section */}
        <div className='absolute top-0 left-0 bg-[#1A5632] w-[200px] sm:w-[230px] h-[90px] sm:h-[115px] rounded-br-[30px] sm:rounded-br-[50px] flex justify-center items-center'>
            {/* text */}
            <h1 className='bg-none border-2 border-solid border-[#FFD7DF] rounded-[20px] sm:rounded-[30px] h-[32px] sm:h-[40px] px-3 sm:px-5 text-[18px] sm:text-[24px] text-[#FFD7DF] font-semibold whitespace-nowrap'>
                Chapters
            </h1>
            {/* top right rectangles */}
            <div 
                className='absolute bg-[#FFD7DF] w-[120px] sm:w-[150px] h-[90px] sm:h-[115px] rounded-tl-[30px] sm:rounded-tl-[50px] z-10 top-0 left-[200px] sm:left-[230px]'
            />
            <div 
                className='absolute bg-[#1A5632] w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] z-0 top-0 left-[200px] sm:left-[230px]'
            />
            {/* bottom left rectangles */}
            <div
                className='absolute bg-[#FFD7DF] w-[120px] sm:w-[150px] h-[90px] sm:h-[115px] rounded-tl-[30px] sm:rounded-tl-[50px] z-10 top-[90px] sm:top-[115px] left-0'
            />
            <div 
                className='absolute bg-[#1A5632] w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] z-0 top-[90px] sm:top-[115px] left-0'
            />
        </div>

        {/* List of chapters */}
        {(chapterList && chapterList.length > 0) ? (
            <div className='relative mt-[90px] sm:mt-[115px] px-4 sm:px-8 md:px-16 lg:px-[100px] py-8 sm:py-12 md:py-[50px] z-20'>
                <div className='mb-6 p-4 bg-white rounded-lg'>
                    <p className='text-sm text-gray-600'>
                        <span className='font-semibold text-[#1A5632]'>{chapterList.length}</span> chapter{chapterList.length !== 1 ? 's' : ''} available
                    </p>
                </div>
                <div className='space-y-3'>
                    {chapterList.map((chapter, index) => (
                        <SingleChapter
                            key={chapter._id || chapter.id || index}
                            chapter={chapter}
                            bookId={bookId}
                            chapterNumber={index + 1}
                        />
                    ))}
                </div>
            </div>
        ) : (
            <div className='relative mt-[90px] sm:mt-[115px] px-4 sm:px-8 md:px-16 lg:px-[100px] py-8 sm:py-12 md:py-[50px] z-20 text-center'>
                <div className='p-12 bg-white rounded-lg'>
                    <p className='text-xl text-gray-500'>📖 No chapters available yet</p>
                    <p className='text-sm text-gray-400 mt-2'>Check back later for updates!</p>
                </div>
            </div>
        )}
        
    </div>
  )
}

export default BookChapters

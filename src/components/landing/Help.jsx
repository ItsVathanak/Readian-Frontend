import React from 'react'
import { Link } from 'react-router-dom'

const Help = () => {
  return (
    <div className='bg-[#FFFDEE] py-8 sm:py-12 sm:pr-8 md:pr-16 lg:pr-[100px]'>
      <div className='flex flex-col justify-center items-center text-center bg-[#1A5632] rounded-r-[50px] md:rounded-r-[100px] min-h-[300px] py-8 px-4 sm:px-8 md:px-16 lg:pl-[100px] gap-6'>
        <h1 className='geist text-3xl sm:text-4xl md:text-[48px] text-white font-semibold'>Not sure what to do?</h1>
        <p className='text-lg sm:text-xl md:text-[32px] text-white max-w-4xl'>Visit our instructions page to find helpful tips, FAQs, and instructions on how to use the site.</p>

        <Link to="/instruction">
        <button className='w-[140px] sm:w-[180px] md:w-[200px] h-[45px] sm:h-[50px] rounded-[15px] font-semibold text-xl sm:text-2xl md:text-[32px] bg-[#FFD7DF] text-[#1A5632] hover:bg-[#1A5632] hover:text-[#FFD7DF] hover:border-[#FFD7DF] border-solid border-2 transition-all duration-300'>
            Help
        </button>
        </Link>
      </div>
    </div>
  )
}

export default Help

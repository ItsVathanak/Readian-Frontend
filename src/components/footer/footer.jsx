import React from 'react'
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='flex bg-[#FFFDEE] min-h-[200px] sm:min-h-[240px] md:min-h-[280px] w-full justify-center px-4'>
        <div className='flex flex-col sm:flex-row self-end justify-between gap-4 sm:gap-6 pt-6 sm:pt-8 md:pt-[40px] px-4 sm:px-8 md:px-12 lg:px-[100px] pb-4 min-h-[160px] sm:min-h-[190px] w-full sm:w-[90%] md:w-[85%] lg:w-[80%] border-solid border-t-4 sm:border-t-6 border-l-4 sm:border-l-6 border-r-4 sm:border-r-6 border-[#1A5632] bg-[#C0FFB3] rounded-t-[50px] sm:rounded-t-[75px] md:rounded-t-[100px]'>
            <div className='w-full sm:w-[40%] mb-4 sm:mb-0'>
                <h1 className='geist text-lg sm:text-xl md:text-2xl font-semibold mb-2'>Reach Out Below!</h1>
                <p className='text-xs sm:text-sm md:text-base'>Email: ReadianSupport@gmail.com</p>
                <p className='text-xs sm:text-sm md:text-base'>Phone: 000 000 000</p>
                <p className='text-xs sm:text-sm md:text-base'>Address: We don&apos;t exist.</p>
            </div>
            <div className='w-full sm:w-[30%] flex flex-col mb-4 sm:mb-0'>
                <h1 className='geist text-lg sm:text-xl md:text-2xl font-semibold mb-2'>Navigate</h1>
                <Link to="/" className='text-xs sm:text-sm md:text-base hover:underline'>Home</Link>
                <Link to="/browse" className='text-xs sm:text-sm md:text-base hover:underline'>Browse</Link>
                <Link to="/instruction" className='text-xs sm:text-sm md:text-base hover:underline'>Help</Link>
            </div>
            <h1 className='self-end text-xs sm:text-sm md:text-base'>
                @2025 Readian
            </h1>
        </div>
    </footer>
  )
}

export default Footer

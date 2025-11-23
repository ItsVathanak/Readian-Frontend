import React from 'react'
import { Link } from 'react-router-dom'


const Subscribe = ({signedIn}) => {
  return (
    <>
        {signedIn ? (
            // Show subscribe options
            <div className='flex flex-col justify-center items-center text-center min-h-[600px] py-12 bg-gradient-to-b from-[#C0FFB3] to-[#FFFDEE] gap-8 px-4'>
                <h1 className='geist text-3xl sm:text-4xl md:text-[48px] font-semibold'>Become a subscriber!</h1>
                <p className='text-lg sm:text-xl md:text-[32px] max-w-4xl'>As a subscriber, you can gain access to more content, and even more benefits!</p>

                {/* tiers */}
                <div className='flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-6 w-full max-w-6xl'>
                    {/* Basic */}
                    <div className='flex flex-col justify-evenly items-center min-h-[340px] w-full sm:w-[280px] p-4 bg-white border-solid border-2 border-[#1A5632] rounded-tl-[30px] rounded-br-[30px] gap-4'>
                        <div className='w-[150px] h-[50px] rounded-[10px] bg-[#CEF17B] flex items-center justify-center'>
                            <h1 className='geist text-2xl sm:text-[32px] font-semibold text-center'>Basic</h1>
                        </div>
                        <p className='font-semibold text-sm sm:text-[16px]'>Access to public stories</p>
                        <p className='font-semibold text-sm sm:text-[16px]'>No downloads, read only</p>
                        <p className='font-semibold text-sm sm:text-[16px]'>Basic search options</p>
                        <p className='font-semibold text-sm sm:text-[16px]'>Normal advertisements</p>
                        <p className='font-semibold text-sm sm:text-[16px]'>Free</p>
                    </div>

                    {/* Silver */}
                    <div className='flex flex-col justify-evenly items-center min-h-[340px] w-full sm:w-[280px] p-4 bg-white border-solid border-2 border-[#1A5632] rounded-tl-[30px] rounded-br-[30px] gap-4'>
                        <div className='w-[150px] h-[50px] rounded-[10px] bg-[#CBCBCB] flex items-center justify-center'>
                            <h1 className='geist text-2xl sm:text-[32px] font-semibold text-center'>Silver</h1>
                        </div>
                        <p className='font-semibold text-sm sm:text-[16px]'>Access to public and premium stories</p>
                        <p className='font-semibold text-sm sm:text-[16px]'>Maximum 20 downloads monthly</p>
                        <p className='font-semibold text-sm sm:text-[16px]'>Advanced search options</p>
                        <p className='font-semibold text-sm sm:text-[16px]'>Less advertisements</p>
                        <p className='font-semibold text-sm sm:text-[16px]'>5.99$/month</p>
                    </div>

                    {/* Gold */}
                    <div className='flex flex-col justify-evenly items-center min-h-[340px] w-full sm:w-[280px] p-4 bg-white border-solid border-2 border-[#1A5632] rounded-tl-[30px] rounded-br-[30px] gap-4'>
                        <div className='w-[150px] h-[50px] rounded-[10px] bg-[#FFC900] flex items-center justify-center'>
                            <h1 className='geist text-2xl sm:text-[32px] font-semibold text-center'>Gold</h1>
                        </div>
                        <p className='font-semibold text-sm sm:text-[16px]'>Access to public and premium stories</p>
                        <p className='font-semibold text-sm sm:text-[16px]'>Unlimited downloads</p>
                        <p className='font-semibold text-sm sm:text-[16px]'>Advanced search options</p>
                        <p className='font-semibold text-sm sm:text-[16px]'>No advertisements</p>
                        <p className='font-semibold text-sm sm:text-[16px]'>12.99$/month</p>
                    </div>
                </div>

                <Link to="/subscribe">
                <button className='w-[160px] sm:w-[200px] h-[50px] sm:h-[60px] rounded-[15px] bg-[#1A5632] text-[#FFD7DF] text-xl sm:text-[28px] hover:text-[#1A5632] hover:bg-[#FFD7DF] transition-all duration-300'>
                    Subscribe
                </button>
                </Link>
                
            </div>
        ) : (
            //show sign in option
            <div className='flex flex-col justify-center items-center text-center min-h-[400px] py-12 px-4 sm:px-8 md:px-16 bg-gradient-to-b from-[#C0FFB3] to-[#FFFDEE] gap-6'>
                <h1 className='geist text-3xl sm:text-4xl md:text-[48px] font-semibold'>
                    Sign in to access more features
                </h1>

                <p className='text-lg sm:text-xl md:text-[32px] max-w-4xl'>
                    With an account, you can start writing your own stories, leave likes on other people&apos;s works, and more!
                </p>

                <Link to="/signin">
                <button className='w-[160px] sm:w-[200px] h-[50px] sm:h-[60px] rounded-[15px] bg-[#1A5632] text-[#FFD7DF] text-xl sm:text-[28px] hover:text-[#1A5632] hover:bg-[#FFD7DF] transition-all duration-300'>
                    Sign In
                </button>
                </Link>
            </div>
        )}
    </>

  )
}

export default Subscribe

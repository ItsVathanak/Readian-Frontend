import React from 'react'

const AboutReadian = () => {
  return (
    <div className='min-h-[400px] py-12 bg-[#C0FFB3] flex flex-col lg:flex-row justify-center items-center gap-8 px-4 sm:px-8 md:px-16 lg:px-24'>
        {/* About Text */}
        <div className='max-w-2xl flex flex-col gap-6 text-center lg:text-left'>
            <h1 className='geist font-semibold text-4xl sm:text-5xl md:text-[64px] leading-tight'>
                What Is <span className='text-[#00A819]'>Readian</span>?
            </h1>
            <p className='text-base sm:text-lg md:text-[24px] leading-relaxed'>
              Readian is a platform made for public users to read, write, and share stories amongst each other. Let your creativity flow unbounded into your works. Write about anything you can think of, from magic wielding warlocks, to your average Jim working the local bar.
            </p>
        </div>
      
        {/* Image */}
        <div className='h-[200px] sm:h-[250px] md:h-[300px] flex-shrink-0'>
            <img src="/bookstack.png" alt="book stack" className='h-full object-contain'/>
        </div>
    </div>
  )
}

export default AboutReadian

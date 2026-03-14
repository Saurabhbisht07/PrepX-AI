import React from 'react'
import { BsRobot } from 'react-icons/bs'

function Footer() {
  return (
    <div className='bg-transparent flex justify-center px-4 pb-10 py-4 pt-44 relative z-10'>
      <div className='w-full max-w-6xl glass-card rounded-[24px] py-10 px-6 text-center shadow-[0_-10px_40px_rgba(0,0,0,0.2)]'>
        <div className='flex justify-center items-center gap-3 mb-4'>
            <div className='bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2.5 rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.3)]'><BsRobot size={20}/></div>
            <h2 className='font-bold text-2xl tracking-wide text-white'>PrepX</h2>
        </div>
        <p className='text-gray-400 text-base max-w-xl mx-auto leading-relaxed'>
  AI-powered interview preparation platform designed to improve
          communication skills, technical depth and professional confidence.
        </p>


      </div>
    </div>
  )
}

export default Footer

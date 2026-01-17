import React from 'react'
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const Hero = ({ children, bgImage, route }) => {
  return (
    <div className="relative w-full  overflow-hidden shadow-lg   ">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            `url(${bgImage})`,
        }}
      ></div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className='relative z-10'>
        <Link href={route}>
          <ArrowLeft className='w-5 h-5 text-white ml-5 my-5' />
        </Link>
        {children}
      </div>
    </div>
  )
}

export default Hero
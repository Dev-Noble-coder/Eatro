import React from 'react'
import BottomNav from './BottomNav'

const AppLayout = ({ children }) => {
    return (
      <div className="min-h-screen overflow-hidden relative text-black ">
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="animated-bg">
            <div className="grid-pattern"></div>
            <div className="gradient-1"></div>
            <div className="gradient-2"></div>
            <div className="gradient-3"></div>
            <div className="overlay"></div>
          </div>
        </div>
        <div className="glass-layer absolute inset-0"></div>
        <div className="relative  pb-[calc(6rem+env(safe-area-inset-bottom))">
          {children}
        </div>
        <BottomNav />
      </div>
    );
}

export default AppLayout
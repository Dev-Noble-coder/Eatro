import React from 'react'

const GlassBG = ({children, className = ""}) => {
  return (
    <div className={`backdrop-blur-xl ${className} `}>
        {children}
    </div>
  )
}

export default GlassBG
import React from 'react'

const GlassBG = ({children, className = "", ...props}) => {
  return (
    <div {...props} className={`backdrop-blur-xl ${className} `}>
        {children}
    </div>
  )
}

export default GlassBG
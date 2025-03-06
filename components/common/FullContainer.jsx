import React from 'react'

export default function FullContainer({ children, className }) {
  return (
    <div className={`w-full  ${className}`}>
      {children}
    </div>
  )
}

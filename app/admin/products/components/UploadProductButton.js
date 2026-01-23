'use client'

import React from 'react'
import { Plus } from 'lucide-react'


const UploadProductButton = ({ onClick }) => {
  return (
    <div className="flex justify-end">
      <button
        onClick={onClick}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-full flex justify-center items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
      >
        <Plus className="w-5 h-5" />
        Upload A Product
      </button>
    </div>
  )
}

export default UploadProductButton
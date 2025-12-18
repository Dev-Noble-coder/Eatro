"use client"

import React from 'react'
import { Plus } from 'lucide-react'

const UploadProduct = ({setProductModal, setSelectedProduct}) => {
    return (
        <>
        <div className=' m-5 '>
            <div className='flex justify-end'>
            <button className='bg-[#A31621] text-white py-2 px-10 rounded-full flex justify-center items-center gap-1 cursor-pointer' onClick={()=> {
                setProductModal(true)
                setSelectedProduct(null)
            }}>
                <Plus />
                Upload A Product
            </button>
            </div>
          
        </div>
        </>
    )
}

export default UploadProduct
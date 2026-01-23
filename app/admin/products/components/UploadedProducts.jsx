"use client"

import React, {useState} from 'react'
import Image from 'next/image';
import { PlusCircle, MinusCircle } from 'lucide-react';

const UploadedProducts = ({setProductModal, setSelectedProduct, setDeleteModal, setProductToDelete}) => {
  // use /api/admin/create and do GET to get the product 

    const [isAvailable, setIsAvailable] = useState(true);

const toggleAvailability = () => {
  setIsAvailable(prev => !prev);
};


    return (
        <>
            <div className='mt-10 mb-5'>
                <h2 className='text-xl font-semibold text-[#A31621] ml-5'>Uploaded Products</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 p-5 pb-20">
                    {meals.map((meal) => {
                        //   const quantity = getQuantity(meal.id);
                        return (
                            <div
                                key={meal.id}
                                className="flex flex-col items-start justify-center bg-white/20 backdrop-blur-lg border border-white/10 rounded-2xl shadow-sm hover:shadow-md transition"
                            >
                                <div className="relative w-full h-40">
                                    <Image
                                        src={meal.image}
                                        alt={meal.name}
                                        fill
                                        className="object-cover rounded-t-xl"
                                    />
                                </div>
                                <div className="p-3 w-full">
                                    <p className="font-semibold text-gray-800 text-sm">{meal.name}</p>
                                    <p className="text-sm text-gray-600 mb-2">
                                        ₦{meal.price.toLocaleString()}
                                    </p>
                                    <div className="flex items-center gap-2 mb-6">
  <span className="text-xs text-gray-600">
    {isAvailable ? "Available" : "Unavailable"}
  </span>

  <button
    onClick={toggleAvailability}
    className={`w-10 h-5 flex items-center rounded-full p-1 transition cursor-pointer
      ${isAvailable ? "bg-green-600" : "bg-gray-400"}`}
  >
    <div
      className={`w-3.5 h-3.5 bg-white rounded-full shadow transition
        ${isAvailable ? "translate-x-5" : "translate-x-0"}`}
    />
  </button>
</div>



                                    <div className='flex items-center gap-1'>
                                        <button
                                            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-full  hover:bg-green-600 hover:text-white text-green-600 text-xs transition w-full cursor-pointer backdrop-blur-3xl"
                                            onClick={()=> {
                                                setProductModal(true)
                                                setSelectedProduct(meal)
                                            }}
                                        >
                                            <PlusCircle className="w-3 h-3" /> Edit
                                        </button>
                                        <button
                                            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-full bg-green-600 text-white text-xs transition w-full cursor-pointer"
                                            onClick={() => {
                                                setProductToDelete(meal);
                                                setDeleteModal(true);
                                              }}
                                        >
                                            <MinusCircle className="w-3 h-3" /> Delete
                                        </button>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </>
    )
}

export default UploadedProducts
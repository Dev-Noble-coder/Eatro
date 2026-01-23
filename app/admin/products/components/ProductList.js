'use client'

import React from 'react'
import Image from 'next/image'
import { Edit2, Trash2 } from 'lucide-react'


const ProductList = ({
  products,
  onEdit,
  onDelete,
  onToggleAvailability
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
        >
          {/* Product Image */}
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={'/placeholder'}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Availability Badge */}
            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
              <span className="text-blue-600 font-bold">₦{product.price.toLocaleString()}</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 capitalize">{product.type}</p>

            {/* Availability Toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Status</span>
              <button
                onClick={() => product._id && onToggleAvailability(product._id, product.isAvailable || false)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${product.isAvailable ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => onDelete(product)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductList
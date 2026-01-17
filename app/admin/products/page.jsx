'use client'
import React, { useState } from 'react'
import AppLayout from '../layout/AppLayout'
import UploadProduct from './components/UploadProduct'
import UploadedProducts from './components/UploadedProducts'
import ProductModal from './components/ProductModal'
import ConfirmDeleteModal from './components/ConfirmDeleteModal'

const page = () => {

  const [productModal, setProductModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [deleteModal, setDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  return (
    <>
      <AppLayout>
        <UploadProduct setProductModal={setProductModal} setSelectedProduct={setSelectedProduct} />
        <UploadedProducts setProductModal={setProductModal} setSelectedProduct={setSelectedProduct}
          setDeleteModal={setDeleteModal}
          setProductToDelete={setProductToDelete}
        />
        {
          productModal && (
            <ProductModal setProductModal={setProductModal} selectedProduct={selectedProduct} />
          )
        }
        {deleteModal && (
          <ConfirmDeleteModal
            product={productToDelete}
            setDeleteModal={setDeleteModal}
          />
        )}
      </AppLayout>
    </>
  )
}

export default page
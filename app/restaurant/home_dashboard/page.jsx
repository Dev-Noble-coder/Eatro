import React from 'react'
import AppLayout from '../layout/AppLayout'
import AcctBalance from '../layout/AcctBalance'
import TopOrders from '../layout/TopOrders'

const page = () => {
  return (
    <>
    <AppLayout >
      <AcctBalance />
      <TopOrders />
    </AppLayout>
    </>
  )
}

export default page
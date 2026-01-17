import React from 'react'
import AppLayout from '../layout/AppLayout'
import SwiperCard from '../layout/SwiperCard'
import RestaurantCard from '../layout/RestaurantCard'
import PartnerCard from '../layout/PartnerCard'

const page = () => {
  return (
    <>
      <AppLayout>
        <SwiperCard />
        <RestaurantCard />
        <PartnerCard />
      </AppLayout>
    </>
  )
}

export default page
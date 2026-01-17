import React from 'react'
import AppLayout from '@/app/user/layout/AppLayout'
import SwiperCard from "@/app/user/layout/SwiperCard";
import RestaurantCard from "@/app/user/layout/RestaurantCard";
import PartnerCard from "@/app/user/layout/PartnerCard";

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
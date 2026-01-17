"use client"

import { useState, useEffect } from "react";
import LoadingAnimation from "@/components/LoadingAnimation";
import AppLayout from "@/components/AppLayout";
import SwiperCard from "@/components/SwiperCard";
import RestaurantCard from "@/components/RestaurantCard";
import PartnerCard from "@/components/PartnerCard";


export default function Home() {
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000) 

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <LoadingAnimation />
  }
  return (
    <>
      <>
        <AppLayout>
          <SwiperCard />
          <RestaurantCard />
          <PartnerCard />
        </AppLayout>
      </>
    </>
  );
}

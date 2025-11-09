"use client"

import React, { useState } from "react"
import AppLayout from "../layout/AppLayout"
import OrdersTab from "../layout/OrdersTab"

const Page = () => {
  const [activeTab, setActiveTab] = useState("pending")

  return (
    <AppLayout>
      <OrdersTab activeTab={activeTab} setActiveTab={setActiveTab} />
    </AppLayout>
  )
}

export default Page

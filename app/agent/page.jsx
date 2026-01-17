import React from 'react'
import AppLayout from "@/app/agent/layout/AppLayout";
import AcctBalance from "@/app/agent/layout/AcctBalance";
import TopOrders from "@/app/agent/layout/TopOrders";

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
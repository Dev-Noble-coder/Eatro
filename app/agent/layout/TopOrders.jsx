"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import GlassBG from "./GlassBG"
const formatCurrency = (amount) => `₦${Number(amount || 0).toLocaleString("en-NG")}`
const summarizeOrder = (order) => {
  const firstItem = order?.items?.[0]
  const name = firstItem?.name || order?.restaurant?.name || "Order"
  const qty = (order?.items || []).reduce((sum, it) => sum + (it.quantity || 0), 0)
  const quantityText = qty ? `${qty} item${qty > 1 ? "s" : ""}` : "—"
  const priceText = formatCurrency(order?.totalAmount)
  const image = order?.restaurant?.image || "https://images.unsplash.com/photo-1559622214-f4c1e3dbf4de?w=800&q=80"
  return { name, quantityText, priceText, image }
}

const TopOrders = () => {
  const [pending, setPending] = useState([])
  const [completed, setCompleted] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/agent", { credentials: "include" })

       
        const orders = res.ok ? await res.json() : { orders: [] }
        if (isMounted) {
          setPending(orders.orders || [])
          // setCompleted(cJson.orders || [])
          console.log("this is the order:", orders)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchOrders()
    return () => { isMounted = false }
  }, [])

  return (
    <>
      {/* Pending Orders */}
      <div className="px-5 mt-10 ">
        <h1 className="text-2xl text-[#A31621] font-medium mb-6">
          Pending Orders
        </h1>

        {(loading ? Array.from({ length: 0 }) : pending).slice(0, 3).map((order) => (
          <Link key={order._id} href={`/agent/orders/${order._id}`}>
            <GlassBG className="flex items-center gap-4 transition mb-2 rounded-xl pr-2">
              <Image
                src={summarizeOrder(order).image}
                alt={summarizeOrder(order).name}
                width={96}
                height={96}
                className="w-24 h-24 object-cover rounded-l-xl"
              />
              <div className="flex flex-col flex-1">
                <h2 className="text-lg font-semibold text-[#A31621]">
                  {summarizeOrder(order).name}
                </h2>
                <p className="text-white text-sm pb-3">
                  {summarizeOrder(order).quantityText} • {summarizeOrder(order).priceText}
                </p>
                <p className="text-[10px] bg-yellow-100 rounded-full text-yellow-700 w-fit px-2 py-0.5">
                  Pending
                </p>
              </div>
              <ChevronRight size={18} className="text-gray-600" />
            </GlassBG>
          </Link>
        ))}
        <Link href="/agent/orders" className="block text-center text-[#A31621] font-medium pt-3 underline cursor-pointer">
          See More
        </Link>
      </div>

      {/* Completed Orders */}
      <div className="px-5 mt-10 mb-26">
        <h1 className="text-2xl text-[#A31621] font-medium mb-6">
          Completed Orders
        </h1>

        {(loading ? Array.from({ length: 0 }) : completed).slice(0, 3).map((order) => (
          <Link key={order._id} href={`/agent/orders/${order._id}`}>
            <GlassBG className="flex items-center gap-4 transition mb-2 rounded-xl pr-2">
              <Image
                src={summarizeOrder(order).image}
                alt={summarizeOrder(order).name}
                width={96}
                height={96}
                className="w-24 h-24 object-cover rounded-l-xl"
              />
              <div className="flex flex-col flex-1">
                <h2 className="text-lg font-semibold text-[#A31621]">
                  {summarizeOrder(order).name}
                </h2>
                <p className="text-white text-sm pb-3">
                  {summarizeOrder(order).quantityText} • {summarizeOrder(order).priceText}
                </p>
                <p className="text-[10px] bg-green-100 rounded-full text-green-700 w-fit px-2 py-0.5">
                  Completed
                </p>
              </div>
              <ChevronRight size={18} className="text-gray-600" />
            </GlassBG>
          </Link>
        ))}
        <Link href="/agent/orders" className="block text-center text-[#A31621] font-medium pt-3 underline cursor-pointer">
          See More
        </Link>
      </div>
    </>
  )
}

export default TopOrders

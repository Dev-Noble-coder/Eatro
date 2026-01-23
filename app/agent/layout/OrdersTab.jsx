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

const OrdersTab = ({ activeTab, setActiveTab }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const status = activeTab === "completed" ? "delivered" : "on_the_way"
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/orders/agent`, { credentials: "include" })
        const json = res.ok ? await res.json() : { orders: [] }
        const all = json.orders || []
        const filtered = activeTab === "pending" ? all.filter((o) => o.status !== "delivered") : all.filter((o) => o.status === "delivered")
        if (isMounted) setOrders(filtered)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchOrders()
    return () => { isMounted = false }
  }, [activeTab])

  return (
    <div className="px-5 mt-10 mb-26">
      {/* Toggle Tabs */}
      <div className="relative grid grid-cols-2 border-b border-gray-700/20 pb-0.5 mb-6">
        {/* Buttons */}
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-2 text-base font-medium transition-colors ${activeTab === "pending"
              ? "text-[#A31621]"
              : "text-gray-700/70 hover:text-[#A31621]"
            }`}
        >
          Pending Orders
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`pb-2 text-base font-medium transition-colors ${activeTab === "completed"
              ? "text-[#A31621]"
              : "text-gray-700/70 hover:text-[#A31621]"
            }`}
        >
          Completed Orders
        </button>

        {/* Sliding underline */}
        <span
          className={`absolute bottom-0 left-0 w-1/2 h-[2px] bg-[#A31621] transition-transform duration-300 ease-in-out ${activeTab === "completed" ? "translate-x-full" : "translate-x-0"
            }`}
        />
      </div>


      {/* Orders List */}
      <h1 className="text-2xl text-[#A31621] font-medium mb-6">
        {activeTab === "pending" ? "Pending Orders" : "Completed Orders"}
      </h1>

      {(loading && orders.length === 0) ? null : orders.map((order) => (
        <Link key={order._id} href={`/agent/orders/${order._id}`}>
          <GlassBG
            className="flex items-center gap-4 transition mb-2 rounded-xl pr-2"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          >
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
              <p
                className={`text-[10px] rounded-full w-fit px-2 py-0.5 ${activeTab === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                  }`}
              >
                {activeTab === "pending" ? "Pending" : "Completed"}
              </p>
            </div>
            <ChevronRight size={18} className="text-gray-600" />
          </GlassBG>
        </Link>
      ))}
    </div>
  )
}

export default OrdersTab

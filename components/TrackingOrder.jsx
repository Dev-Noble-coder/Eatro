"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle2, Utensils, Bike, MapPin, Clock, CreditCard, XCircle } from "lucide-react";
import GlassBG from "./GlassBG";
import Image from "next/image";

const statusSteps = [
  { key: "order_received", title: "Order Received", desc: "We have received your order", icon: CheckCircle2 },
  { key: "payment_confirmed", title: "Payment Confirmed", desc: "Payment verified", icon: CreditCard },
  { key: "kitchen_preparing", title: "Kitchen Preparing", desc: "The kitchen is working their magic", icon: Utensils },
  { key: "on_the_way", title: "On the Way", desc: "Your agent is heading to you", icon: Bike },
  { key: "delivered", title: "Delivered", desc: "Enjoy dey chow wey you buy!", icon: MapPin },
  { key: "cancelled", title: "Cancelled", desc: "Order was cancelled", icon: XCircle },
];

const TrackingOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders/user`, { credentials: "include", signal: controller.signal });
        const json = res.ok ? await res.json() : { orders: [] };
        if (isMounted) setOrders(json.orders || []);
      } catch (e) {
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOrders();

    let timer;
    const start = () => {
      clearInterval(timer);
      if (document.visibilityState === "visible") {
        timer = setInterval(fetchOrders, 120000);
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        clearInterval(timer);
        controller.abort();
        controller = new AbortController();
      } else {
        start();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      isMounted = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      controller.abort();
    };
  }, []);

  const keys = statusSteps.map((s) => s.key);

  const renderOrder = (order) => {
    const paymentCompleted = order?.payment?.status === "completed";
    let currentKey = order?.status || "order_received";
    if (paymentCompleted && currentKey === "order_received") {
      currentKey = "payment_confirmed";
    }
    const currentIndexAll = Math.max(keys.indexOf(currentKey), 0);
    const reached = new Set((order?.statusHistory || []).map((h) => h.status));
    if (paymentCompleted) reached.add("payment_confirmed");
    const isCancelled = currentKey === "cancelled";
    const stepsToRender = isCancelled ? statusSteps : statusSteps.filter((s) => s.key !== "cancelled");
    const renderKeys = stepsToRender.map((s) => s.key);
    const currentIndex = Math.max(renderKeys.indexOf(currentKey), 0);
    const progressPercent = (currentIndex / (stepsToRender.length - 1)) * 100;

    const agentName = order?.agentDetails?.agentName || `${order?.assignedAgent?.firstName || ""} ${order?.assignedAgent?.lastName || ""}`.trim();
    const agentPhone = order?.agentDetails?.agentPhone || order?.assignedAgent?.phone || "";

    return (
      <GlassBG
        key={order._id}
        className="w-full max-w-md mx-auto p-6 bg-white/30 backdrop-blur-xl rounded-xl border mb-6"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.08) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Tracking Order</h3>
            <p className="text-xs text-gray-500 font-mono">ID: #{order?.orderNumber || order?._id?.slice(-6)}</p>
          </div>
          <div className="flex items-center gap-2">
           
            {typeof order?.preparationTime === "number" && (
              <div className="bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-[10px] font-bold text-blue-700">Prep ~{order.preparationTime} MIN</span>
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-200" />
          <div
            className={`absolute left-[19px] top-2 w-0.5 ${isCancelled ? "bg-red-600" : "bg-blue-600"} transition-all duration-700 ease-in-out`}
            style={{ height: `${progressPercent}%` }}
          />

          <div className="space-y-8">
            {stepsToRender.map((step, index) => {
              const Icon = step.icon;
              const isReached = reached.has(step.key) || index <= currentIndex;
              const isCurrent = index === currentIndex;
              const isCancelStep = step.key === "cancelled";
              const activeColor = isCancelStep && isCurrent ? "bg-red-600 shadow-red-200" : "bg-blue-600 shadow-blue-200";
              const textActive = isCancelStep && isCurrent ? "text-red-700" : "text-blue-700";

              return (
                <div key={step.key} className="flex gap-4 relative">
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${
                    isReached ? `${activeColor} shadow-lg` : "bg-gray-100"
                  }`}>
                    <Icon className={`w-5 h-5 ${isReached ? "text-white" : "text-gray-400"}`} />
                    {isCurrent && (
                      <div className={`absolute inset-0 rounded-full ${isCancelStep ? "bg-red-600" : "bg-blue-600"} animate-ping opacity-25`} />
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className={`font-bold text-sm ${isCurrent ? textActive : "text-gray-800"}`}>{step.title}</p>
                    <p className="text-xs text-gray-500">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {currentKey === "on_the_way" && (
          <div className="mt-10 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                <Image src="https://i.pravatar.cc/150?u=agent" alt="agent" width={40} height={40} className="object-cover" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Your Agent</p>
                <p className="text-sm font-bold text-gray-800">{agentName || "Assigned Agent"}</p>
              </div>
            </div>
            <a href={agentPhone ? `tel:${agentPhone}` : undefined} className={`${agentPhone ? "bg-blue-700" : "bg-gray-400"} p-2 rounded-full text-white`}>
              <Bike size={18} />
            </a>
          </div>
        )}
      </GlassBG>
    );
  };

  if (loading) {
    return (
      <GlassBG className="w-full max-w-md mx-auto p-6 bg-white/30 backdrop-blur-xl rounded-xl border">
        <div className="flex items-center justify-center">
          <Clock className="w-5 h-5 text-gray-500 animate-spin" />
        </div>
      </GlassBG>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <GlassBG className="w-full max-w-md mx-auto p-6 bg-white/30 backdrop-blur-xl rounded-xl border">
        <div className="text-center">
          <p className="text-sm text-gray-600">No active orders</p>
        </div>
      </GlassBG>
    );
  }

  return <div className="space-y-4">{orders.map(renderOrder)}</div>;
};

export default TrackingOrder;
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "../../layout/AppLayout";
import Hero from "../../../../components/Hero";
import GlassBG from "../../layout/GlassBG";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  CreditCard,
  AlertCircle,
} from "lucide-react";

const formatCurrency = (amount) =>
  `₦${Number(amount || 0).toLocaleString("en-NG")}`;

const statusConfig = {
  order_received: {
    label: "Order Received",
    color: "bg-blue-100 text-blue-700",
    icon: Package,
    next: ["payment_confirmed"],
  },
  payment_confirmed: {
    label: "Payment Confirmed",
    color: "bg-indigo-100 text-indigo-700",
    icon: CheckCircle,
    next: ["kitchen_preparing"],
  },
  kitchen_preparing: {
    label: "Kitchen Preparing",
    color: "bg-amber-100 text-amber-700",
    icon: Clock,
    next: ["on_the_way"],
  },
  on_the_way: {
    label: "On The Way",
    color: "bg-purple-100 text-purple-700",
    icon: Truck,
    next: ["delivered"],
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle,
    next: [],
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-rose-100 text-rose-700",
    icon: AlertCircle,
    next: [],
  },
};

const paymentStatusConfig = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700",
    next: ["completed", "failed"],
  },
  completed: {
    label: "Success",
    color: "bg-emerald-100 text-emerald-700",
    next: [],
  },
  failed: {
    label: "Failed",
    color: "bg-rose-100 text-rose-700",
    next: ["pending"],
  },
};

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const id = params?.id;

  useEffect(() => {
    let isMounted = true;
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/${id}`, {
          credentials: "include",
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to fetch order");
        if (isMounted) setOrder(json.order);
      } catch (e) {
        setError(e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (id) fetchOrder();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const onUpdateOrderStatus = async (newStatus) => {
    if (!id) return;
    setUpdating(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to update status");
      setOrder(json.order);
      setSuccess(`Order status updated to ${statusConfig[newStatus]?.label}`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdating(false);
    }
  };

  const onUpdatePaymentStatus = async (newStatus) => {
    if (!id) return;
    setUpdatingPayment(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/orders/${id}/payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(json?.error || "Failed to update payment status");
      setOrder(json.order);
      setSuccess(
        `Payment status updated to ${paymentStatusConfig[newStatus]?.label}`,
      );
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdatingPayment(false);
    }
  };

  const orderStatus = order?.status || "order_received";
  const paymentStatus = order?.payment?.status || "pending";
  const currentStatusConfig = statusConfig[orderStatus];
  const currentPaymentConfig = paymentStatusConfig[paymentStatus];
  const nextStatusOptions = currentStatusConfig?.next || [];
  const nextPaymentOptions = currentPaymentConfig?.next || [];

  const bgImage = order?.restaurant?.image || "/img/food1.png";
  const totalItems = (order?.items || []).reduce(
    (sum, it) => sum + (it.quantity || 0),
    0,
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Hero bgImage={bgImage} route="/agent/orders">
        <div className="py-16 px-5 text-white">
          <h2 className="text-3xl font-semibold">Order Management</h2>
          <p className="text-sm opacity-80 mt-1">
            Order #{order?.orderNumber || id}
          </p>
        </div>
      </Hero>

      <div className="mx-5 mt-6 mb-3">
        <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
      </div>

      <GlassBG className="mb-24 rounded-2xl mx-5 p-5 space-y-6 backdrop-blur-md bg-white/5 border border-blue-100/20">
        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Order Status Card */}
          <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 rounded-xl p-4 border border-blue-200/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                {React.createElement(currentStatusConfig?.icon || Package, {
                  className: "w-5 h-5 text-blue-600",
                })}
              </div>
              <div>
                <p className="text-sm text-gray-200">Order Status</p>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${currentStatusConfig?.color}`}
                >
                  {currentStatusConfig?.label}
                </span>
              </div>
            </div>

            {/* Status Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>Progress</span>
                <span>
                  {order?.estimatedTimeRemaining || 45} mins remaining
                </span>
              </div>
              <div className="h-2 bg-blue-900/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, ((order?.statusHistory?.length || 1) / 5) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Payment Status Card */}
          <div className="bg-gradient-to-br from-indigo-500/5 to-indigo-600/5 rounded-xl p-4 border border-indigo-200/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-200">Payment Status</p>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${currentPaymentConfig?.color}`}
                >
                  {currentPaymentConfig?.label}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-200 mb-1">
                Amount: {formatCurrency(order?.payment?.amount)}
              </p>
              {order?.payment?.tipAmount > 0 && (
                <p className="text-sm text-gray-400">
                  Tip: {formatCurrency(order?.payment?.tipAmount)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Food Items */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-blue-400 flex items-center gap-2">
            <Package className="w-4 h-4" /> Food Ordered ({totalItems} items)
          </p>
          <div className="grid grid-cols-1 gap-2">
            {(order?.items || []).map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-300 font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      ₦{item.price} × {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium text-white">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <p className="text-sm font-medium text-blue-400">
              Customer Details
            </p>
            <div className="bg-white/5 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-400">Full Name</p>
                <p className="text-sm text-white">
                  {order?.deliveryDetails?.fullName || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone Number</p>
                <p className="text-sm text-white">
                  {order?.deliveryDetails?.phoneNumber || "—"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400">Hostel</p>
                  <p className="text-sm text-white">
                    {order?.deliveryDetails?.hostel || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Room</p>
                  <p className="text-sm text-white">
                    {order?.deliveryDetails?.roomNumber || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-blue-400">
              Order Information
            </p>
            <div className="bg-white/5 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-400">Restaurant</p>
                <p className="text-sm text-white">
                  {order?.restaurant?.name || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Pickup Method</p>
                <p className="text-sm text-white capitalize">
                  {order?.pickupOption || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Special Instructions</p>
                <p className="text-sm text-white">
                  {order?.specialInstructions || "No special instructions"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="space-y-6 pt-4">
          {/* Payment Status Actions */}
          <div>
            <p className="text-sm font-medium text-blue-400 mb-3">
              Update Payment Status
            </p>
            <div className="flex flex-wrap gap-3">
              {nextPaymentOptions.includes("completed") && (
                <button
                  disabled={updatingPayment}
                  onClick={() => onUpdatePaymentStatus("completed")}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {updatingPayment ? "Updating..." : "Confirm Payment"}
                </button>
              )}
              {nextPaymentOptions.includes("failed") && (
                <button
                  disabled={updatingPayment}
                  onClick={() => onUpdatePaymentStatus("failed")}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {updatingPayment ? "Updating..." : "Mark Payment Failed"}
                </button>
              )}
              {nextPaymentOptions.includes("pending") && (
                <button
                  disabled={updatingPayment}
                  onClick={() => onUpdatePaymentStatus("pending")}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  {updatingPayment ? "Updating..." : "Revert to Pending"}
                </button>
              )}
              {nextPaymentOptions.length === 0 && (
                <button
                  disabled
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-500/30 text-gray-400 cursor-not-allowed"
                >
                  No payment actions available
                </button>
              )}
            </div>
          </div>

          {/* Order Status Actions */}
          <div>
            <p className="text-sm font-medium text-blue-400 mb-3">
              Update Order Status
            </p>
            <div className="flex flex-wrap gap-3">
              {nextStatusOptions.includes("payment_confirmed") && (
                <button
                  disabled={updating}
                  onClick={() => onUpdateOrderStatus("payment_confirmed")}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {updating ? "Updating..." : "Confirm Order"}
                </button>
              )}
              {nextStatusOptions.includes("kitchen_preparing") && (
                <button
                  disabled={updating}
                  onClick={() => onUpdateOrderStatus("kitchen_preparing")}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  {updating ? "Updating..." : "Start Preparation"}
                </button>
              )}
              {nextStatusOptions.includes("on_the_way") && (
                <button
                  disabled={updating}
                  onClick={() => onUpdateOrderStatus("on_the_way")}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  {updating ? "Updating..." : "Mark On The Way"}
                </button>
              )}
              {nextStatusOptions.includes("delivered") && (
                <button
                  disabled={updating}
                  onClick={() => onUpdateOrderStatus("delivered")}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {updating ? "Updating..." : "Mark as Delivered"}
                </button>
              )}
              {nextStatusOptions.length === 0 && (
                <button
                  disabled
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-500/30 text-gray-400 cursor-not-allowed"
                >
                  No order actions available
                </button>
              )}
            </div>
          </div>

          {/* Status History */}
          {order?.statusHistory?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-blue-400 mb-3">
                Status History
              </p>
              <div className="bg-white/5 rounded-xl p-4 space-y-3">
                {order.statusHistory.map((history, index) => (
                  <div
                    key={history._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${statusConfig[history.status]?.color || "bg-gray-100 text-gray-700"}`}
                      >
                        {statusConfig[history.status]?.label || history.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(history.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Messages */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <p className="text-rose-400 text-sm text-center">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-emerald-400 text-sm text-center">{success}</p>
            </div>
          )}
        </div>
      </GlassBG>
    </AppLayout>
  );
};

export default Page;

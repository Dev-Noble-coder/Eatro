"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PlusCircle,
  MinusCircle,
  Trash2,
  X,
  ArrowLeft,
  User,
  Home,
  DoorClosed,
  Building,
  Truck,
  Hand,
  Gift,
  Percent,
  Coins,
  DollarSign,
  HandCoins,
  ClipboardList,
  Receipt,
  Wallet,
  CreditCard,
  PhoneIncoming,
  MessageCircle,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import AgentDetailsModal from "./agentDetails";

const foodImageMapping = {
  "Jollof Rice":
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
  "Fried Rice":
    "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1035",
  Beans:
    "https://media.istockphoto.com/id/1198712283/photo/chile.webp?a=1&b=1&s=612x612&w=0&k=20&c=YunbqqErACUq3_jlV0xDsfTz2IrAZ5S3AUTFUfPvRFA=",
  Amala:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv1-CWEOjFeLavKUoMkZwzQZTDGiyZN9NfjQ4V-5_naptGkpq-TVvAxcN80AZA7iSzAFc&usqp=CAU",
  "Pounded Yam":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvJm3oF0NEj2-3iQUvoStknLqRXZL3AclnzgOFGPLzO4pFnLKsOqjTFQe7Iw8ZmxRb7EI&usqp=CAU",
  "Efo Riro":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8UQpd61r9Tfc41NKQX5-Hd5V9o3e2lL9aJF6uwKh8EzV77BT9YWQMZBvpasnxYboT17A&usqp=CAU",
  "Ofada Rice":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR30GIfUKsV75IRGOXxyBgLBf8FOTmxYO1K5LG2fryP8b0QnYw8oInu9aW-rvPXGx-8NHk&usqp=CAU",
  Semo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHv6JAbqBMxjXjYGE1PFhZgvUqgxPAklD7n5dMZLzL6UDe9KG8TjqbbmswexEG4ywW54s&usqp=CAU",
  "Moi Moi":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE3Ht9D0dqVlnDRvU7lMSEmEW1_Y79qqmqU70rxOdeqnyYeT8SkSR4Oz6OZYfzsYB9V4c&usqp=CAU",
  Spaghetti:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_d7U7azBd3LeDGooqwgaiZwK_NT20IrciB21AXbwCwORu641xipHgOaIUebwQJTlX_kw&usqp=CAU",
  Rice: "https://images.unsplash.com/photo-1516684732162-798a0062be99?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
  Pasta:
    "https://images.unsplash.com/photo-1598866594230-a7c12756260f?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
  Chicken:
    "https://images.unsplash.com/photo-1603064752734-4c48eff53d05?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
  Beef: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
  Fish: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
  Soup: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
  Stew: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
  Salad:
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
  Bread:
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
  Egg: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
  Yam: "https://images.unsplash.com/photo-1563379091339-03246963d9d6?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
  Plantain:
    "https://images.unsplash.com/photo-1584557040972-b745b2f203b9?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
  Porridge:
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",

  // From your API data - map specific food names
  Winner:
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
  r: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
  v: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
  "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
  "https://images.unsplash.com/photo-1484980972926-edee96e0960d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025",
];

const Meal = ({ restaurant }) => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [pickupOption] = useState("agent");
  const [selectedTip, setSelectedTip] = useState(0);
  const [agents, setAgents] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showAgentDetailsModal, setShowAgentDetailsModal] = useState(false);

  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    roomNumber: "",
    hostel: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [customTipAmount, setCustomTipAmount] = useState("");
  const [errors, setErrors] = useState({});
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null)
  const [hasUserToken, setHasUserToken] = useState(false)

  // Function to get image for a food item
  const getFoodImage = (food, index) => {
    if (!food) return fallbackImages[0];

    // Try to get image by exact food name match first
    if (food.name && foodImageMapping[food.name]) {
      return foodImageMapping[food.name];
    }

    // Try to get image by partial name match (case insensitive)
    const foodNameLower = food.name?.toLowerCase() || "";
    for (const [mappedName, imageUrl] of Object.entries(foodImageMapping)) {
      if (
        foodNameLower.includes(mappedName.toLowerCase()) ||
        mappedName.toLowerCase().includes(foodNameLower)
      ) {
        return imageUrl;
      }
    }

    // Try to get by food type
    if (food.type && food.type.toLowerCase() === "spoon") {
      return "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80";
    }
    if (food.type && food.type.toLowerCase() === "wrap") {
      return "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025";
    }

    // Use fallback images in rotation
    return fallbackImages[index % fallbackImages.length];
  };

  const meals = useMemo(() => {
    if (!restaurant?.availableFoods) return [];

    return restaurant.availableFoods
      .filter((item) => item.foodId && item.isAvailable)
      .map((item, index) => ({
        id: item.foodId._id,
        name: item.foodId.name,
        price: item.foodId.price,
        type: item.foodId.type,
        image: getFoodImage(item.foodId, index),
        isAvailable: item.isAvailable,
        originalFood: item.foodId,
      }));
  }, [restaurant]);

  useEffect(() => {
    if (showCart) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCart]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/user/me", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.user) {
          console.log("this is the data", data)
          setDeliveryDetails((prev) => ({
            ...prev,
            fullName: data.user.fullName || prev.fullName,
            email: data.user.email || prev.email,
            phoneNumber: data.user.phoneNumber || prev.phoneNumber,
            roomNumber: data.user.roomNumber || prev.roomNumber,
            hostel: data.user.hostel || prev.hostel,
          }));
          setHasUserToken(true);
        }
      } catch {}
    };
    loadUser();
  }, []);



  
  const addToCart = (meal) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === meal.id);
      if (existing) {
        return prev.map((item) =>
          item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      } else {
        return [...prev, { ...meal, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (mealId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === mealId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const getQuantity = (mealId) => {
    const item = cart.find((i) => i.id === mealId);
    return item ? item.quantity : 0;
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalProducts = cart.reduce((sum, item) => sum + item.quantity, 0);
  const tipAmount = (total * selectedTip) / 100;
  const finalTotal = total + tipAmount;

  // Get restaurant name from props
  const restaurantName = restaurant?.name || "Restaurant";

  useEffect(() => {
    handleAgents();
  }, []);

  const handleAgents = async () => {
    try {
      const res = await fetch(`/api/admin/agents`);
      if (!res.ok) {
        throw new Error("Error occured");
      }

      const data = await res.json();
      setAgents(data.data);
    } catch (error) {
      throw new Error("Failed to fetch agents");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!deliveryDetails.fullName?.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!hasUserToken) {
      if (!deliveryDetails.email?.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(deliveryDetails.email)) {
        newErrors.email = "Enter a valid email";
      }
    }

    if (!deliveryDetails.phoneNumber?.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9+\s\-()]{10,15}$/.test(deliveryDetails.phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid phone number";
    }

    if (!deliveryDetails.roomNumber?.trim()) {
      newErrors.roomNumber = "Room number is required";
    }

    if (!deliveryDetails.hostel?.trim()) {
      newErrors.hostel = "Please select a hostel";
    }

    if (pickupOption === "agent" && !selectedAgent) {
      newErrors.agent = "Please select an agent";
    }

    if (cart.length === 0) {
      newErrors.cart = "Cart is empty";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormComplete = () => {
    const requiredFields = [
      deliveryDetails.fullName,
      hasUserToken ? "ok" : deliveryDetails.email,
      deliveryDetails.phoneNumber,
      deliveryDetails.roomNumber,
      deliveryDetails.hostel,
    ];

    const allFieldsFilled = requiredFields.every((field) => field?.trim());
    const hasCartItems = cart.length > 0;
    const agentValid = pickupOption !== "agent" || selectedAgent;

    return allFieldsFilled && hasCartItems && agentValid;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }
    setShowAgentDetailsModal(true);
  };

  const submitOrderAfterProof = async () => {
    setIsProcessing(true);
    try {
      const orderData = {
        restaurantId: restaurant._id,
        items: cart.map((item) => ({
          foodId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          type: item.type,
        })),
        deliveryDetails: {
          email: deliveryDetails.email,
          fullName: deliveryDetails.fullName,
          phoneNumber: deliveryDetails.phoneNumber,
          roomNumber: deliveryDetails.roomNumber,
          hostel: deliveryDetails.hostel,
        },
        pickupOption: "agent",
        assignedAgent: selectedAgent,
        agentDetails: {
          agentId: selectedAgent,
          agentName:
            agents.find((a) => a._id === selectedAgent)?.fullName ||
            `${agents.find((a) => a._id === selectedAgent)?.firstName || ""} ${
              agents.find((a) => a._id === selectedAgent)?.lastName || ""
            }`.trim(),
          agentPhone: agents.find((a) => a._id === selectedAgent)?.phone || "",
        },
        payment: {
          tipAmount: customTipAmount || 0,
          promoCode: promoCode || "",
          discountAmount: 0,
        },
        specialInstructions: "",
        subtotal: total,
        totalAmount: finalTotal,
      };

      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      if (data?.order?._id) {
        setCurrentOrderId(data.order.orderNumber);
      }

      setOrderDetails(data.order)
      setIsSuccess(true);
      setShowAgentDetailsModal(false);
      setShowCheckout(false);
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus, notes = "") => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, notes }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const data = await response.json();
      return data.order;
    } catch (error) {
      console.error("Status update failed:", error);
      throw error;
    }
  };

  const handleAssignAgent = async (orderId, agentId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/assign-agent`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agentId }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign agent");
      }

      const data = await response.json();
      return data.order;
    } catch (error) {
      console.error("Agent assignment failed:", error);
      throw error;
    }
  };

  return (
    <div className="relative">
      {/* Grid of meals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 p-5 pb-20">
        {meals.length > 0 ? (
          meals.map((meal, index) => {
            const quantity = getQuantity(meal.id);
            return (
              <div
                key={meal.id}
                className="flex flex-col items-start justify-center bg-white/20 backdrop-blur-lg border border-white/10 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="relative w-full h-40">
                  <Image
                    src={meal.image}
                    alt={meal.name}
                    fill
                    className="object-cover rounded-t-xl"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  {!meal.isAvailable && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-t-xl">
                      <span className="text-white font-semibold text-sm bg-red-500/80 px-3 py-1 rounded-lg">
                        Unavailable
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3 w-full">
                  <p className="font-semibold text-gray-800 text-sm">
                    {meal.name}
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    ₦{meal.price.toLocaleString()} / {meal.type || "item"}
                  </p>

                  {quantity === 0 ? (
                    <button
                      onClick={() => addToCart(meal)}
                      disabled={!meal.isAvailable}
                      className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-white text-xs transition w-full ${
                        meal.isAvailable
                          ? "bg-blue-600 hover:bg-blue-700/60"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <PlusCircle className="w-4 h-4" />
                      {meal.isAvailable ? "Add to Cart" : "Unavailable"}
                    </button>
                  ) : (
                    <div className="flex items-center justify-between w-full bg-blue-300/70 rounded-full px-3 py-1">
                      <button
                        onClick={() => removeFromCart(meal.id)}
                        className="text-blue-700"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-semibold text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => addToCart(meal)}
                        className="text-blue-700"
                      >
                        <PlusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No available meals at this time.</p>
          </div>
        )}
      </div>

      {/* Bottom Cart Overlay */}
      {!showCart && cart.length > 0 && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-600/50 backdrop-blur-2xl text-white px-6 py-3 rounded-full shadow-lg flex items-center justify-between w-[86%] z-90">
          <span className="font-semibold text-sm">
            Total: ₦{total.toLocaleString()}
          </span>
          <button
            className="bg-white text-blue-700 text-xs font-semibold px-3 py-1 rounded-full hover:bg-gray-100 transition"
            onClick={() => setShowCart(true)}
          >
            View Cart
          </button>
        </div>
      )}

      {/* Fullscreen Cart Overlay */}
      {showCart && (
        <div className="fixed inset-0 bg-white  flex flex-col overflow-y-auto z-50">
          <div className="flex flex-col p-5 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Your Cart
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {totalProducts} product{totalProducts !== 1 && "s"} from{" "}
                  <span className="font-semibold underline">
                    {restaurantName}
                  </span>
                </p>
              </div>

              <button onClick={() => setShowCart(false)} className="">
                <X className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {item.name}
                    </p>
                    <p className="text-gray-600 text-xs">
                      ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                  <button onClick={() => removeFromCart(item.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                  <span className="text-sm font-semibold text-gray-800">
                    {item.quantity}
                  </span>
                  <button onClick={() => addToCart(item)}>
                    <PlusCircle className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end mt-5">
              <button
                className="flex justify-center items-center bg-gray-100 rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
                onClick={() => setShowCart(false)}
              >
                Add more items
              </button>
            </div>
          </div>

          {/* Checkout Section */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between">
            <span className="font-semibold text-gray-800">
              ₦{total.toLocaleString()}
            </span>
            <button
              className="bg-blue-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-800/90 transition"
              onClick={() => {
                setShowCheckout(true);
              }}
            >
              Go to checkout
            </button>
          </div>
        </div>
      )}
      {showCheckout && (
        <div className="fixed inset-0 bg-white flex flex-col overflow-y-auto z-50">
          {/* Header */}
          <div className="flex flex-col p-5 border-b">
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="flex items-center text-gray-800 gap-5 cursor-pointer"
                  onClick={() => {
                    setShowCheckout(false);
                    setShowCart(true);
                  }}
                >
                  <ArrowLeft />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Checkout
                  </h2>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  {totalProducts} product{totalProducts !== 1 && "s"} from{" "}
                  <span className="font-semibold underline">
                    {restaurantName}
                  </span>
                </p>
              </div>

              <button onClick={() => setShowCheckout(false)}>
                <X className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          </div>

          {/* Delivery Address Section */}
          <div className="p-5 space-y-5 ">
            <h2 className="font-medium text-gray-800 flex items-center gap-2">
              <Home className="w-5 h-5 " /> Delivery Address
            </h2>

            {/* Update each input field in the Delivery Address section */}

            {/* Full Name Input */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <User className="w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder="Full name"
                value={deliveryDetails.fullName}
                onChange={(e) =>
                  setDeliveryDetails((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                className="w-full bg-transparent outline-none text-sm text-gray-700"
              />
            </div>
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}

            {!hasUserToken && (
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <MessageCircle className="w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder="Enter email"
                value={deliveryDetails.email}
                onChange={(e) =>
                  setDeliveryDetails((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="w-full bg-transparent outline-none text-sm text-gray-700"
              />
            </div>
            )}
            {errors.email && !hasUserToken && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}

            {/* Phone Number Input */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <PhoneIncoming className="w-4 h-4 text-gray-600" />
              <input
                type="tel"
                placeholder="Phone number"
                value={deliveryDetails.phoneNumber}
                onChange={(e) =>
                  setDeliveryDetails((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                className="w-full bg-transparent outline-none text-sm text-gray-700"
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}

            {/* Room Number Input */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <DoorClosed className="w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder="Room number"
                value={deliveryDetails.roomNumber}
                onChange={(e) =>
                  setDeliveryDetails((prev) => ({
                    ...prev,
                    roomNumber: e.target.value,
                  }))
                }
                className="w-full bg-transparent outline-none text-sm text-gray-700"
              />
            </div>
            {errors.roomNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.roomNumber}</p>
            )}

            {/* Hostel Select */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <Building className="w-4 h-4 text-gray-600" />
              <select
                value={deliveryDetails.hostel}
                onChange={(e) =>
                  setDeliveryDetails((prev) => ({
                    ...prev,
                    hostel: e.target.value,
                  }))
                }
                className="w-full bg-transparent outline-none text-sm text-gray-700 cursor-pointer appearance-none"
              >
                <option value="" disabled>
                  Select Hostel
                </option>
                <option value="North Hall">North Hall</option>
                <option value="South Hall">South Hall</option>
                <option value="East Gardens">East Gardens</option>
                <option value="West Tower">West Tower</option>
              </select>
            </div>
            {errors.hostel && (
              <p className="text-red-500 text-xs mt-1">{errors.hostel}</p>
            )}
          </div>

          {/* Pickup Option */}
          <div className="px-5 space-y-3 mb-6">
            {pickupOption === "agent" && (
              <div className="bg-gray-50 rounded-2xl p-4 border border-green-100 z-20">
                <p className="text-xs font-semibold text-green-700 mb-3 uppercase tracking-wider">
                  Available Agents
                </p>
                <Swiper
                  modules={[Autoplay, Pagination]}
                  spaceBetween={15}
                  slidesPerView={2.5}
                  autoplay={{ delay: 3000 }}
                  loop={true}
                  className="pb-6 -z-10"
                >
                  {agents.map((agent) => (
                    <SwiperSlide key={agent._id}>
                      <div
                        onClick={() =>
                          agent.isActive &&
                          setSelectedAgent((prev) =>
                            prev === agent._id ? null : agent._id,
                          )
                        }
                        className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all cursor-pointer relative my-3 ${
                          selectedAgent === agent._id
                            ? "bg-green-50 border-green-600 shadow-md scale-105"
                            : "bg-white border-gray-100 hover:border-gray-300"
                        } ${!agent.isActive && "opacity-60 cursor-not-allowed"}`}
                      >
                        {selectedAgent === agent._id && (
                          <div className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full p-1 shadow-lg z-10">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="relative w-12 h-12 mb-2">
                          <Image
                            src={
                              agent.profileImage ||
                              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvhI7g_-rdg75Z88PIkOHQB3YnHwJnQGp71w&s"
                            }
                            alt={agent.fullName}
                            fill
                            className="rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          {/* Online Status Indicator */}
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${agent.isActive ? "bg-green-500" : "bg-gray-400"}`}
                          ></div>
                        </div>
                        <p className="text-[11px] font-bold text-gray-800 truncate w-full text-center">
                          {agent.firstName} {agent.lastName}
                        </p>
                        <p className="text-[9px] text-gray-500">
                          {agent.gender}
                        </p>
                        <p
                          className={`text-[8px] mt-1 font-medium ${agent.isActive ? "text-green-600" : "text-gray-400"}`}
                        >
                          {agent.isActive ? "Online" : "Offline"}
                        </p>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          <div className="space-y-2 px-2">
            <label className="block text-sm font-medium text-gray-700">
              Agent Tip (₦) (Optional)
            </label>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <input
                type="number"
                placeholder="Enter tip amount"
                value={customTipAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  // Prevent negative values
                  if (value === "" || parseInt(value) >= 0) {
                    setCustomTipAmount(value);
                  }
                }}
                min="0"
                className="w-full bg-transparent outline-none text-sm text-gray-700"
              />
            </div>
          </div>
          {/* Promo Code Input */}
          <div className="space-y-2 px-2">
            <label className="block text-sm font-medium text-gray-700">
              Promo Code (Optional)
            </label>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <Percent className="w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-gray-700"
              />
            </div>
          </div>
          <div className="px-5 mt-[10%] pb-24 space-y-2">
            <h2 className="font-medium text-gray-800 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-green-700" /> Order Summary
            </h2>

            <div className="flex justify-between text-sm text-gray-700">
              <span>Subtotal</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span>Agent Tip ({selectedTip}%)</span>
              <span>
                ₦
                {tipAmount.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold text-gray-900">
              <span>Total</span>
              <span>
                ₦
                {finalTotal.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>

          {/* Pay Button */}
          <div className="fixed bottom-0 left-0 right-0 z-90 bg-white p-4 border-t flex items-center justify-between w-full">
            <button
              className="bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition w-full flex justify-center items-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-md active:scale-95"
              disabled={isProcessing || !isFormComplete()}
              onClick={handlePlaceOrder}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : pickupOption === "agent" && !selectedAgent ? (
                <>
                  <User className="w-5 h-5 opacity-70" />
                  Select an Agent to continue
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay to Order
                </>
              )}
            </button>
          </div>
        </div>
      )}
      {isSuccess && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
          {/* Success Animation Container */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
              <svg
                className="w-12 h-12 text-green-600 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path className="checkmark-path" d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-8 max-w-[280px]">
            Your meal from{" "}
            <span className="font-semibold text-blue-700">
              {orderDetails.restaurantName}
            </span>{" "}
            is being prepared.
          </p>

          {/* Order Details Card */}
          <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-10 text-left">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 text-sm">Order ID</span>
              <span className="text-gray-900 font-mono font-medium">
                #{currentOrderId}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-gray-500 text-sm">Agent Name</span>
              <span className="text-gray-900 font-medium text-sm">
                {orderDetails.agentDetails.agentName}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-4">
            <Link href="/user/orders">
              <button className="w-full bg-blue-700 text-white py-2 rounded-full font-bold hover:bg-blue-800 transition-all active:scale-95 flex items-center justify-center gap-3">
                <Truck className="w-5 h-5" />
                Track My Order
              </button>
            </Link>
            <button
              className="w-full bg-transparent text-gray-500 py-2 font-medium hover:text-gray-800 transition mt-3"
              onClick={() => {
                setIsSuccess(false);
                setShowCart(false);
                setShowCheckout(false);
                setCart([]);
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      {/* Agent Details Modal */}
      <AgentDetailsModal
        isOpen={showAgentDetailsModal}
        onClose={() => setShowAgentDetailsModal(false)}
        agent={agents.find((a) => a._id === selectedAgent)}
        onPaymentConfirmed={submitOrderAfterProof}
      />
    </div>
  );
};

export default Meal;

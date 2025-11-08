"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PlusCircle, MinusCircle, Trash2, X } from "lucide-react";

const meals = [
  { id: 1, name: "Jollof Rice", image: "https://plus.unsplash.com/premium_photo-1694141252774-c937d97641da?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=600", price: 1500 },
  { id: 2, name: "Fried Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1025", price: 1800 },
  { id: 3, name: "Beans", image: "https://media.istockphoto.com/id/1198712283/photo/chile.webp?a=1&b=1&s=612x612&w=0&k=20&c=YunbqqErACUq3_jlV0xDsfTz2IrAZ5S3AUTFUfPvRFA=", price: 1300 },
  { id: 4, name: "Amala", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv1-CWEOjFeLavKUoMkZwzQZTDGiyZN9NfjQ4V-5_naptGkpq-TVvAxcN80AZA7iSzAFc&usqp=CAU", price: 2000 },
  { id: 5, name: "Efo Riro", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8UQpd61r9Tfc41NKQX5-Hd5V9o3e2lL9aJF6uwKh8EzV77BT9YWQMZBvpasnxYboT17A&usqp=CAU", price: 1700 },
  { id: 6, name: "Semo", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHv6JAbqBMxjXjYGE1PFhZgvUqgxPAklD7n5dMZLzL6UDe9KG8TjqbbmswexEG4ywW54s&usqp=CAU", price: 1900 },
  { id: 7, name: "Pounded Yam", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvJm3oF0NEj2-3iQUvoStknLqRXZL3AclnzgOFGPLzO4pFnLKsOqjTFQe7Iw8ZmxRb7EI&usqp=CAU", price: 2200 },
  { id: 8, name: "Ofada Rice", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR30GIfUKsV75IRGOXxyBgLBf8FOTmxYO1K5LG2fryP8b0QnYw8oInu9aW-rvPXGx-8NHk&usqp=CAU", price: 1600 },
  { id: 9, name: "Moi Moi", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE3Ht9D0dqVlnDRvU7lMSEmEW1_Y79qqmqU70rxOdeqnyYeT8SkSR4Oz6OZYfzsYB9V4c&usqp=CAU", price: 900 },
  { id: 10, name: "Spaghetti", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_d7U7azBd3LeDGooqwgaiZwK_NT20IrciB21AXbwCwORu641xipHgOaIUebwQJTlX_kw&usqp=CAU", price: 800 },
];

const Meal = ({ restaurantName }) => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

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

  const addToCart = (meal) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === meal.id);
      if (existing) {
        return prev.map((item) =>
          item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
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
          item.id === mealId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getQuantity = (mealId) => {
    const item = cart.find((i) => i.id === mealId);
    return item ? item.quantity : 0;
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalProducts = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative">
      {/* Grid of meals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 p-5 pb-20">
        {meals.map((meal) => {
          const quantity = getQuantity(meal.id);
          return (
            <div
              key={meal.id}
              className="flex flex-col items-start justify-center bg-white/20 backdrop-blur-lg border border-white/10 rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <div className="relative w-full h-40">
                <Image
                  src={meal.image}
                  alt={meal.name}
                  fill
                  className="object-cover rounded-t-xl"
                />
              </div>
              <div className="p-3 w-full">
                <p className="font-semibold text-gray-800 text-sm">{meal.name}</p>
                <p className="text-xs text-gray-600 mb-2">
                  ₦{meal.price.toLocaleString()}
                </p>

                {quantity === 0 ? (
                  <button
                    onClick={() => addToCart(meal)}
                    className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-green-600 hover:bg-green-700 text-white text-xs transition w-full "
                  >
                    <PlusCircle className="w-4 h-4" /> Add to Cart
                  </button>
                ) : (
                  <div className="flex items-center justify-between w-full bg-green-100 rounded-full px-3 py-1">
                    <button
                      onClick={() => removeFromCart(meal.id)}
                      className="text-green-700"
                    >
                      <MinusCircle className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-semibold text-green-800">{quantity}</span>
                    <button
                      onClick={() => addToCart(meal)}
                      className="text-green-700"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Cart Overlay */}
      {!showCart && cart.length > 0 && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-green-600/20 backdrop-blur-2xl text-white px-6 py-3 rounded-full shadow-lg flex items-center justify-between w-[86%] ">
          <span className="font-semibold text-sm">
            Total: ₦{total.toLocaleString()}
          </span>
          <button
            className="bg-white text-green-700 text-xs font-semibold px-3 py-1 rounded-full hover:bg-gray-100 transition"
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
                    {/* 👇 NEW LINE: show total products and restaurant name */}
            <p className="text-sm text-gray-600 mt-1">
              {totalProducts} product{totalProducts !== 1 && "s"} from{" "}
              <span className="font-semibold underline">{restaurantName}</span>
            </p>
              </div>
           
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
        
          </div>

          <div className="p-5 space-y-5">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16">
                    <Image src={item.image} alt={item.name} fill className="rounded-lg object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                    <p className="text-gray-600 text-xs">₦{item.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                  <button onClick={() => removeFromCart(item.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                  <span className="text-sm font-semibold text-gray-800">{item.quantity}</span>
                  <button onClick={() => addToCart(item)}>
                    <PlusCircle className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              </div>
            ))}
           <div className="flex justify-end mt-5">
    <button className="flex justify-center items-center bg-gray-100 rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"     onClick={() => setShowCart(false)}>
      Add more items
    </button>
  </div>
          </div>

          {/* Checkout Section */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between">
            <span className="font-semibold text-gray-800">
              ₦{total.toLocaleString()}
            </span>
            <button className="bg-green-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-800 transition">
              Go to checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meal;

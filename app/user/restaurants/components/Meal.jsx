"use client";
import React, { useState } from "react";
import Image from "next/image";
import { PlusCircle, Trash2 } from "lucide-react";

const meals = [
  {
    id: 1,
    name: "Jollof Rice",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/94/Jollof_rice_with_salad_and_plantain.jpg",
    price: 1500,
  },
  {
    id: 2,
    name: "Fried Rice",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/b/bc/Fried_Rice_with_Shrimps_and_Vegetables.jpg",
    price: 1800,
  },
  {
    id: 3,
    name: "Beans & Plantain",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/76/Ewa_Agoyin_with_plantain.jpg",
    price: 1300,
  },
  {
    id: 4,
    name: "Amala & Ewedu",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d4/Amala_and_Ewedu_soup.jpg",
    price: 2000,
  },
  {
    id: 5,
    name: "Efo Riro",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Efo_riro.jpg",
    price: 1700,
  },
  {
    id: 6,
    name: "Semo & Egusi",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/73/Egusi_Soup_with_Semovita.jpg",
    price: 1900,
  },
  {
    id: 7,
    name: "Pounded Yam & Egusi",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/a4/Pounded_Yam_and_Egusi_Soup.jpg",
    price: 2200,
  },
  {
    id: 8,
    name: "Ofada Rice",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/8b/Ofada_rice_and_ayamase_stew.jpg",
    price: 1600,
  },
  {
    id: 9,
    name: "Moi Moi",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/77/Moi_Moi_Beans_Pudding.jpg",
    price: 900,
  },
  {
    id: 10,
    name: "Akara & Pap",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d8/Akara_and_pap_breakfast.jpg",
    price: 800,
  },
];

const Meal = () => {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (meal) => {
    if (!cart.some((item) => item.id === meal.id)) {
      setCart((prev) => [...prev, meal]);
    }
  };

  const handleRemove = (mealId) => {
    setCart((prev) => prev.filter((item) => item.id !== mealId));
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 p-5">
      {meals.map((meal) => {
        const inCart = cart.some((item) => item.id === meal.id);
        return (
          <div
            key={meal.id}
            className="flex flex-col items-center justify-center bg-white/20 backdrop-blur-lg border border-white/10 p-4 rounded-2xl shadow-sm hover:shadow-md transition"
          >
            <div className="relative w-28 h-28 mb-3">
              <Image
                src={meal.image}
                alt={meal.name}
                fill
                className="object-cover rounded-xl"
              />
            </div>
            <p className="font-semibold text-gray-800 text-sm">{meal.name}</p>
            <p className="text-xs text-gray-600 mb-2">
              ₦{meal.price.toLocaleString()}
            </p>

            {!inCart ? (
              <button
                onClick={() => handleAddToCart(meal)}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-600 hover:bg-green-700 text-white text-xs transition"
              >
                <PlusCircle className="w-4 h-4" /> Add to Cart
              </button>
            ) : (
              <button
                onClick={() => handleRemove(meal.id)}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs transition"
              >
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Meal;

import React from "react";
import GlassBG from "./GlassBG";
import { Star, ChevronRight, MapPin, Clock } from "lucide-react";
import Link from "next/link";

const RestaurantCard = () => {
  const restaurants = [
    {
      id: 1,
      name: "Lacuisine",
      image:
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80",
      rating: 4.8,
      deliveryTime: "15-25 min",
      distance: "1.2 km",
      cuisine1: "Rice",
      cuisine2: "Beans",
      cuisine3: "Spaghetti",
    },
    {
      id: 2,
      name: "Sir K",
      image:
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
      rating: 4.5,
      deliveryTime: "20-30 min",
      distance: "2.1 km",
      cuisine1: "Rice",
      cuisine2: "Beans",
      cuisine3: "Spaghetti",
    },
    {
      id: 3,
      name: "Joked",
      image:
        "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80",
      rating: 4.9,
      deliveryTime: "10-20 min",
      distance: "0.8 km",
      cuisine1: "Rice",
      cuisine2: "Beans",
      cuisine3: "Spaghetti",
    },
    {
      id: 4,
      name: "Bite and Smile",
      image:
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80",
      rating: 4.3,
      deliveryTime: "25-35 min",
      distance: "3.5 km",
      cuisine1: "Rice",
      cuisine2: "Beans",
      cuisine3: "Spaghetti",
    },
    {
      id: 5,
      name: "Green Garden",
      image:
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
      rating: 4.7,
      deliveryTime: "15-25 min",
      distance: "1.8 km",
      cuisine1: "Rice",
      cuisine2: "Beans",
      cuisine3: "Spaghetti",
    },
  ];

  return (
    <div className="relative px-5 py-8">
      {/* Subtle Grid Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-cyan-50/10" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px),
                             linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Animated floating shapes */}
        <div className="absolute top-10 left-10 w-8 h-8 rounded-full bg-blue-400/10 animate-pulse" />
        <div className="absolute top-1/3 right-5 w-12 h-12 rounded-lg bg-cyan-400/10 animate-pulse delay-300" />
        <div className="absolute bottom-20 left-20 w-6 h-6 rounded-full bg-blue-300/10 animate-pulse delay-500" />
        <div className="absolute bottom-10 right-10 w-10 h-10 rounded-lg bg-cyan-300/10 animate-pulse delay-700" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium mb-1 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Top Restaurants
            </h1>
            <p className="text-sm text-blue-400/80">
              Near you
            </p>
          </div>
          {/* <div className="flex items-center gap-2 text-blue-500">
            <span className="text-sm font-medium">View All</span>
            <ChevronRight size={16} />
          </div> */}
        </div>

        <div className="space-y-4">
          {restaurants.map((r) => (
            <Link
              key={r.id}
              href={`/restaurants/${r.id}`}
              className="block group"
            >
              <GlassBG className="relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg shadow-sm border border-blue-200/70 bg-blue-200/10 backdrop-blur-sm rounded-2xl">
                {/* Restaurant info */}
                <div className="flex items-start gap-4 p-4">
                  {/* Restaurant image with subtle shape variation */}
                  <div
                    className={`relative rounded-2xl overflow-hidden flex-shrink-0`}
                  >
                    <img
                      src={r.image}
                      alt={r.name}
                      className={`w-20 h-20 object-cover transition-transform duration-300 group-hover:scale-110 rounded-full
                      }`}
                    />
                  
                  </div>

                  {/* Restaurant details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-lg font-semibold text-blue-900 truncate">
                        {r.name}
                      </h2>
                      <ChevronRight
                        size={20}
                        className="text-blue-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2"
                      />
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-sm text-blue-600/80">
                        <Clock size={14} />
                        <span>{r.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-blue-600/80">
                        <MapPin size={14} />
                        <span>{r.distance}</span>
                      </div>
                    </div>

                    {/* Cuisine tags - varying sizes */}
                    <div className="flex flex-wrap gap-2">
                      <div
                        className={`px-3 py-1 rounded-full bg-blue-100/50 text-blue-700 text-xs font-medium ${
                          r.id % 3 === 0
                            ? "text-xs"
                            : r.id % 3 === 1
                              ? "text-sm"
                              : "text-xs font-semibold"
                        }`}
                      >
                        {r.cuisine1}
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full bg-cyan-100/50 text-cyan-700 text-xs font-medium ${
                          r.id % 3 === 1
                            ? "text-sm"
                            : r.id % 3 === 2
                              ? "text-xs"
                              : "text-xs font-semibold"
                        }`}
                      >
                        {r.cuisine2}
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full bg-blue-200/50 text-blue-800 text-xs font-medium ${
                          r.id % 3 === 2
                            ? "text-sm"
                            : r.id % 3 === 0
                              ? "text-xs"
                              : "text-xs font-semibold"
                        }`}
                      >
                        {r.cuisine3}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle grid pattern overlay for card */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-5"
                  style={{
                    backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px),
                                     linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
                    backgroundSize: "20px 20px",
                  }}
                />
              </GlassBG>
            </Link>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === 0
                    ? "w-6 bg-blue-500"
                    : i === 1
                      ? "bg-blue-400"
                      : i === 2
                        ? "bg-cyan-400"
                        : i === 3
                          ? "bg-blue-300"
                          : "bg-cyan-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;

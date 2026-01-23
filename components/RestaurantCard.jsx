"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import GlassBG from "./GlassBG";
import { Star, ChevronRight, MapPin, Clock } from "lucide-react";
import Link from "next/link";

const RestaurantCard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/restaurants");
        const data = await response.json();

        if (data.success) {
          setRestaurants(data.restaurants);
          console.log(data.restaurants);
        } else {
          setError("Failed to fetch restaurants");
        }
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

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
            <p className="text-sm text-blue-400/80">Near you</p>
          </div>
          {/* <div className="flex items-center gap-2 text-blue-500">
            <span className="text-sm font-medium">View All</span>
            <ChevronRight size={16} />
          </div> */}
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-blue-400">Loading restaurants...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-400">Error: {error}</p>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-blue-400">No restaurants available</p>
            </div>
          ) : (
            restaurants.map((r) => (
              <Link
                key={r._id}
                href={`/restaurants/${r._id}`}
                className="block group"
              >
                <GlassBG className="relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg shadow-sm border border-blue-200/70 bg-blue-200/10 backdrop-blur-sm rounded-2xl">
                  {/* Restaurant info */}
                  <div className="flex items-start gap-4 p-4">
                    {/* Restaurant image with subtle shape variation */}
                    <div
                      className={`relative rounded-2xl overflow-hidden flex-shrink-0 w-20 h-20`}
                    >
                      <Image
                        src={r.image}
                        alt={r.name}
                        width={80}
                        height={80}
                        className={`w-20 h-20 object-cover transition-transform duration-300 group-hover:scale-110 rounded-full`}
                      />
                    </div>

                    {/* Restaurant details */}
                    <div className="flex-1 min-w-0">
                      {/* Description */}
                      {/* {r.description && (
                        <p className="text-sm text-blue-600/70 mb-3 line-clamp-1">
                          {r.description}
                        </p>
                      )} */}

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
                          {r.availableFoods
                            .filter((c) => c.isAvailable)
                            .slice(0, 3)
                            .map((c) => (
                              <div
                                key={c._id}
                                className={`px-3 py-1 rounded-full bg-blue-200/50 text-blue-800 text-xs font-medium`}
                              >
                                {c.foodId.name}
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Location and Contact */}
                      <div className="flex items-center gap-4 mb-3">
                        {r.location && (
                          <div className="flex items-center gap-1 text-sm text-blue-600/80">
                            <MapPin size={14} />
                            <span>{r.location}</span>
                          </div>
                        )}
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
            ))
          )}
        </div>

        {/* Decorative elements */}
        {/* <div className="flex justify-center mt-8">
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
        </div> */}
      </div>
    </div>
  );
};

export default RestaurantCard;

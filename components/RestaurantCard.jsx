import React, { useState } from "react";
import GlassBG from "./GlassBG";
import { Star, ChevronRight, Heart, MapPin, Clock, Sparkles } from "lucide-react";
import Link from "next/link";

// Animated pulse component for loading/status
const PulseDot = ({ color = "bg-emerald-400" }) => (
  <span className={`relative flex h-2 w-2 ${color}`}>
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}></span>
    <span className={`relative inline-flex rounded-full h-2 w-2 ${color}`}></span>
  </span>
);

// Rating stars component
const RatingStars = ({ rating = 4.5 }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={10}
        className={`${
          i < Math.floor(rating)
            ? "fill-amber-400 text-amber-400"
            : "fill-gray-600/50 text-gray-600/50"
        }`}
      />
    ))}
    <span className="text-xs text-gray-300 ml-1">{rating}</span>
  </div>
);

// Subtle grid background component
const SubtleGrid = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-purple-950/20"></div>
    <div 
      className="absolute inset-0 opacity-[0.02]" 
      style={{
        backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px),
                         linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
  </div>
);

// Floating element for visual interest
const FloatingElement = ({ delay = 0 }) => (
  <div 
    className={`absolute w-32 h-32 bg-gradient-to-r from-red-500/10 to-purple-500/10 rounded-full blur-xl animate-float`}
    style={{
      animationDelay: `${delay}s`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }}
  />
);

const RestaurantCard = () => {
  const [favorites, setFavorites] = useState([]);
  
  const restaurants = [
    {
      id: 1,
      name: "La Cuisine Royale",
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80",
      cuisines: ["French", "Mediterranean", "Seafood"],
      rating: 4.8,
      deliveryTime: "25-35 min",
      distance: "1.2 km",
      isOpen: true,
      tags: ["Premium", "Fine Dining"],
      featured: true,
    },
    {
      id: 2,
      name: "Sir K's Grillhouse",
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
      cuisines: ["Steakhouse", "American", "BBQ"],
      rating: 4.5,
      deliveryTime: "30-45 min",
      distance: "2.1 km",
      isOpen: true,
      tags: ["Family Friendly", "Best Seller"],
    },
    {
      id: 3,
      name: "Joked Ramen Bar",
      image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80",
      cuisines: ["Japanese", "Ramen", "Asian"],
      rating: 4.7,
      deliveryTime: "20-30 min",
      distance: "0.8 km",
      isOpen: true,
      tags: ["Trending", "Authentic"],
      featured: true,
    },
    {
      id: 4,
      name: "Bite & Smile Cafe",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      cuisines: ["Cafe", "Pastries", "Breakfast"],
      rating: 4.3,
      deliveryTime: "15-25 min",
      distance: "0.5 km",
      isOpen: true,
      tags: ["Cozy", "Breakfast"],
    },
    {
      id: 5,
      name: "Green Garden",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      cuisines: ["Vegetarian", "Healthy", "Organic"],
      rating: 4.6,
      deliveryTime: "35-50 min",
      distance: "3.2 km",
      isOpen: false,
      tags: ["Healthy", "Eco-friendly"],
    },
  ];

  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="relative min-h-screen px-4 py-6 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background elements */}
      <SubtleGrid />
      <FloatingElement delay={0} />
      <FloatingElement delay={2} />
      <FloatingElement delay={4} />
      
      {/* Header with animated gradient */}
      <div className="relative mb-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#A31621] to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
        <h1 className="relative text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#A31621] via-red-400 to-purple-400 bg-clip-text text-transparent">
          Top Restaurants
        </h1>
        <p className="text-gray-400 text-sm">Discover premium dining experiences near you</p>
      </div>

      {/* Restaurant grid with masonry-like effect */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {restaurants.map((restaurant, index) => (
          <Link
            key={restaurant.id}
            href={`/user/restaurants/${restaurant.id}`}
            className={`group relative block ${index % 3 === 0 ? 'md:col-span-1' : ''}`}
          >
            {/* Card Container */}
            <div className="relative h-full">
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/30 to-purple-500/30 rounded-2xl blur opacity-0 group-hover:opacity-70 transition duration-500 group-hover:duration-200"></div>
              
              <GlassBG className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 hover:border-red-500/30 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-red-900/20">
                
                {/* Featured badge */}
                {restaurant.featured && (
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-sm rounded-full">
                    <Sparkles size={10} className="text-white" />
                    <span className="text-[10px] font-semibold text-white">Featured</span>
                  </div>
                )}
                
                {/* Favorite button */}
                <button
                  onClick={(e) => toggleFavorite(restaurant.id, e)}
                  className="absolute top-3 right-3 z-10 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all hover:scale-110"
                >
                  <Heart
                    size={18}
                    className={`${
                      favorites.includes(restaurant.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-white/70'
                    } transition-all`}
                  />
                </button>
                
                {/* Restaurant image with gradient overlay */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  
                  {/* Status indicator */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <PulseDot color={restaurant.isOpen ? "bg-emerald-400" : "bg-red-400"} />
                    <span className="text-xs text-white font-medium">
                      {restaurant.isOpen ? "Open Now" : "Closed"}
                    </span>
                  </div>
                </div>
                
                {/* Content area */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-lg font-bold text-white group-hover:text-red-100 transition-colors">
                        {restaurant.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <RatingStars rating={restaurant.rating} />
                        <span className="text-xs text-gray-400">•</span>
                        <div className="flex items-center gap-1">
                          <MapPin size={10} className="text-gray-400" />
                          <span className="text-xs text-gray-400">{restaurant.distance}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight 
                      size={20} 
                      className="text-gray-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all" 
                    />
                  </div>
                  
                  {/* Cuisine tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {restaurant.cuisines.map((cuisine, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gradient-to-r from-red-500/10 to-purple-500/10 backdrop-blur-sm rounded-lg border border-red-500/20"
                      >
                        <span className="text-xs font-medium text-gray-300">{cuisine}</span>
                      </span>
                    ))}
                  </div>
                  
                  {/* Additional info */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-300">{restaurant.deliveryTime}</span>
                    </div>
                    
                    {/* Restaurant tags */}
                    <div className="flex gap-1">
                      {restaurant.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-black/30 rounded-full"
                        >
                          <span className="text-[10px] text-gray-400">{tag}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Micro-interaction hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </GlassBG>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Footer stats */}
      <div className="mt-8 pt-6 border-t border-gray-800">
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-gray-900 -ml-2 first:ml-0 overflow-hidden"
                  >
                    <img
                      src={restaurants[i].image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <span>Loved by 500+ foodies</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span>Average rating: 4.6</span>
            </div>
          </div>
          <span className="text-gray-500 text-xs">Updated just now</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
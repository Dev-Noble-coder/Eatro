"use client";

import React from "react";

const RestaurantsCard = ({
  restaurant,
  foods,
  onClick,
  onEditRestaurant,
  onDeleteRestaurant,
}) => {
  // Handle missing restaurant data
  if (!restaurant) {
    return null;
  }

  // Calculate stats
  const availableFoods =
    restaurant.availableFoods?.filter((af) => af.isAvailable) || [];
  const unavailableFoods =
    restaurant.availableFoods?.filter((af) => !af.isAvailable) || [];
  const totalFoods = restaurant.availableFoods?.length || 0;

  // Get available food details
  const availableFoodDetails = availableFoods
    .map((af) => {
      const food = foods.find((f) => f._id === af.foodId?._id);
      return food ? food.name : "Unknown";
    })
    .slice(0, 3); // Show only first 3

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300">
      {/* Restaurant Image */}
      <div className="relative h-40 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">
            {restaurant.name.charAt(0)}
          </span>
        </div>
        {/* Status badge */}
        {!restaurant.isActive && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
              Inactive
            </span>
          </div>
        )}
      </div>

      {/* Restaurant Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              {restaurant.name}
            </h3>
            {restaurant.location && (
              <p className="text-sm text-gray-600 mt-1">
                {restaurant.location}
              </p>
            )}
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${totalFoods > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
          >
            {totalFoods} foods
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Available:</span>
            <span className="text-green-600 font-semibold">
              {availableFoods.length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Unavailable:</span>
            <span className="text-red-600 font-semibold">
              {unavailableFoods.length}
            </span>
          </div>
        </div>

        {/* Available Foods Preview */}
        {availableFoodDetails.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Available foods:</p>
            <div className="flex flex-wrap gap-1">
              {availableFoodDetails.map((foodName, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                >
                  {foodName}
                </span>
              ))}
              {availableFoods.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{availableFoods.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onClick(restaurant)}
            className="flex-1 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-colors text-sm font-medium"
          >
            Manage Foods
          </button>

          <button
            onClick={() => onEditRestaurant(restaurant)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit restaurant"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={() => onDeleteRestaurant(restaurant)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete restaurant"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantsCard;

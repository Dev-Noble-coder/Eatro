"use client";

import React, { useState, useEffect } from "react";

const RestaurantFoodsOverlay = ({
  restaurant,
  foods,
  onClose,
  onToggleAvailability,
}) => {
  const [loadingFoods, setLoadingFoods] = useState({});
  const [foodAvailabilityMap, setFoodAvailabilityMap] = useState({});

  // Initialize/update the availability map when restaurant prop changes
  useEffect(() => {
    const newMap = {};
    restaurant.availableFoods?.forEach((af) => {
      newMap[af.foodId?._id || af.foodId] = af.isAvailable;
    });
    setFoodAvailabilityMap(newMap);
  }, [restaurant]);

  // Sort foods: available first, then unavailable, then not set
  const sortedFoods = [...foods].sort((a, b) => {
    const aAvailable = foodAvailabilityMap[a._id];
    const bAvailable = foodAvailabilityMap[b._id];

    if (aAvailable === true && bAvailable !== true) return -1;
    if (aAvailable !== true && bAvailable === true) return 1;
    if (aAvailable === false && bAvailable === undefined) return -1;
    if (aAvailable === undefined && bAvailable === false) return 1;
    return 0;
  });

  const handleToggle = async (foodId) => {
    const currentStatus = foodAvailabilityMap[foodId] || false;
    setLoadingFoods((prev) => ({ ...prev, [foodId]: true }));

    try {
      await onToggleAvailability(foodId, restaurant._id, currentStatus);
      // Update local availability map immediately on success
      setFoodAvailabilityMap((prev) => ({
        ...prev,
        [foodId]: !currentStatus,
      }));
    } catch (error) {
      console.error("Error toggling food:", error);
    } finally {
      setLoadingFoods((prev) => ({ ...prev, [foodId]: false }));
    }
  };

  const getAvailabilityStatus = (foodId) => {
    const status = foodAvailabilityMap[foodId];
    if (status === true) return "available";
    if (status === false) return "unavailable";
    return "not-set";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay Background */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-4xl max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {restaurant.name}
            </h2>
            <p className="text-gray-600">
              Manage available foods for this restaurant
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  Object.values(foodAvailabilityMap).filter(
                    (status) => status === true,
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {
                  Object.values(foodAvailabilityMap).filter(
                    (status) => status === false,
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Unavailable</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {foods.length - Object.keys(foodAvailabilityMap).length}
              </div>
              <div className="text-sm text-gray-600">Not Set</div>
            </div>
          </div>
        </div>

        {/* Foods List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedFoods.map((food) => {
              const status = getAvailabilityStatus(food._id);
              const isLoading = loadingFoods[food._id];

              return (
                <div
                  key={food._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {food.name}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {food.type}
                      </p>
                    </div>
                    <span className="text-blue-600 font-bold">
                      ₦{food.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${status === "available" ? "bg-green-500" : status === "unavailable" ? "bg-red-500" : "bg-gray-400"}`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          status === "available"
                            ? "text-green-600"
                            : status === "unavailable"
                              ? "text-red-600"
                              : "text-gray-500"
                        }`}
                      >
                        {status === "available"
                          ? "Available"
                          : status === "unavailable"
                            ? "Unavailable"
                            : "Not set"}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggle(food._id)}
                      disabled={isLoading}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        status === "available"
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-1">
                          <svg
                            className="animate-spin h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        </span>
                      ) : status === "available" ? (
                        "Make Unavailable"
                      ) : (
                        "Make Available"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantFoodsOverlay;

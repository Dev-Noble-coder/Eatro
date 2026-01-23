"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "../layout/AppLayout";
import RestaurantList from "./components/RestaurantList";
import RestaurantFoodsOverlay from "./components/RestaurantFoodsOverlay.js";
import RestaurantOverlay from "./components/RestaurantOverlay";
import ProductOverlay from "./components/ProductOverlay";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

const AdminPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);

  const [showRestaurantFoodsOverlay, setShowRestaurantFoodsOverlay] =
    useState(false);
  const [showRestaurantOverlay, setShowRestaurantOverlay] = useState(false);
  const [showProductOverlay, setShowProductOverlay] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // 'restaurant' or 'food'

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch restaurants and foods
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch restaurants
      const restaurantsRes = await fetch("/api/admin/restaurants");
      if (!restaurantsRes.ok) throw new Error("Failed to fetch restaurants");
      const restaurantsData = await restaurantsRes.json();

      // Fetch foods
      const foodsRes = await fetch("/api/admin/create");
      if (!foodsRes.ok) throw new Error("Failed to fetch foods");
      const foodsData = await foodsRes.json();

      setRestaurants(restaurantsData.restaurants || []);
      setFoods(foodsData.foods || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowRestaurantFoodsOverlay(true);
  };

  const handleCreateRestaurant = () => {
    setSelectedRestaurant(null);
    setShowRestaurantOverlay(true);
  };

  const handleEditRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowRestaurantOverlay(true);
  };

  const handleDeleteRestaurant = (restaurant) => {
    setItemToDelete(restaurant);
    setDeleteType("restaurant");
    setShowDeleteModal(true);
  };

  const handleCreateFood = () => {
    setSelectedFood(null);
    setShowProductOverlay(true);
  };

  const handleEditFood = (food) => {
    setSelectedFood(food);
    setShowProductOverlay(true);
  };

  const handleDeleteFood = (food) => {
    setItemToDelete(food);
    setDeleteType("food");
    setShowDeleteModal(true);
  };

  const handleRestaurantSaved = () => {
    setShowRestaurantOverlay(false);
    setSelectedRestaurant(null);
    fetchData();
  };

  const handleFoodSaved = () => {
    setShowProductOverlay(false);
    setSelectedFood(null);
    fetchData();
  };

  const handleDeleteConfirmed = async () => {
    try {
      if (!itemToDelete || !itemToDelete._id) {
        throw new Error("Item to delete is not properly set");
      }

      let url, message;

      if (deleteType === "restaurant") {
        url = `/api/admin/restaurants?id=${itemToDelete._id}`;
        message = "Restaurant deleted successfully";
      } else {
        url = `/api/admin/foods?id=${itemToDelete._id}`;
        message = "Food item deleted successfully";
      }

      const response = await fetch(url, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to delete ${deleteType}`);
      }

      alert(message);
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
      setDeleteType("");
    }
  };

  const toggleFoodAvailability = async (
    foodId,
    restaurantId,
    currentStatus,
  ) => {
    try {
      const response = await fetch(`/api/admin/foods/${foodId}/availability`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId,
          isAvailable: !currentStatus,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Use the restaurant data from the response directly
        if (result && result.data && result.data.restaurant) {
          setRestaurants((prev) =>
            prev.map((r) =>
              r && r._id === restaurantId ? result.data.restaurant : r,
            ),
          );
        }
      }
    } catch (err) {
      console.error("Error toggling availability:", err);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Restaurant Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage restaurants and their available foods
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={handleCreateRestaurant}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-full flex justify-center items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Restaurant
            </button>

            <button
              onClick={handleCreateFood}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-full flex justify-center items-center gap-2 hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Food Item
            </button>
          </div>

          {/* Restaurant List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-blue-700">
                Restaurants
              </h2>
              <span className="text-gray-600">
                {restaurants.length} restaurants
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-600 mb-2">{error}</div>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Retry
                </button>
              </div>
            ) : restaurants.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">No restaurants found</div>
                <button
                  onClick={handleCreateRestaurant}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Add Your First Restaurant
                </button>
              </div>
            ) : (
              <RestaurantList
                restaurants={restaurants}
                foods={foods}
                onRestaurantClick={handleRestaurantClick}
                onEditRestaurant={handleEditRestaurant}
                onDeleteRestaurant={handleDeleteRestaurant}
              />
            )}
          </div>

          {/* Food Pool */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-blue-700">Food Pool</h2>
              <span className="text-gray-600">{foods.length} items</span>
            </div>

            {foods.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">No food items yet</div>
                <button
                  onClick={handleCreateFood}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Add Food Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {foods.map((food) => (
                  <div
                    key={food._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {food.name}
                      </h3>
                      <span className="text-blue-600 font-bold">
                        ₦{food.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 capitalize">
                      {food.type}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditFood(food)}
                        className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFood(food)}
                        className="flex-1 py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Overlays */}
        {showRestaurantFoodsOverlay && selectedRestaurant && (
          <RestaurantFoodsOverlay
            restaurant={selectedRestaurant}
            foods={foods}
            onClose={() => setShowRestaurantFoodsOverlay(false)}
            onToggleAvailability={toggleFoodAvailability}
          />
        )}

        {showRestaurantOverlay && (
          <RestaurantOverlay
            restaurant={selectedRestaurant}
            onClose={() => setShowRestaurantOverlay(false)}
            onSave={handleRestaurantSaved}
          />
        )}

        {showProductOverlay && (
          <ProductOverlay
            food={selectedFood}
            onClose={() => setShowProductOverlay(false)}
            onSave={handleFoodSaved}
          />
        )}

        {showDeleteModal && itemToDelete && (
          <ConfirmDeleteModal
            item={itemToDelete}
            type={deleteType}
            onClose={() => {
              setShowDeleteModal(false);
              setItemToDelete(null);
              setDeleteType("");
            }}
            onConfirm={handleDeleteConfirmed}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default AdminPage;

"use client";

import React from "react";
import RestaurantsCard from "./RestaurantsCard";

const RestaurantList = ({
  restaurants,
  foods,
  onRestaurantClick,
  onEditRestaurant,
  onDeleteRestaurant,
}) => {
   if (!restaurants) {
     return null;
   }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant, index) => (
        <RestaurantsCard
          key={index}
          restaurant={restaurant}
          foods={foods}
          onClick={onRestaurantClick}
          onEditRestaurant={onEditRestaurant}
          onDeleteRestaurant={onDeleteRestaurant}
        />
      ))}
    </div>
  );
};

export default RestaurantList;

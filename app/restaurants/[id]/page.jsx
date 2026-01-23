"use client";
import React, { use, useEffect, useState } from "react";
import AppLayout from "../../../components/AppLayout";
import Hero from "../../../components/Hero";
import SearchInput from "../../../components/SearchInput";
import Specials from "../../../components/Specials";
import Filter from "../../../components/Filter";
import Meal from "../../../components/Meal";
import LoadingAnimation from "../../../components/LoadingAnimation";

export default function DynamicRestaurants({ params }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const { id } = use(params);

  useEffect(() => {
    const handleRestaurants = async () => {
      try {
        const res = await fetch(`/api/admin/restaurants/${id}`);

        if (!res.ok) {
          throw new Error("Error occured");
        }

        const data = await res.json();
        setRestaurant(data.restaurant);

      } catch (error) {
        console.error("Failed to fetch restaurants", error);
      } finally {
        setLoading(false);
      }
    };

    handleRestaurants();
  }, [id]);

  if (loading) return <LoadingAnimation />;

  if (!restaurant) return <p className="text-white">Restaurant not found</p>;

  return (
    <>
      <AppLayout>
        <Hero bgImage={restaurant.bgImage} route="/">
          <div className="py-14 px-5 text-white">
            <h2 className="text-3xl font-semibold mb-3 ">{restaurant.name}</h2>
            <p className="pb-3">
              {" "}
              Join our growing network of customers! We offer different ranges
              of food, we’d love to serve you...
            </p>
            <p className="text-white/50 ">Place an order to Get Started !</p>
          </div>
        </Hero>

        <div className="ml-5 mt-5 mb-3">
          <h2 className="text-xl font-semibold text-gray-900">Food</h2>
        </div>
        <SearchInput />
        {/* <Specials /> */}
        {/* <Filter /> */}
        <Meal restaurant={restaurant} />
      </AppLayout>
    </>
  );
}

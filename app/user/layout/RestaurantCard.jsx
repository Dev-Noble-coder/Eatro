import React from "react";
import GlassBG from "./GlassBG";
import { Star, ChevronRight } from "lucide-react";
import Link from "next/link";

const RestaurantCard = () => {
  const restaurants = [
    {
      id: 1,
      name: "Lacuisine",
      image:
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80",
      cuisine1: "Rice",
      cuisine2: "Beans",
      cuisine3: "Spaghetti",
    },
    {
      id: 2,
      name: "Sir K",
      image:
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
      cuisine1: "Rice",
      cuisine2: "Beans",
      cuisine3: "Spaghetti",
    },
    {
      id: 3,
      name: "Joked",
      image:
        "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80",
      cuisine1: "Rice",
      cuisine2: "Beans",
      cuisine3: "Spaghetti",
    },
    {
      id: 4,
      name: "Bite and Smile",
      image:
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80",
      cuisine1: "Rice",
      cuisine2: "Beans",
      cuisine3: "Spaghetti",
    },
    {
      id: 5,
      name: "Green Garden",
      image:
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
      cuisine1: "Rice",
      cuisine2: "Beans",
      cuisine3: "Spaghetti",
    },
  ];

  return (
    <div className="px-5">
      <h1 className="text-2xl text-[#A31621] font-medium mb-6">
        Top Restuarants
      </h1>
      <div className="mb-6">
        {restaurants.map((r) => (
          <Link key={r.id} href={`/user/restaurants/${r.id}`}>
          <GlassBG
            className="flex items-center gap-4 transition mb-2 rounded-xl "
          >
            <img
              src={r.image}
              alt={r.name}
              className="w-24 h-24 object-cover rounded-l-xl"
            />
            <div className="flex flex-col flex-1">
              <h2 className="text-lg font-semibold text-[#A31621]">{r.name}</h2>
              <p className="text-white text-sm pb-3">Get your best meal yet !</p>
              <div className="flex gap-5">
                <div className="flex items-center gap-1 ">
                  <img
                    src={r.image}
                    alt={r.name}
                    className="w-5 h-5 object-cover rounded-sm"
                  />{" "}
                  <div>
                                 <p className="text-[10px] text-white">{r.cuisine1}</p>
                    <p className="text-[7px] bg-green-300/40 rounded-full text-gray-800/70 p-0.5 text-center">
                      Available
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 ">
                  <img
                    src={r.image}
                    alt={r.name}
                    className="w-5 h-5 object-cover rounded-sm"
                  />{" "}
                  <div>
                    <p className="text-[10px] text-white">{r.cuisine2}</p>
                    <p className="text-[7px] bg-green-300/40 rounded-full text-gray-800/70 p-0.5 text-center">
                      Available
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 ">
                  <img
                    src={r.image}
                    alt={r.name}
                    className="h-5 w-5 object-cover rounded-sm"
                  />{" "}
                  <div>
                    <p className="text-[10px] text-white">{r.cuisine3}</p>
                    <p className="text-[7px] bg-green-300/40 rounded-full text-gray-800/70 p-0.5 text-center">
                      Available
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <ChevronRight size={27} className="text-white pr-2"/>
          </GlassBG>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RestaurantCard;

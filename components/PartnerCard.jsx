"use client";

import React from "react";

const PartnerCard = () => {
  return (
    <div className="relative w-full  overflow-hidden shadow-lg   ">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80')",
        }}
      >
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 py-14 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-2">Partner With Us</h2>
        <p className="text-sm text-gray-200 max-w-md mb-6">
          Join our growing network! of agents, we’d love to collaborate.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full mb-14">
          <button className="inline-flex mx-auto bg-blue-500 hover:bg-blue-500/90 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-md">
            Become an Agent
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default PartnerCard;



// https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg
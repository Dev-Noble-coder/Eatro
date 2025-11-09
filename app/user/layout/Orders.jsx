import React from "react";
import GlassBG from "./GlassBG";
import { PackageSearch } from "lucide-react";

const Orders = () => {
  return (
    <div className="p-5">
      <h2 className="text-2xl font-medium mb-5 text-gray-800">Orders</h2>

      <GlassBG>
        <div className="flex flex-col items-center justify-center text-center py-10">
          {/* 🔹 Lucide Icon Logo */}
          <PackageSearch size={48} className="text-[#A31621] mb-3" />

          {/* 🔹 Text */}
          <p className="text-lg font-semibold text-gray-800 mb-1">
            Track your orders
          </p>
          <p className="text-sm text-gray-600">
            Your ongoing orders will be listed here.
          </p>
        </div>
      </GlassBG>
    </div>
  );
};

export default Orders;

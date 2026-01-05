"use client"; // This is now the only client component

import { useState, useEffect } from "react";
import LoadingAnimation from "./LoadingAnimation";

export default function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full fixed inset-0 bg-white z-50">
        <LoadingAnimation />
      </div>
    );
  }

  return <>{children}</>;
}
"use client"

import { useState, useEffect } from "react";
import LoadingAnimation from "@/components/LoadingAnimation";
import Logo from "@/components/Logo";
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  BookOpen,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import Login from "./auth/login/page";
import SignUp from "./auth/signup/page";


export default function Home() {
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      window.location.href = '/auth/signup'    
    }, 3000) 

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <LoadingAnimation />
  }
  return (
    <>
      
    </>
  );
}

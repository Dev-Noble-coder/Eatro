"use client"

import { useState, useEffect } from "react";
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


const SignUp = () => {

    const [loading, setLoading] = useState(true)
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const isFormValid =
        (formData.name || "").trim() &&
        (formData.email || "").trim() &&
        (formData.password || "").trim() &&
        (formData.password === formData.confirm_password);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {

    }
    return (
        <div
            className="relative h-screen"
            style={{
                background: "url('https://img.freepik.com/premium-photo/there-are-three-cups-ice-cream-three-pastries-table_1034466-95705.jpg')",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className='inset-0 bg-black/30 absolute  z-10'>
            </div>
            <div className="h-screen overflow-y-scroll hide-scrollbar px-5 relative z-20 text-white flex flex-col justify-center">
            <Logo />
            <div>
                <h2 className="text-2xl pb-2">
                  Welcome<span className="text-[#A31621]"> Champ !</span>{" "}
                </h2>
                <p className="text-sm pb-8">
                  Fill in the form below to create an account.
                </p>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              {/* fullName */}
              <div className="col-span-1 relative">
                <label className="block mb-2 text-sm">Name</label>
                <User className="absolute left-3 top-10 w-3 h-3 text-[#A31621]" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="e.g Ade Chikwu Tade"
                  onChange={handleChange}
                  className="w-full text-sm p-2 pl-9 rounded bg-white/20 text-white outline-none focus:border"
                  required
                />
              </div>

              {/* Email */}
              <div className="col-span-1 relative">
                <label className="block mb-2 text-sm">Email</label>
                <Mail className="absolute left-3 top-10 w-3 h-3 text-[#A31621]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="e.g adechikwutade@gmail.com"
                  onChange={handleChange}
                  className="w-full text-sm p-2 pl-9 rounded bg-white/20 text-white outline-none focus:border"
                  required
                />
              </div>

              {/* Password */}
              <div className="col-span-1 relative">
                <label className="block mb-2 text-sm">Password</label>
                <Lock className="absolute left-3 top-10 w-3 h-3 text-[#A31621]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full text-sm p-2 pl-9 pr-9 rounded bg-white/20 text-white outline-none focus:border"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-10"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="w-3 h-3 text-[#A31621]" />
                  ) : (
                    <Eye className="w-3 h-3 text-[#A31621]" />
                  )}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="col-span-1 relative">
                <label className="block mb-2 text-sm">Confirm Password</label>
                <BookOpen className="absolute left-3 top-10 w-3 h-3 text-[#A31621]" />
                <input
                  type="text"
                  name="confirm_password"
                  value={formData.confirm_password}
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full text-sm p-2 pl-9 rounded bg-white/20 text-white outline-none focus:border"
                  required
                />
                  <button
                  type="button"
                  className="absolute right-3 top-10"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="w-3 h-3 text-[#A31621]" />
                  ) : (
                    <Eye className="w-3 h-3 text-[#A31621]" />
                  )}
                </button>
              </div>

              <div className="col-span-2 flex items-center justify-between text-sm">
                {/* Remember Me */}
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    //   checked={formData.rememberMe}
                    //   onChange={(e) =>
                    //     setFormData({ ...formData, rememberMe: e.target.checked })
                    //   }
                    className="w-4 h-4 cursor-pointer"
                  />
                  Remember Me
                </label>

                {/* Forgot Password */}
                <Link href="/forgot-password">
                  <button
                    type="button"
                    className="text-white underline cursor-pointer"
                  >
                    Forgot Password ?
                  </button>
                </Link>
              </div>

              {/* Submit button */}
              <div className="col-span-2">
                <button
                  disabled={!isFormValid || isSubmitted}
                  type="submit"
                  className={`w-full py-3 rounded-full transition text-sm 
                                    ${
                                      isFormValid && !isSubmitted
                                        ? "bg-[#A31621] cursor-pointer"
                                        : "bg-gray-400 cursor-not-allowed "
                                    }`}
                >
                  {isSubmitted ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
                <p className="text-sm text-center pt-3 text-gray-200">
                  Already have an account ?{" "}
                  <Link href= '/auth/login'>
                  <span
                    className="text-white cursor-pointer underline"

                  >
                    Login
                  </span>
                  </Link>
                </p>
              </div>
            </form>
              </div>
              </div>

        </div>
    )
}

export default SignUp
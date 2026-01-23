"use client"
import React, { useEffect, useState } from 'react'
import AppLayout from "./layout/AppLayout";
import AcctBalance from "./layout/AcctBalance";
import TopOrders from "./layout/TopOrders";

export default function AgentPage() {
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [loginData, setLoginData] = useState({ email: "", password: "" })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/agent/me", { credentials: "include" })
        if (res.ok) {
          setShowLogin(false)
        } else {
          setShowLogin(true)
        }
      } catch {
        setShowLogin(true)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitted) return
    setIsSubmitted(true)
    setError("")
    try {
      const res = await fetch("/api/agent/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginData),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data?.error || "Login failed")
        setIsSubmitted(false)
        return
      }
      setShowLogin(false)
    } catch {
      setError("Network error")
      setIsSubmitted(false)
    }
  }

  const isValid = loginData.email.trim() && loginData.password.trim()

  if (loading) return null

  return (
    <>
      <AppLayout>
        <AcctBalance />
        <TopOrders />
      </AppLayout>
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="w-full max-w-sm bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Agent Sign In
            </h2>
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-3 text-black">
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border rounded p-2 placeholder:text-gray-200"
                required
              />
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full border rounded p-2 placeholder:text-gray-200"
                required
              />
              <button
                type="submit"
                disabled={!isValid || isSubmitted}
                className={`w-full py-2 rounded-full ${isValid && !isSubmitted ? "bg-blue-700 text-white" : "bg-gray-400 text-white"}`}
              >
                {isSubmitted ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

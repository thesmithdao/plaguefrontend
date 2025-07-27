"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted")
    setIsVisible(false)
  }

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 sm:left-auto sm:right-4 sm:transform-none z-50 max-w-xs sm:max-w-sm mx-3 sm:mx-0">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 sm:p-4 shadow-lg">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <h3 className="text-sm sm:text-base font-semibold text-white">Cookie Notice</h3>
          <button onClick={declineCookies} className="text-gray-400 hover:text-white transition-colors ml-2">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">
          We use cookies to enhance your experience and analyze site usage. By continuing, you agree to our cookie
          policy.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={acceptCookies}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 sm:py-2 sm:px-3 rounded text-xs sm:text-sm transition-colors"
          >
            Accept
          </button>
          <button
            onClick={declineCookies}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-1 px-2 sm:py-2 sm:px-3 rounded text-xs sm:text-sm transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}

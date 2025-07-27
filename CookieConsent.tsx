"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted")
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "declined")
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="max-w-xs sm:max-w-sm mx-2 sm:mx-0 z-50 fixed bottom-4 left-1/2 transform -translate-x-1/2 sm:right-4 sm:left-auto sm:transform-none w-full">
      <div className="bg-gray-900/95 backdrop-blur-sm border-gray-700 rounded-xl shadow-2xl p-2 sm:p-4 text-white border-0">
        <div className="flex items-center justify-between mb-2">
          <button onClick={handleDecline} className="text-gray-400 hover:text-white transition-colors">
            
          </button>
        </div>
        <p className="text-xs sm:text-sm text-gray-300 mb-3 leading-relaxed">
          We use cookies to enhance your experience. By continuing, you agree to our{" "}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-privacy-modal"))}
            className="text-green-400 hover:underline focus:outline-none"
          >
            privacy policy.
          </button>
        </p>
        <div className="flex flex-row justify-center gap-2 sm:flex-row sm:gap-3">
          <Button
            onClick={handleAccept}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 sm:py-2 rounded-lg border-green-500 hover:border-green-400 transition-all text-xs border sm:text-xs sm:px-4 mx-2.5"
          >
            Accept
          </Button>
          <Button
            onClick={handleDecline}
            variant="outline"
            className="bg-gray-800/80 hover:bg-gray-700/80 text-green-400 font-bold py-1 px-2 rounded-lg border-green-500 hover:border-green-400 transition-all backdrop-blur-sm border text-xs sm:px-4 sm:py-2 mx-2.5"
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  )
}

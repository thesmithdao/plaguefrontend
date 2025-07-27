"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent")
    if (consent === null) {
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

  const openPrivacyModal = () => {
    const event = new Event("open-privacy-modal")
    window.dispatchEvent(event)
  }

  const openTermsModal = () => {
    const event = new Event("open-terms-modal")
    window.dispatchEvent(event)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 sm:right-4 sm:left-auto sm:transform-none z-50 w-full max-w-xs sm:max-w-sm mx-2 sm:mx-0">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-2 sm:p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm sm:text-base">Cookie Notice</h3>
          <button onClick={handleDecline} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-gray-300 text-xs sm:text-sm mb-4 leading-relaxed">
          We use cookies to enhance your experience and analyze site usage. By continuing, you agree to our{" "}
          <button onClick={openPrivacyModal} className="text-green-400 hover:underline focus:outline-none">
            privacy policy
          </button>{" "}
          and{" "}
          <button onClick={openTermsModal} className="text-green-400 hover:underline focus:outline-none">
            terms of service
          </button>
          .
        </p>
        <div className="flex flex-row gap-2 sm:gap-3">
          <button
            onClick={handleAccept}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 sm:py-2 sm:px-3 rounded-lg transition-colors text-xs sm:text-sm flex-1"
          >
            Accept
          </button>
          <button
            onClick={handleDecline}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-1 px-2 sm:py-2 sm:px-3 rounded-lg transition-colors text-xs sm:text-sm flex-1"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}

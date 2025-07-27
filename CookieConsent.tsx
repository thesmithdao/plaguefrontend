"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import PrivacyModal from "./PrivacyModal"
import TermsModal from "./TermsModal"

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

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
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 sm:left-auto sm:right-4 sm:transform-none z-50 max-w-sm mx-3 sm:mx-0">
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            
            <button onClick={declineCookies} className="text-gray-400 hover:text-white transition-colors ml-2">
              
            </button>
    
          <p className="text-sm text-gray-300 mb-4 leading-relaxed">
            We use cookies to enhance your experience. By continuing, you agree to our {" "}
            <button
              onClick={() => setShowPrivacy(true)}
              className="text-green-400 hover:text-green-300 underline transition-colors"
            >
              Privacy Policy
            </button>
      </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={acceptCookies}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
            >
              Accept
            </button>
            <button
              onClick={declineCookies}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
            >
              Decline
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </>
  )
}

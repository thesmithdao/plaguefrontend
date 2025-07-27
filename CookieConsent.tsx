"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import PrivacyModal from "./PrivacyModal"

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setShowConsent(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setShowConsent(false)
  }

  const handleDeny = () => {
    localStorage.setItem("cookie-consent", "denied")
    setShowConsent(false)
  }

  if (!showConsent) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 sm:bottom-4 sm:right-4 sm:left-auto sm:transform-none bg-gray-900 border border-gray-700 rounded-xl p-4 z-50 max-w-sm w-full mx-4 sm:mx-0 shadow-2xl">
      <div className="flex flex-col gap-4">
        <div className="flex-1 text-sm text-gray-300">
          <p>
            We use cookies to enhance your experience and analyze site usage.{" "}
            <button onClick={() => setShowPrivacy(true)} className="text-green-400 hover:text-green-300 underline">
              Privacy Policy
            </button>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <Button
            onClick={handleDeny}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
          >
            Deny
          </Button>
          <Button onClick={handleAccept} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
            I Accept
          </Button>
        </div>
      </div>
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </div>
  )
}

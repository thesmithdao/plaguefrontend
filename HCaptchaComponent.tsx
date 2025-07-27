"use client"

import { useRef, useEffect, useCallback, useState } from "react"

interface HCaptchaProps {
  onVerify: (token: string | null) => void
  sitekey: string
  resetTrigger?: number
}

declare global {
  interface Window {
    hcaptcha: any
  }
}

export default function HCaptchaComponent({ onVerify, sitekey, resetTrigger }: HCaptchaProps) {
  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const mountedRef = useRef(true)

  const checkHCaptchaReady = useCallback(() => {
    return !!(window.hcaptcha && typeof window.hcaptcha.render === "function")
  }, [])

  const cleanupWidget = useCallback(() => {
    if (widgetIdRef.current && window.hcaptcha) {
      try {
        window.hcaptcha.remove(widgetIdRef.current)
      } catch (e) {
        // Silent cleanup
      }
    }
    widgetIdRef.current = null
    if (captchaRef.current) {
      captchaRef.current.innerHTML = ""
    }
  }, [])

  const renderCaptcha = useCallback(() => {
    if (!mountedRef.current || !captchaRef.current || !sitekey) return

    if (!checkHCaptchaReady()) {
      setError("Captcha not available")
      return
    }

    cleanupWidget()
    setError(null)

    try {
      widgetIdRef.current = window.hcaptcha.render(captchaRef.current, {
        sitekey: sitekey,
        callback: (token: string) => {
          if (mountedRef.current) {
            onVerify(token)
          }
        },
        "expired-callback": () => {
          if (mountedRef.current) {
            onVerify(null)
          }
        },
        "error-callback": () => {
          if (mountedRef.current) {
            setError("Captcha error occurred")
            onVerify(null)
          }
        },
      })
      setIsLoading(false)
    } catch (e) {
      setError("Failed to load captcha")
      setIsLoading(false)
    }
  }, [sitekey, onVerify, checkHCaptchaReady, cleanupWidget])

  const resetCaptcha = useCallback(() => {
    if (widgetIdRef.current && window.hcaptcha) {
      try {
        window.hcaptcha.reset(widgetIdRef.current)
      } catch (e) {
        renderCaptcha()
      }
    } else {
      renderCaptcha()
    }
  }, [renderCaptcha])

  useEffect(() => {
    let attempts = 0
    const maxAttempts = 20

    const checkReady = () => {
      if (!mountedRef.current) return

      if (checkHCaptchaReady()) {
        setIsReady(true)
        setIsLoading(false)
        return
      }

      attempts++
      if (attempts < maxAttempts) {
        setTimeout(checkReady, 500)
      } else {
        setError("Failed to load captcha")
        setIsLoading(false)
      }
    }

    checkReady()
  }, [checkHCaptchaReady])

  useEffect(() => {
    if (isReady && !error) {
      renderCaptcha()
    }
  }, [isReady, error, renderCaptcha])

  useEffect(() => {
    if (resetTrigger !== undefined && isReady) {
      setTimeout(resetCaptcha, 100)
    }
  }, [resetTrigger, isReady, resetCaptcha])

  useEffect(() => {
    return () => {
      mountedRef.current = false
      cleanupWidget()
    }
  }, [cleanupWidget])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[78px]">
        <div className="flex items-center space-x-2 text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
          <span className="text-xs pixel-font">Loading captcha...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[78px]">
        <div className="text-center">
          <p className="text-red-400 text-xs mb-2 pixel-font">⚠️ {error}</p>
          <button
            onClick={() => {
              setError(null)
              setIsLoading(true)
              renderCaptcha()
            }}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors pixel-font"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center" style={{ transform: "scale(0.8)", transformOrigin: "center" }}>
      <div ref={captchaRef} className="h-captcha" />
    </div>
  )
}

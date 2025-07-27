"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { supabase, isSupabaseConfigured } from "../lib/supabase"
import { getCaptchaSiteKey } from "../lib/captcha-actions"
import HCaptchaComponent from "./HCaptchaComponent"

interface ScoreSubmissionProps {
  score: number
  gameTime: number
  onSubmitted: () => void
}

export default function ScoreSubmission({ score, gameTime, onSubmitted }: ScoreSubmissionProps) {
  const { connected, publicKey, connecting } = useWallet()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)
  const [isUpdate, setIsUpdate] = useState(false)
  const [captchaKey, setCaptchaKey] = useState(0)
  const [hcaptchaSiteKey, setHcaptchaSiteKey] = useState<string | null>(null)
  const [configLoading, setConfigLoading] = useState(true)
  const submissionAttemptRef = useRef(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    setMounted(true)
    const fetchCaptchaConfig = async () => {
      try {
        const result = await getCaptchaSiteKey()
        if (mountedRef.current) {
          if (result.success && result.siteKey) {
            setHcaptchaSiteKey(result.siteKey)
          }
        }
      } catch (err) {
        // Silent error handling
      } finally {
        if (mountedRef.current) {
          setConfigLoading(false)
        }
      }
    }
    fetchCaptchaConfig()
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          setCooldownTime((prev) => prev - 1)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldownTime])

  const validateScore = useCallback(() => {
    if (score < 0) return "Invalid score"
    if (gameTime < 1) return "Game too short"
    if (score % 10 !== 0) return "Invalid score format"
    if (score > gameTime * 100) return "Score validation failed"
    return null
  }, [score, gameTime])

  const checkExistingScore = useCallback(async () => {
    if (!publicKey || !supabase) return null
    try {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("score, created_at, updated_at, last_submission, submission_count")
        .eq("wallet_address", publicKey.toString())
        .limit(1)
      if (error) return null
      if (!data || !data.length) return null
      const row = data[0]
      return {
        score: row.score,
        last_submission: row.last_submission || row.updated_at || row.created_at,
        submission_count: row.submission_count || 1,
      }
    } catch (err) {
      return null
    }
  }, [publicKey])

  const submitScore = useCallback(
    async (token: string) => {
      if (!mountedRef.current) return
      if (!connected || !publicKey || !supabase) {
        return
      }
      const validationError = validateScore()
      if (validationError) {
        setError(validationError)
        return
      }
      const currentAttempt = ++submissionAttemptRef.current
      setSubmitting(true)
      setError(null)
      try {
        const verifyRes = await fetch("/api/verify-captcha", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })
        if (!mountedRef.current || currentAttempt !== submissionAttemptRef.current) return
        const verifyData = await verifyRes.json()
        if (!verifyRes.ok || !verifyData.success) {
          setCaptchaKey((prev) => prev + 1)
          return
        }
        const existing = await checkExistingScore()
        if (existing) {
          const diff = (Date.now() - new Date(existing.last_submission).getTime()) / 1000
          if (diff < 30) {
            setCooldownTime(Math.ceil(30 - diff))
            setError("Please wait before submitting again")
            return
          }
          if (score <= existing.score) {
            setError(`Your best score is ${existing.score}. New score must be higher.`)
            return
          }
          setIsUpdate(true)
          const { error: upErr } = await supabase
            .from("leaderboard")
            .update({
              score,
              game_time: gameTime,
              submission_count: existing.submission_count + 1,
              updated_at: new Date().toISOString(),
              last_submission: new Date().toISOString(),
            })
            .eq("wallet_address", publicKey.toString())
          if (upErr) throw upErr
        } else {
          const { error: inErr } = await supabase.from("leaderboard").insert({
            wallet_address: publicKey.toString(),
            score,
            game_time: gameTime,
            submission_count: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_submission: new Date().toISOString(),
          })
          if (inErr) throw inErr
        }
        if (mountedRef.current) {
          setSubmitted(true)
          onSubmitted()
        }
      } catch (err: any) {
        // Silent error handling
      } finally {
        if (mountedRef.current && currentAttempt === submissionAttemptRef.current) {
          setSubmitting(false)
        }
      }
    },
    [connected, publicKey, score, gameTime, onSubmitted, validateScore, checkExistingScore],
  )

  const handleCaptchaVerify = useCallback(
    (token: string | null) => {
      if (!mountedRef.current) return
      if (!token) {
        return
      }
      submitScore(token)
    },
    [submitScore],
  )

  if (!mounted || configLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500" />
      </div>
    )
  }

  // Show simple message for users without wallet connection
  if (!connected) {
    return (
      <div className="text-center py-3">
        <p className="text-gray-400 text-xs pixel-font">Connect wallet to submit score</p>
      </div>
    )
  }

  if (!isSupabaseConfigured() || !hcaptchaSiteKey) {
    return (
      <div className="text-center py-3">
        <p className="text-gray-400 text-xs pixel-font">Score submission unavailable</p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="text-center bg-green-900/30 border border-green-600 p-2 rounded-lg">
        <div className="flex flex-col items-center space-y-2">
          <img src="/images/thumbs-up-gorilla.png" alt="Success!" className="w-8 h-8 object-contain" />
          <p className="text-green-400 text-[10px] pixel-font">
            ✅ Score {isUpdate ? "updated" : "submitted"} successfully!
          </p>
        </div>
      </div>
    )
  }

  if (cooldownTime > 0) {
    return (
      <div className="text-center py-3">
        <p className="text-gray-400 text-xs pixel-font">Cooldown: {cooldownTime}s remaining</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {!submitting ? (
        <div className="bg-gray-800/80 p-2 rounded-lg border border-gray-600">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-gray-300 pixel-font">Complete captcha to submit</p>
            <button
              onClick={() => {
                setError(null)
                setCaptchaKey((prev) => prev + 1)
              }}
              className="text-[10px] bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-gray-200 px-1.5 py-0.5 rounded transition-colors pixel-font"
              title="Refresh captcha"
            >
              🔄
            </button>
          </div>
          <HCaptchaComponent key={`captcha-${captchaKey}`} onVerify={handleCaptchaVerify} sitekey={hcaptchaSiteKey} />
        </div>
      ) : (
        <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-600">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-500" />
            <p className="text-gray-300 text-[10px] pixel-font">Submitting score...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="bg-red-900/80 border border-red-600 rounded-lg px-2 py-1.5">
          <p className="text-red-200 text-[10px] pixel-font text-center">⚠️ {error}</p>
        </div>
      )}
    </div>
  )
}

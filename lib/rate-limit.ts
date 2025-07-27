import { supabaseAdmin } from "./supabase"

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: Date
}

export async function checkRateLimit(
  identifier: string,
  limit = 5,
  windowMs: number = 15 * 60 * 1000, // 15 minutes
): Promise<RateLimitResult> {
  const windowStart = new Date(Date.now() - windowMs)

  try {
    // Count submissions from this identifier in the time window
    const { data: submissions, error } = await supabaseAdmin
      .from("contact_submissions")
      .select("id")
      .eq("ip_address", identifier)
      .gte("created_at", windowStart.toISOString())

    if (error) {
      console.error("Rate limit check error:", error)
      // Allow request if we can't check (fail open)
      return {
        success: true,
        limit,
        remaining: limit - 1,
        resetTime: new Date(Date.now() + windowMs),
      }
    }

    const count = submissions?.length || 0
    const remaining = Math.max(0, limit - count - 1)
    const resetTime = new Date(Date.now() + windowMs)

    return {
      success: count < limit,
      limit,
      remaining,
      resetTime,
    }
  } catch (error) {
    console.error("Rate limit error:", error)
    // Allow request if we can't check (fail open)
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetTime: new Date(Date.now() + windowMs),
    }
  }
}

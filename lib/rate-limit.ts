import { supabaseAdmin } from "./supabase"

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: Date
}

export async function checkRateLimit(
  identifier: string,
  limit = 15, // Increased limit for smoother testing
  windowMs: number = 60 * 1000, // 1 minute window for testing
): Promise<RateLimitResult> {
  const windowStart = new Date(Date.now() - windowMs)

  try {
    // Very soft rate limiting - only block obvious spam
    const actualLimit = limit

    // Count submissions from this identifier in the time window
    const { data: submissions, error } = await supabaseAdmin
      .from("contact_submissions")
      .select("id")
      .eq("ip_address", identifier)
      .gte("created_at", windowStart.toISOString())

    if (error) {
      console.error("Rate limit check error:", error)
      // Always allow request if we can't check (fail open)
      return {
        success: true,
        limit: actualLimit,
        remaining: actualLimit - 1,
        resetTime: new Date(Date.now() + windowMs),
      }
    }

    const count = submissions?.length || 0
    const remaining = Math.max(0, actualLimit - count - 1)
    const resetTime = new Date(Date.now() + windowMs)

    return {
      success: count < actualLimit,
      limit: actualLimit,
      remaining,
      resetTime,
    }
  } catch (error) {
    console.error("Rate limit error:", error)
    // Always allow request if there's an error (fail open)
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetTime: new Date(Date.now() + windowMs),
    }
  }
}

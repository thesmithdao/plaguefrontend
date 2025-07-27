import { supabaseAdmin } from "./supabase"

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: Date
}

export async function checkRateLimit(
  identifier: string,
  limit = 10,
  windowMs: number = 60 * 60 * 1000, // 1 hour window
): Promise<RateLimitResult> {
  try {
    const now = new Date()
    const windowStart = new Date(now.getTime() - windowMs)

    // Clean up old entries first
    await supabaseAdmin.from("rate_limits").delete().lt("created_at", windowStart.toISOString())

    // Count current requests in the window
    const { data: existingRequests, error: countError } = await supabaseAdmin
      .from("rate_limits")
      .select("*")
      .eq("identifier", identifier)
      .gte("created_at", windowStart.toISOString())

    if (countError) {
      console.error("Rate limit count error:", countError)
      // Fail open - allow the request if we can't check rate limits
      return {
        success: true,
        limit,
        remaining: limit - 1,
        resetTime: new Date(now.getTime() + windowMs),
      }
    }

    const currentCount = existingRequests?.length || 0

    if (currentCount >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        resetTime: new Date(now.getTime() + windowMs),
      }
    }

    // Add new request to rate limit table
    const { error: insertError } = await supabaseAdmin.from("rate_limits").insert({
      identifier,
      created_at: now.toISOString(),
    })

    if (insertError) {
      console.error("Rate limit insert error:", insertError)
      // Fail open - allow the request if we can't record it
    }

    return {
      success: true,
      limit,
      remaining: limit - currentCount - 1,
      resetTime: new Date(now.getTime() + windowMs),
    }
  } catch (error) {
    console.error("Rate limit check error:", error)
    // Fail open - allow the request if rate limiting fails
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetTime: new Date(Date.now() + windowMs),
    }
  }
}

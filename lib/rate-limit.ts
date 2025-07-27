import { supabaseAdmin } from "./supabase"

const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes in milliseconds
const MAX_ATTEMPTS = 5 // Maximum attempts per window
const MAX_ATTEMPTS_UNKNOWN = 2 // Lower limit for unknown IPs

function isValidIP(ip: string): boolean {
  // Basic IP validation (IPv4 and IPv6)
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

function getClientIP(request: Request): string {
  // Try various headers to get the real client IP
  const headers = request.headers

  // Check common proxy headers
  const forwardedFor = headers.get("x-forwarded-for")
  const realIP = headers.get("x-real-ip")
  const vercelForwardedFor = headers.get("x-vercel-forwarded-for")
  const cfConnectingIP = headers.get("cf-connecting-ip")

  let ip = forwardedFor?.split(",")[0]?.trim() || realIP || vercelForwardedFor || cfConnectingIP || "unknown"

  // Validate the IP and return 'unknown' if invalid
  if (!isValidIP(ip)) {
    ip = "unknown"
  }

  return ip
}

export async function checkRateLimit(request: Request): Promise<{ rateLimited: boolean; remaining: number }> {
  try {
    const ip = getClientIP(request)
    const endpoint = "/api/contact"
    const now = new Date()
    const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW)

    // Determine max attempts based on IP
    const maxAttempts = ip === "unknown" ? MAX_ATTEMPTS_UNKNOWN : MAX_ATTEMPTS

    // Clean up old rate limit records
    await supabaseAdmin.from("rate_limit_attempts").delete().lt("window_start", windowStart.toISOString())

    // Get current attempts for this IP and endpoint
    const { data: existingAttempts, error: fetchError } = await supabaseAdmin
      .from("rate_limit_attempts")
      .select("*")
      .eq("ip_address", ip)
      .eq("endpoint", endpoint)
      .gte("window_start", windowStart.toISOString())
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("Rate limit fetch error:", fetchError)
      // If we can't check rate limits, allow the request but log the error
      return { rateLimited: false, remaining: maxAttempts }
    }

    if (existingAttempts) {
      // Check if rate limited
      if (existingAttempts.attempts >= maxAttempts) {
        return { rateLimited: true, remaining: 0 }
      }

      // Increment attempts
      const { error: updateError } = await supabaseAdmin
        .from("rate_limit_attempts")
        .update({
          attempts: existingAttempts.attempts + 1,
          created_at: now.toISOString(),
        })
        .eq("id", existingAttempts.id)

      if (updateError) {
        console.error("Rate limit update error:", updateError)
      }

      return {
        rateLimited: false,
        remaining: maxAttempts - (existingAttempts.attempts + 1),
      }
    } else {
      // First attempt in this window
      const { error: insertError } = await supabaseAdmin.from("rate_limit_attempts").insert({
        ip_address: ip,
        endpoint: endpoint,
        attempts: 1,
        window_start: now.toISOString(),
        created_at: now.toISOString(),
      })

      if (insertError) {
        console.error("Rate limit insert error:", insertError)
      }

      return { rateLimited: false, remaining: maxAttempts - 1 }
    }
  } catch (error) {
    console.error("Rate limit check error:", error)
    // If rate limiting fails, allow the request
    return { rateLimited: false, remaining: MAX_ATTEMPTS }
  }
}

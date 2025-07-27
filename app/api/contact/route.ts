import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { checkRateLimit } from "@/lib/rate-limit"
import { sendContactNotification, sendConfirmationEmail } from "@/lib/email"
import { z } from "zod"

// Validation schema
const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  subject: z.string().min(1, "Subject is required").max(200, "Subject too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message too long"),
})

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const remoteAddr = request.headers.get("x-vercel-forwarded-for")

  if (forwarded) {
    const ip = forwarded.split(",")[0].trim()
    // Validate IP format
    if (isValidIP(ip)) return ip
  }

  if (realIP && isValidIP(realIP)) {
    return realIP
  }

  if (remoteAddr && isValidIP(remoteAddr)) {
    return remoteAddr
  }

  return "unknown"
}

function isValidIP(ip: string): boolean {
  // Simple IP validation (IPv4 and IPv6)
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/

  if (ipv4Regex.test(ip)) {
    // Check if each octet is valid (0-255)
    const octets = ip.split(".")
    return octets.every((octet) => {
      const num = Number.parseInt(octet, 10)
      return num >= 0 && num <= 255
    })
  }

  return ipv6Regex.test(ip)
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Check rate limit
    const rateLimitResult = await checkRateLimit(clientIP, 5, 15 * 60 * 1000) // 5 requests per 15 minutes

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: rateLimitResult.resetTime.toISOString(),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.resetTime.getTime().toString(),
          },
        },
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = contactSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      )
    }

    const { name, email, subject, message } = validationResult.data

    // Store in database
    const { data: submission, error: dbError } = await supabaseAdmin
      .from("contact_submissions")
      .insert({
        name,
        email,
        subject,
        message,
        ip_address: clientIP,
        user_agent: userAgent,
        status: "new",
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save submission. Please try again." }, { status: 500 })
    }

    // Send notification email to Plague Labs
    const notificationResult = await sendContactNotification({
      name,
      email,
      subject,
      message,
    })

    // Send confirmation email to user (don't fail if this fails)
    const confirmationResult = await sendConfirmationEmail({
      name,
      email,
      subject,
      message,
    })

    // Update submission status based on email results
    let status = "submitted"
    if (notificationResult.success && confirmationResult.success) {
      status = "emails_sent"
    } else if (notificationResult.success) {
      status = "notification_sent"
    }

    await supabaseAdmin.from("contact_submissions").update({ status }).eq("id", submission.id)

    // Return success even if confirmation email fails
    return NextResponse.json(
      {
        message: "Message sent successfully! We'll get back to you within 24 hours.",
        id: submission.id,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.resetTime.getTime().toString(),
        },
      },
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error. Please try again later." }, { status: 500 })
  }
}

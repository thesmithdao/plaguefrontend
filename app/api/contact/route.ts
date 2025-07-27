import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase"
import { checkRateLimit } from "@/lib/rate-limit"
import { sendNotificationEmail, sendConfirmationEmail } from "@/lib/email"

// Validation schema
const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  subject: z.string().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
})

function getClientIP(request: NextRequest): string {
  // Try various headers to get the real client IP
  const forwardedFor = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for")
  const cfConnectingIP = request.headers.get("cf-connecting-ip")

  let ip = forwardedFor?.split(",")[0]?.trim() || realIP || vercelForwardedFor || cfConnectingIP || "unknown"

  // Basic IP validation
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/

  if (!ipv4Regex.test(ip) && !ipv6Regex.test(ip)) {
    ip = "unknown"
  }

  return ip
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limiting
    const { rateLimited, remaining } = await checkRateLimit(request)

    if (rateLimited) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before trying again." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": new Date(Date.now() + 15 * 60 * 1000).toISOString(),
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
          details: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    const { name, email, subject, message } = validationResult.data

    // Get client information
    const ip = getClientIP(request)
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Save to database
    const { data: submission, error: dbError } = await supabaseAdmin
      .from("contact_submissions")
      .insert({
        name,
        email,
        subject,
        message,
        ip_address: ip,
        user_agent: userAgent,
        status: "new",
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save submission" }, { status: 500 })
    }

    // Send notification email to Plague Labs
    const notificationResult = await sendNotificationEmail({
      name,
      email,
      subject,
      message,
    })

    // Send confirmation email to user
    const confirmationResult = await sendConfirmationEmail({
      name,
      email,
      subject,
      message,
    })

    // Log email results (don't fail the request if emails fail)
    if (!notificationResult.success) {
      console.error("Failed to send notification email:", notificationResult.error)
    }

    if (!confirmationResult.success) {
      console.error("Failed to send confirmation email:", confirmationResult.error)
    }

    return NextResponse.json(
      {
        message: "Message sent successfully! We'll get back to you within 24 hours.",
        id: submission.id,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Remaining": remaining.toString(),
        },
      },
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

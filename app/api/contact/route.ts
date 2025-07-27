import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { checkRateLimit } from "@/lib/rate-limit"
import { sendContactNotification, sendConfirmationEmail } from "@/lib/email"
import { z } from "zod"

// Validation schema - keep it simple
const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  subject: z.string().min(1, "Subject is required").max(200, "Subject too long"),
  message: z.string().min(5, "Message must be at least 5 characters").max(2000, "Message too long"),
})

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const vercelForwarded = request.headers.get("x-vercel-forwarded-for")

  if (forwarded) {
    const ip = forwarded.split(",")[0].trim()
    if (isValidIP(ip)) return ip
  }

  if (realIP && isValidIP(realIP)) {
    return realIP
  }

  if (vercelForwarded && isValidIP(vercelForwarded)) {
    return vercelForwarded
  }

  return "unknown"
}

function isValidIP(ip: string): boolean {
  // Simple IP validation
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  return ipv4Regex.test(ip)
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Very soft rate limiting - 10 requests per hour
    const rateLimitResult = await checkRateLimit(clientIP, 10, 60 * 60 * 1000)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again in an hour.",
        },
        { status: 429 },
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = contactSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Please check your form fields",
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

    // Send emails (don't fail the request if emails fail)
    try {
      const notificationResult = await sendContactNotification({
        name,
        email,
        subject,
        message,
      })

      const confirmationResult = await sendConfirmationEmail({
        name,
        email,
        subject,
        message,
      })

      // Update status based on email results
      let status = "submitted"
      if (notificationResult.success && confirmationResult.success) {
        status = "emails_sent"
      } else if (notificationResult.success) {
        status = "notification_sent"
      }

      await supabaseAdmin.from("contact_submissions").update({ status }).eq("id", submission.id)
    } catch (emailError) {
      console.error("Email error:", emailError)
      // Don't fail the request if emails fail
    }

    return NextResponse.json({
      message: "Message sent successfully! We'll get back to you within 24 hours.",
      id: submission.id,
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}

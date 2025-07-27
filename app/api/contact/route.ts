import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Store in database (using a simple in-memory store for now)
    // In production, you'd want to use a proper database like Supabase
    const contactData = {
      id: Date.now().toString(),
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      status: "new",
    }

    // Log the contact submission (in production, save to database)
    console.log("New contact submission:", contactData)

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification to helloplaguelabs@gmail.com
    // 3. Send confirmation email to the user

    // For now, we'll simulate success
    // In production, you'd integrate with an email service like Resend, SendGrid, etc.

    return NextResponse.json({ message: "Message sent successfully!" }, { status: 200 })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

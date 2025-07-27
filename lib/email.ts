import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactData {
  name: string
  email: string
  subject: string
  message: string
}

interface EmailResult {
  success: boolean
  error?: string
}

export async function sendContactNotification(data: ContactData): Promise<EmailResult> {
  try {
    // Skip email sending if domain is not verified
    if (!process.env.RESEND_API_KEY) {
      console.log("Resend API key not configured, skipping email")
      return { success: false, error: "Email service not configured" }
    }

    const { data: result, error } = await resend.emails.send({
      from: "onboarding@resend.dev", // Use Resend's test domain
      to: ["helloplaguelabs@gmail.com"],
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4f46e5; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px;">
            <p style="margin: 0; color: #92400e;">
              <strong>Reply to:</strong> ${data.email}
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Failed to send notification email:", error)
      return { success: false, error: error.message }
    }

    console.log("Notification email sent successfully")
    return { success: true }
  } catch (error) {
    console.error("Email service error:", error)
    return { success: false, error: "Failed to send email" }
  }
}

export async function sendConfirmationEmail(data: ContactData): Promise<EmailResult> {
  try {
    // Skip confirmation email for now to avoid domain issues
    console.log("Skipping confirmation email until domain is verified")
    return { success: false, error: "Confirmation email skipped" }
  } catch (error) {
    console.error("Confirmation email error:", error)
    return { success: false, error: "Failed to send confirmation email" }
  }
}

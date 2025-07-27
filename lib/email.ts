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
    const { data: result, error } = await resend.emails.send({
      from: "Contact Form <noreply@yourdomain.com>", // Replace with your verified domain
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

    return { success: true }
  } catch (error) {
    console.error("Email service error:", error)
    return { success: false, error: "Failed to send email" }
  }
}

export async function sendConfirmationEmail(data: ContactData): Promise<EmailResult> {
  try {
    const { data: result, error } = await resend.emails.send({
      from: "Plague Labs <noreply@yourdomain.com>", // Replace with your verified domain
      to: [data.email],
      subject: "Thank you for contacting Plague Labs",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">
            Thank You for Contacting Us!
          </h2>
          
          <p>Hi ${data.name},</p>
          
          <p>Thank you for reaching out to Plague Labs. We've received your message and will get back to you within 24 hours.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your Message Summary</h3>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background-color: #ffffff; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <p>If you have any urgent questions, feel free to reach out to us directly at helloplaguelabs@gmail.com.</p>
          
          <p>Best regards,<br>The Plague Labs Team</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #6b7280; font-size: 12px;">
            <p>This is an automated confirmation email. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Failed to send confirmation email:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Confirmation email error:", error)
    return { success: false, error: "Failed to send confirmation email" }
  }
}

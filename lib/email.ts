import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactEmailData {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactNotification(data: ContactEmailData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: "Contact Form <noreply@yourdomain.com>", // Replace with your verified domain
      to: ["helloplaguelabs@gmail.com"],
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">New Contact Form Submission</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Contact Details</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>This email was sent from the Plague Labs contact form.</p>
            <p>Reply directly to this email to respond to ${data.name}.</p>
          </div>
        </div>
      `,
      replyTo: data.email,
    })

    if (error) {
      console.error("Email send error:", error)
      return { success: false, error }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error("Email service error:", error)
    return { success: false, error }
  }
}

export async function sendConfirmationEmail(data: ContactEmailData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: "Plague Labs <noreply@yourdomain.com>", // Replace with your verified domain
      to: [data.email],
      subject: "Thank you for contacting Plague Labs",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Thank you for reaching out!</h2>
          
          <p>Hi ${data.name},</p>
          
          <p>We've received your message and will get back to you within 24 hours. Here's a copy of what you sent:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Your Message</h3>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p style="white-space: pre-wrap; line-height: 1.6; margin-top: 15px;">${data.message}</p>
          </div>
          
          <p>In the meantime, feel free to check out our latest work and follow us on social media.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>Best regards,<br>The Plague Labs Team</p>
            <p>This is an automated confirmation email. Please do not reply to this message.</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Confirmation email error:", error)
      return { success: false, error }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error("Confirmation email service error:", error)
    return { success: false, error }
  }
}

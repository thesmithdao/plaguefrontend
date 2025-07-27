import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendNotificationEmail(data: ContactFormData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: "Plague Labs Contact <noreply@plaguefrontend.com>",
      to: ["helloplaguelabs@gmail.com"],
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 8px;">
            <h1 style="color: #22c55e; margin: 0 0 20px 0;">New Contact Form Submission</h1>
            
            <div style="background-color: #2a2a2a; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
              <h3 style="color: #22c55e; margin: 0 0 10px 0;">Contact Details</h3>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${data.name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
              <p style="margin: 5px 0;"><strong>Subject:</strong> ${data.subject}</p>
            </div>
            
            <div style="background-color: #2a2a2a; padding: 15px; border-radius: 6px;">
              <h3 style="color: #22c55e; margin: 0 0 10px 0;">Message</h3>
              <p style="white-space: pre-wrap; line-height: 1.5;">${data.message}</p>
            </div>
            
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #444;">
              <p style="color: #888; font-size: 12px; margin: 0;">
                This email was sent from the Plague Labs contact form.
              </p>
            </div>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Failed to send notification email:", error)
      return { success: false, error }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error("Email service error:", error)
    return { success: false, error }
  }
}

export async function sendConfirmationEmail(data: ContactFormData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: "Plague Labs <noreply@plaguefrontend.com>",
      to: [data.email],
      subject: "Thank you for contacting Plague Labs",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 8px;">
            <h1 style="color: #22c55e; margin: 0 0 20px 0;">Thank You for Reaching Out!</h1>
            
            <p style="line-height: 1.6;">Hi ${data.name},</p>
            
            <p style="line-height: 1.6;">
              Thank you for contacting Plague Labs! We've received your message about "${data.subject}" 
              and our team will get back to you within 24 hours.
            </p>
            
            <div style="background-color: #2a2a2a; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #22c55e; margin: 0 0 10px 0;">Your Message Summary</h3>
              <p style="margin: 5px 0;"><strong>Subject:</strong> ${data.subject}</p>
              <p style="margin: 5px 0;"><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; line-height: 1.5; color: #ccc;">${data.message}</p>
            </div>
            
            <p style="line-height: 1.6;">
              In the meantime, feel free to check out our latest projects and success stories on our website.
            </p>
            
            <p style="line-height: 1.6;">
              Best regards,<br>
              The Plague Labs Team
            </p>
            
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #444;">
              <p style="color: #888; font-size: 12px; margin: 0;">
                This is an automated confirmation email. Please do not reply to this message.
              </p>
            </div>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Failed to send confirmation email:", error)
      return { success: false, error }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error("Confirmation email service error:", error)
    return { success: false, error }
  }
}

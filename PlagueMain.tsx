"use client"

import type React from "react"
import { useState, useEffect } from "react"
import "./PlagueMain.css"

function PlagueMain() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Initial setup or any component-did-mount logic can go here
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      if (response.ok) {
        alert("Message sent successfully!")
        setMessage("") // Clear the textarea after successful submission
      } else {
        alert("Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      alert("An error occurred while sending the message. Please try again later.")
    }
  }

  return (
    <div className="plague-main">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <textarea value={message} onChange={handleChange} placeholder="Enter your message here..." />
        <button type="submit">Send Message</button>
      </form>
    </div>
  )
}

export default PlagueMain

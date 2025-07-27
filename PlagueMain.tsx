"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import WalletConnection from "./WalletConnection"
import Profile from "./Profile"
import AboutModal from "./AboutModal"
import LoreModal from "./LoreModal"
import TeamModal from "./TeamModal"
import TermsModal from "./TermsModal"
import PrivacyModal from "./PrivacyModal"
import SuccessModal from "./SuccessModal"
import BottomModal from "./BottomModal"
import CookieConsent from "./CookieConsent"
import Footer from "./Footer"

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

interface ContactFormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
  general?: string
}

export default function PlagueMain() {
  const [showProfile, setShowProfile] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showLore, setShowLore] = useState(false)
  const [showTeam, setShowTeam] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showBottom, setShowBottom] = useState(false)
  const [showContact, setShowContact] = useState(false)

  // Contact form state
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [contactErrors, setContactErrors] = useState<ContactFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowContact(false)
        setSubmitSuccess(false)
        setContactErrors({})
      }
    }

    if (showContact) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showContact])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowContact(false)
        setSubmitSuccess(false)
        setContactErrors({})
      }
    }

    if (showContact) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [showContact])

  const validateForm = (): boolean => {
    const errors: ContactFormErrors = {}

    if (!contactForm.name.trim()) {
      errors.name = "Name is required"
    }

    if (!contactForm.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!contactForm.subject.trim()) {
      errors.subject = "Subject is required"
    }

    if (!contactForm.message.trim()) {
      errors.message = "Message is required"
    } else if (contactForm.message.trim().length < 5) {
      errors.message = "Message must be at least 5 characters long"
    }

    setContactErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (contactErrors[field]) {
      setContactErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setContactErrors({})

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          setContactErrors({ general: data.error || "Too many requests. Please try again later." })
        } else if (data.details) {
          // Handle validation errors
          const fieldErrors: ContactFormErrors = {}
          data.details.forEach((detail: any) => {
            fieldErrors[detail.field as keyof ContactFormData] = detail.message
          })
          setContactErrors(fieldErrors)
        } else {
          setContactErrors({ general: data.error || "Something went wrong. Please try again." })
        }
        return
      }

      // Success
      setSubmitSuccess(true)
      setContactForm({ name: "", email: "", subject: "", message: "" })
      toast.success("Message sent successfully!")

      // Close modal after 3 seconds
      setTimeout(() => {
        setShowContact(false)
        setSubmitSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Form submission error:", error)
      setContactErrors({ general: "Network error. Please check your connection and try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("helloplaguelabs@gmail.com")
      toast.success("Email copied to clipboard!")
    } catch (error) {
      console.error("Failed to copy email:", error)
      toast.error("Failed to copy email")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-green-900/20" />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-4">
          <img src="/images/plague-logo-new.png" alt="Plague Labs" className="h-12 w-auto" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            Plague Labs
          </h1>
        </div>

        <nav className="hidden md:flex space-x-6">
          <button onClick={() => setShowAbout(true)} className="hover:text-purple-400 transition-colors">
            About
          </button>
          <button onClick={() => setShowLore(true)} className="hover:text-purple-400 transition-colors">
            Lore
          </button>
          <button onClick={() => setShowTeam(true)} className="hover:text-purple-400 transition-colors">
            Team
          </button>
          <button onClick={() => setShowContact(true)} className="hover:text-purple-400 transition-colors">
            Contact
          </button>
        </nav>

        <WalletConnection onProfileClick={() => setShowProfile(true)} />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
            Welcome to the Plague
          </h2>

          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Enter a world where digital art meets blockchain innovation. Collect, trade, and experience the future of
            NFTs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={() => setShowProfile(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              View Collection
            </Button>

            <Button
              onClick={() => setShowContact(true)}
              variant="outline"
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300"
            >
              Get in Touch
            </Button>
          </div>

          {/* Featured Collections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <img
                src="/images/collection-plague-new.png"
                alt="Plague Collection"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2 text-purple-400">Plague Collection</h3>
              <p className="text-gray-400">The original collection that started it all</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
              <img
                src="/images/goo-friends-new.png"
                alt="Goo Friends"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2 text-green-400">Goo Friends</h3>
              <p className="text-gray-400">Adorable companions in the digital realm</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Coming Soon"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2 text-pink-400">Coming Soon</h3>
              <p className="text-gray-400">New collections on the horizon</p>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-gray-900 rounded-lg border border-purple-500/20 p-6 w-full max-w-md relative"
          >
            <button
              onClick={() => {
                setShowContact(false)
                setSubmitSuccess(false)
                setContactErrors({})
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-green-400 mb-2">Message Sent!</h3>
                <p className="text-gray-300">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
                  Get in Touch
                </h3>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-300">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="mt-1 bg-gray-800 border-gray-700 text-white focus:border-purple-500"
                      placeholder="Your name"
                      disabled={isSubmitting}
                    />
                    {contactErrors.name && <p className="text-red-400 text-sm mt-1">{contactErrors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-1 bg-gray-800 border-gray-700 text-white focus:border-purple-500"
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                    />
                    {contactErrors.email && <p className="text-red-400 text-sm mt-1">{contactErrors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-gray-300">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      className="mt-1 bg-gray-800 border-gray-700 text-white focus:border-purple-500"
                      placeholder="What's this about?"
                      disabled={isSubmitting}
                    />
                    {contactErrors.subject && <p className="text-red-400 text-sm mt-1">{contactErrors.subject}</p>}
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-300">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="mt-1 bg-gray-800 border-gray-700 text-white focus:border-purple-500 min-h-[100px]"
                      placeholder="Tell us what's on your mind..."
                      disabled={isSubmitting}
                    />
                    {contactErrors.message && <p className="text-red-400 text-sm mt-1">{contactErrors.message}</p>}
                  </div>

                  {contactErrors.general && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-red-400 text-sm">{contactErrors.general}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>

                <div className="mt-6 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 text-center mb-2">Or reach us directly:</p>
                  <button
                    onClick={copyEmail}
                    className="flex items-center justify-center space-x-2 w-full text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <span>helloplaguelabs@gmail.com</span>
                    <Copy size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer
        onAbout={() => setShowAbout(true)}
        onLore={() => setShowLore(true)}
        onTeam={() => setShowTeam(true)}
        onTerms={() => setShowTerms(true)}
        onPrivacy={() => setShowPrivacy(true)}
        onContact={() => setShowContact(true)}
      />

      {/* Modals */}
      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showLore && <LoreModal onClose={() => setShowLore(false)} />}
      {showTeam && <TeamModal onClose={() => setShowTeam(false)} />}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
      {showBottom && <BottomModal onClose={() => setShowBottom(false)} />}

      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  )
}

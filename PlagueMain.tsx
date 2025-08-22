"use client"

import type React from "react"

import { useState } from "react"
import { TestTube, User, Info, Calendar, Mail } from "lucide-react"
import Modal from "./Modal"
import AboutModal from "./AboutModal"
import Profile from "./Profile"
import TeamModal from "./TeamModal"
import LoreModal from "./LoreModal"
import TermsModal from "./TermsModal"
import PrivacyModal from "./PrivacyModal"
import CookieConsent from "./CookieConsent"
import WalletConnection from "./WalletConnection"
import Footer from "./Footer"

export default function PlagueMain() {
  const [showAbout, setShowAbout] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showTeam, setShowTeam] = useState(false)
  const [showLore, setShowLore] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setContactForm({ name: "", email: "", message: "" })
        setTimeout(() => {
          setShowContact(false)
          setSubmitStatus("idle")
        }, 2000)
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Video */}
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0">
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_vTqQuXuVFNjebUAev08JBC8Hnkeh/Ev5e_gf-UN8fKrVSqM_m23/public/bgvideo.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-3 items-center">
              {/* Logo */}
              <div className="flex justify-start">
                <TestTube className="h-8 w-8 sm:h-10 sm:w-10 text-green-500" />
              </div>

              {/* Navigation */}
              <div className="flex justify-center">
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <button
                    onClick={() => setShowAbout(true)}
                    className="flex items-center space-x-2 text-white hover:text-green-400 transition-colors text-sm sm:text-base"
                  >
                    <Info className="h-4 w-4" />
                    <span>About</span>
                  </button>
                  <button
                    onClick={() => setShowProfile(true)}
                    className="flex items-center space-x-2 text-white hover:text-green-400 transition-colors text-sm sm:text-base"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                </div>
              </div>

              {/* Wallet Connection */}
              <div className="flex justify-end">
                <WalletConnection />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Bring your ideas
              <br />
              to <span className="text-green-400 italic">NFTs</span> & Web 3.
            </h1>
            <button
              onClick={() => setShowContact(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-flex items-center space-x-2 text-lg"
            >
              <Calendar className="h-5 w-5" />
              <span>Get in touch</span>
            </button>
          </div>
        </main>

        {/* Footer */}
        <Footer
          onTeamClick={() => setShowTeam(true)}
          onLoreClick={() => setShowLore(true)}
          onTermsClick={() => setShowTerms(true)}
          onPrivacyClick={() => setShowPrivacy(true)}
        />
      </div>

      {/* Modals */}
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      <Profile isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <TeamModal isOpen={showTeam} onClose={() => setShowTeam(false)} />
      <LoreModal isOpen={showLore} onClose={() => setShowLore(false)} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />

      {/* Contact Modal */}
      <Modal isOpen={showContact} onClose={() => setShowContact(false)} title="Get in Touch">
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowContact(false)}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-bold py-2 px-6 rounded-lg transition-colors inline-flex items-center space-x-2"
            >
              <Mail className="h-4 w-4" />
              <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
            </button>
          </div>
          {submitStatus === "success" && (
            <div className="text-green-400 text-sm text-center">Message sent successfully!</div>
          )}
          {submitStatus === "error" && (
            <div className="text-red-400 text-sm text-center">Failed to send message. Please try again.</div>
          )}
        </form>
      </Modal>

      <CookieConsent />
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import Image from "next/image"
import {
  Info,
  User,
  TrendingUp,
  CalendarPlus,
  Users,
  Rat,
  Syringe,
  TestTubeDiagonal,
  Radiation,
  X,
  ExternalLink,
} from "lucide-react"
import AboutModal from "./AboutModal"
import Profile from "./Profile"
import TermsModal from "./TermsModal"
import Footer from "./Footer"
import TeamModal from "./TeamModal"
import SuccessModal from "./SuccessModal"
import PrivacyModal from "./PrivacyModal"
import CookieConsent from "./CookieConsent"

export default function PlagueMain() {
  const { connected } = useWallet()
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const openModal = (modalName: string) => {
    setActiveModal(modalName)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  // Listen for custom events to open modals from CookieConsent
  useEffect(() => {
    const handleOpenPrivacy = () => openModal("privacy")
    const handleOpenTerms = () => openModal("terms")

    window.addEventListener("open-privacy-modal", handleOpenPrivacy)
    window.addEventListener("open-terms-modal", handleOpenTerms)

    return () => {
      window.removeEventListener("open-privacy-modal", handleOpenPrivacy)
      window.removeEventListener("open-terms-modal", handleOpenTerms)
    }
  }, [])

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }) // Scrolls to the top of the page smoothly
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage({
          type: "success",
          text: data.message || "Message sent successfully! We'll get back to you within 24 hours.",
        })
        // Reset form safely
        if (formRef.current) {
          formRef.current.reset()
        }
      } else {
        if (response.status === 429) {
          setSubmitMessage({ type: "error", text: "Too many requests. Please wait a minute before trying again." })
        } else if (data.details) {
          const errorMessages = data.details.map((detail: any) => detail.message).join(", ")
          setSubmitMessage({ type: "error", text: errorMessages })
        } else {
          setSubmitMessage({ type: "error", text: data.error || "Failed to send message. Please try again." })
        }
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitMessage({ type: "error", text: "Network error. Please check your connection and try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          crossOrigin="anonymous"
          preload="auto"
          className="w-full h-full object-cover sm:object-cover object-center min-w-full min-h-full"
          style={{
            filter: "brightness(0.6) contrast(1.1)",
            objectPosition: "center center",
            transform: "scale(1.02)", // Slight scale to avoid edge artifacts on mobile
          }}
        >
          <source
            src="https://video.wixstatic.com/video/b013bf_89ed88f6b9454842aaf9274b8e305644/720p/mp4/file.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Vignette overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.8) 100%)",
          }}
        />

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 right-0 z-20 p-4 sm:p-6 bg-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 px-4 sm:px-20 cursor-pointer"
            onClick={handleLogoClick}
            role="button"
            tabIndex={0}
            aria-label="Go to home page"
          >
            <Image
              src="/images/test-tube-logo.png"
              alt="PLAGUE"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => openModal("about")}
              className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2 font-medium"
            >
              <Info className="h-4 w-4" />
              About
            </button>
            <button
              onClick={() => openModal("success")}
              className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2 font-medium"
            >
              <TrendingUp className="h-4 w-4" />
              Moonshots
            </button>
            <button
              onClick={() => openModal("team")}
              className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2 font-medium"
            >
              <Users className="h-4 w-4" />
              Doctors
            </button>
            <button
              onClick={() => openModal("profile")}
              className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2 font-medium"
            >
              <User className="h-4 w-4" />
              Profile
            </button>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            <WalletMultiButton
              className="!bg-green-600 hover:!bg-green-700 !text-white !font-bold !text-xs sm:!text-sm !px-1 sm:!px-3 !py-1 sm:!py-2 !rounded-lg !border-2 !border-green-500 hover:!border-green-400 !transition-all !shadow-lg !min-h-[28px] sm:!min-h-[40px] !max-w-[80px] sm:!max-w-none !overflow-hidden !whitespace-nowrap !text-ellipsis"
              startIcon={undefined}
              onClick={(event) => {
                // Let the default behavior handle wallet selection and connection
                // This will auto-connect after wallet selection
              }}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-3">
          <div className="flex items-center justify-between gap-4 px-4">
            <button
              onClick={() => openModal("about")}
              className="text-gray-300 hover:text-green-400 transition-colors flex flex-col items-center gap-1 text-sm font-medium whitespace-nowrap"
            >
              <Info className="h-4 w-4" />
              About
            </button>
            <button
              onClick={() => openModal("success")}
              className="text-gray-300 hover:text-green-400 transition-colors flex flex-col items-center gap-1 text-sm font-medium whitespace-nowrap"
            >
              <TrendingUp className="h-4 w-4" />
              Moonshots
            </button>
            <button
              onClick={() => openModal("team")}
              className="text-gray-300 hover:text-green-400 transition-colors flex flex-col items-center gap-1 text-sm font-medium whitespace-nowrap"
            >
              <Users className="h-4 w-4" />
              Doctors
            </button>
            <button
              onClick={() => openModal("profile")}
              className="text-gray-300 hover:text-green-400 transition-colors flex flex-col items-center gap-1 text-sm font-medium whitespace-nowrap"
            >
              <User className="h-4 w-4" />
              Profile
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 pt-48 sm:pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 sm:mb-12 mr-0">
            <div className="mb-6 sm:mb-8 text-white leading-tight px-0 text-2xl sm:text-5xl md:text-6xl">
              <div className="mb-2 px-0">A web3 marketing agency</div>
              <div className="px-3.5">
                focused on <em className="italic font-normal">memetic</em> languages.
              </div>
            </div>

            <div className="flex flex-row gap-4 justify-center items-center mt-8 sm:mt-12">
              <button
                onClick={() => openModal("success")}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg border-2 border-green-500 hover:border-green-400 transition-all shadow-lg flex items-center justify-center gap-2 text-base"
              >
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                Moonshots
              </button>

              <button
                className="bg-gray-800/80 hover:bg-gray-700/80 text-green-400 font-bold py-3 px-8 rounded-lg border-2 border-green-500 hover:border-green-400 transition-all shadow-lg backdrop-blur-sm flex items-center justify-center gap-2 text-base"
                onClick={() => setShowContactForm(true)}
              >
                <CalendarPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                Contact
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-gray-900/40 border border-green-500/20 rounded-xl p-6 sm:p-8 backdrop-blur-sm mt-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-green-400 mb-6">Doctor's Recipe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-lg bg-green-500/20 p-3 flex items-center justify-center group">
                  <Rat className="h-8 w-8 group-hover:text-green-400 transition-colors text-green-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Viral Marketing</h4>
                  <p className="text-gray-400 text-sm">
                    Comprehensive marketing strategies designed for web3 projects, focusing on community building and
                    brand awareness in the decentralized ecosystem.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-lg bg-green-500/20 p-3 flex items-center justify-center group">
                  <Syringe className="h-8 w-8 group-hover:text-green-400 transition-colors text-green-300" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Community Management</h4>
                  <p className="text-gray-400 text-sm">
                    Expert community management services to engage your audience, build loyalty, and drive organic
                    growth across all Web2 and Web3 social platforms.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-lg bg-green-500/20 p-3 flex items-center justify-center group">
                  <TestTubeDiagonal className="h-8 w-8 group-hover:text-green-400 transition-colors text-green-300" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Content Creation</h4>
                  <p className="text-gray-400 text-sm">
                    High-quality content creation including visual assets, copywriting, and multimedia content optimized
                    for web3 audiences.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-lg bg-green-500/20 p-3 flex items-center justify-center group">
                  <Radiation className="h-8 w-8 group-hover:text-green-400 transition-colors text-green-300" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Web3 Growth</h4>
                  <p className="text-gray-400 text-sm">
                    {
                      "We build Initial hype for protocols with 360° activations — from storytelling to tokenization. Hyped engineered, crowd rallied, traction locked."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Case Studies Section */}
          <div className="rounded-xl p-6 sm:p-8 backdrop-blur-sm mt-8 border-0 bg-transparent">
            <h3 className="text-2xl sm:text-3xl font-bold text-green-400 py-0 mt-0 mb-6">Ecosystem</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <a
                href="https://magiceden.io/marketplace/plagueproject"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800/50 rounded-lg p-6 border border-green-500/10 block hover:border-green-500/40 transition-colors"
              >
                <img
                  src="/images/collection-plague-new.png"
                  alt="Plague Collection Case Study Banner"
                  className="w-full h-32 object-cover rounded-lg mb-4 bg-green-500/10"
                />
                <h4 className="text-lg font-semibold text-white mb-2">{"Plague Collection"}</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Launched a 6,6k+ NFT collection that sold out in 3 hours, generating 3,6k SOL in primary sales through
                  viral marketing strategies.
                </p>
                <div className="flex justify-between text-sm text-green-400">
                  <span className="">Sold Out in 3 hours </span>
                  <span>6,666 Mints </span>
                </div>
              </a>
              <a
                href="https://magiceden.io/marketplace/goo_friends"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800/50 rounded-lg p-6 border border-green-500/10 block hover:border-green-500/40 transition-colors"
              >
                <img
                  src="/images/goo-friends-new.png"
                  alt="Goo Friends Logo"
                  className="w-full h-32 object-cover rounded-lg mb-4 bg-green-500/10"
                />
                <h4 className="text-lg font-semibold text-white mb-2">Goo Friends </h4>
                <p className="text-gray-400 text-sm mb-4">
                  Goo Friends is a free Solana NFT collection celebrating community culture. Backed by major collabs
                  like Okay Bear.
                </p>
                <div className="flex justify-between text-sm text-green-400">
                  <span>Mint Out in 1 Hour</span>
                  <span>6,666 Mints </span>
                </div>
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="border-green-500/20 rounded-xl p-6 sm:p-8 backdrop-blur-sm mt-8 border-0 bg-transparent">
            <h3 className="text-2xl sm:text-3xl font-bold text-green-400 mb-6 text-center">Ready to Go Viral?</h3>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-gray-300 mb-6 text-base sm:text-xl leading-7">
                Let's discuss how we can help your web3 project spread through the digital ecosystem. Our team is ready
                to craft a memetic strategy that resonates with your target audience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  className="bg-gray-800/80 hover:bg-gray-700/80 text-green-400 font-bold py-3 px-8 rounded-lg border-2 border-green-500 hover:border-green-400 transition-all shadow-lg backdrop-blur-sm flex items-center justify-center gap-2 text-sm sm:text-base"
                  onClick={() => setShowContactForm(true)}
                >
                  <CalendarPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                  Get in touch
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer onOpenTerms={() => openModal("terms")} onOpenPrivacy={() => openModal("privacy")} />

      {/* Cookie Consent */}
      <CookieConsent />

      {/* Modals */}
      {activeModal === "about" && <AboutModal onClose={closeModal} />}
      {activeModal === "profile" && <Profile onClose={closeModal} />}
      {activeModal === "terms" && <TermsModal onClose={closeModal} />}
      {activeModal === "team" && <TeamModal onClose={closeModal} />}
      {activeModal === "success" && <SuccessModal onClose={closeModal} />}
      {activeModal === "privacy" && <PrivacyModal onClose={closeModal} />}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-green-400">Get in Touch</h2>
              <button
                onClick={() => {
                  setShowContactForm(false)
                  setSubmitMessage(null)
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form ref={formRef} className="p-6 space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Project inquiry, collaboration, etc."
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <div className="border-t border-gray-700 pt-4">
                <p className="text-sm text-gray-300 mb-4 text-center">
                  Fill out the form above and we'll get back to you within 24 hours.
                </p>

                {submitMessage && (
                  <div
                    className={`mb-3 p-3 rounded-lg text-sm ${
                      submitMessage.type === "success"
                        ? "bg-green-900/50 text-green-300 border border-green-500/30"
                        : "bg-red-900/50 text-red-300 border border-red-500/30"
                    }`}
                  >
                    {submitMessage.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

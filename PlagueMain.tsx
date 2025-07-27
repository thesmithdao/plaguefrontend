"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import Image from "next/image"
import { Info, User, TrendingUp, CalendarPlus } from "lucide-react"
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
    window.location.href = "/" // Navigates to home and refreshes the page
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          crossOrigin="anonymous"
          preload="auto"
          className="w-full h-full object-cover"
          style={{
            filter: "brightness(0.6) contrast(1.1)",
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
              <User className="h-4 w-4" />
              Team
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
              <User className="h-4 w-4" />
              Team
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
            <div className="font-light mb-6 sm:mb-8 text-white leading-tight px-0 text-6xl">
              <div className="mb-2 px-0">A web3 marketing agency</div>
              <div className="px-3.5">
                focused on <em className="italic font-normal">memetic</em> languages.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 sm:mt-12">
              <button
                onClick={() => openModal("success")}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 sm:px-8 rounded-lg border-2 border-green-500 hover:border-green-400 transition-all shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                Moonshots
              </button>

              <button
                className="bg-gray-800/80 hover:bg-gray-700/80 text-green-400 font-bold py-3 px-6 sm:px-8 rounded-lg border-2 border-green-500 hover:border-green-400 transition-all backdrop-blur-sm flex items-center justify-center gap-2 text-sm sm:text-base"
                onClick={() => {
                  const title = encodeURIComponent("Plague Labs Consultation")
                  const details = encodeURIComponent(
                    "Consultation with Plague Labs regarding web3 marketing strategies.",
                  )
                  const organizerEmail = encodeURIComponent("hellohelloplaguelabs@gmail.com")
                  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&add=${organizerEmail}`
                  window.open(googleCalendarUrl, "_blank")
                }}
              >
                <CalendarPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                Get in touch
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-gray-900/40 border border-green-500/20 rounded-xl p-6 sm:p-8 backdrop-blur-sm mt-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-green-400 mb-6">Our Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-lg bg-green-500/20 p-3 flex items-center justify-center text-4xl">
                  {"🦠"}
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
                <div className="w-16 h-16 rounded-lg bg-green-500/20 p-3 flex items-center justify-center text-3xl">
                  {"💚"}
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
                <div className="w-16 h-16 rounded-lg bg-green-500/20 p-3 flex items-center justify-center text-4xl">
                  {"🧪"}
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
                <div className="w-16 h-16 rounded-lg bg-green-500/20 p-3 flex items-center justify-center text-4xl">
                  {"♻️"}
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
            <h3 className="text-2xl sm:text-3xl font-bold text-green-400 py-0 mt-0 mb-6">Infected Ecosystem</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-green-500/10">
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
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6 border border-green-500/10">
                <img
                  src="/images/goo-friends-new.png"
                  alt="Goo Friends Logo"
                  className="w-full h-32 object-cover rounded-lg mb-4 bg-green-500/10"
                />
                <h4 className="text-lg font-semibold text-white mb-2">Goo Friends </h4>
                <p className="text-gray-400 text-sm mb-4">
                  Goo Friends is a free Solana NFT collection (1 per wallet) celebrating community culture. Backed by
                  major collabs like Okay Bear.
                </p>
                <div className="flex justify-between text-sm text-green-400">
                  <span>Sold Out in 1 Hour</span>
                  <span>6,666 Mints </span>
                </div>
              </div>
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
                  className="bg-gray-800/80 hover:bg-gray-700/80 text-green-400 font-bold py-3 px-8 rounded-lg border-2 border-green-500 hover:border-green-400 transition-all backdrop-blur-sm flex items-center justify-center gap-2 text-sm sm:text-base"
                  onClick={() => {
                    const title = encodeURIComponent("Plague Labs Consultation")
                    const details = encodeURIComponent(
                      "Consultation with Plague Labs regarding web3 marketing strategies.",
                    )
                    const organizerEmail = encodeURIComponent("hellohelloplaguelabs@gmail.com")
                    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&add=${organizerEmail}`
                    window.open(googleCalendarUrl, "_blank")
                  }}
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
    </div>
  )
}

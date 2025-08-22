"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import Image from "next/image"
import AboutModal from "./AboutModal"
import Profile from "./Profile"
import LoreModal from "./LoreModal"
import TeamModal from "./TeamModal"
import PrivacyModal from "./PrivacyModal"
import TermsModal from "./TermsModal"
import SuccessModal from "./SuccessModal"
import BottomModal from "./BottomModal"
import CookieConsent from "./CookieConsent"
import Footer from "./Footer"
import WalletConnection from "./WalletConnection"

export default function PlagueMain() {
  const { connected } = useWallet()
  const [showAbout, setShowAbout] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showLore, setShowLore] = useState(false)
  const [showTeam, setShowTeam] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showBottom, setShowBottom] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBottom(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: "brightness(0.3)" }}
      >
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_vTqQuXuVFNjebUAev08JBC8Hnkeh/Ev5e_gf-UN8fKrVSqM_m23/public/bgvideo.mp4" type="video/mp4" />
      </video>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full p-4 sm:p-6">
          <div className="flex items-center justify-between sm:grid sm:grid-cols-3 sm:items-center max-w-7xl mx-auto">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/images/test-tube-logo.png"
                alt="Plague Labs"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
            </div>

            {/* Navigation */}
            <nav className="flex items-center justify-center mx-4 sm:mx-0">
              <div className="flex items-center space-x-3 sm:space-x-8">
                <button
                  onClick={() => setShowAbout(true)}
                  className="text-white hover:text-green-400 transition-colors font-medium text-sm sm:text-base"
                >
                  About
                </button>
                <button
                  onClick={() => setShowProfile(true)}
                  className="text-white hover:text-green-400 transition-colors font-medium text-sm sm:text-base"
                >
                  Profile
                </button>
              </div>
            </nav>

            {/* Wallet Connection */}
            <div className="flex justify-end">
              <WalletConnection />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {/* Hero Text */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-green-400 leading-tight">PLAGUE LABS</h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Enter the laboratory where digital pathogens evolve and spread across the blockchain
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <button
                onClick={() => setShowLore(true)}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Explore the Lore
              </button>
              <button
                onClick={() => setShowTeam(true)}
                className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-gray-600"
              >
                Meet the Team
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer onPrivacyClick={() => setShowPrivacy(true)} onTermsClick={() => setShowTerms(true)} />
      </div>

      {/* Modals */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
      {showLore && <LoreModal onClose={() => setShowLore(false)} />}
      {showTeam && <TeamModal onClose={() => setShowTeam(false)} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
      {showBottom && <BottomModal onClose={() => setShowBottom(false)} />}

      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  )
}

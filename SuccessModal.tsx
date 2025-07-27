"use client"

import { X, ExternalLink } from "lucide-react"

interface SuccessCase {
  project: string
  category: string
  description: string
  results: {
    [key: string]: string
  }
  image: string
  timeline?: string
  services?: string[]
  xUrl?: string
  websiteUrl?: string
}

interface SuccessModalProps {
  onClose: () => void
}

export default function SuccessModal({ onClose }: SuccessModalProps) {
  const successCases: SuccessCase[] = [
    {
      project: "Serenia",
      category: "GameFi",
      image: "/images/serenia-logo.png",
      results: {
        Mints: "+500%",
        community: "50K+",
        revenue: "$2M+",
      },
      description:
        "Serenia is an NFT battle game on Sui blockchain where mystical creatures and trainers fight for glory and loot.",
      timeline: "3 months",
      services: ["White Label", "Viral Marketing", "Influencer Partnerships"],
      xUrl: "https://x.com/serenianft",
      websiteUrl: "https://serenia.quest",
    },
    {
      project: "Himalaya",
      category: "NFT",
      image: "/images/himalaya-logo.png",
      results: {
        tvl: "Sold Out",
        community: "25K+",
        revenue: "$1.5M+",
      },
      description: "Himalaya is a Solana NFT collection of snow apes forging their own destiny in the frozen peaks.",
      timeline: "6 weeks",
      services: ["NFT Marketing", "Community Building", "Launch Strategy"],
      xUrl: "https://x.com/Himalaya_sol",
    },
    {
      project: "Cosmic Love",
      category: "GameFi",
      image: "/images/cosmic-love-logo.png",
      results: {
        tvl: "+300%",
        community: "75K+",
        revenue: "$5M+",
      },
      description:
        "Cosmic Love is a vibrant 2D pixel shooter — visually striking, endlessly addictive, and already a classic in the making.",
      timeline: "4 months",
      services: ["Dev", "Launch Strategy", "Gaming Marketing"],
      xUrl: "https://x.com/cosmiclove_u",
    },
    {
      project: "Western Legends",
      category: "NFT",
      image: "/images/western-legends-logo.png",
      results: {
        tvl: "+800%",
        community: "100K+",
        revenue: "$3M+",
      },
      description: "Western Legends is a Solana NFT collection blending anime aesthetics with wild west energy",
      timeline: "5 months",
      services: ["Storytelling", "Community Building", "Content Strategy"],
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <h2 className="text-lg font-bold text-green-400">Moonshots</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white mb-2">Viral Success Stories</h3>
            <p className="text-gray-400">Real results from our memetic marketing campaigns</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {successCases.map((project, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.project}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                      {project.category}
                    </span>
                  </div>
                  {project.xUrl && (
                    <div className="absolute top-4 right-4">
                      <a
                        href={project.xUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-900/80 text-white p-2 rounded-full hover:bg-gray-800 transition-colors backdrop-blur-sm"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h4 className="text-white font-bold text-xl mb-2">{project.project}</h4>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">{project.description}</p>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {/* Original numerical data commented out for future utilization */}
                    {/*
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                        <span className="text-green-400 font-bold text-lg">{project.results.tvl}</span>
                      </div>
                      <p className="text-gray-400 text-xs">Growth/Status</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-4 w-4 text-green-400 mr-1" />
                        <span className="text-green-400 font-bold text-lg">{project.results.community}</span>
                      </div>
                      <p className="text-gray-400 text-xs">Community</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <DollarSign className="h-4 w-4 text-green-400 mr-1" />
                        <span className="text-green-400 font-bold text-lg">{project.results.revenue}</span>
                      </div>
                      <p className="text-gray-400 text-xs">Revenue</p>
                    </div>
                    */}
                    <div className="col-span-3 text-center text-gray-400 text-lg font-semibold">Coming soon!</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6">
              <h4 className="text-green-400 font-bold text-lg mb-2">Ready to Go Viral?</h4>
              <p className="text-gray-300 text-sm mb-4">
                Join our success stories and let us help your project achieve moonshot results.
              </p>
              <button
                onClick={() => {
                  const title = encodeURIComponent("Moonshot Marketing Consultation")
                  const details = encodeURIComponent(
                    "I'm interested in discussing viral marketing strategies for my Web3 project with the Plague Labs team.",
                  )
                  const organizerEmail = encodeURIComponent("hellohelloplaguelabs@gmail.com")
                  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&add=${organizerEmail}`
                  window.open(googleCalendarUrl, "_blank")
                }}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg"
              >
                Start Your Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

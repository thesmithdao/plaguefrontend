"use client"

import { X, ExternalLink, TrendingUp, Users, DollarSign } from "lucide-react"

interface SuccessCase {
  name: string
  category: string
  description: string
  metrics: {
    growth: string
    engagement: string
    revenue: string
  }
  image: string
  link?: string
}

interface SuccessModalProps {
  onClose: () => void
}

export default function SuccessModal({ onClose }: SuccessModalProps) {
  const successCases: SuccessCase[] = [
    {
      name: "Cosmic Love",
      category: "NFT Collection",
      description:
        "A romantic space-themed NFT collection that captured hearts across the galaxy. Our viral campaign strategy resulted in a complete sellout within hours of launch.",
      metrics: {
        growth: "500% follower increase",
        engagement: "85% engagement rate",
        revenue: "2,400 SOL raised",
      },
      image: "/images/cosmic-love-logo.png",
      link: "https://twitter.com/cosmic_love_nft",
    },
    {
      name: "Serenia",
      category: "Gaming Project",
      description:
        "An adventure gaming platform that needed community building and hype generation. We created a viral marketing campaign that established a strong player base before launch.",
      metrics: {
        growth: "300% community growth",
        engagement: "92% retention rate",
        revenue: "1,800 SOL presale",
      },
      image: "/images/serenia-logo.png",
      link: "https://twitter.com/serenia_game",
    },
    {
      name: "Himalaya",
      category: "DeFi Protocol",
      description:
        "A mountain-peak DeFi protocol that needed to establish trust and attract liquidity providers. Our strategic campaign built confidence and drove significant TVL.",
      metrics: {
        growth: "400% user acquisition",
        engagement: "78% active users",
        revenue: "$2.5M TVL achieved",
      },
      image: "/images/himalaya-logo.png",
      link: "https://twitter.com/himalaya_defi",
    },
    {
      name: "Western Legends",
      category: "Gaming NFTs",
      description:
        "A Wild West themed gaming NFT project that needed authentic community engagement. We crafted a narrative-driven campaign that resonated with gaming enthusiasts.",
      metrics: {
        growth: "600% Discord growth",
        engagement: "89% holder retention",
        revenue: "3,200 SOL volume",
      },
      image: "/images/western-legends-logo.png",
      link: "https://twitter.com/western_legends",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <h2 className="text-xl font-bold text-green-400">Moonshot Success Stories</h2>
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
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                      {project.category}
                    </span>
                  </div>
                  {project.link && (
                    <div className="absolute top-4 right-4">
                      <a
                        href={project.link}
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
                  <h4 className="text-white font-bold text-xl mb-2">{project.name}</h4>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">{project.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                      <TrendingUp className="h-5 w-5 text-green-400 mx-auto mb-1" />
                      <p className="text-green-400 text-xs font-medium">Growth</p>
                      <p className="text-white text-sm font-bold">{project.metrics.growth}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                      <Users className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                      <p className="text-blue-400 text-xs font-medium">Engagement</p>
                      <p className="text-white text-sm font-bold">{project.metrics.engagement}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                      <DollarSign className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                      <p className="text-yellow-400 text-xs font-medium">Revenue</p>
                      <p className="text-white text-sm font-bold">{project.metrics.revenue}</p>
                    </div>
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

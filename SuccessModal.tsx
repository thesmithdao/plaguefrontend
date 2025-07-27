"use client"

import { X, ExternalLink } from "lucide-react"

interface SuccessModalProps {
  onClose: () => void
}

export default function SuccessModal({ onClose }: SuccessModalProps) {
  const successCases = [
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
            <X className="h-5 w-5" />
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
                className="bg-gray-800/50 rounded-lg overflow-hidden border border-green-500/20 hover:border-green-500/50 transition-colors"
              >
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.project}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-bold text-lg">{project.project}</h4>
                    <span className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded border border-green-500/30">
                      {project.category}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">{project.description}</p>

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

                  <div className="mb-4">
                    <p className="text-gray-400 text-xs mb-2">
                      Timeline: <span className="text-white">{project.timeline}</span>
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.services.map((service, serviceIndex) => (
                        <span key={serviceIndex} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social Links Section */}
                  {(project.websiteUrl || project.xUrl) && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex gap-2">
                        {project.websiteUrl && (
                          <a
                            href={project.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                            title="Visit Website"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {project.xUrl && (
                          <a
                            href={project.xUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-black hover:bg-gray-800 text-white p-2 rounded-lg transition-colors flex items-center justify-center flex-row px-3.5"
                            title="Follow on 𝕏"
                          >
                            <span className="text-sm font-bold">𝕏</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

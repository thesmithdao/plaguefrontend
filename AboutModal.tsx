"use client"

import { X } from "lucide-react"

interface AboutModalProps {
  onClose: () => void
}

export default function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full h-full sm:max-w-2xl sm:w-full sm:max-h-[90vh] sm:h-auto overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <h2 className="text-lg font-bold text-green-400">About Plague</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🧪</div>
            <h3 className="text-xl font-bold text-white mb-2">{"\nTogether we'll spread the plague."}</h3>
          </div>

          <div className="space-y-4 text-gray-300">
            <p className="text-justify">
              {
                "We believe memetics will shape the future of culture, and we’re here to weaponize it. Beyond creating viral, on-chain-native content, we cultivate strong community energy in the web3 space. Our brand offers memetic consulting to supercharge marketing strategies — in Brazil and worldwide."
              }
            </p>

            <p className="text-justify">
              Our approach combines traditional marketing principles with the innovative spirit of web3, creating
              campaigns that don't just reach audiences—they infect them with your brand's message.
            </p>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-green-500/20">
              <h4 className="text-green-400 font-semibold mb-2">Our Mission</h4>
              <p className="text-sm">
                To help web3 projects achieve viral growth through strategic memetic marketing, community building, and
                authentic engagement that spreads organically through the decentralized ecosystem.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-green-500/20">
              <h4 className="text-green-400 font-semibold mb-2">Why Choose Plague Labs?</h4>
              <ul className="text-sm space-y-1">
                <li>• Deep understanding of web3 culture and communities</li>
                <li>• Proven track record with DeFi and NFT projects</li>
                <li>• Data-driven approach with memetic insights</li>
                <li>• Full-service marketing from strategy to execution</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

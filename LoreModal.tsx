"use client"

import { X } from "lucide-react"

interface LoreModalProps {
  onClose: () => void
}

export default function LoreModal({ onClose }: LoreModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full h-full sm:max-w-2xl sm:w-full sm:max-h-[90vh] sm:h-auto overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <h2 className="text-lg font-bold text-green-400">The PLAGUE Lore</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🦠</div>
            <h3 className="text-xl font-bold text-white mb-2">The Digital Contagion</h3>
            <p className="text-green-400 font-medium">How Ideas Spread in Web3</p>
          </div>

          <div className="space-y-4 text-gray-300">
            <p>
              In the vast digital ecosystem of web3, ideas don't just travel—they mutate, evolve, and spread like a
              benevolent plague. PLAGUE Labs was born from the understanding that the most powerful marketing isn't
              pushed, it's pulled. It spreads organically, person to person, community to community.
            </p>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-green-500/20">
              <h4 className="text-green-400 font-semibold mb-2">The Origin Story</h4>
              <p className="text-sm">
                Founded by a collective of crypto-native marketers, developers, and community builders who witnessed
                firsthand how the most successful web3 projects achieved viral growth not through traditional
                advertising, but through memetic engineering and authentic community engagement.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-green-500/20">
              <h4 className="text-green-400 font-semibold mb-2">The Memetic Approach</h4>
              <p className="text-sm">
                We study how information spreads in decentralized networks, identifying the key nodes, influential
                voices, and cultural currents that can carry your message across the entire ecosystem. Our campaigns are
                designed to be infectious—in the best possible way.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-green-500/20">
              <h4 className="text-green-400 font-semibold mb-2">The Lab Philosophy</h4>
              <p className="text-sm">
                Every campaign is an experiment. We test, iterate, and evolve our strategies based on real-world data
                and community feedback. Like a virus adapting to its environment, our marketing approaches continuously
                improve and become more effective.
              </p>
            </div>

            <p className="text-center text-green-400 font-medium italic">
              "In web3, the best marketing doesn't feel like marketing at all—it feels like culture."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

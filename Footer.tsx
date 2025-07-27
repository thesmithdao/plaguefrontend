"use client"

interface FooterProps {
  onOpenPrivacy: () => void
  onOpenTerms: () => void
}

export default function Footer({ onOpenPrivacy, onOpenTerms }: FooterProps) {
  return (
    <footer className="relative z-10 border-t border-gray-800/50 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Plague Labs
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Engineering viral marketing campaigns that spread organically through web3 ecosystems.
            </p>
          </div>

          {/* Connect */}
          <div className="md:text-right">
            <h3 className="text-white font-semibold mb-4">Follow us</h3>
            <div className="flex items-center space-x-4 md:justify-end">
              <a
                href="https://twitter.com/plague_labs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
                aria-label="Twitter"
              >
                <span className="text-lg font-bold">𝕏</span>
              </a>
              {/*
              <a
                href="https://discord.gg/plague"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
                aria-label="Discord"
              >
                <span className="text-lg">💬</span>
              </a>
              */}
              <a
                href="mailto:helloplaguelabs@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
                aria-label="Email"
              >
                <span className="text-lg">📧</span>
              </a>
              <a
                href="https://www.youtube.com/@plague_labs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
                aria-label="YouTube"
              >
                <span className="text-lg">▶️</span>
              </a>
              <a
                href="https://www.twitch.tv/plaguelabs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
                aria-label="Twitch"
              >
                <span className="text-lg">{"🟢"}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 Plague Labs</p>
          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-6 mt-4 sm:mt-0">
            <button
              onClick={onOpenPrivacy}
              className="text-gray-400 hover:text-green-400 text-sm transition-colors flex items-center gap-1"
            >
              <span className="text-xs">🛡️</span>
              Privacy Policy
            </button>
            <button
              onClick={onOpenTerms}
              className="text-gray-400 hover:text-green-400 text-sm transition-colors flex items-center gap-1"
            >
              <span className="text-xs">📄</span>
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

"use client"

import { X } from "lucide-react"

interface PrivacyModalProps {
  onClose: () => void
}

export default function PrivacyModal({ onClose }: PrivacyModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <h2 className="text-lg font-bold text-green-400">Privacy Policy</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-gray-300 text-sm">
          <div>
            <h3 className="text-white font-semibold mb-2">Information We Collect</h3>
            <p>
              We collect information you provide directly to us, such as when you create an account, connect your
              wallet, or contact us for support. This may include your wallet address, transaction history, and
              communication preferences.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">How We Use Your Information</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>To provide and maintain our services</li>
              <li>To process transactions and display your NFT collection</li>
              <li>To communicate with you about our services</li>
              <li>To improve our platform and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Information Sharing</h3>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties without your
              consent, except as described in this policy. We may share information with service providers who assist us
              in operating our platform.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Data Security</h3>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. However, no method of transmission over the internet is
              100% secure.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Blockchain Data</h3>
            <p>
              Please note that blockchain transactions are public and permanent. Any information recorded on the
              blockchain cannot be deleted or modified by us.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us at helloplaguelabs@gmail.com</p>
          </div>

          <div className="text-xs text-gray-400 pt-4 border-t border-gray-700">Last updated: January 2025</div>
        </div>
      </div>
    </div>
  )
}

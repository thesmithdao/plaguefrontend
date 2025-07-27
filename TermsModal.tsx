"use client"

import { X } from "lucide-react"

interface TermsModalProps {
  onClose: () => void
}

export default function TermsModal({ onClose }: TermsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <h2 className="text-lg font-bold text-green-400">Terms of Service</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-gray-300 text-sm">
          <div>
            <h3 className="text-white font-semibold mb-2">Acceptance of Terms</h3>
            <p>
              By accessing and using Plague Labs services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Service Description</h3>
            <p>
              Plague Labs provides web3 marketing services, NFT collection management, and community building tools. Our services are provided "as is" and we make no warranties regarding the availability or functionality of our services.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">User Responsibilities</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>You are responsible for maintaining the security of your wallet and private keys</li>
              <li>You must not use our services for any illegal or unauthorized purpose</li>
              <li>You must not attempt to gain unauthorized access to our systems</li>
              <li>You must not attempt to gain unauthorized access to our systems</li>
              <li>You are responsible for all activities that occur under your account</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Intellectual Property</h3>
            <p>
              The service and its original content, features, and functionality are and will remain the exclusive property of Plague Labs and its licensors. The service is protected by copyright, trademark, and other laws.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Limitation of Liability</h3>
            <p>
              In no event shall Plague Labs be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Termination</h3>
            <p>
              We may terminate or suspend your account and bar access to the service immediately, without prior notice
              or liability, under our sole discretion, for any reason whatsoever.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Changes to Terms</h3>
            <p>
              We reserve the right to modify or replace these terms at any time. If a revision is material, we will
              provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </div>

          <div className="text-xs text-gray-400 pt-4 border-t border-gray-700">Last updated: January 2025</div>
        </div>
      </div>
    </div>
  )
}

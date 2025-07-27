"use client"

import { X } from "lucide-react"

interface TeamModalProps {
  onClose: () => void
}

export default function TeamModal({ onClose }: TeamModalProps) {
  const teamMembers = [
    {
      name: "Billy",
      role: "The Mastermind",
      avatar: "/images/team/billy.jpg",
      bio: "Strategic visionary leading Plague's memetic warfare operations. Master of viral campaign orchestration and community psychology.",
      expertise: ["Strategic Planning", "Viral Marketing", "Leadership"],
    },
    {
      name: "Atlan",
      role: "The Artist",
      avatar: "/images/team/atlan.png",
      bio: "Creative genius behind Plague's visual identity and artistic direction. Transforms concepts into compelling visual narratives.",
      expertise: ["Visual Design", "Brand Identity", "Creative Direction"],
    },
    {
      name: "Danllan",
      role: "The Motion",
      avatar: "/images/team/danllan.png",
      bio: "Animation and motion graphics specialist bringing Plague's campaigns to life with dynamic visual storytelling.",
      expertise: ["Motion Graphics", "Animation", "Video Production"],
    },
    {
      name: "Montana",
      role: "The Voice",
      avatar: "/images/team/montana.jpeg",
      bio: "Communications expert and brand voice architect. Crafts the narrative that resonates across all Plague channels.",
      expertise: ["Content Strategy", "Brand Voice", "Communications"],
    },
    {
      name: "WhiteHawk",
      role: "The Engineer",
      avatar: "/images/team/whitehawk.png",
      bio: "Technical architect building the infrastructure that powers Plague's digital ecosystem and campaign delivery systems.",
      expertise: ["Team Coordination", "Infra", "Technical Strategy"],
    },
    {
      name: "HellmansX",
      role: "The Hacker",
      avatar: "/images/team/hellmansx.png",
      bio: "Security specialist and blockchain expert ensuring Plague's operations remain secure and cutting-edge.",
      expertise: ["Growth-hacker", "Blockchain", "Operations"],
    },
    {
      name: "Vitalek",
      role: "The Lawbringer",
      avatar: "/images/team/vitalek.png",
      bio: "Legal counsel and compliance expert navigating the complex regulatory landscape of web3 marketing.",
      expertise: ["Legal Compliance", "Regulatory Affairs", "Contract Law"],
    },
    {
      name: "TheSmith",
      role: "The Powerhouse",
      avatar: "/images/team/thesmith.png",
      bio: "Operations and execution specialist who turns Plague's strategic visions into reality with unstoppable force.",
      expertise: ["Operations", "Project Execution", "Architecture"],
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <h2 className="text-lg font-bold text-green-400">Plague Team</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white mb-2">Meet the Doctors</h3>
            <p className="text-gray-400">Our team of web3 marketing experts, ready to spread your message</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-lg p-6 border border-green-500/20 hover:border-green-500/50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name}
                    className="w-16 h-16 rounded-full border-2 border-green-500/30 object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg">{member.name}</h4>
                    <p className="text-green-400 font-medium text-sm mb-2">{member.role}</p>
                    <p className="text-gray-300 text-sm mb-3">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

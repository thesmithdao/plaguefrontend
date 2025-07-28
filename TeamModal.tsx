"use client"

import { X } from "lucide-react"

interface TeamMember {
  name: string
  role: string
  bio: string
  avatar: string
  specialization: string
}

interface TeamModalProps {
  onClose: () => void
}

export default function TeamModal({ onClose }: TeamModalProps) {
  const teamMembers: TeamMember[] = [
    {
      name: "Billy",
      role: "Chief Plague Officer",
      bio: "Master of viral marketing strategies and memetic warfare. Billy leads our infection campaigns with surgical precision.",
      avatar: "/images/team/billy.jpg",
      specialization: "Viral Strategy",
    },
    {
      name: "Atlan",
      role: "Head of Contagion",
      bio: "Expert in community spread and engagement amplification. Atlan ensures our campaigns reach epidemic proportions.",
      avatar: "/images/team/atlan.png",
      specialization: "Community Growth",
    },
    {
      name: "Danllan",
      role: "Mutation Specialist",
      bio: "Creative director who adapts our messaging for maximum impact across different platforms and audiences.",
      avatar: "/images/team/danllan.png",
      specialization: "Content Adaptation",
    },
    {
      name: "Montana",
      role: "Data Pathologist",
      bio: "Analyzes infection patterns and campaign performance to optimize our viral coefficient and engagement rates.",
      avatar: "/images/team/montana.jpeg",
      specialization: "Analytics & Optimization",
    },
    {
      name: "WhiteHawk",
      role: "Transmission Engineer",
      bio: "Technical architect who builds the infrastructure for our viral campaigns and ensures seamless spread.",
      avatar: "/images/team/whitehawk.png",
      specialization: "Technical Implementation",
    },
    {
      name: "HellmansX",
      role: "Epidemic Coordinator",
      bio: "Project manager who orchestrates multi-platform campaigns and ensures all infection vectors are synchronized.",
      avatar: "/images/team/hellmansx.png",
      specialization: "Campaign Management",
    },
    {
      name: "Vitalek",
      role: "Strain Developer",
      bio: "Innovation lead who develops new marketing methodologies and experimental growth techniques.",
      avatar: "/images/team/vitalek.png",
      specialization: "Innovation & R&D",
    },
    {
      name: "TheSmith",
      role: "Quarantine Breaker",
      bio: "Specialist in breaking through market resistance and establishing footholds in new communities.",
      avatar: "/images/team/thesmith.png",
      specialization: "Market Penetration",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-6xl max-h-[85vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <h2 className="text-xl font-bold text-green-400">Laboratory</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white mb-2">Meet the Doctors</h3>
            <p className="text-gray-400">The brilliant minds behind our viral marketing laboratory</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-lg p-4 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="text-center mb-4">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <img
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover border-2 border-green-500/30"
                    />
                  </div>
                  <h4 className="text-white font-bold text-lg">{member.name}</h4>
                  <p className="text-green-400 text-sm font-medium">{member.role}</p>
                  <div className="mt-2 px-2 py-1 bg-green-500/20 rounded-full">
                    <p className="text-green-300 text-xs">{member.specialization}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center"></div>
        </div>
      </div>
    </div>
  )
}

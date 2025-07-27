"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase, isSupabaseConfigured, type LeaderboardEntry } from "../lib/supabase"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { RefreshCw, Search, X, Trophy, Medal, Award } from "lucide-react"
import DatabaseSetup from "./DatabaseSetup"

interface ExtendedLeaderboardEntry extends LeaderboardEntry {
  updated_at?: string
  submission_count?: number
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<ExtendedLeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [needsSetup, setNeedsSetup] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResult, setSearchResult] = useState<ExtendedLeaderboardEntry | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isSupabaseConfigured()) {
      setError("Database not configured")
      setLoading(false)
      return
    }
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    setError(null)

    try {
      let { data, error } = await supabase
        .from("leaderboard")
        .select("*, updated_at, submission_count")
        .order("score", { ascending: false })
        .limit(50)

      if (error && error.message.includes("column") && error.message.includes("does not exist")) {
        const { data: basicData, error: basicError } = await supabase
          .from("leaderboard")
          .select("*")
          .order("score", { ascending: false })
          .limit(50)

        if (basicError) throw basicError
        data = basicData
      } else if (error) {
        if (error.message.includes('relation "public.leaderboard" does not exist')) {
          setNeedsSetup(true)
          setError("Database table not created")
        } else {
          throw error
        }
        return
      }

      setEntries((data || []).slice(0, 50))
      setError(null)
      setNeedsSetup(false)
    } catch (err) {
      setError("Failed to load leaderboard")
    } finally {
      setLoading(false)
    }
  }, [])

  const searchWallet = useCallback(async (walletAddress: string) => {
    if (!supabase || !walletAddress.trim()) {
      setSearchResult(null)
      return
    }

    try {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*, updated_at, submission_count")
        .eq("wallet_address", walletAddress.trim())
        .limit(1)

      if (error) throw error

      if (data && data.length > 0) {
        const { count } = await supabase
          .from("leaderboard")
          .select("*", { count: "exact", head: true })
          .gt("score", data[0].score)

        setSearchResult({ ...data[0], rank: (count || 0) + 1 })
      } else {
        setSearchResult(null)
      }
    } catch (err) {
      setSearchResult(null)
    }
  }, [])

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      if (query.trim()) {
        searchWallet(query)
      } else {
        setSearchResult(null)
      }
    },
    [searchWallet],
  )

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="font-bold text-lg w-6 text-center">{index + 1}</span>
    }
  }

  const displayEntries = searchQuery && searchResult ? [searchResult] : entries

  if (!mounted) return <div className="h-10 w-48 animate-pulse bg-gray-700 rounded-lg" />
  if (!isSupabaseConfigured()) return <InfoCard msg="Database not configured" />
  if (needsSetup) return <DatabaseSetup />

  return (
    <div className="flex flex-col w-full h-full">
      <Card className="w-full bg-gray-800/80 border border-gray-600 backdrop-blur-sm shadow-2xl flex-1">
        <CardHeader className="flex-row items-center justify-between py-3 px-4 border-b border-gray-700">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search wallet..."
                className="w-full bg-gray-900/70 border border-gray-600 rounded-lg py-2 px-3 pl-9 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pixel-font"
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              {searchQuery && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="text-gray-400 hover:text-orange-400 transition-colors flex-shrink-0 ml-2 disabled:opacity-50 p-1"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </CardHeader>

        <CardContent className="p-0 flex-1" style={{ height: "350px" }}>
          {loading ? (
            <div className="text-center text-gray-400 h-full flex items-center justify-center p-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                <span className="pixel-font text-xs">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 h-full flex items-center justify-center p-4">
              <div>
                <p className="mb-2 pixel-font text-xs">❌ {error}</p>
                <button
                  onClick={fetchLeaderboard}
                  className="text-[10px] bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors pixel-font"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : displayEntries.length === 0 ? (
            <div className="text-center text-gray-400 h-full flex items-center justify-center p-4">
              <p className="pixel-font text-xs">
                {searchQuery ? "No matching wallets found" : "No scores yet! Be the first!"}
              </p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto px-2 sm:px-4 py-2 sm:py-3 space-y-1.5 sm:space-y-2 leaderboard-scroll">
              <style jsx>{`
                .leaderboard-scroll {
                  scrollbar-width: thin;
                  scrollbar-color: #fb923c #374151;
                }
                .leaderboard-scroll::-webkit-scrollbar {
                  width: 8px;
                }
                .leaderboard-scroll::-webkit-scrollbar-track {
                  background: #374151;
                  border-radius: 4px;
                }
                .leaderboard-scroll::-webkit-scrollbar-thumb {
                  background: #fb923c;
                  border-radius: 4px;
                }
                .leaderboard-scroll::-webkit-scrollbar-thumb:hover {
                  background: #f97316;
                }
              `}</style>
              {displayEntries.map((entry, index) => {
                const originalIndex = searchResult
                  ? (searchResult as any).rank - 1
                  : entries.findIndex((e) => e.wallet_address === entry.wallet_address)

                return (
                  <div
                    key={`${entry.id}-${entry.wallet_address}`}
                    className={`flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all border ${
                      searchQuery && searchResult
                        ? "bg-orange-500/20 border-orange-500 shadow-lg pulse-glow"
                        : originalIndex === 0
                          ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500 shadow-lg"
                          : originalIndex === 1
                            ? "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400"
                            : originalIndex === 2
                              ? "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600"
                              : "bg-gray-700/50 border-gray-600 hover:bg-gray-700/70"
                    }`}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-6 sm:w-8 flex-shrink-0">
                        {getRankIcon(originalIndex)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="bg-blue-500/20 text-blue-300 py-0.5 px-1.5 rounded-full pixel-font text-xs truncate">
                            {truncateAddress(entry.wallet_address)}
                          </span>
                        </div>
                        {entry.submission_count && entry.submission_count > 1 && (
                          <div className="text-[10px] text-gray-400">
                            <span className="bg-blue-500/20 text-blue-300 py-0.5 px-1 rounded-full pixel-font">
                              {entry.submission_count} tries
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="bg-blue-500/20 text-blue-300 py-1 px-2 rounded-full pixel-font text-xs sm:text-sm font-bold">
                        {entry.score}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const InfoCard = ({ msg, sub }: { msg: string; sub?: string }) => (
  <div className="flex flex-col w-full h-full">
    <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-orange-400 pixel-font">
      🏆 LEADERBOARD
    </h2>
    <Card className="w-full bg-gray-800/80 border-gray-600 backdrop-blur-sm flex-1" style={{ height: "400px" }}>
      <CardContent className="flex-1 flex items-center justify-center h-full">
        <div className="text-center text-gray-400">
          <p className="mb-2 pixel-font">{msg}</p>
          {sub && <p className="text-xs pixel-font">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  </div>
)

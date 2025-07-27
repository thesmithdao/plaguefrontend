"use client"

import { useState } from "react"
import { supabase } from "../lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DatabaseSetup() {
  const [creating, setCreating] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTable = async () => {
    if (!supabase) return

    setCreating(true)
    setError(null)

    try {
      // Test if table exists by trying to query it
      const { error: testError } = await supabase.from("leaderboard").select("id").limit(1)

      if (testError && testError.message.includes("does not exist")) {
        throw new Error("Please run the SQL script manually in your Supabase dashboard")
      }

      setSuccess(true)
    } catch (error: any) {
      console.error("Database setup error:", error)
      setError(error.message || "Failed to create table")
    } finally {
      setCreating(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md bg-green-50 border-green-200">
        <CardContent className="p-4 text-center">
          <p className="text-green-600 font-bold">✅ Database ready!</p>
          <Button onClick={() => window.location.reload()} className="mt-2" size="sm">
            Refresh
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md bg-orange-50 border-orange-200">
      <CardHeader>
        <CardTitle className="text-center text-orange-800 text-sm">Database Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-orange-700">
          Run the migration script to add new columns to your existing leaderboard table.
        </p>

        <Button
          onClick={createTable}
          disabled={creating}
          className="w-full bg-orange-600 hover:bg-orange-700"
          size="sm"
        >
          {creating ? "Checking..." : "Check Database"}
        </Button>

        {error && (
          <div className="text-red-600 text-xs">
            <p className="font-bold">Migration Required:</p>
            <p className="mb-2">{error}</p>
            <div className="bg-gray-100 p-2 rounded text-xs font-mono">
              <p>Supabase Dashboard → SQL Editor:</p>
              <code className="block mt-1 text-xs">
                -- Run the migrate-leaderboard.sql script
                <br />
                ALTER TABLE public.leaderboard
                <br />
                ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW(),
                <br />
                ADD COLUMN IF NOT EXISTS last_submission TIMESTAMP DEFAULT NOW();
              </code>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

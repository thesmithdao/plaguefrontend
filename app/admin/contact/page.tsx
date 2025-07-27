"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  created_at: string
  ip_address: string
}

export default function ContactAdmin() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error

      setSubmissions(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch submissions")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("contact_submissions").update({ status: newStatus }).eq("id", id)

      if (error) throw error

      setSubmissions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub)))
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={fetchSubmissions}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="mt-2 text-gray-600">Manage and respond to contact form submissions</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {submissions.map((submission) => (
              <li key={submission.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{submission.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            submission.status === "new"
                              ? "bg-red-100 text-red-800"
                              : submission.status === "emails_sent"
                                ? "bg-green-100 text-green-800"
                                : submission.status === "responded"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {submission.status}
                        </span>
                        <select
                          value={submission.status}
                          onChange={(e) => updateStatus(submission.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="new">New</option>
                          <option value="submitted">Submitted</option>
                          <option value="notification_sent">Notification Sent</option>
                          <option value="emails_sent">Emails Sent</option>
                          <option value="responded">Responded</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {submission.email} • {submission.subject}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">{new Date(submission.created_at).toLocaleString()}</p>
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{submission.message}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {submissions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No contact submissions yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

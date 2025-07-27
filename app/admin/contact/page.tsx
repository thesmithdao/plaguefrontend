"use client"

import { useState, useEffect } from "react"
import { supabase, type ContactSubmission } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"

export default function ContactAdmin() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)

  useEffect(() => {
    fetchSubmissions()

    // Set up real-time subscription
    const subscription = supabase
      .channel("contact_submissions")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_submissions" }, () => {
        fetchSubmissions()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setSubmissions(data || [])
    } catch (error) {
      console.error("Error fetching submissions:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: ContactSubmission["status"]) => {
    try {
      const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id)

      if (error) throw error

      // Update local state
      setSubmissions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, status } : sub)))

      if (selectedSubmission?.id === id) {
        setSelectedSubmission((prev) => (prev ? { ...prev, status } : null))
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "read":
        return "bg-yellow-100 text-yellow-800"
      case "replied":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="mt-2 text-gray-600">Manage and respond to contact form submissions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submissions List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Submissions ({submissions.length})</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedSubmission?.id === submission.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{submission.name}</p>
                      <p className="text-sm text-gray-500 truncate">{submission.subject}</p>
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(submission.status)}`}
                    >
                      {submission.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Details */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {selectedSubmission ? "Submission Details" : "Select a submission"}
              </h2>
            </div>
            {selectedSubmission ? (
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedSubmission.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">
                      <a href={`mailto:${selectedSubmission.email}`} className="text-blue-600 hover:text-blue-500">
                        {selectedSubmission.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedSubmission.subject}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">IP Address</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedSubmission.ip_address || "Unknown"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Submitted</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedSubmission.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="flex space-x-2">
                      {(["new", "read", "replied", "archived"] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(selectedSubmission.id, status)}
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            selectedSubmission.status === status
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Reply */}
                  <div className="pt-4 border-t border-gray-200">
                    <a
                      href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}&body=Hi ${selectedSubmission.name},%0D%0A%0D%0AThank you for reaching out to Plague Labs.%0D%0A%0D%0A`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">Select a submission from the list to view details</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

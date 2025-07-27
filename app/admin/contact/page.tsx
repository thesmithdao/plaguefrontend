"use client"

import { useState, useEffect } from "react"
import { supabase, type ContactSubmission } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContactAdminPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching submissions:", error)
        return
      }

      setSubmissions(data || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)

      if (error) {
        console.error("Error updating status:", error)
        return
      }

      // Update local state
      setSubmissions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, status } : sub)))

      if (selectedSubmission?.id === id) {
        setSelectedSubmission((prev) => (prev ? { ...prev, status } : null))
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500"
      case "submitted":
        return "bg-yellow-500"
      case "notification_sent":
        return "bg-orange-500"
      case "emails_sent":
        return "bg-green-500"
      case "responded":
        return "bg-gray-500"
      default:
        return "bg-gray-400"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Contact Submissions</h1>
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Contact Submissions</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submissions List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">All Submissions ({submissions.length})</h2>

            {submissions.length === 0 ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center text-gray-400">No submissions yet.</CardContent>
              </Card>
            ) : (
              submissions.map((submission) => (
                <Card
                  key={submission.id}
                  className={`bg-gray-800 border-gray-700 cursor-pointer transition-colors ${
                    selectedSubmission?.id === submission.id ? "ring-2 ring-blue-500" : "hover:bg-gray-750"
                  }`}
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{submission.subject}</CardTitle>
                      <Badge className={`${getStatusColor(submission.status)} text-white`}>
                        {submission.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-400">
                      From: {submission.name} ({submission.email})
                    </div>
                    <div className="text-xs text-gray-500">{new Date(submission.created_at).toLocaleString()}</div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-300 line-clamp-2">{submission.message}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Submission Details */}
          <div className="sticky top-8">
            {selectedSubmission ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedSubmission.subject}</CardTitle>
                    <Select
                      value={selectedSubmission.status}
                      onValueChange={(value) => updateStatus(selectedSubmission.id, value)}
                    >
                      <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="notification_sent">Notification Sent</SelectItem>
                        <SelectItem value="emails_sent">Emails Sent</SelectItem>
                        <SelectItem value="responded">Responded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <p>
                      <strong>Name:</strong> {selectedSubmission.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedSubmission.email}
                    </p>
                    <p>
                      <strong>IP Address:</strong> {selectedSubmission.ip_address || "Unknown"}
                    </p>
                    <p>
                      <strong>Submitted:</strong> {new Date(selectedSubmission.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Message</h3>
                    <Textarea
                      value={selectedSubmission.message}
                      readOnly
                      className="bg-gray-700 border-gray-600 min-h-32"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        window.open(`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`)
                      }
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Reply via Email
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => updateStatus(selectedSubmission.id, "responded")}
                      className="border-gray-600 hover:bg-gray-700"
                    >
                      Mark as Responded
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center text-gray-400">Select a submission to view details</CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

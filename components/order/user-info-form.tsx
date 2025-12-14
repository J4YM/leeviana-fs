"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface UserInfoFormProps {
  user: any
  onComplete: (data: { fullName: string; phone: string }) => void
}

export default function UserInfoForm({ user, onComplete }: UserInfoFormProps) {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) {
      return
    }

    setLoading(true)
    try {
      // Update user profile
      const { error } = await supabase
        .from("user_profiles")
        .upsert({
          id: user.id,
          full_name: fullName.trim(),
          phone: phone.trim() || null,
        })

      if (error) throw error

      onComplete({ fullName: fullName.trim(), phone: phone.trim() })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      // Continue anyway
      onComplete({ fullName: fullName.trim(), phone: phone.trim() })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-accent-peach-light/20 border border-accent-peach/50 rounded-lg p-4 mb-4">
        <p className="text-sm font-semibold text-accent-peach mb-2">
          📝 First Time Ordering?
        </p>
        <p className="text-xs text-muted-foreground">
          Please provide your contact information to complete your order.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="full-name">Full Name *</Label>
        <Input
          id="full-name"
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+63 9XX XXX XXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading || !fullName.trim()}>
        {loading ? "Saving..." : "Continue"}
      </Button>
    </form>
  )
}


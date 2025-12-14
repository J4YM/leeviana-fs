"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function AdminLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const supabase = createBrowserClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setResendSuccess(false)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // Skip email confirmation check
          emailRedirectTo: undefined,
        },
      })

      if (signInError) {
        if (
          signInError.message.includes("Email not confirmed") ||
          signInError.message.includes("email_not_confirmed")
        ) {
          setError("Your email is not confirmed yet. However, you can still proceed if you have admin access set up.")

          // Try to proceed anyway if admin profile exists
          if (data?.user) {
            router.push("/admin/dashboard")
            router.refresh()
            return
          }
        } else {
          setError(signInError.message)
        }
        setLoading(false)
        return
      }

      // Check if user has admin access
      if (data.user) {
        const { data: adminProfile, error: profileError } = await supabase
          .from("admin_profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (profileError || !adminProfile) {
          await supabase.auth.signOut()
          setError("You do not have admin access. Please contact the administrator.")
          setLoading(false)
          return
        }

        // Redirect to dashboard
        router.push("/admin/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Please enter your email address first")
      return
    }

    setResending(true)
    setError("")
    setResendSuccess(false)

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email,
      })

      if (resendError) {
        setError(resendError.message)
      } else {
        setResendSuccess(true)
      }
    } catch (err) {
      setError("Failed to resend confirmation email")
    } finally {
      setResending(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {resendSuccess && (
        <Alert>
          <AlertDescription>Confirmation email sent! Please check your inbox.</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      {error && error.includes("email") && (
        <Button
          type="button"
          variant="outline"
          className="w-full bg-transparent"
          onClick={handleResendConfirmation}
          disabled={resending}
        >
          {resending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resending...
            </>
          ) : (
            "Resend Confirmation Email"
          )}
        </Button>
      )}
    </form>
  )
}

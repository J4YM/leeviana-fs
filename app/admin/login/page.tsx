"use client"

import type React from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        // If email not confirmed, check if user has admin profile
        if (
          signInError.message.toLowerCase().includes("email") &&
          (signInError.message.toLowerCase().includes("not confirmed") ||
            signInError.message.toLowerCase().includes("confirmation"))
        ) {
          // Try to sign in anyway and check admin profile
          setError("Checking admin access...")

          // If we have user data despite the error, check admin profile
          if (data?.user) {
            const { data: adminProfile } = await supabase
              .from("admin_profiles")
              .select("*")
              .eq("id", data.user.id)
              .single()

            if (adminProfile) {
              // Admin profile exists, proceed to dashboard
              router.push("/admin/dashboard")
              router.refresh()
              return
            }
          }

          setError("Email not confirmed. Please check your inbox or click 'Resend Confirmation Email'.")
          setIsLoading(false)
          return
        }

        throw signInError
      }

      // Check if user has admin access
      if (data?.user) {
        const { data: adminProfile, error: profileError } = await supabase
          .from("admin_profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (profileError || !adminProfile) {
          await supabase.auth.signOut()
          setError("You do not have admin access. Please contact the administrator.")
          setIsLoading(false)
          return
        }
      }

      router.push("/admin/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Please enter your email address first")
      return
    }

    const supabase = createClient()
    setIsResending(true)
    setError(null)
    setResendSuccess(false)

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      })

      if (error) throw error

      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 5000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to resend confirmation email")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-accent-peach-light/30 via-background to-accent-blush/20">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-accent-peach shadow-lg">
              <Image src="/apple-icon.jpg" alt="Leevienna FS" fill className="object-cover" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Leevienna FS Admin</h1>
            <p className="text-sm text-muted-foreground">Content Management System</p>
          </div>

          <Card className="border-accent-peach/20 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-serif">Admin Login</CardTitle>
              <CardDescription>Enter your credentials to access the dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-accent-peach/30 focus:border-accent-peach"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-accent-peach/30 focus:border-accent-peach"
                    />
                  </div>
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                      <p className="text-sm text-destructive">{error}</p>
                      {error.toLowerCase().includes("email not confirmed") && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleResendConfirmation}
                          disabled={isResending}
                          className="mt-2 w-full border-accent-peach/30 text-accent-peach hover:bg-accent-peach/10 bg-transparent"
                        >
                          {isResending ? "Sending..." : "Resend Confirmation Email"}
                        </Button>
                      )}
                    </div>
                  )}
                  {resendSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-700">Confirmation email sent! Please check your inbox.</p>
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-accent-peach hover:bg-accent-peach-deep text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/admin/signup" className="text-accent-peach hover:text-accent-peach-deep font-medium">
              Create admin account
            </Link>
          </p>
          <p className="text-xs text-center text-muted-foreground">
            Forgot your password? Contact support for assistance.
          </p>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { AdminSignUpForm } from "@/components/admin/admin-signup-form"

export const metadata: Metadata = {
  title: "Admin Sign Up | LeeViennaFS",
  description: "Create an admin account",
}

export default function AdminSignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-peach-50 via-pink-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Admin Account</h1>
            <p className="text-gray-600">Sign up to access the admin dashboard</p>
          </div>

          <AdminSignUpForm />

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/admin/login" className="text-peach-600 hover:text-peach-700 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

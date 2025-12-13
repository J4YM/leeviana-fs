"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function AdminHeader({ user }: { user: { email?: string } }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-accent-peach">
            <Image src="/apple-icon.jpg" alt="Leevienna FS" fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold text-foreground">Leevienna FS</h1>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-accent-peach/30 hover:bg-accent-peach hover:text-white bg-transparent"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}

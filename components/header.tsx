"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, User, LogOut, Settings } from "lucide-react"
import Image from "next/image"
import CartSidebar from "@/components/cart/cart-sidebar"
import { createClient } from "@/lib/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import AuthModal from "@/components/auth/auth-modal"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        setProfile(profileData)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getUser()
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    window.location.reload()
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="#" className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/logo.jpg"
                alt="Leevienna FS Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-2xl font-serif font-bold text-accent-peach">Leevienna FS</div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#home" className="text-sm text-foreground hover:text-accent-peach transition">
              Home
            </Link>
            <Link href="#flowers" className="text-sm text-foreground hover:text-accent-peach transition">
              Flowers
            </Link>
            <Link href="#keychains" className="text-sm text-foreground hover:text-accent-peach transition">
              Keychains
            </Link>
            <Link href="#process" className="text-sm text-foreground hover:text-accent-peach transition">
              Process
            </Link>
            <Link href="#locations" className="text-sm text-foreground hover:text-accent-peach transition">
              Locations
            </Link>
            <Link href="#contact" className="text-sm text-foreground hover:text-accent-peach transition">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <CartSidebar />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} />
                      <AvatarFallback>{getInitials(profile?.full_name || user.user_metadata?.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.full_name || user.user_metadata?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} variant="destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="hidden md:flex"
              >
                Sign In
              </Button>
            )}

            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {isOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link href="#home" className="text-sm text-foreground hover:text-accent-peach transition">
                Home
              </Link>
              <Link href="#flowers" className="text-sm text-foreground hover:text-accent-peach transition">
                Flowers
              </Link>
              <Link href="#keychains" className="text-sm text-foreground hover:text-accent-peach transition">
                Keychains
              </Link>
              <Link href="#process" className="text-sm text-foreground hover:text-accent-peach transition">
                Process
              </Link>
              <Link href="#locations" className="text-sm text-foreground hover:text-accent-peach transition">
                Locations
              </Link>
              <Link href="#contact" className="text-sm text-foreground hover:text-accent-peach transition">
                Contact
              </Link>
              {!user && (
                <Button variant="outline" onClick={() => setShowAuthModal(true)} className="mt-2">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} defaultTab="login" />
    </>
  )
}

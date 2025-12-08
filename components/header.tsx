"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
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

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
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
          </div>
        </div>
      )}
    </header>
  )
}

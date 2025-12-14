"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
  { name: "Orders", href: "/admin/orders", icon: "📦" },
  { name: "Chat", href: "/admin/chat", icon: "💬" },
  { name: "Flower Products", href: "/admin/flowers", icon: "🌸" },
  { name: "Flower Customization", href: "/admin/flower-customization", icon: "🎨" },
  { name: "Keychain Products", href: "/admin/keychains", icon: "🔑" },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-accent-peach-light/10 min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              pathname === item.href
                ? "bg-accent-peach text-white font-medium"
                : "hover:bg-accent-peach-light/30 text-foreground",
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

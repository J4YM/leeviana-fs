"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import ChatWidget from "@/components/chat/chat-widget"

export default function ConditionalChatWidget() {
  const pathname = usePathname()
  const [isAdminPage, setIsAdminPage] = useState(false)

  useEffect(() => {
    // Check if we're on an admin page
    setIsAdminPage(pathname?.startsWith("/admin") || false)
  }, [pathname])

  // Don't render chat widget on admin pages
  if (isAdminPage) {
    return null
  }

  return <ChatWidget />
}


"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { MessageCircle, X, Send, Image as ImageIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

interface ChatMessage {
  id: string
  room_id: string
  sender_id: string
  message: string
  image_url: string | null
  read_status: boolean
  created_at: string
  sender?: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentRoom, setCurrentRoom] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Listen for open-chat event
  useEffect(() => {
    const handleOpenChat = (event: CustomEvent) => {
      if (event.detail?.roomId) {
        setCurrentRoom(event.detail.roomId)
        setOpen(true)
      } else {
        setOpen(true)
      }
    }

    window.addEventListener("open-chat", handleOpenChat as EventListener)
    return () => window.removeEventListener("open-chat", handleOpenChat as EventListener)
  }, [])

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getUser()
    })

    return () => subscription.unsubscribe()
  }, [])

  // Get or create general chat room
  useEffect(() => {
    if (!user) return

    const getOrCreateRoom = async () => {
      if (currentRoom) return

      // Check for existing general room
      const { data: existingRoom } = await supabase
        .from("chat_rooms")
        .select("id")
        .eq("customer_id", user.id)
        .eq("room_type", "general")
        .single()

      if (existingRoom) {
        setCurrentRoom(existingRoom.id)
        return
      }

      // Create new general room
      const { data: newRoom, error } = await supabase
        .from("chat_rooms")
        .insert({
          customer_id: user.id,
          room_type: "general",
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating chat room:", error)
        return
      }

      setCurrentRoom(newRoom.id)
    }

    getOrCreateRoom()
  }, [user, currentRoom])

  // Load messages
  useEffect(() => {
    if (!currentRoom) return

    const loadMessages = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room_id", currentRoom)
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error loading messages:", error)
        setLoading(false)
        return
      }

      // Fetch sender profiles separately
      if (data && data.length > 0) {
        const senderIds = [...new Set(data.map((m) => m.sender_id))]
        const { data: profiles } = await supabase
          .from("user_profiles")
          .select("id, full_name, avatar_url")
          .in("id", senderIds)

        const messagesWithSenders = data.map((msg) => ({
          ...msg,
          sender: profiles?.find((p) => p.id === msg.sender_id),
        }))
        setMessages(messagesWithSenders)
      }

      if (error) {
        console.error("Error loading messages:", error)
        setLoading(false)
        return
      }
        // Mark messages as read
        const unreadIds = data?.filter((m) => !m.read_status && m.sender_id !== user?.id).map((m) => m.id) || []
        if (unreadIds.length > 0) {
          await supabase
            .from("chat_messages")
            .update({ read_status: true })
            .in("id", unreadIds)
        }
      }
      setLoading(false)
    }

    loadMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${currentRoom}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${currentRoom}`,
        },
        (payload) => {
          loadMessages()
          // Mark as read if it's not from current user
          if (payload.new.sender_id !== user?.id) {
            supabase
              .from("chat_messages")
              .update({ read_status: true })
              .eq("id", payload.new.id)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentRoom, user])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Get unread count
  useEffect(() => {
    if (!user || !currentRoom) return

    const getUnreadCount = async () => {
      const { count } = await supabase
        .from("chat_messages")
        .select("*", { count: "exact", head: true })
        .eq("room_id", currentRoom)
        .eq("read_status", false)
        .neq("sender_id", user.id)

      setUnreadCount(count || 0)
    }

    getUnreadCount()
    const interval = setInterval(getUnreadCount, 5000)
    return () => clearInterval(interval)
  }, [currentRoom, user, messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !currentRoom || !user || sending) return

    setSending(true)
    try {
      const { error } = await supabase.from("chat_messages").insert({
        room_id: currentRoom,
        sender_id: user.id,
        message: message.trim(),
      })

      if (error) throw error

      setMessage("")
    } catch (error: any) {
      toast.error(error.message || "Failed to send message")
    } finally {
      setSending(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentRoom || !user) return

    // Validate image
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB")
      return
    }

    setSending(true)
    try {
      // Upload to Supabase Storage (you'll need to set this up)
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("chat-images")
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from("chat-images").getPublicUrl(fileName)

      // Create message with image
      const { error } = await supabase.from("chat_messages").insert({
        room_id: currentRoom,
        sender_id: user.id,
        message: "",
        image_url: publicUrl,
      })

      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image")
    } finally {
      setSending(false)
      e.target.value = ""
    }
  }

  if (!user) {
    return null
  }

  return (
    <>
      {/* Chat Button */}
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-accent-peach-deep hover:bg-accent-peach-deep/90 shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-background border rounded-lg shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-accent-peach/10">
            <div>
              <h3 className="font-semibold">Chat Support</h3>
              <p className="text-xs text-muted-foreground">We're here to help!</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => {
                  const isOwn = msg.sender_id === user.id
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`flex flex-col max-w-[80%] ${isOwn ? "items-end" : "items-start"}`}>
                        {!isOwn && msg.sender && (
                          <span className="text-xs text-muted-foreground mb-1">
                            {msg.sender.full_name || "Admin"}
                          </span>
                        )}
                        <div
                          className={`rounded-lg p-3 ${
                            isOwn
                              ? "bg-accent-peach-deep text-white"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {msg.image_url && (
                            <div className="mb-2">
                              <Image
                                src={msg.image_url}
                                alt="Chat image"
                                width={200}
                                height={200}
                                className="rounded max-w-full h-auto"
                              />
                            </div>
                          )}
                          {msg.message && <p className="text-sm whitespace-pre-wrap">{msg.message}</p>}
                          <p className="text-xs opacity-70 mt-1">
                            {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={sending}
                />
                <Button type="button" variant="ghost" size="icon" disabled={sending}>
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </label>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                disabled={sending}
                className="flex-1"
              />
              <Button type="submit" disabled={sending || !message.trim()}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}


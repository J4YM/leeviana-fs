"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, MessageCircle, RefreshCw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import Image from "next/image"

interface ChatRoom {
  id: string
  order_id: string | null
  customer_id: string
  room_type: string
  last_message_at: string
  created_at: string
  customer?: {
    full_name: string | null
    email: string
  }
  order?: {
    order_number: string
  }
  unread_count?: number
}

interface ChatMessage {
  id: string
  room_id: string
  sender_id: string
  message: string
  image_url: string | null
  read_status: boolean
  created_at: string
  sender?: {
    full_name: string | null
    email: string
  }
}

export default function ChatPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/admin/login")
        return
      }
      
      // Check if user is admin
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()
      
      if (!profile?.is_admin) {
        toast.error("Unauthorized: Admin access required")
        router.push("/")
        return
      }
      
      setUser(user)
      loadRooms()
    }
    getUser()
  }, [])

  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id)
      subscribeToMessages(selectedRoom.id)
    }
  }, [selectedRoom])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadRooms = async () => {
    setLoading(true)
    try {
      // Filter out admin's own chat rooms and only show customer rooms
      // Also ensure we only get one room per customer (the general room)
      const { data, error } = await supabase
        .from("chat_rooms")
        .select("*")
        .neq("customer_id", user?.id || "") // Exclude admin's own rooms
        .order("last_message_at", { ascending: false })

      if (error) throw error

      // Fetch customer info and unread counts
      const roomsWithDetails = await Promise.all(
        (data || []).map(async (room) => {
          // Get customer profile
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("full_name")
            .eq("id", room.customer_id)
            .single()

          // Get user email from user_profiles (synced from auth.users)
          const { data: profileData } = await supabase
            .from("user_profiles")
            .select("email")
            .eq("id", room.customer_id)
            .single()
          
          const userEmail = profileData?.email || "N/A"

          // Get order info if order-specific
          let orderInfo = null
          if (room.order_id) {
            const { data: order } = await supabase
              .from("orders")
              .select("order_number")
              .eq("id", room.order_id)
              .single()
            orderInfo = order
          }

          // Get unread count
          const { count } = await supabase
            .from("chat_messages")
            .select("*", { count: "exact", head: true })
            .eq("room_id", room.id)
            .eq("read_status", false)
            .neq("sender_id", user?.id || "")

          return {
            ...room,
            customer: {
              full_name: profile?.full_name || null,
              email: profileData?.email || userEmail,
            },
            order: orderInfo,
            unread_count: count || 0,
          }
        })
      )

      setRooms(roomsWithDetails)
    } catch (error: any) {
      toast.error(error.message || "Failed to load chat rooms")
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true })

      if (error) throw error

      // Fetch sender profiles
      if (data && data.length > 0) {
        const senderIds = [...new Set(data.map((m) => m.sender_id))]
        const { data: profiles } = await supabase
          .from("user_profiles")
          .select("id, full_name")
          .in("id", senderIds)

        // Get sender emails - using workaround
        const messagesWithSenders = data.map((msg) => {
          const profile = profiles?.find((p) => p.id === msg.sender_id)
          return {
            ...msg,
            sender: {
              full_name: profile?.full_name || null,
              email: msg.sender_id === user?.id ? user.email : "customer@example.com",
            },
          }
        })

        setMessages(messagesWithSenders)

        // Mark messages as read
        const unreadIds = data.filter((m) => !m.read_status && m.sender_id !== user?.id).map((m) => m.id)
        if (unreadIds.length > 0) {
          await supabase
            .from("chat_messages")
            .update({ read_status: true })
            .in("id", unreadIds)
        }
      } else {
        setMessages([])
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load messages")
    }
  }

  const subscribeToMessages = (roomId: string) => {
    const channel = supabase
      .channel(`admin-chat:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          loadMessages(roomId)
          loadRooms() // Refresh unread counts
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !selectedRoom || !user || sending) return

    setSending(true)
    try {
      const { error } = await supabase.from("chat_messages").insert({
        room_id: selectedRoom.id,
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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={user} />
      <div className="flex h-[calc(100vh-4rem)]">
        <AdminSidebar />
        <div className="flex-1 flex">
          {/* Chat Rooms Sidebar */}
          <div className="w-80 border-r bg-accent-peach-light/5">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Conversations</h3>
              <Button onClick={loadRooms} variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : rooms.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">No conversations</div>
              ) : (
                <div className="p-2 space-y-1">
                  {rooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedRoom?.id === room.id
                          ? "bg-accent-peach text-white"
                          : "hover:bg-accent-peach-light/20"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {room.customer?.full_name || room.customer?.email || "Customer"}
                          </div>
                          {room.order && (
                            <div className="text-xs opacity-80">Order: {room.order.order_number}</div>
                          )}
                          <div className="text-xs opacity-70 mt-1">
                            {formatDistanceToNow(new Date(room.last_message_at), { addSuffix: true })}
                          </div>
                        </div>
                        {room.unread_count && room.unread_count > 0 && (
                          <Badge className="bg-destructive text-destructive-foreground">
                            {room.unread_count}
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedRoom ? (
              <>
                <div className="p-4 border-b bg-accent-peach-light/10">
                  <div>
                    <h3 className="font-semibold">
                      {selectedRoom.customer?.full_name || selectedRoom.customer?.email || "Customer"}
                    </h3>
                    {selectedRoom.order && (
                      <p className="text-sm text-muted-foreground">
                        Order: {selectedRoom.order.order_number}
                      </p>
                    )}
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => {
                        const isAdmin = msg.sender_id === user.id
                        return (
                          <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                            <div className={`flex flex-col max-w-[80%] ${isAdmin ? "items-end" : "items-start"}`}>
                              {!isAdmin && (
                                <span className="text-xs text-muted-foreground mb-1">
                                  {msg.sender?.full_name || msg.sender?.email || "Customer"}
                                </span>
                              )}
                              <div
                                className={`rounded-lg p-3 ${
                                  isAdmin
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

                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex gap-2">
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
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

